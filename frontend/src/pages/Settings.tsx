import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { authService } from '../services/api';

interface SettingsProps {
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

export const Settings = ({ language, setLanguage, currentUser, setCurrentUser }: SettingsProps) => {
  const [notifications, setNotifications] = useState(
    currentUser?.emailNotifications !== undefined ? Boolean(currentUser.emailNotifications) : true
  );

  // Password changing form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPass, setUpdatingPass] = useState(false);

  const handleToggleNotifications = async () => {
    const nextVal = !notifications;
    setNotifications(nextVal);
    try {
      const res = await authService.updateSettings({
        emailNotifications: nextVal
      });
      setCurrentUser(res.user);
    } catch (err) {
      console.error('Failed to save email notification settings:', err);
    }
  };

  const handleChangeLanguage = async (lang: 'id' | 'en') => {
    setLanguage(lang);
    try {
      const res = await authService.updateSettings({
        languagePreference: lang
      });
      setCurrentUser(res.user);
    } catch (err) {
      console.error('Failed to save language preferences:', err);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Tolong lengkapi semua isian sandi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Sandi baru dan konfirmasi tidak sesuai.');
      return;
    }

    setUpdatingPass(true);
    try {
      await authService.updateSettings({
        currentPassword,
        newPassword
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert(language === 'id' ? 'Kata sandi berhasil diperbarui!' : 'Password updated successfully!');
    } catch (err: any) {
      console.error('Failed to update password:', err);
      alert(err.message || 'Sandi saat ini salah.');
    } finally {
      setUpdatingPass(false);
    }
  };

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
        <form onSubmit={handleUpdatePassword} className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
           <div className="flex items-center gap-3">
              <Symbol name="security" className="text-2xl text-[#1800ad]" />
              <h3 className="text-xl font-bold text-gray-900">
                {language === 'id' ? 'Keamanan & Kata Sandi' : 'Security & Password'}
              </h3>
           </div>
           <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                   {language === 'id' ? 'Kata Sandi Saat Ini' : 'Current Password'}
                 </label>
                 <input 
                   type="password" 
                   required
                   placeholder="••••••••" 
                   value={currentPassword}
                   onChange={(e) => setCurrentPassword(e.target.value)}
                   className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-gray-900 font-sans" 
                 />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                      {language === 'id' ? 'Kata Sandi Baru' : 'New Password'}
                    </label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-gray-900 font-sans" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                      {language === 'id' ? 'Konfirmasi Kata Sandi Baru' : 'Confirm New Password'}
                    </label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none text-gray-900 font-sans" 
                    />
                 </div>
              </div>
              <button 
                type="submit"
                disabled={updatingPass}
                className="w-fit px-8 py-4 bg-gray-50 hover:bg-[#1800ad] text-[#1800ad] hover:text-white disabled:bg-gray-200 disabled:text-gray-400 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                {updatingPass ? 'Updating...' : (language === 'id' ? 'Update Kata Sandi' : 'Update Password')}
              </button>
           </div>
        </form>

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
                  onClick={handleToggleNotifications}
                  className={`w-14 h-8 rounded-full transition-all relative cursor-pointer border-none`}
                  style={{ backgroundColor: notifications ? '#1800ad' : '#cbd5e1' }}
                 >
                    <div 
                      className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all"
                      style={{ left: notifications ? 'auto' : '4px', right: notifications ? '4px' : 'auto' }}
                    ></div>
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
                      onClick={() => handleChangeLanguage('id')}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${language === 'id' ? 'bg-[#1800ad] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
                    >
                      Bahasa Indonesia
                    </button>
                    <button 
                      onClick={() => handleChangeLanguage('en')}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${language === 'en' ? 'bg-[#1800ad] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-100'}`}
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

export default Settings;
