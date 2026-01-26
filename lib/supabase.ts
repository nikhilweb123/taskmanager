import { createClient } from '@supabase/supabase-js';

/**
 * Task type - can be imported by both server and client components
 */
export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
};

/**
 * Shared Supabase client. Import { supabase } or { supabase, Task } from here only.
 * Single client + central config avoids duplicate bundles and keeps env usage correct.
 * 
 * For Vercel, you can use either:
 * - SUPABASE_URL and SUPABASE_ANON_KEY (server-only, recommended)
 * - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (if needed for client-side)
 */
// Try multiple env var naming conventions for flexibility
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.SUPABASE_URL;
  
const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Only throw error on server-side (during build or runtime)
  // On client-side, env vars without NEXT_PUBLIC_ will be undefined, but that's OK
  // since the client doesn't actually use the supabase client directly
  if (typeof window === 'undefined') {
    const msg =
      'Missing Supabase environment variables.\n' +
      'Required: SUPABASE_URL and SUPABASE_ANON_KEY\n' +
      'Local: add them to .env.local\n' +
      'Vercel: Project → Settings → Environment Variables → add both → redeploy.';
    throw new Error(msg);
  }
}

// Create client with fallback values for client-side (will fail at runtime if actually used)
// This allows the module to be imported by client components without errors
export const supabase = createClient(
  supabaseUrl || 'https://pjcjqubmelesupadyiyo.supabase.co',
  supabaseAnonKey || 'sb_publishable_4_PiCUsjxP9EjoKL7SOvyw_fntIcLt7'
);