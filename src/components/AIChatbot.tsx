'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Bot, User, MessageCircle,
  Briefcase, Building2, FileText, HelpCircle, ChevronDown,
} from 'lucide-react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918074172398';

// Use env override if set; otherwise always use the deployed Vercel chat API
const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL || 'https://saanvi-chat-api.vercel.app/api/chat';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

interface Suggestion {
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

const suggestions: Suggestion[] = [
  {
    icon: <Briefcase size={15} />,
    label: 'Find me a job',
    prompt: 'I\'m looking for a new job opportunity. Can you help me get started?',
  },
  {
    icon: <Building2 size={15} />,
    label: 'I\'m hiring talent',
    prompt: 'We\'re an employer looking to hire. How does Saanvi Careers work for companies?',
  },
  {
    icon: <FileText size={15} />,
    label: 'Resume & interview help',
    prompt: 'Can you help me with my resume and interview preparation?',
  },
  {
    icon: <HelpCircle size={15} />,
    label: 'How does it work?',
    prompt: 'Can you walk me through how Saanvi Careers\' placement process works?',
  },
];

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen]               = useState(false);
  const [toastDismissed, setDismissed]    = useState(false);
  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [input, setInput]                 = useState('');
  const [isTyping, setIsTyping]           = useState(false);
  const [mounted, setMounted]             = useState(false);
  const messagesEndRef                    = useRef<HTMLDivElement>(null);
  const inputRef                          = useRef<HTMLInputElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const sendToAPI = async (allMessages: ChatMessage[]): Promise<string> => {
    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
      });
      const data = await res.json();
      return data.reply || "Sorry, I couldn't process that. Please reach us on WhatsApp!";
    } catch {
      return "I'm having trouble connecting. You can reach our team directly on WhatsApp at +91 8074172398.";
    }
  };

  const send = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: ChatMessage = { from: 'user', text: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);
    const reply = await sendToAPI(updated);
    setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
    setIsTyping(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <>
      {/* ── FAB + toast ──────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && mounted && (
          <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">

            {/* Toast */}
            {!toastDismissed && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ delay: 1.2, duration: 0.35 }}
                className="relative"
              >
                <div
                  onClick={() => setIsOpen(true)}
                  className="bg-white border border-[#E6EBF1] shadow-xl rounded-2xl rounded-br-sm px-4 py-3 cursor-pointer hover:shadow-2xl transition-shadow max-w-[210px]"
                >
                  <p className="text-sm font-semibold text-[#0a2540] leading-snug">
                    Need career guidance?
                  </p>
                  <p className="text-xs text-[#697386] mt-0.5">Chat with Saanvi AI →</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-[#697386] hover:bg-[#425466] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Dismiss"
                >
                  <X size={10} />
                </button>
              </motion.div>
            )}

            {/* FAB */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 bg-[#635bff] hover:bg-[#4f46e5] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#635bff]/30 hover:shadow-[#635bff]/50 hover:scale-105 transition-all flex-shrink-0"
              aria-label="Open Saanvi AI"
            >
              <Bot size={24} />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* ── Chat window ──────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-[#E6EBF1]"
            style={{ height: 'min(580px, calc(100vh - 5rem))' }}
          >
            {/* ── Header ─────────────────────────────────────── */}
            <div className="bg-[#0a2540] px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-[#635bff] rounded-xl flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-[#0a2540] rounded-full" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-none">Saanvi AI</p>
                  <p className="text-white/50 text-[11px] mt-0.5">Career Assistant · Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
                  aria-label="Minimise"
                >
                  <ChevronDown size={15} className="text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            </div>

            {/* ── Body ───────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-[#F6F9FC] dark:bg-[#060e1d]">

              {/* Welcome screen (no messages yet) */}
              {!hasMessages && (
                <div className="px-5 pt-6 pb-4">
                  <div className="mb-5">
                    <div className="w-11 h-11 bg-[#635bff] rounded-xl flex items-center justify-center mb-3">
                      <Bot size={22} className="text-white" />
                    </div>
                    <h3 className="text-[#0a2540] dark:text-white font-bold text-base leading-snug">
                      Hi! I'm Saanvi AI 👋
                    </h3>
                    <p className="text-[#697386] dark:text-[#8898aa] text-xs mt-1 leading-relaxed">
                      Your career assistant. Ask me anything about jobs, hiring, or our placement process.
                    </p>
                  </div>

                  {/* Suggestion cards */}
                  <p className="text-[10px] font-bold text-[#697386] dark:text-[#8898aa] uppercase tracking-wider mb-2.5">
                    Quick start
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => send(s.prompt)}
                        className="flex items-start gap-2.5 text-left bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-xl p-3 hover:border-[#635bff]/40 hover:shadow-sm transition-all group"
                      >
                        <span className="text-[#635bff] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          {s.icon}
                        </span>
                        <span className="text-xs font-medium text-[#425466] dark:text-[#8898aa] leading-snug">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {hasMessages && (
                <div className="px-4 py-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.from === 'bot' && (
                        <div className="w-6 h-6 bg-[#635bff] rounded-lg flex items-center justify-center flex-shrink-0 mb-0.5">
                          <Bot size={12} className="text-white" />
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`max-w-[78%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                          msg.from === 'user'
                            ? 'bg-[#635bff] text-white rounded-2xl rounded-br-sm shadow-sm'
                            : 'bg-white dark:bg-[#0d1f33] text-[#0a2540] dark:text-white/90 rounded-2xl rounded-bl-sm border border-[#E6EBF1] dark:border-white/[0.07] shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </motion.div>
                      {msg.from === 'user' && (
                        <div className="w-6 h-6 bg-[#0a2540] rounded-lg flex items-center justify-center flex-shrink-0 mb-0.5">
                          <User size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-end gap-2">
                      <div className="w-6 h-6 bg-[#635bff] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot size={12} className="text-white" />
                      </div>
                      <div className="bg-white dark:bg-[#0d1f33] border border-[#E6EBF1] dark:border-white/[0.07] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                        <div className="flex gap-1 items-center">
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              className="w-1.5 h-1.5 bg-[#635bff]/50 rounded-full animate-bounce"
                              style={{ animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* ── WhatsApp strip ─────────────────────────────── */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I need help from Saanvi Careers')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#dcfce7] hover:bg-[#bbf7d0] text-[#15803d] text-xs font-semibold py-2.5 border-t border-green-200 transition-colors flex-shrink-0"
            >
              <MessageCircle size={13} />
              Talk to a real consultant on WhatsApp
            </a>

            {/* ── Input ──────────────────────────────────────── */}
            <div className="bg-white dark:bg-[#0d1f33] border-t border-[#E6EBF1] dark:border-white/[0.07] p-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-[#F6F9FC] dark:bg-white/5 border border-[#E6EBF1] dark:border-white/[0.07] rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#635bff]/25 focus-within:border-[#635bff] transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about jobs, hiring, process…"
                  className="flex-1 bg-transparent text-sm text-[#0a2540] dark:text-white placeholder-[#697386] dark:placeholder-white/30 outline-none"
                  disabled={isTyping}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 bg-[#635bff] hover:bg-[#4f46e5] disabled:opacity-35 rounded-lg flex items-center justify-center text-white transition-all flex-shrink-0"
                  aria-label="Send"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-center text-[10px] text-[#697386] dark:text-white/25 mt-2">
                Powered by Claude · Saanvi Careers
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
