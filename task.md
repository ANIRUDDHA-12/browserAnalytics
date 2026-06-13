# FeedLoop Execution Tracker

## Phase 1: Environment (Completed)
- [x] Scaffold Next.js App Router.
- [x] Provision Supabase PostgreSQL Database (Schema live).
- [x] Set `.env.local` keys.

## Phase 2: Core Foundation (Current)
- [x] Create Supabase SSR client utilities (browser, server, middleware).
- [x] Build root `layout.tsx` using Putty Cream (#F3F0EE) background.
- [x] Build Floating Nav Pill global header.

## Phase 3: Dashboard UI
- [x] Build `/dashboard` Project List view.
- [x] Build `/dashboard/projects/[id]` Feedback Detail view.

## Phase 3.5: Authentication & Dynamic Wiring (Current)
- [x] Build `/login` page with Email OTP form (Mastercard UI).
- [x] Implement Supabase Auth routing logic (handle OTP verification).
- [ ] Replace `MOCK_PROJECTS` in Dashboard with live Supabase fetching.
- [ ] Protect `/dashboard` routes in `middleware.ts`.

## Phase 4: Ingestion & Widget
- [ ] Build Next.js `/api/v1/ingest` endpoint.
- [ ] Build `widget.js` (Vanilla JS shadow DOM + html2canvas).