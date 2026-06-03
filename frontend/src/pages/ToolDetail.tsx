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

const getToolUrl = (name: string) => {
  switch (name.toLowerCase()) {
    case 'gemini': return 'https://gemini.google.com';
    case 'claude': return 'https://claude.ai';
    case 'notebooklm': return 'https://notebooklm.google.com';
    case 'chatgpt': return 'https://chatgpt.com';
    case 'midjourney': return 'https://midjourney.com';
    case 'perplexity': return 'https://perplexity.ai';
    default: return 'https://google.com';
  }
};

const getToolRichContent = (name: string) => {
  switch (name.toLowerCase()) {
    case 'gemini':
      return {
        overview: "Gemini adalah model kecerdasan buatan multimodal tercanggih yang dikembangkan oleh Google. Model ini dirancang dari awal untuk menjadi multimodal secara native, yang berarti dapat memahami, mengoperasikan, dan menggabungkan berbagai jenis informasi secara mulus, termasuk teks, kode, gambar, audio, dan video.\n\nDengan integrasi ekosistem Google Workspace, Gemini mampu merangkum email, membuat draf dokumen di Docs, menganalisis data spreadsheet, serta memproses context window yang sangat besar (hingga 1-2 juta token) yang memungkinkan Anda memasukkan ratusan halaman paper riset atau codebase proyek sekaligus tanpa memecah file.",
        tips: [
          "Manfaatkan integrasi Google Workspace untuk menyusun dokumen di Docs atau menganalisis email langsung di Gmail secara real-time.",
          "Gunakan fitur multimodal dengan mengunggah gambar diagram arsitektur sistem, wireframe UI, atau potongan video pendek dan mintalah analisis terperinci.",
          "Gunakan token context window yang besar untuk mengunggah codebase penuh dan mintalah review bug logika atau optimasi performa."
        ],
        workflow: "Riset Multimodal, Analisis Codebase Skala Besar & Integrasi Cloud Google"
      };
    case 'claude':
      return {
        overview: "Claude adalah asisten AI generasi berikutnya yang dibangun oleh Anthropic dengan fokus pada keamanan, kegunaan, dan keandalan tingkat tinggi. Dikenal secara luas karena kemampuan analisisnya yang mendalam, pemahaman konteks panjang, dan keahlian koding serta penulisan teknis yang luar biasa.\n\nClaude memiliki keunggulan besar dalam memecahkan masalah logika pemrograman, menjelaskan konsep matematika dan fisika yang rumit, serta menulis dokumentasi sistem yang bersih. Fitur Artifacts-nya memungkinkan pengguna berinteraksi langsung dengan antarmuka web, bagan Mermaid, dokumen Markdown, dan kode program secara visual di sebelah percakapan utama.",
        tips: [
          "Gunakan fitur Claude Projects untuk mengunggah berkas petunjuk (guidelines) proyek agar jawaban tetap konsisten dengan arsitektur codebase Anda.",
          "Manfaatkan panel 'Artifacts' untuk merancang mock-up web interaktif (HTML/JS/React) dan meninjau hasilnya secara langsung.",
          "Minta Claude untuk melakukan audit keamanan (security audit) pada file konfigurasi docker atau potongan kode sensitif Anda."
        ],
        workflow: "Rekayasa Kode Kompleks, Refactoring Arsitektur & Penulisan Dokumen Teknis"
      };
    case 'notebooklm':
      return {
        overview: "NotebookLM adalah buku catatan virtual bertenaga AI inovatif dari Google yang menggunakan model Gemini untuk membantu Anda mensintesis, menganalisis, dan mempelajari kumpulan dokumen riset Anda. Model ini bertindak sebagai kolaborator penelitian pribadi yang berakar penuh pada dokumen sumber yang Anda sediakan.\n\nSetiap tanggapan dari NotebookLM menyertakan kutipan nomor baris dari dokumen asli Anda, memastikan bahwa analisis bebas dari halusinasi dan mudah diverifikasi. Anda juga dapat menghasilkan klip Audio Overview—sebuah diskusi podcast interaktif antara dua pembawa acara AI yang sangat realistis untuk menjelaskan isi materi.",
        tips: [
          "Unggah paper penelitian (PDF), catatan Google Docs, transkrip wawancara, atau tautan YouTube untuk membuat basis pengetahuan lokal Anda.",
          "Gunakan fitur generator panduan belajar (study guides) dan daftar FAQ otomatis untuk bersiap menghadapi ujian akademik atau presentasi proyek.",
          "Gunakan fitur Audio Overview untuk mendengarkan rangkuman diskusi interaktif dalam format podcast saat bermobilitas."
        ],
        workflow: "Sintesis Paper Riset, Penyusunan Buku Catatan Proyek & Pembuatan Podcast Edukasi"
      };
    case 'chatgpt':
      return {
        overview: "ChatGPT adalah asisten percakapan serba guna terpopuler dari OpenAI yang menyediakan perpustakaan GPT kustom yang sangat melimpah. Model GPT-4o yang tersemat di dalamnya sangat cepat, multimodal, dan memiliki ekosistem plugin serta integrasi suara real-time paling canggih saat ini.\n\nDengan tersedianya GPT Store, Anda dapat mengakses ribuan alat bantu AI khusus seperti generator bagan, asisten penulisan SEO, asisten koding bahasa tertentu, hingga generator mockup UI kreatif yang dirancang langsung oleh komunitas developer global.",
        tips: [
          "Gunakan Custom GPTs di GPT Store untuk tugas-tugas spesifik seperti desain grafis DALL-E 3 atau generator struktur SQL database.",
          "Gunakan Advanced Voice Mode untuk melatih percakapan bahasa asing secara natural dengan aksen dan intonasi yang fleksibel.",
          "Aktifkan integrasi web search untuk melakukan pencarian berita terbaru dan memverifikasi referensi secara instan."
        ],
        workflow: "Brainstorming Ide Cepat, Prototyping Aplikasi & Penulisan Kreatif Multimodal"
      };
    case 'midjourney':
      return {
        overview: "Midjourney adalah mesin kecerdasan buatan generatif visual terkemuka yang menghasilkan gambar fotorealistik dan karya seni artistik bernilai tinggi melalui deskripsi teks (prompt). Model ini sangat disukai oleh desainer grafis dan seniman karena kualitas estetika gambarnya yang menakjubkan dan resolusi tinggi.\n\nMidjourney berjalan secara native di platform Discord dan web, memberikan kontrol parameter yang sangat presisi atas pencahayaan, gaya seni, rasio aspek, serta kemampuan untuk memadukan (blend) beberapa gambar referensi sekaligus untuk melahirkan kreasi visual baru yang konsisten.",
        tips: [
          "Gunakan parameter format seperti `--ar 16:9` untuk rasio lanskap atau `--v 6.0` untuk menggunakan engine render paling detail.",
          "Gunakan perintah `/describe` dengan mengunggah gambar referensi untuk mempelajari bagaimana model menerjemahkan visual tersebut ke dalam teks prompt.",
          "Gunakan parameter `--cref` (character reference) dan `--sref` (style reference) untuk menjaga konsistensi karakter wajah dalam komik atau presentasi visual."
        ],
        workflow: "Pembuatan Aset UI/UX Mockup, Desain Ilustrasi Kreatif & Visualisasi Konsep Seni"
      };
    case 'perplexity':
      return {
        overview: "Perplexity adalah mesin pencarian bertenaga AI (conversational search engine) yang didesain untuk menyajikan jawaban langsung yang ringkas dan akurat. Tidak seperti Google Pencarian tradisional yang hanya memberikan daftar tautan, Perplexity langsung menelusuri web dan merangkum temuannya.\n\nSetiap kalimat penjelasan yang ditulis oleh Perplexity menyertakan kutipan link sumber asli, menjadikannya alat yang sangat andal untuk akademisi, jurnalis, dan developer dalam memverifikasi referensi, mencari dokumentasi API terkini, atau melacak rilis hardware terbaru tanpa terganggu oleh iklan SEO spam.",
        tips: [
          "Gunakan mode 'Pro Search' untuk analisis mendalam di mana AI akan mengajukan pertanyaan klarifikasi sebelum meluncurkan pencarian multi-tahap.",
          "Filter pencarian Anda berdasarkan platform khusus: 'Academic' (untuk paper ilmiah), 'Writing' (tanpa akses web), atau 'YouTube'.",
          "Manfaatkan fitur 'Pages' untuk menyusun hasil pencarian riset Anda menjadi artikel blog yang rapi dan siap dibagikan ke publik."
        ],
        workflow: "Riset Literatur Akademis, Pelacakan Dokumentasi API Terbaru & Pencarian Fakta Real-time"
      };
    default:
      return {
        overview: "Asisten AI canggih untuk membantu mempercepat produktivitas dan alur kerja Anda.",
        tips: [
          "Gunakan petunjuk yang jelas, berikan contoh (few-shot prompting), dan tentukan format output yang Anda inginkan.",
          "Lakukan iterasi pada jawaban model untuk mendapatkan hasil akhir terbaik."
        ],
        workflow: "Produktivitas & Efisiensi Kerja Umum"
      };
  }
};

