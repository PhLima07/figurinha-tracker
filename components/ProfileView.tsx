import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { calcStats, generateCSV, type Sticker, type CollectionMap, type Team } from '@/lib/data'
import { deleteAllUserData, type DbProfile } from '@/lib/supabase'

interface Props { profile:DbProfile; collection:CollectionMap; allStickers:Sticker[]; teamById:Record<string,Team>; onLogout:()=>void; onProfileUpdate:(p:DbProfile)=>void }

export default function ProfileView({ profile, collection, allStickers, teamById, onLogout }: Props) {
  const user = useUser(); const supabase = useSupabaseClient()
  const stats = calcStats(allStickers, collection)
  const custo = Math.ceil(stats.missing/7)*7*7

  function handleCSV() {
    const csv  = generateCSV(collection, allStickers, teamById)
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'})
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href=url; a.download=`colecao_copa2026_${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  async function handleDelete() {
    if(!user) return
    const ok=window.confirm('Tem certeza? Esta ação é IRREVERSÍVEL.\n\nTodos os seus dados serão excluídos permanentemente (LGPD).')
    if(!ok) return
    await deleteAllUserData(user.id); onLogout()
  }

  const STATS_ROWS = [
    ['📦 Total na coleção',        stats.total,         '#3b82f6'],
    ['✅ Coladas no álbum',         stats.pasted,        '#00c850'],
    ['🔄 Repetidas',                stats.repeated,      '#ff9500'],
    ['⬜ Faltando',                 stats.missing,       '#6b93b8'],
    ['📊 Completude',              `${stats.pct}%`,      '#ffd60a'],
    ['💰 Custo est. para completar',`R$ ${custo}`,       '#ff6b7a'],
  ]

  return (
    <div style={{padding:'1.25rem 1rem 7rem'}}>
      {/* Card do usuário */}
      <div className="card" style={{padding:'1.5rem',marginBottom:'1.25rem',textAlign:'center',background:'linear-gradient(135deg,#091d0e,#0d1f33)',borderColor:'#1a4a2a',position:'relative',overflow:'hidden'}}>
        <div style={{width:80,height:80,borderRadius:'50%',margin:'0 auto 1rem',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Oswald',fontSize:'2rem',fontWeight:700,color:'#060d1a',background:'linear-gradient(135deg,#00c850,#ffd60a)',boxShadow:'0 0 24px rgba(0,200,80,.4)'}} aria-label={`Avatar: ${profile.name}`}>
          {profile.name[0]?.toUpperCase()??'?'}
        </div>
        <h2 style={{fontFamily:'Oswald',fontSize:'1.5rem',fontWeight:700,color:'#f0f8ff'}}>{profile.name}</h2>
        <p style={{color:'#6b93b8',fontSize:'.875rem',marginTop:'.25rem'}}>{user?.email}</p>
        <div style={{display:'inline-block',marginTop:'.75rem',padding:'.375rem 1rem',borderRadius:999,fontSize:'.75rem',fontWeight:600,color:'#ffd60a',border:'1px solid rgba(255,214,10,.3)',background:'#060d1a'}}>
          ⚡ Plano Gratuito · {profile.scan_count}/{profile.scan_limit} scans usados
        </div>
      </div>

      {/* Estatísticas (Roberto Dados) */}
      <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',fontWeight:600,color:'#f0f8ff',marginBottom:'.75rem'}}>Estatísticas</h2>
      <div className="card" style={{overflow:'hidden',marginBottom:'1.25rem'}}>
        {STATS_ROWS.map(([label,value,color],i)=>(
          <div key={String(label)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.875rem 1.25rem',borderBottom:i<STATS_ROWS.length-1?'1px solid #1e3a5a':'none'}}>
            <span style={{color:'#6b93b8',fontSize:'.875rem'}}>{label}</span>
            <span style={{fontFamily:'Oswald',fontSize:'1.25rem',fontWeight:700,color:String(color)}}>{value}</span>
          </div>
        ))}
      </div>

      {/* Ações */}
      <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',fontWeight:600,color:'#f0f8ff',marginBottom:'.75rem'}}>Ferramentas</h2>
      <div style={{display:'flex',flexDirection:'column',gap:'.625rem',marginBottom:'1.25rem'}}>
        <button onClick={handleCSV} aria-label="Exportar coleção CSV" className="card" style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:1*16,width:'100%',textAlign:'left',cursor:'pointer',border:'1px solid #1e3a5a'}}>
          <span style={{fontSize:'1.5rem',flexShrink:0}} aria-hidden="true">📥</span>
          <div style={{flex:1}}><div style={{color:'#f0f8ff',fontWeight:600,fontSize:'.875rem'}}>Exportar Coleção</div><div style={{color:'#3a5a7a',fontSize:'.75rem',marginTop:'.125rem'}}>Baixar CSV com todas as figurinhas</div></div>
          <span style={{color:'#3a5a7a'}} aria-hidden="true">›</span>
        </button>

        <button onClick={handleDelete} aria-label="Excluir conta e dados" style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:1*16,width:'100%',textAlign:'left',cursor:'pointer',borderRadius:'1rem',border:'1px solid rgba(255,71,87,.25)',background:'#2a0a0a'}}>
          <span style={{fontSize:'1.5rem',flexShrink:0}} aria-hidden="true">🗑️</span>
          <div style={{flex:1}}><div style={{color:'#ff8090',fontWeight:600,fontSize:'.875rem'}}>Excluir minha conta</div><div style={{color:'#3a5a7a',fontSize:'.75rem',marginTop:'.125rem'}}>Remove todos os dados (LGPD)</div></div>
        </button>

        <button onClick={onLogout} aria-label="Sair da conta" style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:1*16,width:'100%',textAlign:'left',cursor:'pointer',borderRadius:'1rem',border:'1px solid rgba(255,71,87,.15)',background:'transparent'}}>
          <span style={{fontSize:'1.5rem',flexShrink:0}} aria-hidden="true">🚪</span>
          <div style={{flex:1}}><div style={{color:'#ff8090',fontWeight:600,fontSize:'.875rem'}}>Sair da conta</div><div style={{color:'#3a5a7a',fontSize:'.75rem',marginTop:'.125rem'}}>Você pode entrar novamente a qualquer hora</div></div>
        </button>
      </div>

      {/* Privacidade em linguagem simples (Clara + Prof. Segura) */}
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
