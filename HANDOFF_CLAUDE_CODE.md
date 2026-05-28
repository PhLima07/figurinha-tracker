# 🚀 HANDOFF — FigurinhaTracker · Copa 2026

> **Para o Claude do terminal:** Este é um projeto Next.js já estruturado. O usuário já tem TODOS os arquivos prontos. Sua função é ajudar ele a continuar o desenvolvimento, fazer o deploy ou adicionar funcionalidades. Leia este documento INTEIRO antes de fazer qualquer alteração.

---

## 📋 SOBRE O PROJETO

**Nome:** FigurinhaTracker
**O que é:** App web para gerenciar coleção de figurinhas da Copa do Mundo FIFA 2026 (álbum Panini com 980 figurinhas, 48 seleções)
**Status:** MVP completo, pronto para deploy
**Prazo:** Antes de 11/06/2026 (início da Copa)

---

## 🏛️ DECISÕES VINCULANTES (PARLAMENTO)

O projeto foi desenhado por 9 personas (DevMax, Clara, Toninho, Rebeca, Prof. Segura, Marina, Zé Roberto, Ana Lúcia, Roberto Dados) que aprovaram tudo por unanimidade. **Estas decisões são vinculantes** — qualquer mudança precisa respeitar:

### 1. Stack tecnológica (APROVADA)
- **Frontend:** Next.js 14 + React 18 + **TypeScript** (DevMax exigiu, não usar JS puro)
- **Estilo:** Tailwind CSS
- **Backend/Auth/DB:** Supabase (com **RLS obrigatório** desde o dia 1)
- **IA:** Claude Vision API — modelo `claude-sonnet-4-20250514`
- **Deploy:** Vercel

### 2. Autenticação
- **Google OAuth em destaque** (botão branco grande no topo)
- Email/senha como opção secundária
- **Tokens em cookies httpOnly** (NUNCA localStorage)
- **Bloqueio após 5 tentativas falhas** de login (5 min de espera)
- **MFA disponível** como opção
- **Multi-perfil por conta** prometido para v1.1 (Zé Roberto)
- **Onboarding de 3 passos** após cadastro (Clara)

### 3. Escaneamento (4 MODOS obrigatórios — Ana Lúcia)
- **Câmera** (individual + lote) com 2 submodos: "costas" e "página do álbum"
- **Digitação manual** de código
- **Upload de imagem** da galeria
- **Importação por lista de texto** (ex: "BRA01, BRA03")
- **EXIF removido** antes de enviar (recodificação canvas→JPEG)
- **Imagens DESCARTADAS imediatamente** após análise (Prof. Segura)
- **Idempotência garantida** — mesma figurinha 2x incrementa quantity (DevMax)
- **Limite de scans no free** com contador visível (Marina) — atual: 50/mês
- **Timestamp de cada scan** registrado (Roberto Dados)
- Feedback em português humano para erros (Toninho — sem termos técnicos)

### 4. Dashboard
**Free (atual):**
- 3 métricas grandes: **Tenho / Faltam / Repetidas** (Toninho — sagradas)
- Progresso por seleção com bandeira
- Status com **ícone + texto + cor** (NUNCA só cor — Ana Lúcia)
- Custo estimado em envelopes/reais

**Premium (v1.1):**
- Gráficos de progresso ao longo do tempo
- Projeção de conclusão
- Ranking de repetidas
- Exportação CSV (já está disponível no free)

### 5. Social
**MVP (atual):**
- Cards de conquistas compartilháveis (navigator.share + clipboard fallback)
- 10 conquistas implementadas

**v1.1:**
- Sistema de trocas
- Ranking entre amigos
- Seguir colecionadores
- Perfis públicos com opt-in

### 6. Privacidade (LGPD)
- Dados mínimos: nome, email, coleção
- **Direito de exclusão** implementado (botão no perfil)
- Imagens descartadas após análise
- Política em linguagem simples + link
- **Perfis de menores PRIVADOS por padrão, sem exceções** (Prof. Segura + Zé Roberto)
- Consentimento explícito no cadastro (checkbox)

### 7. Acessibilidade (WCAG AA)
- Contraste adequado em todos os textos
- ARIA labels corretos
- **NUNCA depender só de cor** — sempre ícone+texto
- `prefers-reduced-motion` respeitado
- Todas funcionalidades acessíveis sem câmera
- Labels visíveis (não só placeholders)

