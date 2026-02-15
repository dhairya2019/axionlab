import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, ChevronDown, Send, ShieldCheck, Terminal, Server } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
  isSystem?: boolean;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "AXION_CORE: AUTHORIZED. System Concierge active. Identify your entity and architectural requirements." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMsg: Message = { role: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'API_UNREACHABLE');
      }

      const data = await response.json();
      const newMessages: Message[] = [];
      
      if (data.isSystem) {
        newMessages.push({
          role: 'model',
          text: "SIGNAL_SYNC: Dual-copy dispatch successful.",
          isSystem: true
        });
      }

      newMessages.push({
        role: 'model',
        text: data.text || "PROTOCOL: Transmission received but no text data was returned. Connection stable."
      });

      setMessages(prev => [...prev, ...newMessages]);

    } catch (error: any) {
      console.error("Chat Fault:", error);
      const errorText = error.name === 'AbortError' 
        ? "TIMEOUT_ERROR: Remote server took too long to respond. Please retry."
        : "CORE_ERROR: Connection interrupted. Manual initiation available via support@axionlab.in.";
      
      setMessages(prev => [...prev, { role: 'model', text: errorText }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] font-sans selection:bg-accent selection:text-white">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 md:w-14 md:h-14 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group relative ${
          isOpen ? 'bg-white text-black' : 'bg-accent text-white shadow-[0_0_30px_rgba(255,31,61,0.2)]'
        }`}
      >
        {isOpen ? <X size={20} className="md:w-[24px]" /> : <MessageSquare size={20} className="md:w-[24px] group-hover:rotate-12 transition-transform" />}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white shadow-[0_0_10px_#fff] animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[calc(100vw-32px)] sm:w-[350px] md:w-[420px] max-h-[calc(100dvh-120px)] h-[600px] bg-background border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-[chatEnter_0.3s_cubic-bezier(0.16,1,0.3,1)]">
          <div className="p-5 bg-surface border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-accent flex items-center justify-center text-white">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-white font-black text-xs md:text-sm tracking-tighter uppercase">AXION_AI_CONCIERGE</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                  <p className="text-[8px] md:text-[9px] text-muted uppercase tracking-[0.2em] font-black">Link Active</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-white transition-colors">
              <ChevronDown size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 scrollbar-hide bg-[#050505]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] p-4 md:p-5 text-[12px] md:text-[13px] border ${
                  msg.isSystem ? 'bg-accent/10 text-accent border-accent/30 w-full text-center font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] py-3' :
                  msg.role === 'user' ? 'bg-white text-black border-white font-bold' : 'bg-surface text-gray-300 border-white/5'
                }`}>
                  {msg.role === 'model' && !msg.isSystem && (
                    <div className="flex items-center gap-2 mb-2 opacity-50">
                      <Terminal size={10} className="text-accent" />
                      <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">Response</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface p-4 border border-white/5 flex gap-2">
                  <div className="w-1 h-1 bg-accent animate-bounce"></div>
                  <div className="w-1 h-1 bg-accent animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-accent animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 md:p-6 bg-background border-t border-white/10">
            <div className="flex gap-2 md:gap-3">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="COMMAND..."
                  className="w-full bg-surface border border-white/10 px-4 py-3 md:py-4 text-white text-[10px] md:text-[11px] focus:outline-none focus:border-accent font-mono uppercase tracking-tight"
                />
                <Server size={10} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 hidden md:block" />
              </div>
              <button 
                onClick={handleSend} 
                disabled={isLoading}
                className="w-12 md:w-14 bg-accent text-white flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[7px] md:text-[8px] text-muted text-center mt-3 md:mt-4 uppercase tracking-[0.2em]">Secure Node: Axion_Internal_V3.2</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatEnter { 
          from { opacity: 0; transform: translateY(20px) scale(0.98); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
