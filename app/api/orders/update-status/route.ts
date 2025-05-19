import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const url = new URL(request.url)
  const id = url.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
  }

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get the request body
  const { status, notes } = await request.json()

  // Validate status
  const validStatuses = [
    "pending",
    "confirmed",
    "processing",
    "ready",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
  ]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  // Check if the order exists and belongs to the user
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("farmer_id, status")
    .eq("id", id)
    .single()

  if (orderError) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  // Only the farmer can update the order status
  if (order.farmer_id !== user.id) {
    return NextResponse.json({ error: "You can only update orders for your listings" }, { status: 403 })
  }

  // Update the order status
  const { error: updateError } = await supabase.from("orders").update({ status }).eq("id", id)

  if (updateError) {
    return NextResponse.json({ error: "Failed to update order status", details: updateError.message }, { status: 500 })
  }

  // Redirect back to the order page
  return NextResponse.json({ success: true })
}
