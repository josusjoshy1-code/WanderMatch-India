import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qbrfgqznigvsptednfli.supabase.co';
const supabaseAnonKey = 'sb_publishable_VaxYQXbQ0jq-FqFkSDjrFA_VQBOI8km';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);