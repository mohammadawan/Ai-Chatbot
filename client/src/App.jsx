import { useEffect, useRef, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useChat } from "./hooks/useChat";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";

const SUGGESTIONS = [
  "Explain how React's useEffect hook works",
  "Write a Python function to parse JSON from an API",
  "What's the difference between TCP and UDP?",
  "Help me write a regex to validate email addresses",
];

export default function App() {
  const { user, loading } = useAuth();
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const bottomRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isWelcome = messages.length === 1 && messages[0].id === "welcome";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar
        messageCount={messages.length}
        onClear={clearMessages}
        darkMode={darkMode}
        toggleDark={() => setDarkMode((d) => !d)}
        user={user}
      />

      <div className="chat-panel">
        {/* Mobile header */}
        <header className="mobile-header">
          <button className="menu-btn" onClick={() => setSidebarOpen((o) => !o)} aria-label="Menu">
            <svg viewBox="0 0 16 16" fill="none" width="18" height="18">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
          <span className="mobile-title">Talk AI</span>
          <div style={{ width: 36 }} />
        </header>

        <main className="messages-area">
          {isWelcome ? (
            <div className="welcome-state">
              <div className="welcome-icon">
                <svg viewBox="0 0 20 20" fill="none" width="28" height="28">
                  <path d="M3 14V8a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H3Z"
                    stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
                  <circle cx="12.5" cy="10.5" r="1" fill="currentColor" />
                </svg>
              </div>
              <h2 className="welcome-title">How can I help you?</h2>
              <p className="welcome-sub">Powered by Llama 3.3 · 70B</p>
              <div className="suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-inner">
              {messages.filter((m) => m.id !== "welcome").map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </main>

        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}
    </div>
  );
}
