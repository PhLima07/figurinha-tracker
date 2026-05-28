import { useState, useMemo } from 'react'
import { TEAMS, getStickerStatus, STATUS_CONFIG, type Sticker, type CollectionMap, type Team, type StickerStatus } from '@/lib/data'

const ST_FILTERS: {id:'all'|StickerStatus;label:string}[] = [{id:'all',label:'Todas'},{id:'colada',label:'✅ Coladas'},{id:'tenho',label:'📦 Tenho'},{id:'repetida',label:'🔄 Repetidas'},{id:'faltando',label:'⬜ Faltando'}]
const PAGE_SIZE = 100

interface Props { collection:CollectionMap; allStickers:Sticker[]; teamById:Record<string,Team>; onToggle:(id:string)=>Promise<void> }

export default function CollectionView({ collection, allStickers, teamById, onToggle }: Props) {
  const [search,   setSearch]   = useState('')
  const [filterSt, setFilterSt] = useState<'all'|StickerStatus>('all')
  const [filterTm, setFilterTm] = useState('all')
  const [view,     setView]     = useState<'grid'|'lista'>('grid')
  const [page,     setPage]     = useState(1)

  const filtered = useMemo(() => {
    const q = search.toUpperCase().trim()
    return allStickers.filter(s => {
      const team = teamById[s.teamId]; const status = getStickerStatus(s.id, collection)
      return (!q||s.id.includes(q)||s.name.toUpperCase().includes(q)||(team?.name??'').toUpperCase().includes(q)) && (filterSt==='all'||status===filterSt) && (filterTm==='all'||s.teamId===filterTm)
    })
  }, [search, filterSt, filterTm, allStickers, collection, teamById])

  const visible = useMemo(() => filtered.slice(0, page*PAGE_SIZE), [filtered, page])

  return (
    <div style={{paddingBottom:'7rem'}}>
      <div style={{padding:'1.25rem 1rem'}}>
        <h1 style={{fontFamily:'Oswald',fontSize:'1.875rem',fontWeight:700,color:'#f0f8ff',marginBottom:'1rem'}}>Coleção</h1>

        <div style={{position:'relative',marginBottom:'.75rem'}}>
          <span style={{position:'absolute',left:'.875rem',top:'50%',transform:'translateY(-50%)',fontSize:'.875rem',pointerEvents:'none'}} aria-hidden="true">🔍</span>
          <input className="ft-input" style={{paddingLeft:'2.5rem'}} value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Buscar figurinha, jogador ou seleção..." aria-label="Buscar"/>
        </div>

        <div style={{display:'flex',gap:'.5rem',overflowX:'auto',paddingBottom:'.5rem',marginBottom:'.75rem'}} className="no-scrollbar" role="group" aria-label="Filtrar por status">
          {ST_FILTERS.map(f=>(
            <button key={f.id} onClick={()=>{setFilterSt(f.id);setPage(1)}} aria-pressed={filterSt===f.id}
              style={{padding:'.375rem .875rem',borderRadius:999,fontSize:'.75rem',fontWeight:600,whiteSpace:'nowrap',flexShrink:0,border:`1px solid ${filterSt===f.id?'#00c850':'#1e3a5a'}`,background:filterSt===f.id?'#00c850':'#0d1f33',color:filterSt===f.id?'#060d1a':'#6b93b8',cursor:'pointer'}}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{display:'flex',gap:'.625rem',marginBottom:'.75rem'}}>
          <select className="ft-input" style={{flex:1,padding:'.625rem 1rem',fontSize:'.875rem'}} value={filterTm} onChange={e=>{setFilterTm(e.target.value);setPage(1)}} aria-label="Filtrar por seleção">
            <option value="all">🌍 Todas as seleções</option>
            <option value="FWC">⭐ Especiais Copa 2026</option>
            {TEAMS.map(t=><option key={t.id} value={t.id}>{t.flag} {t.name}</option>)}
          </select>
          <div style={{display:'flex',border:'1px solid #1e3a5a',borderRadius:'.75rem',overflow:'hidden',flexShrink:0}}>
            {(['grid','lista'] as const).map(m=>(
              <button key={m} onClick={()=>setView(m)} aria-pressed={view===m} aria-label={`Visualizar em ${m==='grid'?'grade':'lista'}`}
                style={{padding:'.5rem .875rem',fontSize:'1.125rem',background:view===m?'#00c850':'#0d1f33',color:view===m?'#060d1a':'#6b93b8',border:'none',cursor:'pointer'}}>
                {m==='grid'?'⊞':'☰'}
              </button>
            ))}
          </div>
        </div>

        <p style={{color:'#3a5a7a',fontSize:'.75rem',marginBottom:'.75rem'}} aria-live="polite">{filtered.length} figurinha{filtered.length!==1?'s':''}</p>
      </div>

      {view==='grid' && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'.375rem',padding:'0 .75rem'}} role="list" aria-label="Grade de figurinhas">
          {visible.map(s=>{
            const status=getStickerStatus(s.id,collection); const cfg=STATUS_CONFIG[status]; const team=teamById[s.teamId]; const qty=collection[s.id]?.quantity??0
            return(
              <button key={s.id} onClick={()=>onToggle(s.id)} role="listitem"
                aria-label={`${s.id}: ${s.name}, ${team?.name??'Especial'}, ${cfg.label}. Toque para alterar.`}
                style={{aspectRatio:'2/3',borderRadius:'.75rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'.125rem',padding:'.25rem',position:'relative',border:`1.5px solid ${cfg.border}`,background:cfg.bg,cursor:'pointer'}}>
                {s.isSpecial&&<div style={{position:'absolute',top:3,right:3,fontSize:'.4375rem'}} aria-hidden="true">✨</div>}
                {qty>1&&<div style={{position:'absolute',top:3,left:3,width:14,height:14,background:'#ff9500',color:'white',borderRadius:'50%',fontSize:'.5rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}} aria-hidden="true">{qty}</div>}
                <span style={{fontSize:'1rem'}} aria-hidden="true">{team?.flag??'⭐'}</span>
                <span style={{fontSize:'.5rem',fontWeight:700,fontFamily:'monospace',color:cfg.color,textAlign:'center',lineHeight:1.1}}>{s.id}</span>
                <span style={{fontSize:'.5625rem'}} aria-hidden="true">{cfg.icon}</span>
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
                className="card" style={{padding:'.625rem 1rem',display:'flex',alignItems:'center',gap:.75*16,width:'100%',textAlign:'left',cursor:'pointer',borderColor:cfg.border}}>
                <span style={{fontSize:'1.25rem',flexShrink:0}} aria-hidden="true">{team?.flag??'⭐'}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:'#f0f8ff',fontSize:'.875rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}{s.isSpecial?' ✨':''}</div>
                  <div style={{color:'#3a5a7a',fontSize:'.75rem'}}>{s.id} · {team?.name??'Especial'}</div>
                </div>
                <div style={{display:'flex',gap:'.5rem',alignItems:'center',flexShrink:0}}>
                  {qty>1&&<span className="status-badge" style={{background:'#2a1800',color:'#ff9500',border:'1px solid #4a2e00'}} aria-label={`${qty} cópias`}>×{qty}</span>}
                  <span className="status-badge" style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.border}`}} aria-label={cfg.label}>{cfg.icon} {cfg.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {visible.length<filtered.length&&(
        <div style={{padding:'1rem'}}>
          <button onClick={()=>setPage(p=>p+1)} className="btn-ghost" style={{width:'100%',padding:'.75rem'}} aria-label="Carregar mais">
            Carregar mais ({filtered.length-visible.length} restantes)
          </button>
        </div>
      )}

      {filtered.length===0&&(
        <div style={{textAlign:'center',padding:'3.5rem 1rem'}} role="status">
          <div style={{fontSize:'3rem',marginBottom:'.75rem'}} aria-hidden="true">🔍</div>
          <p style={{color:'#6b93b8',fontSize:'.875rem'}}>Nenhuma figurinha com esses filtros.</p>
        </div>
      )}
    </div>
  )
}
