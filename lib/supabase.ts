import { createClient } from '@supabase/supabase-js';

/**
 * Shared Supabase client. Import { supabase } or { supabase, Task } from here only.
 * Single client + central config avoids duplicate bundles and keeps env usage correct.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  const msg =
    'Missing Supabase environment variables.\n' +
    'Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_SUPABASE_ANON_KEY\n' +
    'Local: add them to .env.local (see .env.example).\n' +
    'Vercel: Project → Settings → Environment Variables → add both → redeploy.';
  throw new Error(msg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
};
