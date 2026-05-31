import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';

interface SettingsProps {
}

export const Settings = ({ }: SettingsProps) => {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold text-[#1800ad]">Account Settings</h1>
        <p className="text-sm text-gray-400 font-medium">Kelola preferensi akun, keamanan, dan notifikasi Anda.</p>
      </div>

      <div className="space-y-6">
        {/* Security Section */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
           <div className="flex items-center gap-3">
              <Symbol name="security" className="text-2xl text-[#1800ad]" />
              <h3 className="text-xl font-bold text-gray-900">Keamanan & Kata Sandi</h3>
           </div>
           <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Kunci Neural (Kata Sandi) Saat Ini</label>
                 <input type="password" placeholder="••••••••" className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-gray-900" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Kata Sandi Baru</label>
                    <input type="password" placeholder="••••••••" className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-gray-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Konfirmasi Kata Sandi Baru</label>
                    <input type="password" placeholder="••••••••" className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-gray-900" />
                 </div>
              </div>
              <button className="w-fit px-8 py-4 bg-gray-50 border border-gray-100 text-[#1800ad] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1800ad] hover:text-white transition-all">Update Kata Sandi</button>
           </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
           <div className="flex items-center gap-3">
              <Symbol name="tune" className="text-2xl text-[#1800ad]" />
              <h3 className="text-xl font-bold text-gray-900">Preferensi Sistem</h3>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-700">Notifikasi Email</p>
                    <p className="text-[10px] text-gray-400">Terima update harian tentang kursus dan diskusi.</p>
                 </div>
                 <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-8 rounded-full transition-all relative ${notifications ? 'bg-[#1800ad]' : 'bg-gray-400'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-3">
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-700">Bahasa Aplikasi (Language)</p>
                    <p className="text-[10px] text-gray-400">Pilih bahasa tampilan untuk platform JagoAI School.</p>
                 </div>
                 <div className="flex items-center gap-2 shrink-0">
                   <button 
                     onClick={() => setLanguage('id')}
                     className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === 'id' ? 'bg-[#1800ad] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
                   >
                     Bahasa Indonesia
                   </button>
                   <button 
                     onClick={() => setLanguage('en')}
                     className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === 'en' ? 'bg-[#1800ad] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
                   >
                     English
                   </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
