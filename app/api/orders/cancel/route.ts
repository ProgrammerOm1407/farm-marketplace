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

  // Check if the order exists and belongs to the user
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("buyer_id, status")
    .eq("id", id)
    .single()

  if (orderError) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  // Only the buyer can cancel the order and only if it's pending
  if (order.buyer_id !== user.id) {
    return NextResponse.json({ error: "You can only cancel your own orders" }, { status: 403 })
  }

  if (order.status !== "pending") {
    return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 400 })
  }

  // Update the order status
  const { error: updateError } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", id)

  if (updateError) {
    return NextResponse.json({ error: "Failed to cancel order", details: updateError.message }, { status: 500 })
  }

  // Redirect back to the orders page
  return NextResponse.redirect(new URL("/dashboard/orders", request.url), 303)
}
