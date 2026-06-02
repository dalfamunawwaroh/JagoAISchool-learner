import React, { useState, useEffect, useRef } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';
import { discussionService, authService } from '../services/api';

interface ChatReaction {
  emoji: string;
  users: string[];
}

interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  role: 'LEARNER' | 'TENTOR';
  content: string;
  time: string;
  replyTo?: string;
  reactions?: ChatReaction[];
  imageAttachment?: string;
  fileAttachment?: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}

interface Thread {
  id: number;
  title: string;
  author_name: string;
  author_avatar: string;
  category_name: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  tags: string[];
}

export const Discussion = ({ onViewProfile, language }: { onViewProfile: (user: any) => void; language: 'id' | 'en' }) => {
  const [view, setView] = useState<'hub' | 'chat'>('hub');
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('General');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  // Form states for creating a thread
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('General');
  const [newThreadTags, setNewThreadTags] = useState('');
  const [creatingThread, setCreatingThread] = useState(false);

  // Chat message composition states
  const [typedText, setTypedText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [attachment, setAttachment] = useState<{ name: string; type: 'image' | 'file'; url?: string } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; message: ChatMessage } | null>(null);
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Categories, Threads, and Active Users
  const loadHubData = async () => {
    setLoading(true);
    try {
      const cats = await discussionService.getCategories();
      setCategories(cats);

      const thrs = await discussionService.getThreads(activeCategory, searchQuery);
      setThreads(thrs);

      const users = await authService.getActiveUsers();
      setActiveUsers(users);
    } catch (err) {
      console.error('Error fetching hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHubData();
  }, [activeCategory, searchQuery]);

  // 2. Fetch Chat Messages when selected thread changes
  const loadChatMessages = async (threadId: number) => {
    setChatLoading(true);
    try {
      const msgs = await discussionService.getChatMessages(threadId);
      setMessages(msgs);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'chat' && selectedThread) {
      loadChatMessages(selectedThread.id);
    }
  }, [view, selectedThread]);

  // Auto scroll to bottom in chat
  useEffect(() => {
    if (view === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, view]);

  // Close context menu
  useEffect(() => {
    const handleClose = () => setContextMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const handleOpenChat = (thread: Thread) => {
    setSelectedThread(thread);
    setView('chat');
  };

  const handleSendMessage = async () => {
    if (!typedText.trim() && !attachment) return;
    if (!selectedThread) return;

    try {
      await discussionService.sendMessage(selectedThread.id, {
        content: typedText,
        replyToId: replyingTo ? replyingTo.id : undefined,
        imageAttachmentUrl: attachment?.type === 'image' ? attachment.url : undefined,
        fileAttachmentName: attachment?.type === 'file' ? attachment.name : undefined
      });

      setTypedText('');
      setAttachment(null);
      setReplyingTo(null);
      
      // Reload chat list
      loadChatMessages(selectedThread.id);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleReact = async (messageId: number, emoji: string) => {
    try {
      await discussionService.reactMessage(messageId, emoji);
      if (selectedThread) {
        loadChatMessages(selectedThread.id);
      }
    } catch (err) {
      console.error('Failed to react to message:', err);
    }
  };

  const handleLikeThread = async (threadId: number) => {
    try {
      const res = await discussionService.likeThread(threadId);
      
      // Update thread like locally
      setThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            likes_count: res.liked ? t.likes_count + 1 : Math.max(0, t.likes_count - 1)
          };
        }
        return t;
      }));
    } catch (err) {
      console.error('Failed to upvote thread:', err);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim()) return;

    setCreatingThread(true);
    try {
      const tagsArray = newThreadTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await discussionService.createThread({
        title: newThreadTitle.trim(),
        categoryName: newThreadCategory,
        tags: tagsArray
      });

      setNewThreadTitle('');
      setNewThreadTags('');
      setShowCreateModal(false);
      loadHubData();
    } catch (err) {
      console.error('Failed to create thread:', err);
    } finally {
      setCreatingThread(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock local URL for image upload
      const url = URL.createObjectURL(file);
      setAttachment({
        name: file.name,
        type: 'image',
        url: url
      });
      setShowUploadModal(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({
        name: file.name,
        type: 'file'
      });
      setShowUploadModal(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, msg: ChatMessage) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      message: msg
    });
  };

  const renderHub = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
      {/* FEED COLUMN */}
      <div className="lg:col-span-9 space-y-4 md:space-y-6">
        
        {/* CATEGORY BAR */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-1.5 md:gap-2">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`whitespace-nowrap px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest transition-all ${
                  activeCategory === cat.name 
                    ? 'bg-[#1800ad] text-white shadow-lg' 
                    : 'bg-white text-gray-400 border border-gray-100 hover:border-[#1800ad]/30'
                }`}
              >
                {cat.name} ({cat.count})
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
            placeholder="Search threads..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 md:pl-14 pr-4 md:pr-6 py-2.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-[28px] text-[10px] md:text-xs font-medium outline-none focus:ring-4 focus:ring-[#1800ad]/5 transition-all shadow-sm" 
          />
        </div>

        {/* THREAD LIST */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#1800ad] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Syncing forum boards...</p>
          </div>
        ) : threads.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {threads.map((thread) => (
              <div 
                key={thread.id} 
                className="bg-white rounded-2xl md:rounded-[40px] p-4 md:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col md:flex-row gap-4 md:gap-8 text-left"
              >
                <div className="shrink-0 flex md:flex-col items-center justify-between md:justify-start gap-4">
                  <div className="flex items-center gap-3 md:flex-col">
                    <button 
                      onClick={() => onViewProfile({ name: thread.author_name, photo: thread.author_avatar, username: `@${thread.author_name.toLowerCase().replace(/ /g, '_')}` })}
                      className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-white shadow-md overflow-hidden ring-1 ring-gray-100 hover:ring-[#1800ad] transition-all cursor-pointer"
                    >
                      <img src={thread.author_avatar} alt={thread.author_name} className="w-full h-full object-cover" />
                    </button>
                    
                    <button 
                      onClick={() => handleLikeThread(thread.id)}
                      className="flex flex-col items-center p-1 md:p-2 rounded-lg md:rounded-xl border border-gray-100 hover:bg-[#1800ad]/5 transition-colors w-10 md:w-12 group/vote"
                    >
                      <Symbol name="keyboard_arrow_up" className="text-base md:text-xl text-gray-400 group-hover/vote:text-[#1800ad]" />
                      <span className="text-[10px] md:text-xs font-black text-[#1800ad]">{thread.likes_count}</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-2 md:space-y-4">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className="px-2 py-0.5 bg-gray-50 text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-full text-gray-400">
                      {thread.category_name}
                    </span>
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-300">•</span>
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-400">
                      {new Date(thread.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 
                    onClick={() => handleOpenChat(thread)} 
                    className="text-sm md:text-xl font-display font-bold text-[#1800ad] leading-tight group-hover:text-[#e8ba00] transition-colors cursor-pointer line-clamp-2"
                  >
                    {thread.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1 md:pt-2">
                    {thread.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-[7px] md:text-[9px] font-black text-[#1800ad] uppercase tracking-widest px-2 py-0.5 border border-[#1800ad]/10 rounded-md md:rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="hidden md:flex items-center justify-between pt-6 border-t border-gray-50 mt-4">
                    <button 
                      onClick={() => onViewProfile({ name: thread.author_name, photo: thread.author_avatar, username: `@${thread.author_name.toLowerCase().replace(/ /g, '_')}` })}
                      className="flex items-center gap-2 hover:text-[#1800ad] transition-colors"
                    >
                      <span className="text-[10px] font-bold text-gray-400">Started by</span>
                      <span className="text-xs font-black text-gray-700">{thread.author_name}</span>
                    </button>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Symbol name="chat_bubble" className="text-lg" />
                        <span className="text-xs font-black">{thread.replies_count}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleOpenChat(thread)} 
                        className="px-6 py-2 bg-[#1800ad]/5 hover:bg-[#1800ad] hover:text-white text-[#1800ad] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm text-center space-y-4">
            <Symbol name="search_off" className="text-6xl text-gray-200" />
            <p className="text-gray-400 font-medium text-sm">No topics found in this channel yet.</p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: TRENDING */}
      <div className="lg:col-span-3 space-y-6 md:space-y-10">
        <div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-8 border border-gray-100 shadow-sm space-y-4 md:space-y-8 text-left">
          <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Symbol name="trending_up" className="text-lg text-[#e8ba00]" /> Popular Channels
          </h3>
          <div className="space-y-4 md:space-y-6">
            {categories.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setActiveCategory(c.name)}
                className="flex justify-between items-start group cursor-pointer"
              >
                <div className="space-y-0.5">
                  <h4 className="text-[11px] md:text-xs font-black text-gray-750 group-hover:text-[#1800ad] transition-colors">{c.name}</h4>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400">{c.count} discussions</p>
                </div>
                <Symbol name="forum" className="text-gray-300 group-hover:text-[#1800ad] transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-[32px] p-4 md:p-8 border border-gray-100 shadow-sm space-y-4 md:space-y-8 text-left">
          <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Symbol name="person_celebrate" className="text-lg text-[#1800ad] fill-1" /> Active Learners
          </h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {activeUsers.length > 0 ? (
              activeUsers.map(user => {
                // Determine if online (active in the last 15 minutes)
                let isOnline = false;
                if (user.last_active_at) {
                  const lastActive = new Date(user.last_active_at).getTime();
                  const diffMinutes = (Date.now() - lastActive) / 1000 / 60;
                  isOnline = diffMinutes < 15;
                }
                return (
                  <div 
                    key={user.id} 
                    onClick={() => onViewProfile({ name: user.full_name, photo: user.avatar_url, username: user.username, bio: user.bio })}
                    className="relative group cursor-pointer"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm overflow-hidden ring-1 ring-gray-100 group-hover:ring-[#1800ad] transition-all">
                      <img src={user.avatar_url || 'https://i.pravatar.cc/100'} className="w-full h-full object-cover" alt={user.full_name} />
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full"></div>
                    )}
                    
                    {/* Hover tooltip for name */}
                    <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded shadow-xl z-50 whitespace-nowrap">
                      {user.full_name}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-[10px] text-gray-400 font-bold">{language === 'id' ? 'Tidak ada pengguna aktif.' : 'No active users.'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Thread Header */}
      <div className="flex items-center justify-between pb-8 border-b border-gray-100 text-left flex-wrap gap-4">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.25em] block">
            {language === 'id' ? 'Komunitas' : 'Community'} • {selectedThread?.category_name}
          </span>
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-display font-black text-slate-800 leading-tight">
              {selectedThread?.title}
            </h2>
            <button 
              onClick={() => setView('hub')} 
              className="inline-flex w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1800ad] hover:text-white items-center justify-center text-slate-500 transition-all cursor-pointer shadow-sm shrink-0 group border-none"
            >
              <Symbol name="arrow_back" className="text-base transition-transform group-hover:-translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm h-[600px] flex flex-col justify-between overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 custom-scrollbar">
          {chatLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-[#1800ad] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-xs font-bold">Synchronizing messages...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              // Standard check: is it current user?
              const isMe = msg.user === "Ahmad Syarif" || msg.user === "Alex (You)";
              return (
                <div key={msg.id} className={`flex gap-6 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm shrink-0">
                    <img src={msg.avatar || 'https://i.pravatar.cc/150'} alt={msg.user} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className={`space-y-2 max-w-xl ${isMe ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs font-black text-gray-900">{msg.user}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-gray-100 text-gray-400">
                        {msg.role}
                      </span>
                      <span className="text-[9px] text-gray-300 font-bold">{msg.time}</span>
                    </div>

                    {msg.replyTo && (
                      <div className="text-[10px] py-1.5 px-3.5 border-l-2 mb-1 flex items-center gap-1.5 italic text-left border-[#1800ad]/30 bg-slate-50 text-slate-500 rounded-lg">
                        <Symbol name="reply" className="text-xs" />
                        <span>{msg.replyTo}</span>
                      </div>
                    )}

                    <div 
                      onContextMenu={(e) => handleContextMenu(e, msg)}
                      className={`p-6 rounded-3xl text-sm leading-relaxed text-left shadow-sm ${
                        isMe 
                          ? 'bg-slate-100 text-slate-800 rounded-tr-none border border-slate-200/40' 
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-150'
                      }`}
                    >
                      <div>{msg.content}</div>
                      
                      {msg.imageAttachment && (
                        <div className="mt-3 rounded-2xl overflow-hidden max-w-sm border border-slate-200">
                          <img src={msg.imageAttachment} className="w-full max-h-60 object-cover" alt="attachment" />
                        </div>
                      )}

                      {msg.fileAttachment && (
                        <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl text-xs max-w-sm border bg-slate-50 border-slate-150 text-slate-800">
                          <Symbol name="description" className="text-2xl shrink-0 text-[#1800ad]" />
                          <span className="font-bold flex-1 truncate">{msg.fileAttachment}</span>
                        </div>
                      )}
                    </div>

                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className={`flex gap-1.5 mt-1 flex-wrap ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {msg.reactions.map((reaction, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleReact(msg.id, reaction.emoji)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#1800ad]/5 hover:bg-[#1800ad]/10 border border-slate-100 text-slate-500"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-[10px]">{reaction.users.length}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-2">
              <Symbol name="forum" className="text-4xl text-gray-300" />
              <p className="text-gray-405 text-sm">Be the first to reply in this room.</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-8 pt-4 border-t border-gray-100 bg-white relative shrink-0 z-20">
          {replyingTo && (
            <div className="absolute bottom-full left-8 right-8 bg-slate-50 border-t border-x border-slate-100 px-5 py-2.5 rounded-t-2xl flex justify-between items-center text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Symbol name="reply" className="text-[#1800ad] text-sm" />
                <span>Replying to <strong className="text-slate-800">{replyingTo.user}</strong></span>
              </div>
              <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-700 bg-transparent border-none">
                <Symbol name="close" className="text-xs" />
              </button>
            </div>
          )}

          {attachment && (
            <div className="absolute bottom-full left-8 right-8 bg-slate-50 border-t border-x border-slate-100 px-5 py-2.5 rounded-t-2xl flex justify-between items-center text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Symbol name={attachment.type === 'image' ? 'image' : 'description'} className="text-[#e8ba00] text-sm" />
                <span>Attachment: <strong className="text-slate-800">{attachment.name}</strong></span>
              </div>
              <button onClick={() => setAttachment(null)} className="text-slate-400 hover:text-slate-700 bg-transparent border-none">
                <Symbol name="close" className="text-xs" />
              </button>
            </div>
          )}

          <div className="bg-gray-50 p-2.5 flex items-center gap-4 rounded-[24px]">
            <button 
              type="button" 
              onClick={() => setShowUploadModal(true)}
              className="w-12 h-12 rounded-2xl bg-white text-gray-400 hover:text-[#1800ad] flex items-center justify-center shadow-sm border-none cursor-pointer"
            >
              <Symbol name="add" className="text-xl" />
            </button>
            
            <input 
              type="text" 
              placeholder="Tulis tanggapan atau opini anda..." 
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-slate-800"
            />
            
            <button 
              onClick={handleSendMessage}
              className="w-12 h-12 rounded-2xl bg-[#1800ad] hover:bg-black text-white shadow-lg flex items-center justify-center cursor-pointer border-none"
            >
              <Symbol name="send" className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      {view === 'hub' && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-xl md:text-3xl font-display font-bold text-[#1800ad]">
              {language === 'id' ? 'Hub Diskusi' : 'Discussion Hub'}
            </h1>
            <p className="text-[10px] md:text-sm text-gray-400 font-medium">
              {language === 'id' ? 'Terhubung, berbagi wawasan, dan berkembang bersama komunitas.' : 'Connect, share, and grow together with the community.'}
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto px-6 py-3 md:px-8 md:py-4 bg-[#1800ad] text-white rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-black transition-all shadow-lg group shrink-0 border-none cursor-pointer"
          >
            {language === 'id' ? 'Mulai Topik Baru' : 'Start Topic'} <Symbol name="add" className="text-lg md:text-xl group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      )}

      {view === 'hub' ? renderHub() : renderChat()}

      {/* CREATE NEW TOPIC MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 p-8 md:p-12 space-y-6 text-left"
            >
              <h3 className="text-2xl font-display font-bold text-[#1800ad]">Mulai Topik Diskusi Baru</h3>
              
              <form onSubmit={handleCreateThread} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Judul Topik / Pertanyaan</label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Bagaimana cara pruning model YOLOv8 untuk deployment?"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-150 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-[#1800ad]/5 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pilih Kategori</label>
                    <select
                      value={newThreadCategory}
                      onChange={(e) => setNewThreadCategory(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-150 rounded-2xl text-xs outline-none font-medium"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tags (Pisahkan dengan koma)</label>
                    <input 
                      type="text"
                      placeholder="yolo, optimization, mobile"
                      value={newThreadTags}
                      onChange={(e) => setNewThreadTags(e.target.value)}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-150 rounded-2xl text-xs outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="submit"
                    disabled={creatingThread}
                    className="flex-1 py-5 bg-[#1800ad] text-white disabled:bg-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                  >
                    {creatingThread ? 'Creating...' : 'Publish Thread'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)}
                    className="px-8 py-5 bg-gray-150 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTEXT MENU */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bg-white border border-slate-100 rounded-2xl shadow-2xl p-2.5 z-[2500] w-60 space-y-1 text-left"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1.5 pb-1">
              Actions
            </div>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(contextMenu.message.content);
                alert("Copied successfully!");
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1800ad] rounded-xl flex items-center gap-2 cursor-pointer transition-all border-none"
            >
              <Symbol name="content_copy" className="text-sm" />
              <span>Copy Message</span>
            </button>
            
            <button 
              onClick={() => {
                setReplyingTo(contextMenu.message);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1800ad] rounded-xl flex items-center gap-2 cursor-pointer transition-all border-none"
            >
              <Symbol name="reply" className="text-sm" />
              <span>Reply / Quote</span>
            </button>

            <div className="border-t border-slate-50 my-1 pt-1.5">
              <div className="px-3 py-0.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                React Emoji
              </div>
              <div className="flex gap-1 px-2.5 py-1 justify-between">
                {['👍', '❤️', '😂', '😮', '🙏'].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => {
                      handleReact(contextMenu.message.id, emoji);
                      setContextMenu(null);
                    }}
                    className="text-base hover:scale-125 hover:-translate-y-0.5 transition-all p-1 hover:bg-slate-100 rounded-lg cursor-pointer border-none bg-transparent"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPLOAD MODAL */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-6" onClick={() => setShowUploadModal(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6 relative" onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-slate-800">Attach Document or Image</h3>
                <p className="text-xs text-slate-400 leading-normal">Select the file type you would like to share with cohort.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-150 hover:border-[#1800ad] hover:bg-slate-50 rounded-2xl cursor-pointer transition-all text-center space-y-3 group">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#1800ad] group-hover:bg-[#1800ad] group-hover:text-white flex items-center justify-center transition-all">
                    <Symbol name="image" className="text-2xl" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Image</span>
                </label>

                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-[#1800ad] hover:bg-slate-50 rounded-2xl cursor-pointer transition-all text-center space-y-3 group">
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#e8ba00] group-hover:bg-[#e8ba00] group-hover:text-black flex items-center justify-center transition-all">
                    <Symbol name="upload_file" className="text-2xl" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Document</span>
                </label>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discussion;
