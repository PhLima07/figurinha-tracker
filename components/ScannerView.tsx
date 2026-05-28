import { useState, useRef, useEffect, useCallback } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { updateProfile, type DbProfile } from '@/lib/supabase'
import { parseCodesFromText, TEAMS, type Sticker, type CollectionMap } from '@/lib/data'

type ScanMode = 'camera'|'manual'|'upload'|'lista'|'verificar'
type CamMode  = 'costas'|'pagina'

interface VerifyIssue { slotCode?: string; description: string }
interface VerifyResponse { pageTeam: string|null; teamName: string|null; teamFlag: string|null; issues: VerifyIssue[]; error?: string }

async function stripExif(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const img = new Image(); const url = URL.createObjectURL(file)
    img.onload = () => {
      const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight
      c.getContext('2d')!.drawImage(img,0,0); URL.revokeObjectURL(url)
      res(c.toDataURL('image/jpeg',.85).split(',')[1])
    }
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Falha ao carregar')) }
    img.src = url
  })
}

async function analyze(b64: string): Promise<string[]> {
  const r = await fetch('/api/analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({image:b64}) })
  if (!r.ok) { const e=await r.json().catch(()=>({error:'Erro'})); throw new Error(e.error??'Falha') }
  return ((await r.json()) as {found:string[]}).found
}

interface Props { profile:DbProfile; collection:CollectionMap; allStickers:Sticker[]; onAdd:(ids:string[])=>Promise<void>; onProfileUpdate:(p:DbProfile)=>void }

export default function ScannerView({ profile, collection, allStickers, onAdd, onProfileUpdate }: Props) {
  const user = useUser()
  const [mode,         setMode]        = useState<ScanMode>('camera')
  const [camMode,      setCamMode]     = useState<CamMode>('costas')
  const [camActive,    setCamActive]   = useState(false)
  const [camError,     setCamError]    = useState('')
  const [scanning,     setScanning]    = useState(false)
  const [processing,   setProcessing]  = useState(false)
  const [results,      setResults]     = useState<{found:string[];error?:string}|null>(null)
  const [saving,       setSaving]      = useState(false)
  const [manual,       setManual]      = useState('')
  const [lista,        setLista]       = useState('')
  const [verifyResult, setVerifyResult]= useState<VerifyResponse|null>(null)
  const [verifying,    setVerifying]   = useState(false)
  const videoRef      = useRef<HTMLVideoElement>(null)
  const streamRef     = useRef<MediaStream|null>(null)
  const fileRef       = useRef<HTMLInputElement>(null)
  const verifyFileRef = useRef<HTMLInputElement>(null)

  const validIds    = new Set(allStickers.map(s=>s.id))
  const stickerById = Object.fromEntries(allStickers.map(s=>[s.id,s]))
  const teamById    = Object.fromEntries(TEAMS.map(t=>[t.id,t]))
  const scanLeft    = Math.max(0,(profile.scan_limit??50)-(profile.scan_count??0))
  const scanPct     = Math.round(scanLeft/(profile.scan_limit??50)*100)

  const stopCam = useCallback(() => { streamRef.current?.getTracks().forEach(t=>t.stop()); streamRef.current=null; setCamActive(false) }, [])
  const startCam = useCallback(async () => {
    setCamError('')
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment', width:{ideal:1280}, height:{ideal:720} } })
      streamRef.current=s
      if(videoRef.current) { videoRef.current.srcObject=s; await videoRef.current.play().catch(()=>{}) }
      setCamActive(true)
    } catch { setCamError('Câmera não disponível. Use outro modo abaixo.') }
  }, [])

  useEffect(() => { if(mode==='camera') startCam(); else stopCam(); return stopCam }, [mode, startCam, stopCam])

  function switchMode(m: ScanMode) { setMode(m); setResults(null); setVerifyResult(null) }

  async function handleCapture() {
    if(!videoRef.current||scanning||!camActive) return
    if(scanLeft<=0) { setResults({found:[],error:'Limite de escaneamentos atingido.'}); return }
    setScanning(true); setResults(null)
    try {
      const c=document.createElement('canvas'); c.width=videoRef.current.videoWidth||640; c.height=videoRef.current.videoHeight||480
      c.getContext('2d')!.drawImage(videoRef.current,0,0)
      const b64=c.toDataURL('image/jpeg',.85).split(',')[1]
      const found=await analyze(b64)
      setResults({found,error:found.length===0?'Nenhuma figurinha identificada. Tente mais perto ou com melhor iluminação.':undefined})
      if(found.length>0) {
        navigator.vibrate?.(80)
        if(user) { const nc=(profile.scan_count??0)+1; await updateProfile(user.id,{scan_count:nc}); onProfileUpdate({...profile,scan_count:nc}) }
      }
    } catch(e:unknown) { setResults({found:[],error:e instanceof Error?e.message:'Erro ao processar.'}) }
    setScanning(false)
  }

  async function handleFile(file:File) {
    setProcessing(true); setResults(null)
    try { const b64=await stripExif(file); const found=await analyze(b64); setResults({found,error:found.length===0?'Nenhum código encontrado.':undefined}) }
    catch { setResults({found:[],error:'Erro ao processar. Tente novamente.'}) }
    setProcessing(false)
  }

  function handleManual() {
    const code=manual.trim().toUpperCase().replace(/\s/g,'')
    if(!code) return
    if(!validIds.has(code)) { setResults({found:[],error:`Código "${code}" não encontrado. Formato: BRA-07, FWC-01`}); return }
    setResults({found:[code]}); setManual('')
  }

  function handleLista() {
    const codes=parseCodesFromText(lista,validIds)
    if(!codes.length) { setResults({found:[],error:'Nenhum código válido. Use: BRA-01, ARG-07, FRA-15'}); return }
    setResults({found:codes})
  }

  async function handleVerifyFile(file: File) {
    setVerifying(true); setVerifyResult(null)
    try {
      const b64 = await stripExif(file)
      const r = await fetch('/api/verify-page', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({image:b64}) })
      if (!r.ok) { const e=await r.json().catch(()=>({error:'Erro'})); throw new Error(e.error??'Falha') }
      setVerifyResult(await r.json() as VerifyResponse)
    } catch(e:unknown) { setVerifyResult({pageTeam:null,teamName:null,teamFlag:null,issues:[],error:e instanceof Error?e.message:'Erro ao verificar.'}) }
    setVerifying(false)
  }

  async function handleConfirm() {
    if(!results?.found?.length) return
    setSaving(true); await onAdd(results.found); setResults(null); setLista(''); setSaving(false)
  }

  const MODES=[
    {id:'camera'   as ScanMode,icon:'📷',label:'Câmera'},
    {id:'manual'   as ScanMode,icon:'⌨️',label:'Manual'},
    {id:'upload'   as ScanMode,icon:'🖼️',label:'Imagem'},
    {id:'lista'    as ScanMode,icon:'📝',label:'Lista'},
    {id:'verificar'as ScanMode,icon:'🔍',label:'Verificar'},
  ]

  return (
    <div style={{paddingBottom:'7rem'}}>
      <div style={{padding:'1.25rem 1rem 0'}}>
        <h1 style={{fontFamily:'Oswald',fontSize:'1.875rem',fontWeight:700,color:'#f0f8ff',marginBottom:'.5rem'}}>Escanear</h1>
        <div style={{display:'flex',alignItems:'center',gap:'.625rem',marginBottom:'.75rem'}}>
          <div className="progress-bar" style={{flex:1}} aria-label={`${scanLeft} scans restantes`}>
            <div className="progress-fill" style={{width:`${scanPct}%`,background:scanLeft>15?undefined:'linear-gradient(90deg,#ff9500,#ff4757)'}}/>
          </div>
          <span style={{fontSize:'.75rem',fontWeight:500,color:scanLeft>15?'#6b93b8':'#ff9500',flexShrink:0}}>{scanLeft}/{profile.scan_limit??50} scans</span>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'.375rem',padding:'.75rem 1rem'}}>
        {MODES.map(m => (
          <button key={m.id} onClick={()=>switchMode(m.id)} aria-pressed={mode===m.id} aria-label={`Modo: ${m.label}`}
            style={{padding:'.5rem .25rem',borderRadius:'1rem',display:'flex',flexDirection:'column',alignItems:'center',gap:'.25rem',border:`2px solid ${mode===m.id?'#00c850':'#1e3a5a'}`,cursor:'pointer',fontSize:'.6875rem',fontWeight:600,
              background:mode===m.id?'linear-gradient(135deg,#00c850,#009640)':'#0d1f33',color:mode===m.id?'#060d1a':'#6b93b8'}}>
            <span style={{fontSize:'1.125rem'}} aria-hidden="true">{m.icon}</span>{m.label}
          </button>
        ))}
      </div>

      <div style={{padding:'0 1rem'}}>
        {mode==='camera' && (
          <div>
            <div style={{display:'flex',background:'#060d1a',borderRadius:'.75rem',padding:'.25rem',gap:'.25rem',marginBottom:'.75rem'}}>
              {([['costas','📄 Verso das figurinhas'],['pagina','📖 Página do álbum']] as const).map(([cm,label])=>(
                <button key={cm} onClick={()=>setCamMode(cm)} aria-pressed={camMode===cm}
                  style={{flex:1,padding:'.5rem',borderRadius:'.5rem',border:'none',cursor:'pointer',fontSize:'.75rem',fontWeight:600,background:camMode===cm?'#1e3a5a':'transparent',color:camMode===cm?'#00c850':'#3a5a7a'}}>
                  {label}
                </button>
              ))}
            </div>

            {camError ? (
              <div className="card" style={{padding:'1.5rem',textAlign:'center',borderColor:'rgba(255,71,87,.25)'}}>
                <div style={{fontSize:'2.5rem',marginBottom:'.75rem'}} aria-hidden="true">📷</div>
                <p style={{color:'#ff8090',fontSize:'.875rem',lineHeight:1.6,marginBottom:'1rem'}}>{camError}</p>
                <button onClick={startCam} style={{padding:'.5rem 1.25rem',background:'#ff4757',color:'white',borderRadius:'.75rem',border:'none',cursor:'pointer',fontWeight:600,fontSize:'.875rem'}}>Tentar novamente</button>
              </div>
            ) : (
              <div style={{borderRadius:'1rem',overflow:'hidden',position:'relative',aspectRatio:'4/3',background:'#0a1a2a'}}>
                <video ref={videoRef} autoPlay playsInline muted style={{width:'100%',height:'100%',objectFit:'cover'}} aria-label="Câmera"/>
                {camActive && !scanning && <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#00c850,transparent)',boxShadow:'0 0 8px #00c850',animation:'scanLine 2.5s ease-in-out infinite'}} aria-hidden="true"/>}
                {['tl','tr','bl','br'].map(p=>(
                  <div key={p} aria-hidden="true" style={{position:'absolute',width:24,height:24,borderColor:'#00c850',borderTopWidth:p.startsWith('t')?3:0,borderBottomWidth:p.startsWith('b')?3:0,borderLeftWidth:p.endsWith('l')?3:0,borderRightWidth:p.endsWith('r')?3:0,borderStyle:'solid',top:p.startsWith('t')?14:'auto',bottom:p.startsWith('b')?14:'auto',left:p.endsWith('l')?14:'auto',right:p.endsWith('r')?14:'auto'}}/>
                ))}
                {scanning && <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,200,80,.05)'}}>
                  <div style={{background:'rgba(6,13,26,.9)',padding:'.625rem 1.25rem',borderRadius:'1rem',color:'#00c850',fontSize:'.875rem',fontWeight:600,display:'flex',gap:'.5rem',alignItems:'center'}}>
                    <span className="animate-spin" style={{display:'inline-block',width:16,height:16,border:'2px solid rgba(0,200,80,.3)',borderTopColor:'#00c850',borderRadius:'50%'}} aria-hidden="true"/>Analisando...
                  </div>
                </div>}
              </div>
            )}

            <p style={{color:'#3a5a7a',fontSize:'.75rem',textAlign:'center',margin:'.5rem 0'}}>{camMode==='costas'?'Aponte para o verso das figurinhas':'Fotografe a página completa do álbum'}</p>
            <button onClick={handleCapture} disabled={scanning||!camActive} aria-label="Fotografar e analisar" className="btn-primary" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.75rem'}}>
              {scanning?<><span className="animate-spin" style={{width:20,height:20,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block'}} aria-hidden="true"/>ANALISANDO...</>:'📸  FOTOGRAFAR'}
            </button>
          </div>
        )}

        {mode==='manual' && (
          <div className="card" style={{padding:'1.25rem'}}>
            <p style={{color:'#6b93b8',fontSize:'.875rem',lineHeight:1.6,marginBottom:'1rem'}}>Digite o código do verso.<br/><span style={{color:'#00c850',fontFamily:'monospace'}}>BRA-07 · ARG-03 · FWC-01</span></p>
            <label htmlFor="manual-input" style={{display:'block',color:'#6b93b8',fontSize:'.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'.5rem'}}>Código da figurinha</label>
            <input id="manual-input" className="ft-input" style={{textAlign:'center',fontFamily:'monospace',fontSize:'1.5rem',letterSpacing:'.1em',fontWeight:700,marginBottom:'.75rem'}}
              value={manual} onChange={e=>setManual(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&handleManual()} maxLength={8} placeholder="BRA-07" aria-required="true"/>
            <button onClick={handleManual} className="btn-primary" aria-label="Adicionar figurinha">➕  ADICIONAR</button>
          </div>
        )}

        {mode==='upload' && (
          <div className="card" style={{padding:'2rem',textAlign:'center',borderStyle:'dashed'}}>
            <div style={{fontSize:'3rem',marginBottom:'.75rem'}} aria-hidden="true">🖼️</div>
            <p style={{color:'#f0f8ff',fontWeight:600,marginBottom:'.25rem'}}>Enviar imagem</p>
            <p style={{color:'#6b93b8',fontSize:'.875rem',lineHeight:1.6,marginBottom:'1.25rem'}}>Foto do verso ou de uma página do álbum.<br/>Imagem descartada após análise.</p>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])} aria-label="Selecionar imagem"/>
            <button onClick={()=>fileRef.current?.click()} disabled={processing} aria-label="Escolher imagem" className="btn-primary" style={{width:'auto',padding:'.875rem 2rem',margin:'0 auto',display:'flex',gap:'.5rem',alignItems:'center'}}>
              {processing?<><span className="animate-spin" style={{width:16,height:16,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block'}} aria-hidden="true"/>Analisando...</>:'📁  ESCOLHER IMAGEM'}
            </button>
          </div>
        )}

        {mode==='lista' && (
          <div className="card" style={{padding:'1.25rem'}}>
            <label htmlFor="lista-input" style={{display:'block',color:'#6b93b8',fontSize:'.875rem',lineHeight:1.6,marginBottom:'.75rem'}}>Cole os códigos separados por vírgula, espaço ou Enter:</label>
            <textarea id="lista-input" className="ft-input" rows={6} value={lista} onChange={e=>setLista(e.target.value)} placeholder={'BRA-01, BRA-03, ARG-07\nFRA-15, ESP-04, FWC-01'} style={{marginBottom:'.75rem',resize:'vertical'}} aria-label="Lista de códigos"/>
            <button onClick={handleLista} className="btn-primary" aria-label="Importar lista">📥  IMPORTAR LISTA</button>
          </div>
        )}

        {mode==='verificar' && (
          <div>
            <div className="card" style={{padding:'1.25rem',marginBottom:'1rem',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'.5rem'}} aria-hidden="true">📖</div>
              <p style={{color:'#f0f8ff',fontWeight:600,marginBottom:'.25rem'}}>Verificar Página do Álbum</p>
              <p style={{color:'#6b93b8',fontSize:'.875rem',lineHeight:1.6}}>Fotografe uma página do álbum para detectar figurinhas de outra seleção coladas no lugar errado.</p>
            </div>

            <input ref={verifyFileRef} type="file" accept="image/*" capture="environment" style={{display:'none'}}
              onChange={e=>{ if(e.target.files?.[0]) { handleVerifyFile(e.target.files[0]); e.target.value='' } }} aria-label="Fotografar página do álbum"/>
            <button onClick={()=>verifyFileRef.current?.click()} disabled={verifying} className="btn-primary"
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.75rem',marginBottom:'1rem'}} aria-label="Fotografar ou selecionar página do álbum">
              {verifying
                ?<><span className="animate-spin" style={{width:20,height:20,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white',borderRadius:'50%',display:'inline-block'}} aria-hidden="true"/>VERIFICANDO...</>
                :'📸  FOTOGRAFAR PÁGINA'}
            </button>

            {verifyResult && (
              <div className="animate-slide-up">
                {verifyResult.error ? (
                  <div className="card" style={{padding:'1.25rem',textAlign:'center',borderColor:'rgba(255,149,0,.5)',background:'#2a1800'}}>
                    <div style={{fontSize:'2rem',marginBottom:'.5rem'}} aria-hidden="true">⚠️</div>
                    <p style={{color:'#ff9500',fontSize:'.875rem',lineHeight:1.6}} role="alert">{verifyResult.error}</p>
                  </div>
                ) : (
                  <div>
                    {verifyResult.pageTeam ? (
                      <div className="card" style={{padding:'.875rem 1rem',marginBottom:'.75rem',display:'flex',alignItems:'center',gap:'.75rem'}}>
                        <span style={{fontSize:'1.75rem'}} aria-hidden="true">{verifyResult.teamFlag}</span>
                        <div>
                          <div style={{color:'#f0f8ff',fontWeight:600,fontSize:'.9375rem'}}>{verifyResult.teamName}</div>
                          <div style={{color:'#3a5a7a',fontSize:'.75rem'}}>Seleção identificada</div>
                        </div>
                      </div>
                    ) : (
                      <div className="card" style={{padding:'.875rem 1rem',marginBottom:'.75rem',borderColor:'rgba(255,149,0,.35)'}}>
                        <p style={{color:'#ff9500',fontSize:'.875rem'}} role="status">Seleção não identificada — tente com melhor iluminação ou enquadramento.</p>
                      </div>
                    )}

                    {verifyResult.issues.length === 0 ? (
                      <div className="card" style={{padding:'1.5rem',textAlign:'center',borderColor:'rgba(0,200,80,.35)',background:'#092a16'}}>
                        <div style={{fontSize:'2.5rem',marginBottom:'.5rem'}} aria-hidden="true">✅</div>
                        <p style={{color:'#00c850',fontWeight:700,fontSize:'1rem'}} role="status">Tudo no lugar!</p>
                        <p style={{color:'#3a5a7a',fontSize:'.8125rem',marginTop:'.25rem'}}>Nenhuma figurinha fora da seleção detectada.</p>
                      </div>
                    ) : (
                      <div>
                        <p style={{fontFamily:'Oswald',fontSize:'1.125rem',fontWeight:700,color:'#ff9500',marginBottom:'.625rem'}} aria-live="polite">
                          {verifyResult.issues.length} problema{verifyResult.issues.length!==1?'s':''} encontrado{verifyResult.issues.length!==1?'s':''}
                        </p>
                        <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
                          {verifyResult.issues.map((issue, i) => (
                            <div key={i} className="card animate-pop" style={{padding:'.875rem 1rem',borderColor:'rgba(255,149,0,.5)',background:'#1a0e00',animationDelay:`${i*.05}s`}}>
                              <div style={{display:'flex',alignItems:'center',gap:'.625rem',marginBottom:'.375rem'}}>
                                <span style={{fontSize:'1.25rem'}} aria-hidden="true">⚠️</span>
                                {issue.slotCode && (
                                  <span style={{fontFamily:'monospace',fontSize:'.875rem',fontWeight:700,color:'#ff9500',background:'#2a1800',padding:'.125rem .5rem',borderRadius:'.375rem',border:'1px solid #4a2e00'}}>{issue.slotCode}</span>
                                )}
                              </div>
                              <p style={{color:'#f0c080',fontSize:'.8125rem',lineHeight:1.5,margin:0}}>{issue.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Resultados do scanner (exceto verificar) */}
        {results && mode !== 'verificar' && (
          <div style={{marginTop:'1rem'}} className="animate-slide-up">
            {results.error ? (
              <div className="card" style={{padding:'1.25rem',textAlign:'center',borderColor:'rgba(255,149,0,.5)',background:'#2a1800'}}>
                <div style={{fontSize:'2.5rem',marginBottom:'.5rem'}} aria-hidden="true">🔍</div>
                <p style={{color:'#ff9500',fontSize:'.875rem',lineHeight:1.6}} role="alert">{results.error}</p>
              </div>
            ) : (
              <div>
                <p style={{fontFamily:'Oswald',fontSize:'1.25rem',fontWeight:700,color:'#f0f8ff',marginBottom:'.75rem'}} aria-live="polite">{results.found.length} figurinha{results.found.length!==1?'s':''} encontrada{results.found.length!==1?'s':''}! 🎉</p>
                <div style={{display:'flex',flexDirection:'column',gap:'.5rem',marginBottom:'1rem'}}>
                  {results.found.map((id,i)=>{
                    const sticker=stickerById[id]; const team=teamById[sticker?.teamId]; const isNew=!collection[id]
                    return(
                      <div key={id} className="card animate-pop" style={{padding:'.75rem 1rem',display:'flex',alignItems:'center',gap:.75*16,animationDelay:`${i*.05}s`,borderColor:isNew?'rgba(0,200,80,.35)':'rgba(255,149,0,.35)'}}>
                        <span style={{fontSize:'1.5rem',flexShrink:0}} aria-hidden="true">{team?.flag??'⭐'}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{color:'#f0f8ff',fontSize:'.875rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sticker?.name??id}{sticker?.isSpecial?' ✨':''}</div>
                          <div style={{color:'#3a5a7a',fontSize:'.75rem'}}>{id} · {team?.name??'Especial'}</div>
                        </div>
                        <span className="status-badge" style={{background:isNew?'#092a16':'#2a1800',color:isNew?'#00c850':'#ff9500',border:`1px solid ${isNew?'#1a4a2a':'#4a2e00'}`,flexShrink:0}} aria-label={isNew?'Nova':'Repetida'}>{isNew?'✅ Nova!':'🔄 Repetida'}</span>
                      </div>
                    )
                  })}
                </div>
                <button onClick={handleConfirm} disabled={saving} aria-label={`Salvar ${results.found.length} figurinhas`} className="btn-primary" style={{background:'linear-gradient(135deg,#00c850,#ffd60a)',color:'#060d1a',display:'flex',alignItems:'center',justifyContent:'center',gap:'.5rem'}}>
                  {saving?<><span className="animate-spin" style={{width:20,height:20,border:'2px solid rgba(0,0,0,.2)',borderTopColor:'#060d1a',borderRadius:'50%',display:'inline-block'}} aria-hidden="true"/>Salvando...</>:`💾  SALVAR ${results.found.length} FIGURINHA${results.found.length!==1?'S':''}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
