import React, { useState, useEffect } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { motion, AnimatePresence } from 'motion/react';
import { courseService } from '../services/api';

interface Course {
  id: number;
  title: string;
  badge: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  image_url: string;
  duration_hours: number;
  rating: string | number;
  student_count: number;
  module_count: number;
}

export const Courses = ({ onSelectCourse }: { onSelectCourse: (id: number) => void }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced' | 'UTBK Prep'>('All');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Vision", "NLP", "Robotics", "Audio", "Generative AI", "Mathematics", "Ethical AI", "UTBK Prep"];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryLevel = activeTab === 'All' ? undefined : (activeTab === 'UTBK Prep' ? undefined : activeTab);
        const queryCategory = activeTab === 'UTBK Prep' ? 'UTBK Prep' : undefined;
        
        const data = await courseService.getCourses(queryLevel, queryCategory);
        setCourses(data);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [activeTab]);

  const filteredCourses = courses.filter(course => {
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(course.category);
    return matchesFilter;
  });

  const toggleFilter = (category: string) => {
    setActiveFilters(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-12 pb-24 text-left relative">
      {/* HEADER SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="w-1.5 h-12 md:h-16 bg-[#1800ad]"></div>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-[#1800ad] tracking-tight">The Academy</h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium max-w-2xl">
              Master the architecture of tomorrow. Explore our curated selection of high-impact AI
              courses designed for the next generation of engineers and visionaries.
            </p>
          </div>
        </div>

        {/* TABS & FILTERS */}
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex w-full bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm transition-colors overflow-hidden">
              {(['All', 'Beginner', 'Intermediate', 'Advanced', 'UTBK Prep'] as const).map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-2 md:px-8 py-2 md:py-3 rounded-xl text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tight md:tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab ? 'bg-[#1800ad] text-white shadow-xl shadow-[#1800ad]/20' : 'text-gray-400 hover:text-[#1800ad]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Active:</span>
              <AnimatePresence>
                {activeFilters.map((filter) => (
                  <motion.div 
                    key={filter} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-[#1800ad] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-[#1800ad]/20 group cursor-default transition-colors"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{filter}</span>
                    <button 
                      onClick={() => toggleFilter(filter)}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <Symbol name="close" className="text-xs" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {activeFilters.length === 0 && (
                <span className="text-[10px] font-bold text-gray-300 italic">No filters active</span>
              )}
            </div>
            
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-3 px-8 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-[#1800ad] uppercase tracking-widest shadow-sm hover:border-[#1800ad] hover:bg-gray-50 transition-all active:scale-95"
            >
              <Symbol name="tune" className="text-lg" /> Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1800ad] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading premium course catalog...</p>
        </div>
      ) : error ? (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
          <Symbol name="error" className="text-5xl text-red-500" />
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : filteredCourses.length > 0 ? (

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
          {filteredCourses.map((course) => (
            <motion.div 
              layout
              key={course.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-white rounded-2xl md:rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full"
            >
              {/* Top Image */}
              <div className="relative aspect-[4/5] md:aspect-video overflow-hidden">
                <img 
                  src={course.image_url} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute top-3 left-3 md:top-6 md:left-6">
                  <span className="px-2 md:px-5 py-1 md:py-2 bg-[#e8ba00] text-[#1800ad] text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {course.badge}
                  </span>
                </div>
                <div className="absolute top-3 right-3 md:top-6 md:right-6">
                   <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center text-white border border-white/30 transition-colors">
                      <Symbol name={
                        course.category === 'Vision' ? 'visibility' : 
                        course.category === 'NLP' ? 'translate' : 
                        course.category === 'Robotics' ? 'precision_manufacturing' : 
                        course.category === 'UTBK Prep' ? 'school' : 
                        course.category === 'Mathematics' ? 'calculate' : 
                        course.category === 'Generative AI' ? 'auto_awesome' : 
                        'auto_stories'
                      } className="text-sm md:text-xl" />
                   </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 md:p-10 flex-1 flex flex-col">
                <div className="mb-2 md:mb-4">
                   <span className="text-[7px] md:text-[10px] font-black text-[#1800ad]/40 uppercase tracking-[0.2em] transition-colors">{course.category}</span>
                </div>
                <h3 className="text-[11px] md:text-2xl font-display font-bold text-[#1800ad] mb-4 md:mb-8 leading-tight group-hover:text-[#e8ba00] transition-colors line-clamp-2">{course.title}</h3>
                
                <div className="grid grid-cols-2 gap-y-3 md:gap-y-6 gap-x-2 md:gap-x-4 mb-4 md:mb-10">
                  <div className="flex items-center gap-1.5 md:gap-3 text-gray-500">
                    <Symbol name="schedule" className="text-[#e8ba00] text-[10px] md:text-lg" />
                    <span className="text-[8px] md:text-[10px] font-bold">{course.duration_hours}h</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-3 text-gray-500">
                    <Symbol name="star" className="text-[#e8ba00] text-[10px] md:text-lg" />
                    <span className="text-[8px] md:text-[10px] font-bold">{course.rating}</span>
                  </div>
                </div>

                <button 
                  onClick={() => onSelectCourse(course.id)}
                  className="mt-auto w-full py-3 md:py-5 bg-[#1800ad] text-white rounded-xl md:rounded-3xl flex items-center justify-center gap-2 md:gap-3 text-[8px] md:text-[11px] font-black uppercase tracking-widest group/btn overflow-hidden relative shadow-lg shadow-[#1800ad]/20 transition-all active:scale-95"
                >
                  <span className="relative z-10">Join</span>
                  <Symbol name="arrow_forward" className="text-xs md:text-lg relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-black translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 bg-gray-100 rounded-[40px] flex items-center justify-center text-gray-300">
            <Symbol name="search_off" className="text-5xl" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-display font-bold text-[#1800ad]">No courses found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search terms.</p>
          </div>
          <button 
            onClick={() => { setActiveTab('All'); setActiveFilters([]); }}
            className="text-[10px] font-black text-[#1800ad] uppercase tracking-widest hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* FILTER MODAL */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 transition-colors"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-display font-bold text-[#1800ad]">Filters</h3>
                  <button onClick={() => setIsFilterModalOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-black transition-colors">
                    <Symbol name="close" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Knowledge Domains</label>
                    <div className="flex flex-wrap gap-2">
                       {categories.map((cat) => (
                        <button 
                          key={cat}
                          onClick={() => toggleFilter(cat)}
                          className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            activeFilters.includes(cat) 
                              ? 'bg-[#1800ad] text-white border-[#1800ad] shadow-lg shadow-[#1800ad]/20' 
                              : 'bg-white text-gray-400 border-gray-100 hover:border-[#1800ad]/30'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-full py-5 bg-[#1800ad] text-white rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/20 active:scale-95"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
