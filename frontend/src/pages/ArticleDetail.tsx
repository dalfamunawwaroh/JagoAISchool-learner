import React from 'react';
import { Symbol } from '../components/ui/Symbol';

interface ArticleDetailProps {
  article: {
    title: string;
    desc: string;
    author: string;
    date: string;
    readTime: string;
    img: string;
    category: string;
    content?: string;
  };
  onBack: () => void;
}

export const ArticleDetail = ({ article, onBack }: ArticleDetailProps) => {
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
          <h1 className="text-2xl font-display font-bold text-[#1800ad] line-clamp-1 max-w-2xl">{article.title}</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Knowledge Hub • {article.category}</p>
        </div>
      </div>

      <article className="max-w-4xl mx-auto space-y-12">
        {/* Hero Image */}
        <div className="aspect-[21/9] w-full rounded-[48px] overflow-hidden border border-gray-100 shadow-2xl">
          <img src={article.img} className="w-full h-full object-cover" alt={article.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center gap-6 pb-10 border-b border-gray-100">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                 <img src={`https://i.pravatar.cc/100?u=${article.author}`} className="w-full h-full object-cover" alt={article.author} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Written By</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-display font-bold text-[#1800ad]">{article.author}</span>
                  <Symbol name="verified" className="text-emerald-500 text-lg" fill />
                </div>
              </div>
              <div className="ml-auto flex items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>

            <div className="prose prose-blue max-w-none space-y-8">
               <p className="text-xl font-display leading-relaxed text-gray-900 font-medium">
                 {article.desc}
               </p>
               
               {article.content ? (
                 <div className="space-y-6">
                   {article.content.split('\n').map((paragraph, idx) => (
                     <p key={idx} className="text-gray-600 leading-relaxed">
                       {paragraph}
                     </p>
                   ))}
                 </div>
               ) : (
                 <>
                   <p className="text-gray-600 leading-relaxed">
                     The architecture of modern large language models has undergone a paradigm shift. No longer just simple predictors of the next word, these systems are now equipped with reasoning loops and memory architectures that allow them to process complex, multi-step instructions with clinical precision.
                   </p>
                   <div className="bg-gray-50 rounded-4xl p-10 border border-gray-100 italic text-gray-500 font-display">
                     "Intelligence is not just about having information, but about the ability to process that information into actionable wisdom."
                   </div>
                   <p className="text-gray-600 leading-relaxed">
                     Experts predict that by early 2027, the gap between specialized human engineers and advanced AI agents will narrow significantly in domains like debugging and architectural reviews. However, the creative spark—the ability to innovate beyond existing datasets—remains the final frontier for human excellence.
                   </p>
                 </>
               )}
            </div>

            {/* Tag Cloud */}
            <div className="flex flex-wrap gap-3 pt-12 border-t border-gray-100">
               {["Artificial Intelligence", "Deep Learning", "Future Tech", "NLP"].map(tag => (
                 <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-[#1800ad] hover:text-white transition-colors cursor-pointer">
                   #{tag}
                 </span>
               ))}
            </div>
          </div>

          {/* Side Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-6">
                <h4 className="text-sm font-display font-bold text-[#1800ad]">Share Insights</h4>
                <div className="flex gap-4">
                  <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1800ad] transition-all"><Symbol name="share" /></button>
                  <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1800ad] transition-all"><Symbol name="bookmark" /></button>
                  <button className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-[#1800ad] transition-all"><Symbol name="more_horiz" /></button>
                </div>
              </div>

              <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-6">
                <Symbol name="auto_awesome" className="text-3xl text-[#e8ba00]" />
                <h4 className="text-lg font-display font-bold text-[#1800ad]">Related Intelligence</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Based on your interests, we recommend exploring our "Advanced NLP" track in the Course portal.</p>
                <button className="w-full py-4 bg-[#1800ad] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Go to Portal</button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
