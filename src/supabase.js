import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your Supabase project credentials
// Get these from: https://app.supabase.com/project/_/settings/api
const supabaseUrl = 'https://pkovtwqbhvcfcplutcvu.supabase.co';
const supabaseAnonKey = 'sb_publishable_JGsnLvlxkrCeE-UQtgdjXQ_4ECH8U3I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
