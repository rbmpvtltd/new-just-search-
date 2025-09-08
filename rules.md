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
- **Functions returning JSON/object** should indicate the shape:
  - `getUserJson()`, `buildConfigObject()`, `toUserDto()`
- **Primitive returns** should read naturally:
  - `getUserName(): string`, `getRetryCount(): number`
- **Async functions** must end with `Async`:
  - `fetchUserAsync()`, `saveOrderAsync()`

---

## 📂 2) Monorepo Structure (Turborepo + bun)

```
repo-root/
├─ apps/               # deployable apps (web, mobile, backend, dashboard)
├─ packages/           # shared libraries (ui, utils, config, api, eslint-config)
├─ turbo.json          # Turborepo pipeline & caching
└─ tsconfig.base.json  # shared TS config & path aliases
```

**Placement rules**

- Each app must have a features/ folder.
- Each feature is self-contained: keep its UI, state, hooks, services, and sub-routes together.
- Cross-cutting/shared things still live in packages/\*.

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
│     └─ (pages/)  # routing entry points (Next.js, Expo Router, etc.)
│
├─ packages/           # shared libraries
│  ├─ ui/              # UI primitives/components
│  ├─ utils/           # cross-project helpers
│  ├─ api/             # API client / SDK / services
│  ├─ config/          # shared config/constants/env schema
│  └─ eslint-config/   # linting & code style
│
├─ turbo.json          # Turborepo pipeline & caching
└─ tsconfig.base.json  # shared TS config & path aliases
```

   ## Apps (apps/*)
   
## 🟡 Hire Feature
```
features/hire/
├─ create/
│  ├─ add-hire/
│  │   ├─ forms/
│  │   │   ├─ PersonalDetailsForm.tsx
│  │   │   ├─ EducationForm.tsx
│  │   │   ├─ PreferredPositionForm.tsx
│  │   │   └─ DocumentsForm.tsx
│  │   ├─ AddHirePage.tsx              # combines forms with stepper
│  │   └─ index.ts                     # export entry
│  ├─ services/
│  │   └─ createHire.ts
│  └─ store/
│      └─ useCreateHireStore.ts
├─ update/
│  ├─ edit-hire/
│  │   ├─ forms/
│  │   │   ├─ PersonalDetailsForm.tsx
│  │   │   ├─ EducationForm.tsx
│  │   │   ├─ PreferredPositionForm.tsx
│  │   │   └─ DocumentsForm.tsx
│  │   ├─ EditHirePage.tsx             # same flow but pre-filled
│  │   └─ index.ts
│  ├─ services/
│  │   └─ updateHire.ts
│  └─ store/
│      └─ useUpdateHireStore.ts
├─ show/
│  ├─ list-hire/
│  │   └─ HireList.tsx
│  ├─ detail-hire/
│  │   └─ HireDetails.tsx
│  └─ index.ts
└─ shared/
   ├─ types.ts
   └─ constants.ts
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
```
features/business/
├─ create/
│  ├─ add-business/
│  │   ├─ forms/
│  │   │   ├─ AboutForm.tsx
│  │   │   ├─ AddressForm.tsx
│  │   │   ├─ BusinessTimingForm.tsx
│  │   │   └─ ContactForm.tsx
│  │   ├─ AddBusinessPage.tsx
│  │   └─ index.ts
│  ├─ services/
│  │   └─ createBusiness.ts
│  └─ store/
│      └─ useCreateBusinessStore.ts
├─ update/
│  ├─ edit-business/
│  │   ├─ forms/
│  │   │   ├─ AboutForm.tsx
│  │   │   ├─ AddressForm.tsx
│  │   │   ├─ BusinessTimingForm.tsx
│  │   │   └─ ContactForm.tsx
│  │   ├─ EditBusinessPage.tsx
│  │   └─ index.ts
│  ├─ services/
│  │   └─ updateBusiness.ts
│  └─ store/
│      └─ useUpdateBusinessStore.ts
├─ show/
│  ├─ list-business/
│  │   └─ BusinessList.tsx
│  ├─ detail-business/
│  │   └─ BusinessDetails.tsx
│  └─ index.ts
└─ shared/
   ├─ types.ts
   └─ constants.ts
```
- Use `create/` for new business flows.  
  - Place multi-step forms inside `add-business/forms/`.  
  - Example: `AboutForm.tsx`, `AddressForm.tsx`, `BusinessTimingForm.tsx`, `ContactForm.tsx`.  
  - Combine forms in `AddBusinessPage.tsx`.  
- Use `update/` for editing existing businesses.  
  - Same form structure as create, but pre-filled.  
- Use `show/` for listing and detail pages.  
- Place shared types, constants, and helpers in `shared/`.  
- Place API calls inside `services/` and local state in `store/`.  


