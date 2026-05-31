import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';

interface Event {
  id: number;
  title: string;
  desc: string;
  date: string;
  time: string;
  type: 'ONLINE' | 'ON-SITE';
  price: string;
  priceRaw: number;
  image: string;
  mentor: string;
  mentorImg: string;
  category: string;
  location?: string;
}

export const Events = () => {
  const [activeTab, setActiveTab] = useState('All Events');
  const [priceFilter, setPriceFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  
  const categories = ["All Events", "AI Research", "Practical Workshop", "Expert Seminar"];

  const events: Event[] = [
    {
      id: 1,
      title: "Mastering Generative AI for Research Papers",
      desc: "Learn advanced techniques for leveraging LLMs in academic writing, citation management, and literature review automation.",
      date: "May 15, 2026",
      time: "14:00 GMT+7",
      type: "ONLINE",
      price: "IDR 150.000",
      priceRaw: 150000,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      mentor: "Dr. Helena Vance",
      mentorImg: "https://i.pravatar.cc/150?u=helena",
      category: "AI Research"
    },
    {
      id: 2,
      title: "Prompt Engineering: Advanced Workshop",
      desc: "Deep dive into chain-of-thought, few-shot prompting, and automated evaluation frameworks for production-ready AI.",
      date: "May 20, 2026",
      time: "09:00 GMT+7",
      type: "ON-SITE",
      location: "Co-Working, Gedung Fakultas Ilmu Terapan Telkom University Lantai 4",
      price: "FREE",
      priceRaw: 0,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
      mentor: "Julian Thorne",
      mentorImg: "https://i.pravatar.cc/150?u=julian",
      category: "Practical Workshop"
    },
    {
      id: 3,
      title: "AI Ethics in Modern Higher Education",
      desc: "Exploring the challenges and guidelines for implementing AI assistants in academic environments safely and ethically.",
      date: "May 25, 2026",
      time: "15:00 GMT+7",
      type: "ONLINE",
      price: "IDR 125.000",
      priceRaw: 125000,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      mentor: "Prof. Sophia Chen",
      mentorImg: "https://i.pravatar.cc/150?u=sophia",
      category: "Expert Seminar"
    }
  ];

  const historyEvents = [
    { title: "Intro to Neural Networks", date: "April 10, 2026", type: "Workshop" },
    { title: "AI Ethics 101", date: "March 15, 2026", type: "Webinar" }
  ];

  const filteredEvents = events.filter(e => {
    const matchesCategory = activeTab === 'All Events' || e.category === activeTab;
    const matchesPrice = priceFilter === 'All' 
      || (priceFilter === 'Free' && e.priceRaw === 0)
      || (priceFilter === 'Paid' && e.priceRaw > 0);
    return matchesCategory && matchesPrice;
  });

  const handleRegister = () => {
    if (selectedEvent) {
      setRegisteredEvents(prev => [...prev, selectedEvent.id]);
      setSelectedEvent(null);
      setShowSuccessNotif(true);
      setTimeout(() => setShowSuccessNotif(false), 5000);
    }
  };

  const downloadCertificate = (title: string) => {
    const element = document.createElement("a");
    const file = new Blob([`CERTIFICATE OF COMPLETION (PDF SIMULATED)\n\nThis is to certify that you have successfully completed the event:\n${title}\n\nJagoAISchool Academic AI Excellence`], {type: 'application/pdf'});
    element.href = URL.createObjectURL(file);
    element.download = `Sertifikat_${title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-12 pb-24 text-left">
      {/* Header */}
      <div className="space-y-4 md:space-y-8">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-[#1800ad]">Upcoming Events Hub</h1>
        
        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="relative flex-1">
            <Symbol name="search" className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-300" />
            <input 
              type="text" 
              placeholder="Search webinars, workshops..." 
              className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 bg-white border border-gray-100 rounded-2xl text-[10px] md:text-xs outline-none focus:ring-2 focus:ring-[#1800ad]/10 transition-all placeholder:text-gray-400 shadow-sm transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4">
            <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm transition-colors overflow-x-auto no-scrollbar max-w-full">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`whitespace-nowrap px-3 md:px-6 py-2 md:py-2.5 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest transition-all ${
                    activeTab === cat ? 'bg-[#1800ad] text-white shadow-lg shadow-[#1800ad]/20' : 'text-gray-400 hover:text-[#1800ad]'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
            
            <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 shadow-sm transition-colors">
              {(['All', 'Free', 'Paid'] as const).map((pf) => (
                <button 
                  key={pf}
                  onClick={() => setPriceFilter(pf)}
                  className={`px-3 md:px-6 py-2 md:py-2.5 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest transition-all ${
                    priceFilter === pf ? 'bg-[#e8ba00] text-black shadow-lg' : 'text-gray-400 hover:text-[#e8ba00]'
                  }`}
                >
                  {pf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl md:rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
            <div className="h-32 sm:h-48 md:h-64 relative">
              <img src={event.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={event.title} />
              <div className="absolute top-2 left-2 md:top-6 md:left-6 flex gap-1 md:gap-2 scale-75 md:scale-100 origin-top-left">
                <span className="px-3 md:px-5 py-1 md:py-2 bg-[#1800ad] text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">{event.type}</span>
                <span className="px-3 md:px-5 py-1 md:py-2 bg-[#e8ba00] text-black text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">{event.price.split(' ')[0]}</span>
              </div>
            </div>
            <div className="p-4 md:p-10 flex flex-col h-full space-y-4 md:space-y-8">
              <h3 className="text-xs md:text-2xl font-display font-bold text-[#1800ad] leading-tight group-hover:text-[#e8ba00] transition-colors line-clamp-2">{event.title}</h3>
              
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden border-2 border-gray-50 shadow-sm">
                  <img src={event.mentorImg} className="w-full h-full object-cover" alt={event.mentor} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 font-display font-bold text-gray-900 text-[10px] md:text-sm truncate">
                    {event.mentor.split(' ')[1] || event.mentor} <Symbol name="verified" className="text-[#e8ba00] text-[10px] md:text-sm" fill />
                  </div>
                  <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-0.5 truncate">Verified</p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-6 text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tight md:tracking-widest border-t border-gray-50 pt-4 md:pt-8 mt-auto flex-wrap">
                <div className="flex items-center gap-1 md:gap-2"><Symbol name="calendar_today" className="text-[#1800ad] text-xs md:text-sm" /> {event.date.split(',')[0]}</div>
                <div className="flex items-center gap-1 md:gap-2"><Symbol name="schedule" className="text-[#1800ad] text-xs md:text-sm" /> {event.time.split(' ')[0]}</div>
              </div>

              <button 
                onClick={() => setSelectedEvent(event)}
                className="w-full py-2.5 md:py-5 bg-[#1800ad] text-white rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/10 active:scale-95"
              >
                Daftar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 md:pt-12 border-t border-gray-100 transition-colors">
        {/* Registered Events */}
        <div className="space-y-4 md:space-y-8">
          <h3 className="text-lg md:text-xl font-display font-bold text-[#1800ad] flex items-center gap-2 md:gap-3">
            <Symbol name="check_circle" className="text-[#e8ba00] text-xl md:text-2xl" /> Registered Events
          </h3>
          <div className="space-y-3 md:space-y-4">
            {registeredEvents.length > 0 ? (
              registeredEvents.map(id => {
                const ev = events.find(e => e.id === id);
                return ev && (
                  <div key={id} className="bg-white p-3 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm transition-colors">
                    <div className="flex items-center gap-3 md:gap-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden shadow-sm shrink-0">
                        <img src={ev.image} className="w-full h-full object-cover" alt={ev.title} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs md:text-sm font-display font-bold text-[#1800ad] truncate">{ev.title}</h4>
                        <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase mt-0.5">{ev.date.split(',')[0]} • {ev.time.split(' ')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-3 bg-blue-50/50 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-[#1800ad]/10 whitespace-nowrap">
                      <Symbol name="mail" className="text-[#1800ad] text-xs md:text-sm" />
                      <span className="text-[7px] md:text-[9px] font-black text-[#1800ad] uppercase tracking-widest hidden sm:inline">Sent to Email</span>
                      <span className="text-[7px] md:text-[9px] font-black text-[#1800ad] uppercase tracking-widest sm:hidden">Email</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 md:p-12 text-center bg-gray-50 rounded-2xl md:rounded-[40px] border border-dashed border-gray-200">
                <p className="text-gray-400 text-[9px] md:text-xs font-bold uppercase tracking-widest">No events registered</p>
              </div>
            )}
          </div>
        </div>

        {/* Event History */}
        <div className="space-y-4 md:space-y-8">
          <h3 className="text-lg md:text-xl font-display font-bold text-[#1800ad] flex items-center gap-2 md:gap-3">
            <Symbol name="history" className="text-[#e8ba00] text-xl md:text-2xl" /> Learning History
          </h3>
          <div className="space-y-3 md:space-y-4">
            {historyEvents.map((hist, i) => (
              <div key={i} className="bg-white p-3 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm opacity-60 transition-colors">
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-lg md:rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                    <Symbol name="verified" className="text-sm md:text-base" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs md:text-sm font-display font-bold text-[#1800ad] truncate">{hist.title}</h4>
                    <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase mt-0.5">{hist.date.split(',')[0]} • {hist.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => downloadCertificate(hist.title)}
                  className="text-[7px] md:text-[10px] font-black text-[#1800ad] uppercase tracking-widest flex items-center gap-1 md:gap-2 hover:text-black transition-all transition-colors whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Certificate</span> <Symbol name="download" className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
               onClick={() => setSelectedEvent(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-5xl rounded-[48px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative border border-gray-100 shadow-2xl transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-8 right-8 w-12 h-12 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-black z-20"
                >
                  <Symbol name="close" className="text-2xl" />
                </button>

                {/* Form Side */}
                <div className="lg:col-span-7 p-12 lg:p-20 space-y-12">
                   <div className="space-y-6">
                      <h2 className="text-3xl font-display font-bold text-[#1800ad]">Secured Event Registration</h2>
                      <p className="text-gray-400 text-sm">You are registering for:</p>
                      <span className="px-5 py-2 bg-[#e8ba00]/20 text-[#e8ba00] text-[10px] font-black uppercase tracking-widest rounded-full">{selectedEvent.title}</span>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Nama Lengkap</label>
                         <input type="text" placeholder="Ahmad Syarifuddin" className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#1800ad]/10 transition-colors" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Email</label>
                         <input type="email" placeholder="ahmad@jagoaischool.com" className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#1800ad]/10 transition-colors" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Nomor WA Aktif</label>
                         <div className="relative">
                            <input type="text" placeholder="+62 812 3456 7890" className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#1800ad]/10 transition-colors" />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                               <Symbol name="chat" className="text-emerald-500" />
                               <Symbol name="check_circle" className="text-emerald-500" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 text-gray-400 text-[10px] font-medium pt-8 border-t border-gray-50">
                      <Symbol name="security" className="text-lg" />
                      Your data is encrypted and secured by JagoAI Enterprise
                   </div>
                </div>

                {/* Info Side */}
                <div className="lg:col-span-5 bg-gray-50/50 p-12 lg:p-20 flex flex-col transition-colors">
                   <div className="space-y-10">
                      <div className="space-y-6">
                         <p className="text-[10px] font-black text-[#1800ad] uppercase tracking-widest">Event Details</p>
                         <div className="flex gap-6 items-center">
                            <div className="w-20 h-20 bg-[#1800ad] rounded-3xl flex flex-col items-center justify-center text-white shadow-xl">
                               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">MAY</span>
                               <span className="text-3xl font-display font-black leading-none mt-1">15</span>
                            </div>
                            <div>
                               <h4 className="text-lg font-display font-bold text-[#1800ad] leading-tight mb-1">{selectedEvent.title}</h4>
                               <p className="text-xs text-gray-400 font-bold">{selectedEvent.date} • {selectedEvent.time}</p>
                               {selectedEvent.location && (
                                 <p className="text-[9px] text-[#e8ba00] font-black uppercase tracking-widest mt-2">{selectedEvent.location}</p>
                               )}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6 pt-10 border-t border-gray-200">
                         <p className="text-[10px] font-black text-[#1800ad] uppercase tracking-widest">Fee Summary</p>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-gray-500">Registration Fee</span>
                               <span className="font-display font-bold text-gray-900">{selectedEvent.price}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                               <span className="text-gray-500">Admin Fee</span>
                               <span className="font-display font-bold text-gray-900">IDR 0</span>
                            </div>
                         </div>
                         <div className="pt-6 border-t border-gray-900 flex justify-between items-end">
                            <p className="text-[10px] font-black text-[#1800ad] uppercase tracking-widest mb-1">Total Amount</p>
                            <h3 className="text-4xl font-display font-black text-gray-900 leading-none">{selectedEvent.price}</h3>
                         </div>
                      </div>
                   </div>

                   <div className="mt-auto pt-12 space-y-6">
                      <button 
                        onClick={handleRegister}
                        className="w-full py-6 bg-[#1800ad] text-white rounded-3xl flex items-center justify-center gap-4 text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-[#1800ad]/30 group"
                      >
                         Verify and Register <Symbol name="arrow_forward" className="text-xl group-hover:translate-x-2 transition-transform" />
                      </button>
                      <p className="text-center text-[9px] text-gray-400 italic">By clicking verify, you agree to our Terms of Service.</p>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessNotif && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed bottom-12 right-12 z-[200] max-w-sm"
          >
            <div className="bg-white text-gray-900 p-8 rounded-[32px] shadow-2xl border border-gray-100 flex items-center gap-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                  <Symbol name="verified" className="text-6xl text-[#1800ad]" />
               </div>
               <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <Symbol name="check_circle" className="text-3xl" fill />
               </div>
               <div>
                  <h4 className="text-lg font-display font-bold text-[#1800ad]">Pendaftaran Berhasil!</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-1">Kami telah mengirimkan tiket dan link akses ke email Anda.</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEWSFEED TICKER (Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white text-[#1800ad] py-3 overflow-hidden border-t-4 border-[#e8ba00] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] transition-colors">
        <div className="flex animate-marquee whitespace-nowrap">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="flex items-center gap-12 px-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="w-2 h-2 bg-[#e8ba00] rounded-full"></span>
                  JagoAI Feed: New Vision AI Module Just Dropped!
                  <span className="w-2 h-2 bg-[#e8ba00] rounded-full"></span>
                  Top Scorer: @neuralnomad earned 'Quantum Researcher' Badge
                  <span className="w-2 h-2 bg-[#e8ba00] rounded-full"></span>
                  Live Now: AI Ethics Seminar by Prof. Helena
                </span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
