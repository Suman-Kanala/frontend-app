'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, HelpCircle, Zap, Search, LucideIcon } from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918074172398";
const rawChatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "/api/chat";
// Guard: never use a localhost URL in production; fall back to the real chat API
const isProductionDomain = typeof window !== "undefined" &&
  (window.location.hostname === "saanvicareers.com" ||
   window.location.hostname === "www.saanvicareers.com");

const CHAT_API_URL =
  (process.env.NODE_ENV === 'production' || isProductionDomain) && rawChatApiUrl.includes("localhost")
    ? "https://saanvi-chat-api.vercel.app/api/chat"
    : rawChatApiUrl;

interface ToastMessage {
  text: string;
  sub: string;
  icon: LucideIcon;
}

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

interface ChatAPIResponse {
  reply: string;
}

interface AIChatbotProps {
  // Currently no props needed
}

const toastMessages: ToastMessage[] = [
  { text: "Need help? Ask me anything!", sub: "Powered by AI", icon: HelpCircle },
  { text: "Looking for a job? Let's talk!", sub: "I can help you", icon: Search },
  { text: "Curious about our Gen AI Program?", sub: "Ask me for details", icon: Sparkles },
  { text: "Hi there! How can I assist you?", sub: "Available 24/7", icon: Bot },
  { text: "Want to boost your career?", sub: "Let's get started", icon: Zap },
  { text: "Have questions? I'm here to help!", sub: "Chat with me", icon: MessageCircle },
  { text: "Explore opportunities with us!", sub: "Quick & easy", icon: Sparkles },
  { text: "Ready for your next career move?", sub: "Talk to Saanvi AI", icon: Bot },
];

const AIChatbot: React.FC<AIChatbotProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Hi! I'm Saanvi AI — your career assistant. Ask me about jobs, our Gen AI Program, or anything else!",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [toastIndex, setToastIndex] = useState<number>(0); // Start with 0 to avoid hydration mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set random index only on client after mount
  useEffect(() => {
    setMounted(true);
    setToastIndex(Math.floor(Math.random() * toastMessages.length));
  }, []);

  useEffect(() => {
    if (isOpen || !mounted) return;
    const interval = setInterval(() => {
      setToastIndex((prev) => {
        let next;
        do { next = Math.floor(Math.random() * toastMessages.length); } while (next === prev);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendToAPI = async (allMessages: ChatMessage[]): Promise<string> => {
    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
      });

      const data: ChatAPIResponse = await res.json();

      if (data.reply) {
        return data.reply;
      }
      return "Sorry, I couldn't process that. Please try reaching us on WhatsApp!";
    } catch {
      return "I'm having trouble connecting. You can reach our team directly on WhatsApp at +91 8074172398.";
    }
  };

  const handleSend = async (): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = { from: "user", text: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    const reply = await sendToAPI(updatedMessages);

    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = async (text: string): Promise<void> => {
    if (isTyping) return;
    const userMsg: ChatMessage = { from: "user", text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    const reply = await sendToAPI(updatedMessages);
    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    setIsTyping(false);
  };

  const quickReplies: string[] = ["Job Opportunities", "Gen AI Program", "Contact Info"];

  return (
    <>
      {/* Floating Button + Toast */}
      <AnimatePresence>
        {!isOpen && mounted && (
          <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
            {/* Toast bubble */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 1, duration: 0.4 }}
              onClick={() => setIsOpen(true)}
              className="bg-white border border-gray-200 shadow-lg rounded-2xl rounded-br-sm px-4 py-2.5 cursor-pointer hover:shadow-xl transition-shadow max-w-[200px]"
            >
              <motion.p
                key={toastIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-gray-800"
              >
                {toastMessages[toastIndex].text}
              </motion.p>
              <p className="text-xs text-gray-400 mt-0.5">{toastMessages[toastIndex].sub}</p>
            </motion.div>

            {/* Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all flex-shrink-0"
              aria-label="Open chat"
            >
              {(() => { const Icon = toastMessages[toastIndex].icon; return <Icon size={26} />; })()}
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Saanvi AI</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-white/70 text-xs">Powered by Claude</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X size={14} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.from === "bot" && (
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-blue-600" />
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-md"
                        : "bg-white text-gray-700 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                  {msg.from === "user" && (
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={12} className="text-purple-600" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-blue-600" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md border border-gray-100 shadow-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />

              {/* Quick Replies — only after first bot message */}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickReplies.map((qr) => (
                    <button
                      key={qr}
                      onClick={() => handleQuickReply(qr)}
                      className="text-xs bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors font-medium"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp fallback */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I need help from Saanvi Careers")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-3 mb-2 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium py-2 rounded-lg border border-green-200 transition-colors"
            >
              <MessageCircle size={12} />
              Talk to a real person on WhatsApp
            </a>

            {/* Input */}
            <div className="p-3 pt-0 flex-shrink-0">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg flex items-center justify-center text-white disabled:opacity-40 transition-all flex-shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
