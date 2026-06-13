const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

// On Railway/production: set FIREBASE_SERVICE_ACCOUNT env var to the JSON file contents
// Locally: falls back to the serviceAccountKey.json file
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require("./serviceAccountKey.json");

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth };
