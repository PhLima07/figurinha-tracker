# Parliament Tier 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement three Tier 3 features — Copa countdown widget, group progress (A-L) on Dashboard, and move "Verificar" out of primary scanner tabs.

**Architecture:** All changes are confined to existing files — a small data helper added to `lib/data.ts`, two new sections in `DashboardView.tsx`, and a UI reshuffle in `ScannerView.tsx`. No new files, no new routes, no DB changes.

**Tech Stack:** Next.js 14, React 18, TypeScript strict, inline styles (no Tailwind classes for layout).

---

### Task 1: Add `getGroupProgress` helper to `lib/data.ts`

**Files:**
- Modify: `lib/data.ts` (append after `getTeamProgress` at line 192)

- [ ] **Step 1: Add the helper at the end of the utility functions block**

Open `lib/data.ts`. After line 194 (`export function getTeamProgress...`), add:

```ts
export function getGroupProgress(group:string,col:CollectionMap):{owned:number;total:number}{
  const teams=TEAMS.filter(t=>t.group===group)
  return{owned:teams.reduce((s,t)=>s+getTeamProgress(t.id,col),0),total:teams.length*20}
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/pedro/Downloads/figurinha-tracker && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/data.ts
git commit -m "feat: add getGroupProgress helper for group A-L stats"
```

---

### Task 2: Copa countdown widget in DashboardView

**Files:**
- Modify: `components/DashboardView.tsx`

The countdown shows days and hours remaining to June 11, 2026. Updates every minute via `setInterval`. Placed between the greeting `<h1>` and the main `% geral` card.

- [ ] **Step 1: Add `useState` and `useEffect` to the import line**

Current line 1:
```ts
import { useMemo } from 'react'
```

Replace with:
```ts
import { useMemo, useState, useEffect } from 'react'
```

- [ ] **Step 2: Add countdown state + derived values inside the component, after the `custo` line (line 13)**

After:
```ts
const custo = Math.ceil(stats.missing/7)*7
```

Add:
```ts
const [now, setNow] = useState(() => Date.now())
useEffect(() => {
  const id = setInterval(() => setNow(Date.now()), 60_000)
  return () => clearInterval(id)
}, [])
const COPA_START = new Date('2026-06-11T00:00:00').getTime()
const copaMs   = Math.max(0, COPA_START - now)
const copaDays  = Math.floor(copaMs / 86_400_000)
const copaHours = Math.floor((copaMs % 86_400_000) / 3_600_000)
const copaStarted = copaMs === 0
```

- [ ] **Step 3: Insert the countdown card in JSX, between the `<h1>` and the `% geral` card**

The `<h1>` block ends at the closing `</h1>` tag (line 21). Insert the card immediately after it:

```tsx
      {/* Copa countdown */}
      <div className="card" style={{padding:'1rem 1.25rem',marginBottom:'1rem',background:'linear-gradient(135deg,#0d1f33,#091d0e)',borderColor:'#1a4a2a',display:'flex',alignItems:'center',gap:'1rem'}}>
        <span style={{fontSize:'2rem',filter:'drop-shadow(0 0 8px #ffd60a)'}} aria-hidden="true">🏆</span>
        <div style={{flex:1}}>
          <div style={{color:'#6b93b8',fontSize:'.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'.25rem'}}>Copa do Mundo 2026</div>
          {copaStarted
            ? <div style={{fontFamily:'Oswald',fontSize:'1.25rem',fontWeight:700,color:'#ffd60a'}}>A Copa começou! ⚽</div>
            : <div style={{display:'flex',gap:'1rem',alignItems:'baseline'}}>
                <span style={{fontFamily:'Oswald',fontSize:'1.875rem',fontWeight:700,color:'#ffd60a',lineHeight:1}} aria-label={`${copaDays} dias`}>{copaDays}<span style={{fontSize:'.75rem',color:'#6b93b8',marginLeft:'.25rem',fontFamily:'inherit',fontWeight:400}}>dias</span></span>
                <span style={{fontFamily:'Oswald',fontSize:'1.25rem',fontWeight:700,color:'#3a5a7a',lineHeight:1}} aria-label={`${copaHours} horas`}>{copaHours}<span style={{fontSize:'.75rem',color:'#3a5a7a',marginLeft:'.125rem',fontFamily:'inherit',fontWeight:400}}>h</span></span>
              </div>
          }
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:'.6875rem',color:'#3a5a7a'}}>11 JUN</div>
          <div style={{fontSize:'.6875rem',color:'#3a5a7a'}}>2026</div>
        </div>
      </div>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/pedro/Downloads/figurinha-tracker && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/DashboardView.tsx
git commit -m "feat: add Copa 2026 countdown widget to Dashboard"
```

