# AIDigital Labs — [App Name]

> App-specific context for Claude Code.

## App Info

| Field | Value |
|-------|-------|
| App | [App Name] |
| URL | https://[slug].apps.aidigitallabs.com |
| Repo | `AiDigital-com/[RepoName]` |
| Netlify Site ID | `[site-id]` |
| Purpose | [Brief description] |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript |
| Auth | Clerk (@clerk/react, @clerk/backend) |
| Database | Supabase PostgreSQL (@supabase/supabase-js) — RLS + Realtime |
| AI | LLM Wrapper via DS (`createLLMProvider`) — Gemini/Claude/OpenAI/xAI |
| Backend | Netlify Functions (AI agents only — CRUD via PostgREST) |
| Hosting | Netlify (static + serverless) |
| Design System | @AiDigital-com/design-system v7.39+ |

## Architecture

```
src/
  main.tsx              <- Entry: ClerkProvider + applyTheme + resolveTheme
  App.tsx               <- AppShell wrapper + domain logic + supabaseConfig
  pages/
    HelpPage.tsx        <- Public help page (no auth)
  components/           <- App-specific components
  hooks/
    useOrchestrator.ts  <- Chat orchestration (SSE streaming)
  lib/
    types.ts            <- Domain types
netlify/
  functions/
    _shared/
      auth.ts           <- requireAuth + requireAuthOrEmbed (Clerk/embed/API key)
      supabase.ts       <- Supabase service-role client (Proxy pattern)
      logger.ts         <- createLogger from design system
      access.ts         <- checkAccess/recordUsage wrapper
    api-status.mts      <- MCP/API status endpoint (uses DS handleApiStatus)
    orchestrator.mts    <- Chat AI agent (Gemini SSE streaming)
    init-user.mts       <- User upsert (fallback for RPC)
    admin-accounts.mts  <- Admin panel data
netlify.toml            <- Build config + redirects (/help, SPA fallback)
```

## Key Patterns

- **Supabase Direct:** Client-side CRUD uses `supabase` (from AppShell context), not Netlify Functions
- **authFetch:** Only for Netlify Functions (AI agents, background jobs)
- **Help Page:** Rendered at `/help` without auth, using `HelpPage` component from design system
- **Theme:** `resolveTheme()` auto-selects theme based on URL/domain
- **Sidebar Bridge:** Use React context to share state between sidebar (rendered by AppShell) and main content

## Environment Variables

**All shared env vars are set at Netlify team level** (account: `aidigital-operating-llc`).
New sites inherit them automatically. No manual setup needed for:
- `NPM_TOKEN`, `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `GEMINI_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

Only add site-level vars for app-specific config (e.g., `ADMIN_EMAILS`).

## New App Setup Checklist

1. Clone this template and rename
2. Create GitHub repo under `AiDigital-com` org
3. Create Netlify site via API under `aidigital-operating-llc` account
4. **Link Netlify site to GitHub repo** (CRITICAL for auto-deploy):
   ```
   PATCH https://api.netlify.com/api/v1/sites/{site_id}
   Body: { "repo": {
     "provider": "github",
     "repo": "AiDigital-com/{REPO_NAME}",
     "branch": "main",
     "cmd": "npm run build",
     "dir": "dist",
     "installation_id": 120161952
   }}
   ```
5. **Create `develop` branch** and enable branch deploys on Netlify site
6. Env vars are automatic (team-level) — staging Supabase for branch-deploy, prod for production
7. Customize AppShell props (appTitle, activityLabel, helpUrl)
8. Replace placeholder sidebar with app-specific sidebar
9. Implement orchestrator with Gemini SSE streaming
10. Build domain-specific logic on `develop` branch
11. Run E2E staging tests, then merge to `main` for production deploy

## SDLC & Deploy Process

**IMPORTANT: Follow this process for ALL changes. No exceptions.**

### Environments

| Environment | Branch | Supabase | URLs |
|-------------|--------|----------|------|
| Local dev | any | staging (rqpvrikighrlgjxzkqde) | localhost:5173 |
| Staging | `develop` | staging (rqpvrikighrlgjxzkqde) | develop--{site}.netlify.app |
| Production | `main` | production (njwzbptrhgznozpndcxf) | {app}.apps.aidigitallabs.com |

### Workflow

1. **All work on `develop` branch** — never push directly to `main`
2. **Push to develop** → staging auto-deploys with staging Supabase
3. **E2E testing optional** during development (run at discretion)
4. **"Ship it" triggers mandatory pipeline:**
   - Pre-deploy: E2E smoke + workflow on staging (must pass)
   - Merge develop → main
   - Post-deploy: E2E smoke + workflow on production (must pass)
   - Auto-update: developer docs, user guides, screenshots, CLAUDE.md, memory

### E2E Commands (run from Design System repo)

```bash
npm run test:staging:smoke     # staging smoke tests
npm run test:staging:full      # staging smoke + workflow
npm run test:prod:smoke        # production smoke tests
npm run test:prod:full         # production smoke + workflow
```

### Clean Sweep Protocol

End every session with Clean Sweep protocol. After major feature work, run the Clean Sweep from the DS repo to sync docs, templates, and CLAUDE.md across the portfolio.

### Gemini Model Policy

- **Never use Gemini models prior to 3.0.** All legacy 2.x models are deprecated.
- **gemini-3-flash-preview** — orchestrator (chat), visualizer parallel extraction
- **gemini-3.1-pro-preview** — deep audit agents, background report generation
- SDK: `@google/genai` must be v1.46.0+

### Hotfixes

For critical production issues: push directly to `main`, then backmerge to `develop`.

## Mandatory Rules (Portfolio-Wide)

These rules are absolute. Apply them on every change, every PR, every session.
They were learned from production incidents and skipping them causes real bugs.

