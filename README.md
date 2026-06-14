# Talk AI — Full-Stack AI Chatbot

A production-ready AI chatbot with Google & email authentication, real-time chat, and persistent history.

```
Frontend → Vercel   (React + Vite)
Backend  → Railway  (Node.js + Express)
Auth     → Firebase (Google + Email/Password)
Storage  → Firestore
AI       → Groq — Llama 3.3 70B
```

---

## Features

- **Google & email/password sign-in** via Firebase Authentication
- **Multi-turn conversations** — maintains last 10 exchanges as context
- **Persistent chat history** — stored per user in Firestore
- **Markdown rendering** — code blocks, tables, lists, inline formatting
- **Dark / Light mode** — auto-detects system preference, persisted in localStorage
- **Responsive** — works on mobile, tablet, and desktop
- **Suggestion chips** — quick-start prompts on welcome screen

---

## Project Structure

```
ai-chatbot/
├── client/                        # React (Vite) frontend
│   ├── src/
│   │   ├── components/            # MessageBubble, ChatInput, Sidebar, TypingIndicator
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useChat.js       # message state & send logic
│   │   ├── pages/LoginPage.jsx
│   │   ├── utils/api.js           # fetch helpers (sendMessage, history)
│   │   ├── firebase.js            # Firebase client init
│   │   ├── App.jsx
│   │   └── index.css              # all styles + dark mode + responsive
│   ├── vercel.json                # SPA rewrite rules
│   ├── .env.example
│   └── vite.config.js
├── server/                        # Express backend
│   ├── config/
│   │   ├── firebase.js            # Firebase Admin SDK init
│   │   └── serviceAccountKey.json # (local only — not committed)
│   ├── controllers/chatController.js
│   ├── middleware/auth.js         # Firebase token verification
│   ├── routes/chatRoutes.js
│   ├── index.js                   # app entry point
│   └── .env.example
├── vercel.json                    # Vercel build config
└── README.md
```

---

## Quick Start (Local Development)

### 1. Clone & install dependencies

```bash
git clone https://github.com/mohammadawan/Ai-Chatbot.git
cd ai-chatbot

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure environment variables

**server/.env**
```env
GROQ_API_KEY=your_groq_api_key
FIREBASE_SERVICE_ACCOUNT=   # leave blank locally — uses serviceAccountKey.json
PORT=5000
CLIENT_URL=http://localhost:5173
```

Place your Firebase service account JSON file at `server/config/serviceAccountKey.json`.

**client/.env.local**
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

### 3. Run

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open **http://localhost:5173**

---

## Deployment

### Backend → Railway

1. Create a new project on [railway.app](https://railway.app)
2. Connect your GitHub repo, set root directory to `server/`
3. Set environment variables in Railway dashboard:
   - `GROQ_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT` → paste your service account JSON as a string
   - `CLIENT_URL` → your Vercel frontend URL
4. Deploy — Railway uses `npm start` automatically

### Frontend → Vercel

1. Import your repo on [vercel.com](https://vercel.com)
2. Leave root directory as `/` (vercel.json handles the build)
3. Set environment variables in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_API_URL` → your Railway backend URL (e.g. `https://your-app.up.railway.app`)
4. Go to **Settings → Deployment Protection** and disable "Require Log In"
5. Deploy

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Sign-in methods → Google + Email/Password
3. Add your Vercel domain to **Authentication → Settings → Authorized Domains**
4. Enable **Firestore Database**
5. Download service account key from **Project Settings → Service Accounts**

---

## API Reference

All endpoints require `Authorization: Bearer <firebase_id_token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (no auth required) |
| POST | `/api/chat` | Send message, get AI reply |
| GET | `/api/chat/history` | Retrieve chat history |
| DELETE | `/api/chat/history` | Clear all chat history |

### POST /api/chat

**Request:**
```json
{
  "message": "Explain how async/await works",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ]
}
```

**Response:**
```json
{
  "response": "Async/await is syntactic sugar over Promises...",
  "model": "llama-3.3-70b-versatile",
  "usage": { "prompt_tokens": 45, "completion_tokens": 120, "total_tokens": 165 }
}
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, react-markdown |
| Backend | Node.js 18+, Express 4 |
| Authentication | Firebase Authentication |
| Database | Firestore |
| AI | Groq — Llama 3.3 70B |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |
