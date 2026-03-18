# AIDigital Labs — App Template

> This is the starter template for new AIDigital Labs tools.
> Clone this repo, follow the setup steps, and start building.

## What This Template Provides

- React 19 + Vite 8 + TypeScript boilerplate
- `@boriskulakhmetov-aidigital/design-system` v5.x pre-wired
  - `applyTheme(aiLabsTheme)` in main.tsx
  - `style.css` imported for all component styles
  - `AppShell` wrapping the app (auth, layout, header, admin panel)
  - `ChatPanel` with placeholder orchestrator
- Clerk auth (ClerkProvider in main.tsx, AppShell handles auth gates)
- Netlify Functions stubs:
  - `_shared/auth.ts` — Clerk JWT verification
  - `_shared/db.ts` — Neon database connection
  - `init-user.mts` — User status initialization
  - `orchestrator.mts` — Chat AI agent stub
  - `admin-accounts.mts` — Admin panel data stub
- `.npmrc` for GitHub Packages auth
- `.env.example` with required variables

## Setup Steps for a New App

### 1. Clone and Rename
```bash
git clone https://github.com/boriskulakhmetov-aidigital/AIDigital-Labs-App-Template.git MyNewApp
cd MyNewApp
rm -rf .git
git init
```

### 2. Create GitHub Repo
```bash
# Via GitHub API or UI
git remote add origin https://github.com/boriskulakhmetov-aidigital/MyNewApp.git
git add -A && git commit -m "feat: initial app from template"
git branch -M main && git push -u origin main
```

### 3. Create Netlify Site
```bash
npx netlify-cli sites:create --name my-new-app --account-slug aidigital-operating-llc
npx netlify-cli api updateSite --data '{"site_id":"SITE_ID","body":{"custom_domain":"my-app.apps.aidigitallabs.com"}}'
```

### 4. Set Environment Variables in Netlify
Go to Netlify → Site settings → Environment variables. Add:
- `VITE_CLERK_PUBLISHABLE_KEY` — see design system CLAUDE.md
- `CLERK_SECRET_KEY` — see design system CLAUDE.md
- `GEMINI_API_KEY` — see design system CLAUDE.md
- `DATABASE_URL` — see design system CLAUDE.md
- `NPM_TOKEN` — see design system CLAUDE.md

### 5. Create Local .env.local
Copy `.env.example` to `.env.local` and fill in real values from the design system CLAUDE.md.

### 6. Create Neon Database Tables
Use the shared Neon database. Create your app's tables with a prefix (e.g., `ma_sessions`, `ma_users`).

### 7. Customize the App
1. **App.tsx:** Change `appTitle`, `activityLabel`, `detailEndpoint`
2. **main.tsx:** Already configured (no changes needed)
3. **Sidebar:** Replace `PlaceholderSidebar` with your app's sidebar
4. **Orchestrator:** Implement `netlify/functions/orchestrator.mts`
5. **Database:** Add your schema to `_shared/db.ts` functions
6. **CLAUDE.md:** Update this file with your app's specific context

### 8. Deploy
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist --site=YOUR_SITE_ID
```

## Project Structure

```
src/
  main.tsx              ← Entry: ClerkProvider + applyTheme + style.css
  App.tsx               ← AppShell + domain logic
  App.css               ← App-specific styles
  index.css             ← Global reset (theme vars from applyTheme)
netlify/
  functions/
    _shared/
      auth.ts           ← Clerk JWT verification
      db.ts             ← Neon connection
    init-user.mts       ← User status check
    orchestrator.mts    ← Chat AI agent
    admin-accounts.mts  ← Admin panel queries
.env.example            ← Required env vars (copy to .env.local)
.npmrc                  ← GitHub Packages auth
```

## Design System Components Available

Import from `@boriskulakhmetov-aidigital/design-system`:

**App Shell:** AppShell, BrandMark, ThemeToggle, LogoRenderer
**Chat:** ChatPanel, MessageBubble, UploadZone
**Navigation:** Sidebar (renderItem), AdminPanel (self-contained)
**Reports:** ReportViewer, DownloadBar, ShareBar, ReportSidebar
**Primitives:** ScorePill, SeverityBadge, PriorityBadge, SectionDivider, PageHeader, BriefSection/BriefRow, CollapsibleRow, ActionCard, KpiTile, AssetPreview, ReportTable, ProtocolBlock
**Visualization:** ValueEffortChart, ImpactTable, SVGRing, StepList, ProgressBar, Spinner
**Utilities:** renderMarkdown, downloadMarkdown, downloadPDF, slugify, groupByDate
**Themes:** applyTheme, aiLabsTheme, aiDigitalTheme, ThemeConfig

## Architecture Reference

For the full portfolio architecture (all apps, env vars, API keys, conventions), see `CLAUDE.md` in `AIDigital-Labs-Design-System`.
