import React from 'react';
import { Symbol } from '../components/ui/Symbol';

interface Module {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'quiz' | 'reading' | 'assignment';
}

export const CourseDetail = ({ onStartLearning }: { onStartLearning: () => void }) => {
  const syllabus: Module[] = [
    { id: 1, title: "Introduction to Neural Architectures", duration: "15:00", completed: true, type: 'video' },
    { id: 2, title: "Understanding Activation Functions", duration: "12:00", completed: true, type: 'video' },
    { id: 3, title: "Backpropagation Fundamentals", duration: "25:00", completed: true, type: 'video' },
    { id: 4, title: "Module 1 Review Quiz", duration: "10:00", completed: false, type: 'quiz' },
    { id: 5, title: "Optimization Algorithms: SGD & Adam", duration: "20:00", completed: false, type: 'video' },
    { id: 6, title: "Assignment: Implement Adam Optimizer", duration: "3 Days", completed: false, type: 'assignment' },
    { id: 7, title: "Regularization Techniques", duration: "18:00", completed: false, type: 'reading' },
    { id: 8, title: "Project: Building your first MLP", duration: "45:00", completed: false, type: 'video' },
  ];

  const completedCount = syllabus.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / syllabus.length) * 100);

  return (
    <div className="space-y-10 pb-20 text-left">
      {/* Header Card */}
      <div className="bg-white rounded-[48px] overflow-hidden border border-gray-100 shadow-xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 relative h-64 md:h-auto">
          <img 
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800" 
            className="w-full h-full object-cover" 
            alt="Course Header"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1800ad]/20 to-transparent"></div>
        </div>
        <div className="flex-1 p-10 md:p-14 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1 bg-[#e8ba00]/10 text-[#e8ba00] text-[10px] font-black uppercase tracking-widest rounded-full ring-1 ring-[#e8ba00]/20">Intermediate</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• 12 Modules</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-[#1800ad] leading-tight">Generative AI Mastery: Architectures & Deployment</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            Master the art of building and deploying state-of-the-art Generative AI models. In this course, we'll dive deep into GANs, Transformers, and Diffusion models.
          </p>
          
          <div className="flex flex-wrap items-center gap-8 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Progress</span>
                <span className="text-xs font-black text-[#1800ad]">{progressPercent}%</span>
              </div>
              <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1800ad] to-[#4b00ff] rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            
            <button 
              onClick={onStartLearning}
              className="px-10 py-5 bg-[#1800ad] text-white rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#1800ad]/20 group active:scale-95"
            >
              Start Course Now <Symbol name="bolt" className="text-xl group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content: Syllabus */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xl font-display font-bold text-[#1800ad] flex items-center gap-3">
            <Symbol name="format_list_bulleted" className="text-2xl" /> Course Syllabus
          </h3>
          
          <div className="space-y-4">
            {syllabus.map((item, idx) => (
              <div 
                key={item.id}
                className={`bg-white rounded-[28px] p-6 border transition-all flex items-center gap-6 group hover:shadow-md ${
                  item.completed ? 'border-emerald-100 bg-emerald-50/10' : 'border-gray-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  item.completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-50 text-gray-400 group-hover:bg-[#1800ad]/10 group-hover:text-[#1800ad]'
                }`}>
                  <Symbol name={item.completed ? 'check' : (item.type === 'video' ? 'play_arrow' : (item.type === 'quiz' ? 'quiz' : (item.type === 'assignment' ? 'task' : 'article')))} className="text-xl" />
                </div>
                
                <div className="flex-1 text-left">
                  <h4 className={`text-sm font-bold ${item.completed ? 'text-gray-500 line-through opacity-60' : 'text-gray-900'}`}>
                    {idx + 1}. {item.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{item.duration}</span>
                    <span className="text-[10px] font-black text-gray-300 uppercase">•</span>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest lowercase">{item.type}</span>
                  </div>
                </div>
                
                {!item.completed && (
                  <button className="px-4 py-2 text-[10px] font-black text-[#1800ad] uppercase tracking-widest hover:bg-[#1800ad]/5 rounded-xl transition-all">
                    Start
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Mentors & Tools */}
        <div className="lg:col-span-4 space-y-8 text-left">
          

          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Instructors</h4>
            <div className="space-y-4">
              {[
                { name: 'Dr. Eleanor Vance', role: 'Head of AI Lab', avatar: 'ev' },
                { name: 'Prof. Julian Reed', role: 'System Architect', avatar: 'jr' }
              ].map(mentor => (
                <div key={mentor.name} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100 group-hover:ring-[#1800ad] transition-all">
                    <img src={`https://i.pravatar.cc/100?u=${mentor.avatar}`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-gray-900">{mentor.name}</div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{mentor.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-[10px] font-black text-[#1800ad] uppercase tracking-widest hover:underline pt-2">Schedule 1-on-1 Help</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
