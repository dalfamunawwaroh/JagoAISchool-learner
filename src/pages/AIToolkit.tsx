import React from 'react';
import { Symbol } from '../components/ui/Symbol';

interface AIToolkitProps {
  onSelectTool: (tool: any) => void;
}

export const AIToolkit = ({ onSelectTool }: AIToolkitProps) => {
  const tools = [
    { 
      name: 'Gemini', 
      type: 'FREE', 
      desc: 'Advanced multimodal reasoning across text, code, and vision.', 
      icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d473530437e922917e997.svg', 
      color: 'bg-white',
      pricing: 'Free to use',
      pros: [
        'Best in class reasoning',
        'Large context window (1M tokens)',
        'Native multimodal capabilities',
        'Integrated with Google Workspace'
      ],
      useCase: 'Sangat cocok untuk merangkum dokumen panjang, analisis kode kompleks, dan pemrosesan gambar/video secara native.'
    },
    { 
      name: 'Claude', 
      type: 'PRO ACCESS', 
      desc: 'The gold standard for nuance, reasoning, and context.', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Claude_Logo.png', 
      color: 'bg-[#f7f3f0]',
      pricing: '$20 / month',
      pros: [
        'Exceptional writing style',
        'Minimal hallucinations',
        'Superior safety guardrails',
        'Strong logical consistency'
      ],
      useCase: 'Ideal untuk penulisan kreatif, penyuntingan naskah, dan tugas yang membutuhkan akurasi faktual tinggi serta nuansa bahasa yang halus.'
    },
    { 
      name: 'NotebookLM', 
      type: 'FREE', 
      desc: 'Your personalized AI research assistant for complex docs.', 
      icon: 'https://www.gstatic.com/images/branding/product/2x/notelm_24dp.png', 
      color: 'bg-white',
      pricing: 'Free to use',
      pros: [
        'Instant source citations',
        'Auto-summary of PDFs',
        'Podcast-style audio overview',
        'Deep semantic search'
      ],
      useCase: 'Terbaik untuk mahasiswa dan peneliti yang ingin membedah puluhan PDF sekaligus dan mencari benang merah antar dokumen.'
    },
    { 
      name: 'ChatGPT', 
      type: 'FREE', 
      desc: 'Versatile AI for creative writing, coding, and general tasks.', 
      icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', 
      color: 'bg-white',
      pricing: 'Freemium',
      pros: [
        'Massive plugin ecosystem',
        'Dynamic web browsing',
        'Powerful memory feature',
        'Industry-standard performance'
      ],
      useCase: 'Alat serbaguna untuk hampir semua tugas—mulai dari bantuan koding harian hingga pembuatan draf email dan brainstorming ide.'
    },
    { 
      name: 'Midjourney', 
      type: 'PRO ACCESS', 
      desc: "The world's leading generative AI for high-fidelity art.", 
      icon: 'https://images.unsplash.com/photo-1620712943543-bcc4628c9759?w=100&h=100&fit=crop', 
      color: 'bg-white',
      pricing: 'From $10 / month',
      pros: [
        'Unmatched aesthetic quality',
        'Extreme stylization control',
        'High resolution upscaling',
        'Consistent character generation'
      ],
      useCase: 'Wajib bagi desainer grafis dan seniman digital yang membutuhkan aset visual kelas dunia dengan gaya artistik yang unik.'
    },
    { 
      name: 'Perplexity', 
      type: 'FREE', 
      desc: 'Real-time answer engine with deep citations for research.', 
      icon: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop', 
      color: 'bg-[#1a1a1a]',
      pricing: 'Freemium',
      pros: [
        'Source-first approach',
        'Real-time news search',
        'Pro model switching',
        'Direct file uploads'
      ],
      useCase: 'Pengganti mesin pencari tradisional bagi Anda yang menginginkan jawaban instan dengan sumber referensi yang jelas dan terpercaya.'
    }
  ];

  return (
    <div className="space-y-12 text-left">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-[#1800ad] tracking-tight">AI Toolkit Hub</h1>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl font-light leading-relaxed">
          Your gateway to the world's most powerful AI models. One-click access to elite intelligence.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8">
        {tools.map((tool, i) => (
          <div key={i} className="group relative bg-white rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all p-4 md:p-8 flex flex-col items-start overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#e8ba00]/50"></div>
            
            <div className="flex justify-between items-start w-full mb-4 md:mb-8">
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border border-gray-100 ${tool.color}`}>
                <img src={tool.icon} alt={tool.name} className="w-6 h-6 md:w-10 md:h-10 object-contain" />
              </div>
              <span className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black tracking-widest uppercase ${
                tool.type === 'FREE' ? 'bg-[#e8ba00]/10 text-[#e8ba00]' : 'bg-[#f3f0ff] text-[#6d28d9]'
              }`}>
                {tool.type}
              </span>
            </div>

            <h3 className="text-sm md:text-xl font-display font-bold text-[#1800ad] mb-1 md:mb-3">{tool.name}</h3>
            <p className="text-[8px] md:text-xs text-gray-500 leading-relaxed font-medium mb-4 md:mb-10 min-h-0 md:min-h-[48px] line-clamp-2 md:line-clamp-none">
              {tool.desc}
            </p>

            <button 
              onClick={() => onSelectTool(tool)}
              className="w-full py-2.5 md:py-4 bg-[#1800ad] text-white rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 transition-colors hover:bg-black mt-auto"
            >
              Analyze <Symbol name="query_stats" className="text-xs md:text-lg" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

