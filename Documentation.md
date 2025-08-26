[Rule]

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
  - `getUserJson()`, `buildConfigObject()`,
- **Primitive returns** should read naturally:
  - `getUserName(): string`, `getRetryCount(): number`
- **Async functions** must end with `Async`:
  - `fetchUserAsync()`, `saveOrderAsync()`

---

## 📂 2) Monorepo Structure (Turborepo + bun)
```
repo-root/
├─ apps/               # deployable apps (web, mobile, admin)
├─ packages/           # shared libraries (ui, utils, config, api, eslint-config)
├─ turbo.json          # Turborepo pipeline & caching
├─ bun-workspace.yaml # workspace configuration
└─ tsconfig.base.json  # shared TS config & path aliases
```
**Placement rules**
- UI primitives/components → `packages/ui`
- Cross-project helpers → `packages/utils`
- API client / SDK / services → `packages/api`
- Shared config/constants/env schema → `packages/config`
- App-specific pages/routes only inside `apps/*`

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
- **Conventional Commits** required: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:`, `build:`,

---

## 🔍 5) Pull Requests & Reviews
- At least **1 approval** required.

**PR Checklist**
- [ ] Lint, typecheck, tests, and build pass
- [ ] No TODOs / leftover `console.log`
- [ ] Appropriate changeset added (if packages changed)

---
## 🎨 6) Linting, Formatting & Hooks
- **Biome** is mandatory (replaces ESLint + Prettier).
- Run `bun lint` & `bun format` before pushing.
- Pre-commit hooks via **husky + lint-staged**:
  - `typecheck`, `lint`, `format`, `test --changed`
- No `any` without justification; prefer proper typing.

---

## 🔐 8) Security & Secrets
- Never commit secrets. Use `.env.local` and keep `.env.example` updated.
- Validate and parse env via a schema (e.g., `zod`).
- Don’t log tokens. Scrub sensitive fields in logs.

---

## 🛠 9) Error Handling & Logging
- No silent failures—either **throw** or **log** with context.
- Centralize logging (e.g., `packages/logger`) with levels: `error`, `warn`, `info`, `debug`.

---

## 🧩 10) React/Next.js Component Rules
- UI components: **pure & presentational**; move business logic to hooks/services.
- Props must be fully typed; avoid `any` and over-wide types.
- Avoid prop drilling—prefer context/hooks/zustand where appropriate.
- Pages in Next.js handle routing; heavy logic belongs to hooks/services.

---

## 🏎 11) Performance
- Avoid unnecessary re-renders (memoize where it actually helps).
- No magic numbers; move constants to `packages/config`.

---

## ♻️ 12) Clean Code
- Prefer **early returns** over deeply nested `if` ladders (max nesting: 3).
- No dead code, commented-out blocks, or unused exports.
- Clear function boundaries; single responsibility per file (~300 LOC guideline).

---

## 📦 13) Dependencies
- Workspace manager: **bun** only.
- Prefer **exact versions** in packages; upgrades via PRs.

---

## 🧰 14) API Layer & Network
- All HTTP calls go through `packages/api` (central client with interceptors).
- Request/response models must be typed; parse and validate.

---

### ✅ Final Reminder
Rules can evolve, but until updated, every team member must **strictly follow** these guidelines.
