import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get the user's profile to check if they're a farmer
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.user_type !== "farmer") {
    return NextResponse.json({ error: "Only farmers can create listings" }, { status: 403 })
  }

  // Get form data
  const formData = await request.formData()

  // Extract listing data
  const listingData = {
    farmer_id: user.id,
    title: formData.get("title") as string,
    grain_type: formData.get("grain_type") as string,
    farming_method: formData.get("farming_method") as string,
    price: Number.parseFloat(formData.get("price") as string),
    quantity: Number.parseInt(formData.get("quantity") as string),
    quantity_unit: formData.get("quantity_unit") as string,
    harvest_date: formData.get("harvest_date") ? new Date(formData.get("harvest_date") as string).toISOString() : null,
    minimum_order: formData.get("minimum_order") ? Number.parseInt(formData.get("minimum_order") as string) : null,
    description: formData.get("description") as string,
    location: formData.get("location") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    country: (formData.get("country") as string) || "United States",
    featured: formData.get("featured") === "true",
    status: "active",
    images: "[]",
  }

  // Insert the listing
  const { data, error } = await supabase.from("grain_listings").insert(listingData).select()

  if (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ error: "Failed to create listing", details: error.message }, { status: 500 })
  }

  // Redirect to the listings page
  return NextResponse.redirect(new URL("/dashboard/listings", request.url), 303)
}
