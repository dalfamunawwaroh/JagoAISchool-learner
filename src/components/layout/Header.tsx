import React, { useState } from 'react';
import { Symbol } from '../ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Modul Baru Tersedia', desc: 'Kursus Neural Robotics Anda memiliki modul baru: "Advanced Pathfinding".', time: '2 Jam yang lalu', isRead: false },
    { id: 2, title: 'Tugas Selesai Dinilai', desc: 'Tugas "Vision Logic 101" Anda telah dinilai oleh Mentor Dr. Julian.', time: '1 Hari yang lalu', isRead: true },
    { id: 3, title: 'Event Mendatang', desc: 'JagoAI Workshop: Generative AI for Startups akan dimulai besok jam 10:00.', time: '2 Hari yang lalu', isRead: true }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="sticky top-0 z-[80] bg-white/90 backdrop-blur-xl px-4 md:px-8 lg:px-12 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-6 border-b border-gray-100 transition-all">
      <div className="flex items-center gap-4 lg:hidden">
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
        >
          <Symbol name="menu" className="text-xl" />
        </button>
        <span className="text-lg font-display font-black text-[#1800ad] tracking-tight uppercase md:hidden">JagoAi</span>
      </div>

      <div className="relative flex-1 max-w-xl hidden md:block">
        <Symbol name="search" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
        <input 
          type="text" 
          placeholder="Search AI Insights..." 
          className="w-full pl-14 pr-6 py-2.5 bg-[#f8f9fc] border-none rounded-2xl text-[12px] outline-none focus:bg-white focus:ring-2 focus:ring-[#1800ad]/5 transition-all placeholder:text-gray-400" 
        />
      </div>

      <div className="flex items-center gap-2 md:gap-6 shrink-0">
        <div className="hidden lg:flex items-center gap-4 py-2 px-6 border-r border-gray-100">
          <p className="text-[11px] font-black text-[#1800ad] uppercase tracking-widest text-left">Learner Portal</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-all relative ${isNotifOpen ? 'text-[#1800ad] shadow-inner' : 'text-gray-400 hover:text-[#1800ad] hover:bg-gray-50'}`}
            >
              <Symbol name="notifications" className="text-xl" />
              {unreadCount > 0 && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#e8ba00] rounded-full border-2 border-white"></div>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setIsNotifOpen(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-[380px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50 overflow-hidden z-[100]"
                  >
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                      <h4 className="text-sm font-display font-bold text-[#1800ad]">Notifications</h4>
                      <button onClick={markAllRead} className="text-[10px] font-black text-[#e8ba00] uppercase tracking-widest hover:text-black">Mark all read</button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-6 flex gap-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative ${!n.isRead ? 'bg-blue-50/20' : ''}`}>
                          {!n.isRead && <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e8ba00] rounded-full"></div>}
                          <div className="w-10 h-10 rounded-xl bg-[#1800ad]/5 flex items-center justify-center shrink-0">
                            <Symbol name={n.id === 1 ? 'school' : n.id === 2 ? 'assignment' : 'event'} className="text-[#1800ad]" />
                          </div>
                          <div className="space-y-1 text-left">
                            <p className="text-xs font-bold text-[#1800ad] leading-tight">{n.title}</p>
                            <p className="text-[11px] text-gray-500 leading-relaxed">{n.desc}</p>
                            <p className="text-[9px] font-bold text-gray-300 uppercase mt-2">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-colors">See all updates</button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1800ad] hover:bg-gray-50 transition-all relative">
            <Symbol name="shield" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

