import { createClient } from '@supabase/supabase-js'

const STORAGE_URL = 'https://czzkufhubdhqzbdhwljm.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6emt1Zmh1YmRocXpiZGh3bGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwODc5ODAsImV4cCI6MjAzNzY2Mzk4MH0.K929CYKFh0DyKgxRKQYvWIZKZzHytsHACrHuvFbHgtk'

export const supabase = createClient(STORAGE_URL, ANON_KEY);