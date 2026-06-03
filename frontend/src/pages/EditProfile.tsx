import React, { useState, useEffect, useRef } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';

interface EditProfileProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
}

export const EditProfile = ({ currentUser, setCurrentUser }: EditProfileProps) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150');
  const [saving, setSaving] = useState(false);

  // State Manajemen Kamera & Upload Berkas
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Ref elemen DOM untuk hardware stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setWebsiteUrl(currentUser.website_url || currentUser.websiteUrl || '');
      setLinkedinUrl(currentUser.linkedin_url || currentUser.linkedinUrl || '');
      setAvatarUrl(currentUser.avatar_url || currentUser.avatarUrl || 'https://i.pravatar.cc/150');
    }
  }, [currentUser]);

  // Fungsi mematikan hardware lensa kamera
  const stopCamera = (streamToStop = cameraStream) => {
    if (streamToStop) {
      streamToStop.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
  };

  // 1. FUNGSI MENYALAKAN KAMERA & MEMBUKA MODAL POPUP
  const startCamera = async () => {
    setIsCameraModalOpen(true);
    try {
      // Mengaktifkan kamera dengan resolusi aspect ratio kotak yang tajam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 640, facingMode: 'user' },
        audio: false,
      });
      setCameraStream(stream);

      // Mengaitkan stream ke elemen video HTML secara asinkronus (menunggu modal render)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Error accessing hardware camera device:', err);
      alert('Gagal mengakses kamera. Pastikan izin kamera telah diaktifkan di browser Anda.');
      setIsCameraModalOpen(false);
    }
  };

  // 2. FUNGSI JEPRET FOTO (CAPTURE CANVAS)
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Efek mirror agar hasil tangkapan sama seperti apa yang dilihat user di layar
        ctx.translate(500, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(videoRef.current, 0, 0, 500, 500);
        const base64Image = canvas.toDataURL('image/jpeg', 0.9);
        setAvatarUrl(base64Image);
        stopCamera();
      }
    }
  };

  // 3. FUNGSI UNGGAH BERKAS LOKAL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal batas ukuran berkas adalah 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      alert('Full name and username are required.');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          username,
          bio,
          websiteUrl,
          linkedinUrl,
          avatarUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal memperbarui profil.');

      setCurrentUser(data.user);
      alert('Profil JagoAI Anda berhasil diperbarui di database!');
    } catch (err: any) {
      console.error('Failed to update profile data parameters:', err);
      alert(err.message || 'Gagal menyimpan profil.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (currentUser) {
      setFullName(currentUser.full_name || currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setWebsiteUrl(currentUser.website_url || currentUser.websiteUrl || '');
      setLinkedinUrl(currentUser.linkedin_url || currentUser.linkedinUrl || '');
      setAvatarUrl(currentUser.avatar_url || currentUser.avatarUrl || 'https://i.pravatar.cc/150');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left relative">

      {/* HEADER TITLE */}
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold text-[#1800ad]">Edit Profile</h1>
        <p className="text-sm text-gray-400 font-medium">Perbarui profil publik Anda dan cara orang melihat Anda di komunitas.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-[48px] p-6 md:p-14 border border-gray-100 shadow-xl space-y-12 transition-all">

        {/* AVATAR INTERFACE SECTION */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-inner bg-gray-50 ring-4 ring-gray-50 flex items-center justify-center">
              <img src={avatarUrl} className="w-full h-full object-cover" alt="Profile View" />
            </div>
            <button
              type="button"
              onClick={startCamera}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1800ad] text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border-none"
              title="Buka Kamera"
            >
              <Symbol name="photo_camera" className="text-lg" />
            </button>
          </div>

          <div className="space-y-4 text-center md:text-left w-full">
            <h4 className="text-lg font-bold text-[#1800ad]">Foto Profil Anda</h4>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />

            <p className="text-xs text-gray-400 max-w-xs leading-relaxed mx-auto md:mx-0">
              Ambil foto instan memakai kamera perangkat atau unggah berkas gambar lokal (PNG/JPG, Maksimal 2MB).
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button
                type="button"
                onClick={startCamera}
                className="px-5 py-3 bg-[#1800ad] text-white hover:bg-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer flex items-center gap-1.5"
              >
                <Symbol name="videocam" className="text-sm" />
                Ambil Kamera
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Symbol name="upload" className="text-sm" />
                Unggah Berkas
              </button>
              <button
                type="button"
                onClick={() => setAvatarUrl('https://i.pravatar.cc/150')}
                className="px-5 py-3 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all border-none cursor-pointer"
              >
                Hapus Foto
              </button>
            </div>
          </div>
        </div>

        {/* INPUT FIELDS REGION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Nama Lengkap</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-6 md:px-8 py-4.5 bg-[#f8f9fc] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl text-sm focus:ring-4 focus:ring-[#1800ad]/5 outline-none transition-all font-semibold text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 md:px-8 py-4.5 bg-[#f8f9fc] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl text-sm focus:ring-4 focus:ring-[#1800ad]/5 outline-none transition-all font-semibold text-slate-800"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Mini Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ceritakan sedikit tentang ketertarikan AI Anda..."
              className="w-full px-6 md:px-8 py-5 bg-[#f8f9fc] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl text-sm focus:ring-4 focus:ring-[#1800ad]/5 outline-none h-32 transition-all resize-none font-medium text-slate-700 leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Personal Website</label>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-6 md:px-8 py-4.5 bg-[#f8f9fc] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl text-sm focus:ring-4 focus:ring-[#1800ad]/5 outline-none transition-all font-medium text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">LinkedIn Profile</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-6 md:px-8 py-4.5 bg-[#f8f9fc] border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl text-sm focus:ring-4 focus:ring-[#1800ad]/5 outline-none transition-all font-medium text-slate-700"
            />
          </div>
        </div>

        {/* BOTTOM FORM BUTTONS */}
        <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 order-2 sm:order-1 transition-colors border-none bg-transparent cursor-pointer"
          >
            Batalkan Perubahan
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-10 py-4.5 bg-[#1800ad] disabled:bg-gray-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/10 order-1 sm:order-2 border-none cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            {saving && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            <span>{saving ? 'Menyimpan...' : 'Simpan Profil'}</span>
          </button>
        </div>
      </form>

      {/* 4. PREMIUM FULL SCREEN OVERLAY INTERACTIVE CAMERA MODAL */}
      <AnimatePresence>
        {isCameraModalOpen && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
            {/* Dark glassmorphism blur backdrop backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => stopCamera()}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Box Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-6 overflow-hidden border border-gray-100 flex flex-col space-y-6 text-center z-10"
            >
              {/* Modal Top Row Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 font-mono">Live Camera Capturer</h3>
                </div>
                <button
                  type="button"
                  onClick={() => stopCamera()}
                  className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-all border-none cursor-pointer"
                >
                  <Symbol name="close" className="text-lg" />
                </button>
              </div>

              {/* Layout Layar Lensa Kamera Besar */}
              <div className="relative aspect-square w-full rounded-[28px] overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />

                {/* Garis Bantu Lingkaran Tipis biar Wajah User pas di tengah */}
                <div className="absolute inset-0 border-[36px] border-black/30 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full border-2 border-white/50 border-dashed"></div>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 font-medium leading-relaxed px-2">
                Posisikan wajah Anda di dalam area lingkaran garis bantu, lalu tekan tombol ambil gambar di bawah.
              </p>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => stopCamera()}
                  className="py-3.5 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all border-none cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="py-3.5 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/10 transition-all border-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Symbol name="add_a_photo" className="text-sm" />
                  Ambil Foto
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};