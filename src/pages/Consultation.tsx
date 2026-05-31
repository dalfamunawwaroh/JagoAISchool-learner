import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';

type ServiceView = 'main' | 'mentorship' | 'career' | 'ticket' | 'chat';

export const Consultation = () => {
  const [view, setView] = useState<ServiceView>('main');

  const renderBreadcrumbs = (title: string) => (
    <button 
      onClick={() => setView('main')}
      className="flex items-center gap-2 text-gray-400 hover:text-[#1800ad] transition-colors mb-6 group"
    >
      <Symbol name="arrow_back" className="text-xl group-hover:-translate-x-1 transition-transform" />
      <span className="text-[10px] font-black uppercase tracking-widest">Back to Overview</span>
    </button>
  );

  if (view === 'mentorship') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
        {renderBreadcrumbs('1-on-1 Mentorship')}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl text-left space-y-10 transition-colors">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-[#1800ad]">Find Your Perfect Mentor</h2>
            <p className="text-gray-500 max-w-2xl">Browse through our curated list of industry experts and senior AI engineers ready to help you level up.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-8 rounded-[32px] bg-gray-50 border border-gray-100 space-y-6 hover:shadow-lg transition-all">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/150?u=mentor${i}`} alt="mentor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#1800ad]">Mentor Name {i}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Senior AI Engineer @ Company</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-white rounded-lg text-[9px] font-bold text-[#e8ba00]">#LLM</span>
                  <span className="px-2 py-1 bg-white rounded-lg text-[9px] font-bold text-[#e8ba00]">#PyTorch</span>
                </div>
                <button className="w-full py-4 bg-[#1800ad] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#1800ad]/10">Book Session</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'career') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
        {renderBreadcrumbs('Career Coaching')}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl text-left space-y-10 border-t-8 border-t-[#e8ba00] transition-colors">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-[#1800ad]">Supercharge Your AI Career</h2>
            <p className="text-gray-500 max-w-2xl">Get professional guidance on resume building, interview prep, and landing your dream AI role.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-10 rounded-[32px] bg-[#f8f9fc] space-y-6 transition-colors">
              <Symbol name="description" className="text-4xl text-[#e8ba00]" />
              <h3 className="text-xl font-bold text-[#1800ad]">Resume & Portfolio Audit</h3>
              <p className="text-sm text-gray-500">We'll review your project portfolio and resume to ensure it stands out to top-tier AI labs.</p>
              <button className="py-4 px-8 bg-[#1800ad] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#1800ad]/10">Start Audit</button>
            </div>
            <div className="p-10 rounded-[32px] bg-[#f8f9fc] space-y-6 transition-colors">
              <Symbol name="record_voice_over" className="text-4xl text-[#e8ba00]" />
              <h3 className="text-xl font-bold text-[#1800ad]">Mock Technical Interview</h3>
              <p className="text-sm text-gray-500">Live 1-on-1 coding and theory interviews mimicking processes at FAANG/MAANG companies.</p>
              <button className="py-4 px-8 bg-[#1800ad] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#1800ad]/10">Schedule Mock</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'ticket') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
        {renderBreadcrumbs('Support Ticket')}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl text-left space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-[#1800ad]">Open Technical Ticket</h2>
            <p className="text-gray-500 max-w-2xl">Report a technical blocker or request deep-dive assistance from our engineering team.</p>
          </div>
          <form className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#e8ba00]">Urgency Level</label>
              <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#e8ba00]">
                <option value="low">Low - Questions/Learning</option>
                <option value="medium">Medium - Technical Blocker</option>
                <option value="high">High - Deployment Emergency</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#e8ba00]">Issue Description</label>
              <textarea placeholder="Describe your technical emergency..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-[#e8ba00] h-40"></textarea>
            </div>
            <button className="px-10 py-5 bg-[#1800ad] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/10">Submit Ticket</button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'chat') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
        {renderBreadcrumbs('Live Chat')}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl text-left flex flex-col h-[600px] transition-colors">
          <div className="pb-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1800ad]/10 rounded-full flex items-center justify-center">
                <Symbol name="support_agent" className="text-2xl text-[#1800ad]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1800ad]">Technical Concierge</h3>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 24/7 Active
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-6">
            <div className="bg-gray-50 p-6 rounded-3xl rounded-tl-none max-w-md text-sm text-gray-700 transition-colors">
              Halo! Saya Technical Support JagoAI. Ada yang bisa saya bantu terkait deployment atau coding Anda saat ini?
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <input type="text" placeholder="Tulis masalah Anda..." className="flex-1 bg-gray-50 border-none rounded-2xl px-6 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none transition-colors" />
            <button className="w-14 h-14 bg-[#1800ad] text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-[#1800ad]/10">
              <Symbol name="send" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 pb-24 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-2xl md:text-4xl font-display font-bold text-[#1800ad]">Consultation Service</h1>
          <p className="text-[10px] md:text-sm text-gray-400 font-medium max-w-xl">Get personalized guidance from AI experts and industry professionals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className="bg-white rounded-2xl md:rounded-[48px] p-6 md:p-12 border border-gray-100 shadow-xl space-y-6 md:space-y-8 flex flex-col group transition-colors">
           <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1800ad]/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#1800ad]">
              <Symbol name="person_search" className="text-2xl md:text-3xl" />
           </div>
           <h3 className="text-lg md:text-2xl font-display font-bold text-[#1800ad]">1-on-1 Mentorship</h3>
           <p className="text-[11px] md:text-gray-500 leading-relaxed">Book a session with our verified mentors for career advice, project reviews, or technical deep dives.</p>
           <div className="pt-2 md:pt-4 space-y-2 md:space-y-4">
              <div className="flex items-center gap-2 md:gap-3">
                 <Symbol name="check_circle" className="text-emerald-500 text-base md:text-xl" />
                 <span className="text-[11px] md:text-sm font-bold text-gray-700">45-minute focused session</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                 <Symbol name="check_circle" className="text-emerald-500 text-base md:text-xl" />
                 <span className="text-[11px] md:text-sm font-bold text-gray-700">Recorded for future reference</span>
              </div>
           </div>
           <button onClick={() => setView('mentorship')} className="w-full py-3.5 md:py-5 bg-[#1800ad] text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-black transition-colors mt-auto shadow-lg shadow-[#1800ad]/20 active:scale-[0.98]">
              Find a Mentor
           </button>
        </div>

        <div className="bg-white rounded-2xl md:rounded-[48px] p-6 md:p-12 border border-gray-100 shadow-xl space-y-6 md:space-y-8 flex flex-col group border-t-4 md:border-t-8 border-t-[#e8ba00] transition-colors">
           <div className="w-12 h-12 md:w-16 md:h-16 bg-[#e8ba00]/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#e8ba00]">
              <Symbol name="business_center" className="text-2xl md:text-3xl" />
           </div>
           <h3 className="text-lg md:text-2xl font-display font-bold text-[#1800ad]">Career Coaching</h3>
           <p className="text-[11px] md:text-gray-500 leading-relaxed">Prepare for AI engineering roles with mock interviews, resume reviews, and portfolio building strategies.</p>
           <div className="pt-2 md:pt-4 space-y-2 md:space-y-4">
              <div className="flex items-center gap-2 md:gap-3">
                 <Symbol name="check_circle" className="text-emerald-500 text-base md:text-xl" />
                 <span className="text-[11px] md:text-sm font-bold text-gray-700">Mock technical interviews</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                 <Symbol name="check_circle" className="text-emerald-500 text-base md:text-xl" />
                 <span className="text-[11px] md:text-sm font-bold text-gray-700">Exclusive hiring network access</span>
              </div>
           </div>
           <button onClick={() => setView('career')} className="w-full py-3.5 md:py-5 bg-[#e8ba00] text-black rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-black transition-colors mt-auto shadow-lg shadow-[#e8ba00]/20 active:scale-[0.98]">
              Start Coaching
           </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-[48px] p-8 md:p-20 text-[#1800ad] relative overflow-hidden border border-gray-100 shadow-xl">
         <div className="absolute top-0 right-0 p-10 opacity-5">
            <Symbol name="support_agent" className="text-[100px] md:text-[200px]" />
         </div>
         <div className="max-w-2xl relative z-10 space-y-4 md:space-y-8 text-left">
            <h2 className="text-xl md:text-5xl font-display font-bold leading-tight">Need immediate technical help?</h2>
            <p className="text-[11px] md:text-gray-500 leading-relaxed">Our AI specialized support team is available 24/7 for urgent technical blockers and deployment emergencies.</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-6 pt-2 md:pt-4">
               <button onClick={() => setView('ticket')} className="px-6 py-3.5 md:px-10 md:py-5 bg-[#1800ad] text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-black transition-colors">Open Ticket</button>
               <button onClick={() => setView('chat')} className="px-6 py-3.5 md:px-10 md:py-5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest transition-colors flex items-center gap-2 md:gap-3 justify-center">
                  <Symbol name="chat" className="text-lg md:text-xl text-[#e8ba00]" /> Live Chat
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Consultation;
