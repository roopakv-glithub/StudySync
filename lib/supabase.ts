import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yaudakrqojqdvmqmekbs.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhdWRha3Jxb2pxZHZtcW1la2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzQxNDEsImV4cCI6MjA5NjA1MDE0MX0.YjgjG2Od9G5EAx68fdAsvVik91kQdjcSbOT5zZ-9eGs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
