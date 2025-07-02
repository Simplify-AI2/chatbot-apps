// Utility for checking authentication state using Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function isAuthenticated() {
  const { data } = await supabase.auth.getUser();
  return !!data.user;
}

export async function logout() {
  await supabase.auth.signOut();
}
