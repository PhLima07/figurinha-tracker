import { useState, useCallback } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import DashboardView from './DashboardView'
import ScannerView from './ScannerView'
import CollectionView from './CollectionView'
import AchievementsView from './AchievementsView'
import ProfileView from './ProfileView'
import { upsertStickers, updateStickerStatus, removeSticker, type DbProfile } from '@/lib/supabase'
import type { Sticker, CollectionMap, Team } from '@/lib/data'

export type AppTab = 'inicio'|'escanear'|'colecao'|'conquistas'|'perfil'
const TABS: {id:AppTab;icon:string;label:string}[] = [
  {id:'inicio',     icon:'🏠',label:'Início'},
  {id:'escanear',   icon:'📷',label:'Escanear'},
  {id:'colecao',    icon:'📒',label:'Coleção'},
  {id:'conquistas', icon:'🏆',label:'Conquistas'},
  {id:'perfil',     icon:'👤',label:'Perfil'},
]

interface Props { profile:DbProfile; collection:CollectionMap; setCollection:(c:CollectionMap)=>void; allStickers:Sticker[]; teamById:Record<string,Team>; onLogout:()=>void; onProfileUpdate:(p:DbProfile)=>void }

export default function MainApp({ profile, collection, setCollection, allStickers, teamById, onLogout, onProfileUpdate }: Props) {
  const [tab, setTab] = useState<AppTab>('escanear')
  const user = useUser()

  const handleAdd = useCallback(async (ids:string[]) => {
    if (!user) return
    const col = {...collection}
    ids.forEach(id => { if(!col[id]) col[id]={quantity:1,pasted:false,addedAt:new Date().toISOString()}; else col[id]={...col[id],quantity:col[id].quantity+1} })
    setCollection(col)
    await upsertStickers(user.id, ids)
  }, [user, collection, setCollection])

  const handleToggle = useCallback(async (id:string) => {
    if (!user) return
    const col = {...collection}
    const cur = col[id]
    if (!cur) { col[id]={quantity:1,pasted:false,addedAt:new Date().toISOString()}; await upsertStickers(user.id,[id]) }
    else if (!cur.pasted) { col[id]={...cur,pasted:true}; await updateStickerStatus(user.id,id,true) }
    else { delete col[id]; await removeSticker(user.id,id) }
    setCollection(col)
  }, [user, collection, setCollection])

  return (
    <>
      <main id="main-content" tabIndex={-1}>
        {tab==='inicio'     && <DashboardView    profile={profile} collection={collection} allStickers={allStickers} teamById={teamById} onTabChange={setTab}/>}
        {tab==='escanear'   && <ScannerView      profile={profile} collection={collection} allStickers={allStickers} onAdd={handleAdd} onProfileUpdate={onProfileUpdate}/>}
        {tab==='colecao'    && <CollectionView   collection={collection} allStickers={allStickers} teamById={teamById} onToggle={handleToggle}/>}
        {tab==='conquistas' && <AchievementsView collection={collection} allStickers={allStickers}/>}
        {tab==='perfil'     && <ProfileView      profile={profile} collection={collection} allStickers={allStickers} teamById={teamById} onLogout={onLogout} onProfileUpdate={onProfileUpdate}/>}
      </main>
      <nav className="bottom-nav" aria-label="Navegação principal">
        {TABS.map(t => {
          const active = tab===t.id
          const color = active ? (t.id==='escanear'?'#00c850':'#ffd60a') : '#6b93b8'
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} aria-label={t.label} aria-current={active?'page':undefined}
              style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'.125rem',padding:'.625rem .25rem',background:'none',border:'none',cursor:'pointer',opacity:active?1:.6,transition:'opacity .2s'}}>
              <span style={{fontSize:'1.25rem',filter:active?`drop-shadow(0 0 6px ${color})`:'none',transform:active?'scale(1.1)':'scale(1)',transition:'all .2s'}} aria-hidden="true">{t.icon}</span>
              <span style={{fontSize:'.5625rem',fontWeight:600,letterSpacing:'.05em',color}}>{t.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
