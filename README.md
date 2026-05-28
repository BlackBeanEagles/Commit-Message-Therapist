# Commit Message Therapist

[![GitHub stars](https://img.shields.io/github/stars/BlackBeanEagles/Commit-Message-Therapist?style=social)](https://github.com/BlackBeanEagles/Commit-Message-Therapist)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**Your code deserves mental health support.**

AI therapist analyzes your Git history and generates witty mental health diagnoses. Paste a public GitHub repo URL — we clone it, extract real Git metrics, and Claude generates a personalized therapy session.

Live demo: deploy to [Vercel](https://vercel.com) after setting `ANTHROPIC_API_KEY`.

## How Claude AI is used

1. **Git analysis engine** clones the repo (shallow, last 500 commits) and computes real metrics: late-night commits, weekend work, merge conflicts, frustration keywords, author patterns, burnout risk (1–10).
2. **Metrics + sample messages** are sent to Claude with a structured prompt — not generic chat, but data-driven diagnosis tied to *your* repo numbers.
3. **Claude returns JSON**: emoji, title, multi-paragraph diagnosis, severity, suggestions, and a tweet-ready summary.
4. **Fallback mode** works without an API key (rule-based diagnosis) so judges can still demo the flow.

## Quick start

```bash
cd win
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

## Example repos to try

- https://github.com/facebook/react
- https://github.com/vercel/next.js
- https://github.com/torvalds/linux

## Features

- Single URL input → full analysis in ~30–60s
- Metrics dashboard: commits, late-night %, weekends, merges, burnout score
- **Colored severity indicators** next to burnout score and diagnosis
- AI therapy diagnosis with humor + real insights
- **Dark / light mode toggle** (persists in localStorage)
- **Featured diagnoses** on the landing page with one-click analyze
- **Share via link** — copy a permalink to any result (`/r/{id}`)
- **Compare repos** — side-by-side burnout and diagnosis for two codebases
- One-click **Share on X** with pre-filled tweet
- Copy diagnosis to clipboard
- **Optional newsletter signup** for product updates
- In-memory cache (same repo = instant replay)
- Cmd/Ctrl+Enter to submit
- Purple gradient UI, responsive mobile layout

## Deploy (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Set `ANTHROPIC_API_KEY` in project settings
4. Ensure build has Git available (Vercel includes Git; use smaller repos for serverless timeouts)

`maxDuration` is set to 120s on `/api/analyze`.

## Project structure

```
app/
  page.tsx              # Landing + analyze/compare UI
  r/[id]/page.tsx       # Shared result permalink
  api/analyze/route.ts  # Clone → metrics → Claude
  api/share/route.ts    # Create & fetch share links
  api/newsletter/route.ts
  api/health/route.ts
components/             # Theme, severity, featured, compare, newsletter
lib/
  git-analyzer.ts
  claude-therapist.ts
  cache.ts
  share-store.ts
  featured-diagnoses.ts
  severity.ts
  github-url.ts
  types.ts
```

## Hackathon submission

- **Project name:** Commit Message Therapist
- **Description:** AI therapist analyzes your Git history and generates witty mental health diagnoses.
- **Typeform:** https://xsxo494365r.typeform.com/to/uT6R8vhf

## License

MIT
