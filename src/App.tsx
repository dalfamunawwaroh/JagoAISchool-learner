import React, { useState } from 'react';
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
import { ComingSoon } from './pages/ComingSoon';
import { FloatingAIChat } from './components/chat/FloatingAIChat';
import { Notifications } from './pages/Notifications';

export type Tab = 'Home' | 'Courses' | 'AI Toolkit' | 'Article' | 'Events' | 'Discussion' | 'Consultation Service' | 'CourseDetail' | 'CoursePlayer' | 'ToolDetail' | 'ArticleDetail' | 'CourseEnroll' | 'EditProfile' | 'Settings' | 'Profile' | 'Notifications';

const DashboardView = ({ onLogout, language, setLanguage }: { onLogout: () => void; language: 'id' | 'en'; setLanguage: (lang: 'id' | 'en') => void }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

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
                onResumeLearning={() => setActiveTab('CourseDetail')} 
                onViewProfile={handleViewProfile} 
                language={language} 
                onReadArticle={handleReadArticle}
                onViewEvents={() => setActiveTab('Events')}
                onViewCourses={() => setActiveTab('Courses')}
              />
            )}
            {activeTab === 'Courses' && <Courses onStartJourney={() => setActiveTab('CourseEnroll')} />}
            {activeTab === 'AI Toolkit' && <AIToolkit onSelectTool={handleSelectTool} />}
            {activeTab === 'Article' && <Article onReadMore={handleReadArticle} />}
            {activeTab === 'Events' && <Events />}
            {activeTab === 'Discussion' && <Discussion onViewProfile={handleViewProfile} language={language} />}
            {activeTab === 'Consultation Service' && <Consultation language={language} />}
            {activeTab === 'CourseDetail' && <CourseDetail onStartLearning={() => setActiveTab('CoursePlayer')} />}
            {activeTab === 'CoursePlayer' && <CoursePlayer onBack={() => setActiveTab('CourseDetail')} />}
            {activeTab === 'ToolDetail' && selectedTool && <ToolDetail tool={selectedTool} onBack={() => setActiveTab('AI Toolkit')} />}
            {activeTab === 'ArticleDetail' && selectedArticle && <ArticleDetail article={selectedArticle} onBack={() => setActiveTab('Article')} />}
            {activeTab === 'CourseEnroll' && <CourseEnroll onCancel={() => setActiveTab('Courses')} onEnroll={() => setActiveTab('CourseDetail')} />}
            {activeTab === 'EditProfile' && <EditProfile />}
            {activeTab === 'Settings' && <Settings language={language} setLanguage={setLanguage} />}
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
  
  const [language, setLanguage] = useState<'id' | 'en'>(() => {
    const stored = localStorage.getItem('jagoai_language');
    return (stored === 'en' || stored === 'id') ? stored : 'id';
  });

  const handleSetLanguage = (lang: 'id' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('jagoai_language', lang);
  };

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
        onLogin={() => setView('dashboard')} 
        onBackToLanding={() => setView('landing')}
      />
    );
  }

  return <DashboardView onLogout={() => setView('landing')} language={language} setLanguage={handleSetLanguage} />;
}





