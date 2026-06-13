import { useAuth } from "../context/AuthContext";

export default function Sidebar({ messageCount, onClear, darkMode, toggleDark, user }) {
  const { logout } = useAuth();

  const initial = user?.displayName?.[0]?.toUpperCase()
    || user?.email?.[0]?.toUpperCase()
    || "?";

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M3 14V8a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H3Z"
              stroke="currentColor" strokeWidth="1.5" />
            <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
            <circle cx="12.5" cy="10.5" r="1" fill="currentColor" />
          </svg>
        </div>
        <span className="logo-text">Talk AI</span>
      </div>

      {/* New chat */}
      <button className="new-chat-btn" onClick={onClear}>
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
          <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        New chat
      </button>

      {/* Nav */}
      <nav className="sidebar-nav">
        <button className="nav-item active">
          <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
            <path d="M14 10a2 2 0 0 1-2 2H4l-3 3V3a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v7z"
              stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
          Chat
          {messageCount > 1 && (
            <span className="nav-count">{messageCount - 1}</span>
          )}
        </button>
      </nav>

      <div className="sidebar-spacer" />

      {/* Settings row */}
      <div className="sidebar-bottom">
        <button className="icon-btn" onClick={toggleDark} title={darkMode ? "Light mode" : "Dark mode"}>
          {darkMode ? (
            <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
              <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.9 11.9l1.05 1.05M3.05 12.95l1.06-1.06M11.9 4.1l1.05-1.05"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
              <path d="M13.5 8.5A5.5 5.5 0 1 1 7.5 2.5a4 4 0 0 0 6 6z"
                stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-avatar-sm">{initial}</div>
          <span className="user-name">{displayName}</span>
        </div>

        <button className="icon-btn" onClick={logout} title="Sign out">
          <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
            <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M11 11l3-3-3-3M14 8H6"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