## 🟡 User Feature
```
features/user/
├─ create/
│  ├─ add-user/
│  │   ├─ AddUserForm.tsx
│  │   └─ AddUserPage.tsx
│  ├─ services/
│  │   └─ createUser.ts
│  └─ store/
│      └─ useCreateUserStore.ts
├─ update/
│  ├─ edit-user/
│  │   ├─ EditUserForm.tsx
│  │   └─ EditUserPage.tsx
│  ├─ services/
│  │   └─ updateUser.ts
│  └─ store/
│      └─ useUpdateUserStore.ts
├─ show/
│  ├─ UserList.tsx
│  └─ UserDetails.tsx
└─ shared/
   ├─ types.ts
   └─ constants.ts
```
- Use `create/` for adding new users (`add-user/`).  
  - Example: `AddUserForm.tsx` + `AddUserPage.tsx`.  
- Use `update/` for editing existing users (`edit-user/`).  
  - Example: `EditUserForm.tsx` + `EditUserPage.tsx`.  
- Use `show/` for user listing and profile detail pages.  
- Place shared types, constants, and helpers in `shared/`.  
- Place API calls inside `services/` and local state in `store/`.  


## 🟡 Plans Feature
```
features/plans/
├─ show/
│  ├─ PlanList.tsx
│  ├─ PlanDetails.tsx
│  └─ index.ts
├─ buy/
│  ├─ BuyPlanPage.tsx
│  ├─ services/
│  │   └─ buyPlan.ts
│  └─ store/
│      └─ useBuyPlanStore.ts
├─ components/
│  ├─ PlanCard.tsx
│  └─ PricingTable.tsx
└─ services/
   └─ getPlans.ts
```

- Plans are **read-only for end-users**.  
- Use `show/` for plan listing and details.  
- Use `buy/` for checkout and purchase flow.  
- ❌ Do **not** add `create/` or `update/` under `plans/` (those belong in **admin-only features**).  
- Place reusable UI like `PlanCard`, `PricingTable` in `components/`.  
- Place API calls in `services/`, and optional local state in `store/`. 


## 🟡 Chats Feature
```
features/chats/
├─ components/
│  ├─ ChatUI.tsx
│  ├─ MessageList.tsx
│  └─ MessageInput.tsx
├─ services/
│  ├─ chatApi.ts
│  └─ socket.ts
├─ store/
│  └─ useChatStore.ts
└─ utils/
   └─ formatMessage.ts
```
- Use `components/` for chat UI (e.g., `ChatUI.tsx`, `MessageList.tsx`, `MessageInput.tsx`).  
- Place messaging logic in `services/` (API + WebSocket).  
- Use `store/` for chat state management.  
- Use `utils/` for helpers (e.g., `formatMessage.ts`).  
- ❌ No `create/` or `update/` — chats are real-time, not CRUD.  


## 🟡 Offers Feature
```
features/offers/ (Same for product)
├─ create/
│  ├─ add-offer/
│  │   ├─ OfferForm.tsx
│  │   └─ AddOfferPage.tsx
│  ├─ services/
│  │   └─ createOffer.ts
│  └─ store/
│      └─ useCreateOfferStore.ts
├─ update/
│  ├─ edit-offer/
│  │   ├─ OfferForm.tsx
│  │   └─ EditOfferPage.tsx
│  ├─ services/
│  │   └─ updateOffer.ts
│  └─ store/
│      └─ useUpdateOfferStore.ts
├─ show/
│  ├─ OfferList.tsx
│  └─ OfferDetails.tsx
└─ shared/
   ├─ types.ts
   └─ constants.ts
```
- Use `create/` for adding offers (`add-offer/`).  
  - Example: `OfferForm.tsx` + `AddOfferPage.tsx`.  
- Use `update/` for editing offers (`edit-offer/`).  
  - Example: `OfferForm.tsx` + `EditOfferPage.tsx`.  
- Use `show/` for listing and viewing offers.  
- Place shared types, constants, and helpers in `shared/`.  
- Place API calls inside `services/` and local state in `store/`.


