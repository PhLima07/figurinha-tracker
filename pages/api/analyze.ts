import type { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { TEAMS } from '@/lib/data'

const rateMap = new Map<string,{count:number;reset:number}>()
function ok(uid:string):boolean{
  const now=Date.now(); const e=rateMap.get(uid)
  if(!e||now>e.reset){rateMap.set(uid,{count:1,reset:now+60000});return true}
  if(e.count>=10)return false; e.count++; return true
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST')return res.status(405).json({found:[],error:'Método inválido'})
  const sb=createPagesServerClient({req,res})
  const{data:{session}}=await sb.auth.getSession()
  if(!session)return res.status(401).json({found:[],error:'Não autorizado'})
  if(!ok(session.user.id))return res.status(429).json({found:[],error:'Muitas tentativas. Aguarde.'})
  const{image}=req.body as{image?:string}
  if(!image||image.length>7000000)return res.status(400).json({found:[],error:'Imagem inválida'})
  const teams=TEAMS.map(t=>`${t.id}=${t.name}`).join(', ')
  const prompt=`Identifique códigos de figurinhas da Copa 2026 Panini na imagem.\nFormato: SIGLA-NUMERO (ex: BRA-07, FIFA-01)\nSiglas: ${teams}, FIFA=Especiais\nResponda SOMENTE JSON: {"encontradas":["BRA-07"]}\nSe nenhuma: {"encontradas":[]}`
  try{
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY!,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:500,messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:'image/jpeg',data:image}},{type:'text',text:prompt}]}]})})
    if(!r.ok)return res.status(502).json({found:[],error:'IA indisponível. Tente novamente.'})
    const d=await r.json()
    const text=(d.content??[]).map((c:{text?:string})=>c.text??'').join('')
    let found:string[]=[]
    try{const p=JSON.parse(text.replace(/```json|```/g,'').trim()) as{encontradas?:string[]};found=(p.encontradas??[]).filter((id:string)=>/^[A-Z]{2,5}-\d{2}$/.test(id))}catch{found=[]}
    return res.status(200).json({found})
  }catch{return res.status(500).json({found:[],error:'Erro inesperado.'})}
}
export const config={api:{bodyParser:{sizeLimit:'8mb'}}}
