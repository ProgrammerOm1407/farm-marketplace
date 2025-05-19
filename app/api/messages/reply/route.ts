import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const url = new URL(request.url)
  const conversationId = url.searchParams.get("conversation_id")

  if (!conversationId) {
    return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
  }

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if the user is part of this conversation
  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("buyer_id, farmer_id")
    .eq("id", conversationId)
    .single()

  if (conversationError) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
  }

  if (conversation.buyer_id !== user.id && conversation.farmer_id !== user.id) {
    return NextResponse.json({ error: "You are not part of this conversation" }, { status: 403 })
  }

  // Get form data
  const formData = await request.formData()
  const message = formData.get("message") as string

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  // Insert the message
  const { error: messageError } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: message,
  })

  if (messageError) {
    return NextResponse.json({ error: "Failed to send message", details: messageError.message }, { status: 500 })
  }

  // Redirect back to the conversation
  return NextResponse.redirect(new URL(`/dashboard/messages/${conversationId}`, request.url), 303)
}
