import { useState, useCallback } from "react";
import { sendMessage as apiSendMessage } from "../utils/api";

const WELCOME = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I'm your AI assistant. Ask me anything — I'm here to help.",
  timestamp: new Date(),
};

export function useChat() {
  const [messages, setMessages] = useState([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Build history for context (skip welcome message)
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const data = await apiSendMessage(text.trim(), history);

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(err.message);
      // Add error bubble
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ ${err.message}`,
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([WELCOME]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
