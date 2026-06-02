import React, { useState, useEffect } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { consultationService } from '../services/api';

type ServiceView = 'main' | 'mentorship' | 'career' | 'ticket' | 'book-session' | 'start-audit' | 'schedule-mock';

interface Mentor {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  skills: string[];
}

export const Consultation = ({ language }: { language: 'id' | 'en' }) => {
  const [view, setView] = useState<ServiceView>('main');
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadingMentors, setLoadingMentors] = useState<boolean>(false);

  // Form Booking mentorship states
  const [bookDate, setBookDate] = useState('');
  const [bookTimeSlot, setBookTimeSlot] = useState('09:00 AM - 09:45 AM (WIB)');
  const [bookTopicFocus, setBookTopicFocus] = useState('Review Tugas Akhir / Skripsi AI');
  const [bookBlocker, setBookBlocker] = useState('');
  const [booking, setBooking] = useState(false);

  // Form Portfolio audit states
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [targetCareer, setTargetCareer] = useState('');
  const [submittingAudit, setSubmittingAudit] = useState(false);

  // Form Mock Technical Interview states
  const [careerTrack, setCareerTrack] = useState('Machine Learning Engineer Track');
  const [formatType, setFormatType] = useState('Big Tech / FAANG Format');
  const [mockDate, setMockDate] = useState('');
  const [mockTime, setMockTime] = useState('10:00 AM (WIB)');
  const [schedulingMock, setSchedulingMock] = useState(false);

  // Form Urgent ticket states
  const [ticketUrgency, setTicketUrgency] = useState('low');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useEffect(() => {
    if (view === 'mentorship') {
      const fetchMentors = async () => {
        setLoadingMentors(true);
        try {
          const data = await consultationService.getMentors();
          setMentors(data);
        } catch (err) {
          console.error('Failed to load mentors:', err);
        } finally {
          setLoadingMentors(false);
        }
      };
      fetchMentors();
    }
  }, [view]);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookDate || !selectedMentor) return;

    setBooking(true);
    try {
      const res = await consultationService.bookSession({
        mentorName: selectedMentor,
        date: bookDate,
        timeSlot: bookTimeSlot,
        topicFocus: bookTopicFocus,
        blockerDetails: bookBlocker
      });

      alert(language === 'id' 
        ? `Sukses! Sesi bimbingan bersama ${selectedMentor} berhasil dijadwalkan. Link Zoom: ${res.zoomLink}`
        : `Success! Mentorship session with ${selectedMentor} has been scheduled. Zoom Link: ${res.zoomLink}`
      );
      
      // Reset form & go back
      setBookDate('');
      setBookBlocker('');
      setView('main');
    } catch (err: any) {
      alert(err.message || 'Failed to book mentorship session.');
    } finally {
      setBooking(false);
    }
  };

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioUrl || !targetCareer) return;

    setSubmittingAudit(true);
    try {
      await consultationService.submitAudit({
        portfolioUrl,
        resumeFileUrl: resumeUrl || undefined,
        targetCareer
      });

      alert(language === 'id'
        ? "Audit Portofolio Berhasil Diajukan! Tim Evaluator kami akan segera memeriksa resume Anda."
        : "Portfolio audit submitted! Our advisor will review your resume within 24 hours."
      );

      setPortfolioUrl('');
      setResumeUrl('');
      setTargetCareer('');
      setView('main');
    } catch (err: any) {
      alert(err.message || 'Failed to submit portfolio audit.');
    } finally {
      setSubmittingAudit(false);
    }
  };

  const handleScheduleMock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockDate) return;

    setSchedulingMock(true);
    try {
      const res = await consultationService.scheduleMock({
        careerTrack,
        formatType,
        date: mockDate,
        time: mockTime
      });

      alert(language === 'id'
        ? `Simulasi Interview Berhasil Dijadwalkan! Link coding sandbox Anda: ${res.sandboxLink}`
        : `Mock interview scheduled successfully! Sandbox link: ${res.sandboxLink}`
      );

      setMockDate('');
      setView('main');
    } catch (err: any) {
      alert(err.message || 'Failed to schedule mock technical interview.');
    } finally {
      setSchedulingMock(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDescription) return;

    setSubmittingTicket(true);
    try {
      await consultationService.createTicket({
        urgency: ticketUrgency,
        description: ticketDescription
      });

      alert(language === 'id'
        ? "Tiket Pengaduan Teknis Berhasil Dibuka! Tim kami akan segera meninjau blocker Anda."
        : "Support ticket opened successfully! Our engineering team will review it shortly."
      );

      setTicketDescription('');
      setView('main');
    } catch (err: any) {
      alert(err.message || 'Failed to submit technical support ticket.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  const renderBreadcrumbs = (title: string) => (
    <button 
      onClick={() => setView('main')}
      className="flex items-center gap-2 text-slate-505 text-slate-500 hover:text-[#1800ad] transition-colors mb-6 group cursor-pointer border-none bg-transparent"
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
            <p className="text-slate-500 text-sm">
              Anda sedang mendaftarkan sesi bimbingan teknis tatap muka privat selama 45 menit bersama <strong className="text-slate-800">{selectedMentor}</strong>.
            </p>
          </div>
          
          <form className="max-w-2xl space-y-6" onSubmit={handleBookSession}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Tanggal</label>
                <input 
                  type="date" 
                  required 
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Slot Waktu</label>
                <select 
                  value={bookTimeSlot}
                  onChange={(e) => setBookTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-bold font-sans"
                >
                  <option>09:00 AM - 09:45 AM (WIB)</option>
                  <option>10:30 AM - 11:15 AM (WIB)</option>
                  <option>02:00 PM - 02:45 PM (WIB)</option>
                  <option>04:00 PM - 04:45 PM (WIB)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fokus Topik Bimbingan</label>
              <select 
                value={bookTopicFocus}
                onChange={(e) => setBookTopicFocus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-bold font-sans"
              >
                <option>Review Tugas Akhir / Skripsi AI</option>
                <option>Debugging Model & Pemrograman PyTorch/TensorFlow</option>
                <option>Prompt Engineering & RAG Architectures</option>
                <option>Persiapan Karir & Portofolio Kerja</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detail Blocker / Kebutuhan Diskusi</label>
              <textarea 
                placeholder="Ceritakan detail masalah coding atau pertanyaan spesifik yang ingin Anda diskusikan..." 
                value={bookBlocker}
                onChange={(e) => setBookBlocker(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 h-32"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={booking}
              className="px-10 py-5 bg-[#1800ad] disabled:bg-gray-400 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#1800ad]/10 cursor-pointer"
            >
              {booking ? 'Scheduling...' : 'Confirm Booking'}
            </button>
          </form>
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

          <form className="max-w-2xl space-y-6" onSubmit={handleSubmitAudit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tautan Portofolio (GitHub / LinkedIn / Website)</label>
              <div className="relative">
                <Symbol name="link" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="url" 
                  required
                  placeholder="https://github.com/username/portfolio" 
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-medium" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tautan Resume PDF (Unggah Drive / LinkedIn URL)</label>
              <input 
                type="url" 
                placeholder="https://drive.google.com/file/d/your-resume-pdf"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Bidang Karir</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Machine Learning Engineer, Prompt Specialist, AI Consultant" 
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-medium" 
              />
            </div>

            <button 
              type="submit"
              disabled={submittingAudit}
              className="px-10 py-5 bg-[#1800ad] disabled:bg-gray-400 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#1800ad]/10 cursor-pointer"
            >
              {submittingAudit ? 'Submitting...' : 'Kirim Untuk Audit'}
            </button>
          </form>
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

          <form className="max-w-2xl space-y-6" onSubmit={handleScheduleMock}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jalur Karir Teknis</label>
                <select 
                  value={careerTrack}
                  onChange={(e) => setCareerTrack(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-bold font-sans"
                >
                  <option>Machine Learning Engineer Track</option>
                  <option>Generative AI & LLM Specialist Track</option>
                  <option>Computer Vision Engineer Track</option>
                  <option>Data Scientist / Analyst Track</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Format Rekrutmen</label>
                <select 
                  value={formatType}
                  onChange={(e) => setFormatType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-bold font-sans"
                >
                  <option>Big Tech / FAANG Format</option>
                  <option>Local Unicorn / Decacorn Format</option>
                  <option>Fast-Growing AI Tech Startup Format</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Tanggal</label>
                <input 
                  type="date" 
                  required 
                  value={mockDate}
                  onChange={(e) => setMockDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-bold" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pilih Jam</label>
                <select 
                  value={mockTime}
                  onChange={(e) => setMockTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-slate-705 font-bold font-sans"
                >
                  <option>10:00 AM (WIB)</option>
                  <option>01:30 PM (WIB)</option>
                  <option>03:30 PM (WIB)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={schedulingMock}
              className="px-10 py-5 bg-[#1800ad] disabled:bg-gray-400 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#1800ad]/10 cursor-pointer"
            >
              {schedulingMock ? 'Scheduling...' : 'Jadwalkan Wawancara'}
            </button>
          </form>
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
          
          {loadingMentors ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#1800ad] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-405 font-bold text-xs uppercase tracking-wider">Syncing mentor rosters...</p>
            </div>
          ) : mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mentors.map(mentor => {
                return (
                  <div key={mentor.id} className="p-8 rounded-[32px] bg-gray-50 border border-gray-100 space-y-6 hover:shadow-lg transition-all flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                        <img src={mentor.avatar || `https://i.pravatar.cc/150?u=mentor${mentor.id}`} alt={mentor.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#1800ad]">{mentor.name}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{mentor.title || 'AI Mentor'}</p>
                        <p className="text-xs text-gray-400 leading-normal mt-2 line-clamp-3">{mentor.bio}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {mentor.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-bold text-[#e8ba00]">#{skill}</span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedMentor(mentor.name);
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
          ) : (
            <p className="text-gray-400 text-sm">No active mentors found.</p>
          )}
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
                <p className="text-sm text-gray-550 leading-relaxed text-gray-500">Live 1-on-1 coding and theory interviews mimicking exact processes at FAANG and major AI companies.</p>
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
          <form className="max-w-2xl space-y-6 text-left" onSubmit={handleSubmitTicket}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#e8ba00]">Urgency Level</label>
              <select 
                value={ticketUrgency}
                onChange={(e) => setTicketUrgency(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#e8ba00] font-sans"
              >
                <option value="low">Low - Questions/Learning</option>
                <option value="medium">Medium - Technical Blocker</option>
                <option value="high">High - Deployment Emergency</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#e8ba00]">Issue Description</label>
              <textarea 
                placeholder="Describe your technical emergency..." 
                required 
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-[#e8ba00] h-40"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={submittingTicket}
              className="px-10 py-5 bg-[#1800ad] disabled:bg-gray-400 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#1800ad]/10 cursor-pointer"
            >
              {submittingTicket ? 'Submitting...' : 'Submit Ticket'}
            </button>
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
               <button onClick={() => setView('ticket')} className="px-8 py-4 bg-[#1800ad] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-[#1800ad]/20 active:scale-[0.98] cursor-pointer w-full sm:w-auto text-center justify-center">Open Technical Ticket</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Consultation;
