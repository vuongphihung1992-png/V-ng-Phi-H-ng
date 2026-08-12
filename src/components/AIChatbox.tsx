import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Phone, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  GripHorizontal,
  Power,
  RotateCcw,
  HelpCircle,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  source?: string;
}

interface AIChatboxProps {
  onOpenReport?: () => void;
  onOpenHotline?: () => void;
  onOpenProcedures?: () => void;
}

const INITIAL_SUGGESTIONS = [
  'Xin Giấy xác nhận cư trú CT07 cần gì?',
  'Kích hoạt VNeID mức 2 ở đâu?',
  'SĐT Trực ban Công an xã?',
  'Thủ tục đăng ký Tạm trú thế nào?',
  'Lịch tiếp công dân Công an xã Pơng Drang?'
];

// Custom 3D Blue Robot Icon matching user's avatar image
const Cute3DRobotIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Head Outer Blue 3D Gradient */}
      <linearGradient id="headBlueGrad" x1="100" y1="35" x2="100" y2="185" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </linearGradient>

      {/* Screen Inner Dark Gradient */}
      <linearGradient id="screenDarkGrad" x1="100" y1="65" x2="100" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>

      {/* Antenna Ball Sphere 3D Gradient */}
      <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#7DD3FC" />
        <stop offset="50%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0369A1" />
      </radialGradient>

      {/* Side Ear Caps Gradient */}
      <linearGradient id="earGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>

    {/* TOP ANTENNA STEM & SPHERE BALL */}
    <rect x="94" y="20" width="12" height="24" rx="6" fill="#0284C7" />
    <circle cx="100" cy="16" r="16" fill="url(#ballGrad)" />
    <circle cx="95" cy="11" r="5" fill="#E0F2FE" opacity="0.8" />

    {/* LEFT & RIGHT 3D ROUND EARS */}
    <rect x="16" y="75" width="24" height="50" rx="12" fill="url(#earGrad)" />
    <rect x="160" y="75" width="24" height="50" rx="12" fill="url(#earGrad)" />

    {/* MAIN HEAD BLUE 3D SHELL */}
    <rect x="30" y="42" width="140" height="125" rx="42" fill="url(#headBlueGrad)" />
    {/* Head Glossy Top Highlight */}
    <path d="M 50 48 Q 100 38 150 48 C 140 45 60 45 50 48 Z" fill="#E0F2FE" opacity="0.4" />

    {/* DARK SCREEN INNER BEZEL */}
    <rect x="46" y="58" width="108" height="92" rx="30" fill="url(#screenDarkGrad)" stroke="#38BDF8" strokeWidth="5" />

    {/* TWO LARGE ROUND WHITE EYES */}
    <circle cx="75" cy="98" r="14" fill="#FFFFFF" />
    <circle cx="125" cy="98" r="14" fill="#FFFFFF" />

    {/* HAPPY WHITE SMILE CURVE */}
    <path
      d="M 78 122 Q 100 138 122 122"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="7"
      strokeLinecap="round"
    />
  </svg>
);

