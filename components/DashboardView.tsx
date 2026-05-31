import { useMemo, useState, useEffect } from 'react'
import type { AppTab } from './MainApp'
import { calcStats, getTeamProgress, getStickerStatus, STATUS_CONFIG, TEAMS, type Sticker, type CollectionMap, type Team } from '@/lib/data'
import type { DbProfile } from '@/lib/supabase'

interface Props { profile:DbProfile; collection:CollectionMap; allStickers:Sticker[]; teamById:Record<string,Team>; onTabChange:(t:AppTab)=>void }

export default function DashboardView({ profile, collection, allStickers, teamById, onTabChange }: Props) {
  const stats = useMemo(() => calcStats(allStickers, collection), [allStickers, collection])
  const topTeams = useMemo(() => TEAMS.map(t=>({...t,progress:getTeamProgress(t.id,collection)})).sort((a,b)=>b.progress-a.progress), [collection])
  const recent = useMemo(() => Object.entries(collection).sort(([,a],[,b])=>new Date(b.addedAt).getTime()-new Date(a.addedAt).getTime()).slice(0,5), [collection])
  const stickerById = useMemo(() => Object.fromEntries(allStickers.map(s=>[s.id,s])), [allStickers])
  const custo = Math.ceil(stats.missing/7)*7

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])
  const COPA_START = new Date('2026-06-11T00:00:00').getTime()
  const copaMs    = Math.max(0, COPA_START - now)
  const copaDays  = Math.floor(copaMs / 86_400_000)
  const copaHours = Math.floor((copaMs % 86_400_000) / 3_600_000)
  const copaStarted = copaMs === 0

  const S = (style: React.CSSProperties) => style

  return (
    <div style={{paddingBottom:'7rem',padding:'1.25rem 1rem 7rem'}}>
      <p style={{color:'#6b93b8',fontSize:'.875rem',marginBottom:'.25rem'}}>Olá, {profile.name.split(' ')[0]} 👋</p>
      <h1 style={{fontFamily:'Oswald',fontSize:'1.875rem',fontWeight:700,color:'#f0f8ff',marginBottom:'1rem'}}>Minha Coleção</h1>

      {/* Copa countdown */}
      <div className="card" style={{padding:'1rem 1.25rem',marginBottom:'1rem',background:'linear-gradient(135deg,#0d1f33,#091d0e)',borderColor:'#1a4a2a',display:'flex',alignItems:'center',gap:'1rem'}}>
        <span style={{fontSize:'2rem',filter:'drop-shadow(0 0 8px #ffd60a)'}} aria-hidden="true">🏆</span>
        <div style={{flex:1}}>
          <div style={{color:'#6b93b8',fontSize:'.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'.25rem'}}>Copa do Mundo 2026</div>
          {copaStarted
            ? <div style={{fontFamily:'Oswald',fontSize:'1.25rem',fontWeight:700,color:'#ffd60a'}}>A Copa começou! ⚽</div>
            : <div style={{display:'flex',gap:'1rem',alignItems:'baseline'}}>
                <span style={{fontFamily:'Oswald',fontSize:'1.875rem',fontWeight:700,color:'#ffd60a',lineHeight:1}} aria-label={`${copaDays} dias`}>{copaDays}<span style={{fontSize:'.75rem',color:'#6b93b8',marginLeft:'.25rem',fontFamily:'inherit',fontWeight:400}}>dias</span></span>
                <span style={{fontFamily:'Oswald',fontSize:'1.25rem',fontWeight:700,color:'#3a5a7a',lineHeight:1}} aria-label={`${copaHours} horas`}>{copaHours}<span style={{fontSize:'.75rem',color:'#3a5a7a',marginLeft:'.125rem',fontFamily:'inherit',fontWeight:400}}>h</span></span>
              </div>
          }
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:'.6875rem',color:'#3a5a7a'}}>11 JUN</div>
          <div style={{fontSize:'.6875rem',color:'#3a5a7a'}}>2026</div>
        </div>
      </div>

      {/* % geral */}
      <div className="card" style={{padding:'1.5rem',marginBottom:'1rem',textAlign:'center',background:'linear-gradient(135deg,#091d0e,#0d1f33)',borderColor:'#1a4a2a',position:'relative',overflow:'hidden'}}>
        <div style={{fontFamily:'Oswald',fontSize:'3.75rem',fontWeight:700,color:'#00c850',lineHeight:1}} aria-label={`${stats.pct} por cento completo`}>{stats.pct}%</div>
        <p style={{color:'#6b93b8',fontSize:'.875rem',margin:'.5rem 0'}}>do álbum completo</p>
        <div className="progress-bar" role="progressbar" aria-valuenow={stats.pct} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" style={{width:`${stats.pct}%`}}/></div>
        <p style={{color:'#3a5a7a',fontSize:'.75rem',marginTop:'.5rem'}}>{stats.total} de {allStickers.length} figurinhas</p>
      </div>

      {/* 3 números sagrados (Toninho) */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'.625rem',marginBottom:'.75rem'}}>
        {[['📦','Tenho',stats.total,'#3b82f6'],['⬜','Faltam',stats.missing,'#6b93b8'],['🔄','Repetidas',stats.repeated,'#ff9500']].map(([icon,label,val,color]) => (
          <div key={String(label)} className="card" style={{padding:'1rem',textAlign:'center'}}>
            <div style={{fontSize:'1.25rem'}} aria-hidden="true">{icon}</div>
            <div style={{fontFamily:'Oswald',fontSize:'1.875rem',fontWeight:700,color:String(color),lineHeight:1}} aria-label={`${val} ${label}`}>{val}</div>
            <div style={{color:'#6b93b8',fontSize:'.75rem',marginTop:'.375rem',fontWeight:500}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Coladas */}
      <div className="card" style={{padding:'1rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'1rem',borderColor:'#1a4a2a'}}>
        <span style={{fontSize:'1.875rem',filter:'drop-shadow(0 0 6px #00c850)'}} aria-hidden="true">✅</span>
        <div><div style={{fontFamily:'Oswald',fontSize:'1.5rem',fontWeight:700,color:'#00c850'}} aria-label={`${stats.pasted} coladas`}>{stats.pasted}</div><div style={{color:'#6b93b8',fontSize:'.875rem'}}>figurinhas coladas no álbum</div></div>
      </div>

      {/* Top seleções */}
      <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',fontWeight:600,color:'#f0f8ff',marginBottom:'.75rem'}}>🏅 Seleções Mais Completas</h2>
      <div className="card" style={{overflow:'hidden',marginBottom:'1.25rem'}}>
        {topTeams.slice(0,6).map((team,i) => {
          const pct = Math.round(team.progress/20*100)
          return (
          <div key={team.id} style={{padding:'1rem',borderBottom:i<5?'1px solid #1e3a5a':'none'}}>
            <div style={{display:'flex',alignItems:'center',gap:'.625rem',marginBottom:'.375rem'}}>
              <span style={{fontSize:'1.25rem'}} aria-hidden="true">{team.flag}</span>
              <span style={{color:'#f0f8ff',fontSize:'.875rem',fontWeight:500,flex:1}}>{team.name}</span>
              <span style={{fontSize:'.75rem',fontWeight:600,color:team.progress===20?'#ffd60a':'#6b93b8'}} aria-label={`${team.progress} de 20, ${pct}%`}>{team.progress}/20{team.progress===20?' ✨':''}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
              <div className="progress-bar" style={{flex:1}} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" style={{width:`${pct}%`,background:team.progress===20?'linear-gradient(90deg,#ffd60a,#ff9500)':undefined}}/></div>
              <span style={{fontSize:'.6875rem',color:'#3a5a7a',width:'2.5rem',textAlign:'right',flexShrink:0}}>{pct}%</span>
            </div>
          </div>
        )})}
      </div>

      {/* Custo estimado */}
      {stats.missing>0 && (
        <div className="card" style={{padding:'1rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'.75rem'}}>
          <span style={{fontSize:'1.5rem'}} aria-hidden="true">💰</span>
          <div><div style={{color:'#f0f8ff',fontSize:'.875rem',fontWeight:600}}>Custo estimado para completar</div><div style={{color:'#6b93b8',fontSize:'.75rem',marginTop:'.25rem'}}>~{custo} envelopes · aprox. <strong style={{color:'#ff9500'}}>R$ {custo*7}</strong></div></div>
        </div>
      )}

      {/* Recentes */}
      {recent.length>0 && (
        <>
          <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',fontWeight:600,color:'#f0f8ff',marginBottom:'.75rem'}}>🕒 Adicionadas Recentemente</h2>
          {recent.map(([id]) => {
            const sticker = stickerById[id]; const team = teamById[sticker?.teamId]; const status = getStickerStatus(id,collection); const cfg = STATUS_CONFIG[status]
            if(!sticker) return null
            return (
              <div key={id} className="card animate-slide-up" style={{padding:'.75rem 1rem',display:'flex',alignItems:'center',gap:.75*16,marginBottom:'.5rem'}}>
                <span style={{fontSize:'1.5rem',flexShrink:0}} aria-hidden="true">{team?.flag??'⭐'}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:'#f0f8ff',fontSize:'.875rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sticker.name}{sticker.isSpecial?' ✨':''}</div>
                  <div style={{color:'#3a5a7a',fontSize:'.75rem',marginTop:'.125rem'}}>{id} · {team?.name??'Especial'}</div>
                </div>
                <span className="status-badge" style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.border}`,flexShrink:0}} aria-label={`Status: ${cfg.label}`}>{cfg.icon} {cfg.label}</span>
              </div>
            )
          })}
        </>
      )}

      {/* Vazio */}
      {stats.total===0 && (
        <div style={{textAlign:'center',padding:'3.5rem 1rem'}}>
          <div style={{fontSize:'3.75rem',marginBottom:'1rem'}} aria-hidden="true">📸</div>
          <p style={{color:'#f0f8ff',fontSize:'1.125rem',fontWeight:600,marginBottom:'.5rem'}}>Coleção vazia</p>
          <p style={{color:'#6b93b8',fontSize:'.875rem',marginBottom:'1.25rem'}}>Escaneie sua primeira figurinha!</p>
          <button onClick={()=>onTabChange('escanear')} className="btn-primary" style={{width:'auto',padding:'.875rem 2rem'}} aria-label="Ir para o scanner">📷  Escanear agora</button>
        </div>
      )}
    </div>
  )
}
