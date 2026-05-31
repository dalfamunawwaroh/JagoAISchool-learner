import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';

type ServiceView = 'main' | 'mentorship' | 'career' | 'ticket' | 'chat' | 'book-session' | 'start-audit' | 'schedule-mock';

export const Consultation = ({ language }: { language: 'id' | 'en' }) => {
  const [view, setView] = useState<ServiceView>('main');
  const [selectedMentor, setSelectedMentor] = useState<string>('Senior AI Engineer');

  const renderBreadcrumbs = (title: string) => (
    <button 
      onClick={() => setView('main')}
      className="flex items-center gap-2 text-gray-405 text-slate-500 hover:text-[#1800ad] transition-colors mb-6 group cursor-pointer border-none bg-transparent"
    >
      <Symbol name="arrow_back" className="text-xl group-hover:-translate-x-1 transition-transform" />
      <span className="text-[10px] font-black uppercase tracking-widest">Back to Overview</span>
    </button>
  );

  // --- Detailed Page: Book 1-on-1 Mentorship Session ---
  if (view === 'book-session') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left">
        {renderBreadcrumbs(`Book Session with ${selectedMentor}`)}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e8ba00]">Step 2 of 2 • Konfirmasi Sesi</span>
            <h2 className="text-3xl font-display font-bold text-[#1800ad]">Schedule Your Session</h2>
            <p className="text-slate-500 text-sm">Anda sedang mendaftarkan sesi bimbingan teknis tatap muka privat selama 45 menit bersama <strong className="text-slate-800">{selectedMentor}</strong>.</p>
          </div>
          
          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Tanggal</label>
                <input type="date" required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-700 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Slot Waktu</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-700 font-bold">
                  <option>09:00 AM - 09:45 AM (WIB)</option>
                  <option>10:30 AM - 11:15 AM (WIB)</option>
                  <option>02:00 PM - 02:45 PM (WIB)</option>
                  <option>04:00 PM - 04:45 PM (WIB)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fokus Topik Bimbingan</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-700 font-bold">
                <option>Review Tugas Akhir / Skripsi AI</option>
                <option>Debugging Model & Pemrograman PyTorch/TensorFlow</option>
                <option>Prompt Engineering & RAG Architectures</option>
                <option>Persiapan Karir & Portofolio Kerja</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detail Blocker / Kebutuhan Diskusi</label>
              <textarea placeholder="Ceritakan detail masalah coding atau pertanyaan spesifik yang ingin Anda diskusikan agar mentor dapat bersiap..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-700 h-32"></textarea>
            </div>

            <button 
              onClick={() => {
                alert(`Sukses! Sesi bimbingan tatap muka bersama ${selectedMentor} berhasil dijadwalkan. Link ruang virtual konferensi telah dikirim langsung ke email Anda.`);
                setView('main');
              }} 
              className="px-10 py-5 bg-[#1800ad] hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#1800ad]/10 cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Detailed Page: Resume & Portfolio Audit ---
  if (view === 'start-audit') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left">
        {renderBreadcrumbs('Resume & Portfolio Audit')}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e8ba00]">Portfolio Evaluator</span>
            <h2 className="text-3xl font-display font-bold text-[#1800ad]">Submit Your Resume & Portfolio</h2>
            <p className="text-slate-500 text-sm">Kirim portofolio dan resume Anda. Tim Asesor JagoAI akan melakukan review baris-per-baris dan memberikan audit tertulis yang dikirimkan dalam 24 jam.</p>
          </div>

          <div className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tautan Portofolio (GitHub / LinkedIn / Website)</label>
              <div className="relative">
                <Symbol name="link" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="url" placeholder="https://github.com/username/portfolio" required className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-750 font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unggah Dokumen Resume (PDF)</label>
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 hover:border-[#1800ad] rounded-2xl cursor-pointer hover:bg-slate-50 transition-all text-center space-y-2 group">
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => alert(`Resume "${e.target.files?.[0]?.name}" berhasil dimuat!`)} />
                <Symbol name="upload_file" className="text-4xl text-slate-400 group-hover:text-[#1800ad] transition-colors" />
                <span className="text-xs font-bold text-slate-700">Pilih Berkas PDF</span>
                <span className="text-[10px] text-slate-400">Bebas format resume & tanpa batasan ukuran</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Bidang Karir</label>
              <input type="text" placeholder="e.g. Machine Learning Engineer, Prompt Specialist, AI Consultant" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-750 font-medium" />
            </div>

            <button 
              onClick={() => {
                alert("Audit Berhasil Diajukan! Tim Evaluator kami akan segera memeriksa resume Anda dan mengirimkan umpan balik komprehensif.");
                setView('main');
              }} 
              className="px-10 py-5 bg-[#1800ad] hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#1800ad]/10 cursor-pointer"
            >
              Kirim Untuk Audit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Detailed Page: Schedule Mock Technical Interview ---
  if (view === 'schedule-mock') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left">
        {renderBreadcrumbs('Mock Technical Interview')}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e8ba00]">Simulasi Wawancara</span>
            <h2 className="text-3xl font-display font-bold text-[#1800ad]">Schedule Your Mock Technical Interview</h2>
            <p className="text-slate-500 text-sm">Latih ketajaman Anda dalam wawancara langsung 1-on-1 yang mencakup tinjauan coding, optimasi model, dan teori sistem AI terdistribusi.</p>
          </div>

          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jalur Karir Teknis</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-700 font-bold">
                  <option>Machine Learning Engineer Track</option>
                  <option>Generative AI & LLM Specialist Track</option>
                  <option>Computer Vision Engineer Track</option>
                  <option>Data Scientist / Analyst Track</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Format Rekrutmen</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-700 font-bold">
                  <option>Big Tech / FAANG Format</option>
                  <option>Local Unicorn / Decacorn Format</option>
                  <option>Fast-Growing AI Tech Startup Format</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Tanggal</label>
                <input type="date" required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-700 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Jam</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-700 font-bold">
                  <option>10:00 AM (WIB)</option>
                  <option>01:30 PM (WIB)</option>
                  <option>03:30 PM (WIB)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => {
                alert("Simulasi Wawancara Berhasil Dijadwalkan! Link coding sandbox serta rincian pewawancara teknis Anda telah dikirim.");
                setView('main');
              }} 
              className="px-10 py-5 bg-[#1800ad] hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#1800ad]/10 cursor-pointer"
            >
              Jadwalkan Wawancara
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'mentorship') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left">
        {renderBreadcrumbs('1-on-1 Mentorship')}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl space-y-10 transition-colors">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-[#1800ad]">Find Your Perfect Mentor</h2>
            <p className="text-gray-550">Browse through our curated list of industry experts and senior AI engineers ready to help you level up.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => {
              const mentorName = i === 1 ? "Dr. Annisa Rahma" : i === 2 ? "Rian Hidayat, M.T." : "Prof. Bambang Subiyanto";
              return (
                <div key={i} className="p-8 rounded-[32px] bg-gray-50 border border-gray-100 space-y-6 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/150?u=mentor${i}`} alt="mentor" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#1800ad]">{mentorName}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Senior AI Engineer</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-bold text-[#e8ba00]">#LLM</span>
                      <span className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-bold text-[#e8ba00]">#PyTorch</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedMentor(mentorName);
                      setView('book-session');
                    }}
                    className="w-full py-4 bg-[#1800ad] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#1800ad]/10 cursor-pointer mt-4"
                  >
                    Book Session
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'career') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left">
        {renderBreadcrumbs('Career Coaching')}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl space-y-10 border-t-8 border-t-[#e8ba00] transition-colors">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-[#1800ad]">Supercharge Your AI Career</h2>
            <p className="text-gray-550">Get professional guidance on resume building, interview prep, and landing your dream AI role.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-10 rounded-[32px] bg-[#f8f9fc] space-y-6 transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <Symbol name="description" className="text-4xl text-[#e8ba00]" />
                <h3 className="text-xl font-bold text-[#1800ad]">Resume & Portfolio Audit</h3>
                <p className="text-sm text-gray-500 leading-relaxed">We'll review your project portfolio and resume to ensure it stands out to top-tier AI labs and recruiters.</p>
              </div>
              <button 
                onClick={() => setView('start-audit')}
                className="py-4 px-8 bg-[#1800ad] hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#1800ad]/10 cursor-pointer w-fit mt-6"
              >
                Start Audit
              </button>
            </div>
            <div className="p-10 rounded-[32px] bg-[#f8f9fc] space-y-6 transition-colors flex flex-col justify-between">
              <div className="space-y-4">
                <Symbol name="record_voice_over" className="text-4xl text-[#e8ba00]" />
                <h3 className="text-xl font-bold text-[#1800ad]">Mock Technical Interview</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Live 1-on-1 coding and theory interviews mimicking exact processes at FAANG and major AI companies.</p>
              </div>
              <button 
                onClick={() => setView('schedule-mock')}
                className="py-4 px-8 bg-[#1800ad] hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#1800ad]/10 cursor-pointer w-fit mt-6"
              >
                Schedule Mock
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'ticket') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left">
        {renderBreadcrumbs('Support Ticket')}
        <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-bold text-[#1800ad]">Open Technical Ticket</h2>
            <p className="text-gray-550">Report a technical blocker or request deep-dive assistance from our engineering team.</p>
          </div>
          <form className="max-w-2xl space-y-6 text-left" onSubmit={(e) => { e.preventDefault(); alert('Tiket pengaduan teknis berhasil diajukan! Tim JagoAI akan memprosesnya.'); setView('main'); }}>
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
              <textarea placeholder="Describe your technical emergency..." required className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-[#e8ba00] h-40"></textarea>
            </div>
            <button type="submit" className="px-10 py-5 bg-[#1800ad] hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#1800ad]/10 cursor-pointer">Submit Ticket</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 pb-24 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-2xl md:text-4xl font-display font-bold text-[#1800ad]">
            {language === 'id' ? 'Layanan Konsultasi' : 'Consultation Service'}
          </h1>
          <p className="text-[10px] md:text-sm text-gray-400 font-medium max-w-xl">
            {language === 'id' 
              ? 'Dapatkan bimbingan privat langsung dari pakar AI dan profesional berpengalaman di industri.' 
              : 'Get personalized guidance from AI experts and industry professionals.'}
          </p>
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
           <button onClick={() => setView('mentorship')} className="w-full py-3.5 md:py-5 bg-[#1800ad] text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-black transition-colors mt-auto shadow-lg shadow-[#1800ad]/20 active:scale-[0.98] cursor-pointer">
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
           <button onClick={() => setView('career')} className="w-full py-3.5 md:py-5 bg-[#e8ba00] text-black rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-black transition-colors mt-auto shadow-lg shadow-[#e8ba00]/20 active:scale-[0.98] cursor-pointer">
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
               {/* Hapus tombol Live Chat, hanya menyisakan tombol Open Ticket yang disempurnakan */}
               <button onClick={() => setView('ticket')} className="px-8 py-4 bg-[#1800ad] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-[#1800ad]/20 active:scale-[0.98] cursor-pointer w-full sm:w-auto text-center justify-center">Open Technical Ticket</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Consultation;
