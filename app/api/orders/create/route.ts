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

  // Get the user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.user_type !== "buyer") {
    return NextResponse.json({ error: "Only buyers can create orders" }, { status: 403 })
  }

  // Get form data
  const formData = await request.formData()
  const listingId = formData.get("listing_id") as string
  const farmerId = formData.get("farmer_id") as string
  const unitPrice = Number.parseFloat(formData.get("unit_price") as string)
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const notes = formData.get("notes") as string
  const shippingAddress = formData.get("shipping_address") as string
  const shippingCity = formData.get("shipping_city") as string
  const shippingState = formData.get("shipping_state") as string
  const shippingZip = formData.get("shipping_zip") as string
  const shippingNotes = formData.get("shipping_notes") as string
  const paymentMethod = formData.get("payment_method") as string

  // Validate inputs
  if (
    !listingId ||
    !farmerId ||
    !unitPrice ||
    !quantity ||
    !shippingAddress ||
    !shippingCity ||
    !shippingState ||
    !shippingZip
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Calculate total price
  const totalPrice = unitPrice * quantity

  // Fetch the listing to check availability
  const { data: listing, error: listingError } = await supabase
    .from("grain_listings")
    .select("quantity, minimum_order, status")
    .eq("id", listingId)
    .single()

  if (listingError) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 })
  }

  // Check if listing is active
  if (listing.status !== "active") {
    return NextResponse.json({ error: "This listing is no longer available" }, { status: 400 })
  }

  // Check if quantity is available
  if (quantity > listing.quantity) {
    return NextResponse.json({ error: "Requested quantity exceeds available quantity" }, { status: 400 })
  }

  // Check if quantity meets minimum order
  if (listing.minimum_order && quantity < listing.minimum_order) {
    return NextResponse.json({ error: `Minimum order quantity is ${listing.minimum_order}` }, { status: 400 })
  }

  try {
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        listing_id: listingId,
        buyer_id: user.id,
        farmer_id: farmerId,
        quantity: quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        status: "pending",
        payment_status: "pending",
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_zip: shippingZip,
        shipping_notes: shippingNotes,
        notes: notes,
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Create initial order history entry
    const { error: historyError } = await supabase.from("order_history").insert({
      order_id: order.id,
      status: "pending",
      payment_status: "pending",
      notes: "Order created",
      created_by: user.id,
    })

    if (historyError) {
      console.error("Error creating order history:", historyError)
    }

    // Redirect to the order confirmation page
    return NextResponse.redirect(new URL(`/dashboard/orders/${order.id}/confirmation`, request.url), 303)
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order", details: error.message }, { status: 500 })
  }
}
