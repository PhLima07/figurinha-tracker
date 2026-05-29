import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export default function AuthScreen({ onSuccess }: { onSuccess: () => void }) {
  const sb = useSupabaseClient()
  const [tab, setTab] = useState<'login'|'cadastro'>('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [blocked, setBlocked] = useState(false)
  const [consentPriv, setConsentPriv] = useState(false)
  const [consentTerms, setConsentTerms] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const currentYear = 2026
  const age = birthYear ? currentYear - parseInt(birthYear) : null
  const ageBlocked  = age !== null && age < 12
  const ageParental = age !== null && age >= 12 && age < 15

  async function handleGoogle() {
    if (!consentPriv || !consentTerms) { setErro('Aceite a Política de Privacidade e os Termos de Uso.'); return }
    setGLoading(true); setErro('')
    const { error } = await sb.auth.signInWithOAuth({ provider:'google', options:{ redirectTo:`${window.location.origin}/api/auth/callback` } })
    if (error) { setErro('Erro ao conectar com Google.'); setGLoading(false) }
  }

  async function handleEmail() {
    if (blocked) { setErro('Conta bloqueada por 5 minutos.'); return }
    if (!consentPriv || !consentTerms) { setErro('Aceite a Política de Privacidade e os Termos de Uso.'); return }
    if (!email.trim() || !senha.trim()) { setErro('Preencha todos os campos.'); return }
    if (tab === 'cadastro' && !nome.trim()) { setErro('Informe seu nome.'); return }
    if (tab === 'cadastro' && !birthYear) { setErro('Informe seu ano de nascimento.'); return }
    if (tab === 'cadastro' && ageBlocked) { setErro('Menores de 12 anos não podem usar este app.'); return }
    if (senha.length < 6) { setErro('Senha com mínimo 6 caracteres.'); return }
    setLoading(true); setErro('')
    try {
      if (tab === 'cadastro') {
        const { data, error } = await sb.auth.signUp({ email:email.trim(), password:senha, options:{ data:{ name:nome.trim() } } })
        if (error) throw error
        if (!data.session) { setEmailSent(true); setLoading(false); return }
        onSuccess()
      } else {
        const { error } = await sb.auth.signInWithPassword({ email:email.trim(), password:senha })
        if (error) {
          const next = attempts + 1; setAttempts(next)
          if (next >= 5) { setBlocked(true); setTimeout(()=>{setBlocked(false);setAttempts(0)},300000); setErro('Muitas tentativas. Bloqueado por 5 minutos.') }
          else setErro(`Email ou senha incorretos. (${next}/5)`)
          setLoading(false); return
        }
        onSuccess()
      }
    } catch (e: unknown) {
      setErro(e instanceof Error && e.message.includes('already') ? 'Email já cadastrado.' : 'Erro inesperado.')
    }
    setLoading(false)
  }

  const S: React.CSSProperties = { fontFamily:'Oswald, sans-serif' }

  return (
    <div className="animate-fade-in" style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem 1.25rem'}}>
      <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
        <div style={{fontSize:'4.5rem',filter:'drop-shadow(0 0 24px rgba(0,200,80,0.5))',marginBottom:'.5rem'}}>⚽</div>
        <div style={{...S,fontSize:'2.5rem',fontWeight:700,color:'#ffd60a',letterSpacing:'.15em',lineHeight:1}}>FIGURINHA</div>
        <div style={{...S,fontSize:'2.5rem',fontWeight:700,color:'#00c850',letterSpacing:'.15em',lineHeight:1}}>TRACKER</div>
        <div style={{color:'#3a5a7a',fontSize:'.875rem',marginTop:'.75rem'}}>Copa do Mundo FIFA 2026™ · 980 figurinhas</div>
      </div>

      <div className="card" style={{width:'100%',maxWidth:'24rem',padding:'1.75rem'}}>
        {emailSent && (
          <div style={{textAlign:'center',padding:'1rem 0'}}>
            <div style={{fontSize:'3rem',marginBottom:'.75rem'}}>📧</div>
            <p style={{color:'#f0f8ff',fontWeight:700,fontSize:'1.125rem',marginBottom:'.5rem'}}>Confirme seu email</p>
            <p style={{color:'#6b93b8',fontSize:'.875rem',lineHeight:1.6,marginBottom:'1.25rem'}}>Enviamos um link de confirmação para <strong style={{color:'#f0f8ff'}}>{email}</strong>. Clique no link para ativar sua conta.</p>
            <button onClick={()=>setEmailSent(false)} className="btn-ghost" style={{width:'100%'}}>Voltar</button>
          </div>
        )}
        {!emailSent && <>
        {/* Google OAuth em destaque */}
        <button onClick={handleGoogle} disabled={gLoading||blocked} aria-label="Entrar com Google"
          style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'.75rem',padding:'.875rem',borderRadius:'1rem',background:'white',color:'#1f2937',fontWeight:600,fontSize:'1rem',border:'none',cursor:'pointer',marginBottom:'1rem',opacity:gLoading||blocked?.5:1}}>
          {gLoading ? <span style={{width:20,height:20,border:'2px solid #ccc',borderTopColor:'#333',borderRadius:'50%'}} className="animate-spin"/> :
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          }
          {gLoading ? 'Conectando...' : 'Entrar com Google'}
        </button>

        <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1rem'}}>
          <div style={{flex:1,height:1,background:'#1e3a5a'}}/>
          <span style={{color:'#3a5a7a',fontSize:'.75rem'}}>ou use email e senha</span>
          <div style={{flex:1,height:1,background:'#1e3a5a'}}/>
        </div>

        <div style={{display:'flex',background:'#060d1a',borderRadius:'1rem',padding:'.25rem',gap:'.25rem',marginBottom:'1.25rem'}}>
          {(['login','cadastro'] as const).map(t => (
            <button key={t} onClick={()=>{setTab(t);setErro('');setAttempts(0)}} aria-pressed={tab===t}
              style={{flex:1,padding:'.625rem',borderRadius:'.75rem',border:'none',cursor:'pointer',fontWeight:600,fontSize:'.875rem',
                background:tab===t?'linear-gradient(135deg,#00c850,#009640)':'transparent',
                color:tab===t?'#060d1a':'#3a5a7a'}}>
              {t==='login'?'Entrar':'Cadastrar'}
            </button>
          ))}
        </div>

        {tab==='cadastro' && (
          <>
            <div style={{marginBottom:'1rem'}}>
              <label htmlFor="auth-nome" style={{display:'block',color:'#6b93b8',fontSize:'.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'.375rem'}}>Seu nome</label>
              <input id="auth-nome" type="text" className="ft-input" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex: João Silva" autoComplete="name" aria-required="true"/>
            </div>
            <div style={{marginBottom:'1rem'}}>
              <label htmlFor="auth-nascimento" style={{display:'block',color:'#6b93b8',fontSize:'.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'.375rem'}}>Ano de nascimento</label>
              <input id="auth-nascimento" type="number" className="ft-input" value={birthYear} onChange={e=>setBirthYear(e.target.value)} placeholder="Ex: 2001" min="1900" max="2026" aria-required="true"/>
              {ageBlocked && <p style={{color:'#ff4757',fontSize:'.75rem',marginTop:'.375rem'}}>⛔ Menores de 12 anos não podem usar este app.</p>}
              {ageParental && <p style={{color:'#ff9500',fontSize:'.75rem',marginTop:'.375rem'}}>⚠️ Para menores de 15 anos, recomendamos que um responsável acompanhe o cadastro.</p>}
            </div>
          </>
        )}

        <div style={{marginBottom:'1rem'}}>
          <label htmlFor="auth-email" style={{display:'block',color:'#6b93b8',fontSize:'.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'.375rem'}}>Email</label>
          <input id="auth-email" type="email" className="ft-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="email" aria-required="true"/>
        </div>

        <div style={{marginBottom:'1.25rem'}}>
          <label htmlFor="auth-senha" style={{display:'block',color:'#6b93b8',fontSize:'.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'.375rem'}}>Senha</label>
          <div style={{position:'relative'}}>
            <input id="auth-senha" type={showPw?'text':'password'} className="ft-input" style={{paddingRight:'3rem'}}
              value={senha} onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleEmail()}
              placeholder="Mínimo 6 caracteres" autoComplete={tab==='login'?'current-password':'new-password'} aria-required="true"/>
            <button type="button" onClick={()=>setShowPw(!showPw)} aria-label={showPw?'Ocultar senha':'Mostrar senha'}
              style={{position:'absolute',right:'.75rem',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:'1.125rem',color:'#3a5a7a'}}>
              {showPw?'🙈':'👁️'}
            </button>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'.625rem',marginBottom:'1.25rem'}}>
          <label style={{display:'flex',alignItems:'flex-start',gap:'.75rem',cursor:'pointer'}}>
            <input type="checkbox" checked={consentPriv} onChange={e=>setConsentPriv(e.target.checked)} style={{marginTop:'.2rem',accentColor:'#00c850',flexShrink:0}} aria-required="true"/>
            <span style={{color:'#6b93b8',fontSize:'.8125rem',lineHeight:1.6}}>
              Li e aceito a <a href="/privacidade" style={{color:'#00c850'}} target="_blank" rel="noopener noreferrer">Política de Privacidade</a>. Dados protegidos pela LGPD.
            </span>
          </label>
          <label style={{display:'flex',alignItems:'flex-start',gap:'.75rem',cursor:'pointer'}}>
            <input type="checkbox" checked={consentTerms} onChange={e=>setConsentTerms(e.target.checked)} style={{marginTop:'.2rem',accentColor:'#00c850',flexShrink:0}} aria-required="true"/>
            <span style={{color:'#6b93b8',fontSize:'.8125rem',lineHeight:1.6}}>
              Li e aceito os <a href="/termos" style={{color:'#00c850'}} target="_blank" rel="noopener noreferrer">Termos de Uso</a>. Confirmo que tenho 12 anos ou mais (ou sou responsável pelo menor).
            </span>
          </label>
        </div>

        {erro && (
          <div role="alert" style={{display:'flex',gap:'.5rem',background:'#2a0a0a',border:'1px solid rgba(255,71,87,.5)',borderRadius:'.75rem',padding:'.75rem',marginBottom:'1rem',color:'#ff8090',fontSize:'.875rem'}}>
            <span aria-hidden="true">⚠️</span><span>{erro}</span>
          </div>
        )}

        <button onClick={handleEmail} disabled={loading||blocked} aria-label={tab==='login'?'Entrar':'Criar conta'} className="btn-primary">
          {loading ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'.5rem'}}><span style={{width:20,height:20,border:'2px solid rgba(255,255,255,.4)',borderTopColor:'white',borderRadius:'50%'}} className="animate-spin"/>Aguarde...</span>
            : tab==='login'?'⚽  ENTRAR':'🎉  CRIAR CONTA GRÁTIS'}
        </button>

        <p style={{textAlign:'center',color:'#3a5a7a',fontSize:'.75rem',marginTop:'1.25rem',lineHeight:1.6}}>
          🔒 Imagens descartadas imediatamente após análise. Nunca armazenamos fotos.
        </p>
        </>}
      </div>
    </div>
  )
}
