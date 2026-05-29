import { useState, useMemo } from 'react'
import { TEAMS, calcStats, getStickerStatus, STATUS_CONFIG, type Sticker, type CollectionMap, type Team, type StickerStatus } from '@/lib/data'

const ST_FILTERS: {id:'all'|StickerStatus;label:string}[] = [
  {id:'all',      label:'Todas'},
  {id:'colada',   label:'Coladas'},
  {id:'tenho',    label:'Tenho'},
  {id:'repetida', label:'Repetidas'},
  {id:'faltando', label:'Faltando'},
]
const PAGE_SIZE = 100

interface Props { collection:CollectionMap; allStickers:Sticker[]; teamById:Record<string,Team>; onToggle:(id:string)=>Promise<void> }

function SvgIcon({ svg, size=14 }: { svg:string; size?:number }) {
  return <span style={{width:size,height:size,display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}} aria-hidden="true" dangerouslySetInnerHTML={{__html:svg}}/>
}

export default function CollectionView({ collection, allStickers, teamById, onToggle }: Props) {
  const [search,    setSearch]    = useState('')
  const [filterSt,  setFilterSt]  = useState<'all'|StickerStatus>('all')
  const [filterTm,  setFilterTm]  = useState('all')
  const [view,      setView]      = useState<'grid'|'lista'>('grid')
  const [gridCols,  setGridCols]  = useState<3|5>(5)
  const [page,      setPage]      = useState(1)
  const [shareText, setShareText] = useState<string|null>(null)
  const [copied,    setCopied]    = useState(false)

  const stats = useMemo(() => calcStats(allStickers, collection), [allStickers, collection])

  const filtered = useMemo(() => {
    const q = search.toUpperCase().trim()
    return allStickers.filter(s => {
      const team = teamById[s.teamId]; const status = getStickerStatus(s.id, collection)
      return (!q || s.id.includes(q) || s.name.toUpperCase().includes(q) || (team?.name ?? '').toUpperCase().includes(q)) &&
        (filterSt === 'all' || status === filterSt) && (filterTm === 'all' || s.teamId === filterTm)
    })
  }, [search, filterSt, filterTm, allStickers, collection, teamById])

  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page])

  function openWhatsApp() {
    const repeated = allStickers.filter(s => collection[s.id] && !collection[s.id].pasted && collection[s.id].quantity > 1)
    if (!repeated.length) {
      setShareText('Não tenho figurinhas repetidas no momento!')
      return
    }
    const lines = repeated.map(s => {
      const team = teamById[s.teamId]
      const qty  = collection[s.id].quantity
      return `${team?.flag ?? '⭐'} ${s.id} – ${s.name} (×${qty})`
    })
    setShareText(`📦 Minhas figurinhas repetidas (Copa 2026):\n\n${lines.join('\n')}\n\nQuem quer trocar? Me chama! 🤝`)
  }

  async function copyShare() {
    if (!shareText) return
    try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  return (
    <div style={{paddingBottom:'7rem'}}>
      <div style={{padding:'1.25rem 1rem'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.75rem'}}>
          <h1 style={{fontFamily:'Oswald',fontSize:'1.875rem',fontWeight:700,color:'#f0f8ff',margin:0}}>Coleção</h1>
          <button onClick={openWhatsApp} aria-label="Gerar lista de repetidas para WhatsApp"
            style={{display:'flex',alignItems:'center',gap:'.375rem',padding:'.5rem .875rem',borderRadius:'.75rem',border:'1px solid #1e3a5a',background:'#0d1f33',color:'#6b93b8',cursor:'pointer',fontSize:'.75rem',fontWeight:600}}>
            💬 Repetidas
          </button>
        </div>

        {/* Barra de progresso geral */}
        <div style={{marginBottom:'1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.25rem'}}>
            <span style={{color:'#6b93b8',fontSize:'.75rem'}}>Progresso geral</span>
            <span style={{color:'#ffd60a',fontSize:'.75rem',fontWeight:700}}>{stats.pct}% ({stats.pasted}/{allStickers.length})</span>
          </div>
          <div style={{height:6,borderRadius:999,background:'#1e3a5a',overflow:'hidden'}} role="progressbar" aria-valuenow={stats.pct} aria-valuemin={0} aria-valuemax={100}>
            <div style={{height:'100%',borderRadius:999,background:'linear-gradient(90deg,#00c850,#ffd60a)',width:`${stats.pct}%`,transition:'width .4s ease'}}/>
          </div>
        </div>

        <div style={{position:'relative',marginBottom:'.75rem'}}>
          <span style={{position:'absolute',left:'.875rem',top:'50%',transform:'translateY(-50%)',fontSize:'.875rem',pointerEvents:'none'}} aria-hidden="true">🔍</span>
          <input className="ft-input" style={{paddingLeft:'2.5rem'}} value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Buscar figurinha, jogador ou seleção..." aria-label="Buscar"/>
        </div>

        <div style={{display:'flex',gap:'.5rem',overflowX:'auto',paddingBottom:'.5rem',marginBottom:'.75rem'}} className="no-scrollbar" role="group" aria-label="Filtrar por status">
          {ST_FILTERS.map(f=>{
            const cfg = f.id !== 'all' ? STATUS_CONFIG[f.id] : null
            return (
              <button key={f.id} onClick={()=>{setFilterSt(f.id);setPage(1)}} aria-pressed={filterSt===f.id}
                style={{padding:'.375rem .875rem',borderRadius:999,fontSize:'.75rem',fontWeight:600,whiteSpace:'nowrap',flexShrink:0,display:'flex',alignItems:'center',gap:'.375rem',border:`1px solid ${filterSt===f.id?'#00c850':'#1e3a5a'}`,background:filterSt===f.id?'#00c850':'#0d1f33',color:filterSt===f.id?'#060d1a':'#6b93b8',cursor:'pointer'}}>
                {cfg && <SvgIcon svg={cfg.svg} size={12}/>}
                {f.label}
              </button>
            )
          })}
        </div>

        <div style={{display:'flex',gap:'.625rem',marginBottom:'.75rem'}}>
          <select className="ft-input" style={{flex:1,padding:'.625rem 1rem',fontSize:'.875rem'}} value={filterTm} onChange={e=>{setFilterTm(e.target.value);setPage(1)}} aria-label="Filtrar por seleção">
            <option value="all">🌍 Todas as seleções</option>
            <option value="FWC">⭐ Especiais Copa 2026</option>
            {TEAMS.map(t=><option key={t.id} value={t.id}>{t.flag} {t.name}</option>)}
          </select>
          <div style={{display:'flex',border:'1px solid #1e3a5a',borderRadius:'.75rem',overflow:'hidden',flexShrink:0}}>
            <button onClick={()=>setView('grid')} aria-pressed={view==='grid'} aria-label="Visualizar em grade"
              style={{padding:'.5rem .75rem',fontSize:'1rem',background:view==='grid'?'#00c850':'#0d1f33',color:view==='grid'?'#060d1a':'#6b93b8',border:'none',cursor:'pointer'}}>⊞</button>
            <button onClick={()=>setView('lista')} aria-pressed={view==='lista'} aria-label="Visualizar em lista"
              style={{padding:'.5rem .75rem',fontSize:'1rem',background:view==='lista'?'#00c850':'#0d1f33',color:view==='lista'?'#060d1a':'#6b93b8',border:'none',cursor:'pointer'}}>☰</button>
          </div>
          {view==='grid' && (
            <div style={{display:'flex',border:'1px solid #1e3a5a',borderRadius:'.75rem',overflow:'hidden',flexShrink:0}}>
              <button onClick={()=>setGridCols(5)} aria-pressed={gridCols===5} aria-label="5 colunas"
                style={{padding:'.5rem .625rem',fontSize:'.6875rem',fontWeight:700,background:gridCols===5?'#00c850':'#0d1f33',color:gridCols===5?'#060d1a':'#6b93b8',border:'none',cursor:'pointer'}}>5</button>
              <button onClick={()=>setGridCols(3)} aria-pressed={gridCols===3} aria-label="3 colunas"
                style={{padding:'.5rem .625rem',fontSize:'.6875rem',fontWeight:700,background:gridCols===3?'#00c850':'#0d1f33',color:gridCols===3?'#060d1a':'#6b93b8',border:'none',cursor:'pointer'}}>3</button>
            </div>
          )}
        </div>

        <p style={{color:'#3a5a7a',fontSize:'.75rem',marginBottom:'.75rem'}} aria-live="polite">{filtered.length} figurinha{filtered.length!==1?'s':''}</p>
      </div>

      {view==='grid' && (
        <div style={{display:'grid',gridTemplateColumns:`repeat(${gridCols},1fr)`,gap:'.375rem',padding:'0 .75rem'}} role="list" aria-label="Grade de figurinhas">
          {visible.map(s=>{
            const status=getStickerStatus(s.id,collection); const cfg=STATUS_CONFIG[status]; const team=teamById[s.teamId]; const qty=collection[s.id]?.quantity??0
            return(
              <button key={s.id} onClick={()=>onToggle(s.id)} role="listitem"
                aria-label={`${s.id}: ${s.name}, ${team?.name??'Especial'}, ${cfg.label}. Toque para alterar.`}
                style={{aspectRatio:'2/3',borderRadius:'.75rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'.125rem',padding:'.25rem',position:'relative',border:`1.5px solid ${s.isSpecial?'#ffd60a':cfg.border}`,background:cfg.bg,cursor:'pointer',transition:'background .15s ease,border-color .15s ease',overflow:'hidden'}}>
                {s.isSpecial&&<div className="foil-shimmer" style={{position:'absolute',inset:0,borderRadius:'.75rem',pointerEvents:'none'}} aria-hidden="true"/>}
                {s.isSpecial&&<div style={{position:'absolute',top:3,right:3,fontSize:'.4375rem'}} aria-hidden="true">✨</div>}
                {qty>1&&<div style={{position:'absolute',top:3,left:3,width:14,height:14,background:'#ff9500',color:'white',borderRadius:'50%',fontSize:'.5rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}} aria-hidden="true">{qty}</div>}
                <span style={{fontSize:'1rem'}} aria-hidden="true">{team?.flag??'⭐'}</span>
                <span style={{fontSize:'.5rem',fontWeight:700,fontFamily:'monospace',color:cfg.color,textAlign:'center',lineHeight:1.1}}>{s.id}</span>
                <SvgIcon svg={cfg.svg} size={gridCols===3?16:12}/>
              </button>
            )
          })}
        </div>
      )}

      {view==='lista' && (
        <div style={{display:'flex',flexDirection:'column',gap:'.375rem',padding:'0 1rem'}} role="list">
          {visible.map(s=>{
            const status=getStickerStatus(s.id,collection); const cfg=STATUS_CONFIG[status]; const team=teamById[s.teamId]; const qty=collection[s.id]?.quantity??0
            return(
              <button key={s.id} onClick={()=>onToggle(s.id)} role="listitem"
                aria-label={`${s.id}: ${s.name}, ${cfg.label}. Toque para alterar.`}
                className="card" style={{padding:'.625rem 1rem',display:'flex',alignItems:'center',gap:12,width:'100%',textAlign:'left',cursor:'pointer',borderColor:cfg.border,transition:'background .15s ease,border-color .15s ease'}}>
                <span style={{fontSize:'1.25rem',flexShrink:0}} aria-hidden="true">{team?.flag??'⭐'}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:'#f0f8ff',fontSize:'.875rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}{s.isSpecial?' ✨':''}</div>
                  <div style={{color:'#3a5a7a',fontSize:'.75rem'}}>{s.id} · {team?.name??'Especial'}</div>
                </div>
                <div style={{display:'flex',gap:'.5rem',alignItems:'center',flexShrink:0}}>
                  {qty>1&&<span className="status-badge" style={{background:'#2a1800',color:'#ff9500',border:'1px solid #4a2e00'}} aria-label={`${qty} cópias`}>×{qty}</span>}
                  <span className="status-badge" style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.border}`,display:'inline-flex',alignItems:'center',gap:'.25rem'}} aria-label={cfg.label}>
                    <SvgIcon svg={cfg.svg} size={12}/>{cfg.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {visible.length < filtered.length && (
        <div style={{padding:'1rem'}}>
          <button onClick={()=>setPage(p=>p+1)} className="btn-ghost" style={{width:'100%',padding:'.75rem'}} aria-label="Carregar mais">
            Carregar mais ({filtered.length-visible.length} restantes)
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{textAlign:'center',padding:'3.5rem 1rem'}} role="status">
          <div style={{fontSize:'3rem',marginBottom:'.75rem'}} aria-hidden="true">🔍</div>
          <p style={{color:'#6b93b8',fontSize:'.875rem'}}>Nenhuma figurinha com esses filtros.</p>
        </div>
      )}

      {/* Modal WhatsApp */}
      {shareText !== null && (
        <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,.85)',display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={()=>{setShareText(null);setCopied(false)}}>
          <div style={{background:'#0d1423',borderRadius:'1.5rem 1.5rem 0 0',padding:'1.5rem',width:'100%',maxWidth:430,maxHeight:'70vh',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
              <h3 style={{fontFamily:'Oswald',color:'#f0f8ff',fontSize:'1.125rem',margin:0}}>💬 Lista para WhatsApp</h3>
              <button onClick={()=>{setShareText(null);setCopied(false)}} style={{background:'none',border:'none',color:'#6b93b8',cursor:'pointer',fontSize:'1.25rem'}} aria-label="Fechar">✕</button>
            </div>
            <textarea readOnly value={shareText} rows={8}
              style={{flex:1,resize:'none',background:'#060d1a',border:'1px solid #1e3a5a',borderRadius:'.75rem',padding:'.875rem',color:'#f0f8ff',fontSize:'.8125rem',lineHeight:1.6,fontFamily:'monospace',marginBottom:'1rem',overflowY:'auto'}}
              aria-label="Lista de figurinhas repetidas"/>
            <button onClick={copyShare}
              style={{padding:'.875rem',borderRadius:'1rem',border:'none',cursor:'pointer',fontFamily:'Oswald',fontWeight:700,fontSize:'1rem',letterSpacing:'.05em',
                background:copied?'linear-gradient(135deg,#009640,#006a28)':'linear-gradient(135deg,#00c850,#009640)',color:'#060d1a',transition:'background .2s'}}>
              {copied ? '✓ Copiado!' : '📋  COPIAR LISTA'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
