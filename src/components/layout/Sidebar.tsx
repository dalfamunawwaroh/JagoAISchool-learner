import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Symbol } from '../ui/Symbol';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

interface SidebarItemProps {
  label: string;
  icon: string;
  active?: boolean;
  onClick: () => void;
  isCollapsed: boolean;
  key?: React.Key;
}

const SidebarItem = ({ label, icon, active, onClick, isCollapsed }: SidebarItemProps) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center transition-all relative group ${
      isCollapsed ? 'lg:justify-center py-3' : 'px-8 py-3 gap-3'
    } ${
      active 
        ? 'text-[#1800ad] bg-[#f8f9ff]' 
        : 'text-[#4b5563] hover:text-[#1800ad] hover:bg-gray-50'
    }`}
  >
    {/* Active Indicator Bar */}
    {active && (!isCollapsed || window.innerWidth < 1024) && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#e8ba00] rounded-r-full shadow-[2px_0_10px_rgba(232,186,0,0.3)]"></div>
    )}

    <Symbol 
      name={icon} 
      className={`text-lg transition-all duration-300 ${
        active 
          ? 'text-[#1800ad]' 
          : 'text-[#4b5563] group-hover:text-[#1800ad]'
      }`} 
      fill={active} 
    />

    <span className={`text-[12px] font-bold tracking-tight transition-all duration-300 ${isCollapsed ? 'lg:hidden' : 'inline-block'} ${active ? 'opacity-100 text-[#1800ad]' : 'opacity-80 group-hover:opacity-100'}`}>
      {label}
    </span>

    {isCollapsed && (
      <div className="hidden lg:group-hover:block absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-[10px] font-black rounded-lg pointer-events-none transition-all z-[200] whitespace-nowrap uppercase tracking-widest">
        {label}
      </div>
    )}
  </button>
);

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  isProfileMenuOpen, 
  setIsProfileMenuOpen, 
  onLogout, 
  isCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onToggleSidebar
}: SidebarProps & { onToggleSidebar: () => void }) => {
  const tabs = [
    { label: 'Home', icon: 'home' },
    { label: 'Courses', icon: 'school' },
    { label: 'AI Toolkit', icon: 'smart_toy' },
    { label: 'Article', icon: 'article' },
    { label: 'Events', icon: 'calendar_today' },
    { label: 'Discussion', icon: 'forum' },
    { label: 'Consultation Service', icon: 'headset_mic' }
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed top-0 left-0 h-screen transition-all duration-300 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-[100px]' : 'w-[280px]'} 
        bg-white border-r border-gray-100 flex flex-col z-[100] shadow-sm overflow-visible text-left`}
      >
        <div className={`transition-all duration-300 px-5 ${isCollapsed ? 'lg:py-6 py-10' : 'py-8'} flex flex-col items-center lg:items-start relative`}>
          {/* TOGGLE BUTTON */}
          <button 
            onClick={onToggleSidebar}
            className={`absolute ${isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-5 top-8'} p-2 text-gray-400 hover:text-[#1800ad] hover:bg-gray-50 rounded-xl transition-all hidden lg:flex`}
          >
            <Symbol name={isCollapsed ? 'menu_open' : 'menu'} className="text-lg" />
          </button>

          {isCollapsed ? (
            <div className="hidden lg:flex w-12 h-12 bg-gradient-to-br from-[#1800ad] to-[#2b00ff] rounded-2xl items-center justify-center text-white shadow-xl shadow-[#1800ad]/30 group hover:scale-110 transition-all cursor-pointer">
              <Symbol name="school" className="text-2xl" fill />
            </div>
          ) : (
            <div className="flex w-10 h-10 bg-gradient-to-br from-[#1800ad] to-[#2b00ff] rounded-2xl items-center justify-center text-white shadow-lg shadow-[#1800ad]/10 mb-4 lg:hidden">
              <Symbol name="school" className="text-xl" fill />
            </div>
          )}
          
          <div className={`${isCollapsed ? 'lg:hidden' : 'flex'} flex-col text-left px-3 ${isCollapsed ? '' : 'mt-1'}`}>
            <span className="text-[18px] font-display font-black text-[#1800ad] tracking-tight leading-none uppercase">JagoAiSchool</span>
            <span className="text-[8px] font-black text-[#94a3b8] tracking-[0.1em] uppercase mt-1.5 transition-colors">LEARNER PORTAL</span>
          </div>
        </div>

        <nav className={`flex-1 space-y-0.5 ${isCollapsed ? 'lg:pt-4 pt-0' : ''}`}>
          {tabs.map((tab) => (
            <SidebarItem 
              key={tab.label}
              label={tab.label} 
              icon={tab.icon} 
              active={activeTab === tab.label} 
              onClick={() => setActiveTab(tab.label)} 
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        <div className={`p-4 border-t border-gray-100 relative ${isCollapsed ? 'lg:flex lg:justify-center' : ''}`}>
          <AnimatePresence>
            {isProfileMenuOpen && (!isCollapsed || window.innerWidth < 1024) && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                className="absolute bottom-full left-4 right-4 mb-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 py-2"
              >
                <button 
                  onClick={() => { setActiveTab('Profile'); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <Symbol name="person" className="text-lg text-gray-400 group-hover:text-[#1800ad]" />
                  <span className="text-[13px] font-bold text-gray-700">Profile</span>
                </button>
                <button 
                  onClick={() => { setActiveTab('EditProfile'); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <Symbol name="edit" className="text-lg text-gray-400 group-hover:text-[#1800ad]" />
                  <span className="text-[13px] font-bold text-gray-700">Edit Profile</span>
                </button>
                <button 
                  onClick={() => { setActiveTab('Settings'); setIsProfileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  <Symbol name="settings" className="text-lg text-gray-400 group-hover:text-[#1800ad]" />
                  <span className="text-[13px] font-bold text-gray-700">Settings</span>
                </button>
                <div className="h-px bg-gray-50 mx-4 my-2"></div>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition-colors text-left group">
                  <Symbol name="logout" className="text-lg text-red-500" />
                  <span className="text-[13px] font-bold text-red-600">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isCollapsed ? (
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="hidden lg:flex w-10 h-10 rounded-xl bg-[#f8f9fc] items-center justify-center hover:bg-gray-100 transition-all relative overflow-hidden"
            >
              <img src="https://i.pravatar.cc/100?u=as" className="w-full h-full object-cover" alt="Profile" />
            </button>
          ) : null}
          
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${isCollapsed ? 'lg:hidden' : 'flex'} ${isProfileMenuOpen ? 'bg-[#f1f3f5]' : 'bg-[#f8f9fc] hover:bg-[#f1f3f5]'}`}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm shrink-0">
                <img src="https://i.pravatar.cc/100?u=alex" className="w-full h-full object-cover" alt="Profile" />
              </div>
              <div className="flex flex-col items-start text-left shrink-0">
                <span className="text-[11px] font-bold text-[#1800ad] group-hover:text-black transition-colors line-clamp-1 w-20">Alex Sterling</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] font-black text-[#94a3b8] uppercase tracking-widest leading-none">Learner</span>
                </div>
              </div>
            </div>
            <Symbol name="north_east" className={`text-[#1800ad] text-xs transition-all ${isProfileMenuOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  );
};
