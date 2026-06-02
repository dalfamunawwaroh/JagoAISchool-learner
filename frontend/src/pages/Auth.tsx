import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Symbol } from '../components/ui/Symbol';
import { authService, setToken } from '../services/api';

interface AuthProps {
  onLogin: (user: any) => void;
  onBackToLanding?: () => void;
  initialMode?: 'login' | 'register' | 'forgot' | 'reset';
}

export const Auth = ({ onLogin, onBackToLanding, initialMode = 'login' }: AuthProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password & reset states
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form states
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await authService.login({
        email: loginEmail,
        password: loginPassword
      });
      setToken(res.token);
      onLogin(res.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal login. Periksa kembali email dan password Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await authService.register({
        fullName: regFullName,
        email: regEmail,
        username: regUsername.startsWith('@') ? regUsername : `@${regUsername}`,
        password: regPassword
      });
      setToken(res.token);
      setSuccessMessage('Registrasi Berhasil! Selamat datang di JagoAI School.');
      setTimeout(() => {
        onLogin(res.user);
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftar. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await authService.forgotPassword(forgotEmail);
      setSuccessMessage(res.message || 'Link reset password telah dikirim ke email Anda.');
      setForgotEmail('');
      setTimeout(() => {
        setAuthMode('login');
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengajukan reset password. Periksa kembali email Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Konfirmasi password baru tidak cocok');
      setIsSubmitting(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setErrorMessage('Token reset password tidak ditemukan di URL. Silakan ajukan kembali.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await authService.resetPassword({ token, newPassword });
      setSuccessMessage(res.message || 'Kata sandi Anda telah berhasil diubah! Silakan masuk.');
      
      // Clean query parameters to prevent re-submitting with expired token
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setTimeout(() => {
        setAuthMode('login');
        setSuccessMessage(null);
        setNewPassword('');
        setConfirmNewPassword('');
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengubah kata sandi. Token mungkin sudah kedaluwarsa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans selection:bg-[#e8ba00] selection:text-black overflow-hidden bg-slate-50 relative">
      {/* Back Button for mobile / global */}
      {onBackToLanding && (
        <button 
          onClick={onBackToLanding}
          className="absolute top-6 left-6 lg:left-auto lg:right-8 flex items-center gap-2.5 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full text-[10px] font-black text-slate-700 hover:text-[#1800ad] uppercase tracking-widest transition-all cursor-pointer z-50 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 group"
        >
          <Symbol name="arrow_back" className="text-sm transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Beranda</span>
        </button>
      )}

      {/* 1. LEFT SIDE: VISUAL BRAND */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1800ad] via-[#11007a] to-[#07003b] relative p-12 xl:p-20 flex-col justify-between overflow-hidden text-left border-r border-slate-100">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[8s]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#e8ba00]/10 blur-[180px] rounded-full pointer-events-none animate-pulse duration-[12s]" />

        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="tech-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tech-grid)" />
          </svg>
        </div>

        <div className="max-w-xl xl:max-w-2xl w-full mx-auto h-full flex flex-col justify-between relative z-10 space-y-10 py-4">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3.5"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-[#1800ad]/30">
              <Symbol name="cognition" className="text-[#1800ad] text-3xl" fill />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-3xl font-display font-black text-white tracking-tighter leading-none italic">Jago<span className="text-[#e8ba00]">AI</span></span>
              <span className="text-xs font-bold text-white/40 tracking-[0.3em] uppercase mt-1">School</span>
            </div>
          </motion.div>

          {/* Inspirational Text */}
          <div className="text-left space-y-6">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl xl:text-5xl font-display font-black text-white leading-[1.15] tracking-tight"
            >
              Masuki Masa Depan dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8ba00] to-[#ffd73b]">Pembelajaran AI</span> Interaktif.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="text-white/70 text-sm leading-relaxed max-w-lg"
            >
              Asah keahlian praktis AI Anda melalui kurikulum berbasis projek, interaksi dengan mentor berpengalaman, dan konsultasi privat 1-on-1.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-24 h-[3px] bg-gradient-to-r from-[#e8ba00] to-[#ffd73b] rounded-full"
            ></motion.div>
          </div>

          {/* Premium Core Benefits Tracker */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] rounded-[32px] p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8ba00]/60 to-transparent" />
            
            <div className="space-y-1 text-left border-b border-white/[0.08] pb-4">
              <span className="text-[10px] font-bold uppercase text-[#e8ba00] tracking-[0.25em] block">
                SISTEM BELAJAR INTEGRATIF
              </span>
              <h3 className="text-xl font-display font-bold text-white tracking-tight">Potensi Maksimal JagoAI</h3>
            </div>

            <div className="grid gap-4">
              <div className="flex gap-4 items-start bg-white/[0.01] hover:bg-white/[0.05] border border-white/[0.02] hover:border-white/[0.1] p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Symbol name="menu_book" className="text-xl text-[#e8ba00]" />
                </div>
                <div className="space-y-1 text-left flex-1">
                  <h4 className="text-sm font-bold text-white tracking-wide">Kurikulum Industri Mutakhir</h4>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Materi yang dikemas interaktif mencakup Machine Learning, NLP, Computer Vision, dan Generative AI tercanggih saat ini.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-white/[0.01] hover:bg-white/[0.05] border border-white/[0.02] hover:border-white/[0.1] p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Symbol name="workspace_premium" className="text-xl text-[#ffd73b]" />
                </div>
                <div className="space-y-1 text-left flex-1">
                  <h4 className="text-sm font-bold text-white tracking-wide">Sertifikat Resmi Kelulusan</h4>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Validasi kompetensi akademis Anda dengan sertifikasi kompetensi industri untuk memperkuat portofolio profesional Anda.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-white/[0.01] hover:bg-white/[0.05] border border-white/[0.02] hover:border-white/[0.1] p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Symbol name="forum" className="text-xl text-emerald-400" />
                </div>
                <div className="space-y-1 text-left flex-1">
                  <h4 className="text-sm font-bold text-white tracking-wide">Bimbingan Tentor Aktif</h4>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Dapatkan bimbingan intensif dari tentor berpengalaman untuk mengulas modul teori hingga pengerjaan projek langsung.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute right-[-10%] bottom-[-10%] opacity-10 pointer-events-none select-none">
          <Symbol name="neurology" className="text-[600px] text-white" />
        </div>
      </div>

      {/* 2. RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-16 lg:p-20 bg-white relative overflow-y-auto min-h-screen">
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-[#1800ad]/3 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] bg-[#e8ba00]/2 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-xl space-y-10 relative z-10 p-2 sm:p-6 md:p-10">
          
          {/* Toggle Pills */}
          {!['forgot', 'reset'].includes(authMode) && (
            <div className="flex justify-center">
              <div className="bg-slate-100/80 border border-slate-200/30 p-1.5 rounded-full flex relative w-64 shadow-inner">
                <motion.div 
                  layout
                  className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-[#1800ad] to-[#3a20e2] rounded-full shadow-md z-0"
                  animate={{ x: authMode === 'login' ? 0 : '100%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <button 
                  onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
                  className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${authMode === 'login' ? 'text-white' : 'text-slate-400 hover:text-slate-800'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
                  className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${authMode === 'register' ? 'text-white' : 'text-slate-400 hover:text-slate-800'}`}
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* Rich Notification System */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-red-50 border border-red-100/80 p-5 rounded-2xl text-left text-xs font-semibold text-red-650 flex items-start gap-4 shadow-lg shadow-red-500/5 backdrop-blur-md relative overflow-hidden transition-all duration-300"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 to-rose-600"></div>
                <div className="p-2 rounded-xl bg-red-100/50 text-red-600 shrink-0">
                  <Symbol name="error" className="text-xl text-red-650 fill-1" fill />
                </div>
                <div className="space-y-1 py-0.5">
                  <h4 className="font-display font-black text-[10px] uppercase tracking-widest text-red-700">Aktivitas Gagal</h4>
                  <p className="font-medium text-xs leading-relaxed text-red-600/90">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-emerald-50 border border-emerald-100/80 p-5 rounded-2xl text-left text-xs font-semibold text-emerald-650 flex items-start gap-4 shadow-lg shadow-emerald-500/5 backdrop-blur-md relative overflow-hidden transition-all duration-300"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-600"></div>
                <div className="p-2 rounded-xl bg-emerald-100/50 text-emerald-600 shrink-0">
                  <Symbol name="verified" className="text-xl text-emerald-650 fill-1" fill />
                </div>
                <div className="space-y-1 py-0.5">
                  <h4 className="font-display font-black text-[10px] uppercase tracking-widest text-emerald-750">Aktivitas Berhasil</h4>
                  <p className="font-medium text-xs leading-relaxed text-emerald-600/90">{successMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-display font-black text-slate-800 tracking-tight">Selamat Datang</h2>
                  <p className="text-slate-400 text-sm font-medium">Akses kurikulum AI personal Anda.</p>
                </div>

                <form className="space-y-5" onSubmit={handleLoginSubmit}>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative group">
                      <Symbol name="alternate_email" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type="email" 
                        placeholder="ahmad@gmail.com" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-5 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kata Sandi</label>
                      <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] font-bold text-[#e8ba00] uppercase tracking-widest hover:underline cursor-pointer">Lupa Kata Sandi?</button>
                    </div>
                    <div className="relative group">
                      <Symbol name="lock" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-12 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <Symbol name={showPassword ? "visibility_off" : "visibility"} className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-gradient-to-r from-[#1800ad] to-[#3a20e2] text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-[#1800ad]/15 hover:shadow-[#1800ad]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'MEMPROSES...' : 'LOGIN'}
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                    <span className="bg-white px-5 text-slate-300">Atau Masuk Dengan</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-3.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl flex items-center justify-center gap-3.5 transition-all cursor-pointer group">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 group-hover:scale-115 transition-transform" />
                    <span className="text-xs font-bold text-slate-700">Google</span>
                  </button>
                </div>
              </motion.div>
            ) : authMode === 'register' ? (
              <motion.div 
                key="register"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-display font-black text-slate-800 tracking-tight">Daftar Akun</h2>
                  <p className="text-slate-400 text-sm font-medium">Mulai perjalanan AI Anda hari ini.</p>
                </div>

                <form className="space-y-5" onSubmit={handleRegisterSubmit}>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <div className="relative group">
                      <Symbol name="person" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Ahmad Setiawan" 
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        required
                        className="w-full pl-12 pr-5 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative group">
                      <Symbol name="alternate_email" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type="email" 
                        placeholder="ahmad@gmail.com" 
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-5 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                    <div className="relative group">
                      <Symbol name="alternate_email" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type="text" 
                        placeholder="ahmad_setiawan" 
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        required
                        className="w-full pl-12 pr-5 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kata Sandi</label>
                    <div className="relative group">
                      <Symbol name="lock" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-12 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <Symbol name={showPassword ? "visibility_off" : "visibility"} className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Kata Sandi</label>
                    <div className="relative group">
                      <Symbol name="lock" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-12 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-455 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <Symbol name={showConfirmPassword ? "visibility_off" : "visibility"} className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-gradient-to-r from-[#e8ba00] to-[#ffd73b] text-slate-950 rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-[#e8ba00]/15 hover:shadow-[#e8ba00]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'MENDAFTAR...' : 'DAFTAR AKUN'}
                  </button>
                </form>
              </motion.div>
            ) : authMode === 'forgot' ? (
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-display font-black text-slate-800 tracking-tight">Lupa Sandi?</h2>
                  <p className="text-slate-400 text-sm font-medium">Masukkan email Anda untuk instruksi reset.</p>
                </div>

                <form className="space-y-5" onSubmit={handleForgotSubmit}>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative group">
                      <Symbol name="alternate_email" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type="email" 
                        placeholder="scholar@university.ac.id" 
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-12 pr-5 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-gradient-to-r from-[#1800ad] to-[#3a20e2] text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-[#1800ad]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'MENGIRIM...' : 'Kirim Link Reset'}
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
                    className="w-full text-center text-[10px] font-black text-[#1800ad] hover:text-[#3a20e2] uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Kembali ke Login
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="reset"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-display font-black text-slate-800 tracking-tight">Atur Ulang Sandi</h2>
                  <p className="text-slate-400 text-sm font-medium">Buat kata sandi baru untuk mengamankan akun Anda.</p>
                </div>

                <form className="space-y-5" onSubmit={handleResetSubmit}>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kata Sandi Baru</label>
                    <div className="relative group">
                      <Symbol name="lock" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-12 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <Symbol name={showPassword ? "visibility_off" : "visibility"} className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Kata Sandi Baru</label>
                    <div className="relative group">
                      <Symbol name="lock" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1800ad] transition-colors" />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-12 py-4 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-100 hover:border-slate-200/80 focus:border-[#1800ad] rounded-2xl focus:ring-4 focus:ring-[#1800ad]/8 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-300 shadow-inner"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        <Symbol name={showConfirmPassword ? "visibility_off" : "visibility"} className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-gradient-to-r from-[#1800ad] to-[#3a20e2] text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-[#1800ad]/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'MENYIMPAN...' : 'SIMPAN SANDI BARU'}
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
                    className="w-full text-center text-[10px] font-black text-[#1800ad] hover:text-[#3a20e2] uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Kembali ke Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Institutional Note */}
          <div className="pt-8 border-t border-slate-100 space-y-3.5 text-left transition-colors">
            <div className="flex items-center gap-2.5 text-[#e8ba00]">
              <Symbol name="info" className="text-lg fill-1" />
              <span className="text-[10px] font-black uppercase tracking-widest">Akses Pendaftaran</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Catatan: Akun Tentor dikelola langsung oleh JagoAI. Silakan hubungi <strong>JagoAI</strong> untuk mendaftarkan akun baru atau mendapatkan kredensial internal Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
