import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/layout/site-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"

export default async function MessagesPage() {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login?redirect=/dashboard/messages")
  }

  // Get the user's conversations
  const { data: conversations, error: conversationsError } = await supabase
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
      ),
      messages (
        id,
        sender_id,
        content,
        read,
        created_at
      )
    `)
    .or(`buyer_id.eq.${user.id},farmer_id.eq.${user.id}`)
    .order("updated_at", { ascending: false })

  if (conversationsError) {
    console.error("Error fetching conversations:", conversationsError)
  }

  // Process conversations to get last message and unread count
  const processedConversations = conversations?.map((conversation) => {
    // Sort messages by created_at (newest first)
    const sortedMessages = [...(conversation.messages || [])].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    // Get the last message
    const lastMessage = sortedMessages[0]

    // Count unread messages not sent by the current user
    const unreadCount = sortedMessages.filter((msg) => !msg.read && msg.sender_id !== user.id).length

    // Determine if the user is the buyer or farmer
    const isBuyer = conversation.buyer_id === user.id
    const otherParty = isBuyer ? conversation.farmer : conversation.buyer
    const otherPartyName = otherParty?.company_name || otherParty?.full_name || "User"

    return {
      ...conversation,
      lastMessage,
      unreadCount,
      otherPartyName,
    }
  })

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1">
        <SiteHeader />
        <main className="flex-1 container py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-gray-500">Manage your conversations with buyers and farmers</p>
            </div>
          </div>

          {processedConversations && processedConversations.length > 0 ? (
            <div className="grid gap-4">
              {processedConversations.map((conversation) => (
                <Link key={conversation.id} href={`/dashboard/messages/${conversation.id}`}>
                  <Card className={conversation.unreadCount > 0 ? "border-green-500" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <span className="font-medium text-green-600">
                            {conversation.otherPartyName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium truncate">{conversation.otherPartyName}</div>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-green-600">{conversation.unreadCount} new</Badge>
                            )}
                            <div className="ml-auto text-xs text-gray-500">
                              {conversation.lastMessage
                                ? formatDistanceToNow(new Date(conversation.lastMessage.created_at), {
                                    addSuffix: true,
                                  })
                                : formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true })}
                            </div>
                          </div>
                          <div className="font-medium text-sm truncate">{conversation.subject}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage ? conversation.lastMessage.content : "No messages yet"}
                          </div>
                          {conversation.listing && (
                            <div className="text-xs text-gray-500 mt-1">Re: {conversation.listing.title}</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Messages Yet</h2>
              <p className="text-gray-500 mb-6">You don't have any conversations yet.</p>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
