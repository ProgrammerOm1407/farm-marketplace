import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/layout/site-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { formatDistanceToNow, format } from "date-fns"
import { MessageSquare, ArrowLeft } from "lucide-react"

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect(`/login?redirect=/dashboard/messages/${params.id}`)
  }

  // Get the conversation with related data
  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select(`
      *,
      buyer:buyer_id (
        id,
        full_name,
        company_name
      ),
      farmer:farmer_id (
        id,
        full_name,
        company_name
      ),
      listing:listing_id (
        id,
        title
      )
    `)
    .eq("id", params.id)
    .single()

  if (conversationError || !conversation) {
    console.error("Error fetching conversation:", conversationError)
    notFound()
  }

  // Check if the user is part of this conversation
  if (conversation.buyer_id !== user.id && conversation.farmer_id !== user.id) {
    redirect("/dashboard/messages")
  }

  // Get messages for this conversation
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id (
        id,
        full_name,
        company_name
      )
    `)
    .eq("conversation_id", params.id)
    .order("created_at", { ascending: true })

  if (messagesError) {
    console.error("Error fetching messages:", messagesError)
  }

  // Mark unread messages as read if they were sent by the other user
  const unreadMessages = messages?.filter((msg) => !msg.read && msg.sender_id !== user.id) || []

  if (unreadMessages.length > 0) {
    const unreadIds = unreadMessages.map((msg) => msg.id)
    await supabase.from("messages").update({ read: true }).in("id", unreadIds)
  }

  // Determine if the current user is the buyer or farmer
  const isBuyer = conversation.buyer_id === user.id
  const otherParty = isBuyer ? conversation.farmer : conversation.buyer
  const otherPartyName = otherParty?.company_name || otherParty?.full_name || "User"

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <div className="mb-6">
            <Link href="/dashboard/messages" className="inline-flex items-center text-green-600 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Messages
            </Link>
          </div>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{conversation.subject}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Conversation with {otherPartyName}
                    {conversation.listing && (
                      <>
                        {" "}
                        about{" "}
                        <Link
                          href={`/marketplace/${conversation.listing.id}`}
                          className="text-green-600 hover:underline"
                        >
                          {conversation.listing.title}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <div className="text-sm text-gray-500">Started {format(new Date(conversation.created_at), "PPP")}</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 space-y-6">
                {messages && messages.length > 0 ? (
                  messages.map((message) => {
                    const isCurrentUser = message.sender_id === user.id
                    const senderName = isCurrentUser
                      ? "You"
                      : message.sender?.company_name || message.sender?.full_name || "User"

                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            isCurrentUser ? "bg-green-100 text-green-900" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{senderName}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No messages yet</h3>
                    <p className="text-gray-500">Start the conversation by sending a message below.</p>
                  </div>
                )}
              </div>

              <div className="border-t p-6">
                <form action={`/api/messages/reply?conversation_id=${conversation.id}`} method="post">
                  <div className="space-y-4">
                    <Textarea
                      name="message"
                      placeholder={`Write a message to ${otherPartyName}...`}
                      rows={4}
                      required
                    />
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Send Message
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
