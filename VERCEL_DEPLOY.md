# Deploy to Vercel (Production Build)

The app uses Supabase. **You must add your Supabase env vars in Vercel** or the build will fail with:

```text
Error: Missing Supabase environment variables...
Failed to collect page data for /
```

`.env.local` is not deployed (it’s gitignored). Configure the variables in Vercel instead.

---

## 1. Add environment variables in Vercel

1. Open your [Vercel Dashboard](https://vercel.com/dashboard) and select the project.
2. Go to **Settings** → **Environment Variables**.
3. Add these two variables:

   | Name                         | Value                                      | Environments   |
   |-----------------------------|--------------------------------------------|----------------|
   | `NEXT_PUBLIC_SUPABASE_URL`  | `https://xxxxxxxxxxxxx.supabase.co`        | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (your anon key)              | Production, Preview, Development |

4. Get the values from [Supabase](https://app.supabase.com) → your project → **Project Settings** → **API** (Project URL and anon/public key).
5. Save. **Redeploy** the project (Deployments → … → Redeploy) so the new variables are used.

---

## 2. Deploy

- **Git:** Push to your connected branch; Vercel will build and deploy.
- **Redeploy:** After changing env vars, trigger a new deployment (e.g. redeploy from the Deployments tab).

---

## 3. Check the build

The build runs:

1. `npm install`
2. `npm run update-browserslist && next build`

If you see **Missing Supabase environment variables**, the vars are not set correctly in Vercel. Confirm:

- Names are exactly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- They’re enabled for the environment you’re building (e.g. Production).
- You’ve redeployed after adding or changing them.

---

## Quick reference

- **Local:** Use `.env.local` (see `.env.example`).
- **Vercel:** Use **Settings → Environment Variables**; never commit secrets.
