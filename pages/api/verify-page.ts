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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' })
  const sb = createPagesServerClient({ req, res })
  const { data: { session } } = await sb.auth.getSession()
  if (!session) return res.status(401).json({ error: 'Não autorizado' })
  if (!ok(session.user.id)) return res.status(429).json({ error: 'Muitas tentativas. Aguarde.' })
  const { image } = req.body as { image?: string }
  if (!image || image.length > 7000000) return res.status(400).json({ error: 'Imagem inválida' })

  const teamList = TEAMS.map(t => `${t.id}=${t.name}`).join(', ')
  const prompt = `Analise esta foto de uma página do álbum Panini Copa do Mundo FIFA 2026.

Times válidos: ${teamList}

Tarefas:
1. Identifique a seleção desta página (leia o cabeçalho/título/bandeira impressos na página)
2. Verifique cada figurinha colada: alguma pertence visivelmente a outra seleção? (uniforme errado, bandeira diferente, nome de outro time visível)
3. Se o código do slot estiver visível no álbum (ex: BRA-08), inclua-o no relato

Responda SOMENTE JSON válido (sem texto fora do JSON):
{"pageTeam":"BRA","issues":[{"slotCode":"BRA-08","description":"Figurinha com uniforme azul/branco listrado, parece ser Argentina"}]}

Se não houver problemas: {"pageTeam":"BRA","issues":[]}
Se não identificar a seleção: {"pageTeam":null,"issues":[]}`

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Chave de API não configurada no servidor.' })

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
    let parsed: { pageTeam: string | null; issues: Array<{ slotCode?: string; description: string }> }
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    } catch {
      return res.status(200).json({ pageTeam: null, teamName: null, teamFlag: null, issues: [], error: 'Não foi possível analisar a imagem.' })
    }
    const team = TEAMS.find(t => t.id === parsed.pageTeam)
    return res.status(200).json({
      pageTeam: parsed.pageTeam,
      teamName: team?.name ?? null,
      teamFlag: team?.flag ?? null,
      issues: (parsed.issues ?? []).slice(0, 20)
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[verify-page] Gemini error:', msg)
    return res.status(500).json({ error: `IA indisponível: ${msg}` })
  }
}

export const config = { api: { bodyParser: { sizeLimit: '8mb' } } }
