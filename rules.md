# 📜 Project Rules & Guidelines

> ⚠️ **Note:** These rules are not permanent and may evolve as the project grows. However, all team members are expected to **strictly follow the current rules** until updated.

---

## ✅ 1) Code Style & Naming Conventions

- **Variables**: `camelCase` → `userName`, `isLoggedIn`
- **Functions**: `camelCase` → `getUserData()`, `handleLogin()`
- **React/Next Components**: `PascalCase` → `UserCard`, `LoginForm`
- **Constants**: `UPPER_CASE_WITH_UNDERSCORE` → `API_URL`, `MAX_LIMIT`
- **File names**: `kebab-case` → `auth-service.ts`, `user-card.tsx`
- **Type aliases & interfaces**: `PascalCase` → `User`, `OrderItem`, `ApiResponse<T>`
- **Enums**: `PascalCase` (members UPPER_CASE) → `HttpStatus.OK`

### 1.1 Advanced Naming Rules

- **Boolean variables/functions** must start with: `is/has/should/can`
  - `isAdmin`, `hasPermission()`, `shouldRender()`, `canActivate()`
- **Functions returning arrays** use **plural nouns**:
  - `getUsers(): User[]`, `fetchOrders(): Order[]`
- **Converters / Transformers** use `toX` / `fromX`:
  - `toJson(user)`, `fromJson(str)`, `toCamelCase(s)`
  - `getUserJson()`, `buildConfigObject()`, `toUserDto()`
- **Primitive returns** should read naturally:
  - `getUserName(): string`, `getRetryCount(): number`

---

## 📂 2) Monorepo Structure (Turborepo + bun)

```
repo-root/
├─ apps/               # deployable apps (web, mobile, backend, dashboard)
└─ packages/           # shared libraries (db, helper, radis, seeds,types)
```

**Placement rules**

- Each app must have a features/ folder.
- Each feature is self-contained: keep its UI, state, hooks, services, and sub-routes together.
- If something is only for one feature, keep it inside that feature folder.


```
repo-root/
├─ apps/               # deployable apps (web, mobile, backend, dashboard)
│  └─ <web>/
│     ├─ features/     # app-specific features
│     │  ├─ auth/          # authentication (login, register, reset, etc.)
│     │  ├─ banners/       # banners
│     │  ├─ hire/
│     │  │   ├─ create-hire/
│     │  │   ├─ update-hire/
│     │  │   └─ show-hire/
│     │  └─ ...other features
│     └─ (app/)  # routing entry points (Next.js, Expo Router, etc.)
│
├─ packages/           # shared libraries
│  ├─ utils/           # cross-project helpers
│  └─ biome-config/    # formatting & code style
│
├─ turbo.json          # Turborepo pipeline & caching
└─ tsconfig.base.json  # shared TS config & path aliases
```

## Apps (apps/*) (* == web/app/backend/dashboard)  

## Naming Rule (to stay consistent)

app / UI → use Add or Edit
(e.g., AddHirePage.tsx, EditHirePage.tsx)
Add/Edit = what the user interacts with

Services / API → use Create or Update
(e.g., createHire.ts, updateHire.ts)
Create/Update = saving changes in the database (system) 

## 🟡 Hire Feature
```
features/hire/
├─ create/                               # feature: creating a new hire
│  ├─ add-hire/                          # UI flow for adding a hire
│  │   ├─ forms/                         # stepper forms for hire creation
│  │   │   ├─ PersonalDetailsForm.tsx    # form for candidate's personal info
│  │   │   ├─ EducationForm.tsx          # form for candidate's education
│  │   │   ├─ PreferredPositionForm.tsx  # form for job preferences
│  │   │   └─ DocumentsForm.tsx          # form for uploading documents
│  │   ├─ AddHirePage.tsx                # page combining forms with stepper logic
│  │   └─ index.ts                       # entry point export for add-hire
│  └─ services/
│      └─ createHire.ts                  # API call: send new hire data to backend
│
├─ update/                               # feature: updating an existing hire
│  ├─ edit-hire/                         # UI flow for editing hire details
│  │   ├─ forms/                         # stepper forms, same as create but pre-filled
│  │   │   ├─ PersonalDetailsForm.tsx    # pre-filled personal details form
│  │   │   ├─ EducationForm.tsx          # pre-filled education form
│  │   │   ├─ PreferredPositionForm.tsx  # pre-filled job preferences form
│  │   │   └─ DocumentsForm.tsx          # pre-filled documents form
│  │   ├─ EditHirePage.tsx               # page showing edit flow with pre-filled data
│  │   └─ index.ts                       # entry point export for edit-hire
│  └─ services/
│      └─ updateHire.ts                  # API call: update hire data in backend
│
├─ show/                                 # feature: showing hire data
│  ├─ list-hire/
│  │   └─ HireList.tsx                   # component: show list of hires
│  ├─ detail-hire/
│  │   └─ HireDetails.tsx                # component: show single hire details
│  └─ index.ts                           # entry point export for show feature
│
└─ shared/                               # shared code across hire feature
   ├─ types.ts                           # TypeScript types/interfaces for hire
   ├─ constants.ts                       # constants/enums specific to hire
   └─ store/
       └─ useCreateHireStore.ts          # Zustand (or other) store: manage hire creation/updation state

```
- Use `create/` for new hire flows.  
  - Place multi-step forms inside `add-hire/forms/`.  
  - Example: `PersonalDetailsForm.tsx`, `EducationForm.tsx`, `PreferredPositionForm.tsx`, `DocumentsForm.tsx`.  
  - Combine forms in `AddHirePage.tsx`.  
