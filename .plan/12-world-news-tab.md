# 📋 Implementation Plan: Issue #12 — Add World News Tab

## Overview
Add a new "World News" tab to the Reels Maker dashboard displaying the top 10 world news stories using the World News API.

- **Issue:** [#12 — [Feature] Add World News Tab with Top 10 News Stories](https://github.com/diegocanepa/reels-maker/issues/12)
- **Architecture:** See [Architectural Analysis comment](https://github.com/diegocanepa/reels-maker/issues/12)
- **Plan:** See [Implementation Plan comment](https://github.com/diegocanepa/reels-maker/issues/12)

---

## Subtasks

### Subtask 1: Create `/api/news/top` API Route
- **Status:** 🔄 In Progress
- **Branch:** `feat/12-news-api-route`
- **Files:** `src/app/api/news/top/route.ts`
- **Scope:** GET endpoint BFF proxy to worldnewsapi.com/top-news. Export `NewsArticle` and `NewsResponse` types. 15-min server-side cache. Error handling for missing API key, network failures, 401/403.
- **Commit:** —
- **PR:** —
- **Notes:** —

### Subtask 2: Create `NewsDashboard.tsx` Component
- **Status:** ⏳ Not Started
- **Branch:** `feat/12-news-dashboard-component`
- **Files:** `src/components/NewsDashboard.tsx`
- **Scope:** Client-side component consuming `/api/news/top`. Skeleton loader, error state, 15-min auto-refresh with countdown bar, 10 news cards (title, description, source, date, link). Design consistent with WeatherDashboard.
- **Dependencies:** Subtask 1 must be completed first
- **Commit:** —
- **PR:** —
- **Notes:** —

### Subtask 3: Integrate News Tab in `page.tsx`
- **Status:** ⏳ Not Started
- **Branch:** `feat/12-news-tab-integration`
- **Files:** `src/app/page.tsx`
- **Scope:** Add `"news"` to Tab union type, add tab to TABS array, add ambient glow, update conditional render.
- **Dependencies:** Subtask 2 must be completed first
- **Commit:** —
- **PR:** —
- **Notes:** —

---

## Quality Gates
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Component works correctly on mobile and desktop
- [ ] Error handling works with missing/invalid API key
- [ ] Auto-refresh countdown bar visible and functional

---

## Progress Log

| Date | Event |
|------|-------|
| 2026-02-25 | Plan created, Phase 2 approved |
| 2026-02-25 | Starting Phase 3 — Subtask 1 |

---

## Blockers
None

## Notes
- World News API requires API key in `WORLD_NEWS_API_KEY` env var
- Free tier may have limitations — error handling should be clear
