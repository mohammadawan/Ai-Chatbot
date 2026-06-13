# NexusAI — Full-Stack AI Chatbot

A production-ready AI chatbot built with the MERN stack and OpenAI.

```
Frontend → Vercel   (React + Vite)
Backend  → Railway  (Node.js + Express)
Database → MongoDB Atlas
AI       → OpenAI GPT-3.5-Turbo
```

---

## 📁 Project Structure

```
ai-chatbot/
├── client/               # React (Vite) frontend
│   ├── src/
│   │   ├── components/   # MessageBubble, ChatInput, Sidebar, TypingIndicator
│   │   ├── hooks/        # useChat — message state management
│   │   ├── utils/        # api.js — backend fetch helpers
│   │   ├── App.jsx
│   │   └── index.css     # All styles + dark mode + responsive
│   ├── .env.example
│   └── vite.config.js
├── server/               # Express backend
│   ├── config/db.js      # MongoDB connection
│   ├── controllers/chatController.js
│   ├── models/Chat.js    # Mongoose schema
│   ├── routes/chatRoutes.js
│   ├── index.js          # App entry point
│   └── .env.example
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Clone & install dependencies

```bash
git clone <your-repo-url>
cd ai-chatbot

# Backend
cd server
npm install
cp .env.example .env   # fill in your keys

# Frontend
cd ../client
npm install
cp .env.example .env   # set VITE_API_URL if needed (blank = proxy)
```

### 2. Configure environment variables

**server/.env**
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ai-chatbot?retryWrites=true&w=majority
OPENAI_API_KEY=sk-...
PORT=5000
CLIENT_URL=http://localhost:5173
```

**client/.env** (leave blank for local dev — Vite proxy handles /api)
```env
VITE_API_URL=
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

## 🚀 Deployment

### Backend → Railway

1. Create a new project on [railway.app](https://railway.app)
2. Connect your GitHub repo and select the `server/` directory as root
3. Set environment variables in Railway dashboard:
   - `MONGO_URI`
   - `OPENAI_API_KEY`
   - `CLIENT_URL` → your Vercel frontend URL
   - `PORT` → Railway sets this automatically
4. Deploy — Railway uses `npm start` automatically

### Frontend → Vercel

1. Import your repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `client`
3. Set environment variable:
   - `VITE_API_URL` → your Railway backend URL (e.g. `https://your-app.railway.app`)
4. Deploy

### Database → MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist `0.0.0.0/0` (for Railway) or your Railway IP
4. Copy the connection string into `MONGO_URI`

---

## 🔌 API Reference

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | `/api/chat`           | Send message, get AI reply   |
| GET    | `/api/chat/history`   | Retrieve stored messages     |
| DELETE | `/api/chat/history`   | Clear all stored messages    |
| GET    | `/health`             | Health check                 |

### POST /api/chat

**Request body:**
```json
{
  "message": "Hello, who are you?",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ]
}
```

**Response:**
```json
{
  "response": "I'm NexusAI, your AI assistant...",
  "model": "gpt-3.5-turbo",
  "usage": { "prompt_tokens": 45, "completion_tokens": 38, "total_tokens": 83 }
}
```

---

## 🛡️ Features

- **Multi-turn conversations** — maintains context window (last 10 exchanges)
- **Markdown rendering** — code blocks, tables, lists, links
- **Dark / Light mode** — persisted in localStorage
- **Auto-scroll** — always scrolls to latest message
- **Error handling** — friendly messages for rate limits, auth errors, etc.
- **MongoDB persistence** — all chats stored with timestamps
- **Responsive** — works on mobile, tablet, desktop
- **Production CORS** — only allows whitelisted origins

---

## 🔧 Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Frontend  | React 18, Vite, react-markdown |
| Backend   | Node.js 18+, Express 4      |
| Database  | MongoDB Atlas, Mongoose 8   |
| AI        | OpenAI GPT-3.5-Turbo        |
| Deploy FE | Vercel                      |
| Deploy BE | Railway                     |
