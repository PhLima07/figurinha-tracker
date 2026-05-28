import { useMemo } from 'react'
import { ACHIEVEMENTS, calcStats, type Sticker, type CollectionMap } from '@/lib/data'

interface Props { collection:CollectionMap; allStickers:Sticker[] }

export default function AchievementsView({ collection, allStickers }: Props) {
  const stats    = useMemo(()=>calcStats(allStickers,collection),[allStickers,collection])
  const unlocked = ACHIEVEMENTS.filter(a=>{try{return a.check(stats,collection)}catch{return false}})
  const locked   = ACHIEVEMENTS.filter(a=>!unlocked.includes(a))

  function share(icon:string,title:string,desc:string){
    const text=[`🏆 Conquista desbloqueada no FigurinhaTracker!`,`${icon} ${title}`,`"${desc}"`,``,`⚽ Copa do Mundo 2026 — ${stats.pct}% do álbum completo!`,`#FigurinhaTracker #Copa2026`].join('\n')
    if(navigator.share) navigator.share({title:'FigurinhaTracker',text})
    else navigator.clipboard?.writeText(text).then(()=>alert('Texto copiado! Cole no WhatsApp 📲'))
  }

  return (
    <div style={{padding:'1.25rem 1rem 7rem'}}>
      <h1 style={{fontFamily:'Oswald',fontSize:'1.875rem',fontWeight:700,color:'#f0f8ff',marginBottom:'.25rem'}}>Conquistas</h1>
      <p style={{color:'#6b93b8',fontSize:'.875rem',marginBottom:'1.5rem'}}>{unlocked.length} de {ACHIEVEMENTS.length} desbloqueadas</p>

      {unlocked.length>0&&(
        <section aria-label="Conquistas desbloqueadas">
          <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',color:'#ffd60a',marginBottom:'.75rem',fontWeight:600}}>✅ Desbloqueadas</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'.75rem',marginBottom:'2rem'}}>
            {unlocked.map(a=>(
              <div key={a.id} className="card animate-pop" style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:1*16,background:'linear-gradient(135deg,#091d0e,#0d1f33)',borderColor:'#1a4a2a'}}>
                <span style={{fontSize:'2.5rem',flexShrink:0,filter:'drop-shadow(0 0 10px rgba(255,214,10,.6))'}} aria-hidden="true">{a.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'Oswald',color:'#ffd60a',fontWeight:700}}>{a.title}</div>
                  <div style={{color:'#6b93b8',fontSize:'.875rem',marginTop:'.125rem'}}>{a.desc}</div>
                </div>
                <button onClick={()=>share(a.icon,a.title,a.desc)} aria-label={`Compartilhar: ${a.title}`} style={{padding:'.5rem',background:'none',border:'1px solid #1e3a5a',borderRadius:'.75rem',cursor:'pointer',fontSize:'1.125rem',flexShrink:0}}>📤</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {locked.length>0&&(
        <section aria-label="Conquistas bloqueadas">
          <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',color:'#3a5a7a',marginBottom:'.75rem',fontWeight:600}}>🔒 Bloqueadas</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
            {locked.map(a=>(
              <div key={a.id} className="card" style={{padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:1*16,opacity:.5}}>
                <span style={{fontSize:'2.5rem',flexShrink:0,filter:'grayscale(1)'}} aria-hidden="true">{a.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'Oswald',color:'#3a5a7a',fontWeight:700}}>???</div>
                  <div style={{color:'#3a5a7a',fontSize:'.875rem',marginTop:'.125rem'}}>{a.desc}</div>
                </div>
                <span style={{fontSize:'1.25rem'}} aria-hidden="true">🔒</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
