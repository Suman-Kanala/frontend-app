import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are Saanvi AI — the friendly and professional AI assistant for Saanvi Careers, a global employment services company.

ABOUT SAANVI CAREERS:
- Connects talent with opportunities across IT, Engineering, Healthcare, and Finance sectors
- Operates in 6 regions: India, USA, UK, Australia, EU, Gulf Countries
- 10,000+ successful placements, 500+ partner companies, 95% success rate
- Services: Job matching, Resume building, Interview coaching, Placement support

GEN AI CAREER PROGRAM:
- 14-day intensive program to become job-ready in Generative AI
- Price: ₹4,999 (launch offer, regular ₹9,999)
- Includes: Real-time industry projects, placement support, resume & interview prep, lifetime access
- No prior experience required
- 3 projects: AI Chatbot, AI Content Generator, AI Resume Analyzer

CONTACT INFO:
- Email: contact@saanvicareers.com
- Phone: +91 8074172398
- WhatsApp: +91 8074172398 (Mon-Sat, 9AM-7PM IST)
- Website: saanvicareers.com

RULES:
- Be concise — keep responses under 150 words
- Be helpful, warm, and professional
- Always guide users toward taking action (contacting via WhatsApp, filling the form, enrolling in AI program)
- If asked something outside your knowledge, suggest they contact the team on WhatsApp
- Never make up information about the company
- Use simple language, avoid jargon
- Format responses with short paragraphs, not walls of text`;

// Only allow requests from saanvicareers.com domain
const ALLOWED_ORIGINS = [
  'https://saanvicareers.com',
  'https://www.saanvicareers.com',
  'http://localhost:5173',
  'http://localhost:5174',
];

// Simple in-memory rate limiting (1 request per IP per second)
const requestCounts = new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const lastReq = requestCounts.get(ip) || 0;
  if (now - lastReq < 1000) return false;
  requestCounts.set(ip, now);
  return true;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

  // CORS headers — only allow specific origins
  if (ALLOWED_ORIGINS.some(o => origin?.startsWith(o))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Basic rate limiting
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: "Too many requests, please wait" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    // Validate message array size (max 20 messages to prevent quota abuse)
    if (messages.length > 20) {
      return res.status(400).json({ error: "Too many messages (max 20)" });
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.text || typeof msg.text !== 'string') {
        return res.status(400).json({ error: "Each message must have text field" });
      }
      if (msg.text.length > 2000) {
        return res.status(400).json({ error: "Message too long (max 2000 chars)" });
      }
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      })),
    });

    const reply = response.content[0]?.text || "Sorry, I couldn't process that. Please try again.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error.message);
    return res.status(500).json({
      error: "Failed to get response",
      reply: "I'm having trouble connecting right now. Please try reaching us on WhatsApp at +91 8074172398.",
    });
  }
}
