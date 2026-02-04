# Task: Implement Admin Dashboard UI

## 1. Setup & Layout

- [x] 1.1 Create `src/layouts/AdminLayout.vue` with Sidebar and Header matching design. <!-- id: 1.1 -->
- [x] 1.2 Implement Sidebar navigation logic (Dashboard, Lojistas, Planos, etc.). <!-- id: 1.2 -->
- [x] 1.3 Update `src/router/index.ts` to use `AdminLayout` for `/admin` routes. <!-- id: 1.3 -->

## 2. Store Owners View (Lojistas)

- [x] 2.1 Create `src/views/admin/AdminStoreOwnersView.vue`. <!-- id: 2.1 -->
- [x] 2.2 Implement "Stats Cards" section (mock data initially). <!-- id: 2.2 -->
- [x] 2.3 Implement "Filters" (Tabs) and "Search Bar". <!-- id: 2.3 -->
- [x] 2.4 Implement "Lojistas Table" using `shadcn-vue` Table component. <!-- id: 2.4 -->
- [x] 2.5 Integrate `users.service.ts` to fetch real users for the table. <!-- id: 2.5 -->
- [x] 2.6 Add "Status" and "Plan" badges (mock Plan if data missing). <!-- id: 2.6 -->

## 3. Integration & Refinement

- [x] 3.1 Hook up "Adicionar Novo Lojista" button to the existing Create User Modal (or new one). <!-- id: 3.1 -->
- [x] 3.2 Ensure SaaS Admin login redirects to `/admin/lojistas` (or dashboard). <!-- id: 3.2 -->
- [x] 3.3 Verify responsiveness and visual fidelity against the provided image. <!-- id: 3.3 -->
