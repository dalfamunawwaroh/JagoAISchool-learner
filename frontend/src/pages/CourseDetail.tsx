import React, { useState, useEffect } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { courseService } from '../services/api';

interface Lesson {
  id: number;
  title: string;
  duration_minutes: number;
  isCompleted: boolean;
  type: 'video' | 'quiz' | 'document';
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface CourseDetailData {
  id: number;
  title: string;
  badge: string;
  level: string;
  category: string;
  image_url: string;
  duration_hours: number;
  rating: string | number;
  student_count: number;
  module_count: number;
  description: string;
  modules: Module[];
  enrollment: {
    id: number;
    status: string;
    progress_percentage: number;
  } | null;
}

interface CourseDetailProps {
  courseId: number;
  onStartLearning: (id: number) => void;
  onEnroll: (id: number) => void;
  onBack: () => void;
}

export const CourseDetail = ({ courseId, onStartLearning, onEnroll, onBack }: CourseDetailProps) => {
  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await courseService.getCourseDetail(courseId);
        setCourse(data);
      } catch (err: any) {
        console.error('Error fetching course detail:', err);
        setError(err.message || 'Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [courseId]);

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1800ad] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading syllabus & curriculum...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
        <Symbol name="error" className="text-5xl text-red-500" />
        <p className="text-red-500 font-medium">{error || 'Course not found.'}</p>
        <button onClick={onBack} className="text-[#1800ad] font-bold uppercase tracking-wider text-xs hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  // Calculate overall progress from actual lessons
  const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
  const completedLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.filter(l => l.isCompleted).length, 0);
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const isEnrolled = course.enrollment !== null;

  return (
    <div className="space-y-10 pb-20 text-left">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-[#1800ad] font-black text-xs uppercase tracking-widest transition-colors"
      >
        <Symbol name="arrow_back" /> Back to Academy
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-[48px] overflow-hidden border border-gray-100 shadow-xl flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 relative h-64 md:h-auto">
          <img 
            src={course.image_url} 
            className="w-full h-full object-cover" 
            alt={course.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1800ad]/20 to-transparent"></div>
        </div>
        <div className="flex-1 p-10 md:p-14 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1 bg-[#e8ba00]/10 text-[#e8ba00] text-[10px] font-black uppercase tracking-widest rounded-full ring-1 ring-[#e8ba00]/20">
              {course.level}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              • {course.module_count} Modules ({totalLessons} Lessons)
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[#1800ad] leading-tight">
            {course.title}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            {course.description || 'Dive deep into state-of-the-art models and physical deployment workflows designed for elite engineers.'}
          </p>
          
          <div className="flex flex-wrap items-center gap-8 pt-4">
            {isEnrolled ? (
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
            ) : null}
            
            <button 
              onClick={() => isEnrolled ? onStartLearning(course.id) : onEnroll(course.id)}
              className="px-10 py-5 bg-[#1800ad] text-white rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#1800ad]/20 group active:scale-95 animate-pulse"
            >
              {isEnrolled ? 'Resume Course Now' : 'Enroll in Course'} 
              <Symbol name="bolt" className="text-xl group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content: Syllabus */}
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-xl font-display font-bold text-[#1800ad] flex items-center gap-3">
            <Symbol name="format_list_bulleted" className="text-2xl" /> Course Curriculum
          </h3>
          
          <div className="space-y-8">
            {course.modules.map((mod, idx) => (
              <div key={mod.id} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                  <span className="w-6 h-6 bg-[#1800ad]/10 rounded-lg flex items-center justify-center text-[#1800ad] text-[10px] font-black font-mono">
                    M{idx + 1}
                  </span>
                  <h4 className="text-md font-display font-bold text-[#1800ad]">
                    {mod.title}
                  </h4>
                </div>
                <p className="text-gray-400 text-xs mt-1 pl-9">{mod.description}</p>
                
                <div className="space-y-3 pl-0 md:pl-9">
                  {mod.lessons.map((lesson, lIdx) => (
                    <div 
                      key={lesson.id}
                      className={`bg-white rounded-2xl p-5 border transition-all flex items-center gap-4 group hover:shadow-md ${
                        lesson.isCompleted ? 'border-emerald-100 bg-emerald-50/10' : 'border-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        lesson.isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-50 text-gray-400 group-hover:bg-[#1800ad]/10 group-hover:text-[#1800ad]'
                      }`}>
                        <Symbol name={lesson.isCompleted ? 'check' : (lesson.type === 'video' ? 'play_arrow' : (lesson.type === 'quiz' ? 'quiz' : 'article'))} className="text-lg" />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <h5 className={`text-xs sm:text-sm font-bold ${lesson.isCompleted ? 'text-gray-500 line-through opacity-60' : 'text-gray-900'}`}>
                          {lIdx + 1}. {lesson.title}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{lesson.duration_minutes} mins</span>
                          <span className="text-[9px] font-black text-gray-300 uppercase">•</span>
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest lowercase">{lesson.type}</span>
                        </div>
                      </div>
                      
                      {isEnrolled && !lesson.isCompleted && (
                        <button 
                          onClick={() => onStartLearning(course.id)}
                          className="px-4 py-2 text-[9px] font-black text-[#1800ad] uppercase tracking-widest hover:bg-[#1800ad]/5 rounded-xl transition-all"
                        >
                          Learn
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Instructors & Metadata */}
        <div className="lg:col-span-4 space-y-8 text-left">
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm space-y-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Instructors</h4>
            <div className="space-y-4">
              {[
                { name: 'Dr. Eleanor Vance', role: 'Head of AI Research', avatar: 'ev' },
                { name: 'Prof. Julian Reed', role: 'Chief Architect', avatar: 'jr' }
              ].map(mentor => (
                <div key={mentor.name} className="flex items-center gap-4 group">
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
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-medium">Student Enrollments</span>
                <span className="text-gray-900 font-bold">{course.student_count} students</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-2">
                <span className="text-gray-400 font-medium">Aggregate Rating</span>
                <span className="text-gray-900 font-bold">★ {course.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