- Use `update/` for editing existing hires.  
  - Same form structure as create, but pre-filled.  
- Use `show/` for listing and detail pages.  
- Place shared types, constants, and helpers in `shared/`.  
- Place API calls inside `services/` and local state (Zustand/React Query) in `store/`.  

## 🟡 Business Feature
## 🟡 User Feature
## 🟡 Plans Feature
## 🟡 Chats Feature
## 🟡 Offers/Products Feature

## 📂 Mobile Structure with Drawer + Features
```
src/
├─ app/                           # Expo Router entry points
│  ├─ (root)/                     # Home stack → dashboard, feed, etc.
│  ├─ (drawer)/                   # Drawer stack → feature entry routes
│  │   ├─ hire/                   # Hire routes (connected to features/hire)
│  │   │   ├─ create.tsx          # Route → uses AddHirePage from features/hire/add-hire
│  │   │   ├─ edit/[id].tsx       # Route → uses EditHirePage from features/hire/edit-hire
│  │   │   ├─ [id].tsx            # Route → uses HireDetails from features/hire/show-hire
│  │   │   └─ index.tsx           # Route → uses HireList from features/hire
│  │   ├─ business/               # Business routes (similar pattern)
│  │   └─ ...other feature routes
│  └─ search/                     # Shared search screens (used across multiple features)
│
├─ features/
│  └─ hire/                       # Hire feature (self-contained business logic)
│     ├─ add-hire/                # Create new hire flow
│     │  ├─ forms/                # Stepper forms for hire creation
│     │  │   ├─ PersonalDetailsForm.tsx   # Step 1: personal info
│     │  │   ├─ EducationForm.tsx         # Step 2: education
│     │  │   ├─ PreferredPositionForm.tsx # Step 3: job preferences
│     │  │   └─ DocumentsForm.tsx         # Step 4: upload documents
│     │  ├─ AddHirePage.tsx       # Screen that combines the 4 forms into one step-by-step flow
│     │  └─ index.ts              # Entry point exports for add-hire
│     │
│     ├─ edit-hire/               # Update existing hire flow
│     │  ├─ forms/                # Same 4 steps, but pre-filled with hire data
│     │  │   ├─ PersonalDetailsForm.tsx
│     │  │   ├─ EducationForm.tsx
│     │  │   ├─ PreferredPositionForm.tsx
│     │  │   └─ DocumentsForm.tsx
│     │  ├─ EditHirePage.tsx      # Page orchestrating pre-filled edit flow
│     │  └─ index.ts
│     │
│     ├─ show-hire/               # Show hires (list + detail)
│     │  ├─ HireList.tsx          # Screen showing all hires
│     │  ├─ HireDetails.tsx       # Screen showing one hire’s details
│     │  └─ index.ts
│     │
│     ├─ services/                # API calls to backend
│     │  ├─ createHire.ts         # POST → /hire (create new hire)
│     │  ├─ updateHire.ts         # PUT → /hire/:id (update hire)
│     │  ├─ getHires.ts           # GET → /hire (list all hires)
│     │  └─ getHireById.ts        # GET → /hire/:id (get single hire)
│     │
│     ├─ store/                   # Local state (Zustand, TanStack Query, etc.)
│     │  └─ useHireStore.ts       # Stepper state for AddHire/EditHire flow
│     │
│     ├─ shared/                  # Shared utilities just for Hire
│     │  ├─ types.ts              # Types/interfaces (Hire, HireFormData, etc.)
│     │  ├─ constants.ts          # Constants/enums (HireStatus, MAX_DOCS, etc.)
│     │  └─ validations.ts        # Zod schemas for hire forms
│     │
│     └─ index.ts                 # Barrel export for the whole hire feature

```
## So basically:
- Drawer Hire = where the user goes in the app (screens)
- Features Hire = how everything works under the hood (logic, forms, APIs, state, etc)
---

## 🧭 3) TypeScript & Imports

- Use **path aliases** from `tsconfig.base.json` (e.g. `@ui/*`, `@utils/*`). Avoid `../../../`.
- Prefer **named exports** over default exports in packages.

---

## 🌱 4) Git Strategy

- `main` is **production-ready** only.
- Branch names:
  - `feat/<scope>-<short-desc>` → `feat/auth-login`
  - `fix/<scope>-<short-desc>` → `fix/ui-button-disabled`
- **Conventional Commits** required: `feat:`, `fix:`.
---

## 🎨 6) Linting, Formatting & Hooks

- **Biome** is mandatory (replaces ESLint + Prettier).
- Run bun biome check (or bun format) before pushing.
- No `any` without justification; prefer proper typing.

---

## 🔐 8) Security & Secrets

- Never commit secrets. Use `.env.local` and keep `.env.example` updated.
- Don’t log PII or tokens. Scrub sensitive fields in logs.

---

## 🛠 9) Error Handling & Logging

- Centralize logging (e.g., `packages/logger`) with levels: `error`, `warn`, `info`, `debug`.

---

## 🧩 10) React/Next.js Component Rules

- UI components: **pure & presentational**; move business logic to hooks/services.
- Props must be fully typed; avoid `any` and over-wide types.
- Avoid prop drilling—prefer context/hooks where appropriate.
- app in Next.js handle routing; heavy logic belongs to hooks/services.

---

## 🏎 11) Performance

- Avoid unnecessary re-renders (memoize where it actually helps).

---

## ♻️ 13) Clean Code

- Prefer **early returns** over deeply nested `if` ladders (max nesting: 3).
- No dead code, commented-out blocks, or unused exports.

---

### ✅ Final Reminder

Rules can evolve, but until updated, every team member must **strictly follow** these guidelines.
