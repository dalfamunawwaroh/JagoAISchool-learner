import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsProps {
  language: 'id' | 'en';
}

interface NotificationItem {
  id: number;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  timeId: string;
  timeEn: string;
  category: 'learning' | 'events' | 'system';
  isRead: boolean;
}

export const Notifications = ({ language }: NotificationsProps) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [activeCategory, setActiveCategory] = useState<'all' | 'learning' | 'events' | 'system'>('all');
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { 
      id: 1, 
      titleId: 'Modul Baru Tersedia', 
      titleEn: 'New Module Available', 
      descId: 'Kursus Neural Robotics Anda memiliki modul baru: "Advanced Pathfinding" yang mencakup implementasi algoritma A* 3D.', 
      descEn: 'Your Neural Robotics course has a new module: "Advanced Pathfinding" covering 3D A* algorithm implementation.', 
      timeId: '2 Jam yang lalu', 
      timeEn: '2 Hours ago', 
      category: 'learning',
      isRead: false 
    },
    { 
      id: 2, 
      titleId: 'Tugas Selesai Dinilai', 
      titleEn: 'Assignment Graded', 
      descId: 'Tugas "Vision Logic 101" Anda telah dinilai oleh Mentor Dr. Julian dengan hasil akhir yang luar biasa (98/100). Cek umpan balik mentor sekarang.', 
      descEn: 'Your assignment "Vision Logic 101" has been graded by Mentor Dr. Julian with an outstanding result (98/100). Check mentor feedback now.', 
      timeId: '1 Hari yang lalu', 
      timeEn: '1 Day ago', 
      category: 'learning',
      isRead: true 
    },
    { 
      id: 3, 
      titleId: 'Event Mendatang', 
      titleEn: 'Upcoming Event', 
      descId: 'JagoAI Workshop: Generative AI for Startups akan dimulai besok jam 10:00. Link ruang tunggu virtual zoom sudah siap dikirimkan.', 
      descEn: 'JagoAI Workshop: Generative AI for Startups starts tomorrow at 10:00. Virtual Zoom waiting room link is ready to be sent.', 
      timeId: '2 Hari yang lalu', 
      timeEn: '2 Days ago', 
      category: 'events',
      isRead: true 
    },
    { 
      id: 4, 
      titleId: 'Keamanan Akun Diperbarui', 
      titleEn: 'Account Security Updated', 
      descId: 'Kunci Neural (Kata Sandi) Anda berhasil diperbarui sistem pada 30 Mei 2026. Jika ini bukan Anda, silakan hubungi pusat bantuan.', 
      descEn: 'Your Neural Key (Password) was successfully updated by the system on May 30, 2026. If this was not you, contact support.', 
      timeId: '3 Hari yang lalu', 
      timeEn: '3 Days ago', 
      category: 'system',
      isRead: true 
    },
    { 
      id: 5, 
      titleId: 'Lencana Prestasi Diperoleh!', 
      titleEn: 'Achievement Badge Earned!', 
      descId: 'Selamat! Anda memperoleh lencana baru: "Deep Thinker" karena berhasil memecahkan tantangan Logika Neural berturut-turut.', 
      descEn: 'Congratulations! You earned a new badge: "Deep Thinker" for solving consecutive Neural Logic challenges.', 
      timeId: '5 Hari yang lalu', 
      timeEn: '5 Days ago', 
      category: 'system',
      isRead: false 
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'unread' && !n.isRead) || 
      (activeFilter === 'read' && n.isRead);
      
    const matchesCategory = 
      activeCategory === 'all' || 
      n.category === activeCategory;

    return matchesFilter && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return 'school';
      case 'events': return 'event';
      case 'system': return 'shield';
      default: return 'notifications';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-[#1800ad]/10 text-[#1800ad]';
      case 'events': return 'bg-[#e8ba00]/20 text-[#e8ba00]';
      case 'system': return 'bg-emerald-500/10 text-emerald-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-[#1800ad]">
            {language === 'id' ? 'Pusat Notifikasi' : 'Notification Hub'}
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            {language === 'id' 
              ? 'Tinjau modul baru, pesan mentor, nilai tugas, dan update keamanan akun Anda.' 
              : 'Review new modules, mentor messages, assignment grades, and account security updates.'}
          </p>
        </div>
        
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={markAllRead} 
            className="w-fit px-6 py-3 bg-[#1800ad]/5 hover:bg-[#1800ad] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1800ad] transition-all cursor-pointer flex items-center gap-2"
          >
            <Symbol name="done_all" className="text-sm" />
            <span>{language === 'id' ? 'Tandai Semua Dibaca' : 'Mark All As Read'}</span>
          </button>
        )}
      </div>

      {/* FILTER & CATEGORY BARS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Read/Unread Filters */}
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {([
            { id: 'all', idLabel: 'Semua', enLabel: 'All' },
            { id: 'unread', idLabel: 'Belum Dibaca', enLabel: 'Unread' },
            { id: 'read', idLabel: 'Dibaca', enLabel: 'Read' }
          ] as const).map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeFilter === filter.id 
                  ? 'bg-[#1800ad] text-white shadow-lg shadow-[#1800ad]/15' 
                  : 'text-gray-400 hover:text-[#1800ad]'
              }`}
            >
              {language === 'id' ? filter.idLabel : filter.enLabel}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'all', idLabel: 'Semua Kategori', enLabel: 'All Categories' },
            { id: 'learning', idLabel: 'Pembelajaran', enLabel: 'Learning' },
            { id: 'events', idLabel: 'Event', enLabel: 'Events' },
            { id: 'system', idLabel: 'Sistem', enLabel: 'System' }
          ] as const).map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-bold tracking-tight border transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white border-[#1800ad] text-[#1800ad] shadow-sm'
                  : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
              }`}
            >
              {language === 'id' ? cat.idLabel : cat.enLabel}
            </button>
          ))}
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(n => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={n.id}
                className={`bg-white rounded-3xl p-6 md:p-8 border shadow-sm transition-all flex gap-6 relative overflow-hidden group ${
                  !n.isRead ? 'border-[#1800ad]/10 bg-gradient-to-r from-[#1800ad]/[0.01] to-transparent' : 'border-gray-100'
                }`}
              >
                {/* Active Unread Indicator Bar */}
                {!n.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#e8ba00]"></div>
                )}

                {/* Category Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${getCategoryColor(n.category)}`}>
                  <Symbol name={getCategoryIcon(n.category)} className="text-xl" fill={!n.isRead} />
                </div>

                {/* Body Content */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-sm font-display font-bold truncate ${!n.isRead ? 'text-[#1800ad]' : 'text-slate-800'}`}>
                      {language === 'id' ? n.titleId : n.titleEn}
                    </h3>
                    <span className="text-[10px] text-gray-300 font-bold shrink-0 uppercase tracking-tight mt-0.5">
                      {language === 'id' ? n.timeId : n.timeEn}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {language === 'id' ? n.descId : n.descEn}
                  </p>

                  {/* Inline Action Triggers */}
                  <div className="flex gap-4 pt-3 items-center">
                    <button 
                      onClick={() => toggleRead(n.id)}
                      className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer ${
                        n.isRead ? 'text-gray-400 hover:text-[#1800ad]' : 'text-[#e8ba00] hover:text-[#1800ad]'
                      }`}
                    >
                      <Symbol name={n.isRead ? 'drafts' : 'mark_email_read'} className="text-sm" />
                      <span>
                        {n.isRead 
                          ? (language === 'id' ? 'Tandai Belum Dibaca' : 'Mark Unread') 
                          : (language === 'id' ? 'Tandai Sudah Dibaca' : 'Mark Read')}
                      </span>
                    </button>
                    
                    <button 
                      onClick={() => deleteNotification(n.id)}
                      className="text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-600 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Symbol name="delete" className="text-sm" />
                      <span>{language === 'id' ? 'Hapus' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[40px] p-16 border border-gray-100 shadow-sm text-center space-y-4 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                <Symbol name="notifications_off" className="text-3xl" />
              </div>
              <div>
                <p className="text-slate-700 font-display font-bold text-base">
                  {language === 'id' ? 'Tidak ada notifikasi' : 'No notifications'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {language === 'id' 
                    ? 'Anda telah membaca semua pembaruan atau filter tidak cocok.' 
                    : 'You have read all updates or filters match no results.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
