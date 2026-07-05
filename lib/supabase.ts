import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yaudakrqojqdvmqmekbs.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhdWRha3Jxb2pxZHZtcW1la2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzQxNDEsImV4cCI6MjA5NjA1MDE0MX0.YjgjG2Od9G5EAx68fdAsvVik91kQdjcSbOT5zZ-9eGs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Feedback = {
  id: string
  name: string | null
  message: string
  rating: number | null
  created_at: string
}

/** Read the current download count (also used as the active-student count). */
export async function getDownloadCount(): Promise<number> {
  const { data, error } = await supabase
    .from('app_stats')
    .select('downloads')
    .eq('id', 1)
    .single()

  if (error || !data) return 0
  return Number(data.downloads) || 0
}

/** Atomically increment the download count and return the new value. */
export async function incrementDownloadCount(): Promise<number | null> {
  const { data, error } = await supabase.rpc('increment_downloads')
  if (error) {
    console.log('[v0] increment_downloads error:', error.message)
    return null
  }
  return Number(data)
}

/** Fetch recent, non-empty feedback for the testimonials wall. */
export async function getFeedback(limit = 12): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('id, name, message, rating, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.log('[v0] getFeedback error:', error?.message)
    return []
  }
  return data as Feedback[]
}
