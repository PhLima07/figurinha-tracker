# ⚽ FigurinhaTracker — Copa do Mundo 2026

Gerencie suas 980 figurinhas da Copa do Mundo FIFA 2026™.

## 🚀 Deploy em 5 passos

### 1. Supabase (banco de dados)
1. Crie conta em [supabase.com](https://supabase.com)
2. Crie um projeto novo
3. Vá em **SQL Editor → New Query**
4. Cole o conteúdo de `supabase/schema.sql` e clique **Run**
5. Em **Settings → API**, copie a **Project URL** e a **anon key**

### 2. Anthropic (IA de visão)
1. Crie conta em [console.anthropic.com](https://console.anthropic.com)
2. Vá em **API Keys** e crie uma chave
3. Copie a chave (começa com `sk-ant-`)

### 3. GitHub
1. Crie um repositório novo em [github.com](https://github.com)
2. Faça upload de todos os arquivos deste projeto

### 4. Vercel (hospedagem)
1. Crie conta em [vercel.com](https://vercel.com)
2. Clique **Add New Project** → selecione o repositório
3. Em **Environment Variables**, adicione:

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `ANTHROPIC_API_KEY` | Sua chave da Anthropic |

4. Clique **Deploy** · aguarde ~2 minutos ✅

### 5. Configurar redirecionamento
No Supabase → **Authentication → URL Configuration**:
- **Site URL**: `https://SEU-PROJETO.vercel.app`
- **Redirect URLs**: `https://SEU-PROJETO.vercel.app/**`

---

## 📱 Funcionalidades

- **Escanear**: câmera · manual · upload · lista de texto
- **Dashboard**: 3 métricas + progresso por seleção + custo estimado
- **Coleção**: grade/lista + filtros + paginação
- **Conquistas**: 10 conquistas + compartilhamento
- **Perfil**: estatísticas + exportar CSV + exclusão LGPD

## 🏗️ Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · Supabase · Claude Vision API · Vercel

## 📊 Dados

- **980 figurinhas**: 20 especiais + 48 times × 20
- **68 metalizadas**: 20 institucionais + 48 escudos
- **48 seleções**: CONMEBOL · CONCACAF · UEFA · CAF · AFC · OFC

*Desenvolvido com ❤️ para a Copa do Mundo FIFA 2026™*
