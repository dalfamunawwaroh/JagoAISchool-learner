import React from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion } from 'motion/react';

export interface UserProfileData {
  name: string;
  username: string;
  photo: string;
  bio: string;
  website: string;
  linkedin: string;
  xp: number;
  nextLevelXp: number;
  level: number;
  courses: { title: string; progress: number }[];
  badges: { name: string; icon: string; color: string }[];
}

export const Profile = ({ user, onBack }: { user?: UserProfileData; onBack?: () => void }) => {
  const defaultUser: UserProfileData = {
    name: 'Aris Setiawan',
    username: '@aris_ai',
    photo: 'https://i.pravatar.cc/200?u=as',
    bio: 'AI Visionary at JagoAI Academy. Passionate about Generative AI and Human-Computer Interaction.',
    website: 'https://aris.ai',
    linkedin: 'linkedin.com/in/aris',
    xp: 2450,
    nextLevelXp: 3000,
    level: 12,
    courses: [
      { title: 'Neural Robotics 101', progress: 85 },
      { title: 'LLM Fine-tuning Masterclass', progress: 40 },
      { title: 'Generative AI for Designers', progress: 100 }
    ],
    badges: [
      { name: 'Fast Learner', icon: 'bolt', color: 'bg-amber-100 text-amber-600' },
      { name: 'AI Explorer', icon: 'explore', color: 'bg-blue-100 text-blue-600' },
      { name: 'Top contributor', icon: 'verified_user', color: 'bg-emerald-100 text-emerald-600' },
      { name: 'Problem Solver', icon: 'psychology', color: 'bg-purple-100 text-purple-600' }
    ]
  };

  const displayUser = { ...defaultUser, ...user };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 text-left">
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1800ad] hover:bg-[#1800ad] hover:text-white transition-all shadow-sm active:scale-95 w-fit"
        >
          <Symbol name="arrow_back" className="text-lg group-hover:-translate-x-1 transition-transform" />
          <span>Back to Community</span>
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[48px] p-10 border border-gray-100 shadow-xl text-center space-y-6">
            <div className="relative inline-block">
               <div className="w-32 h-32 rounded-[40px] overflow-hidden shadow-inner bg-gray-50 ring-8 ring-[#f8f9fc]">
                  <img src={displayUser.photo} className="w-full h-full object-cover" alt={displayUser.name} />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-[#e8ba00] text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border-2 border-white">
                  Level {displayUser.level}
               </div>
            </div>
            
            <div className="space-y-1">
               <h2 className="text-2xl font-display font-bold text-[#1800ad]">{displayUser.name}</h2>
               <p className="text-sm font-bold text-gray-400">{displayUser.username}</p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed px-4">{displayUser.bio}</p>

            <div className="pt-6 border-t border-gray-50 flex flex-col gap-3">
               <a href={displayUser.website} className="flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-[#1800ad] transition-colors justify-center">
                  <Symbol name="language" className="text-lg" /> {displayUser.website.replace('https://', '')}
               </a>
               <a href={`https://${displayUser.linkedin}`} className="flex items-center gap-3 text-xs font-bold text-gray-600 hover:text-[#1800ad] transition-colors justify-center">
                  <Symbol name="link" className="text-lg" /> LinkedIn Profile
               </a>
            </div>
          </div>

          <div className="bg-[#1800ad] rounded-[40px] p-10 text-white space-y-6 shadow-xl relative overflow-hidden group">
            <Symbol name="stars" className="absolute -right-8 -bottom-8 text-[160px] opacity-10 group-hover:scale-110 transition-transform" />
            <div className="space-y-2 relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Quest Progress</p>
               <h3 className="text-3xl font-display font-bold">{displayUser.xp.toLocaleString()} XP</h3>
            </div>
            
            <div className="space-y-3 relative z-10">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>Elite Apprentice</span>
                  <span>{displayUser.nextLevelXp.toLocaleString()} XP</span>
               </div>
               <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(displayUser.xp / displayUser.nextLevelXp) * 100}%` }}
                    className="h-full bg-[#e8ba00]"
                  ></motion.div>
               </div>
               <p className="text-[9px] font-medium opacity-60 italic text-right">Collect {(displayUser.nextLevelXp - displayUser.xp).toLocaleString()} more XP to reach next Level</p>
            </div>
          </div>
        </div>

        {/* Right Column: Courses & Badges */}
        <div className="lg:col-span-8 space-y-10">
          {/* Badges Section */}
      <div className="bg-white rounded-[48px] p-6 md:p-10 border border-gray-100 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-[#1800ad]">Badges Earned</h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{displayUser.badges.length} Collectibles</span>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
               {displayUser.badges.map((badge, i) => (
                 <div key={i} className="flex flex-col items-center space-y-3 p-4 rounded-3xl hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className={`w-14 h-14 ${badge.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                       <Symbol name={badge.icon} className="text-2xl" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-tighter text-center">{badge.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Courses Section */}
      <div className="bg-white rounded-[48px] p-6 md:p-10 border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xl font-display font-bold text-[#1800ad]">Active Learning Tracks</h3>
            <div className="grid grid-cols-1 gap-4">
              {displayUser.courses.map((course, i) => (
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
                  <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1800ad] shadow-sm border border-gray-100 group-hover:bg-[#1800ad] group-hover:text-white transition-all">
                    <Symbol name={course.progress === 100 ? 'check' : 'play_arrow'} className="text-2xl" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