### 8. Performance
- **Paginação de 100 figurinhas por página** (não renderizar 980 de uma vez — DevMax)
- Lazy loading de imagens
- Bottom navigation fixa

---

## 📁 ESTRUTURA DE ARQUIVOS (22 arquivos)

```
figurinha-tracker/
├── package.json              # Next.js 14, React 18, TypeScript, Supabase
├── tsconfig.json             # TypeScript strict
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.local.example        # Template das variáveis de ambiente
├── README.md                 # Guia de deploy passo a passo
│
├── supabase/
│   └── schema.sql            # Tabelas profiles + user_stickers + RLS + triggers
│
├── lib/
│   ├── data.ts               # 48 times, 980 figurinhas, conquistas, helpers
│   └── supabase.ts           # Cliente Supabase + CRUD (com idempotência)
│
├── styles/
│   └── globals.css           # Design system: dark navy + verde + ouro
│
├── pages/
│   ├── _app.tsx              # SessionContextProvider Supabase
│   ├── index.tsx             # Orquestrador: loading→auth→onboarding→app
│   └── api/
│       └── analyze.ts        # Proxy seguro Claude Vision (auth + rate limit)
│
└── components/
    ├── AuthScreen.tsx         # Google OAuth + email/senha + LGPD
    ├── OnboardingScreen.tsx   # 3 passos animados
    ├── MainApp.tsx            # Shell + bottom nav 5 tabs
    ├── DashboardView.tsx      # 3 números + progresso por seleção
    ├── ScannerView.tsx        # 4 modos + 2 submodos câmera
    ├── CollectionView.tsx     # Grid (5 cols) + lista, paginação 100/pg
    ├── AchievementsView.tsx   # 10 conquistas + compartilhamento
    └── ProfileView.tsx        # Stats + CSV + exclusão LGPD
```

---

## 🔑 VARIÁVEIS DE AMBIENTE

Criar `.env.local` na raiz:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_publica
ANTHROPIC_API_KEY=sk-ant-sua_chave_anthropic
```

**Onde pegar:**
- Supabase: Settings → API → Project URL e anon key
- Anthropic: console.anthropic.com → API Keys

---

## 🗄️ BANCO DE DADOS

**Tabelas (definidas em `supabase/schema.sql`):**

### `profiles`
```sql
id          uuid PK (FK auth.users)
name        text
is_premium  boolean default false
scan_count  integer default 0
scan_limit  integer default 50
joined_at   timestamptz
updated_at  timestamptz
```

### `user_stickers`
```sql
id          uuid PK
user_id     uuid FK profiles
sticker_id  text          # ex: "BRA-07", "FIFA-01"
quantity    integer       # >1 = repetida
pasted      boolean       # true = colada no álbum
added_at    timestamptz   # timestamp do scan
updated_at  timestamptz
UNIQUE(user_id, sticker_id)
```

**RLS:** Ativado em ambas. Política `auth.uid() = user_id`.

**Funções:**
- `handle_new_user()` — trigger que cria profile ao cadastrar
- `set_updated_at()` — trigger de updated_at
- `increment_scan_count(uid)` — incremento atômico de scans

---

## 🎨 DESIGN SYSTEM

**Cores:**
- Background: `#060d1a` (dark navy)
- Surface: `#0d1f33`
- Border: `#1e3a5a`
- Verde principal: `#00c850`
- Ouro: `#ffd60a`
- Laranja (repetidas): `#ff9500`
- Azul (tenho): `#3b82f6`
- Cinza (faltando): `#6b93b8`

**Fontes:**
- Display: Oswald (headings, números grandes)
- Body: DM Sans

**Layout:** Mobile-first, max-width 430px centralizado

---

## 📊 DADOS DAS FIGURINHAS

- **Total: 980 figurinhas**
- **20 institucionais** (FIFA-01 a FIFA-20) — todas especiais
- **48 times × 20 figurinhas cada** = 960
- Por time: escudo (especial) + panorâmica + 16 jogadores + 2 uniformes
- **68 especiais/metalizadas:** 20 institucionais + 48 escudos

**Formato dos IDs:** `SIGLA-NÚMERO` com 2 dígitos
- Exemplos: `BRA-07`, `ARG-15`, `FRA-02`, `FIFA-01`
- Validação regex: `/^[A-Z]{2,5}-\d{2}$/`

