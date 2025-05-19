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
  const { amount, payment_method, transaction_reference, notes } = await request.json()

  // Validate amount
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
  }

  // Check if the order exists and belongs to the user
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("buyer_id, farmer_id, total_price, payment_status")
    .eq("id", id)
    .single()

  if (orderError) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  // Only the buyer can record payments
  if (order.buyer_id !== user.id) {
    return NextResponse.json({ error: "Only the buyer can record payments" }, { status: 403 })
  }

  try {
    // Start a transaction
    // Record the payment
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        order_id: id,
        amount,
        payment_method,
        transaction_reference,
        status: "pending", // Payments start as pending until confirmed by the farmer
        notes,
      })
      .select()
      .single()

    if (transactionError) {
      throw transactionError
    }

    // Get all paid transactions for this order
    const { data: transactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("amount, status")
      .eq("order_id", id)
      .eq("status", "paid")

    if (transactionsError) {
      throw transactionsError
    }

    // Calculate total paid amount
    const totalPaid = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
    const newPaymentStatus =
      totalPaid + Number(amount) >= Number(order.total_price)
        ? "paid"
        : totalPaid + Number(amount) > 0
          ? "partially_paid"
          : "pending"

    // Update the order payment status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: newPaymentStatus })
      .eq("id", id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error recording payment:", error)
    return NextResponse.json({ error: "Failed to record payment", details: error.message }, { status: 500 })
  }
}
