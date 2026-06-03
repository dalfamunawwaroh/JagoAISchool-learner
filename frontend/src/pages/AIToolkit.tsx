import React, { useState, useEffect } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { aiToolService } from '../services/api';

export const ToolLogo = ({ name, className = "w-6 h-6" }: { name: string; className?: string }) => {
  const n = name.toLowerCase();
  if (n === 'gemini') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="url(#geminiGrad)" />
        <defs>
          <linearGradient id="geminiGrad" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1A73E8" />
            <stop offset="0.5" stopColor="#9C27B0" />
            <stop offset="1" stopColor="#E82127" />
          </linearGradient>
        </defs>
      </svg>
    );
  } else if (n === 'claude') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#D97706" />
        <path d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C66.5685 80 80 66.5685 80 50C80 33.4315 66.5685 20 50 20ZM50 72C37.8497 72 28 62.1503 28 50C28 37.8497 37.8497 28 50 28C62.1503 28 72 37.8497 72 50C72 62.1503 62.1503 72 50 72Z" fill="#FFFBEB" />
        <path d="M45 42H55V58H45V42Z" fill="#FFFBEB" />
      </svg>
    );
  } else if (n === 'chatgpt') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#10A37F" />
        <path d="M16.5 10.5C16.5 9.5 15.5 8.5 14.5 8.5C14.0 8.5 13.5 8.7 13.2 9.0L12.0 9.8L10.8 9.0C10.5 8.7 10.0 8.5 9.5 8.5C8.5 8.5 7.5 9.5 7.5 10.5C7.5 11.0 7.7 11.5 8.0 11.8L8.8 13.0L8.0 14.2C7.7 14.5 7.5 15.0 7.5 15.5C7.5 16.5 8.5 17.5 9.5 17.5C10.0 17.5 10.5 17.3 10.8 17.0L12.0 16.2L13.2 17.0C13.5 17.3 14.0 17.5 14.5 17.5C15.5 17.5 16.5 16.5 16.5 15.5C16.5 15.0 16.3 14.5 16.0 14.2L15.2 13.0L16.0 11.8C16.3 11.5 16.5 11.0 16.5 10.5Z" fill="white" />
      </svg>
    );
  } else if (n === 'notebooklm') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#0F9D58" />
        <path d="M17 6H7C5.9 6 5 6.9 5 8V16C5 17.1 5.9 18 7 18H17C18.1 18 19 17.1 19 16V8C19 6.9 18.1 6 17 6ZM12 16H7V15H12V16ZM17 13H7V12H17V13ZM17 10H7V9H17V10Z" fill="white" />
      </svg>
    );
  } else if (n === 'midjourney') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#8B5CF6" />
        <path d="M12 5C8.13 5 5 8.13 5 12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12C19 8.13 15.87 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" fill="white" />
        <circle cx="12" cy="12" r="3" fill="#E8BA00" />
      </svg>
    );
  } else if (n === 'perplexity') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#0D9488" />
        <path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM13 14H11V10H13V14Z" fill="white" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#64748B" />
      <path d="M12 6V18M6 12H18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

interface AITool {
  name: string;
  type: string;
  desc: string;
  icon: string;
  color: string;
  pricing: string;
  useCase: string;
  pros: string[];
}

interface AIToolkitProps {
  onSelectTool: (tool: AITool) => void;
}

export const AIToolkit = ({ onSelectTool }: AIToolkitProps) => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await aiToolService.getAiTools();
        setTools(data);
      } catch (err: any) {
        console.error('Failed to load AI tools:', err);
        setError(err.message || 'Failed to load AI tools.');
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  return (
    <div className="space-y-12 text-left">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-[#1800ad] tracking-tight">AI Toolkit Hub</h1>
        <p className="text-gray-550 text-base md:text-lg max-w-2xl font-light leading-relaxed">
          Your gateway to the world's most powerful AI models. One-click access to elite intelligence.
        </p>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1800ad] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Synchronizing elite toolkit profiles...</p>
        </div>
      ) : error ? (
        <div className="py-40 flex flex-col items-center justify-center text-center space-y-4">
          <Symbol name="error" className="text-5xl text-red-500" />
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8">
          {tools.map((tool, i) => (
            <div key={i} className="group relative bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all p-4 md:p-8 flex flex-col items-start overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#e8ba00]/50"></div>
              
              <div className="flex justify-between items-start w-full mb-4 md:mb-8">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border border-gray-100 ${tool.color || 'bg-white'}`}>
                  <ToolLogo name={tool.name} className="w-6 h-6 md:w-10 md:h-10" />
                </div>
                <span className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black tracking-widest uppercase ${
                  tool.type === 'FREE' ? 'bg-[#e8ba00]/10 text-[#e8ba00]' : 'bg-[#f3f0ff] text-[#6d28d9]'
                }`}>
                  {tool.type}
                </span>
              </div>

              <h3 className="text-sm md:text-xl font-display font-bold text-[#1800ad] mb-1 md:mb-3">{tool.name}</h3>
              <p className="text-[8px] md:text-xs text-gray-505 text-gray-500 leading-relaxed font-medium mb-4 md:mb-10 min-h-0 md:min-h-[48px] line-clamp-2 md:line-clamp-none">
                {tool.desc}
              </p>

              <button 
                onClick={() => onSelectTool(tool)}
                className="w-full py-2.5 md:py-4 bg-[#1800ad] text-white rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 transition-colors hover:bg-black mt-auto cursor-pointer border-none"
              >
                Analyze <Symbol name="query_stats" className="text-xs md:text-lg" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIToolkit;
