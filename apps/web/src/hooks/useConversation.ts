import { useState, useEffect, useCallback } from "react";
import { Conversation, ConversationDetail, ApiMessage, Message } from "@/types";

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false); // Global loading for initial fetch
  const [isNavigating, setIsNavigating] = useState(false); // Specific for conversation switching
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectConversation = useCallback(
    async (id: string): Promise<Message[]> => {
      // Don't set global isLoading, use isNavigating for the transition
      setIsNavigating(true);
      setCurrentConversationId(id);
      try {
        const res = await fetch(`/api/conversations/${id}`);
        if (!res.ok) throw new Error("Failed to fetch conversation details");
        const data: ConversationDetail = await res.json();

        // Transform ApiMessage to Message[]
        const uiMessages: Message[] = data.messages.flatMap(
          (msg: ApiMessage) => {
            const userMsg: Message = {
              id: `${msg.id}-user`,
              content: msg.user_prompt,
              isUser: true,
            };
            const botMsg: Message = {
              id: `${msg.id}-bot`,
              content: msg.bot_response,
              isUser: false,
            };
            return [userMsg, botMsg];
          }
        );

        // Ensure chronological order if necessary (assuming API returns sorted or we trust timestamp)
        // If we needed to sort:
        // uiMessages.sort(...) but we split one object into two, so they are already adjacent.

        return uiMessages;
      } catch (err) {
        console.error(err);
        setError("Failed to load conversation");
        return [];
      } finally {
        setIsNavigating(false);
      }
    },
    []
  );

  const updateConversationTitle = useCallback(
    async (id: string, newTitle: string) => {
      setUpdatingId(id);
      try {
        const res = await fetch(`/api/conversations/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle }),
        });
        if (!res.ok) throw new Error("Failed to update conversation");

        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to update title");
      } finally {
        setUpdatingId(null);
      }
    },
    []
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/conversations/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete conversation");

        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (currentConversationId === id) {
          setCurrentConversationId(null);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to delete conversation");
      } finally {
        setDeletingId(null);
      }
    },
    [currentConversationId]
  );

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    currentConversationId,
    isLoading,
    isNavigating,
    updatingId,
    deletingId,
    error,
    fetchConversations,
    selectConversation,
    updateConversationTitle,
    deleteConversation,
    setCurrentConversationId, // Exposed to allow clearing selection
  };
}
