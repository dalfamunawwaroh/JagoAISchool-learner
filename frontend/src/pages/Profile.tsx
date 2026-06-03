import React from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion } from 'motion/react';

export interface UserProfileData {
  id: number;
  email: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  role: string;
  xp: number;
  level: number;
  bio?: string;
  website_url?: string;
  linkedin_url?: string;
  // Menjaga kecocokan visual dengan relasi database masa depan
  courses?: { title: string; progress: number }[];
  badges?: { name: string; icon: string; color: string }[];
}

interface ProfileProps {
  user?: UserProfileData; // Menerima data user yang sedang login dari App state/context
  onBack?: () => void;
}

export const Profile = ({ user, onBack }: ProfileProps) => {
  // Jika data user dari backend belum termuat, tampilkan state loading yang clean
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-gray-500 font-medium">
        <div className="animate-pulse space-y-4">
          <div className="w-12 h-12 bg-[#1800ad]/10 text-[#1800ad] rounded-full flex items-center justify-center mx-auto animate-spin">
            <Symbol name="sync" className="text-xl" />
          </div>
          <p className="text-xs uppercase tracking-widest">Loading JagoAI Profile Vault...</p>
        </div>
      </div>
    );
  }

  // Hitung target XP berikutnya secara dinamis (Contoh rumus game standar: Level * 1000)
  const nextLevelXp = user.level * 1000;
  const currentLevelXpProgress = user.xp % 1000; // Sisa XP di level berjalan

  // Fallback data pendukung jika di tabel database user tersebut belum punya tracks/badges
  const activeCourses = user.courses || [];
  const earnedBadges = user.badges || [
    { name: 'Elite Member', icon: 'star', color: 'bg-amber-100 text-amber-600' } // Default badge dari register router!
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 text-left">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1800ad] hover:bg-[#1800ad] hover:text-white transition-all shadow-sm active:scale-95 w-fit cursor-pointer"
        >
          <Symbol name="arrow_back" className="text-lg group-hover:-translate-x-1 transition-transform" />
          <span>Back to Workspace</span>
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Column: Real Personal Info from DB */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-xl text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-[40px] overflow-hidden shadow-inner bg-gray-50 ring-8 ring-[#f8f9fc]">
                <img
                  src={user.avatar_url || 'https://i.pravatar.cc/150'}
                  className="w-full h-full object-cover"
                  alt={user.full_name}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#e8ba00] text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border-2 border-white">
                Level {user.level}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-display font-bold text-[#1800ad]">{user.full_name}</h2>
              <p className="text-sm font-bold text-gray-400">@{user.username}</p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed px-4">
              {user.bio || 'No bio specified yet. Click Edit Profile to share your AI journey parameters.'}
            </p>

            <div className="pt-6 border-t border-gray-50 flex flex-col gap-3">
              {user.website_url ? (
                <a href={user.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-[#1800ad] transition-colors justify-center">
                  <Symbol name="language" className="text-lg" /> {user.website_url.replace('https://', '').replace('http://', '')}
                </a>
              ) : (
                <span className="text-gray-300 text-[11px] font-medium italic flex items-center gap-2 justify-center"><Symbol name="language" className="text-base" /> No website linked</span>
              )}

              {user.linkedin_url ? (
                <a href={user.linkedin_url.startsWith('http') ? user.linkedin_url : `https://${user.linkedin_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-[#1800ad] transition-colors justify-center">
                  <Symbol name="link" className="text-lg" /> LinkedIn Profile
                </a>
              ) : (
                <span className="text-gray-300 text-[11px] font-medium italic flex items-center gap-2 justify-center"><Symbol name="link" className="text-base" /> No LinkedIn linked</span>
              )}
            </div>
          </div>

          {/* Gamified Real XP Container */}
          <div className="bg-[#1800ad] rounded-[40px] p-10 text-white space-y-6 shadow-xl relative overflow-hidden group">
            <Symbol name="stars" className="absolute -right-8 -bottom-8 text-[160px] opacity-10 group-hover:scale-110 transition-transform" />
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Quest Performance</p>
              <h3 className="text-3xl font-display font-bold">{user.xp.toLocaleString()} XP</h3>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>{user.role} Track</span>
                <span>{nextLevelXp.toLocaleString()} XP</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentLevelXpProgress / 1000) * 100}%` }}
                  className="h-full bg-[#e8ba00]"
                ></motion.div>
              </div>
              <p className="text-[9px] font-medium opacity-60 italic text-right">Collect {(1000 - currentLevelXpProgress).toLocaleString()} more XP to reach Level {user.level + 1}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Courses & Badges */}
        <div className="lg:col-span-8 space-y-10">

          {/* Dynamic Badges Block */}
          <div className="bg-white rounded-[48px] p-6 md:p-10 border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-[#1800ad]">Badges Earned</h3>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{earnedBadges.length} Collectibles</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {earnedBadges.map((badge, i) => (
                <div key={i} className="flex flex-col items-center space-y-3 p-4 rounded-3xl hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className={`w-14 h-14 ${badge.color || 'bg-indigo-50 text-[#1800ad]'} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    <Symbol name={badge.icon} className="text-2xl" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Active Tracks Block */}
          <div className="bg-white rounded-[48px] p-6 md:p-10 border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xl font-display font-bold text-[#1800ad]">Active Learning Tracks</h3>
            {activeCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {activeCourses.map((course, i) => (
                  <div key={i} className="p-6 md:p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                    <div className="space-y-4 flex-1 pr-4 md:pr-10">
                      <h4 className="text-lg font-display font-bold text-[#1800ad] group-hover:text-[#e8ba00] transition-colors">{course.title}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            className={`h-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-[#1800ad]'}`}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                    <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1800ad] shadow-sm border border-gray-100 group-hover:bg-[#1800ad] group-hover:text-white transition-all shrink-0">
                      <Symbol name={course.progress === 100 ? 'check' : 'play_arrow'} className="text-2xl" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 space-y-2 border-2 border-dashed border-gray-100 rounded-[32px]">
                <Symbol name="school" className="text-3xl block text-gray-300 mx-auto" />
                <p className="text-xs font-semibold">Belum ada kelas aktif yang diikuti.</p>
                <p className="text-[10px] text-gray-400 max-w-xs mx-auto">Jelajahi The Academy katalog untuk memulai modul pembelajaran AI pertama Anda.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};