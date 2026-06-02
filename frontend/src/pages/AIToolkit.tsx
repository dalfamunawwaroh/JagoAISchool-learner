import React, { useState, useEffect } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { aiToolService } from '../services/api';

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
                  <img src={tool.icon} alt={tool.name} className="w-6 h-6 md:w-10 md:h-10 object-contain" />
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
