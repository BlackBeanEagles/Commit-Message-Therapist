# Commit Message Therapist

[![GitHub stars](https://img.shields.io/github/stars/BlackBeanEagles/Commit-Message-Therapist?style=social)](https://github.com/BlackBeanEagles/Commit-Message-Therapist)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**Your code deserves mental health support.**

AI therapist analyzes your Git history and generates witty mental health diagnoses. Paste a public GitHub repo URL — we clone it, extract real Git metrics, and Claude generates a personalized therapy session.

**Repository:** [github.com/BlackBeanEagles/Commit-Message-Therapist](https://github.com/BlackBeanEagles/Commit-Message-Therapist)

---

## Motivation

Developers leave emotional fingerprints in Git: late-night commits, weekend pushes, merge-conflict rage, and messages like `fix fix fix please work`. Those patterns are real signals of workload and stress — but they are buried in thousands of commits and rarely discussed in retros.

**Commit Message Therapist** makes that invisible history visible and approachable. Instead of another dry dashboard, it reframes repo health as a therapy session: humorous enough to share, grounded enough to spark real conversations about boundaries, burnout, and team habits.

## Inspiration

- **Commit messages as mood rings** — `wip`, `finally`, and `revert revert` tell a story metrics alone cannot.
- **Developer wellness** — burnout is a people problem; Git history is an honest (if imperfect) mirror.
- **AI with receipts** — Claude does not guess; it interprets *your* numbers (late-night %, weekend load, author skew) so the diagnosis feels personal, not generic.

---

## Architecture

The app is a **Next.js 15** full-stack application: React UI, API routes for analysis, and a Git + Claude pipeline on the server.

```mermaid
flowchart TB
  subgraph client [Browser]
    UI[Landing / Compare / Results UI]
    Theme[ThemeProvider + localStorage]
  end

  subgraph api [Next.js API Routes]
    Analyze["POST /api/analyze"]
    Share["POST/GET /api/share"]
    Newsletter["POST /api/newsletter"]
    Health["GET /api/health"]
  end

  subgraph core [Core Libraries]
    GitAnalyzer[git-analyzer.ts]
    Claude[claude-therapist.ts]
    Cache[cache.ts]
    ShareStore[share-store.ts]
  end

  subgraph external [External]
    GitHub[(Public GitHub Repo)]
    ClaudeAPI[Anthropic Claude API]
  end

  UI --> Analyze
  UI --> Share
  UI --> Newsletter
  Analyze --> Cache
  Analyze --> GitAnalyzer
  GitAnalyzer --> GitHub
  Analyze --> Claude
  Claude --> ClaudeAPI
  Share --> ShareStore
```

### Layer responsibilities

| Layer | Role |
|-------|------|
| **`app/`** | Pages, API routes, global styles |
| **`components/`** | UI: metrics, diagnosis, theme, compare, featured examples |
| **`lib/git-analyzer.ts`** | Shallow clone, parse log, compute burnout and pattern metrics |
| **`lib/claude-therapist.ts`** | Structured prompt → JSON diagnosis; rule-based fallback without API key |
| **`lib/cache.ts`** | In-memory URL cache (1h TTL) for instant re-analysis |
| **`lib/share-store.ts`** | In-memory share IDs (7d TTL) for permalink results |

---

## Workflow

End-to-end flow from URL paste to shareable therapy session:

```mermaid
sequenceDiagram
  participant User
  participant UI as Next.js UI
  participant API as api/analyze
  participant Cache as cache.ts
  participant Git as git-analyzer
  participant Claude as claude-therapist

  User->>UI: Paste GitHub repo URL
  UI->>API: POST repoUrl
  API->>Cache: Check normalized URL
  alt Cache hit
    Cache-->>API: Cached AnalysisResult
    API-->>UI: JSON result
  else Cache miss
    API->>Git: Shallow clone + parse commits
    Git-->>API: GitMetrics
    API->>Claude: Metrics + sample messages
    Claude-->>API: TherapyDiagnosis JSON
    API->>Cache: Store result
    API-->>UI: JSON result
  end
  UI->>User: Metrics dashboard + diagnosis
  User->>UI: Copy share link optional
  UI->>API: POST /api/share
  API-->>User: Permalink /r/id
```

### Analysis pipeline (detail)

1. **Validate URL** — `github-url.ts` parses owner/repo and normalizes the link.
2. **Clone** — Shallow clone (last ~500 commits) into a temp directory via `simple-git`.
3. **Extract metrics** — Late-night %, weekends, merges, frustration keywords, author distribution, burnout score (1–10).
4. **Generate diagnosis** — Metrics sent to Claude with a strict JSON schema; fallback rules if no API key.
5. **Present & share** — Dashboard with severity badges; optional permalink via `/r/{id}`.

---

## How Claude AI is used

Claude is not a free-form chatbot here — it is a **structured diagnosis engine** fed by real repo data:

1. **Git analysis engine** clones the repo (shallow, last 500 commits) and computes metrics: late-night commits, weekend work, merge conflicts, frustration keywords, author patterns, burnout risk (1–10).
2. **Metrics + sample commit messages** are sent in a single prompt so every claim ties back to actual numbers.
3. **Claude returns JSON**: emoji, title, multi-paragraph diagnosis, severity (`mild` → `critical`), suggestions, and a tweet-ready summary.
4. **Fallback mode** works without an API key (rule-based diagnosis) so the app still runs for demos and local testing.

---

## Features

- Single URL input → full analysis in ~30–60s
- Metrics dashboard: commits, late-night %, weekends, merges, burnout score
- **Colored severity indicators** next to burnout score and diagnosis
- AI therapy diagnosis with humor + real insights
- **Dark / light mode toggle** (persists in `localStorage`)
- **Featured diagnoses** on the landing page with one-click analyze
- **Share via link** — copy a permalink to any result (`/r/{id}`)
- **Compare repos** — side-by-side burnout and diagnosis for two codebases
- One-click **Share on X** with pre-filled tweet
- Copy diagnosis to clipboard
- **Optional newsletter signup** for product updates
- In-memory cache (same repo = instant replay)
- Cmd/Ctrl+Enter to submit
- Purple gradient UI, responsive mobile layout

---

## Quick start

```bash
git clone https://github.com/BlackBeanEagles/Commit-Message-Therapist.git
cd Commit-Message-Therapist
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Requires **Git** installed locally for cloning.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Recommended | Claude API key from [console.anthropic.com](https://console.anthropic.com/) |
| `CLAUDE_MODEL` | Optional | Default: `claude-sonnet-4-6`. Use `claude-opus-4-7` for best quality |

### Example repos to try

- https://github.com/facebook/react
- https://github.com/vercel/next.js
- https://github.com/torvalds/linux

---

## Deploy (Vercel)

1. Push to [GitHub](https://github.com/BlackBeanEagles/Commit-Message-Therapist)
2. [Import in Vercel](https://vercel.com)
3. Set `ANTHROPIC_API_KEY` in project settings
4. Use smaller public repos first — serverless has time limits; `maxDuration` is **120s** on `/api/analyze`

> **Note:** Share links and cache use in-memory storage. For production at scale, replace with Redis or a database.

---

## Project structure

```
app/
  page.tsx                 # Landing + analyze / compare UI
  r/[id]/page.tsx          # Shared result permalink
  api/analyze/route.ts     # Clone → metrics → Claude
  api/share/route.ts       # Create and fetch share links
  api/newsletter/route.ts  # Optional email signup
  api/health/route.ts      # Health check
components/                # Theme, severity, featured, compare, newsletter, results
lib/
  git-analyzer.ts          # Git clone + metrics
  claude-therapist.ts      # Claude API + fallback
  cache.ts                 # URL-based analysis cache
  share-store.ts           # Shareable result IDs
  featured-diagnoses.ts    # Landing page examples
  severity.ts              # Severity colors and mapping
  github-url.ts            # URL validation
  types.ts                 # Shared TypeScript types
```

---

## Tech stack

- **Framework:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Git:** simple-git (shallow clone + log parsing)
- **AI:** Anthropic Claude (`@anthropic-ai/sdk`)

---

## License

MIT — see [LICENSE](LICENSE).
