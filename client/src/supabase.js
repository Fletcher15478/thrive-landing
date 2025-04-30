import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hivsguxbwzujhzjibgrg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdnNndXhid3p1amh6amliZ3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjE1NjcsImV4cCI6MjA1ODgzNzU2N30.kK3kXcPKvS69B4zrSb1C44CVqPRm0opRlEcskXkTcGY';

export const supabase = createClient(supabaseUrl, supabaseKey);
