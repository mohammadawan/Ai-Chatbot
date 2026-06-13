import { auth } from "../firebase";

const BASE_URL = import.meta.env.VITE_API_URL || "";

async function authHeaders() {
  const token = await auth.currentUser?.getIdToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function sendMessage(message, history = []) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error (${res.status})`);
  }
  return res.json();
}

export async function fetchHistory(limit = 50) {
  const res = await fetch(`${BASE_URL}/api/chat/history?limit=${limit}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Could not load history");
  return res.json();
}

export async function clearHistory() {
  const res = await fetch(`${BASE_URL}/api/chat/history`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Could not clear history");
  return res.json();
}
