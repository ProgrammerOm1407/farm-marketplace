import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get form data
  const formData = await request.formData()

  // Extract profile data
  const profileData = {
    full_name: formData.get("full_name") as string,
    company_name: formData.get("company_name") as string,
    phone: formData.get("phone") as string,
    bio: formData.get("bio") as string,
    website: formData.get("website") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zip_code: formData.get("zip_code") as string,
    country: formData.get("country") as string,
    updated_at: new Date().toISOString(),
  }

  // Update the profile
  const { error: updateError } = await supabase.from("profiles").update(profileData).eq("id", user.id)

  if (updateError) {
    return NextResponse.json({ error: "Failed to update profile", details: updateError.message }, { status: 500 })
  }

  return NextResponse.redirect(new URL("/profile", request.url), 303)
}
