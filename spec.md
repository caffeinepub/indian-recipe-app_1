# Rasoi — Admin Panel (Secret URL)

## Current State
- App has an AdminPanel modal component accessible from the header via a visible button
- No URL-based routing exists (single-page, no react-router)
- Backend is an empty Motoko actor with no logic
- All recipe data is managed via React state (INITIAL_RECIPES)
- No authentication or access control exists

## Requested Changes (Diff)

### Add
- `/admin` URL route: when user navigates to `/admin` in the browser, a completely separate Admin Dashboard page is shown instead of the main app
- Login gate on the Admin Dashboard: blocks access until correct credentials entered (ID: `binjo#yt`, Password: `jatav@001`). localStorage-persisted session.
- Admin Dashboard UI with dark gold/orange premium theme (distinct from regular app's green theme)
- Recipe Manager in dashboard: add new recipes (Title, Category, Ingredients, Steps, Description, Image, servings, time, veg/non-veg, calories, chefTips, videoUrl)
- Edit/Delete existing recipes in dashboard
- Stats panel: Total Recipes count + Real-time active users count (via backend ping system)
- Backend: `pingOnline()` function that records a session ping with timestamp; `getActiveUsers()` that returns count of unique sessions active in last 60 seconds
- Admin dashboard reads from and writes to the same INITIAL_RECIPES data that the main app uses (shared state via localStorage sync)

### Modify
- App.tsx: add URL detection at startup — if `window.location.pathname === '/admin'`, render AdminDashboard instead of main AppContent
- Backend main.mo: add active user tracking (ping + count active users in last 60s)
- Remove the visible admin button from the main app header (since admin access is now via secret URL only)

### Remove
- Visible "Manage Recipes" / Admin button from the main app header (admin is now secret URL only)

## Implementation Plan
1. Update backend main.mo with pingOnline() and getActiveUsers() using HashMap for session tracking
2. Create AdminDashboard component with:
   a. Login screen (gold/orange dark theme)
   b. Stats bar (total recipes, live users)
   c. Recipe list with edit/delete actions
   d. Add/Edit recipe form modal
3. Implement URL routing in App.tsx (pathname check, render AdminDashboard or AppContent)
4. Main app pings backend on mount to register as active user
5. Admin dashboard polls getActiveUsers() every 10 seconds for live count
6. Remove visible admin header button; keep all other features intact
