import type { NextApiRequest, NextApiResponse } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { TEAMS } from '@/lib/data'

const rateMap = new Map<string, { count: number; reset: number }>()
function ok(uid: string): boolean {
  const now = Date.now(); const e = rateMap.get(uid)
  if (!e || now > e.reset) { rateMap.set(uid, { count: 1, reset: now + 60000 }); return true }
  if (e.count >= 10) return false; e.count++; return true
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ found: [], error: 'Método inválido' })
  const sb = createPagesServerClient({ req, res })
  const { data: { session } } = await sb.auth.getSession()
  if (!session) return res.status(401).json({ found: [], error: 'Não autorizado' })
  if (!ok(session.user.id)) return res.status(429).json({ found: [], error: 'Muitas tentativas. Aguarde.' })
  const { image } = req.body as { image?: string }
  if (!image || image.length > 7000000) return res.status(400).json({ found: [], error: 'Imagem inválida' })

  const teams = TEAMS.map(t => `${t.id}=${t.name}`).join(', ')
  const prompt = `Identifique códigos de figurinhas da Copa 2026 Panini na imagem.\nFormato: SIGLA-NUMERO (ex: BRA-07, FWC-03)\nSiglas válidas: ${teams}, FWC=Especiais introdutórias\nResponda SOMENTE JSON: {"encontradas":["BRA-07"]}\nSe nenhuma: {"encontradas":[]}`

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ found: [], error: 'Chave de API não configurada no servidor.' })

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await Promise.race([
      model.generateContent([
        { inlineData: { data: image, mimeType: 'image/jpeg' } },
        prompt
      ]),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error('IA timeout após 25s')), 25000))
    ])
    const text = result.response.text()
    let found: string[] = []
    try {
      const p = JSON.parse(text.replace(/```json|```/g, '').trim()) as { encontradas?: string[] }
      found = (p.encontradas ?? []).filter((id: string) => /^[A-Z]{2,5}-\d{2}$/.test(id))
    } catch { found = [] }
    return res.status(200).json({ found })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[analyze] Gemini error:', msg)
    return res.status(500).json({ found: [], error: `IA indisponível: ${msg}` })
  }
}

export const config = { api: { bodyParser: { sizeLimit: '8mb' } } }