---

### Task 3: Group progress section (A-L) in DashboardView

**Files:**
- Modify: `components/DashboardView.tsx`

Add a collapsible "Grupos A-L" section to the Dashboard. Shows 12 groups, each with an aggregate progress bar. Placed after "Top Seleções" and before "Custo estimado".

- [ ] **Step 1: Add `getGroupProgress` to the import from `@/lib/data`**

Current import line 3:
```ts
import { calcStats, getTeamProgress, getStickerStatus, STATUS_CONFIG, TEAMS, type Sticker, type CollectionMap, type Team } from '@/lib/data'
```

Replace with:
```ts
import { calcStats, getTeamProgress, getGroupProgress, getStickerStatus, STATUS_CONFIG, TEAMS, type Sticker, type CollectionMap, type Team } from '@/lib/data'
```

- [ ] **Step 2: Add `groupsOpen` toggle state and derived groups data**

After the `copaStarted` line (from Task 2), add:

```ts
const [groupsOpen, setGroupsOpen] = useState(false)
const LETTERS = [...new Set(TEAMS.map(t=>t.group))].sort()
const groupStats = useMemo(
  () => LETTERS.map(g => {
    const {owned,total} = getGroupProgress(g, collection)
    const pct = Math.round(owned/total*100)
    const teams = TEAMS.filter(t=>t.group===g)
    return {g, owned, total, pct, teams}
  }),
  [collection]
)
```

- [ ] **Step 3: Insert the group progress section in JSX, between the "Top seleções" card and the "Custo estimado" card**

The "Top seleções" section ends with `</div>` after the `topTeams.slice(0,6).map` block (around line 65). After that closing `</div>` that wraps the `.card`, add:

```tsx
      {/* Progresso por Grupo */}
      <button
        onClick={()=>setGroupsOpen(o=>!o)}
        aria-expanded={groupsOpen}
        style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'.75rem 0',background:'none',border:'none',cursor:'pointer',marginBottom:groupsOpen?'.5rem':'1.25rem'}}
      >
        <h2 style={{fontFamily:'Oswald',fontSize:'1.125rem',fontWeight:600,color:'#f0f8ff',margin:0}}>🌍 Progresso por Grupo</h2>
        <span style={{color:'#6b93b8',fontSize:'.875rem',transition:'transform .2s',transform:groupsOpen?'rotate(180deg)':'none'}} aria-hidden="true">▼</span>
      </button>

      {groupsOpen && (
        <div className="card animate-slide-up" style={{overflow:'hidden',marginBottom:'1.25rem'}}>
          {groupStats.map(({g,owned,total,pct,teams},i) => (
            <div key={g} style={{padding:'.875rem 1rem',borderBottom:i<11?'1px solid #1e3a5a':'none'}}>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.375rem'}}>
                <span style={{fontFamily:'Oswald',fontSize:'1rem',fontWeight:700,color:'#ffd60a',minWidth:'1.25rem'}}>{'ABCDEFGHIJKL'[i]}</span>
                <span style={{display:'flex',gap:'.25rem',flexWrap:'nowrap'}}>
                  {teams.map(t=><span key={t.id} style={{fontSize:'.875rem'}} aria-hidden="true">{t.flag}</span>)}
                </span>
                <span style={{marginLeft:'auto',fontSize:'.75rem',fontWeight:600,color:pct===100?'#ffd60a':'#6b93b8'}} aria-label={`${owned} de ${total}, ${pct}%`}>{owned}/{total}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
                <div className="progress-bar" style={{flex:1}} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className="progress-fill" style={{width:`${pct}%`,background:pct===100?'linear-gradient(90deg,#ffd60a,#ff9500)':undefined}}/>
                </div>
                <span style={{fontSize:'.6875rem',color:'#3a5a7a',width:'2.5rem',textAlign:'right',flexShrink:0}}>{pct}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/pedro/Downloads/figurinha-tracker && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/DashboardView.tsx lib/data.ts
git commit -m "feat: add group A-L progress section to Dashboard"
```

