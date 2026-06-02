import React, { useState, useEffect } from 'react';
import { Symbol } from './components/ui/Symbol';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Auth } from './pages/Auth';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { AIToolkit } from './pages/AIToolkit';
import { Article } from './pages/Article';
import { Events } from './pages/Events';
import { Discussion } from './pages/Discussion';
import { Consultation } from './pages/Consultation';
import { CourseDetail } from './pages/CourseDetail';
import { CoursePlayer } from './pages/CoursePlayer';
import { CourseEnroll } from './pages/CourseEnroll';
import { ToolDetail } from './pages/ToolDetail';
import { ArticleDetail } from './pages/ArticleDetail';
import { EditProfile } from './pages/EditProfile';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { FloatingAIChat } from './components/chat/FloatingAIChat';
import { Notifications } from './pages/Notifications';
import { getToken, removeToken, authService } from './services/api';

export type Tab = 'Home' | 'Courses' | 'AI Toolkit' | 'Article' | 'Events' | 'Discussion' | 'Consultation Service' | 'CourseDetail' | 'CoursePlayer' | 'ToolDetail' | 'ArticleDetail' | 'CourseEnroll' | 'EditProfile' | 'Settings' | 'Profile' | 'Notifications';

interface DashboardViewProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  onLogout: () => void;
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
}

const DashboardView = ({ currentUser, setCurrentUser, onLogout, language, setLanguage }: DashboardViewProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const handleSelectTool = (tool: any) => {
    setSelectedTool(tool);
    setActiveTab('ToolDetail');
  };

  const handleReadArticle = (article: any) => {
    setSelectedArticle(article);
    setActiveTab('ArticleDetail');
  };

  const handleViewProfile = (user: any) => {
    setSelectedProfile(user);
    setActiveTab('Profile');
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans selection:bg-[#e8ba00] selection:text-black bg-white text-gray-900">
      
      {/* FLOATING AI CHAT */}
      <FloatingAIChat />

      {/* FIXED LEFT SIDEBAR */}
      <Sidebar 
        activeTab={
          ['CourseDetail', 'CoursePlayer', 'CourseEnroll'].includes(activeTab)
            ? 'Courses' 
            : activeTab === 'ToolDetail' 
              ? 'AI Toolkit' 
              : activeTab === 'ArticleDetail'
                ? 'Article'
                : activeTab === 'Notifications'
                  ? 'Home'
                  : activeTab
        } 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }} 
        isProfileMenuOpen={isProfileMenuOpen}
        setIsProfileMenuOpen={setIsProfileMenuOpen}
        onLogout={onLogout}
        isCollapsed={isCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
        language={language}
      />

      <main className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-[100px]' : 'lg:ml-[280px]'} ml-0 flex-1 h-screen flex flex-col relative overflow-hidden bg-[#f7f9fb]`}>
        {/* Background Dot Grid & Soft Ambient Glowing Gradient Auras */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-80"
          style={{ 
            backgroundImage: `radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`,
            backgroundSize: '32px 32px',
          }}
        ></div>
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#1800ad]/3 blur-[150px] rounded-full pointer-events-none select-none z-0"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-[#e8ba00]/3 blur-[180px] rounded-full pointer-events-none select-none z-0"></div>

        <Header 
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setIsMobileMenuOpen(!isMobileMenuOpen);
            } else {
              setIsCollapsed(!isCollapsed);
            }
          }} 
          language={language}
          onViewNotifications={() => setActiveTab('Notifications')}
        />

        <div className="p-4 md:p-8 lg:p-12 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'Home' && (
              <Dashboard 
                currentUser={currentUser}
                onResumeLearning={(courseId) => { setSelectedCourseId(courseId); setActiveTab('CourseDetail'); }} 
                onViewProfile={handleViewProfile} 
                language={language} 
                onReadArticle={handleReadArticle}
                onViewEvents={() => setActiveTab('Events')}
                onViewCourses={() => setActiveTab('Courses')}
              />
            )}
            {activeTab === 'Courses' && <Courses onSelectCourse={(courseId) => { setSelectedCourseId(courseId); setActiveTab('CourseDetail'); }} />}
            {activeTab === 'AI Toolkit' && <AIToolkit onSelectTool={handleSelectTool} />}
            {activeTab === 'Article' && <Article onReadMore={handleReadArticle} />}
            {activeTab === 'Events' && <Events />}
            {activeTab === 'Discussion' && <Discussion onViewProfile={handleViewProfile} language={language} />}
            {activeTab === 'Consultation Service' && <Consultation language={language} />}
            {activeTab === 'CourseDetail' && selectedCourseId !== null && (
              <CourseDetail 
                courseId={selectedCourseId}
                onStartLearning={() => setActiveTab('CoursePlayer')} 
                onEnroll={() => setActiveTab('CourseEnroll')}
                onBack={() => setActiveTab('Courses')}
              />
            )}
            {activeTab === 'CoursePlayer' && selectedCourseId !== null && (
              <CoursePlayer 
                courseId={selectedCourseId}
                onBack={() => setActiveTab('CourseDetail')} 
              />
            )}
            {activeTab === 'ToolDetail' && selectedTool && <ToolDetail tool={selectedTool} onBack={() => setActiveTab('AI Toolkit')} />}
            {activeTab === 'ArticleDetail' && selectedArticle && <ArticleDetail article={selectedArticle} onBack={() => setActiveTab('Article')} />}
            {activeTab === 'CourseEnroll' && selectedCourseId !== null && (
              <CourseEnroll 
                courseId={selectedCourseId}
                onCancel={() => setActiveTab('Courses')} 
                onEnrollSuccess={() => setActiveTab('CourseDetail')} 
              />
            )}
            {activeTab === 'EditProfile' && <EditProfile currentUser={currentUser} setCurrentUser={setCurrentUser} />}
            {activeTab === 'Settings' && <Settings language={language} setLanguage={setLanguage} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
            {activeTab === 'Profile' && <Profile user={selectedProfile} onBack={() => setActiveTab('Discussion')} />}
            {activeTab === 'Notifications' && <Notifications language={language} />}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [language, setLanguage] = useState<'id' | 'en'>(() => {
    const stored = localStorage.getItem('jagoai_language');
    return (stored === 'en' || stored === 'id') ? stored : 'id';
  });

  // Verify JWT session on launch
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const user = await authService.getMe();
          setCurrentUser(user);
          setView('dashboard');
        } catch (e) {
          console.error('Session expired, logging out.', e);
          removeToken();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleSetLanguage = (lang: 'id' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('jagoai_language', lang);
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setView('landing');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-55 bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1800ad] border-t-transparent"></div>
          <p className="text-xs font-black uppercase tracking-widest text-[#1800ad] animate-pulse">Initializing JagoAI...</p>
        </div>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <Landing 
        onNavigateToAuth={(mode) => {
          setAuthInitialMode(mode);
          setView('auth');
        }} 
      />
    );
  }

  if (view === 'auth') {
    return (
      <Auth 
        initialMode={authInitialMode}
        onLogin={handleLoginSuccess} 
        onBackToLanding={() => setView('landing')}
      />
    );
  }

  return (
    <DashboardView 
      currentUser={currentUser} 
      setCurrentUser={setCurrentUser} 
      onLogout={handleLogout} 
      language={language} 
      setLanguage={handleSetLanguage} 
    />
  );
}
