import { useState } from 'react'
const STEPS = [
  {icon:'📸',title:'Fotografe suas figurinhas',desc:'Aponte a câmera para o verso. Nossa IA lê os códigos automaticamente!',color:'#00c850'},
  {icon:'📒',title:'Organize sua coleção',     desc:'Veja o que tem, o que falta e o que está repetido — por seleção.',   color:'#ffd60a'},
  {icon:'🏆',title:'Conquiste e compartilhe!', desc:'Ganhe conquistas ao completar seleções e compartilhe com amigos.',    color:'#ff9500'},
]
export default function OnboardingScreen({ userName, onComplete }: { userName:string; onComplete:()=>void }) {
  const [step, setStep] = useState(0)
  const cur = STEPS[step]
  const nome = userName.split(' ')[0]
  return (
    <div className="animate-fade-in" style={{minHeight:'100vh',display:'flex',flexDirection:'column',padding:'1.5rem 1.25rem'}}>
      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <button onClick={onComplete} style={{color:'#3a5a7a',fontSize:'.875rem',background:'none',border:'none',cursor:'pointer'}} aria-label="Pular introdução">Pular</button>
      </div>
      <div key={step} className="animate-fade-in" style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',gap:'1.5rem'}}>
        <div style={{fontSize:'6rem',filter:`drop-shadow(0 0 32px ${cur.color}70)`}} role="img" aria-label={cur.title}>{cur.icon}</div>
        <h2 style={{fontFamily:'Oswald',fontSize:'1.875rem',fontWeight:700,color:'#f0f8ff',maxWidth:'18rem',lineHeight:1.2}}>{cur.title}</h2>
        <p style={{color:'#6b93b8',fontSize:'1rem',lineHeight:1.6,maxWidth:'18rem'}}>{cur.desc}</p>
      </div>
      <div style={{display:'flex',justifyContent:'center',gap:'.5rem',marginBottom:'1.75rem'}} role="tablist">
        {STEPS.map((_,i) => <div key={i} role="tab" aria-selected={i===step} style={{height:8,borderRadius:999,background:i===step?cur.color:'#1e3a5a',width:i===step?28:8,transition:'all .3s'}}/>)}
      </div>
      <button onClick={()=>step<STEPS.length-1?setStep(step+1):onComplete()} aria-label={step<2?'Próximo':'Começar'}
        style={{width:'100%',padding:'1rem',borderRadius:'1rem',background:`linear-gradient(135deg,${cur.color},${cur.color}cc)`,color:'#060d1a',fontFamily:'Oswald',fontWeight:700,fontSize:'1.25rem',border:'none',cursor:'pointer',letterSpacing:'.05em'}}>
        {step<STEPS.length-1?'Próximo →':`Vamos lá, ${nome}! ⚽`}
      </button>
    </div>
  )
}
