import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Symbol } from '../ui/Symbol';

export const FloatingAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; time: string }[]>([
    { role: 'ai', text: 'Halo! Saya AI Tutor Anda. Ada yang bisa saya bantu terkait kursus Anda hari ini?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: inputValue, time: now }]);
    setInputValue('');
    
    // Simulate AI Response
    setTimeout(() => {
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { role: 'ai', text: 'Tentu, saya sedang mencari informasi tentang topik tersebut di kurikulum Anda...', time: aiTime }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[1000]">
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#1800ad] rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#1800ad]/40 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <Symbol name="close" className="text-3xl" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Symbol name="smart_toy" className="text-3xl" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulsing Notification */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#e8ba00] rounded-full border-2 border-white animate-bounce flex items-center justify-center text-[10px] font-black text-[#1800ad]">
            1
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[400px] h-[550px] bg-white rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col overflow-hidden transition-colors"
          >
            {/* Header */}
            <div className="bg-[#1800ad] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Symbol name="smart_toy" className="text-xl" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">JagoAI</h3>
                  <div className="flex items-center gap-1.5 opacity-60">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Online Now</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-60 hover:opacity-100 transition-opacity">
                <Symbol name="close" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-xs leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-[#1800ad] text-white rounded-tr-none shadow-md shadow-[#1800ad]/20' 
                      : 'bg-white text-gray-700 shadow-sm rounded-tl-none border border-gray-100 transition-colors'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 px-2">
                    {m.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-100 transition-colors">
              <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-2 pl-4">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ketik pesan Anda..." 
                  className="flex-1 bg-transparent outline-none text-xs font-bold text-[#1800ad] placeholder:text-gray-400"
                />
                <button 
                  onClick={handleSend}
                  className="w-10 h-10 bg-[#1800ad] text-white rounded-xl flex items-center justify-center hover:bg-black transition-colors"
                >
                  <Symbol name="send" className="text-lg" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
