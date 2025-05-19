import { createClient } from "@/utils/supabase/server"
import { SiteHeader } from "./site-header"

export async function SiteHeaderServer() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <SiteHeader user={user} />
}
