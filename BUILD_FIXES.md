# Step-by-Step Build Fixes (Next.js 13.5 + Supabase)

This guide fixes **npm install** and **next build** warnings:

- Deprecated npm packages (rimraf, glob, inflight, @humanwhocodes, eslint)
- Browserslist / caniuse-lite outdated
- Supabase “Critical dependency” Webpack warning

**Goal:** Clean build, no warnings, app stays functional.

---

## Step 1: Update Deprecated Packages (Safe Changes)

### 1.1 ESLint → latest 8.x

**Done in `package.json`:** `eslint` updated from `8.49.0` to `^8.57.0`.

- Stays on ESLint 8 (required by `eslint-config-next` 13.5).
- Removes outdated 8.49 and uses latest 8.x patches.

**No code changes.** Compatible with Next.js 13.5.

### 1.2 Transitive Deprecations (rimraf, glob, inflight, @humanwhocodes)

These come from **transitive** dependencies (ESLint → flat-cache → rimraf → glob → inflight; ESLint → @humanwhocodes).

- **rimraf**, **glob**, **inflight**: Overriding to newer majors (e.g. rimraf 5, glob 10) can break `flat-cache` and thus ESLint, so we **do not override** them.
- **@humanwhocodes/\***: Tied to ESLint 8. They’re replaced in ESLint 9; upgrading would require moving to Next 14+ and ESLint 9.

**Summary:** We only upgrade **direct** deps (ESLint). Transitive deprecations stay until you upgrade Next.js / ESLint major.

**Optional – try overrides (revert if build fails):** To try reducing `rimraf` / `glob` deprecation warnings, add to `package.json`:

```json
"overrides": {
  "rimraf": "^5.0.10",
  "glob": "^10.4.5"
}
```

Then run `npm install` and `npm run build`. If ESLint, Next.js, or Netlify tooling breaks, remove the `overrides` block and run `npm install` again. The app works correctly without overrides.

---

## Step 2: Update Browserslist / caniuse-lite

### 2.1 Scripts added to `package.json`

```json
"update-browserslist": "npx update-browserslist-db@latest",
"postinstall": "npx update-browserslist-db@latest",
"build": "npm run update-browserslist && next build"
```

- **`update-browserslist`:** Run manually when you want to refresh the DB.
- **`postinstall`:** Runs after every `npm install`.
- **`build`:** Runs `update-browserslist` then `next build`. On **Vercel**, this ensures Browserslist is updated on every deploy (even with cached `node_modules`), so the “caniuse-lite is outdated” warning is avoided.

### 2.2 Commands to run

```bash
# Update lockfile and install (postinstall will run update-browserslist-db)
npm install

# Or, if you already ran install, refresh Browserslist only:
npm run update-browserslist
```

This clears: **“Browserslist: caniuse-lite is outdated. Please run npx update-browserslist-db@latest”**.

---

## Step 3: Suppress Supabase Webpack Warning

### 3.1 `next.config.js` (already configured)

The config uses **three** mechanisms so the Supabase “Critical dependency” warning is suppressed on Vercel and locally:

1. **`ignoreWarnings`** – message-based filter so webpack doesn’t treat it as a warning.
2. **`stats.warningsFilter`** – filters it from stats output.
3. **`FilterSupabaseWarningsPlugin`** – custom plugin that removes matching warnings from the compilation in `afterSeal`, so they never reach the build summary.

```js
const supabaseWarning = /Critical dependency: the request of a dependency is an expression/;

// custom plugin: filters compilation.warnings in afterSeal
function FilterSupabaseWarningsPlugin() { ... }

webpack: (config) => {
  config.ignoreWarnings = [..., { message: supabaseWarning }];
  config.stats = { ...config.stats, warningsFilter: [supabaseWarning] };
  config.plugins.push(new FilterSupabaseWarningsPlugin());
  return config;
},
```

- **Target:** The exact “Critical dependency: the request of a dependency is an expression” message from `@supabase/realtime-js`.
- **Runtime:** Supabase continues to work normally.

---

## Step 4: Supabase Imports and Client Setup

### 4.1 Single client in `lib/supabase.ts`

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars...');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export type Task = { /* ... */ };
```

### 4.2 Import only from `@/lib/supabase`

- **Server / RSC:** `import { supabase, Task } from '@/lib/supabase';`
- **Server actions:** `import { supabase } from '@/lib/supabase';`
- **Components:** `import { supabase, Task } from '@/lib/supabase';` or `Task` only when needed.

**Do not** create extra `createClient()` calls elsewhere. One shared client avoids duplicate bundles and keeps env usage correct; it does not add Webpack warnings.

---

## Step 5: Exact Commands to Apply Everything

Run in project root:

```bash
# 1. Ensure dependencies (including ESLint 8.57) and refresh Browserslist
npm install

# 2. Confirm Browserslist updated (optional)
npm run update-browserslist

# 3. Clean build
npm run build
```

You should get:

- No “Critical dependency” Supabase warning and no “Compiled with warnings”.
- No “caniuse-lite is outdated” Browserslist warning.
- Possibly fewer npm deprecation messages thanks to ESLint upgrade.

**npm “deprecated” warnings during install** (rimraf, glob, inflight, @humanwhocodes, eslint) come from transitive deps. We don’t use `overrides` because they can break the build. They will stay until you upgrade Next.js / ESLint.

---

## Step 6: Optional – Less `postinstall` Noise

If you prefer **not** to run Browserslist update on every `npm install`:

1. Remove `postinstall` from `package.json`.
2. Keep `"update-browserslist": "npx update-browserslist-db@latest"`.
3. Run `npm run update-browserslist` manually or in CI before `npm run build`.

---

## Summary of Changes

| Item | Change |
|------|--------|
| **ESLint** | `8.49.0` → `^8.57.0` in `package.json` |
| **Browserslist** | `update-browserslist` script + `postinstall` running it |
| **Supabase warning** | `ignoreWarnings` + `stats.warningsFilter` + `FilterSupabaseWarningsPlugin` in `next.config.js` |
| **Supabase usage** | Single client in `lib/supabase.ts`, import only from there |
| **rimraf / glob / inflight / @humanwhocodes** | Left as transitive; no overrides to avoid breaking Next/ESLint |

Result: **clean build**, **no Supabase or Browserslist warnings**, and **app remains functional**.
