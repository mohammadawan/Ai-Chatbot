const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { sendMessage, getHistory, clearHistory } = require("../controllers/chatController");

// All chat routes require a valid Firebase ID token
router.post("/", verifyToken, sendMessage);
router.get("/history", verifyToken, getHistory);
router.delete("/history", verifyToken, clearHistory);

module.exports = router;
