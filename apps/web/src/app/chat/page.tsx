"use client";

import { useEffect, useRef } from "react";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useChatStream } from "@/hooks/useChatStream";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserProfile } from "@/components/UserProfile";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import { useConversation } from "@/hooks/useConversation";

export default function Home() {
  const { messages, setMessages, isLoading, sendMessage } = useChatStream();
  const {
    conversations,
    currentConversationId,
    selectConversation,
    updateConversationTitle,
    deleteConversation,
    setCurrentConversationId,
    fetchConversations,
    isNavigating,
    updatingId,
    deletingId,
  } = useConversation();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSelectConversation = async (id: string) => {
    const historicalMessages = await selectConversation(id);
    setMessages(historicalMessages);
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
  };

  const handleSendMessage = (content: string, fileUri?: string) => {
    sendMessage(content, fileUri, currentConversationId || undefined);
    
    // Refresh conversation list to show new conversation if it was created
    if (!currentConversationId) {
       // Using a timeout as a simple way to wait for creation. 
       // Ideally getting the ID back from the stream would be better.
       setTimeout(() => fetchConversations(), 1000);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 px-6 py-4 backdrop-blur-xl shrink-0 border-b border-border">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Chat bot
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">

      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentId={currentConversationId}
        onSelect={handleSelectConversation}
        onDelete={deleteConversation}
        onRename={updateConversationTitle}
        onNewChat={handleNewChat}
        updatingId={updatingId}
        deletingId={deletingId}
      />
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full relative min-w-0">

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          <div className="mx-auto flex max-w-4xl flex-col gap-2">
            {isNavigating ? (
               <div className="flex h-full flex-col items-center justify-center space-y-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-muted-foreground animate-pulse">Loading conversation...</p>
               </div>
            ) : (
            <>
            {messages.length === 0 && (
              <div className="mt-20 flex flex-col items-center justify-center text-center text-muted-foreground">
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start a conversation!</p>
              </div>
            )}

            {messages.map((msg) => (
              (msg.isUser || msg.content) && (
                <ChatBubble key={msg.id} message={msg.content} isUser={msg.isUser} />
              )
            ))}
            {isLoading && messages.length > 0 && (
              messages[messages.length - 1].isUser || 
              (!messages[messages.length - 1].isUser && !messages[messages.length - 1].content)
            ) && (
              <TypingIndicator />
            )}

            <div ref={messagesEndRef} />
            </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 z-10 bg-gradient-to-t from-background to-transparent px-4 pb-6 pt-2 shrink-0">
          <div className="mx-auto flex max-w-4xl justify-center">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