export const AIChatbox: React.FC<AIChatboxProps> = ({
  onOpenReport,
  onOpenHotline,
  onOpenProcedures
}) => {
  // State variables
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(() => {
    return localStorage.getItem('pongdrang_ai_chat_disabled') === 'true';
  });
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('pongdrang_ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback default greeting
      }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: 'Kính chào Ông/Bà! Tôi là Trợ lý ảo AI Công an xã Pơng Drang. Tôi có thể giúp Ông/Bà tra cứu thủ tục hành chính, số điện thoại trực ban và giải đáp thắc mắc ANTT 24/7.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('pongdrang_ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Save disabled state to localStorage
  useEffect(() => {
    localStorage.setItem('pongdrang_ai_chat_disabled', isDisabled ? 'true' : 'false');
  }, [isDisabled]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const msgText = (textToSend || inputMessage).trim();
    if (!msgText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msgText,
          history: messages.map((m) => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Lỗi kết nối máy chủ AI');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Xin lỗi, tôi chưa thể xử lý câu hỏi này lúc này. Vui lòng thử lại sau.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Rất tiếc, đã xảy ra gián đoạn kết nối. Quý dân vui lòng gọi Trực ban Công an xã Pơng Drang qua số: **02623539777** để được hỗ trợ trực tiếp 24/7.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Ông/Bà có chắc muốn xóa toàn bộ lịch sử trò chuyện với Trợ lý AI?')) {
      const resetMsg: ChatMessage[] = [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'bot',
          text: 'Đã làm mới cuộc hội thoại. Kính chào Ông/Bà, Trợ lý AI Công an xã Pơng Drang sẵn sàng hỗ trợ!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(resetMsg);
      localStorage.setItem('pongdrang_ai_chat_history', JSON.stringify(resetMsg));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDisableChatbox = () => {
    if (window.confirm('Tắt Chatbox AI khỏi màn hình? Ông/Bà có thể bật lại bất kỳ lúc nào ở góc dưới trang web.')) {
      setIsDisabled(true);
      setIsOpen(false);
    }
  };

  // If user disabled chatbox, show a floating small restore button at bottom left
  if (isDisabled) {
    return (
      <div className="fixed bottom-20 left-4 z-40">
        <button
          onClick={() => {
            setIsDisabled(false);
            setIsOpen(true);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-900 to-red-950 text-amber-300 border border-amber-400/50 rounded-full shadow-lg text-xs font-bold hover:scale-105 active:scale-95 transition-all"
          title="Bật lại Trợ lý AI Công an xã Pơng Drang"
        >
          <Cute3DRobotIcon className="w-5 h-5" />
          <span>Bật Trợ lý AI</span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Invisible drag constraints overlay covering full viewport */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />

      {/* Floating Draggable Wrapper */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0.1}
        className="fixed bottom-20 right-3.5 sm:bottom-24 sm:right-6 z-40 touch-none select-none"
      >
        <AnimatePresence>
          {!isOpen ? (
            /* FLOATING CHAT BUBBLE BUTTON */
            <motion.button
              key="chat-bubble"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-2.5 p-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-red-900 via-red-950 to-red-900 text-amber-300 rounded-full shadow-2xl border-2 border-amber-400/80 hover:border-amber-300 active:scale-95 transition-all cursor-grab active:cursor-grabbing"
              title="Kéo thả vị trí hoặc bấm để mở Trợ lý AI Công an xã Pơng Drang"
            >
              {/* Drag Indicator Handle Dot */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900/90 text-[9px] font-extrabold text-amber-300 border border-amber-400/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                <GripHorizontal className="w-2.5 h-2.5" />
                <span>Kéo thả</span>
              </div>

              {/* Bot Icon with glowing pulse */}
              <div className="relative">
                <div className="p-1 rounded-full bg-slate-900 border border-amber-400/60 shadow-inner font-extrabold">
                  <Cute3DRobotIcon className="w-7 h-7 sm:w-8 sm:h-8 hover:scale-105 transition-transform" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-red-950 animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-red-950" />
              </div>

              {/* Label */}
              <div className="text-left hidden xs:block pr-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-tight">
                    Trợ lý AI 24/7
                  </span>
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                </div>
                <div className="text-[10px] text-red-100 font-medium">
                  Hỏi đáp thủ tục & ANTT
                </div>
              </div>
            </motion.button>
          ) : (
            /* DRAGGABLE CHATBOX WINDOW */
            <motion.div
              key="chat-window"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-[calc(100vw-28px)] max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border-2 border-red-900/80 overflow-hidden flex flex-col h-[520px] max-h-[75vh]"
            >
              {/* CHATBOX HEADER (DRAG HANDLE AREA) */}
              <div className="bg-gradient-to-r from-red-900 via-red-950 to-red-900 p-3 sm:p-3.5 text-white flex items-center justify-between border-b border-amber-400/40 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1 bg-slate-900 border border-amber-400/60 rounded-xl shadow-xs shrink-0">
                    <Cute3DRobotIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-xs sm:text-sm text-amber-300 truncate uppercase">
                        TRỢ LÝ AI CÔNG AN XÃ
                      </h3>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-black shrink-0">
                        24/7
                      </span>
                    </div>
                    <p className="text-[10px] text-red-100 truncate flex items-center gap-1">
                      <GripHorizontal className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Kéo để di chuyển • Nhấn giữ tiêu đề</span>
                    </p>
                  </div>
                </div>

                {/* Control Actions Header */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleClearChat}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-red-200 hover:text-white transition-colors"
                    title="Xóa lịch sử trò chuyện"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleDisableChatbox}
                    className="p-1.5 rounded-lg hover:bg-red-800 text-red-200 hover:text-amber-300 transition-colors"
                    title="Tắt Chatbox khỏi màn hình"
                  >
                    <Power className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-amber-300 hover:text-white transition-colors"
                    title="Thu nhỏ Chatbox"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* QUICK LINKS BANNER INSIDE CHAT */}
              <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200 flex items-center justify-between gap-1 text-[11px] font-bold text-amber-950 overflow-x-auto whitespace-nowrap">
                <span className="text-red-900 font-extrabold flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Tiện ích:
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href="tel:02623539777"
                    className="px-2 py-0.5 rounded-lg bg-red-800 text-white hover:bg-red-900 transition-all text-[10px] flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-amber-300" />
                    <span>02623539777</span>
                  </a>
                  {onOpenReport && (
                    <button
                      onClick={onOpenReport}
                      className="px-2 py-0.5 rounded-lg bg-amber-200 text-amber-950 hover:bg-amber-300 transition-all text-[10px]"
                    >
                      Phản ánh ANTT
                    </button>
                  )}
                  {onOpenProcedures && (
                    <button
                      onClick={onOpenProcedures}
                      className="px-2 py-0.5 rounded-lg bg-amber-200 text-amber-950 hover:bg-amber-300 transition-all text-[10px]"
                    >
                      Thủ tục hành chính
                    </button>
                  )}
                </div>
              </div>

              {/* MESSAGES CONTAINER */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 mb-1 px-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        {msg.sender === 'user' ? 'Ông/Bà' : 'Trợ lý AI Công an xã'}
                      </span>
                      <span className="text-[9px] text-slate-300">• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`relative max-w-[85%] p-3 rounded-2xl shadow-2xs leading-relaxed text-slate-800 ${
                        msg.sender === 'user'
                          ? 'bg-red-900 text-white rounded-br-xs font-medium'
                          : 'bg-white border border-slate-200 rounded-bl-xs text-slate-800'
                      }`}
                    >
                      {/* Formatted Text Content */}
                      <div className="whitespace-pre-wrap space-y-1">
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Action buttons for Bot Messages */}
                      {msg.sender === 'bot' && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="italic text-[9px] text-slate-400">
                            {msg.source === 'gemini' ? 'Phản hồi từ AI' : 'Dữ liệu Công an xã Pơng Drang'}
                          </span>
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-red-800 transition-colors font-bold"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Đã chép</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Sao chép</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading typing indicator */}
                {isLoading && (
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 px-1">Trợ lý AI đang soạn câu trả lời...</span>
                    <div className="p-3 bg-white border border-amber-200 rounded-2xl rounded-bl-xs shadow-2xs flex items-center gap-2 text-amber-800">
                      <Cute3DRobotIcon className="w-5 h-5 animate-pulse shrink-0" />
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* SUGGESTED QUESTIONS CHIPS */}
              <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto whitespace-nowrap space-x-1.5 scrollbar-none">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase shrink-0">
                  Gợi ý:
                </span>
                {INITIAL_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="inline-block px-2.5 py-1 rounded-full bg-white hover:bg-red-50 text-slate-700 hover:text-red-900 border border-slate-300 hover:border-red-300 text-[11px] font-medium transition-all shadow-2xs active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* INPUT FORM AREA */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập câu hỏi thủ tục, SĐT trực ban..."
                  className="flex-1 px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-red-700 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-amber-300 rounded-xl font-bold disabled:opacity-40 active:scale-95 transition-all shadow-xs shrink-0 flex items-center justify-center min-w-[36px]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

// Helper function to render bold/markdown-like text cleanly
function renderFormattedText(text: string) {
  // Simple custom parser for **bold** text and phone links
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Check if line is a bullet
    const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+[\.\)]/.test(line.trim());
    const cleanLine = isBullet ? line.replace(/^[\-•]\s*/, '') : line;

    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

    return (
      <p key={lineIdx} className={`${isBullet ? 'pl-2 border-l-2 border-amber-400 my-0.5' : ''}`}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return (
              <strong key={partIdx} className="font-extrabold text-red-950">
                {boldText}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
  });
}
