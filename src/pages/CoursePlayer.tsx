import React, { useState } from 'react';
import { Symbol } from '../components/ui/Symbol';

export const CoursePlayer = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'discussion' | 'notes' | 'assignments'>('content');

  // Interactive Discussions state
  const [discussions, setDiscussions] = useState<any[]>([
    {
      id: 'd1',
      senderName: 'Rivaldo Sitorus',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      senderRole: 'Student',
      content: 'I noticed gradient explosion occur when I try lower learning rates like 1e-5 on deeper networks. Is Adam more sensitive to epsilon value changes or should I tweak beta2 instead?',
      timeAgo: '2 hours ago',
      upvotes: 6,
      hasUpvoted: false,
      isResolved: true,
      replies: [
        {
          id: 'r1',
          senderName: 'Rian Hidayat, M.T.',
          senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
          senderRole: 'Mentor',
          content: 'Keep standard beta2 at 0.999. Dampening the second moment estimate too rapidly causes severe division by zero or very small epsilon values, generating spikes. Use gradient clipping alongside a standard LR of 3e-4.',
          timeAgo: '1 hour ago'
        }
      ]
    },
    {
      id: 'd2',
      senderName: 'Tasya Cantika',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      senderRole: 'Student',
      content: "Can someone explain mathematically why there is bias correction back-scaling in Adam? Why can't we just take the raw moving average estimates?",
      timeAgo: '5 hours ago',
      upvotes: 11,
      hasUpvoted: true,
      isResolved: false,
      replies: [
        {
          id: 'r2',
          senderName: 'Diki Hermawan',
          senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
          senderRole: 'Student',
          content: 'Since we initialize m0 and v0 with 0, early estimators are skewed heavily towards 0, especially with large decay hyperparams (like beta1=0.9, beta2=0.999). E.g., at t=1, m_1 = (1 - beta1) * g1, which is extremely small! The bias correction scales this factor back to standard.',
          timeAgo: '4 hours ago'
        }
      ]
    },
    {
      id: 'd3',
      senderName: 'Andi Wijaya',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      senderRole: 'Student',
      content: 'Is SGD with Nesterov momentum still superior to Adam for specialized ResNet/CNN classification layers, or is there a general rule of thumb today?',
      timeAgo: '1 day ago',
      upvotes: 4,
      hasUpvoted: false,
      isResolved: true,
      replies: []
    }
  ]);

  const [newCommentText, setNewCommentText] = useState('');
  const [discussionFilter, setDiscussionFilter] = useState<'all' | 'resolved' | 'pending'>('all');

  // Notes state
  const [notes, setNotes] = useState<any[]>([
    {
      id: 'n1',
      timestamp: '02:15',
      text: 'Stochastic Gradient Descent is deeply impacted by noisy gradients. Backpropagation momentum factors smooth out these sudden oscillations to optimize training steps.',
      date: 'Today, 10:24 AM'
    },
    {
      id: 'n2',
      timestamp: '08:45',
      text: 'Adam (Adaptive Moment Estimation) combines SGD Momentum & RMSProp. It dynamically manages per-parameter learning rates using first & second moment moving averages.',
      date: 'Yesterday, 4:15 PM'
    }
  ]);

  const [newNoteText, setNewNoteText] = useState('');
  const [attachTimestamp, setAttachTimestamp] = useState(true);

  // Discussion Actions
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newQuestion = {
      id: 'd_' + Date.now(),
      senderName: 'Me (You)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      senderRole: 'Student',
      content: newCommentText.trim(),
      timeAgo: 'Just now',
      upvotes: 0,
      hasUpvoted: false,
      isResolved: false,
      replies: []
    };

    setDiscussions([newQuestion, ...discussions]);
    setNewCommentText('');
  };

  const handleUpvote = (id: string) => {
    setDiscussions(discussions.map(post => {
      if (post.id === id) {
        return {
          ...post,
          upvotes: post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          hasUpvoted: !post.hasUpvoted
        };
      }
      return post;
    }));
  };

  // Notes Actions
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
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  // Filter discussions
  const filteredDiscussions = discussions.filter(post => {
    if (discussionFilter === 'resolved') return post.isResolved;
    if (discussionFilter === 'pending') return !post.isResolved;
    return true;
  });

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
            <h1 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-1">Module 4: Optimization Algorithms: SGD & Adam</h1>
            <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Generative AI Mastery</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <button className="px-4 md:px-6 py-2 md:py-2.5 bg-[#1800ad] text-white rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all whitespace-nowrap">
            Next Lesson
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {/* Video Placeholder */}
            <div className="aspect-video bg-gray-900 rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl relative group">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200" 
                className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" 
                alt="Video Content"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 md:w-24 md:h-24 bg-[#e8ba00] rounded-full flex items-center justify-center text-[#1800ad] shadow-[0_0_50px_rgba(232,186,0,0.5)] hover:scale-110 transition-transform">
                  <Symbol name="play_arrow" className="text-3xl md:text-5xl" fill />
                </button>
              </div>
              
              {/* Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 md:gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <Symbol name="play_arrow" className="text-white text-xl" />
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-[#1800ad]"></div>
                </div>
                <div className="text-white text-[9px] md:text-[10px] font-mono font-bold">04:20 / 12:45</div>
                <Symbol name="settings" className="hidden md:block text-white text-xl" />
                <Symbol name="fullscreen" className="text-white text-2xl" />
              </div>
            </div>

            {/* Lesson Details */}
            <div className="space-y-6 pb-20">
              <div className="flex items-center gap-4 md:gap-8 pb-4 border-b border-gray-100 overflow-x-auto no-scrollbar scroll-smooth">
                {[
                  { id: 'content', label: 'Lesson Overview' },
                  { id: 'assignments', label: 'Assignments' },
                  { id: 'discussion', label: `Discussion (${discussions.length + 21})` },
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
                  <h2 className="text-2xl font-display font-bold text-gray-900">What we'll cover in this lesson:</h2>
                  <ul className="space-y-4">
                    {[
                      "Intuition behind Stochastic Gradient Descent",
                      "Mathematical foundations of momentum in optimization",
                      "Implementing Adam from scratch in PyTorch",
                      "Common pitfalls and when to use which optimizer"
                    ].map((bullet, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="w-1.5 h-1.5 bg-[#e8ba00] rounded-full mt-2 shrink-0"></div>
                        <p className="text-gray-600 text-sm leading-relaxed">{bullet}</p>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-[#f8f9ff] rounded-3xl p-8 border border-[#1800ad]/5">
                    <h3 className="text-xs font-black text-[#1800ad] uppercase tracking-widest mb-4">Reading Material</h3>
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-[#1800ad] group-hover:text-white transition-all">
                          <Symbol name="description" />
                        </div>
                        <div className="text-[13px] font-bold text-gray-900">Summary_Sheet_Optimizers.pdf</div>
                      </div>
                      <Symbol name="download" className="text-[#1800ad] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-4">
                       <Symbol name="warning" className="text-amber-500" />
                       <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">Deadline: In 2 Days</h3>
                    </div>
                    <h2 className="text-xl font-display font-bold text-amber-900">Penugasan: Implement Optimizer Adam</h2>
                    <p className="text-amber-800/70 text-sm leading-relaxed mt-4">
                      Tugas anda adalah mengimplementasikan algoritma optimasi Adam secara manual menggunakan PyTorch tensors. Jangan gunakan library optimizers bawaan.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Instructions</h3>
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 space-y-4 shadow-sm">
                       <p className="text-sm text-gray-600 leading-relaxed">1. Initialize the moment vectors m and v to zero.</p>
                       <p className="text-sm text-gray-600 leading-relaxed">2. Use standard hyperparameters: beta1=0.9, beta2=0.999, epsilon=1e-8.</p>
                       <p className="text-sm text-gray-600 leading-relaxed">3. Include bias correction for both m and v.</p>
                       <p className="text-sm text-gray-600 leading-relaxed">4. Test your implementation on a simple linear regression task.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Submit Your Result</h3>
                    <div className="bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#1800ad] hover:bg-gray-100 transition-all cursor-pointer">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#1800ad] shadow-sm">
                          <Symbol name="upload_file" className="text-3xl" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-900">Drag & Drop your implementation here</p>
                          <p className="text-xs text-gray-400 mt-1">Upload .py or .ipynb file (max 10MB)</p>
                       </div>
                    </div>
                    <button className="w-full py-5 bg-[#1800ad] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/20">
                      Submit Assignment
                    </button>
                  </div>
                </div>
              )}

              {/* HIGH-FIDELITY INTERACTIVE DISCUSSION TAB CONTENT */}
              {activeTab === 'discussion' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-display font-bold text-gray-900">Class Discussion</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Ask questions, share advice, or help other course mates.</p>
                    </div>

                    {/* Simple Filter row */}
                    <div className="flex items-center gap-1.5 self-start sm:self-center">
                      {(['all', 'resolved', 'pending'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setDiscussionFilter(filter)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            discussionFilter === filter 
                              ? 'bg-[#1800ad] text-white shadow-sm' 
                              : 'bg-gray-50 text-gray-400 hover:text-gray-600 border border-gray-100'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ask Question / Add Comment Box */}
                  <form onSubmit={handleAddQuestion} className="bg-white rounded-3xl border border-gray-100 p-5 space-y-4 shadow-sm flex flex-col text-left">
                    <div className="flex items-start gap-3">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-8 h-8 rounded-full object-cover shrink-0" alt="Me" />
                      <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Add a comment, share your progress, or ask about SGD Optimization..."
                        className="flex-1 min-h-[90px] text-sm bg-[#fcfdfe] border border-gray-200/80 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1a00ba]/10 focus:border-[#1a00ba] transition-all resize-none text-gray-800 placeholder-gray-400/80 font-medium"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <Symbol name="security" className="text-emerald-500 text-xs fill-1" />
                        <span>Posting as a Student</span>
                      </span>
                      <button
                        type="submit"
                        disabled={!newCommentText.trim()}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                          newCommentText.trim() 
                            ? 'bg-[#1800ad] text-white hover:bg-black shadow-md shadow-[#1800ad]/15 cursor-pointer active:scale-95' 
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <span>Publish</span>
                        <Symbol name="send" className="text-[10px]" />
                      </button>
                    </div>
                  </form>

                  {/* List of discussions */}
                  <div className="space-y-4">
                    {filteredDiscussions.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-100/50 flex flex-col items-center justify-center space-y-2">
                        <Symbol name="chat_bubble_outline" className="text-4xl text-gray-300" />
                        <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mt-2">No threads found</h4>
                        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">Be the very first one to trigger the spark by posting a question above!</p>
                      </div>
                    ) : (
                      filteredDiscussions.map((post) => (
                        <div key={post.id} className="bg-white border border-gray-100/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 text-left transition-all hover:border-gray-200">
                          {/* Thread Header */}
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img src={post.senderAvatar} className="w-9 h-9 rounded-full object-cover border border-white" alt={post.senderName} />
                              <div className="leading-tight text-left">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-gray-900">{post.senderName}</span>
                                  <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                    post.senderRole === 'Mentor' || post.senderRole === 'Instructor'
                                      ? 'bg-amber-100 text-amber-800' 
                                      : 'bg-blue-50 text-blue-600'
                                  }`}>
                                    {post.senderRole}
                                  </span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{post.timeAgo}</span>
                              </div>
                            </div>

                            {post.isResolved && (
                              <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-sm whitespace-nowrap self-start">
                                <Symbol name="done_all" className="text-xs font-black" />
                                <span>Resolved</span>
                              </span>
                            )}
                          </div>

                          {/* Thread Body */}
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                            {post.content}
                          </p>

                          {/* Action Toolbar */}
                          <div className="flex items-center gap-6 border-t border-gray-50 pt-3.5">
                            <button 
                              onClick={() => handleUpvote(post.id)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-black transition-all ${
                                post.hasUpvoted 
                                  ? 'bg-[#1800ad]/10 text-[#1800ad]' 
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-500'
                              }`}
                            >
                              <Symbol name="thumb_up" className="text-xs" fill={post.hasUpvoted} />
                              <span>{post.upvotes} {post.hasUpvoted ? 'Upvoted' : 'Upvote'}</span>
                            </button>

                            <span className="text-[10px] sm:text-xs text-gray-400 font-bold flex items-center gap-1">
                              <Symbol name="forum" className="text-xs" />
                              <span>{post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}</span>
                            </span>
                          </div>

                          {/* Replies Area */}
                          {post.replies.length > 0 && (
                            <div className="pt-4 border-t border-gray-50 space-y-4 bg-gray-50/50 rounded-2xl p-4 sm:p-5 mt-3">
                              {post.replies.map((reply: any) => (
                                <div key={reply.id} className="flex gap-3 text-left">
                                  <img src={reply.senderAvatar} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover mt-0.5 shrink-0" alt={reply.senderName} />
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-black text-gray-900">{reply.senderName}</span>
                                      <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded">{reply.senderRole}</span>
                                      <span className="text-[10.5px] text-gray-400 font-semibold">{reply.timeAgo}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                      {reply.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* HIGH-FIDELITY NOTES TAB CONTENT WITH VIDEO CLIP REFERENCE */}
              {activeTab === 'notes' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
                    <div>
                      <h2 className="text-xl font-display font-bold text-gray-900">Personal Lesson Notes</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Your private notebook. Notes are automatically coupled with the current lesson timeframe.</p>
                    </div>
                  </div>

                  {/* Create New Note Card */}
                  <form onSubmit={handleAddNote} className="bg-[#1800ad]/5 rounded-3xl border border-[#1800ad]/10 p-5 sm:p-6 space-y-4 flex flex-col text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#e8ba00] rounded-full"></span>
                        <h4 className="text-[10px] font-black text-[#1a00ba] uppercase tracking-widest">Add New Scratch Note</h4>
                      </div>

                      {/* Timestamp Attacher Toggle */}
                      <button
                        type="button"
                        onClick={() => setAttachTimestamp(!attachTimestamp)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                          attachTimestamp 
                            ? 'bg-[#1a00ba] text-white shadow-sm' 
                            : 'bg-white text-gray-400 border border-gray-150'
                        }`}
                      >
                        <Symbol name="schedule" className="text-xs" />
                        <span>{attachTimestamp ? 'Attach current stamp (04:20)' : 'No timestamp'}</span>
                      </button>
                    </div>

                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write your observation logic here (e.g., 'Adam parameters need bias correction factor because...')"
                      className="w-full min-h-[90px] text-sm bg-white border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1a00ba]/10 focus:border-[#1a00ba] transition-all resize-none text-gray-800 placeholder-gray-400 font-medium"
                    />

                    <div className="flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={!newNoteText.trim()}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          newNoteText.trim() 
                            ? 'bg-[#1800ad] text-white hover:bg-black hover:shadow-lg shadow-sm cursor-pointer' 
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        Add to Notebook
                      </button>
                    </div>
                  </form>

                  {/* Note list display */}
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-left">My Saved Notebook Entries ({notes.length})</h3>
                    {notes.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-100/50 flex flex-col items-center justify-center space-y-2">
                        <Symbol name="edit_note" className="text-4xl text-gray-300" />
                        <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mt-2">Notebook empty</h4>
                        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">Compile learning milestones, math formulas, or timing points by saving them above.</p>
                      </div>
                    ) : (
                      notes.map((note) => (
                        <div key={note.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3.5 text-left transition-all hover:border-gray-250 flex items-start gap-4">
                          
                          {/* Left: Stamp Accent Badge */}
                          <div className="flex flex-col items-center gap-1.5 shrink-0">
                            <span className="bg-[#1800ad]/5 hover:bg-[#1800ad]/10 cursor-pointer text-[#1800ad] px-2.5 py-1.5 rounded-lg text-[9.5px] font-mono font-black flex items-center gap-1 transition-all">
                              <Symbol name="play_arrow" className="text-[10px]" fill />
                              <span>{note.timestamp}</span>
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap">{note.date}</span>
                          </div>

                          {/* Right: Text and Trash button */}
                          <div className="flex-1 flex justify-between gap-4 items-start">
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                              {note.text}
                            </p>
                            
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors shrink-0"
                              title="Delete Note"
                            >
                              <Symbol name="delete" className="text-sm" />
                            </button>
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Sidebar: Playlist */}
        <div className="w-80 border-l border-gray-100 hidden xl:flex flex-col bg-[#fcfdfe]">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1800ad]">Course Content</h4>
            <span className="text-[10px] font-bold text-gray-400">4 / 12</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const isCompleted = i < 4;
              const isActive = i === 4;
              const isAssignment = i === 6;
              
              return (
                <div 
                  key={i} 
                  className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${
                    isActive ? 'bg-white shadow-md border border-gray-100 text-[#1800ad]' : 'hover:bg-gray-100/50 grayscale opacity-80 hover:grayscale-0 hover:opacity-100'
                  }`}
                  onClick={() => i === 6 && setActiveTab('assignments')}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isCompleted ? 'bg-emerald-500 text-white' : (isActive ? 'bg-[#1800ad] text-white' : (isAssignment ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'))
                  }`}>
                    {isCompleted ? <Symbol name="check" className="text-sm" /> : (isAssignment ? <Symbol name="task" className="text-sm" /> : <span className="text-[10px] font-black">{i}</span>)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-[11px] font-bold leading-tight line-clamp-1">
                      {isAssignment ? 'Assignment: Implement Adam' : `Module ${i}: Optimization Algorithms`}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Symbol name={isAssignment ? "calendar_today" : "play_circle"} className="text-[12px] opacity-40" />
                      <span className="text-[9px] font-black text-gray-400 uppercase">{isAssignment ? '3 DAYS LEFT' : '12:45 MIN'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
