
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, Bot, Waves } from 'lucide-react';
import { getChatbotResponse } from '../services/geminiService';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Welcome to CarbonOS. I am your blue economy assistant. How can I help you today?' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await getChatbotResponse(userText, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Data packet loss detected. Please re-send." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-[200] p-5 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center ${isOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600'}`}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Bot className="h-7 w-7 text-white" />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 h-4 w-4 bg-teal-400 rounded-full border-2 border-slate-900 animate-ping"></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[200] w-full max-w-[400px] h-[600px] glass rounded-[3rem] border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-fade-in">
          {/* Header */}
          <div className="p-8 border-b border-white/10 bg-blue-600/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-xl">
                 <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">CarbonOS AI</h3>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                  : 'glass-card border-white/5 text-slate-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="glass-card p-5 rounded-[2rem] rounded-tl-none border-white/5">
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-white/10 bg-black/20">
            <div className="flex flex-wrap gap-2 mb-4">
               {["Price per ton?", "Mangroves vs Seagrass", "Revenue Split"].map((tag) => (
                 <button 
                  key={tag}
                  onClick={() => setInput(tag)}
                  className="px-3 py-1.5 glass rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/40 transition-all"
                 >
                   {tag}
                 </button>
               ))}
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about blue carbon..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder-slate-600 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-teal-400 disabled:opacity-30"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
