import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';

interface SettingsProps {
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
}

export const Settings = ({ language, setLanguage }: SettingsProps) => {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left pb-24">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold text-[#1800ad]">
          {language === 'id' ? 'Pengaturan Akun' : 'Account Settings'}
        </h1>
        <p className="text-sm text-gray-400 font-medium">
          {language === 'id' ? 'Kelola preferensi akun, keamanan, dan notifikasi Anda.' : 'Manage your account preferences, security, and notifications.'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Security Section */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
           <div className="flex items-center gap-3">
              <Symbol name="security" className="text-2xl text-[#1800ad]" />
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'id' ? 'Keamanan & Kata Sandi' : 'Security & Password'}
              </h3>
           </div>
           <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                   {language === 'id' ? 'Kunci Neural (Kata Sandi) Saat Ini' : 'Current Neural Key (Password)'}
                 </label>
                 <input type="password" placeholder="••••••••" className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-gray-900" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                      {language === 'id' ? 'Kata Sandi Baru' : 'New Password'}
                    </label>
                    <input type="password" placeholder="••••••••" className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-gray-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                      {language === 'id' ? 'Konfirmasi Kata Sandi Baru' : 'Confirm New Password'}
                    </label>
                    <input type="password" placeholder="••••••••" className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-gray-900" />
                 </div>
              </div>
              <button 
                onClick={() => alert(language === 'id' ? 'Kata sandi berhasil diperbarui!' : 'Password updated successfully!')}
                className="w-fit px-8 py-4 bg-gray-50 border border-gray-100 text-[#1800ad] hover:bg-[#1800ad] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                {language === 'id' ? 'Update Kata Sandi' : 'Update Password'}
              </button>
           </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
           <div className="flex items-center gap-3">
              <Symbol name="tune" className="text-2xl text-[#1800ad]" />
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'id' ? 'Preferensi Sistem' : 'System Preferences'}
              </h3>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-700">
                      {language === 'id' ? 'Notifikasi Email' : 'Email Notifications'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {language === 'id' ? 'Terima update harian tentang kursus dan diskusi.' : 'Receive daily updates about courses and discussions.'}
                    </p>
                 </div>
                 <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-8 rounded-full transition-all relative cursor-pointer ${notifications ? 'bg-[#1800ad]' : 'bg-gray-400'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-3">
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-700">
                      {language === 'id' ? 'Bahasa Aplikasi' : 'App Language'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {language === 'id' ? 'Pilih bahasa tampilan untuk platform JagoAI School.' : 'Choose the display language for the JagoAI School platform.'}
                    </p>
                 </div>
                 <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => setLanguage('id')}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${language === 'id' ? 'bg-[#1800ad] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
                    >
                      Bahasa Indonesia
                    </button>
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${language === 'en' ? 'bg-[#1800ad] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
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
