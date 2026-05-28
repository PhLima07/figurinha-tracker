import { useEffect, useState, useMemo } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import AuthScreen from '@/components/AuthScreen'
import OnboardingScreen from '@/components/OnboardingScreen'
import MainApp from '@/components/MainApp'
import { generateAllStickers, TEAMS, type CollectionMap } from '@/lib/data'
import { fetchProfile, fetchCollection, type DbProfile } from '@/lib/supabase'

type Screen = 'loading'|'auth'|'onboarding'|'app'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const [screen, setScreen] = useState<Screen>('loading')
  const [profile, setProfile] = useState<DbProfile|null>(null)
  const [collection, setCollection] = useState<CollectionMap>({})
  const allStickers = useMemo(() => generateAllStickers(), [])
  const teamById = useMemo(() => Object.fromEntries(TEAMS.map(t => [t.id, t])), [])

  useEffect(() => {
    async function init() {
      if (session === undefined) return
      if (!session) { setScreen('auth'); return }
      const prof = await fetchProfile(session.user.id)
      setProfile(prof)
      if (!prof) { setScreen('onboarding'); return }
      const rows = await fetchCollection(session.user.id)
      const col: CollectionMap = {}
      rows.forEach(r => { col[r.sticker_id] = { quantity:r.quantity, pasted:r.pasted, addedAt:r.added_at } })
      setCollection(col)
      setScreen('app')
    }
    init()
  }, [session])

  async function onOnboardingDone() {
    if (!session) return
    const prof = await fetchProfile(session.user.id)
    setProfile(prof)
    setScreen('app')
  }

  async function onLogout() {
    await supabase.auth.signOut()
    setProfile(null); setCollection({}); setScreen('auth')
  }

  if (screen === 'loading') return (
    <div className="app-shell" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',gap:'1rem'}}>
      <div style={{fontSize:'4rem',filter:'drop-shadow(0 0 20px rgba(0,200,80,0.5))'}}>⚽</div>
      <div style={{fontFamily:'Oswald',fontSize:'1.5rem',color:'#00c850',letterSpacing:'0.15em'}}>CARREGANDO...</div>
      <div style={{width:'2.5rem',height:'2.5rem',border:'4px solid #1e3a5a',borderTopColor:'#00c850',borderRadius:'50%'}} className="animate-spin" role="status" aria-label="Carregando"/>
    </div>
  )

  return (
    <div className="app-shell">
      {screen === 'auth'       && <AuthScreen onSuccess={() => setScreen('loading')} />}
      {screen === 'onboarding' && <OnboardingScreen userName={session?.user?.user_metadata?.name ?? 'Colecionador'} onComplete={onOnboardingDone} />}
      {screen === 'app' && profile && <MainApp profile={profile} collection={collection} setCollection={setCollection} allStickers={allStickers} teamById={teamById} onLogout={onLogout} onProfileUpdate={setProfile} />}
    </div>
  )
}
