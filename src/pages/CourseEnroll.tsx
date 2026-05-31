import React from 'react';
import { Symbol } from '../components/ui/Symbol';

interface CourseEnrollProps {
  onCancel: () => void;
  onEnroll: () => void;
}

export const CourseEnroll = ({ onCancel, onEnroll }: CourseEnrollProps) => {
  return (
    <div className="space-y-12 pb-24 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-6">
        <button 
          onClick={onCancel}
          className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1800ad] hover:border-[#1800ad] transition-all shadow-sm"
        >
          <Symbol name="arrow_back" className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-[#1800ad]">Course Enrollment</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrollment Confirmation</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-[400px] md:h-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200" 
                className="w-full h-full object-cover"
                alt="Course"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <span className="px-5 py-2 bg-[#e8ba00] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg mb-4 inline-block">
                  Featured Course
                </span>
                <h2 className="text-3xl font-display font-bold leading-tight">Neural Robotics Hub</h2>
              </div>
            </div>
            
            <div className="p-12 md:p-16 space-y-10">
              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-[#1800ad]">About this course</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  In this comprehensive curriculum, you will explore the intersection of artificial intelligence and physical robotics. From path-finding algorithms to computer vision for obstacle avoidance.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                    <p className="text-sm font-bold text-gray-900">42 Hours Content</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Difficulty</p>
                    <p className="text-sm font-bold text-gray-900 text-[#e8ba00]">PRO LEVEL</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Language</p>
                    <p className="text-sm font-bold text-gray-900">Bahasa Indonesia</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Certificate</p>
                    <p className="text-sm font-bold text-gray-900">Yes, Validated</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-100 flex flex-col gap-4">
                <button 
                  onClick={onEnroll}
                  className="w-full py-5 bg-[#1800ad] text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/20 active:scale-95"
                >
                  Confirm & Start Journey <Symbol name="bolt" className="text-xl" />
                </button>
                <button 
                  onClick={onCancel}
                  className="w-full py-5 bg-white text-gray-400 hover:text-red-500 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all"
                >
                  Cancel Enrollment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
