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

  if (profileError) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  // Get form data
  const formData = await request.formData()
  const listingId = formData.get("listing_id") as string
  const farmerId = formData.get("farmer_id") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  // Validate inputs
  if (!listingId || !farmerId || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Check if the user is trying to message themselves
  if (user.id === farmerId) {
    return NextResponse.json({ error: "You cannot message yourself" }, { status: 400 })
  }

  try {
    // Start a transaction
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .insert({
        listing_id: listingId,
        buyer_id: user.id,
        farmer_id: farmerId,
        subject: subject,
      })
      .select()
      .single()

    if (conversationError) {
      throw conversationError
    }

    // Insert the first message
    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      content: message,
    })

    if (messageError) {
      throw messageError
    }

    // Redirect to the messages page
    return NextResponse.redirect(new URL(`/dashboard/messages/${conversation.id}`, request.url), 303)
  } catch (error: any) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation", details: error.message }, { status: 500 })
  }
}
