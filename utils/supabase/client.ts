import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the browser
let client: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseBrowserClient = () => {
  if (client) return client

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables")
  }

  client = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return client
}
