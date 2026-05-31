import React from 'react';
import { Symbol } from '../components/ui/Symbol';

export const EditProfile = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 text-left">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold text-[#1800ad]">Edit Profile</h1>
        <p className="text-sm text-gray-400 font-medium">Perbarui profil publik Anda dan cara orang melihat Anda di komunitas.</p>
      </div>

      <div className="bg-white rounded-[48px] p-6 md:p-14 border border-gray-100 shadow-xl space-y-12 transition-all">
        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
           <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-inner bg-gray-100 ring-4 ring-white">
                 <img src="https://i.pravatar.cc/200?u=as" className="w-full h-full object-cover" alt="Profile" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1800ad] text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                 <Symbol name="photo_camera" className="text-lg" />
              </button>
           </div>
           <div className="space-y-4 text-center md:text-left">
              <h4 className="text-lg font-bold text-[#1800ad]">Foto Profil Anda</h4>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed mx-auto md:mx-0">Disarankan ukuran 400x400px. Mendukung format JPG, PNG, atau GIF.</p>
              <div className="flex justify-center md:justify-start gap-4">
                 <button className="px-6 py-3 bg-[#1800ad] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Upload New</button>
                 <button className="px-6 py-3 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">Remove</button>
              </div>
           </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Nama Lengkap</label>
              <input type="text" defaultValue="Aris Setiawan" className="w-full px-6 md:px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none transition-all" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Username</label>
              <input type="text" defaultValue="@aris_ai" className="w-full px-6 md:px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none transition-all" />
           </div>
           <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Mini Bio</label>
              <textarea defaultValue="AI Visionary at JagoAI Academy. Passionate about Generative AI and Human-Computer Interaction." className="w-full px-6 md:px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none h-32 transition-all resize-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Personal Website</label>
              <input type="text" placeholder="https://yourwebsite.com" className="w-full px-6 md:px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none transition-all" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">LinkedIn Profile</label>
              <input type="text" placeholder="https://linkedin.com/in/aris" className="w-full px-6 md:px-8 py-5 bg-[#f8f9fc] border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1800ad] outline-none transition-all" />
           </div>
        </div>

        <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
           <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#1800ad] order-2 sm:order-1 transition-colors">Batalkan Perubahan</button>
           <button className="w-full sm:w-auto px-10 py-5 bg-[#1800ad] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/20 order-1 sm:order-2">Simpan Profil</button>
        </div>
      </div>
    </div>
  );
};
