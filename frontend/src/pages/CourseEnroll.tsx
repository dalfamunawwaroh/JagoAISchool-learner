import React, { useState, useEffect } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { courseService } from '../services/api';

interface Course {
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
}

interface CourseEnrollProps {
  courseId: number;
  onCancel: () => void;
  onEnrollSuccess: () => void;
}

export const CourseEnroll = ({ courseId, onCancel, onEnrollSuccess }: CourseEnrollProps) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await courseService.getCourseDetail(courseId);
        setCourse(data);
      } catch (err: any) {
        console.error('Error fetching course for enrollment:', err);
        setError(err.message || 'Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError(null);
    try {
      await courseService.enrollCourse(courseId);
      onEnrollSuccess();
    } catch (err: any) {
      console.error('Enrollment failed:', err);
      setError(err.message || 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1800ad] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Securing enrollment gateway...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
        <Symbol name="error" className="text-5xl text-red-500" />
        <p className="text-red-500 font-medium">{error || 'Course not found.'}</p>
        <button onClick={onCancel} className="text-[#1800ad] font-bold uppercase tracking-wider text-xs hover:underline">
          Go Back
        </button>
      </div>
    );
  }

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
                src={course.image_url} 
                className="w-full h-full object-cover"
                alt={course.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <span className="px-5 py-2 bg-[#e8ba00] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg mb-4 inline-block">
                  {course.badge || 'New Cohort'}
                </span>
                <h2 className="text-3xl font-display font-bold leading-tight">{course.title}</h2>
              </div>
            </div>
            
            <div className="p-12 md:p-16 space-y-10">
              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-[#1800ad]">About this course</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {course.description || 'Gain instant, certified access to world-class learning structures, quizzes, coding sheets, and real-time physical AI integration.'}
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                    <p className="text-sm font-bold text-gray-900">{course.duration_hours} Hours Content</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Difficulty</p>
                    <p className="text-sm font-bold text-gray-900 text-[#e8ba00]">{course.level.toUpperCase()}</p>
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
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-5 bg-[#1800ad] disabled:bg-gray-400 text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/20 active:scale-95"
                >
                  {enrolling ? 'Enrolling...' : 'Confirm & Start Journey'} 
                  <Symbol name="bolt" className="text-xl" />
                </button>
                <button 
                  onClick={onCancel}
                  disabled={enrolling}
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
