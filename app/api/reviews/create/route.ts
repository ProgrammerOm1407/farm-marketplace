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

  try {
    // Get request body
    const { order_id, farmer_id, listing_id, rating, title, content } = await request.json()

    // Validate inputs
    if (!order_id || !farmer_id || !listing_id || !rating || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if the order exists and is completed
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("status, buyer_id")
      .eq("id", order_id)
      .single()

    if (orderError) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Verify the user is the buyer of this order
    if (order.buyer_id !== user.id) {
      return NextResponse.json({ error: "You can only review orders you've purchased" }, { status: 403 })
    }

    // Verify the order is completed
    if (order.status !== "completed") {
      return NextResponse.json({ error: "You can only review completed orders" }, { status: 400 })
    }

    // Check if the user has already reviewed this order
    const { data: existingReview, error: reviewCheckError } = await supabase
      .from("reviews")
      .select("id")
      .eq("order_id", order_id)
      .eq("buyer_id", user.id)
      .maybeSingle()

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this order" }, { status: 400 })
    }

    // Create the review
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        order_id,
        buyer_id: user.id,
        farmer_id,
        listing_id,
        rating,
        title,
        content,
      })
      .select()
      .single()

    if (reviewError) {
      throw reviewError
    }

    return NextResponse.json({ success: true, review })
  } catch (error: any) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review", details: error.message }, { status: 500 })
  }
}