export const ToolDetail = ({ tool, onBack }: ToolDetailProps) => {
  const richContent = getToolRichContent(tool.name);
  const toolUrl = getToolUrl(tool.name);

  return (
    <div className="space-y-12 pb-24 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#1800ad] hover:border-[#1800ad] transition-all shadow-sm cursor-pointer"
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
               <ToolLogo name={tool.name} className="w-full h-full object-contain" />
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

          {/* Detailed Overview Section */}
          <div className="bg-white rounded-[48px] p-8 md:p-12 border border-gray-100 shadow-xl space-y-6">
            <h3 className="text-xl font-display font-bold text-[#1800ad] flex items-center gap-3">
              <Symbol name="info" className="text-2xl text-[#e8ba00]" /> Deskripsi Mendalam & Analisis
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-medium">
              {richContent.overview}
            </p>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mt-4">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Alur Kerja Utama</span>
              <p className="text-sm font-bold text-[#1800ad]">{richContent.workflow}</p>
            </div>
          </div>

          {/* Advantages Section */}
          <div className="space-y-8">
            <h3 className="text-xl font-display font-bold text-[#1800ad] flex items-center gap-3">
              <Symbol name="verified" className="text-2xl text-emerald-600" /> Key Advantages
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

          {/* Prompt Engineering Tips Section */}
          <div className="bg-white rounded-[48px] p-8 md:p-12 border border-gray-100 shadow-xl space-y-6">
            <h3 className="text-xl font-display font-bold text-[#1800ad] flex items-center gap-3">
              <Symbol name="tips_and_updates" className="text-2xl text-[#e8ba00]" /> Tips Penggunaan Maksimal (Prompt Engineering)
            </h3>
            <ul className="space-y-4">
              {richContent.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-lg bg-[#e8ba00]/10 text-[#e8ba00] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-black">{idx + 1}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
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
                 <button 
                   onClick={() => window.open(toolUrl, '_blank', 'noopener,noreferrer')}
                   className="w-full py-5 bg-[#1800ad] text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1800ad]/20 active:scale-95 cursor-pointer border-none"
                 >
                    Open Tool <Symbol name="arrow_forward" />
                 </button>
                 <button className="w-full py-5 bg-white text-[#1800ad] border border-gray-100 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all cursor-pointer">
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
