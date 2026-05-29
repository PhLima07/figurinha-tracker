import { useState, useMemo } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { calcStats, generateCSV, TEAMS, type Sticker, type CollectionMap, type Team } from '@/lib/data'
import { deleteAllUserData, type DbProfile } from '@/lib/supabase'

interface Props { profile:DbProfile; collection:CollectionMap; allStickers:Sticker[]; teamById:Record<string,Team>; onLogout:()=>void; onProfileUpdate:(p:DbProfile)=>void }

const CONFS = [
  { id:'UEFA',     label:'UEFA',     color:'#3b82f6' },
  { id:'CONMEBOL', label:'CONMEBOL', color:'#00c850' },
  { id:'CAF',      label:'CAF',      color:'#ffd60a' },
  { id:'AFC',      label:'AFC',      color:'#ff6b7a' },
  { id:'CONCACAF', label:'CONCACAF', color:'#ff9500' },
  { id:'OFC',      label:'OFC',      color:'#a78bfa' },
]

export default function ProfileView({ profile, collection, allStickers, teamById, onLogout }: Props) {
  const user = useUser(); const supabase = useSupabaseClient()
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const stats = calcStats(allStickers, collection)
  const custo = Math.ceil(stats.missing / 7) * 7 * 7

  // exclusive status counts for donut
  const pastedCount   = Object.values(collection).filter(e => e.pasted).length
  const repeatedCount = Object.keys(collection).filter(id => !collection[id].pasted && collection[id].quantity > 1).length
  const tenhoCount    = Object.keys(collection).filter(id => !collection[id].pasted && collection[id].quantity === 1).length
  const total980 = allStickers.length

  const c1 = (pastedCount / total980 * 100).toFixed(2)
  const c2 = ((pastedCount + tenhoCount) / total980 * 100).toFixed(2)
  const c3 = ((pastedCount + tenhoCount + repeatedCount) / total980 * 100).toFixed(2)

  // confederation progress
  const confStats = useMemo(() => CONFS.map(conf => {
    const teams = TEAMS.filter(t => t.conf === conf.id)
    const slots = allStickers.filter(s => teams.some(t => t.id === s.teamId))
    const owned = slots.filter(s => !!collection[s.id]).length
    const pct   = slots.length ? Math.round(owned / slots.length * 100) : 0
    return { ...conf, owned, total: slots.length, pct }
  }), [allStickers, collection])

  function handleCSV() {
    const csv  = generateCSV(collection, allStickers, teamById)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `colecao_copa2026_${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  function handleJSON() {
    const payload = {
      exportedAt: new Date().toISOString().split('T')[0],
      version: '1',
      totalStickers: total980,
      owned: stats.total,
      collection,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `colecao_copa2026_${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url)
  }

  async function handleDelete() {
    if (!user) return
    await deleteAllUserData(user.id); onLogout()
  }

  const STATS_ROWS = [
    ['📦 Total na coleção',         stats.total,       '#3b82f6'],
    ['✅ Coladas no álbum',          stats.pasted,      '#00c850'],
    ['🔄 Repetidas',                 stats.repeated,    '#ff9500'],
    ['⬜ Faltando',                  stats.missing,     '#6b93b8'],
    ['📊 Completude',               `${stats.pct}%`,   '#ffd60a'],
    ['💰 Custo est. para completar', `R$ ${custo}`,    '#ff6b7a'],
  ]

  return (
    <div style={{padding:'1.25rem 1rem 7rem'}}>
      {/* Usuário */}
      <div className="card" style={{padding:'1.5rem',marginBottom:'1.25rem',textAlign:'center',background:'linear-gradient(135deg,#091d0e,#0d1f33)',borderColor:'#1a4a2a',position:'relative',overflow:'hidden'}}>
        <div style={{width:80,height:80,borderRadius:'50%',margin:'0 auto 1rem',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Oswald',fontSize:'2rem',fontWeight:700,color:'#060d1a',background:'linear-gradient(135deg,#00c850,#ffd60a)',boxShadow:'0 0 24px rgba(0,200,80,.4)'}} aria-label={`Avatar: ${profile.name}`}>
          {profile.name[0]?.toUpperCase() ?? '?'}
        </div>
        <h2 style={{fontFamily:'Oswald',fontSize:'1.5rem',fontWeight:700,color:'#f0f8ff'}}>{profile.name}</h2>
        <p style={{color:'#6b93b8',fontSize:'.875rem',marginTop:'.25rem'}}>{user?.email}</p>
      </div>

      {/* Donut + Estatísticas */}
      <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',fontWeight:600,color:'#f0f8ff',marginBottom:'.75rem'}}>Estatísticas</h2>
      <div className="card" style={{marginBottom:'1.25rem',overflow:'hidden'}}>
        {/* Donut chart */}
        <div style={{display:'flex',alignItems:'center',gap:'1.25rem',padding:'1.25rem',borderBottom:'1px solid #1e3a5a'}}>
          <div style={{flexShrink:0,width:90,height:90,borderRadius:'50%',background:`conic-gradient(#00c850 0% ${c1}%, #3b82f6 ${c1}% ${c2}%, #ff9500 ${c2}% ${c3}%, #1e3a5a ${c3}% 100%)`,position:'relative'}} role="img" aria-label={`${stats.pct}% completado`}>
            <div style={{position:'absolute',inset:'22%',borderRadius:'50%',background:'#0d1423',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontFamily:'Oswald',color:'#ffd60a',fontSize:'1.125rem',fontWeight:700}}>{stats.pct}%</span>
            </div>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:'.375rem'}}>
            {([['#00c850','Coladas',pastedCount],['#3b82f6','Tenho',tenhoCount],['#ff9500','Repetidas',repeatedCount],['#1e3a5a','Faltando',stats.missing]] as [string,string,number][]).map(([color,label,count])=>(
              <div key={label} style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:color,flexShrink:0}}/>
                <span style={{color:'#6b93b8',fontSize:'.75rem',flex:1}}>{label}</span>
                <span style={{color:'#f0f8ff',fontSize:'.75rem',fontWeight:600}}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de stats */}
        {STATS_ROWS.map(([label,value,color],i)=>(
          <div key={String(label)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.875rem 1.25rem',borderBottom:i<STATS_ROWS.length-1?'1px solid #1e3a5a':'none'}}>
            <span style={{color:'#6b93b8',fontSize:'.875rem'}}>{label}</span>
            <span style={{fontFamily:'Oswald',fontSize:'1.25rem',fontWeight:700,color:String(color)}}>{value}</span>
          </div>
        ))}
      </div>

      {/* Progresso por Confederação */}
      <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',fontWeight:600,color:'#f0f8ff',marginBottom:'.75rem'}}>Por Confederação</h2>
      <div className="card" style={{padding:'1rem',marginBottom:'1.25rem'}}>
        {confStats.map((c,i)=>(
          <div key={c.id} style={{marginBottom:i<confStats.length-1?'.875rem':0}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.25rem'}}>
              <span style={{color:'#6b93b8',fontSize:'.8125rem',fontWeight:600}}>{c.label}</span>
              <span style={{color:c.color,fontSize:'.8125rem',fontWeight:700}}>{c.owned}/{c.total} ({c.pct}%)</span>
            </div>
            <div style={{height:6,borderRadius:999,background:'#1e3a5a',overflow:'hidden'}}>
              <div style={{height:'100%',borderRadius:999,background:c.color,width:`${c.pct}%`,transition:'width .4s ease'}}/>
            </div>
          </div>
        ))}
      </div>

      {/* Ferramentas */}
      <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',fontWeight:600,color:'#f0f8ff',marginBottom:'.75rem'}}>Ferramentas</h2>
      <div style={{display:'flex',flexDirection:'column',gap:'.625rem',marginBottom:'1.25rem'}}>
        <button onClick={handleCSV} aria-label="Exportar coleção CSV" className="card" style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:16,width:'100%',textAlign:'left',cursor:'pointer',border:'1px solid #1e3a5a'}}>
          <span style={{fontSize:'1.5rem',flexShrink:0}} aria-hidden="true">📥</span>
          <div style={{flex:1}}>
            <div style={{color:'#f0f8ff',fontWeight:600,fontSize:'.875rem'}}>Exportar CSV</div>
            <div style={{color:'#3a5a7a',fontSize:'.75rem',marginTop:'.125rem'}}>Planilha com todas as figurinhas</div>
          </div>
          <span style={{color:'#3a5a7a'}} aria-hidden="true">›</span>
        </button>

        <button onClick={handleJSON} aria-label="Exportar coleção JSON" className="card" style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:16,width:'100%',textAlign:'left',cursor:'pointer',border:'1px solid #1e3a5a'}}>
          <span style={{fontSize:'1.5rem',flexShrink:0}} aria-hidden="true">🗂️</span>
          <div style={{flex:1}}>
            <div style={{color:'#f0f8ff',fontWeight:600,fontSize:'.875rem'}}>Exportar JSON</div>
            <div style={{color:'#3a5a7a',fontSize:'.75rem',marginTop:'.125rem'}}>Backup completo da coleção</div>
          </div>
          <span style={{color:'#3a5a7a'}} aria-hidden="true">›</span>
        </button>

        {deleteConfirm ? (
          <div style={{padding:'1rem 1.25rem',borderRadius:'1rem',border:'1px solid rgba(255,71,87,.5)',background:'#2a0a0a'}}>
            <p style={{color:'#ff8090',fontSize:'.875rem',fontWeight:600,marginBottom:'.5rem'}}>⚠️ Esta ação é irreversível</p>
            <p style={{color:'#6b93b8',fontSize:'.75rem',lineHeight:1.6,marginBottom:'1rem'}}>Todos os seus dados serão excluídos permanentemente (LGPD). Não há como desfazer.</p>
            <div style={{display:'flex',gap:'.5rem'}}>
              <button onClick={handleDelete} style={{flex:1,padding:'.625rem',borderRadius:'.75rem',background:'#ff4757',color:'white',border:'none',cursor:'pointer',fontWeight:700,fontSize:'.875rem'}}>
                Confirmar exclusão
              </button>
              <button onClick={()=>setDeleteConfirm(false)} style={{flex:1,padding:'.625rem',borderRadius:'.75rem',background:'#1e3a5a',color:'#f0f8ff',border:'none',cursor:'pointer',fontWeight:600,fontSize:'.875rem'}}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button onClick={()=>setDeleteConfirm(true)} aria-label="Excluir conta e dados" style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:16,width:'100%',textAlign:'left',cursor:'pointer',borderRadius:'1rem',border:'1px solid rgba(255,71,87,.25)',background:'#2a0a0a'}}>
            <span style={{fontSize:'1.5rem',flexShrink:0}} aria-hidden="true">🗑️</span>
            <div style={{flex:1}}>
              <div style={{color:'#ff8090',fontWeight:600,fontSize:'.875rem'}}>Excluir minha conta</div>
              <div style={{color:'#3a5a7a',fontSize:'.75rem',marginTop:'.125rem'}}>Remove todos os dados (LGPD)</div>
            </div>
          </button>
        )}

        <button onClick={onLogout} aria-label="Sair da conta" style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:16,width:'100%',textAlign:'left',cursor:'pointer',borderRadius:'1rem',border:'1px solid rgba(255,71,87,.15)',background:'transparent'}}>
          <span style={{fontSize:'1.5rem',flexShrink:0}} aria-hidden="true">🚪</span>
          <div style={{flex:1}}>
            <div style={{color:'#ff8090',fontWeight:600,fontSize:'.875rem'}}>Sair da conta</div>
            <div style={{color:'#3a5a7a',fontSize:'.75rem',marginTop:'.125rem'}}>Você pode entrar novamente a qualquer hora</div>
          </div>
        </button>
      </div>

      {/* Privacidade */}
      <div className="card" style={{padding:'1rem',fontSize:'.75rem',color:'#3a5a7a',lineHeight:1.6}}>
        <p style={{fontWeight:600,color:'#6b93b8',marginBottom:'.5rem'}}>🔒 Privacidade e seus direitos (LGPD)</p>
        <ul style={{paddingLeft:0,listStyle:'none',display:'flex',flexDirection:'column',gap:'.25rem'}}>
          <li>• Imagens escaneadas são <strong style={{color:'#6b93b8'}}>descartadas imediatamente</strong></li>
          <li>• Coletamos apenas: nome, email e sua coleção</li>
          <li>• Você pode <strong style={{color:'#6b93b8'}}>exportar ou excluir</strong> seus dados</li>
          <li>• Nunca vendemos seus dados</li>
        </ul>
        <div style={{display:'flex',gap:'.75rem',marginTop:'.75rem'}}>
          <a href="/privacidade" style={{color:'#00c850'}} target="_blank" rel="noopener noreferrer">Política de Privacidade</a>
          <span>·</span>
          <a href="/termos" style={{color:'#00c850'}} target="_blank" rel="noopener noreferrer">Termos de Uso</a>
        </div>
      </div>
    </div>
  )
}
