import React from 'react';
import { Symbol } from '../components/ui/Symbol';

export const Article = ({ onReadMore }: { onReadMore: (article: any) => void }) => {
  const categories = ["Vision", "NLP", "Robotics", "Ethics", "Generative AI", "Reinforcement", "Deep Learning", "UTBK PREP"];
  
  const articles = [
    {
      title: "Panduan Lengkap Persiapan UTBK SNBT 2027",
      desc: "Persiapan UTBK 2027 perlu dimulai lebih awal dengan membangun pola pikir konsisten, memahami 7 subtes UTBK, dan rutin simulasi. Fokus pada analisis soal dan penguasaan materi terstruktur.",
      author: "Mentor JagoAI",
      date: "May 12, 2026",
      readTime: "10 min read",
      img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&fit=crop",
      category: "UTBK PREP",
      content: `Persiapan UTBK 2027 harus dimulai sedini mungkin (sejak kelas XI) dengan fokus pada 7 subtes utama: Penalaran Umum, Pengetahuan Umum, Pemahaman Bacaan, Pengetahuan Kuantitatif, Literasi Bahasa Indonesia/Inggris, dan Penalaran Matematika. Fokus pada pemahaman konsep, drilling soal, dan latihan manajemen waktu (skor tertinggi 650-750+).\n\nBerikut panduan persiapan subtes UTBK SNBT 2027 berdasarkan struktur 2026:\n\n1. Materi Subtes UTBK (TPS & Literasi)\nTes Potensi Skolastik (TPS):\n- Penalaran Umum (PU): Penalaran induktif, deduktif, dan kuantitatif (30 soal/30 menit).\n- Pengetahuan & Pemahaman Umum (PPU): Sinonim, antonim, makna kata, dan pemahaman wacana (20 soal/15 menit).\n- Kemampuan Memahami Bacaan & Menulis (KMBM): Gagasan utama, kalimat efektif, EYD (20 soal/25 menit).\n- Pengetahuan Kuantitatif (PK): Aljabar, aritmatika, geometri, dan logika matematika (20 soal/20 menit).\n\n2. Strategi Persiapan Efektif\n- Pahami Materi UTBK: Pelajari secara mendalam materi tes potensi skolastik dan literasi.\n- Bangun Pola Belajar Konsisten: Mulai belajar dari sekarang tanpa menunggu mood, konsistensi adalah kunci.\n- Latihan Soal Secara Terstruktur: Latih kemampuan analisis soal dengan sering latihan logika berpikir.\n- Ikuti Simulasi/Tryout: Rutin mengikuti tryout untuk mengukur kemampuan dan adaptasi tekanan waktu.\n- Strategi Pemilihan Program Studi: Tentukan target PTN dan prodi sejak dini agar motivasi belajar terjaga.`
    },
    {
      title: "Understanding Transformers: Beyond the Attention Mechanism",
      desc: "Transformers have revolutionized NLP, but their core architectural strengths often go ignored. We dive into the latent space and cross-attention mechanics that power state-of-the-art LLMs.",
      author: "Dr. Julian Voss",
      date: "May 7, 2026",
      readTime: "5 min read",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&fit=crop",
      category: "NEURAL NETS"
    },
    {
      title: "The Rise of Edge AI in Industrial Robotic Systems",
      desc: "Latency is the enemy of automation. Explore how local inference on edge devices is enabling real-time decision making in factory lines without cloud dependencies.",
      author: "Prof. Sarah Chen",
      date: "May 5, 2026",
      readTime: "8 min read",
      img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&fit=crop",
      category: "ROBOTICS"
    },
    {
      title: "Tactical Prompting for Multi-Agent Workflows",
      desc: "Designing prompts for a single LLM is easy. Designing prompts that allow a swarm of agents to collaborate and cross-verify their outputs is the new frontier of AI engineering.",
      author: "Admin JagoAI",
      date: "May 4, 2026",
      readTime: "12 min read",
      img: "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=400&fit=crop",
      category: "GENERATIVE AI"
    },
    {
      title: "Regulatory Frameworks: Navigating Global AI Governance",
      desc: "With new mandates emerging across the EU and North America, how can startups ensure compliance while maintaining a fast-paced innovation cycle?",
      author: "Dr. Michael H.",
      date: "May 2, 2026",
      readTime: "12 min read",
      img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&fit=crop",
      category: "ETHICS"
    },
    {
      title: "Efficient Quantization: Running 70B Models on Consumer GPUs",
      desc: "From 4-bit to 1.5-bit quantization, we explore the latest techniques in model compression that are democratizing high-end AI research for everyone.",
      author: "Admin JagoAI",
      date: "April 30, 2026",
      readTime: "10 min read",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=400&fit=crop",
      category: "DEEP LEARNING"
    },
    {
      title: "AI in Clinical Trials: Accelerating Drug Discovery",
      desc: "How pharmaceutical giants are using generative models to predict protein folding and candidate success rates, cutting years off traditional R&D timelines.",
      author: "Mentor Sophia",
      date: "April 28, 2026",
      readTime: "15 min read",
      img: "https://images.unsplash.com/photo-1532187863486-abf9d39d6618?w=400&fit=crop",
      category: "VISION"
    },
    {
      title: "The Death of Traditional SEO in the Age of Search Generative Experience",
      desc: "As search engines shift from list-of-links to direct-answer engines, how should content creators adapt their strategy to remain visible?",
      author: "Admin JagoAI",
      date: "April 25, 2026",
      readTime: "6 min read",
      img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&fit=crop",
      category: "NLP"
    },
    {
      title: "Reinforcement Learning from Human Feedback (RLHF) Deep Dive",
      desc: "Go behind the scenes of how LLMs are aligned with human values and preferences through iterative reward modeling and policy optimization.",
      author: "Admin JagoAI",
      date: "April 22, 2026",
      readTime: "18 min read",
      img: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400&fit=crop",
      category: "REINFORCEMENT"
    }
  ];

  const trendingNews = [
    { type: 'TECH ALERT', title: 'NVIDIA announces next-gen H200 chips for specialized academic researchers.' },
    { type: 'CAMPUS NEWS', title: 'JagoAiSchool partnership with OpenAI unlocks new GPT-5 private beta for PRO learners.' },
    { type: 'BREAKTHROUGH', title: 'Researchers find more efficient way to fine-tune LLMs with 40% less memory usage.' }
  ];

  return (
    <div className="space-y-12 pb-24 text-left">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-[#1800ad] tracking-tight">AI Insights & News</h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed font-light">Stay ahead of the curve with the latest breakthroughs in Artificial Intelligence, curated by our expert Mentors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Feed */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-10">
          {articles.map((art, i) => (
            <div key={i} className="bg-white rounded-2xl md:rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-3 md:p-10 flex flex-col md:flex-row gap-4 md:gap-10 items-center group">
              <div className="w-full md:w-64 h-32 md:h-48 rounded-xl md:rounded-[32px] overflow-hidden shrink-0">
                <img src={art.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={art.title} />
              </div>
              <div className="flex-1 space-y-2 md:space-y-6 text-left w-full">
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <span className="px-2 md:px-5 py-0.5 md:py-1.5 bg-[#e8ba00]/10 text-[#e8ba00] text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-full">{art.category.split(' ')[0]}</span>
                  <span className="text-[7px] md:text-[9px] font-bold text-gray-400 uppercase hidden sm:inline">{art.date}</span>
                </div>
                <div>
                  <h3 className="text-[11px] md:text-2xl font-display font-bold text-[#1800ad] leading-tight mb-1 md:mb-3 group-hover:text-[#e8ba00] transition-colors line-clamp-2">{art.title}</h3>
                  <div className="flex items-center gap-1.5 mb-2 md:mb-4">
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-400">By {art.author.split(' ')[0]}</span>
                    <Symbol name="verified" className="text-emerald-500 text-[10px] md:text-xs" fill />
                  </div>
                  <p className="text-gray-500 text-[9px] md:text-xs leading-relaxed line-clamp-2 hidden sm:block">{art.desc}</p>
                </div>
                <button 
                  onClick={() => onReadMore(art)}
                  className="flex items-center gap-1 md:gap-2 text-[8px] md:text-[10px] font-black text-[#1800ad] uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Read <Symbol name="arrow_forward" className="text-xs md:text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Trending News */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm transition-colors space-y-8">
            <h4 className="text-xl font-display font-bold text-[#1800ad] flex items-center gap-3">
              <Symbol name="trending_up" className="text-[#e8ba00]" /> Trending News
            </h4>
            <div className="space-y-8">
              {trendingNews.map((news, i) => (
                <div key={i} className="space-y-2 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                  <p className="text-[9px] font-black text-[#e8ba00] uppercase tracking-widest">{news.type}</p>
                  <p className="text-xs font-bold text-gray-900 leading-relaxed hover:text-[#1800ad] cursor-pointer transition-colors">{news.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Cloud */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm transition-colors space-y-8">
            <h4 className="text-lg font-display font-bold text-[#1800ad]">Category Cloud</h4>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <span 
                  key={cat} 
                  className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all bg-gray-50 text-gray-400 hover:bg-[#eef2ff] hover:text-[#1800ad]"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Article;
