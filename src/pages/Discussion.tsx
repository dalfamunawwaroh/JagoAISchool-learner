import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  role: 'LEARNER' | 'TENTOR';
  content: string;
  time: string;
}

export const Discussion = ({ onViewProfile }: { onViewProfile: (user: any) => void }) => {
  const [view, setView] = useState<'hub' | 'chat'>('hub');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);
  const [selectedThread, setSelectedThread] = useState<any>(null);

  const [activeCategory, setActiveCategory] = useState('General');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'General', count: 124, icon: 'fluid_meditation' },
    { name: 'AI Engineering', count: 86, icon: 'neurology' },
    { name: 'Course QA', count: 52, icon: 'help_center' },
    { name: 'Project Showcases', count: 31, icon: 'rocket_launch' },
    { name: 'Job Opportunities', count: 18, icon: 'work' },
  ];

  const threads = [
    {
      id: 1,
      title: "How to optimize YOLOv8 for mobile devices?",
      author: "Dian Pratama",
      avatar: "https://i.pravatar.cc/150?u=dian",
      category: "AI Engineering",
      likes: 42,
      replies: 12,
      time: "2h ago",
      tags: ["YOLO", "Optimization"]
    },
    {
      id: 2,
      title: "My first LLM project: A botanical chatbot",
      author: "Rizky Hakim",
      avatar: "https://i.pravatar.cc/150?u=rizky",
      category: "Project Showcases",
      likes: 89,
      replies: 24,
      time: "5h ago",
      tags: ["LLM", "Beginner"]
    },
    {
      id: 3,
      title: "Stuck on Module 4/10 of Advanced Python Course",
      author: "Siti Aminah",
      avatar: "https://i.pravatar.cc/150?u=siti",
      category: "Course QA",
      likes: 5,
      replies: 18,
      time: "8h ago",
      tags: ["Python", "Beginner"]
    },
    {
      id: 4,
      title: "Welcome to the JagoAI Community! Introduce yourself here.",
      author: "Helena Vance",
      avatar: "https://i.pravatar.cc/150?u=helena",
      category: "General",
      likes: 156,
      replies: 45,
      time: "1d ago",
      tags: ["Beginner", "Community"]
    },
    {
      id: 5,
      title: "Weekly AI News Roundup: GPT-5 Rumors and more.",
      author: "Aris Setiawan",
      avatar: "https://i.pravatar.cc/150?u=aris",
      category: "General",
      likes: 67,
      replies: 8,
      time: "3h ago",
      tags: ["News", "AI", "Deployment"]
    }
  ];

  const filteredThreads = threads.filter(thread => {
    const matchesCategory = thread.category === activeCategory;
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = activeTags.length === 0 || activeTags.every(tag => thread.tags.includes(tag.replace('#', '')));
    return matchesCategory && matchesSearch && matchesTags;
  });

  const chatMessages: ChatMessage[] = [
    {
      id: 1,
      user: "Helena Vance",
      avatar: "https://i.pravatar.cc/150?u=helena",
      role: 'TENTOR',
      content: "Halo @Ahmad! Untuk module YOLOv8, coba cek pruning technique yang ada di dokumentasi Ultralytics ya.",
      time: "10:30 AM"
    },
    {
      id: 2,
      user: "Ahmad Syarif",
      avatar: "https://i.pravatar.cc/150?u=ahmad",
      role: 'LEARNER',
      content: "Siap Kak @Helena! Sudah saya coba tapi masih agak lag di Snapdragon 600 series.",
      time: "10:32 AM"
    },
    {
      id: 3,
      user: "Rizky Hakim",
      avatar: "https://i.pravatar.cc/150?u=rizky",
      role: 'LEARNER',
      content: "Mungkin bisa coba ekspor ke format TFLite dengan INT8 quantization kak?",
      time: "10:45 AM"
    }
  ];

  const handleOpenChat = (thread: any) => {
    setSelectedThread(thread);
    setView('chat');
  };

  const renderHub = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
      {/* FEED COLUMN */}
      <div className="lg:col-span-9 space-y-4 md:space-y-6">
        {/* NEW CATEGORY BAR */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-1.5 md:gap-2">
            {categories.map((cat) => (
              <button 
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`whitespace-nowrap px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest transition-all ${
                  activeCategory === cat.name ? 'bg-[#1800ad] text-white shadow-lg shadow-[#1800ad]/20' : 'bg-white text-gray-400 border border-gray-100 hover:border-[#1800ad]/30'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowFilterModal(true)}
            className="shrink-0 p-2 md:p-3 bg-white text-gray-400 rounded-xl md:rounded-2xl border border-gray-100 hover:text-[#1800ad] hover:border-[#1800ad] transition-all flex items-center gap-2"
          >
            <Symbol name="tune" className="text-lg md:text-xl" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative">
          <Symbol name="search" className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-300 text-sm md:text-base" />
          <input 
            type="text" 
            placeholder="Search discussions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 md:pl-14 pr-4 md:pr-6 py-2.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-[28px] text-[10px] md:text-xs font-medium outline-none focus:ring-4 focus:ring-[#1800ad]/5 transition-all shadow-sm" 
          />
        </div>

        {/* POSTS */}
        <div className="space-y-4 md:space-y-6">
          {filteredThreads.length > 0 ? filteredThreads.map((thread) => (
            <div key={thread.id} className="bg-white rounded-2xl md:rounded-[40px] p-4 md:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col md:flex-row gap-4 md:gap-8 text-left">
              <div className="shrink-0 flex md:flex-col items-center justify-between md:justify-start gap-4">
                <div className="flex items-center gap-3 md:flex-col">
                  <button 
                    onClick={() => onViewProfile({ name: thread.author, photo: thread.avatar, username: `@${thread.author.toLowerCase().replace(' ', '_')}` })}
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-white shadow-md overflow-hidden ring-1 ring-gray-100 hover:ring-[#1800ad] transition-all cursor-pointer"
                  >
                    <img src={thread.avatar} alt={thread.author} className="w-full h-full object-cover" />
                  </button>
                  <div className="flex md:flex-col items-center gap-1">
                    <button className="flex flex-col items-center p-1 md:p-2 rounded-lg md:rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors w-10 md:w-12 group/vote">
                      <Symbol name="keyboard_arrow_up" className="text-base md:text-xl text-gray-400 group-hover/vote:text-[#1800ad]" />
                      <span className="text-[10px] md:text-xs font-black text-[#1800ad]">{thread.likes}</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:hidden">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Symbol name="chat_bubble" className="text-base" />
                      <span className="text-[10px] font-black">{thread.replies}</span>
                    </div>
                    <button onClick={() => handleOpenChat(thread)} className="px-4 py-1.5 bg-[#1800ad]/5 text-[#1800ad] rounded-lg text-[9px] font-black uppercase tracking-widest">Reply</button>
                </div>
              </div>

              <div className="flex-1 space-y-2 md:space-y-4">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="px-2 py-0.5 bg-gray-50 text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-full text-gray-400">{thread.category}</span>
                  <span className="text-[8px] md:text-[10px] font-bold text-gray-300">•</span>
                  <span className="text-[8px] md:text-[10px] font-bold text-gray-400">{thread.time}</span>
                </div>
                <h3 onClick={() => handleOpenChat(thread)} className="text-sm md:text-xl font-display font-bold text-[#1800ad] leading-tight group-hover:text-[#e8ba00] transition-colors cursor-pointer line-clamp-2">
                  {thread.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1 md:pt-2">
                  {thread.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[7px] md:text-[9px] font-black text-[#1800ad] uppercase tracking-widest px-2 py-0.5 border border-[#1800ad]/10 rounded-md md:rounded-lg">#{tag}</span>
                  ))}
                </div>
                <div className="hidden md:flex items-center justify-between pt-6 border-t border-gray-50 mt-4">
                  <button 
                    onClick={() => onViewProfile({ name: thread.author, photo: thread.avatar, username: `@${thread.author.toLowerCase().replace(' ', '_')}` })}
                    className="flex items-center gap-2 hover:text-[#1800ad] transition-colors"
                  >
                    <span className="text-[10px] font-bold text-gray-400">Started by</span>
                    <span className="text-xs font-black text-gray-700">{thread.author}</span>
                  </button>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Symbol name="chat_bubble" className="text-lg" />
                      <span className="text-xs font-black">{thread.replies}</span>
                    </div>
                    <button onClick={() => handleOpenChat(thread)} className="px-6 py-2 bg-[#1800ad]/5 text-[#1800ad] hover:bg-[#1800ad] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm text-center space-y-4 animate-in fade-in zoom-in transition-colors">
              <Symbol name="search_off" className="text-6xl text-gray-200" />
              <p className="text-gray-400 font-medium text-sm">No discussions found in this category matching your search.</p>
              <button 
                onClick={() => { setActiveCategory('General'); setSearchQuery(''); setActiveTags([]); }}
                className="text-[#1800ad] font-bold hover:underline uppercase text-[10px] tracking-widest"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
        
        <button className="w-full py-4 bg-white border border-gray-100 rounded-2xl md:rounded-[32px] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-[#1800ad] hover:text-[#1800ad] transition-all">
          Load More
        </button>
      </div>

      {/* RIGHT COLUMN: TRENDING & USERS */}
      <div className="lg:col-span-3 space-y-6 md:space-y-10">
        <div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-8 border border-gray-100 shadow-sm space-y-4 md:space-y-8 text-left transition-colors">
          <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Symbol name="trending_up" className="text-lg text-[#e8ba00]" /> Trending
          </h3>
          <div className="space-y-4 md:space-y-6">
            {[
              { topic: 'Gemini 1.5 Pro', users: 850, trend: '+12%' },
              { topic: 'Low Code AI', users: 620, trend: '+5%' },
              { topic: 'Math for DL', users: 430, trend: '+20%' }
            ].map((t, i) => (
              <div key={i} className="flex justify-between items-start group cursor-pointer">
                <div className="space-y-0.5">
                  <h4 className="text-[11px] md:text-xs font-black text-gray-700 group-hover:text-[#1800ad] transition-colors">{t.topic}</h4>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400">{t.users} members</p>
                </div>
                <span className="text-[8px] md:text-[9px] font-black text-emerald-500">{t.trend}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-8 border border-gray-100 shadow-sm space-y-4 md:space-y-8 text-left transition-colors relative">
          <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Symbol name="person_celebrate" className="text-lg text-[#1800ad] fill-1" /> Active
          </h3>
          <div className="flex flex-wrap gap-2 md:gap-3 relative z-10">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(u => (
              <div 
                key={u} 
                className="relative group cursor-pointer" 
                onMouseEnter={() => setHoveredUser(u)} 
                onMouseLeave={() => setHoveredUser(null)}
                onClick={() => onViewProfile({ name: `Learner ${u}`, photo: `https://i.pravatar.cc/100?u=user${u}`, username: `@learner_${u}` })}
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm overflow-hidden ring-1 ring-gray-100 group-hover:ring-[#1800ad] transition-all">
                  <img src={`https://i.pravatar.cc/100?u=user${u}`} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 bg-emerald-500 border border-white rounded-full"></div>
                
                <AnimatePresence>
                  {hoveredUser === u && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 md:w-48 bg-[#131314] text-white p-2 md:p-4 rounded-xl md:rounded-2xl shadow-2xl z-[100] pointer-events-none"
                    >
                      <div className="text-center space-y-1">
                        <p className="text-[10px] md:text-xs font-bold">User {u}</p>
                        <p className="text-[7px] md:text-[9px] text-white/50 uppercase tracking-widest">AI Vision</p>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[4px] md:border-[6px] border-transparent border-t-[#131314]"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between pb-8 border-b border-gray-100">
        <button onClick={() => setView('hub')} className="flex items-center gap-3 text-gray-400 hover:text-[#1800ad] transition-all group">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1800ad] group-hover:text-white transition-all">
            <Symbol name="arrow_back" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
        </button>
        <div className="text-right">
          <h2 className="text-xl font-display font-bold text-[#1800ad]">{selectedThread?.title}</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedThread?.category}</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12 space-y-10 min-h-[600px] flex flex-col transition-colors">
        <div className="flex-1 space-y-8">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-6 ${msg.role === 'LEARNER' ? '' : 'flex-row-reverse'}`}>
              <button 
                onClick={() => onViewProfile({ name: msg.user, photo: msg.avatar, username: `@${msg.user.toLowerCase().replace(' ', '_')}` })}
                className="shrink-0 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm group-hover:ring-2 group-hover:ring-[#1800ad] transition-all">
                  <img src={msg.avatar} alt={msg.user} className="w-full h-full object-cover" />
                </div>
              </button>
              <div className={`space-y-2 max-w-xl ${msg.role === 'LEARNER' ? 'text-left' : 'text-right'}`}>
                <div className={`flex items-center gap-3 ${msg.role === 'LEARNER' ? '' : 'flex-row-reverse'}`}>
                  <button 
                    onClick={() => onViewProfile({ name: msg.user, photo: msg.avatar, username: `@${msg.user.toLowerCase().replace(' ', '_')}` })}
                    className="text-xs font-black text-gray-900 hover:text-[#1800ad] transition-colors"
                  >
                    {msg.user}
                  </button>
                  <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    msg.role === 'TENTOR' ? 'bg-[#1800ad] text-white shadow-sm' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {msg.role}
                  </span>
                  <span className="text-[9px] text-gray-300 font-bold">{msg.time}</span>
                </div>
                <div className={`p-6 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'LEARNER' ? 'bg-gray-50 text-gray-700 rounded-tl-none' : 'bg-[#1800ad] text-white rounded-tr-none shadow-xl shadow-[#1800ad]/10'
                }`}>
                  {msg.content.split(/(@\w+)/g).map((part, i) => 
                    part.startsWith('@') ? <span key={i} className={`font-black underline decoration-2 underline-offset-2 cursor-pointer hover:opacity-80 transition-opacity ${msg.role === 'TENTOR' ? 'text-white' : 'text-[#1800ad]'}`}>{part}</span> : part
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-gray-50">
          <div className="bg-gray-50 rounded-3xl p-2 flex items-center gap-4 focus-within:ring-2 focus-within:ring-[#1800ad]/10 transition-all">
            <button className="w-12 h-12 rounded-2xl bg-white text-gray-400 hover:text-[#1800ad] transition-all flex items-center justify-center">
              <Symbol name="add" />
            </button>
            <input 
              type="text" 
              placeholder="Tulis pesan... Gunakan @ untuk tag mentor atau teman" 
              className="flex-1 bg-transparent border-none outline-none text-sm px-2"
            />
            <button className="w-12 h-12 rounded-2xl bg-[#1800ad] text-white shadow-lg hover:bg-black transition-all flex items-center justify-center">
              <Symbol name="send" className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      {/* HEADER SECTION */}
      {view === 'hub' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-xl md:text-3xl font-display font-bold text-[#1800ad]">Discussion Hub</h1>
            <p className="text-[10px] md:text-sm text-gray-400 font-medium">Connect, share, and grow together with the community.</p>
          </div>
          <button className="w-full md:w-auto px-6 py-3 md:px-8 md:py-4 bg-[#1800ad] text-white rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-black transition-all shadow-lg shadow-[#1800ad]/20 group shrink-0">
            Start Topic <Symbol name="add" className="text-lg md:text-xl group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      )}

      {view === 'hub' ? renderHub() : renderChat()}

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[200] flex items-center justify-center p-6"
            onClick={() => setShowFilterModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[48px] p-12 space-y-10 relative overflow-hidden transition-colors border border-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 text-[#1800ad]">
                <Symbol name="tune" className="text-9xl" />
              </div>
              
              <div className="space-y-6 relative z-10">
                <h3 className="text-3xl font-display font-bold text-[#1800ad]">Filter Discussions</h3>
                <p className="text-sm text-gray-400">Pilih kategori atau topik untuk mempersempit pencarian Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 <div className="space-y-6 text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Categories</p>
                    <div className="flex flex-wrap gap-3">
                       {categories.map(c => (
                         <button 
                           key={c.name} 
                           onClick={() => setActiveCategory(c.name)}
                           className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                             activeCategory === c.name ? 'bg-[#1800ad] text-white shadow-md shadow-[#1800ad]/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                           }`}
                         >
                           {c.name}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-6 text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Hot Topics</p>
                    <div className="flex flex-wrap gap-3">
                       {['#YOLO', '#LLM', '#Deployment', '#Ethics', '#Beginner'].map(t => (
                         <button 
                           key={t} 
                           onClick={() => setActiveTags(prev => prev.includes(t) ? prev.filter(p => p !== t) : [...prev, t])}
                           className={`px-5 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                             activeTags.includes(t) ? 'border-[#e8ba00] text-[#e8ba00] bg-[#e8ba00]/5' : 'border-gray-100 text-gray-400 hover:border-gray-200'
                           }`}
                         >
                           {t}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="pt-8 relative z-10">
                 <button onClick={() => setShowFilterModal(false)} className="w-full py-6 bg-[#1800ad] text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-[#1800ad]/20">Apply Filters</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discussion;
