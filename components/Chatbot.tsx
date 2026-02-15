
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'model';
  text: string;
  isSystem?: boolean;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Accessing Axion Core... Authorized. I am the Axion AI Concierge. How can I assist with your architectural inquiry today?" }
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedInput,
          history: messages
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const newMessages: Message[] = [];
      
      if (data.isSystem) {
        newMessages.push({
          role: 'model',
          text: "PROTOCOL: Secure SMTP Relay initiated. Dispatching copies to agent and client...",
          isSystem: true
        });
      }

      newMessages.push({
        role: 'model',
        text: data.text || "Connection stable. Ready for next inquiry."
      });

      setMessages(prev => [...prev, ...newMessages]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Security override detected. Backend tunnel interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-neon flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">
          {isOpen ? 'close' : 'chat_bubble'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] md:w-[450px] h-[600px] glass-panel rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] border border-white/10">
          <div className="p-6 bg-indigo-600/10 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-neon">
                <span className="material-symbols-outlined text-2xl">security</span>
              </div>
              <div>
                <p className="text-white font-display font-bold text-base tracking-tight">Axion AI Concierge</p>
                <p className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] font-black">Production Tunnel v2.0</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white"><span className="material-symbols-outlined">expand_more</span></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s_ease-out]`}>
                <div className={`max-w-[88%] p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.isSystem ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 w-full text-center font-mono text-[10px]' :
                  msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-black/40 border-t border-white/10 backdrop-blur-xl">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Secure inquiry..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500">
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
