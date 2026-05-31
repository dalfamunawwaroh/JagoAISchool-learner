import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Symbol } from '../components/ui/Symbol';

interface AuthProps {
  onLogin: () => void;
  onBackToLanding?: () => void;
  initialMode?: 'login' | 'register';
}

export const Auth = ({ onLogin, onBackToLanding, initialMode = 'login' }: AuthProps) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen font-sans selection:bg-[#e8ba00] selection:text-black overflow-hidden bg-white relative">
      {/* Back Button for mobile / global */}
      {onBackToLanding && (
        <button 
          onClick={onBackToLanding}
          className="absolute top-6 left-6 lg:left-auto lg:right-6 flex items-center gap-2 px-4 py-2 bg-[#1800ad]/5 hover:bg-[#1800ad]/10 border border-[#1800ad]/10 rounded-full text-[10px] font-black text-[#1800ad] uppercase tracking-widest transition-all cursor-pointer z-50 shadow-sm hover:scale-105"
        >
          <Symbol name="arrow_back" className="text-sm" />
          <span>Kembali ke Beranda</span>
        </button>
      )}

      {/* 1. LEFT SIDE: VISUAL BRAND */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1800ad] via-[#11007a] to-[#0a0047] relative p-12 xl:p-20 flex-col justify-between overflow-hidden text-left">
        {/* Geometric Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ 
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }}
        ></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#e8ba00]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3"></div>

        {/* Shifting container to the right (ml-auto) for larger screens to avoid empty space when zoomed out */}
        <div className="max-w-md xl:max-w-lg w-full ml-auto h-full flex flex-col justify-between relative z-10 space-y-8 pr-2 xl:pr-6">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Symbol name="cognition" className="text-[#1800ad] text-3xl" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-3xl font-display font-black text-white tracking-tighter leading-none italic">Jago<span className="text-[#e8ba00]">AI</span></span>
              <span className="text-xs font-bold text-white/50 tracking-[0.3em] uppercase mt-1">School</span>
            </div>
          </motion.div>

          {/* Inspirational Text */}
          <div className="text-left space-y-5">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl xl:text-5xl font-display font-bold text-white leading-[1.15] tracking-tight"
            >
              Masuki Masa Depan dengan <span className="text-[#e8ba00]">Pembelajaran AI</span> Interaktif.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="text-white/60 text-sm leading-relaxed max-w-sm"
            >
              Asah keahlian praktis AI Anda melalui kurikulum berbasis projek, interaksi dengan mentor berpengalaman, dan konsultasi privat 1-on-1.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-20 h-1 bg-[#e8ba00] rounded-full"
            ></motion.div>
          </div>

          {/* Premium Core Benefits Tracker */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="w-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-[32px] p-7 space-y-6 shadow-2xl"
          >
            <div className="space-y-1 text-left border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold uppercase text-[#e8ba00] tracking-[0.2em] block">
                SISTEM BELAJAR INTEGRATIF
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">Potensi Maksimal JagoAI</h3>
            </div>

            <div className="space-y-4">
              {/* Benefit Item 1 */}
              <div className="flex gap-4 items-start hover:bg-white/5 p-2.5 rounded-2xl transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Symbol name="menu_book" className="text-lg" />
                </div>
                <div className="space-y-1 text-left flex-1">
                  <h4 className="text-xs font-bold text-white">Kurikulum Industri Mutakhir</h4>
                  <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                    Materi yang dikemas interaktif mencakup Machine Learning, NLP, Computer Vision, dan Generative AI tercanggih saat ini.
                  </p>
                </div>
              </div>

              {/* Benefit Item 2 */}
              <div className="flex gap-4 items-start hover:bg-white/5 p-2.5 rounded-2xl transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#e8ba00]/15 flex items-center justify-center text-[#e8ba00] shrink-0">
                  <Symbol name="workspace_premium" className="text-lg" />
                </div>
                <div className="space-y-1 text-left flex-1">
                  <h4 className="text-xs font-bold text-white">Sertifikat Resmi Kelulusan</h4>
                  <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                    Validasi kompetensi akademis Anda dengan sertifikasi kompetensi industri untuk memperkuat portofolio profesional Anda.
                  </p>
                </div>
              </div>

              {/* Benefit Item 3 */}
              <div className="flex gap-4 items-start hover:bg-white/5 p-2.5 rounded-2xl transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <Symbol name="forum" className="text-lg" />
                </div>
                <div className="space-y-1 text-left flex-1">
                  <h4 className="text-xs font-bold text-white">Bimbingan Tentor Aktif</h4>
                  <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                    Dapatkan bimbingan intensif dari tentor berpengalaman untuk mengulas modul teori hingga pengerjaan projek langsung.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Abstract Brain Graphic */}
        <div className="absolute right-[-10%] bottom-[-10%] opacity-20 hover:opacity-30 transition-opacity">
          <Symbol name="neurology" className="text-[600px] text-white" />
        </div>
      </div>

      {/* 2. RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-12">
          
          {/* Toggle Pills */}
          {authMode !== 'forgot' && (
            <div className="flex justify-center">
              <div className="bg-gray-100 p-1.5 rounded-full flex relative w-64 shadow-inner">
                <motion.div 
                  layout
                  className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-md z-0"
                  animate={{ x: authMode === 'login' ? 0 : '100%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <button 
                  onClick={() => setAuthMode('login')}
                  className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${authMode === 'login' ? 'text-[#1800ad]' : 'text-gray-400'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setAuthMode('register')}
                  className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${authMode === 'register' ? 'text-[#1800ad]' : 'text-gray-400'}`}
                >
                  Register
                </button>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-3">
                  <h2 className="text-4xl font-display font-bold text-gray-900 tracking-tight">Selamat Datang</h2>
                  <p className="text-gray-400 text-sm font-light">Akses kurikulum AI personal Anda.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
                    <div className="relative">
                      <Symbol name="alternate_email" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        placeholder="ahmad@gmail.com" 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1800ad]/10 focus:border-[#1800ad] transition-all outline-none text-sm placeholder:text-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kata Sandi</label>
                      <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] font-bold text-[#e8ba00] uppercase tracking-widest hover:underline">Lupa Kata Sandi?</button>
                    </div>
                    <div className="relative">
                      <Symbol name="lock" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        required
                        className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1800ad]/10 focus:border-[#1800ad] transition-all outline-none text-sm placeholder:text-gray-300 shadow-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <Symbol name={showPassword ? "visibility_off" : "visibility"} className="text-xl" />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#1800ad] text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-[#1800ad]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    LOGIN
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                    <span className="bg-white px-8 text-gray-300">Atau Masuk Dengan</span>
                  </div>
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 py-4 border border-gray-200 rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-50 transition-all group">
                     <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     <span className="text-xs font-bold text-gray-700">Google</span>
                   </button>
                </div>
              </motion.div>
            ) : authMode === 'register' ? (
              <motion.div 
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-3">
                  <h2 className="text-4xl font-display font-bold text-gray-900 tracking-tight">Daftar Akun</h2>
                  <p className="text-gray-400 text-sm font-light">Mulai perjalanan AI Anda hari ini.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Verifikasi akun dikirim ke email Anda.'); setAuthMode('login'); }}>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nama Lengkap</label>
                    <div className="relative">
                      <Symbol name="person" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Ahmad Setiawan" 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1800ad]/10 focus:border-[#1800ad] transition-all outline-none text-sm placeholder:text-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
                    <div className="relative">
                      <Symbol name="alternate_email" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        placeholder="ahmad@gmail.com" 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1800ad]/10 focus:border-[#1800ad] transition-all outline-none text-sm placeholder:text-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Kata Sandi</label>
                    <div className="relative">
                      <Symbol name="lock" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        required
                        className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1800ad]/10 focus:border-[#1800ad] transition-all outline-none text-sm placeholder:text-gray-300 shadow-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <Symbol name={showPassword ? "visibility_off" : "visibility"} className="text-xl" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Konfirmasi Kata Sandi</label>
                    <div className="relative">
                      <Symbol name="lock" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••••••" 
                        required
                        className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1800ad]/10 focus:border-[#1800ad] transition-all outline-none text-sm placeholder:text-gray-300 shadow-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <Symbol name={showConfirmPassword ? "visibility_off" : "visibility"} className="text-xl" />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#e8ba00] text-black rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-[#e8ba00]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Daftar Akun
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="forgot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-3">
                  <h2 className="text-4xl font-display font-bold text-gray-900 tracking-tight">Lupa Kata Sandi?</h2>
                  <p className="text-gray-400 text-sm font-light">Masukkan email Anda untuk instruksi reset.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Link reset password telah dikirim.'); setAuthMode('login'); }}>
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email</label>
                    <div className="relative">
                      <Symbol name="alternate_email" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        placeholder="scholar@university.ac.id" 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#1800ad]/10 focus:border-[#1800ad] transition-all outline-none text-sm placeholder:text-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#1800ad] text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-[#1800ad]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Kirim Link Reset
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setAuthMode('login')}
                    className="w-full text-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1800ad] transition-all"
                  >
                    Kembali ke Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Institutional Note */}
          <div className="pt-10 border-t border-gray-100 space-y-4 text-left transition-colors">
             <div className="flex items-center gap-2 text-[#e8ba00]">
               <Symbol name="info" className="text-lg fill-1" />
               <span className="text-[10px] font-black uppercase tracking-widest">Akses Pendaftaran</span>
             </div>
             <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                Catatan: Akun Tentor dikelola langsung oleh JagoAI. Silakan hubungi <strong>JagoAI</strong> untuk mendaftarkan akun baru atau mendapatkan kredensial internal Anda.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
