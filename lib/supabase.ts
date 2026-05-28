import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface DbProfile { id:string; name:string; is_premium:boolean; scan_count:number; scan_limit:number; joined_at:string; updated_at:string }
export interface DbUserSticker { id:string; user_id:string; sticker_id:string; quantity:number; pasted:boolean; added_at:string }

let _client: SupabaseClient|null = null
export function getSB(): SupabaseClient {
  if (!_client) _client = createPagesBrowserClient({ supabaseUrl:process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! })
  return _client
}

export async function fetchProfile(uid:string): Promise<DbProfile|null> {
  const {data,error} = await getSB().from('profiles').select('*').eq('id',uid).single()
  if(error){console.error('fetchProfile:',error.message);return null}
  return data as DbProfile
}

export async function updateProfile(uid:string,updates:Partial<DbProfile>): Promise<boolean> {
  const {error} = await getSB().from('profiles').update(updates).eq('id',uid)
  return !error
}

export async function fetchCollection(uid:string): Promise<DbUserSticker[]> {
  const {data,error} = await getSB().from('user_stickers').select('*').eq('user_id',uid)
  if(error){console.error('fetchCollection:',error.message);return[]}
  return (data??[]) as DbUserSticker[]
}

// Idempotencia garantida (DevMax)
export async function upsertStickers(uid:string,ids:string[]): Promise<{success:boolean;errors:string[]}> {
  const sb=getSB(); const errors:string[]=[]
  for(const stickerId of ids) {
    const {data:ex} = await sb.from('user_stickers').select('id,quantity').eq('user_id',uid).eq('sticker_id',stickerId).single()
    if(ex) { const{error}=await sb.from('user_stickers').update({quantity:ex.quantity+1}).eq('id',ex.id); if(error)errors.push(stickerId) }
    else   { const{error}=await sb.from('user_stickers').insert({user_id:uid,sticker_id:stickerId,quantity:1,pasted:false,added_at:new Date().toISOString()}); if(error)errors.push(stickerId) }
  }
  return {success:errors.length===0,errors}
}

export async function updateStickerStatus(uid:string,stickerId:string,pasted:boolean): Promise<boolean> {
  const{error}=await getSB().from('user_stickers').update({pasted}).eq('user_id',uid).eq('sticker_id',stickerId)
  return !error
}

export async function removeSticker(uid:string,stickerId:string): Promise<boolean> {
  const{error}=await getSB().from('user_stickers').delete().eq('user_id',uid).eq('sticker_id',stickerId)
  return !error
}

// LGPD — direito ao esquecimento (Prof. Segura)
export async function deleteAllUserData(uid:string): Promise<void> {
  const sb=getSB()
  await sb.from('user_stickers').delete().eq('user_id',uid)
  await sb.from('profiles').delete().eq('id',uid)
  await sb.auth.signOut()
}