```

---

## 🧭 3) TypeScript & Imports

- Use **path aliases** from `tsconfig.base.json` (e.g. `@ui/*`, `@utils/*`). Avoid `../../../`.
- Prefer **named exports** over default exports in packages.
- Enable `strict`, `noImplicitAny`, `noUncheckedIndexedAccess` in TS.
- Public APIs of each package are re-exported via a single `index.ts` barrel.

---

## 🌱 4) Git Strategy

- `main` is **production-ready** only.
- Branch names:
  - `feat/<scope>-<short-desc>` → `feat/auth-login`
  - `fix/<scope>-<short-desc>` → `fix/ui-button-disabled`
  - `chore/<scope>-<short-desc>` → `chore/deps-bump`
- **Conventional Commits** required: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:`, `build:`, `ci:`
- Use **Changesets** for versioning & releases in `packages/*`.

---

## 🔍 5) Pull Requests & Reviews

- At least **1 approval** required.
- Keep PRs **small and atomic**; include screenshots for UI changes.
- PR description must explain **what** changed and **why**.
- Include tests for new features/bugfixes.
- Merge strategy: **squash & merge** (clean history).

**PR Checklist**

- [ ] Lint, typecheck, tests, and build pass
- [ ] Storybook/docs updated (if UI changes)
- [ ] No TODOs / leftover `console.log`
- [ ] Appropriate changeset added (if packages changed)

---

## 🎨 6) Linting, Formatting & Hooks

- **ESLint + Prettier** are mandatory.
- Run `pnpm lint` & `pnpm format` before pushing.
- Pre-commit hooks via **husky + lint-staged**:
  - `typecheck`, `lint`, `format`, `test --changed`
- No `any` without justification; prefer proper typing.

---

## 🧪 7) Testing Policy

- Unit tests for utilities/services and critical logic.
- Component tests for UI (React Testing Library).
- Integration tests for API boundaries where applicable.
- Minimum coverage target: **80% lines** for packages.
- Snapshots should be reviewed and stable (no noisy snapshots).

---

## 🔐 8) Security & Secrets

- Never commit secrets. Use `.env.local` and keep `.env.example` updated.
- Validate and parse env via a schema (e.g., `zod`).
- Don’t log PII or tokens. Scrub sensitive fields in logs.
- Use HTTPS-only endpoints; verify TLS in production.

---

## 🛠 9) Error Handling & Logging

- No silent failures—either **throw** or **log** with context.
- Centralize logging (e.g., `packages/logger`) with levels: `error`, `warn`, `info`, `debug`.
- Wrap external calls (HTTP/DB) with retries/backoff where needed.

---

## 📑 10) Documentation & Comments

- Public functions/classes in packages require **TSDoc/JSDoc**.
- Complex business logic must include rationale and examples.
- Each package should have a concise `README.md` covering API surface.

---

## 🧩 11) React/Next.js Component Rules

- UI components: **pure & presentational**; move business logic to hooks/services.
- Props must be fully typed; avoid `any` and over-wide types.
- Avoid prop drilling—prefer context/hooks where appropriate.
- Pages in Next.js handle routing; heavy logic belongs to hooks/services.

---

## 🏎 12) Performance

- Avoid unnecessary re-renders (memoize where it actually helps).
- Use code-splitting and lazy imports for heavy modules.
- No magic numbers; move constants to `packages/config`.

---

## ♻️ 13) Clean Code

- Prefer **early returns** over deeply nested `if` ladders (max nesting: 3).
- No dead code, commented-out blocks, or unused exports.
- Clear function boundaries; single responsibility per file (~300 LOC guideline).

---

## 🧱 14) Turborepo Pipeline Rules

- Define tasks in `turbo.json` with proper dependencies:
  - `"build"` depends on `"^build"` for packages
  - `"lint"`, `"test"`, `"typecheck"`, `"dev"` as needed
- Use Turborepo **remote caching** in CI to speed up builds.
- Only run affected tasks where possible; avoid full-repo runs locally.

---

## 🚀 15) CI/CD

- Pipelines must run: **typecheck → lint → test → build**.
- Artifacts (builds) are produced per app and per package.
- Deploys only from `main` (tagged releases for apps).

---

## 🔢 16) Versioning & Releases (Packages)

- Follow **Semantic Versioning**: `major.minor.patch`.
- Use **Changesets** to group and publish package releases.
- Changelogs must be generated and committed.

---

## 📦 17) Dependencies

- Workspace manager: **pnpm** only.
- Prefer **exact versions** in packages; upgrades via PRs.
- No direct dependency on app code from packages; packages are **app-agnostic**.

---

## 🧰 18) API Layer & Network

- All HTTP calls go through `packages/api` (central client with interceptors).
- Request/response models must be typed; parse and validate.
- Handle errors and retries uniformly (no ad-hoc fetches in components).

---

## 🧿 19) Observability

- Add basic metrics and tracing where applicable.
- Log correlation IDs for requests in server-side code.

---

## 🧾 20) Compliance & Ownership

- Each package has an **owner** (codeowners) and review path.
- Use `CODEOWNERS` to auto-request reviews for critical areas.

---

### ✅ Final Reminder

Rules can evolve, but until updated, every team member must **strictly follow** these guidelines.
