import React from 'react';
import { Symbol } from '../components/ui/Symbol';

interface ToolDetailProps {
  tool: {
    name: string;
    type: string;
    desc: string;
    icon: string;
    color: string;
    pricing: string;
    pros: string[];
    useCase: string;
  };
  onBack: () => void;
}

export const ToolDetail = ({ tool, onBack }: ToolDetailProps) => {
  return (
    <div className="space-y-12 pb-24 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1800ad] hover:border-[#1800ad] transition-all shadow-sm"
        >
          <Symbol name="arrow_back" className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-[#1800ad]">{tool.name}</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tool Specification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Hero Section */}
          <div className="bg-white rounded-[48px] p-12 border border-gray-100 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1800ad]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className={`w-32 h-32 rounded-3xl shrink-0 flex items-center justify-center p-6 shadow-inner border border-gray-50 ${tool.color}`}>
               <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain" />
            </div>

            <div className="space-y-6 flex-1">
               <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-1.5 bg-[#e8ba00]/10 text-[#e8ba00] text-[10px] font-black uppercase tracking-widest rounded-full">{tool.type}</span>
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Available</span>
               </div>
               <h2 className="text-4xl font-display font-bold text-[#1800ad]">Powerful {tool.name} Intelligence</h2>
               <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
            </div>
          </div>

          {/* Advantages Section */}
          <div className="space-y-8">
            <h3 className="text-xl font-display font-bold text-[#1800ad] flex items-center gap-3">
              <Symbol name="verified" className="text-2xl" /> Key Advantages
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {tool.pros.map((pro, i) => (
                 <div key={i} className="flex gap-4 p-6 bg-white rounded-3xl border border-gray-100 items-start">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                       <Symbol name="check" className="text-lg" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{pro}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Best Use Case */}
          <div className="bg-white rounded-[48px] p-12 text-gray-900 border border-gray-100 shadow-xl relative overflow-hidden group">
            <Symbol name="lightbulb" className="absolute -right-8 -bottom-8 text-9xl text-[#1800ad]/5 opacity-40 group-hover:scale-110 transition-transform" />
            <h4 className="text-[10px] font-black text-[#e8ba00] uppercase tracking-[0.3em] mb-6">Optimized Use Case</h4>
            <p className="text-lg font-display leading-relaxed text-gray-600 max-w-2xl">{tool.useCase}</p>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm space-y-8 sticky top-24">
              <div>
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Pricing Model</label>
                 <div className="p-6 bg-gray-50 rounded-3xl">
                    <div className="text-2xl font-display font-bold text-[#1800ad]">{tool.pricing}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Starting Plan</div>
                 </div>
              </div>

              <div className="space-y-4">
                 <button className="w-full py-5 bg-[#1800ad] text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/20 active:scale-95">
                    Open Tool <Symbol name="arrow_forward" />
                 </button>
                 <button className="w-full py-5 bg-white text-[#1800ad] border border-gray-100 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
                    Share Specification <Symbol name="share" />
                 </button>
              </div>

              <div className="pt-6 border-t border-gray-50">
                 <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                   Access to this tool depends on your current subscription status at JagoAiSchool. <strong>Free users</strong> can access up to 3 tools.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
