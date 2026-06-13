import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const FIREBASE_ERRORS = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "No account found with this email.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/popup-closed-by-user": "Sign-in was cancelled.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
};

export default function LoginPage() {
  const { login, signup, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const wrap = (fn) => async (...args) => {
    setError("");
    setLoading(true);
    try {
      await fn(...args);
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = wrap(async (e) => {
    e.preventDefault();
    if (mode === "login") await login(email, password);
    else await signup(email, password);
  });

  const handleGoogle = wrap(loginWithGoogle);

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-mark">
            <svg viewBox="0 0 20 20" fill="none" width="22" height="22">
              <path d="M3 14V8a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H3Z"
                stroke="currentColor" strokeWidth="1.5" />
              <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
              <circle cx="12.5" cy="10.5" r="1" fill="currentColor" />
            </svg>
          </div>
          <h1 className="login-title">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="login-sub">
            {mode === "login"
              ? "Sign in to continue to Talk AI"
              : "Get started — it's free"}
          </p>
        </div>

        {error && (
          <div className="login-error" role="alert">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14" style={{flexShrink:0,marginTop:1}}>
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Google */}
        <button className="login-google" onClick={handleGoogle} disabled={loading}>
          <svg viewBox="0 0 24 24" width="16" height="16" style={{flexShrink:0}}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-divider"><span>or</span></div>

        {/* Email form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>
          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="login-toggle">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} disabled={loading}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
