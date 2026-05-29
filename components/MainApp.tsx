import { useState, useCallback, useRef } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import DashboardView from './DashboardView'
import ScannerView from './ScannerView'
import CollectionView from './CollectionView'
import AchievementsView from './AchievementsView'
import ProfileView from './ProfileView'
import { upsertStickers, updateStickerStatus, removeSticker, type DbProfile } from '@/lib/supabase'
import type { Sticker, CollectionMap, Team, CollectionEntry } from '@/lib/data'

export type AppTab = 'inicio'|'escanear'|'colecao'|'conquistas'|'perfil'

const TABS: {id:AppTab; label:string}[] = [
  {id:'inicio',     label:'Início'},
  {id:'escanear',   label:'Escanear'},
  {id:'colecao',    label:'Coleção'},
  {id:'conquistas', label:'Conquistas'},
  {id:'perfil',     label:'Perfil'},
]

function NavIcon({ tab, color, active }: { tab:AppTab; color:string; active:boolean }) {
  const sw = 1.8
  if (tab === 'inicio') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
      <path d="M9 22V12h6v10" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  )
  if (tab === 'escanear') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="1" y="6" width="22" height="16" rx="2" stroke={color} strokeWidth={sw}/>
      <circle cx="12" cy="14" r="4" stroke={color} strokeWidth={sw} fill={active ? color : 'none'} fillOpacity={active ? 0.15 : 0}/>
      <path d="M8.5 6l1.5-3h4l1.5 3" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>
    </svg>
  )
  if (tab === 'colecao') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="14" height="20" rx="2" stroke={color} strokeWidth={sw}/>
      <path d="M17 2h1a2 2 0 012 2v16a2 2 0 01-2 2h-1" stroke={color} strokeWidth={sw}/>
      <path d="M7 8h7M7 12h7M7 16h5" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  )
  if (tab === 'conquistas') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4h8v7a4 4 0 01-8 0V4z" stroke={color} strokeWidth={sw}/>
      <path d="M16 7h2a2 2 0 010 4h-2M8 7H6a2 2 0 000 4h2" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <path d="M12 15v5M9 20h6" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  )
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth={sw}/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  )
}

interface Props { profile:DbProfile; collection:CollectionMap; setCollection:(c:CollectionMap)=>void; allStickers:Sticker[]; teamById:Record<string,Team>; onLogout:()=>void; onProfileUpdate:(p:DbProfile)=>void }

export default function MainApp({ profile, collection, setCollection, allStickers, teamById, onLogout, onProfileUpdate }: Props) {
  const [tab, setTab] = useState<AppTab>('escanear')
  const [undo, setUndo] = useState<{id:string;entry:CollectionEntry}|null>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const user = useUser()

  const handleAdd = useCallback(async (ids:string[]) => {
    if (!user) return
    const col = {...collection}
    ids.forEach(id => { if(!col[id]) col[id]={quantity:1,pasted:false,addedAt:new Date().toISOString()}; else col[id]={...col[id],quantity:col[id].quantity+1} })
    setCollection(col)
    await upsertStickers(user.id, ids)
  }, [user, collection, setCollection])

  const handleUndo = useCallback(async () => {
    if (!undo || !user) return
    clearTimeout(undoTimerRef.current)
    const col = {...collection}
    col[undo.id] = undo.entry
    setCollection(col)
    setUndo(null)
    await upsertStickers(user.id, [undo.id])
    if (undo.entry.pasted) await updateStickerStatus(user.id, undo.id, true)
  }, [undo, user, collection, setCollection])

  const handleToggle = useCallback(async (id:string) => {
    if (!user) return
    const col = {...collection}
    const cur = col[id]
    if (!cur) { col[id]={quantity:1,pasted:false,addedAt:new Date().toISOString()}; setCollection(col); await upsertStickers(user.id,[id]) }
    else if (!cur.pasted) { col[id]={...cur,pasted:true}; setCollection(col); await updateStickerStatus(user.id,id,true) }
    else {
      const backup = {...cur}
      delete col[id]
      setCollection(col)
      await removeSticker(user.id, id)
      setUndo({id, entry: backup})
      clearTimeout(undoTimerRef.current)
      undoTimerRef.current = setTimeout(() => setUndo(null), 4000)
    }
  }, [user, collection, setCollection])

  return (
    <>
      <main id="main-content" tabIndex={-1}>
        {tab==='inicio'     && <DashboardView    profile={profile} collection={collection} allStickers={allStickers} teamById={teamById} onTabChange={setTab}/>}
        {tab==='escanear'   && <ScannerView      collection={collection} allStickers={allStickers} onAdd={handleAdd}/>}
        {tab==='colecao'    && <CollectionView   collection={collection} allStickers={allStickers} teamById={teamById} onToggle={handleToggle}/>}
        {tab==='conquistas' && <AchievementsView collection={collection} allStickers={allStickers}/>}
        {tab==='perfil'     && <ProfileView      profile={profile} collection={collection} allStickers={allStickers} teamById={teamById} onLogout={onLogout} onProfileUpdate={onProfileUpdate}/>}
      </main>

      {undo && (
        <div className="animate-slide-up" style={{position:'fixed',bottom:'calc(4.25rem + env(safe-area-inset-bottom, 0px) + .625rem)',left:'50%',transform:'translateX(-50%)',zIndex:100,display:'flex',alignItems:'center',gap:'.75rem',background:'#1e3a5a',border:'1px solid #3b82f6',borderRadius:'1rem',padding:'.75rem 1rem .75rem 1.25rem',boxShadow:'0 4px 24px rgba(0,0,0,.6)',minWidth:240,maxWidth:360}}>
          <span style={{color:'#f0f8ff',fontSize:'.875rem',flex:1}}>Figurinha removida</span>
          <button onClick={handleUndo} style={{color:'#3b82f6',fontWeight:700,fontSize:'.875rem',background:'none',border:'none',cursor:'pointer',padding:'.25rem .5rem',borderRadius:'.5rem'}} aria-label="Desfazer remoção">Desfazer</button>
        </div>
      )}

      <nav className="bottom-nav" aria-label="Navegação principal">
        {TABS.map(t => {
          const active = tab===t.id
          const color = active ? (t.id==='escanear'?'#00c850':'#ffd60a') : '#6b93b8'
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} aria-label={t.label} aria-current={active?'page':undefined}
              style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'.2rem',padding:'.625rem .25rem',background:'none',border:'none',cursor:'pointer',transition:'opacity .2s'}}>
              <span style={{filter:active?`drop-shadow(0 0 6px ${color})`:'none',transform:active?'scale(1.1)':'scale(1)',transition:'all .2s',display:'flex',opacity:active?1:.55}}>
                <NavIcon tab={t.id} color={color} active={active}/>
              </span>
              <span style={{fontSize:'.6875rem',fontWeight:600,letterSpacing:'.04em',color,opacity:active?1:.7}}>{t.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