### No content fallbacks — EVER

```tsx
// ❌ NEVER
<h1>{data.exec?.hero_verdict || 'Strong emotional pull dragged down by weak conversion mechanics.'}</h1>
<p>{data.summary || 'Generic placeholder analysis text...'}</p>

// ✓ Render conditionally so missing data SURFACES instead of showing fake prose
{data.exec?.hero_verdict && <h1>{data.exec.hero_verdict}</h1>}
{data.summary && <p>{data.summary}</p>}
```

Hardcoded fallback prose masks upstream failures. When the visualizer breaks, every
broken report renders identical-looking fake analysis and the team can't tell real
from fake. Acceptable defaults: `''`, `[]`, `0`, `null`, computed values from real
data, section/page chrome titles. NEVER any "voice" string (verdict, summary,
headline, recommendation).

### Long-running Lambdas MUST use the `-background` suffix

Netlify Functions v2 ignores `config.background = true`. Only the filename suffix
activates background mode (15-min budget). Without it, the function runs in
streaming mode with a 26s hard timeout and dies mid-execution.

```
✓ aio-anchor-background.mts     — 15-min budget, returns 202 immediately
✗ aio-anchor.mts                — 26s timeout, will 504 if work takes longer
```

If task-worker dispatches a function via `await fetch(...)` and that function
isn't `-background`, the whole chain times out (task-worker → caller → client).
NM session 51507f5c regression (2026-04-24) was caused by this exact misnaming.

### Strict schema enforcement on LLM JSON output

Two layers of protection — use BOTH where possible:

**1. `responseSchema` at the API level (strongest):**
```ts
const result = await llm.generateContent({
  system: prompt,
  userParts: [{ text: input }],
  jsonMode: true,
  responseSchema: { type: 'object', properties: {...}, required: [...] },
});
```
Gemini physically cannot return fields outside the schema. Used by LRR's
synthesis call and AIO's review-background.

**2. Explicit destructure in the assembler (defense in depth):**
```ts
// ❌ Pass-through — leaks ghost fields the LLM echoed from source markdown
return { executive_summary: execSummary, ... };

// ✓ Strict destructure — only declared v2 fields survive
const cleanExec: ExecutiveSummary = {
  overall_score: authoritativeOverall,
  hero_verdict: execSummary?.hero_verdict,
  hero_subtitle: execSummary?.hero_subtitle,
  // ...explicitly list every field the schema declares
};
return { executive_summary: cleanExec, ... };
```

NM had `text?, score_verified?, critical_actions?, high_value_actions?` declared
"backward compat"; Gemini occasionally echoed those field names from the source
markdown and the pass-through assembler persisted them. Frontend got confused
schema, hardcoded fallback masked the bug for weeks.

### 3 hypotheses before ANY code decision

Bug fixes, feature design, refactors, library choices — generate 3 hypotheses,
rank by evidence + disruption, pick the least disruptive. Don't just code the
first idea that comes to mind. Especially: don't reuse approaches that have
already been investigated and ruled out (webhook-triggered DB writes, polling
check tasks, batched parallel LLM calls — all tried and failed).

### All async work goes through `pipeline_tasks`

Never use Netlify background functions directly with function-to-function
fetch calls. The DS provides:
- `createDispatchHandler({ app, sessionTable, ... })` — accepts the user
  request, upserts session, enqueues `run_audit` task in `pipeline_tasks`,
  kicks task-worker, returns 200 in <3s.
- `createTaskWorker({ app, taskFunctionMap })` — claims tasks from
  `pipeline_tasks`, dispatches to `-background` functions.

Pipeline stages complete by inserting the next task. No polling. No
self-re-enqueueing. Event-driven only.

### All LLM calls through `createLLMProvider`

```ts
import { createLLMProvider } from '@AiDigital-com/design-system/server';
const llm = createLLMProvider('gemini', process.env.GEMINI_API_KEY!, 'analysis', { supabase });
```

Every call is metered, logged, cost-tracked. No direct `@google/genai` /
Anthropic SDK / OpenAI SDK calls in app code.

### Verify deploy IMMEDIATELY after every push

After `git push`, check Netlify deploy state via API. Do NOT continue to the
next task until deploy shows `ready`. The most-ignored rule in the playbook;
zero exceptions.

### After cross-repo changes, verify real DB data

When changes flow across function boundaries (logger → DB, dispatch → task-worker
→ Lambda → DB), query the actual database row 2 minutes after the first test
run. Check for NULL fields, wrong shape, missing data. If anything is NULL that
shouldn't be, the fix isn't done.

### Latest models only

`@google/genai` ≥ 1.46.0. `gemini-3-flash-preview` for streaming,
`gemini-3.1-pro-preview` for analysis. Never use models prior to 3.0. Same
principle for Claude (sonnet-4-6 / opus-4-7), OpenAI (gpt-5+), xAI (grok-3+).

### DS-first

Before building any component, hook, or server utility — check the DS. If it
exists, use it. If a prop is missing, propose extending the DS rather than
forking. After bumping DS, update lock files in ALL consuming apps and verify
ALL Netlify deploys succeed.

## Standing Instructions

- Execute all bash commands, git commits, pushes, API calls, and deploys without asking for confirmation
- Always use `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` in commits
- Work on `develop` branch by default unless told otherwise
- For full portfolio architecture (all apps, env vars, API keys), see `CLAUDE.md` in `AIDigital-Labs-Design-System`

## Development Environment

- **OS:** Windows 11
- **Shell:** Git Bash (use Unix paths with forward slashes)
- **PATH:** Always set `export PATH="/c/Program Files/nodejs:$PATH"` before npm commands
- **Git push:** Use credential-embedded URL due to tty limitations