---

### Task 4: Move "Verificar" out of primary scanner tabs

**Files:**
- Modify: `components/ScannerView.tsx`

Remove `verificar` from the `MODES` array (so the 4-button grid becomes evenly spaced). Add a secondary "Verificar Página" card/button below the mode selector, visible when no scan is in progress.

- [ ] **Step 1: Remove `verificar` from the `MODES` array**

Current (lines 124-130):
```ts
const MODES=[
  {id:'camera'   as ScanMode,icon:'📷',label:'Câmera'},
  {id:'manual'   as ScanMode,icon:'⌨️',label:'Manual'},
  {id:'upload'   as ScanMode,icon:'🖼️',label:'Imagem'},
  {id:'lista'    as ScanMode,icon:'📝',label:'Lista'},
  {id:'verificar'as ScanMode,icon:'🔍',label:'Verificar'},
]
```

Replace with:
```ts
const MODES=[
  {id:'camera'   as ScanMode,icon:'📷',label:'Câmera'},
  {id:'manual'   as ScanMode,icon:'⌨️',label:'Manual'},
  {id:'upload'   as ScanMode,icon:'🖼️',label:'Imagem'},
  {id:'lista'    as ScanMode,icon:'📝',label:'Lista'},
]
```

- [ ] **Step 2: Update the grid template from 5 to 4 columns**

Current (line 138):
```tsx
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'.375rem',padding:'.75rem 1rem'}}>
```

Replace with:
```tsx
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'.375rem',padding:'.75rem 1rem'}}>
```

- [ ] **Step 3: Add secondary "Verificar" entry below the mode grid**

After the closing `</div>` of the mode buttons grid and before `<div style={{padding:'0 1rem'}}>`, add:

```tsx
      {mode !== 'verificar' && (
        <div style={{padding:'0 1rem .5rem'}}>
          <button onClick={()=>switchMode('verificar')}
            style={{width:'100%',display:'flex',alignItems:'center',gap:'.75rem',padding:'.75rem 1rem',background:'#060d1a',border:'1px solid #1e3a5a',borderRadius:'.75rem',cursor:'pointer',color:'#6b93b8',fontSize:'.875rem',fontWeight:600}}>
            <span style={{fontSize:'1.25rem'}} aria-hidden="true">🔍</span>
            <span>Verificar Página do Álbum</span>
            <span style={{marginLeft:'auto',fontSize:'.75rem',color:'#3a5a7a'}} aria-hidden="true">→</span>
          </button>
        </div>
      )}
      {mode === 'verificar' && (
        <div style={{padding:'0 1rem .5rem'}}>
          <button onClick={()=>switchMode('camera')}
            style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.5rem .75rem',background:'none',border:'1px solid #1e3a5a',borderRadius:'.75rem',cursor:'pointer',color:'#6b93b8',fontSize:'.8125rem',fontWeight:600}}>
            <span aria-hidden="true">←</span> Voltar ao scanner
          </button>
        </div>
      )}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/pedro/Downloads/figurinha-tracker && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/ScannerView.tsx
git commit -m "feat: move Verificar out of primary scanner tabs to secondary entry"
```

---

### Task 5: Open PR for Tier 3

- [ ] **Step 1: Push branch and open PR**

```bash
git checkout -b feat/parliament-tier3
git push -u origin feat/parliament-tier3
gh pr create \
  --title "feat: parliament Tier 3 — countdown, grupos A-L, verificar secundário" \
  --body "## Tier 3 do Parliament Roadmap

- **Copa countdown** — widget no Dashboard com dias e horas até 11/06/2026, atualiza a cada minuto
- **Grupos A-L** — seção expansível no Dashboard com progresso agregado por grupo (4 times × 20 figurinhas = 80/grupo)
- **Verificar** — removido das tabs principais do scanner; acessível via card secundário abaixo do seletor de modo

Nenhuma alteração de DB/API. Somente \`DashboardView.tsx\`, \`ScannerView.tsx\`, \`lib/data.ts\`."
```

- [ ] **Step 2: Verify Vercel preview deploy passes**

```bash
gh pr checks
```

Expected: all checks green.
