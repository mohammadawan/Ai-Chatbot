const Groq = require("groq-sdk");
const { db } = require("../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a helpful, friendly, and knowledgeable AI assistant.
You provide clear, concise, and accurate responses.
You maintain a professional yet approachable tone.
If you don't know something, you say so honestly.`;

const userChatsRef = (userId) =>
  db.collection("chats").doc(userId).collection("messages");

/**
 * POST /api/chat
 */
const sendMessage = async (req, res) => {
  const { message, history = [] } = req.body;
  const userId = req.user.uid;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required." });
  }
  if (message.trim().length > 4000) {
    return res.status(400).json({ error: "Message is too long (max 4000 chars)." });
  }

  try {
    const contextMessages = history.slice(-10).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...contextMessages,
      { role: "user", content: message.trim() },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0]?.message?.content?.trim();
    if (!botResponse) throw new Error("Empty response from Groq");

    // Save to Firestore (non-blocking)
    userChatsRef(userId)
      .add({
        userMessage: message.trim(),
        botResponse,
        timestamp: FieldValue.serverTimestamp(),
      })
      .catch((err) => console.error("DB save error:", err.message));

    return res.json({
      response: botResponse,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Groq error:", error?.message || error);
    if (error?.status === 401) return res.status(401).json({ error: "Invalid Groq API key." });
    if (error?.status === 429) return res.status(429).json({ error: "Rate limit reached. Please try again shortly." });
    if (error?.status === 503 || error?.code === "ECONNREFUSED")
      return res.status(503).json({ error: "AI service unavailable. Please try again." });
    return res.status(500).json({ error: "Failed to get AI response. Please try again." });
  }
};

/**
 * GET /api/chat/history
 */
const getHistory = async (req, res) => {
  const userId = req.user.uid;
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const snapshot = await userChatsRef(userId)
      .orderBy("timestamp", "asc")
      .limitToLast(limit)
      .get();

    const chats = snapshot.docs.map((doc) => {
      const { userMessage, botResponse, timestamp } = doc.data();
      return { userMessage, botResponse, timestamp: timestamp?.toDate() ?? null };
    });

    return res.json({ chats });
  } catch (error) {
    console.error("History fetch error:", error.message);
    return res.status(500).json({ error: "Could not fetch chat history." });
  }
};

/**
 * DELETE /api/chat/history
 */
const clearHistory = async (req, res) => {
  const userId = req.user.uid;
  try {
    const snapshot = await userChatsRef(userId).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    return res.json({ message: "Chat history cleared." });
  } catch (error) {
    console.error("Clear history error:", error.message);
    return res.status(500).json({ error: "Could not clear chat history." });
  }
};

module.exports = { sendMessage, getHistory, clearHistory };
