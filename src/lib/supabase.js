import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fpqnuqqiykaemvjkuqvr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwcW51cXFpeWthZW12amt1cXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjMxNjIsImV4cCI6MjA4ODA5OTE2Mn0.pFS_HrKYTNA-L5CRRhWMcYI14GGNtZx28W-78DFCN2s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
