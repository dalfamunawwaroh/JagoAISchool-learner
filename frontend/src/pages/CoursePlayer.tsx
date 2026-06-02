import React, { useState, useEffect } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { courseService } from '../services/api';

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  type: 'video' | 'quiz' | 'document';
  content_url: string;
  duration_minutes: number;
  isCompleted: boolean;
  order_index: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface CoursePlayerProps {
  courseId: number;
  onBack: () => void;
}

export const CoursePlayer = ({ courseId, onBack }: CoursePlayerProps) => {
  const [activeTab, setActiveTab] = useState<'content' | 'discussion' | 'notes' | 'assignments'>('content');
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  // Local interactive notes & discussions
  const [notes, setNotes] = useState<any[]>([
    {
      id: 'n1',
      timestamp: '02:15',
      text: 'Stochastic Gradient Descent is deeply impacted by noisy gradients. Momentum factors smooth sudden oscillations.',
      date: 'Today, 10:24 AM'
    },
    {
      id: 'n2',
      timestamp: '08:45',
      text: 'Adam combines SGD Momentum & RMSProp. It dynamically manages per-parameter learning rates.',
      date: 'Yesterday, 4:15 PM'
    }
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [attachTimestamp, setAttachTimestamp] = useState(true);

  const [discussions, setDiscussions] = useState<any[]>([
    {
      id: 'd1',
      senderName: 'Rivaldo Sitorus',
      senderAvatar: 'https://i.pravatar.cc/100?u=rivaldo',
      senderRole: 'Student',
      content: 'I noticed gradient explosion occur when I try lower learning rates like 1e-5 on deeper networks. Is Adam more sensitive to epsilon value changes?',
      timeAgo: '2 hours ago',
      upvotes: 6,
      hasUpvoted: false,
      replies: [
        {
          id: 'r1',
          senderName: 'Rian Hidayat, M.T.',
          senderAvatar: 'https://i.pravatar.cc/100?u=rian',
          senderRole: 'Mentor',
          content: 'Keep standard beta2 at 0.999. Use gradient clipping alongside standard learning rate of 3e-4.',
          timeAgo: '1 hour ago'
        }
      ]
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const fetchCourseData = async () => {
    try {
      const data = await courseService.getCourseDetail(courseId);
      setCourse(data);
      
      // Calculate active progress
      if (data.enrollment) {
        setProgressPercentage(parseFloat(data.enrollment.progress_percentage));
      }

      // Collect flat list of lessons
      const allLessons: Lesson[] = [];
      data.modules.forEach((mod: Module) => {
        mod.lessons.forEach((les: Lesson) => {
          allLessons.push(les);
        });
      });

      // Set first incomplete lesson as active, or first lesson overall
      if (allLessons.length > 0) {
        const incomplete = allLessons.find(l => !l.isCompleted);
        setActiveLesson(incomplete || allLessons[0]);
      }
    } catch (err: any) {
      console.error('Error fetching course playlist:', err);
      setError(err.message || 'Failed to load playlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCourseData();
  }, [courseId]);

  const handleToggleLessonComplete = async (lessonId: number, currentlyCompleted: boolean) => {
    try {
      const res = await courseService.updateLessonProgress(lessonId, !currentlyCompleted);
      
      // Award toast or UI feedback if dynamic XP gained
      if (res.xpGained > 0) {
        alert(`Awesome! +${res.xpGained} XP awarded! Level up progress updated.`);
      }

      // Refresh course data to reflect completion
      await fetchCourseData();

      // Maintain active lesson state with updated completion tag
      if (activeLesson && activeLesson.id === lessonId) {
        setActiveLesson(prev => prev ? { ...prev, isCompleted: !currentlyCompleted } : null);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  // Add Comment Action
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newQuestion = {
      id: 'd_' + Date.now(),
      senderName: 'Me (You)',
      senderAvatar: 'https://i.pravatar.cc/100?u=me',
      senderRole: 'Student',
      content: newCommentText.trim(),
      timeAgo: 'Just now',
      upvotes: 0,
      hasUpvoted: false,
      replies: []
    };

    setDiscussions([newQuestion, ...discussions]);
    setNewCommentText('');
  };

  // Add Note Action
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: 'n_' + Date.now(),
      timestamp: attachTimestamp ? '04:20' : '--:--',
      text: newNoteText.trim(),
      date: 'Just now'
    };

    setNotes([newNote, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1800ad] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Mounting course player stream...</p>
      </div>
    );
  }

  if (error || !course || !activeLesson) {
    return (
      <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
        <Symbol name="error" className="text-5xl text-red-500" />
        <p className="text-red-500 font-medium">{error || 'Course lessons could not be fetched.'}</p>
        <button onClick={onBack} className="text-[#1800ad] font-bold uppercase tracking-wider text-xs hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  // Get active module name
  const activeModule = course.modules.find((m: Module) => 
    m.lessons.some(l => l.id === activeLesson.id)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] -mx-6 -my-6 md:-mx-12 md:-my-12 lg:-mx-16 lg:-my-16 overflow-hidden bg-white text-left">
      {/* Player Header */}
      <div className="px-4 md:px-8 py-3 md:py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={onBack}
            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Symbol name="arrow_back" className="text-lg md:text-xl" />
          </button>
          <div>
            <h1 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-1">
              {activeLesson.title}
            </h1>
            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {course.title} {activeModule ? `• ${activeModule.title}` : ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <span className="text-[10px] font-black text-[#1800ad] bg-[#1800ad]/5 px-3 py-1.5 rounded-full hidden md:inline-block">
            {progressPercentage.toFixed(0)}% Completed
          </span>
          <button 
            onClick={() => handleToggleLessonComplete(activeLesson.id, activeLesson.isCompleted)}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeLesson.isCompleted 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-[#1800ad] text-white hover:bg-black'
            }`}
          >
            {activeLesson.isCompleted ? '✓ Completed' : 'Mark Completed'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            
            {/* Media/Video Container */}
            {activeLesson.type === 'video' ? (
              <div className="aspect-video bg-gray-900 rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl relative group">
                <iframe
                  className="w-full h-full border-none"
                  src={activeLesson.content_url.includes('youtube.com') || activeLesson.content_url.includes('youtu.be')
                    ? activeLesson.content_url.replace('watch?v=', 'embed/')
                    : 'https://www.youtube.com/embed/dQw4w9WgXcQ' // fallback premium placeholder
                  }
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : activeLesson.type === 'quiz' ? (
              <div className="bg-[#f8f9ff] border border-[#1800ad]/10 rounded-[32px] p-8 md:p-12 space-y-6 text-center">
                <div className="w-16 h-16 bg-[#e8ba00]/10 text-[#e8ba00] rounded-2xl flex items-center justify-center mx-auto">
                  <Symbol name="quiz" className="text-3xl" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#1800ad]">Knowledge Checkpoint Quiz</h3>
                <p className="text-gray-500 max-w-md mx-auto text-sm">
                  This lesson is a comprehensive quiz design. Challenge your mathematical intuition and implementation limits.
                </p>
                <a 
                  href={activeLesson.content_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#1800ad] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-[#1800ad]/20"
                >
                  Launch Live Quiz <Symbol name="open_in_new" />
                </a>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 space-y-6 text-left">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                  <Symbol name="description" className="text-2xl" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900">{activeLesson.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  This lesson includes critical reading sheets, research documents, or code notebooks.
                </p>
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                  <span className="text-xs font-bold text-gray-700">Course_Reading_Deck.pdf</span>
                  <a 
                    href={activeLesson.content_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#1800ad] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                  >
                    View File
                  </a>
                </div>
              </div>
            )}

            {/* Lesson Details Tabs */}
            <div className="space-y-6 pb-20">
              <div className="flex items-center gap-4 md:gap-8 pb-4 border-b border-gray-100 overflow-x-auto no-scrollbar scroll-smooth">
                {[
                  { id: 'content', label: 'Lesson Overview' },
                  { id: 'assignments', label: 'Assignments' },
                  { id: 'discussion', label: `Discussion (${discussions.length})` },
                  { id: 'notes', label: `My Notes (${notes.length})` }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all relative shrink-0 pb-2 ${
                      activeTab === tab.id ? 'text-[#1800ad]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#1800ad] rounded-full"></div>}
                  </button>
                ))}
              </div>

              {activeTab === 'content' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-display font-bold text-gray-900">Curriculum Details:</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Welcome to this module. Focus on implementing concepts cleanly, testing activation behavior, and verifying weights logs. Awarding +50 XP on completion!
                  </p>
                  
                  <div className="bg-[#f8f9ff] rounded-3xl p-8 border border-[#1800ad]/5">
                    <h3 className="text-xs font-black text-[#1800ad] uppercase tracking-widest mb-4">Reading Material</h3>
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 text-[#1800ad]">
                          <Symbol name="description" />
                        </div>
                        <div className="text-[13px] font-bold text-gray-900">Summary_Sheet_Optimizers.pdf</div>
                      </div>
                      <a href={activeLesson.content_url} target="_blank" rel="noreferrer" className="text-[#1800ad] hover:underline text-xs font-bold">Download</a>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                  <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-4">
                       <Symbol name="warning" className="text-amber-500" />
                       <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">Deadline: Sunday</h3>
                    </div>
                    <h2 className="text-xl font-display font-bold text-amber-900">Homework: Manual Optimizer Execution</h2>
                    <p className="text-amber-800/70 text-sm leading-relaxed mt-4">
                      Recreate SGD with momentum step parameters manually without calling standard library functions. Keep track of early learning rates.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Submit Your Code</h3>
                    <div className="bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#1800ad] hover:bg-gray-100 transition-all cursor-pointer">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#1800ad] shadow-sm">
                          <Symbol name="upload_file" className="text-3xl" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-900">Drag & Drop code submission</p>
                          <p className="text-xs text-gray-400 mt-1">Upload .py or .ipynb file (max 10MB)</p>
                       </div>
                    </div>
                    <button onClick={() => alert('Code uploaded successfully!')} className="w-full py-5 bg-[#1800ad] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
                      Submit Assignment
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-display font-bold text-gray-900">Lesson Discussion</h2>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">Chat live with your classroom cohorts.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddQuestion} className="bg-white rounded-3xl border border-gray-100 p-5 space-y-4 shadow-sm flex flex-col">
                    <div className="flex items-start gap-3">
                      <img src="https://i.pravatar.cc/100?u=me" className="w-8 h-8 rounded-full object-cover shrink-0" alt="Me" />
                      <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Add your comment, feedback, or ask a blocker query..."
                        className="flex-1 min-h-[90px] text-sm bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1800ad]/10 transition-all resize-none text-gray-800"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" disabled={!newCommentText.trim()} className="px-5 py-2.5 bg-[#1800ad] disabled:bg-gray-100 text-white disabled:text-gray-350 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Publish Thread
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4">
                    {discussions.map((post) => (
                      <div key={post.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                          <img src={post.senderAvatar} className="w-8 h-8 rounded-full object-cover" alt={post.senderName} />
                          <div>
                            <span className="text-xs font-black text-gray-900 block">{post.senderName} ({post.senderRole})</span>
                            <span className="text-[10px] text-gray-400 font-bold">{post.timeAgo}</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                          {post.content}
                        </p>
                        {post.replies.length > 0 && (
                          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                            {post.replies.map((reply: any) => (
                              <div key={reply.id} className="flex gap-3">
                                <img src={reply.senderAvatar} className="w-6 h-6 rounded-full object-cover" alt={reply.senderName} />
                                <div>
                                  <span className="text-[11px] font-black text-gray-900 block">{reply.senderName} • {reply.senderRole}</span>
                                  <p className="text-xs text-gray-600 leading-relaxed">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-xl font-display font-bold text-gray-900">Personal Lesson Notes</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Your private notebook synchronized with this lecture stream.</p>
                  </div>

                  <form onSubmit={handleAddNote} className="bg-[#1800ad]/5 rounded-3xl border border-[#1800ad]/10 p-5 space-y-4 flex flex-col text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#1800ad] uppercase tracking-widest">Add Scratch Note</span>
                      <button
                        type="button"
                        onClick={() => setAttachTimestamp(!attachTimestamp)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                          attachTimestamp ? 'bg-[#1800ad] text-white shadow-sm' : 'bg-white text-gray-400 border'
                        }`}
                      >
                        <Symbol name="schedule" className="text-xs" />
                        <span>{attachTimestamp ? 'Attach Stamp' : 'No Timestamp'}</span>
                      </button>
                    </div>

                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write down observations, equations, or timestamps..."
                      className="w-full min-h-[90px] text-sm bg-white border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1800ad]/10 focus:border-[#1800ad]"
                    />

                    <div className="flex justify-end">
                      <button type="submit" disabled={!newNoteText.trim()} className="px-6 py-3 bg-[#1800ad] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Save to Notes
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                        <div className="bg-[#1800ad]/5 text-[#1800ad] px-2.5 py-1.5 rounded-lg text-[9.5px] font-mono font-black flex items-center gap-1">
                          <Symbol name="play_arrow" className="text-[10px]" fill />
                          <span>{note.timestamp}</span>
                        </div>
                        <div className="flex-1 flex justify-between gap-4 items-start">
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                            {note.text}
                          </p>
                          <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-700">
                            <Symbol name="delete" className="text-sm" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Playlist Sidebar */}
        <div className="w-80 border-l border-gray-100 hidden xl:flex flex-col bg-[#fcfdfe]">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1800ad]">Course Playlist</h4>
            <span className="text-[10px] font-bold text-gray-400">Lessons list</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
            {course.modules.map((mod: Module, modIdx: number) => (
              <div key={mod.id} className="space-y-2">
                <div className="px-3 py-1.5 bg-gray-100/50 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-wider">
                  Module {modIdx + 1}: {mod.title}
                </div>
                {mod.lessons.map((lesson: Lesson) => {
                  const isActive = activeLesson.id === lesson.id;
                  
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => setActiveLesson(lesson)}
                      className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-[#1800ad] text-white shadow-md' 
                          : 'hover:bg-gray-100 bg-white border border-gray-100 text-gray-700'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        lesson.isCompleted 
                          ? 'bg-emerald-500 text-white' 
                          : (isActive ? 'bg-white text-[#1800ad]' : 'bg-gray-100 text-gray-450')
                      }`}>
                        {lesson.isCompleted ? (
                          <Symbol name="check" className="text-sm" />
                        ) : (
                          <Symbol name={lesson.type === 'video' ? 'play_arrow' : (lesson.type === 'quiz' ? 'quiz' : 'article')} className="text-sm" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`text-[10.5px] font-bold leading-tight line-clamp-2`}>
                          {lesson.title}
                        </div>
                        <div className={`text-[9px] font-medium mt-0.5 ${isActive ? 'text-white/60' : 'text-gray-450'}`}>
                          {lesson.duration_minutes} mins
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
