import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';

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

  // Toggle Accordion untuk Form Password
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  // Password changing form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPass, setUpdatingPass] = useState(false);

  // State untuk Fitur Baru: Localization & Sync
  const [isCalendarSynced, setIsCalendarSynced] = useState(false);
  const [timezone, setTimezone] = useState('GMT+7');

  // STATE BARU: Privacy & Profile Visibility Options
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  const [showXpOnLeaderboard, setShowXpOnLeaderboard] = useState(true);

  // STATE BARU: AI Learning Assistant Customization
  const [aiInterruptionLevel, setAiInterruptionLevel] = useState('balanced');
  const [aiTonePreference, setAiTonePreference] = useState('peer');

  const handleToggleNotifications = async () => {
    const nextVal = !notifications;
    setNotifications(nextVal);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emailNotifications: nextVal })
      });
      const data = await response.json();
      if (response.ok) setCurrentUser(data.user);
    } catch (err) {
      console.error('Failed to save email notification settings:', err);
    }
  };

  const handleChangeLanguage = async (lang: 'id' | 'en') => {
    setLanguage(lang);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ languagePreference: lang })
      });
      const data = await response.json();
      if (response.ok) setCurrentUser(data.user);
    } catch (err) {
      console.error('Failed to save language preferences:', err);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert(language === 'id' ? 'Tolong lengkapi semua isian sandi.' : 'Please complete all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(language === 'id' ? 'Sandi baru dan konfirmasi tidak sesuai.' : 'New password and confirmation do not match.');
      return;
    }

    setUpdatingPass(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Password update failed');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordFormOpen(false);
      alert(language === 'id' ? 'Kata sandi berhasil diperbarui!' : 'Password updated successfully!');
    } catch (err: any) {
      console.error('Failed to update password:', err);
      alert(err.message || (language === 'id' ? 'Sandi saat ini salah.' : 'Incorrect current password.'));
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
          {language === 'id' ? 'Kelola preferensi akun, keamanan, dan instrumen adaptif Anda.' : 'Manage your account preferences, security, and adaptive instruments.'}
        </p>
      </div>

      <div className="space-y-6">

        {/* 1. PREFERENCES SECTION */}
        <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1800ad]/5 text-[#1800ad] flex items-center justify-center">
              <Symbol name="tune" className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'id' ? 'Preferensi Sistem' : 'System Preferences'}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/40">
              <div className="space-y-1 pr-4">
                <p className="text-sm font-bold text-gray-700">
                  {language === 'id' ? 'Notifikasi Email' : 'Email Notifications'}
                </p>
                <p className="text-[10px] text-gray-400 leading-normal">
                  {language === 'id' ? 'Terima update harian tentang kemajuan tugas kelas dan diskusi forum.' : 'Receive daily updates regarding class assignments progress and forum logs.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleNotifications}
                className="w-14 h-8 rounded-full transition-all relative cursor-pointer border-none shrink-0"
                style={{ backgroundColor: notifications ? '#1800ad' : '#cbd5e1' }}
              >
                <div
                  className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm"
                  style={{ left: notifications ? 'auto' : '4px', right: notifications ? '4px' : 'auto' }}
                ></div>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/40 gap-3">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-700">
                  {language === 'id' ? 'Bahasa Aplikasi' : 'App Language'}
                </p>
                <p className="text-[10px] text-gray-400">
                  {language === 'id' ? 'Pilih bahasa instruksi yang mendominasi antarmuka dasbor Anda.' : 'Pick the instruction language that dominates your dashboard interfaces.'}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleChangeLanguage('id')}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${language === 'id' ? 'bg-[#1800ad] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-200/50 hover:bg-gray-100'}`}
                >
                  Bahasa Indonesia
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeLanguage('en')}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${language === 'en' ? 'bg-[#1800ad] text-white shadow-md' : 'bg-white text-gray-400 border border-gray-200/50 hover:bg-gray-100'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SECURITY SECTION (WITH ACCORDION TOGGLE) */}
        <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1800ad]/5 text-[#1800ad] flex items-center justify-center">
                <Symbol name="security" className="text-xl" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900">
                  {language === 'id' ? 'Keamanan Akun' : 'Account Security'}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {language === 'id' ? 'Kata sandi terakhir diubah baru-baru ini.' : 'Password was last updated recently.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPasswordFormOpen(!isPasswordFormOpen)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-100 hover:border-[#1800ad]/30 text-gray-700 hover:text-[#1800ad] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{isPasswordFormOpen ? (language === 'id' ? 'Tutup Form' : 'Close Form') : (language === 'id' ? 'Perbarui Kata Sandi' : 'Update Password')}</span>
              <Symbol name={isPasswordFormOpen ? "expand_less" : "expand_more"} className="text-base" />
            </button>
          </div>

          <AnimatePresence>
            {isPasswordFormOpen && (
              <motion.form
                onSubmit={handleUpdatePassword}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-gray-50 pt-6 space-y-6 text-left"
              >
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
                    className="w-full px-6 py-4.5 bg-[#f8f9fc] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl text-sm focus:ring-4 focus:ring-[#1800ad]/5 outline-none text-gray-900 font-sans font-semibold transition-all"
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
                      className="w-full px-6 py-4.5 bg-[#f8f9fc] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl text-sm focus:ring-4 focus:ring-[#1800ad]/5 outline-none text-gray-900 font-sans font-semibold transition-all"
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
                      className="w-full px-6 py-4.5 bg-[#f8f9fc] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl text-sm focus:ring-4 focus:ring-[#1800ad]/5 outline-none text-gray-900 font-sans font-semibold transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updatingPass}
                    className="px-6 py-3.5 bg-[#1800ad] hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none"
                  >
                    {updatingPass ? 'Updating...' : (language === 'id' ? 'Simpan Sandi Baru' : 'Save New Password')}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* 3. NEW FITUR: PRIVACY & PROFILE VISIBILITY SECTION */}
        <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1800ad]/5 text-[#1800ad] flex items-center justify-center">
              <Symbol name="visibility" className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'id' ? 'Privasi & Visibilitas' : 'Privacy & Visibility'}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Toggle Profil Publik */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/40">
              <div className="space-y-1 pr-4">
                <p className="text-sm font-bold text-gray-700">
                  {language === 'id' ? 'Profil JagoAI Publik' : 'Public JagoAI Profile'}
                </p>
                <p className="text-[10px] text-gray-400 leading-normal">
                  {language === 'id' ? 'Izinkan sesama murid mencari nama Anda dan melihat isi Achievement Vault Anda.' : 'Allow peer learners to search your credentials and index your Achievement Vault.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfilePublic(!isProfilePublic)}
                className="w-14 h-8 rounded-full transition-all relative cursor-pointer border-none shrink-0"
                style={{ backgroundColor: isProfilePublic ? '#1800ad' : '#cbd5e1' }}
              >
                <div className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm" style={{ left: isProfilePublic ? 'auto' : '4px', right: isProfilePublic ? '4px' : 'auto' }}></div>
              </button>
            </div>

            {/* Toggle Sembunyikan XP di Peringkat */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/40">
              <div className="space-y-1 pr-4">
                <p className="text-sm font-bold text-gray-700">
                  {language === 'id' ? 'Tampilkan XP di Leaderboard' : 'Show XP on Leaderboard'}
                </p>
                <p className="text-[10px] text-gray-400 leading-normal">
                  {language === 'id' ? 'Tampilkan perolehan peringkat koding mingguan Anda di papan skor sekolah.' : 'Publish your computational tracking score on national academy leaderboards.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowXpOnLeaderboard(!showXpOnLeaderboard)}
                className="w-14 h-8 rounded-full transition-all relative cursor-pointer border-none shrink-0"
                style={{ backgroundColor: showXpOnLeaderboard ? '#1800ad' : '#cbd5e1' }}
              >
                <div className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm" style={{ left: showXpOnLeaderboard ? 'auto' : '4px', right: showXpOnLeaderboard ? '4px' : 'auto' }}></div>
              </button>
            </div>
          </div>
        </div>

        {/* 4. NEW FITUR: ADAPTIVE AI LEARNING ASSISTANT ENVIRONMENT SETTINGS */}
        <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1800ad]/5 text-[#1800ad] flex items-center justify-center">
              <Symbol name="psychology" className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'id' ? 'Asisten AI Belajar Adaptif' : 'Adaptive AI Learning Assistant'}
            </h3>
          </div>

          <div className="space-y-4">
            {/* AI Interruption Frequency */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/40 gap-3">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-700">
                  {language === 'id' ? 'Frekuensi Proaktif Agen AI' : 'AI Agent Proactive Frequency'}
                </p>
                <p className="text-[10px] text-gray-400">
                  {language === 'id' ? 'Atur seberapa sering Floating AIChat menyapa atau memberi petunjuk bug otomatis.' : 'Configure how active the helper agent behaves when coding sandbox syntax bugs occur.'}
                </p>
              </div>
              <select
                value={aiInterruptionLevel}
                onChange={(e) => setAiInterruptionLevel(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="high">{language === 'id' ? 'Intensif (Banyak Petunjuk)' : 'Intensive (More Hints)'}</option>
                <option value="balanced">{language === 'id' ? 'Seimbang (Default)' : 'Balanced (Recommended)'}</option>
                <option value="silent">{language === 'id' ? 'Pasif (Hanya jika Di-klik)' : 'Passive Only'}</option>
              </select>
            </div>

            {/* AI Interaction Tone Preference */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/40 gap-3">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-700">
                  {language === 'id' ? 'Gaya Komunikasi AI' : 'AI Communication Persona'}
                </p>
                <p className="text-[10px] text-gray-400">
                  {language === 'id' ? 'Pilih kepribadian asisten robot saat mendampingi pengerjaan lab Python.' : 'Pick the talking tone descriptor for model parameters correction logs.'}
                </p>
              </div>
              <select
                value={aiTonePreference}
                onChange={(e) => setAiTonePreference(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="peer">{language === 'id' ? 'Rekan Belajar Sederajat' : 'Supportive Peer Collaborator'}</option>
                <option value="lecturer">{language === 'id' ? 'Dosen Senior Formal' : 'Formal Senior Professor'}</option>
              </select>
            </div>

            {/* Reset Memory Button */}
            <div className="flex items-center justify-between p-4 bg-[#fff1f2] border border-rose-100 rounded-2xl">
              <div className="space-y-0.5 pr-4 text-left">
                <p className="text-sm font-bold text-rose-900">{language === 'id' ? 'Reset Memori Obrolan AI' : 'Reset AI Chat Context Memory'}</p>
                <p className="text-[10px] text-rose-500">{language === 'id' ? 'Hapus riwayat personalisasi percakapan asisten robot dari awal.' : 'Purge customized context parameters tokens completely.'}</p>
              </div>
              <button
                type="button"
                onClick={() => alert('Konteks memori asisten AI berhasil dibersihkan.')}
                className="px-3.5 py-2 bg-white hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm"
              >
                {language === 'id' ? 'Bersihkan' : 'Purge Log'}
              </button>
            </div>
          </div>
        </div>

        {/* 5. NEW FITUR: LINKED PAYMENT METHODS & WALLETS */}
        <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1800ad]/5 text-[#1800ad] flex items-center justify-center">
              <Symbol name="payments" className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'id' ? 'Metode Pembayaran Terhubung' : 'Linked Checkout Channels'}
            </h3>
          </div>

          <div className="space-y-3">
            {/* Wallet Item */}
            <div className="p-4 bg-gray-50 border border-gray-100/50 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100"><Symbol name="account_balance_wallet" className="text-xl" /></div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-black text-gray-800 block">GoPay Indonesia</span>
                  <span className="text-[10px] text-[#1800ad] font-bold mt-1 block">0812-****-4321</span>
                </div>
              </div>
              <span className="text-[8px] font-black tracking-widest uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded">CONNECTED</span>
            </div>

            {/* Virtual Invoice Shortcut */}
            <div className="p-4 bg-gray-50 border border-gray-100/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-gray-800">{language === 'id' ? 'Riwayat Transaksi & Dokumen Invoice' : 'Checkout Billing Statements'}</p>
                <p className="text-[10px] text-gray-400">{language === 'id' ? 'Unduh salinan bukti transaksi untuk kebutuhan reimburse beasiswa/sekolah.' : 'Download transactional tokens copies for institutional corporate reimbursements.'}</p>
              </div>
              <button
                type="button"
                onClick={() => alert('Membuka file log invoice...')}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:border-[#1800ad]/30 text-gray-700 hover:text-[#1800ad] rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer shrink-0 shadow-sm"
              >
                {language === 'id' ? 'Lihat Semua' : 'View History'}
              </button>
            </div>
          </div>
        </div>

        {/* 6. LOCALIZATION & TIMING */}
        <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1800ad]/5 text-[#1800ad] flex items-center justify-center">
              <Symbol name="schedule" className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'id' ? 'Lokalisasi & Jadwal Kelas' : 'Localization & Academy Schedule'}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/40 gap-3">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-700">
                  {language === 'id' ? 'Zona Waktu Sesi Mentor' : 'Mentor Session Timezone'}
                </p>
                <p className="text-[10px] text-gray-400">
                  {language === 'id' ? 'Menyelaraskan kalender konferensi tatap muka bersama mentor.' : 'Align video coaching calendars precisely with expert mentor schedules.'}
                </p>
              </div>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none cursor-pointer"
              >
                <option value="GMT+7">WIB - Asia/Jakarta (GMT+07:00)</option>
                <option value="GMT+8">WITA - Asia/Makassar (GMT+08:00)</option>
                <option value="GMT+9">WIT - Asia/Jayapura (GMT+09:00)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/40">
              <div className="space-y-1 pr-4">
                <p className="text-sm font-bold text-gray-700">
                  {language === 'id' ? 'Sinkronisasi Google Calendar' : 'Google Calendar Synchronization'}
                </p>
                <p className="text-[10px] text-gray-400 leading-normal">
                  {language === 'id' ? 'Otomatis masukkan jadwal kuis sandbox dan deadline modul ke kalender Google.' : 'Push project sandbox assignments and quiz deadlines directly to personal Google feeds.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarSynced(!isCalendarSynced)}
                className="w-14 h-8 rounded-full transition-all relative cursor-pointer border-none shrink-0"
                style={{ backgroundColor: isCalendarSynced ? '#1800ad' : '#cbd5e1' }}
              >
                <div className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm" style={{ left: isCalendarSynced ? 'auto' : '4px', right: isCalendarSynced ? '4px' : 'auto' }}></div>
              </button>
            </div>
          </div>
        </div>

        {/* 7. ACTIVE DEVICES SESSIONS */}
        <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-sm space-y-8 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1800ad]/5 text-[#1800ad] flex items-center justify-center">
              <Symbol name="devices" className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'id' ? 'Sesi Perangkat Aktif' : 'Active Devices Sessions'}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-gray-50 border border-gray-100/50 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-emerald-600 flex items-center"><Symbol name="laptop_windows" className="text-2xl" /></div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-gray-800 block">Windows PC • Bandung, Indonesia</span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 block"></span>
                    {language === 'id' ? 'Perangkat Ini (Aktif)' : 'This Device (Active Now)'}
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-mono bg-gray-200/60 px-2.5 py-1 rounded font-bold text-gray-400">Chrome</span>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-100/50 rounded-2xl flex items-center justify-between gap-4 opacity-75">
              <div className="flex items-center gap-3">
                <div className="text-gray-500 flex items-center"><Symbol name="smartphone" className="text-2xl" /></div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-gray-800 block">iPhone 15 Pro • Jakarta, Indonesia</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Logged in: 2 days ago</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Sesi perangkat lain berhasil dihentikan.')}
                className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 rounded-xl text-[9px] font-black uppercase tracking-wider text-gray-500 transition-colors cursor-pointer shrink-0"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>

        {/* 8. DANGER ZONE ACCENT */}
        <div className="pt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              const confirmDelete = confirm(language === 'id' ? 'Apakah Anda yakin ingin menghapus akun JagoAI School Anda secara permanen? Semua XP dan progress modul akan hilang.' : 'Are you sure you want to delete your JagoAI School account permanently? All XPs and modules log records will be destroyed.');
              if (confirmDelete) alert('Prosedur penghapusan akun berhasil diajukan ke tim JagoAI.');
            }}
            className="px-6 py-3.5 bg-white border border-red-100 hover:bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            {language === 'id' ? 'Hapus Akun Permanen' : 'Delete Account Permanently'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;