**Confederações:**
- CONMEBOL (6): BRA, ARG, COL, ECU, URU, VEN
- CONCACAF (8): USA, MEX, CAN, CRC, PAN, HON, JAM, GUA
- UEFA (16): ESP, FRA, ENG, GER, POR, NED, ITA, BEL, CRO, SUI, DEN, SRB, AUT, SCO, TUR, UKR
- CAF (9): MAR, SEN, EGY, NGA, CMR, TUN, MLI, RSA, CIV
- AFC (8): JPN, KOR, IRN, KSA, AUS, IRQ, JOR, IDN
- OFC (1): NZL

---

## 🚦 PRÓXIMOS PASSOS POR ORDEM DE PRIORIDADE

### 1. Deploy (urgente — antes de 11/06/2026)
- [ ] Criar projeto Supabase
- [ ] Executar `supabase/schema.sql` no SQL Editor
- [ ] Configurar Google OAuth no Supabase (Authentication → Providers)
- [ ] Criar chave da Anthropic API com limite de gasto
- [ ] Push do projeto pro GitHub
- [ ] Importar no Vercel com as 3 variáveis de ambiente
- [ ] Configurar Site URL e Redirect URLs no Supabase

### 2. Páginas legais (ainda não criadas)
- [ ] `pages/privacidade.tsx` — política em linguagem simples (Clara + Ana Lúcia)
- [ ] `pages/termos.tsx` — termos de uso

Os links já existem no AuthScreen e ProfileView, só faltam as páginas.

### 3. v1.1 (Julho 2026 — pós-validação MVP)
- [ ] Sistema de trocas entre usuários
- [ ] Multi-perfil por conta (um pai com vários filhos colecionando)
- [ ] Dashboard premium com gráficos
- [ ] Ranking entre amigos
- [ ] Notificações de troca

### 4. v2.0 (pós-Copa)
- [ ] Copas históricas (1970, 1994, 2002, 2018, 2022)
- [ ] API pública
- [ ] Multi-idioma (EN, ES)

---

## ⚠️ ARMADILHAS COMUNS PARA EVITAR

1. **NÃO use JavaScript puro** — TypeScript é obrigatório (DevMax)
2. **NÃO esqueça o RLS** — toda nova tabela precisa de Row Level Security
3. **NÃO armazene imagens no servidor** — análise e descarte imediato (Prof. Segura)
4. **NÃO use só cor para indicar status** — sempre ícone + texto + cor (Ana Lúcia)
5. **NÃO renderize as 980 figurinhas de uma vez** — usar paginação de 100 (DevMax)
6. **NÃO exponha a ANTHROPIC_API_KEY no frontend** — sempre via `/api/analyze` (proxy)
7. **NÃO use localStorage para tokens** — cookies httpOnly via auth-helpers
8. **NÃO esqueça o EXIF** — sempre recodificar imagem antes de enviar
9. **NÃO ignore `prefers-reduced-motion`** — já está no CSS global

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Instalar dependências
npm install

# Rodar localmente
npm run dev
# → abre em http://localhost:3000

# Build de produção
npm run build

# Type-checking
npm run type-check

# Lint
npm run lint
```

---

## 💰 CUSTOS ESPERADOS

- **Vercel:** Grátis (Hobby plan suficiente)
- **Supabase:** Grátis (Free tier: 500MB DB, 50k MAU)
- **Anthropic API:** PAGO — ~R$ 0,05 a R$ 0,15 por scan
  - ⚠️ **CONFIGURAR LIMITE DE GASTO** no console.anthropic.com
  - Recomendação: R$ 50/mês inicial

**Por isso o parlamento decidiu pelo limite de 50 scans/mês no plano free** (Marina).

---

## 📚 REFERÊNCIAS RÁPIDAS

- Next.js Pages Router (NÃO App Router): https://nextjs.org/docs/pages
- Supabase Auth Helpers: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- Anthropic API: https://docs.anthropic.com/claude/reference/messages_post
- Tailwind CSS: https://tailwindcss.com/docs

---

## 🎯 RESUMO EM 30 SEGUNDOS

> FigurinhaTracker é um app web para gerenciar a coleção de figurinhas da Copa 2026.
> 22 arquivos prontos. Stack: Next.js 14 + TypeScript + Tailwind + Supabase + Claude Vision.
> 980 figurinhas, 48 seleções, 4 modos de scan, 10 conquistas, LGPD completa.
> Falta: criar páginas /privacidade e /termos, fazer deploy no Vercel.

**Bora codar! ⚽🏆**
