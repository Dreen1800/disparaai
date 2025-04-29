import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pmcnskdjjqkpwrnpyrjq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtY25za2RqanFrcHdybnB5cmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MDI3NzAsImV4cCI6MjA2MTQ3ODc3MH0.mQ1UTlbnC_PZ1MJ55kcgGZm3-nRzCG1Rdu9STePlI7g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)