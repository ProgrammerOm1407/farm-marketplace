import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const url = new URL(request.url)
  const id = url.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Listing ID is required" }, { status: 400 })
  }

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if the listing belongs to the user
  const { data: listing, error: listingError } = await supabase
    .from("grain_listings")
    .select("farmer_id")
    .eq("id", id)
    .single()

  if (listingError) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 })
  }

  if (listing.farmer_id !== user.id) {
    return NextResponse.json({ error: "You can only delete your own listings" }, { status: 403 })
  }

  // Delete the listing
  const { error: deleteError } = await supabase.from("grain_listings").delete().eq("id", id)

  if (deleteError) {
    return NextResponse.json({ error: "Failed to delete listing", details: deleteError.message }, { status: 500 })
  }

  // Redirect back to the listings page
  return NextResponse.redirect(new URL("/dashboard/listings", request.url), 303)
}
