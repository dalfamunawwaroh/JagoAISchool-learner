import React, { useState, useEffect } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { courseService, articleService, authService } from '../services/api';

interface DashboardProps {
  currentUser: any;
  onResumeLearning: (courseId: number) => void;
  onViewProfile: (user: any) => void;
  language: 'id' | 'en';
  onReadArticle?: (article: any) => void;
  onViewEvents?: () => void;
  onViewCourses?: () => void;
}

export const Dashboard = ({ 
  currentUser,
  onResumeLearning, 
  onViewProfile, 
  language,
  onReadArticle,
  onViewEvents,
  onViewCourses
}: DashboardProps) => {
  const [activeEnrollments, setActiveEnrollments] = useState<any[]>([]);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const enrolls = await courseService.getEnrollments();
        setActiveEnrollments(enrolls);

        const articles = await articleService.getArticles();
        setLatestArticles(articles.slice(0, 3));

        const leaderboardData = await authService.getLeaderboard();
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Failed to load dashboard statistics:', error);
      }
    };
    loadDashboardData();
  }, []);

  // Format active user for leaderboard presentation
  const userXP = currentUser?.xp !== undefined ? currentUser.xp : 0;
  const userLevel = currentUser?.level !== undefined ? currentUser.level : 1;
  const formattedUserXP = userXP.toLocaleString();

  // If currentUser is not in the leaderboard list returned from the backend (e.g. they are ranked lower than top 10),
  // we can append them to the local presentation to preserve the premium custom (You) feeling.
  const hasUser = leaderboard.some(p => p.id === currentUser?.id);
  const baseList = [...leaderboard];
  if (!hasUser && currentUser) {
    baseList.push({
      id: currentUser.id,
      full_name: currentUser.fullName,
      username: currentUser.username,
      xp: currentUser.xp,
      level: currentUser.level,
      avatar_url: currentUser.avatarUrl,
      bio: currentUser.bio,
      role: currentUser.role
    });
  }

  const fullLeaderboard = baseList
    .map(p => ({
      id: p.id,
      name: p.id === currentUser?.id ? `${p.full_name} (You)` : p.full_name,
      pts: p.xp.toLocaleString(),
      ptsRaw: p.xp,
      user: p.id === currentUser?.id,
      avatar: p.avatar_url || 'https://i.pravatar.cc/100',
      status: p.role === 'TENTOR' ? 'Mentor' : `Level ${p.level} - Student`,
      bio: p.bio || (language === 'id' ? 'Siswa berdedikasi di JagoAI Academy.' : 'Dedicated learner at JagoAI Academy.'),
      username: p.username
    }))
    .sort((a, b) => b.ptsRaw - a.ptsRaw)
    .map((player, idx) => ({
      ...player,
      rank: idx + 1
    }));

  // Determine course to resume (latest active enrollment)
  const resumeCourse = activeEnrollments.find(e => e.status === 'active') || activeEnrollments[0];

  return (
    <div className="space-y-10">
      {/* HEADER & ACHIEVEMENT VAULT */}
      <div className="space-y-6 md:space-y-10">
        <div className="flex justify-between items-center">
          <div className="space-y-1 text-left">
            <h1 className="text-xl md:text-3xl font-display font-bold text-[#1800ad]">
              {language === 'id' 
                ? `Selamat Datang, ${currentUser?.fullName || 'Siswa'}` 
                : `Welcome back, ${currentUser?.fullName || 'Student'}`}
            </h1>
            <p className="text-[11px] md:text-sm text-gray-400 font-medium">
              {language === 'id' ? 'Lanjutkan perjalanan AI-mu hari ini.' : 'Continue your AI journey today.'}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-colors text-left w-full">
          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 w-full md:w-auto text-center sm:text-left">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Achievement Vault</span>
              <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
                {[
                  { icon: 'military_tech', color: 'bg-[#e8ba00]/10 text-[#e8ba00]', text: 'Top Scorer' },
                  { icon: 'cognition', color: 'bg-[#1800ad]/10 text-[#1800ad]', text: 'Deep Thinker' },
                  { icon: 'code', color: 'bg-blue-400/10 text-blue-500', text: 'Master Coder' },
                  { icon: 'rocket_launch', color: 'bg-emerald-400/10 text-emerald-500', text: 'Fast Learner' },
                  { icon: 'star', color: 'bg-gray-100 text-gray-300', text: 'Elite Member' }
                ].map((badge, i) => (
                  <div key={i} className="group relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-50/50 ${badge.color}`}>
                      <Symbol name={badge.icon} className="text-lg md:text-xl" fill={i < 4} />
                    </div>
                    <div className="absolute hidden sm:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-y-1 group-hover:translate-y-0 z-50 whitespace-nowrap shadow-xl">
                      {badge.text}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-gray-100 self-center"></div>

            <div className="space-y-1">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">XP Progress</span>
               <div className="flex items-baseline justify-center sm:justify-start gap-1">
                 <span className="text-xl md:text-2xl font-display font-black text-gray-900 tabular-nums">{formattedUserXP}</span>
                 <span className="text-[10px] font-bold text-gray-400 uppercase">XP</span>
               </div>
            </div>
          </div>

          <button className="w-full md:w-auto px-6 py-3.5 bg-[#4a3a00] text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-colors group shrink-0 shadow-sm">
             <Symbol name="trophy" className="text-lg text-[#e8ba00] fill-1 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">Level {userLevel} - AI Explorer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          {resumeCourse ? (
            <div className="bg-white rounded-[32px] md:rounded-[40px] overflow-hidden shadow-xl border border-gray-100 flex flex-col xl:flex-row min-h-0 xl:min-h-[440px] group transition-colors">
              <div className="w-full xl:w-[42%] h-48 sm:h-56 xl:h-auto relative">
                <img src={resumeCourse.image_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop"} alt="AI Tech" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`, backgroundSize: '15px 15px' }}></div>
              </div>
              <div className="flex-1 p-6 md:p-10 xl:p-12 flex flex-col text-left">
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-8">
                   <span className="px-3 py-1 bg-[#1800ad]/10 text-[#1800ad] text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full">
                     {language === 'id' ? 'Lanjut Belajar' : 'Resume Learning'}
                   </span>
                   <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{resumeCourse.category}</span>
                </div>
                <h2 className="text-xl md:text-3xl xl:text-4xl font-display font-bold text-[#1800ad] leading-[1.2] mb-4 md:mb-6">{resumeCourse.title}</h2>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium mb-8 md:mb-12">Level: {resumeCourse.level} • Durasi Kelas: {resumeCourse.duration_hours} Jam</p>
                <div className="mt-auto space-y-4 md:space-y-5">
                  <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                     <span className="text-gray-400">Progress</span>
                     <span className="text-[#1800ad]">{Math.round(resumeCourse.progress_percentage)}%</span>
                  </div>
                  <div className="w-full h-2 md:h-3 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-[#1800ad] to-[#e8ba00] rounded-full" style={{ width: `${resumeCourse.progress_percentage}%` }}></div>
                  </div>
                  <button 
                    onClick={() => onResumeLearning(resumeCourse.course_id)}
                    className="w-full py-4 md:py-5 bg-[#1800ad] text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-black transition-colors shadow-lg shadow-[#1800ad]/20 mt-2 md:mt-4 group border-none cursor-pointer"
                  >
                     Resume <Symbol name="arrow_forward" className="text-lg group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[32px] md:rounded-[40px] p-12 border border-gray-100 shadow-xl text-center space-y-6 flex flex-col items-center justify-center min-h-[440px]">
              <div className="w-20 h-20 bg-gray-55 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center shadow-inner">
                <Symbol name="school" className="text-4xl" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1800ad]">Belum Ada Kelas yang Diikuti</h3>
                <p className="text-gray-400 text-xs max-w-sm mx-auto">Anda belum mendaftar di kelas manapun. Jelajahi kurikulum industri and riset AI kami sekarang!</p>
              </div>
              <button 
                onClick={onViewCourses}
                className="px-8 py-4 bg-[#1800ad] hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg transition-all"
              >
                Mulai Belajar
              </button>
            </div>
          )}

          {/* Lanjut Belajar list */}
          {activeEnrollments.length > 1 && (
            <div className="space-y-6 md:space-y-8 text-left">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-2xl font-display font-bold text-[#1800ad] flex items-center gap-2 md:gap-3"><Symbol name="history" className="text-xl md:text-2xl text-[#1800ad]" /> Lanjut Belajar</h3>
                <button onClick={onViewCourses} className="text-[9px] md:text-xs font-bold text-[#e8ba00] uppercase tracking-widest hover:underline border-none bg-transparent">Lihat Semua</button>
              </div>
               <div className="grid grid-cols-2 gap-3 md:gap-6">
                {activeEnrollments.slice(1, 3).map((enroll, index) => (
                  <div 
                    key={index}
                    onClick={() => onResumeLearning(enroll.course_id)}
                    className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden shrink-0">
                      <img src={enroll.image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&h=150&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Course" />
                    </div>
                    <div className="flex-1 space-y-1 text-center sm:text-left min-w-0 w-full">
                       <h4 className="text-[10px] md:text-sm font-bold text-[#1800ad] line-clamp-1">{enroll.title}</h4>
                       <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-400 text-[8px] md:text-[9px] font-bold">
                          <span className="flex items-center justify-center sm:justify-start gap-0.5 whitespace-nowrap"><Symbol name="schedule" className="text-[10px] md:text-xs" /> {enroll.duration_hours}h</span>
                          <span className="flex items-center justify-center sm:justify-start gap-0.5 whitespace-nowrap"><Symbol name="award" className="text-[10px] md:text-xs text-[#e8ba00]" /> {Math.round(enroll.progress_percentage)}%</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8 md:space-y-12">
          {/* Leaderboard points */}
          <div className="bg-white p-6 md:p-10 border border-gray-100 shadow-xl space-y-6 md:space-y-10 text-left transition-colors">
            <h3 className="text-lg md:text-xl font-display font-bold text-[#1800ad] flex items-center gap-2 md:gap-3"><Symbol name="stars" className="text-xl md:text-2xl text-[#1800ad] fill-1" /> Top 5 Points</h3>
            <div className="space-y-2">
              {fullLeaderboard.slice(0, 5).map((player, i) => (
                <div key={i} className="group relative">
                  <div 
                    onClick={() => onViewProfile({ name: player.name, photo: player.avatar, username: player.user ? currentUser?.username : player.username, bio: player.bio })}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all border cursor-pointer ${player.user ? 'bg-[#e8ba00]/5 border-[#e8ba00] shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-400 w-4 font-mono">{player.rank}</span>
                      <div className={`w-10 h-10 rounded-xl overflow-hidden border-2 bg-gray-50 ${player.user ? 'border-[#e8ba00]' : 'border-white'} shadow-sm`}>
                         <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                      <span className={`text-[12px] font-bold ${player.user ? 'text-[#1800ad]' : 'text-gray-600'} truncate max-w-[100px]`}>{player.name}</span>
                    </div>
                    <span className={`text-sm font-display font-black ${player.user ? 'text-[#1800ad]' : 'text-gray-900'}`}>{player.pts}</span>
                  </div>

                  {/* Profile Detail Hover */}
                  <div className="absolute right-full top-0 mr-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 opacity-0 group-hover:opacity-100 pointer-events-none transition-all -translate-x-2 group-hover:translate-x-0 z-[110]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-[#1800ad]">{player.name}</div>
                        <div className="text-[9px] font-black text-[#e8ba00] uppercase tracking-widest">{player.status}</div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-4 text-left">
                      {player.bio}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                       <span className="text-[10px] font-black text-gray-400 uppercase">Current Points</span>
                       <span className="text-xs font-black text-[#1800ad]">{player.pts} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLES SECTION */}
      {latestArticles.length > 0 && (
        <div className="space-y-8 text-left">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div className="space-y-1">
               <h3 className="text-2xl font-display font-bold text-[#1800ad]">Knowledge at the Speed of Light</h3>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Articles & Insights</p>
            </div>
            <button 
              onClick={onViewCourses} 
              className="text-xs font-bold text-[#e8ba00] uppercase tracking-widest hover:underline cursor-pointer border-none bg-transparent"
            >
              {language === 'id' ? 'Baca Semua Artikel' : 'Read All Posts'}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {latestArticles.map((art, i) => (
              <div 
                key={i} 
                onClick={() => onReadArticle?.(art)}
                className="bg-white border border-gray-100 rounded-[28px] md:rounded-[32px] p-4 md:p-6 flex items-center gap-4 md:gap-8 group cursor-pointer hover:shadow-xl transition-all min-h-[90px] md:h-32"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shrink-0">
                  <img src={art.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="Article image" />
                </div>
                <div className="flex-1 space-y-1 md:space-y-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-50 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-full text-gray-400">{art.readTime}</span>
                  </div>
                  <h4 className="text-sm md:text-lg font-display font-bold text-[#1800ad] group-hover:text-[#e8ba00] transition-colors line-clamp-1 text-left">{art.title}</h4>
                  <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">By {art.author}</p>
                </div>
                <Symbol name="arrow_forward" className="text-xl md:text-2xl text-gray-200 group-hover:text-[#e8ba00] group-hover:translate-x-2 transition-all mr-2 md:mr-4" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVENTS SECTION */}
      <div className="space-y-8 text-left">
         <h3 onClick={onViewEvents} className="text-xl md:text-2xl font-display font-bold text-[#1800ad] flex items-center gap-2 md:gap-3 text-left hover:text-[#e8ba00] transition-colors cursor-pointer"><Symbol name="event" className="text-xl md:text-2xl" /> Academic Milestones</h3>
         <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-8">
           <div 
             onClick={onViewEvents}
             className="bg-[#1800ad]/10 rounded-2xl md:rounded-[32px] p-4 md:p-8 text-[#1800ad] space-y-4 md:space-y-6 relative overflow-hidden group border border-[#1800ad]/10 flex flex-col justify-between h-full cursor-pointer hover:shadow-md transition-all"
           >
              <div className="absolute right-[-10%] top-[-10%] opacity-5 group-hover:scale-110 transition-transform hidden sm:block">
                <Symbol name="groups" className="text-[60px] md:text-[120px]" />
              </div>
              <div className="space-y-1.5 md:space-y-2 relative z-10 text-left">
                 <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-[#1800ad] text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-full">Soon</span>
                 <h4 className="text-[11px] md:text-2xl font-display font-bold line-clamp-1">AI Expo 2026</h4>
                 <p className="text-[9px] md:text-sm text-[#1800ad]/70 font-medium line-clamp-2 md:line-clamp-none text-left">Showcase projects and compete for rewards.</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 pt-2 md:pt-4 gap-2">
                 <div className="flex -space-x-2 md:-space-x-3">
                    {[1,2,3].map(x => (
                      <div key={x} className="w-5 h-5 md:w-8 md:h-8 rounded-full border border-white bg-gray-400 overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?u=${x}`} className="w-full h-full object-cover" alt="User avatar" />
                      </div>
                    ))}
                    <div className="w-5 h-5 md:w-8 md:h-8 rounded-full border border-white bg-[#e8ba00] flex items-center justify-center text-[7px] md:text-[10px] font-black text-black">+24</div>
                 </div>
                 <button onClick={(e) => { e.stopPropagation(); onViewEvents?.(); }} className="px-2 md:px-6 py-1.5 md:py-3 bg-[#1800ad] text-white rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black tracking-widest uppercase transition-all hover:bg-black cursor-pointer">Join</button>
              </div>
           </div>
           <div 
             onClick={onViewEvents}
             className="bg-white border border-gray-100 rounded-2xl md:rounded-[32px] p-4 md:p-8 flex flex-col justify-between text-left transition-all hover:shadow-md cursor-pointer h-full"
           >
              <div className="space-y-2 md:space-y-4 text-left">
                 <div className="flex justify-between items-start">
                   <div className="w-8 h-8 md:w-12 md:h-12 bg-[#e8ba00]/10 rounded-lg md:rounded-2xl flex items-center justify-center text-[#e8ba00]">
                      <Symbol name="diversity_3" className="text-lg md:text-2xl" />
                   </div>
                   <span className="text-[7px] md:text-[10px] font-black text-gray-400 text-right uppercase tracking-[0.1em] md:tracking-[0.2em] hidden sm:inline">Workshop</span>
                 </div>
                 <h4 className="text-[11px] md:text-xl font-display font-bold text-[#1800ad] line-clamp-1">Fine-tuning</h4>
                 <p className="text-[9px] md:text-xs text-gray-500 leading-relaxed line-clamp-2">Exclusive 3-day intensive workshop for Pro members.</p>
              </div>
              <div className="pt-3 md:pt-8 flex items-center gap-1.5 md:gap-4">
                 <Symbol name="calendar_today" className="text-[#e8ba00] text-[10px] md:text-lg" />
                 <span className="text-[8px] md:text-[10px] font-black text-[#1800ad] uppercase tracking-widest line-clamp-1">Starts May 15</span>
              </div>
           </div>
         </div>
      </div>

      {/* MODUL AI BARU */}
      <div className="space-y-8 pb-32 text-left">
        <h3 onClick={onViewCourses} className="text-xl md:text-2xl font-display font-bold text-[#1800ad] flex items-center gap-3 text-left hover:text-[#e8ba00] transition-colors cursor-pointer">
          <Symbol name="grid_view" className="text-2xl" />
          Modul AI Baru
        </h3>
        <div className="grid grid-cols-3 gap-2.5 md:gap-8">
          {[
            { label: 'AI untuk SMP', icon: 'child_care', color: 'bg-indigo-50 text-indigo-500', desc: 'Eksplorasi dasar AI dengan cara yang seru and interaktif.', modules: '8 MODUL' },
            { label: 'AI untuk SMA', icon: 'school', color: 'bg-amber-50 text-amber-500', desc: 'Pemrograman AI tingkat menengah & Analisis Data.', modules: '12 MODUL' },
            { label: 'AI untuk SMK', icon: 'precision_manufacturing', color: 'bg-sky-50 text-sky-500', desc: 'Implementasi praktis AI di industri and manufaktur.', modules: '15 MODUL' }
          ].map((modul, i) => (
            <div 
              key={i} 
              onClick={onViewCourses}
              className="bg-white p-3 md:p-8 rounded-2xl md:rounded-[32px] border border-gray-100 flex flex-col items-center text-center space-y-3 md:space-y-6 hover:-translate-y-2 hover:shadow-md transition-all duration-300 shadow-sm relative overflow-hidden group cursor-pointer"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-indigo-50/0 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
               <div className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center ${modul.color} shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Symbol name={modul.icon} className="text-xl sm:text-2xl md:text-3xl" />
               </div>
               <div className="space-y-1.5 md:space-y-3 min-w-0">
                  <h4 className="text-[10px] sm:text-sm md:text-lg font-display font-black text-[#1800ad] line-clamp-1">{modul.label}</h4>
                  <p className="text-[9px] sm:text-[11px] md:text-xs text-gray-400 leading-relaxed line-clamp-2 md:line-clamp-3 hidden sm:block">{modul.desc}</p>
               </div>
               <span className="px-2 py-1 md:px-4 md:py-2 bg-gray-50 border border-gray-100 rounded-full text-[8px] md:text-[10px] font-black text-[#1800ad] tabular-nums tracking-wider md:tracking-widest">{modul.modules}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
