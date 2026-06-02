import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Symbol } from '../components/ui/Symbol';

interface LandingProps {
  onNavigateToAuth: (mode: 'login' | 'register') => void;
  lang?: 'id' | 'en';
}

interface LandingCourse {
  id: number;
  title: string;
  category: string;
  author: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
  badge?: string;
  image: string;
  skills: string[];
}

export const Landing = ({ onNavigateToAuth, lang = 'id' }: LandingProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<'id' | 'en'>(lang);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<LandingCourse | null>(null);
  const [selectedFeatureTab, setSelectedFeatureTab] = useState<'sandbox' | 'consult' | 'lms' | 'forums'>('sandbox');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Internationalization text helper
  const t = {
    id: {
      searchPlaceholder: 'Cari apa saja... (Python, prompt engineering, machine learning)',
      categories: 'Kategori',
      features: 'Fitur Unggulan',
      login: 'Masuk',
      register: 'Daftar',
      heroTag: 'PENAWARAN TERBATAS',
      heroHeadline: 'Kuasai Teknologi Terdepan Besok, Mulai Belajar Hari Ini',
      heroSub: 'Belajar AI dari dasar hingga tingkat lanjut. Kursus interaktif, bimbingan langsung mentor Telkom University & JagoAI Lab, dan pengerjaan projek nyata.',
      promoTitle: 'Penawaran Berakhir Cepat!',
      promoLeft: 'Sisa waktu 4 jam lagi untuk diskon hingga 85%',
      coursesTitle: 'Pilihan Kursus Terpopuler untuk Anda',
      coursesSub: 'Kembangkan karir Anda dengan materi berkualitas tinggi dari pelaku industri JagoAI.',
      enrollBtn: 'Mulai Pembelajaran Sekarang',
      whyTitle: 'Mengapa Belajar di JagoAI School?',
      why1Title: 'Konsultasi Privat 1-on-1',
      why1Desc: 'Jadwalkan langsung sesi konsultasi tatap muka bersama mentor senior untuk me-review skripsi atau projek AI Anda.',
      why2Title: 'Live AI Coding Sandbox',
      why2Desc: 'Eksplorasi langsung model machine learning & generator prompt interaktif di konsol belajar, tanpa instalasi lokal.',
      why3Title: 'Diselaraskan Industri',
      why3Desc: 'Kurikulum praktis bermutu tinggi yang langsung dirancang oleh pakar AI ternama dan disesuaikan kualifikasi masa kini.',
      why4Title: 'Forum Kolaborasi',
      why4Desc: 'Diskusikan teori, bug coding, dan kolaborasi projek tim secara aktif bersama sesama siswa dari seluruh penjuru negeri.',
      categoriesTitle: 'Kategori Unggulan',
      bestseller: 'Terlaris',
      ratings: 'Rating',
      buyNow: 'Beli Sekarang',
      seeDetail: 'Detail Kursus',
      footerSlogan: 'Akademi pembelajaran AI interaktif bertaraf nasional.',
      institutionalAccess: 'Akses Institusi',
      faqTitle: 'Pertanyaan Sering Diajukan (FAQ)',
      faq1Quest: 'Apakah JagoAI School cocok untuk pemula tanpa background IT?',
      faq1Ans: 'Tentu! Kami memiliki kurikulum terstruktur khusus pemula (AI untuk SMP / SMA) yang mengajarkan logika dasar pemrograman dan AI dengan ilustrasi ramah serta seru.',
      faq2Quest: 'Bagaimana cara melakukan sesi konsultasi dengan mentor?',
      faq2Ans: 'Siswa JagoAI dapat memilih jadwal mentor yang tersedia di menu Layanan Konsultasi platform, lalu masuk ke ruang konferensi video personal sesuai waktu yang dipilih.',
      faq3Quest: 'Bagaimana sistem pembayaran kursus di JagoAI?',
      faq3Ans: 'Kami mendukung transfer bank lokal, e-wallet utama (GoPay, OVO, Dana), dan kartu kredit. Semua transaksi terjamin aman.'
    },
    en: {
      searchPlaceholder: 'Search anything... (Python, prompt engineering, machine learning)',
      categories: 'Categories',
      features: 'Key Features',
      login: 'Log In',
      register: 'Sign Up',
      heroTag: 'LIMITED TIME OFFER',
      heroHeadline: 'Master Tomorrow\'s Technology, Start Learning Today',
      heroSub: 'Learn AI from scratch to advanced. Interactive courses, direct guidance from Telkom University & JagoAI Lab mentors, and real projects.',
      promoTitle: 'Deals Expiring Soon!',
      promoLeft: 'Only 4 hours left for massive discounts up to 85%',
      coursesTitle: 'Most Popular Courses for You',
      coursesSub: 'Accelerate your career development with high-quality syllabus materials from JagoAI industry leaders.',
      enrollBtn: 'Start Learning Now',
      whyTitle: 'Why Study at JagoAI School?',
      why1Title: 'Private 1-on-1 Consultations',
      why1Desc: 'Schedule face-to-face coaching sessions directly with expert mentors to review code, thesis, or personal AI startups.',
      why2Title: 'Interactive AI Sandbox',
      why2Desc: 'Create prototype models and custom generator parameters immediately in code editor screens without local configurations.',
      why3Title: 'Industry Aligned Syllabus',
      why3Desc: 'Structured sequences verified by major companies, targeted at practical performance indicators in enterprise ecosystems.',
      why4Title: 'Cooperative Student Guilds',
      why4Desc: 'Engage actively with study mates post-modul, share code repositories, post technical bugs, and work together on hackathons.',
      categoriesTitle: 'Top Categories',
      bestseller: 'Bestseller',
      ratings: 'Ratings',
      buyNow: 'Enroll Now',
      seeDetail: 'Course Detail',
      footerSlogan: 'A nationally benchmarked interactive AI education platform.',
      institutionalAccess: 'Institutional Access',
      faqTitle: 'Frequently Asked Questions (FAQ)',
      faq1Quest: 'Is JagoAI School suitable for IT absolute beginners?',
      faq1Ans: 'Absolutely! We offer specialized entry tracks (AI for Middle & High School level) explaining key concepts with easy visual paradigms prior to advanced modules.',
      faq2Quest: 'How can I establish a direct consulting session?',
      faq2Ans: 'Once registered, users can access the Consultation panel, filter through mentor focus areas, pick an available slot, and launch instant video feeds.',
      faq3Quest: 'What checkout channels are integrated?',
      faq3Ans: 'Payments can be settled through local Indonesian bank transfers, mainstream e-wallets, or secure secure transaction gateways.'
    }
  }[selectedLanguage];

  const courseList: LandingCourse[] = [
    {
      id: 1,
      title: 'Generative AI Mastery: Prompt Engineering & LLM',
      category: 'Generative AI',
      author: 'Dr. Aris Setiawan, JagoAI Lab',
      rating: 4.9,
      reviewsCount: 1540,
      price: 149000,
      originalPrice: 999000,
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
      skills: ['ChatGPT API', 'LangChain', 'Prompt Tuning', 'Vector DB', 'RAG']
    },
    {
      id: 2,
      title: 'Pemrograman PyTorch untuk Visi Komputer Klasik',
      category: 'Vision',
      author: 'Rian Hidayat, M.T., Telkom University',
      rating: 4.8,
      reviewsCount: 924,
      price: 129000,
      originalPrice: 790000,
      badge: 'Hot',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600',
      skills: ['PyTorch', 'CNN', 'Image Segmentation', 'YOLOv8', 'TensorFlow']
    },
    {
      id: 3,
      title: 'Sistem Robotika Cerdas & Edge AI IoT',
      category: 'Robotics',
      author: 'Prof. Bambang Subiyanto',
      rating: 5.0,
      reviewsCount: 148,
      price: 199000,
      originalPrice: 1200000,
      badge: 'Advanced',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
      skills: ['ROS2', 'Raspberry Pi 5', 'MicroPython', 'Computer Vision', 'Deep Learning']
    },
    {
      id: 4,
      title: 'Natural Language Processing (NLP) dengan HuggingFace',
      category: 'NLP',
      author: 'Annisa Rahma, Ph.D Candidate',
      rating: 4.7,
      reviewsCount: 412,
      price: 149000,
      originalPrice: 850000,
      badge: 'Baru',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600',
      skills: ['Transformers', 'BERT', 'Text Generation', 'Sentiment Analysis', 'HuggingFace Client']
    },
    {
      id: 5,
      title: 'Etika, Hukum, & Tata Kelola Kecerdasan Buatan',
      category: 'Ethical AI',
      author: 'Mega Lestari, LL.M, JagoAI Counsel',
      rating: 4.9,
      reviewsCount: 220,
      price: 99000,
      originalPrice: 499000,
      badge: 'Kritis',
      image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600',
      skills: ['AI Regulations', 'Privacy Protection', 'Bias Auditing', 'ISO 42001', 'Algorithm Safety']
    },
    {
      id: 6,
      title: 'Matematika Aljabar Linear mendalam untuk Machine Learning',
      category: 'Mathematics',
      author: 'Ahmad Zakaria, M.Sc',
      rating: 4.8,
      reviewsCount: 1450,
      price: 129000,
      originalPrice: 690000,
      badge: 'Dasar Kokoh',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
      skills: ['Linear Algebra', 'Calculus', 'Probability', 'Optimization Methods', 'NumPy Programming']
    },
    {
      id: 7,
      title: 'Persiapan SNBT Pengetahuan Kuantitatif 2026',
      category: 'UTBK Prep',
      author: 'Tim Akademik JagoAI',
      rating: 4.9,
      reviewsCount: 2100,
      price: 119000,
      originalPrice: 899000,
      badge: 'Top Seller',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
      skills: ['UTBK 2026 Matematika', 'Trik Cepat Aljabar', 'Logika Analitik', 'Simulasi SNBT']
    },
    {
      id: 8,
      title: 'Membaca Cepat & Literasi Bahasa Inggris SNBT Hebat',
      category: 'UTBK Prep',
      author: 'Grace Sitorus, M.A.',
      rating: 4.8,
      reviewsCount: 1320,
      price: 99000,
      originalPrice: 599000,
      badge: 'Populer',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
      skills: ['Reading Comprehension', 'Vocab Power', 'Sentence Ordering', 'Grammar Secrets']
    }
  ];

  // Filters logic
  const filteredCourses = courseList.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = ['Semua', 'Generative AI', 'Vision', 'Robotics', 'NLP', 'Mathematics', 'UTBK Prep'];

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen text-gray-800 font-sans selection:bg-[#e8ba00] selection:text-black leading-relaxed flex flex-col text-left">

      {/* 1. TOP NAV BAR (PREMIUM JAGOAI BRANDED) */}
      <nav id="landing-navbar" className="bg-white/95 backdrop-blur-md border-b border-gray-100 py-3.5 px-4 md:px-10 sticky top-0 z-[1000] shadow-sm flex items-center justify-between gap-4 h-14 sm:h-16">

        {/* Left: Brand Logo (Beautifully visible on all screens) */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => { setSearchTerm(''); setSelectedCategory('Semua'); setIsMobileMenuOpen(false); }}>
          <div className="w-10 h-10 bg-[#1800ad] rounded-xl flex items-center justify-center shadow-md">
            <Symbol name="cognition" className="text-white text-2xl" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg sm:text-xl font-display font-bold text-gray-900 tracking-tighter leading-none italic">
              Jago<span className="text-[#e8ba00]">AI</span>
            </span>
            <span className="text-[9px] font-bold text-[#1800ad] tracking-[0.25em] uppercase block">School</span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links (Hidden on mobile/tablet, shown on lg PC screens) */}
        <div className="hidden lg:flex items-center gap-10 xl:gap-14 text-xs font-bold uppercase tracking-wider text-gray-600">
          <button
            onClick={() => scrollToSection('landing-hero')}
            className="hover:text-[#1800ad] cursor-pointer transition-colors duration-200 text-left border-none bg-transparent font-bold"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('landing-courses')}
            className="hover:text-[#1800ad] cursor-pointer transition-colors duration-200 text-left border-none bg-transparent font-bold"
          >
            Courses
          </button>
          <button
            onClick={() => scrollToSection('landing-why')}
            className="hover:text-[#1800ad] cursor-pointer transition-colors duration-200 text-left border-none bg-transparent font-bold"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('landing-testimonials')}
            className="hover:text-[#1800ad] cursor-pointer transition-colors duration-200 text-left border-none bg-transparent font-bold"
          >
            Testimonials
          </button>
          <button
            onClick={() => scrollToSection('landing-faq')}
            className="hover:text-[#1800ad] cursor-pointer transition-colors duration-200 text-left border-none bg-transparent font-bold"
          >
            FAQ
          </button>
        </div>

        {/* Right content controls */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Desktop Language Selector (Hidden on mobile/tablet, shown on lg PC screens) */}
          <button
            onClick={() => setSelectedLanguage(selectedLanguage === 'id' ? 'en' : 'id')}
            className="hidden lg:flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-[#1800ad] transition-colors cursor-pointer mr-2"
          >
            <Symbol name="language" className="text-sm" />
            <span>{selectedLanguage === 'id' ? 'Bahasa: Indonesia' : 'Language: English'}</span>
          </button>

          <button
            onClick={() => onNavigateToAuth('login')}
            className="hidden lg:inline-flex px-5 py-2 border border-[#1800ad] text-[#1800ad] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
          >
            {t.login}
          </button>

          <button
            onClick={() => onNavigateToAuth('register')}
            className="hidden lg:inline-flex px-5 py-2 bg-[#1800ad] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all shadow-md cursor-pointer active:scale-95 whitespace-nowrap"
          >
            {t.register}
          </button>

          {/* Navigation Menu Toggle Button - ONLY shown on mobile/tablet (lg:hidden) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors active:scale-90 shadow-sm cursor-pointer"
            title="Menu"
          >
            <Symbol name={isMobileMenuOpen ? "close" : "menu"} className="text-xl font-bold" />
          </button>
        </div>

        {/* Dropdown Menu List for mobile/tablet screen sizes only */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl py-6 px-6 md:px-20 z-50 flex flex-col gap-6 text-left"
            >
              <div className="flex flex-col gap-1.5 font-bold uppercase text-xs tracking-widest text-gray-500">
                <button
                  onClick={() => { scrollToSection('landing-hero'); setIsMobileMenuOpen(false); }}
                  className="hover:text-[#1800ad] hover:translate-x-1 transition-all py-3.5 text-left bg-transparent border-b border-gray-50 font-bold cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => { scrollToSection('landing-courses'); setIsMobileMenuOpen(false); }}
                  className="hover:text-[#1800ad] hover:translate-x-1 transition-all py-3.5 text-left bg-transparent border-b border-gray-50 font-bold cursor-pointer"
                >
                  Courses
                </button>
                <button
                  onClick={() => { scrollToSection('landing-why'); setIsMobileMenuOpen(false); }}
                  className="hover:text-[#1800ad] hover:translate-x-1 transition-all py-3.5 text-left bg-transparent border-b border-gray-50 font-bold cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => { scrollToSection('landing-testimonials'); setIsMobileMenuOpen(false); }}
                  className="hover:text-[#1800ad] hover:translate-x-1 transition-all py-3.5 text-left bg-transparent border-b border-gray-50 font-bold cursor-pointer"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => { scrollToSection('landing-faq'); setIsMobileMenuOpen(false); }}
                  className="hover:text-[#1800ad] hover:translate-x-1 transition-all py-3.5 text-left bg-transparent border-b border-gray-50 font-bold cursor-pointer"
                >
                  FAQ
                </button>
                <button
                  onClick={() => setSelectedLanguage(selectedLanguage === 'id' ? 'en' : 'id')}
                  className="hover:text-[#1800ad] transition-colors py-3.5 text-left bg-transparent font-bold cursor-pointer flex items-center justify-between"
                >
                  <span>{selectedLanguage === 'id' ? 'Bahasa: Indonesia' : 'Language: English'}</span>
                  <span className="text-[10px] bg-gray-100 px-2.5 py-1 rounded font-mono uppercase font-bold">{selectedLanguage}</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { onNavigateToAuth('login'); setIsMobileMenuOpen(false); }}
                  className="flex-1 py-3.5 border border-[#1800ad] text-[#1800ad] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50 transition-all text-center flex items-center justify-center cursor-pointer"
                >
                  {t.login}
                </button>

                <button
                  onClick={() => { onNavigateToAuth('register'); setIsMobileMenuOpen(false); }}
                  className="flex-1 py-3.5 bg-[#1800ad] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all shadow-md text-center flex items-center justify-center cursor-pointer"
                >
                  {t.register}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. THE DYNAMIC PREMISES HERO BILLBOARD (CLEAN UNTITLED UI STYLE) */}
      <header id="landing-hero" className="relative bg-white text-gray-900 py-10 md:py-24 px-4 md:px-10 lg:px-20 overflow-hidden border-b border-gray-100">

        {/* Soft elegant glowing organic background blobs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#1800ad]/5 rounded-full blur-[100px] pointer-events-none select-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-14 relative z-10 text-left">

          {/* Left Column Text & Action Area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="flex-1 space-y-6 md:space-y-8 max-w-xl"
          >
            <div className="space-y-3 md:space-y-4">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#1800ad] uppercase bg-[#1800ad]/5 px-3 py-1.5 rounded-full inline-block">
                {selectedLanguage === 'id' ? 'PUSAT BELAJAR AI TERDEPAN' : 'PIONEER AI EDUCATION CENTER'}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-display font-bold text-gray-900 leading-[1.15] md:leading-[1.1] tracking-tight">
                {selectedLanguage === 'id' ? 'Kuasai Teknologi Terdepan Besok, Mulai Belajar Hari Ini' : 'Master Tomorrow’s Leading Technology, Start Learning Today'}
              </h1>
              <p className="text-gray-650 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                {selectedLanguage === 'id'
                  ? 'Belajar AI dari dasar hingga tingkat lanjut. Kursus interaktif, bimbingan langsung Tentor & JagoAI, dan pengerjaan projek nyata.'
                  : 'Learn AI from scratch to advanced. Interactive courses, 1-on-1 mentorship with Telkom University experts, and real-world project portfolios.'}
              </p>
            </div>

            {/* Overlapping student avatar reviews */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex -space-x-1.5 sm:-space-x-2">
                <img className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" referrerPolicy="no-referrer" alt="Siswa JagoAI" />
                <img className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" referrerPolicy="no-referrer" alt="Siswa JagoAI" />
                <img className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" referrerPolicy="no-referrer" alt="Siswa JagoAI" />
                <img className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=100&h=100&fit=crop" referrerPolicy="no-referrer" alt="Siswa JagoAI" />
                <img className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" referrerPolicy="no-referrer" alt="Siswa JagoAI" />
              </div>
              <div className="text-left leading-none">
                <div className="flex items-center text-amber-500 gap-0.5">
                  <Symbol name="star" className="text-[10px] sm:text-xs" fill={true} />
                  <Symbol name="star" className="text-[10px] sm:text-xs" fill={true} />
                  <Symbol name="star" className="text-[10px] sm:text-xs" fill={true} />
                  <Symbol name="star" className="text-[10px] sm:text-xs" fill={true} />
                  <Symbol name="star" className="text-[10px] sm:text-xs" fill={true} />
                  <span className="text-xs font-bold text-gray-900 ml-1.5">4.9</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-gray-400 font-semibold mt-1 block">
                  {selectedLanguage === 'id' ? 'dari 1,200+ ulasan' : 'from 1,200+ global reviews'}
                </span>
              </div>
            </div>

            {/* Premium action CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onNavigateToAuth('register')}
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-[#1800ad] hover:bg-black text-white rounded-2xl font-bold text-[11px] sm:text-xs uppercase tracking-widest hover:shadow-xl active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{selectedLanguage === 'id' ? 'Mulai Pembelajaran Sekarang' : 'Start Your Free Trial Now'}</span>
                <Symbol name="arrow_forward" className="text-sm" />
              </button>
            </div>
          </motion.div>

          {/* Right Column Student Hero Image Overlay */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full relative group"
          >
            {/* The main rounded image matching reference */}
            <div className="rounded-[24px] sm:rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 relative aspect-[4/3] bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                alt="AI Student Preview"
                referrerPolicy="no-referrer"
              />

              {/* Elegant floating preview plate overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 md:p-8 flex flex-col justify-end text-left text-white">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Floating glassmorphism play button */}
                  <button
                    onClick={() => onNavigateToAuth('login')}
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all transform hover:scale-105 cursor-pointer shrink-0"
                  >
                    <Symbol name="play_arrow" className="text-xl sm:text-2xl fill-1" />
                  </button>
                  <div className="space-y-0.5">
                    <span className="text-[8px] sm:text-[9.5px] font-bold uppercase text-white/55 tracking-widest">{selectedLanguage === 'id' ? 'PRATINJAU KURSUS' : 'COURSE PREVIEW'}</span>
                    <p className="text-[10px] sm:text-xs md:text-sm font-bold text-white line-clamp-1">
                      {selectedLanguage === 'id' ? 'Materi Utama JagoAI School & Kurikulum Sains Data' : 'The Ultimate JagoAI School & Data Science Course'}
                    </p>
                  </div>
                </div>

                {/* Ribbon partners below */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/10 pt-3 sm:pt-5 pt-3 mt-3 sm:mt-5 text-center">
                  <div className="space-y-0.5">
                    <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-[#e8ba00] block">PROMPT</span>
                    <span className="text-[6.5px] sm:text-[8px] uppercase tracking-widest text-white/50 block font-mono">{selectedLanguage === 'id' ? 'Terpopuler' : 'Popular'}</span>
                  </div>
                  <div className="space-y-0.5 border-x border-white/10">
                    <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-white block">MACHINE</span>
                    <span className="text-[6.5px] sm:text-[8px] uppercase tracking-widest text-white/50 block font-mono">{selectedLanguage === 'id' ? 'Kurikulum' : 'Syllabus'}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-rose-400 block">DATA SCI</span>
                    <span className="text-[6.5px] sm:text-[8px] uppercase tracking-widest text-white/50 block font-mono">{selectedLanguage === 'id' ? 'Portofolio' : 'Portfolio'}</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </header>



      {/* 4. THE ULTIMATE KURSUS GRID (UDEMY ACCENT FLAVOR) */}
      <section id="landing-courses" className="max-w-7xl mx-auto py-20 px-4 md:px-10 lg:px-20 space-y-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 text-left">
            <span className="text-[10px] font-bold text-[#1800ad] uppercase tracking-[0.25em] bg-[#1800ad]/5 px-3 py-1.5 rounded-full inline-block">
              {selectedLanguage === 'id' ? 'Katalog Pembelajaran' : 'Curriculum Catalog'}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">
              {t.coursesTitle}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm max-w-xl font-medium leading-relaxed">
              {t.coursesSub}
            </p>
          </div>
        </div>

        {/* Categories Tab selector (Glass pills) */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2.5 pb-4 border-b border-gray-100">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); }}
              className={`px-3 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${selectedCategory === cat
                ? 'bg-[#1800ad] text-white shadow-lg shadow-[#1800ad]/20 scale-102 font-bold'
                : 'bg-white text-gray-500 border border-gray-200/60 hover:text-gray-900 hover:border-gray-300'
                }`}
            >
              {cat === 'all' || cat === 'Semua' ? (selectedLanguage === 'id' ? 'Semua Kursus' : 'All Courses') : cat}
            </button>
          ))}
        </div>

        {/* Dynamic Courses grid layout */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                layout
                key={course.id}
                onClick={() => setSelectedCourseDetail(course)}
                className="group bg-white border border-gray-100 rounded-xl xs:rounded-2xl sm:rounded-[28px] overflow-hidden flex flex-col h-full shadow-[0_2px_10px_rgba(0,0,0,0.01)] sm:shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(11,0,110,0.06)] hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left relative"
              >
                {/* Course Image Wrapper */}
                <div className="relative aspect-video overflow-hidden shrink-0 bg-gray-100">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />

                  {/* Badge Row overlay */}
                  <div className="absolute top-1.5 left-1.5 xs:top-3 xs:left-3 flex flex-col gap-1 items-start">
                    {course.badge && (
                      <span className="bg-gradient-to-r from-[#1800ad] to-[#0e0066] text-white px-1.5 py-0.5 xs:px-3.5 xs:py-1.5 rounded-md xs:rounded-xl text-[6px] xs:text-[8px] font-black uppercase tracking-widest shadow-sm">
                        {course.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-1.5 right-1.5 xs:bottom-3 xs:right-3 bg-black/40 backdrop-blur-md text-white p-1 xs:p-2.5 rounded-md xs:rounded-xl border border-white/10">
                    <Symbol name={
                      course.category === 'Vision' ? 'visibility' :
                        course.category === 'Robotics' ? 'precision_manufacturing' :
                          course.category === 'NLP' ? 'translate' :
                            course.category === 'Generative AI' ? 'auto_awesome' : 'auto_stories'
                    } className="text-[10px] xs:text-sm" />
                  </div>
                </div>

                {/* Course Texts */}
                <div className="p-2.5 xs:p-3.5 sm:p-5.5 flex-1 flex flex-col justify-between space-y-2 xs:space-y-4">
                  <div className="space-y-1.5 xs:space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] xs:text-[8.5px] font-mono font-black text-[#1800ad] uppercase tracking-wider bg-[#1800ad]/5 px-1 py-0.5 xs:px-2.5 xs:py-1 rounded-sm xs:rounded-md">{course.category}</span>
                      <span className="text-[7px] xs:text-[9px] font-bold text-gray-400">#0{course.id}</span>
                    </div>

                    <h3 className="text-[9.5px] xs:text-[11px] sm:text-sm font-bold text-gray-900 group-hover:text-[#1800ad] transition-colors line-clamp-2 min-h-[28px] xs:min-h-10 leading-tight sm:leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-[8px] xs:text-[10px] text-gray-400 font-medium line-clamp-1">{course.author}</p>

                    {/* Visual Key Skills Badges inside Course Card! (Hidden on mobile to save space) */}
                    <div className="hidden sm:flex flex-wrap gap-1 pt-1">
                      {course.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="text-[8px] font-black uppercase tracking-wider text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                          {skill}
                        </span>
                      ))}
                      {course.skills.length > 3 && (
                        <span className="text-[8px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-md">+{course.skills.length - 3}</span>
                      )}
                    </div>

                    {/* Stars ratings */}
                    <div className="flex items-center gap-0.5 xs:gap-1 pt-0.5">
                      <span className="text-[9px] xs:text-xs font-bold text-amber-600">{course.rating.toFixed(1)}</span>
                      <div className="flex items-center text-amber-500">
                        <Symbol name="star" className="text-[9px] xs:text-xs fill-1" />
                      </div>
                      <span className="text-[7.5px] xs:text-[10px] text-gray-400 font-bold">({course.reviewsCount.toLocaleString()})</span>
                    </div>
                  </div>

                  {/* Info details (No price as requested) */}
                  <div className="pt-2 xs:pt-3.5 border-t border-gray-100 flex flex-row items-center justify-between gap-1">
                    <div className="flex items-center gap-0.5 xs:gap-1.5 text-[8px] xs:text-[10.5px] text-gray-500 font-bold whitespace-nowrap">
                      <Symbol name="menu_book" className="text-[#1800ad] text-[9px] xs:text-xs" />
                      <span>{course.skills.length} Modul</span>
                    </div>
                    {/* View Button */}
                    <span className="text-[8px] xs:text-[10px] font-bold uppercase text-[#1800ad] flex items-center gap-0.2 hover:translate-x-0.5 transition-transform whitespace-nowrap">
                      <span>{selectedLanguage === 'id' ? 'Lihat' : 'View'}</span>
                      <Symbol name="chevron_right" className="text-[9px] xs:text-xs" />
                    </span>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-[22px] bg-gray-50 flex items-center justify-center text-gray-400 shadow-inner">
              <Symbol name="search_off" className="text-3xl" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-700">Tidak ada kursus yang cocok</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">Kami tidak dapat menemukan pencarian Anda. Coba kata kunci yang lebih umum.</p>
            </div>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Semua'); }}
              className="text-xs font-black text-[#1800ad] uppercase tracking-wider hover:underline"
            >
              Reset Filter Pencarian
            </button>
          </div>
        )}

      </section>

      {/* 5. STATS SUMMARY COMPONENT (TABS COMPONETIZED IN LANDING CARD) */}
      <section className="bg-gradient-to-br from-[#1800ad] to-[#120084] text-white py-16 px-4 md:px-10 lg:px-20 text-center relative overflow-hidden mt-8">
        <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-[#e8ba00]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-white/5 rounded-full blur-[80px]"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-1 sm:gap-4 relative z-10">
          <div className="space-y-1 border-r border-white/10 last:border-0 text-center">
            <span className="text-sm xs:text-xl sm:text-3xl md:text-5xl font-display font-bold text-[#e8ba00] block tracking-tight">40+</span>
            <span className="text-[6.5px] xs:text-[8px] sm:text-[10px] md:text-xs font-bold uppercase text-white/60 tracking-widest block">{selectedLanguage === 'id' ? 'KURIKULUM' : 'MODULES'}</span>
          </div>
          <div className="space-y-1 border-r border-white/10 last:border-0 text-center">
            <span className="text-sm xs:text-xl sm:text-3xl md:text-5xl font-display font-bold text-[#e8ba00] block tracking-tight">15</span>
            <span className="text-[6.5px] xs:text-[8px] sm:text-[10px] md:text-xs font-bold uppercase text-white/60 tracking-widest block">{selectedLanguage === 'id' ? 'MENTOR AHLI' : 'EXPERT MENTORS'}</span>
          </div>
          <div className="space-y-1 border-r border-white/10 last:border-0 text-center">
            <span className="text-sm xs:text-xl sm:text-3xl md:text-5xl font-display font-bold text-[#e8ba00] block tracking-tight">12.5k+</span>
            <span className="text-[6.5px] xs:text-[8px] sm:text-[10px] md:text-xs font-bold uppercase text-white/60 tracking-widest block">{selectedLanguage === 'id' ? 'SISWA' : 'ENROLLED'}</span>
          </div>
          <div className="space-y-1 last:border-0 text-center">
            <span className="text-sm xs:text-xl sm:text-3xl md:text-5xl font-display font-bold text-[#e8ba00] block tracking-tight">99.2%</span>
            <span className="text-[6.5px] xs:text-[8px] sm:text-[10px] md:text-xs font-bold uppercase text-white/60 tracking-widest block">{selectedLanguage === 'id' ? 'KEPUASAN' : 'SATISFACTION'}</span>
          </div>
        </div>
      </section>

      {/* 6. WHY JAGOAI (TAILWIND BENTO GRID STYLE) */}
      <section id="landing-why" className="bg-[#f0f3f6] py-24 px-4 md:px-10 lg:px-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto space-y-16">

          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-[10px] font-bold text-[#1800ad] uppercase tracking-[0.25em] bg-[#1800ad]/5 px-3 py-1.5 rounded-full inline-block">
              {selectedLanguage === 'id' ? 'PRESTASI BELAJAR' : 'LEARNING PERFORMANCE'}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">
              {t.whyTitle}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm font-medium">
              {selectedLanguage === 'id'
                ? 'Fitur interaktif yang didesain khusus untuk melipatgandakan kecepatan belajar Anda.'
                : 'Interactive traits engineered specifically to amplify your computational skill acquisition speeds.'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">

            {/* Box 1 */}
            <div className="bg-white p-3.5 xs:p-5 sm:p-8 rounded-2xl sm:rounded-[32px] border border-gray-100/80 space-y-3 xs:space-y-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 sm:hover:-translate-y-1.5 transition-all flex flex-col justify-between text-left duration-300">
              <div className="space-y-2 xs:space-y-4">
                <div className="w-8 h-8 xs:w-12 xs:h-12 bg-indigo-50 text-[#1800ad] rounded-lg xs:rounded-2xl flex items-center justify-center shadow-inner">
                  <Symbol name="chat" className="text-base xs:text-2xl" />
                </div>
                <h3 className="text-xs xs:text-base font-bold text-gray-900 leading-snug xs:leading-tight">{t.why1Title}</h3>
                <p className="text-[9px] xs:text-xs text-gray-500 leading-relaxed font-medium line-clamp-4 xs:line-clamp-none">{t.why1Desc}</p>
              </div>
              <span className="text-[7.5px] xs:text-[9.5px] font-bold text-[#1d0a92] uppercase tracking-wider mt-2 xs:mt-4 flex items-center gap-0.5 cursor-pointer hover:underline" onClick={() => onNavigateToAuth('login')}>
                <span>{selectedLanguage === 'id' ? 'Mentoring' : 'Mentoring'}</span>
                <Symbol name="keyboard_arrow_right" className="text-xs" />
              </span>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-3.5 xs:p-5 sm:p-8 rounded-2xl sm:rounded-[32px] border border-gray-100/80 space-y-3 xs:space-y-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 sm:hover:-translate-y-1.5 transition-all flex flex-col justify-between text-left duration-300">
              <div className="space-y-2 xs:space-y-4">
                <div className="w-8 h-8 xs:w-12 xs:h-12 bg-amber-50 text-[#e8ba00] rounded-lg xs:rounded-2xl flex items-center justify-center shadow-inner">
                  <Symbol name="integration_instructions" className="text-base xs:text-2xl" />
                </div>
                <h3 className="text-xs xs:text-base font-bold text-gray-900 leading-snug xs:leading-tight">{t.why2Title}</h3>
                <p className="text-[9px] xs:text-xs text-gray-500 leading-relaxed font-medium line-clamp-4 xs:line-clamp-none">{t.why2Desc}</p>
              </div>
              <span className="text-[7.5px] xs:text-[9.5px] font-bold text-[#1800ad] uppercase tracking-wider mt-2 xs:mt-4 flex items-center gap-0.5 cursor-pointer hover:underline" onClick={() => onNavigateToAuth('login')}>
                <span>{selectedLanguage === 'id' ? 'Playground' : 'Sandbox'}</span>
                <Symbol name="keyboard_arrow_right" className="text-xs" />
              </span>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-3.5 xs:p-5 sm:p-8 rounded-2xl sm:rounded-[32px] border border-gray-100/80 space-y-3 xs:space-y-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 sm:hover:-translate-y-1.5 transition-all flex flex-col justify-between text-left duration-300">
              <div className="space-y-2 xs:space-y-4">
                <div className="w-8 h-8 xs:w-12 xs:h-12 bg-emerald-50 text-emerald-600 rounded-lg xs:rounded-2xl flex items-center justify-center shadow-inner">
                  <Symbol name="verified" className="text-base xs:text-2xl" />
                </div>
                <h3 className="text-xs xs:text-base font-bold text-gray-900 leading-snug xs:leading-tight">{t.why3Title}</h3>
                <p className="text-[9px] xs:text-xs text-gray-500 leading-relaxed font-medium line-clamp-4 xs:line-clamp-none">{t.why3Desc}</p>
              </div>
              <span className="text-[7.5px] xs:text-[9.5px] font-bold text-[#1d0a92] uppercase tracking-wider mt-2 xs:mt-4 flex items-center gap-0.5 cursor-pointer hover:underline" onClick={() => onNavigateToAuth('login')}>
                <span>{selectedLanguage === 'id' ? 'Kurikulum' : 'Syllabus'}</span>
                <Symbol name="keyboard_arrow_right" className="text-xs" />
              </span>
            </div>

            {/* Box 4 */}
            <div className="bg-white p-3.5 xs:p-5 sm:p-8 rounded-2xl sm:rounded-[32px] border border-gray-100/80 space-y-3 xs:space-y-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 sm:hover:-translate-y-1.5 transition-all flex flex-col justify-between text-left duration-300">
              <div className="space-y-2 xs:space-y-4">
                <div className="w-8 h-8 xs:w-12 xs:h-12 bg-purple-50 text-purple-600 rounded-lg xs:rounded-2xl flex items-center justify-center shadow-inner">
                  <Symbol name="groups" className="text-base xs:text-2xl" />
                </div>
                <h3 className="text-xs xs:text-base font-bold text-gray-900 leading-snug xs:leading-tight">{t.why4Title}</h3>
                <p className="text-[9px] xs:text-xs text-gray-500 leading-relaxed font-medium line-clamp-4 xs:line-clamp-none">{t.why4Desc}</p>
              </div>
              <span className="text-[7.5px] xs:text-[9.5px] font-bold text-[#1800ad] uppercase tracking-wider mt-2 xs:mt-4 flex items-center gap-0.5 cursor-pointer hover:underline" onClick={() => onNavigateToAuth('login')}>
                <span>{selectedLanguage === 'id' ? 'Komunitas' : 'Guild'}</span>
                <Symbol name="keyboard_arrow_right" className="text-xs" />
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE COMPREHENSIVE FEATURES SHOWCASE (UDEMY INSPIRED & NEXT-GEN JAGOAI) */}
      <section className="bg-white py-20 px-4 md:px-10 lg:px-20 border-b border-gray-100 overflow-hidden text-left relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1800ad]/1 rounded-full blur-[160px] pointer-events-none select-none"></div>

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-[#1800ad] uppercase tracking-[0.25em] bg-[#1800ad]/5 px-3.5 py-1.5 rounded-full inline-block">
              {selectedLanguage === 'id' ? 'Eksplorasi Platform Lebih Dalam' : 'Explore Platform Capabilities'}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight leading-snug">
              {selectedLanguage === 'id'
                ? 'Satu Platform, Semua Kebutuhan Pembelajaran AI Anda'
                : 'One Unified Platform for All Your AI Learning Milestones'}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm font-medium">
              {selectedLanguage === 'id'
                ? 'JagoAI School mengintegrasikan kurikulum industri dengan berbagai instrumen canggih untuk mempercepat pemahaman teknologi masa depan Anda.'
                : 'JagoAI School fuses enterprise syllabus guides with high-utility learning accelerators to bootstrap your tomorrow.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: Interactive Feature selector tabs */}
            <div className="lg:col-span-5 space-y-3 text-left">

              {/* Tab 1: AI Sandbox */}
              <button
                onClick={() => setSelectedFeatureTab('sandbox')}
                className={`w-full p-5 rounded-2xl text-left transition-all border block ${selectedFeatureTab === 'sandbox'
                  ? 'bg-[#1800ad]/5 border-[#1800ad]/20 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-[#1800ad]/[0.03] hover:border-[#1800ad]/10'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedFeatureTab === 'sandbox' ? 'bg-[#1800ad] text-white' : 'bg-gray-100 text-gray-505'
                    }`}>
                    <Symbol name="terminal" className="text-lg" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-gray-900 block">
                      {selectedLanguage === 'id' ? '1. AI Playground & Sandbox Interaktif' : '1. Interactive AI Sandbox'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium block leading-relaxed">
                      {selectedLanguage === 'id'
                        ? 'Latih model neural network, sesuaikan hyperparameter, dan rancang prompt engineering langsung dari browser Anda tanpa instalasi Python lokal.'
                        : 'Deploy live code tokens, audit deep neural learning weights, and configure LLM prompt templates inside pre-configured cloud environments.'}
                    </span>
                  </div>
                </div>
              </button>

              {/* Tab 2: Private Consultation */}
              <button
                onClick={() => setSelectedFeatureTab('consult')}
                className={`w-full p-5 rounded-2xl text-left transition-all border block ${selectedFeatureTab === 'consult'
                  ? 'bg-[#1800ad]/5 border-[#1800ad]/20 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-[#1800ad]/[0.03] hover:border-[#1800ad]/10'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedFeatureTab === 'consult' ? 'bg-[#1800ad] text-white' : 'bg-gray-100 text-gray-505'
                    }`}>
                    <Symbol name="calendar_month" className="text-lg" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-gray-900 block">
                      {selectedLanguage === 'id' ? '2. Bimbingan & Konsultasi 1-on-1' : '2. Direct 1-on-1 Mentorship'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium block leading-relaxed">
                      {selectedLanguage === 'id'
                        ? 'Selesai modul, jadwalkan bimbingan skripsi atau karir secara privat video conference bersama expert handal JagoAI & Telkom University.'
                        : 'Coordinate absolute focused video consultations with verified senior researchers to debug custom algorithms or optimize architectures.'}
                    </span>
                  </div>
                </div>
              </button>

              {/* Tab 3: Automated Quiz Feedbacks */}
              <button
                onClick={() => setSelectedFeatureTab('lms')}
                className={`w-full p-5 rounded-2xl text-left transition-all border block ${selectedFeatureTab === 'lms'
                  ? 'bg-[#1800ad]/5 border-[#1800ad]/20 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-[#1800ad]/[0.03] hover:border-[#1800ad]/10'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedFeatureTab === 'lms' ? 'bg-[#1800ad] text-white' : 'bg-gray-100 text-gray-505'
                    }`}>
                    <Symbol name="auto_awesome" className="text-lg" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-gray-900 block">
                      {selectedLanguage === 'id' ? '3. LMS & Feedback Kode Otomatis' : '3. Evaluator LMS with Live Autograder'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium block leading-relaxed">
                      {selectedLanguage === 'id'
                        ? 'Pengukur kemajuan belajar adaptif dengan generator pertanyaan otomatis dan visualisator tingkat penguasaan per-modul belajar.'
                        : 'Review step-by-step progress charts mapped alongside neural response feedback widgets that code-check structural syntax instantly.'}
                    </span>
                  </div>
                </div>
              </button>

              {/* Tab 4: Student guilds */}
              <button
                onClick={() => setSelectedFeatureTab('forums')}
                className={`w-full p-5 rounded-2xl text-left transition-all border block ${selectedFeatureTab === 'forums'
                  ? 'bg-[#1800ad]/5 border-[#1800ad]/20 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-[#1800ad]/[0.03] hover:border-[#1800ad]/10'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedFeatureTab === 'forums' ? 'bg-[#1800ad] text-white' : 'bg-gray-100 text-gray-505'
                    }`}>
                    <Symbol name="forum" className="text-lg" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-gray-900 block">
                      {selectedLanguage === 'id' ? '4. Komunitas & Kolaborasi Projek Lain' : '4. Peer Guilds & Shared Repositories'}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium block leading-relaxed">
                      {selectedLanguage === 'id'
                        ? 'Bergabunglah dengan forum belajar per-kursus, bagikan cuplikan kode andalan Anda, dan temukan tim untuk merintis projek hackathon nasional.'
                        : 'Discuss course concepts, coordinate code contributions, publish customized models, and join national student team hackathons.'}
                    </span>
                  </div>
                </div>
              </button>

            </div>            {/* Right Column: High-Fidelity UI Live Previews Mockup (SaaS Dashboard Layout) */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[24px] sm:rounded-[36px] p-4 sm:p-6 md:p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] relative overflow-hidden self-stretch flex items-center min-h-[380px] sm:min-h-[440px]">

              {/* Dynamic Inner Simulated Renderings with clean crisp light styles */}
              <div className="w-full text-slate-800 font-sans text-left space-y-4">

                <AnimatePresence mode="wait">
                  {selectedFeatureTab === 'sandbox' && (
                    <motion.div
                      key="preview-sandbox"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md tracking-wider">AI Toolkit Sandbox</span>
                          <span className="text-xs text-gray-800 font-bold hidden sm:inline">Model Playground</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          API Connected
                        </span>
                      </div>

                      {/* Mini AI-Toolkit Card Layout from logged-in AIToolkit.tsx */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 space-y-3 shadow-sm hover:border-[#1800ad]/30 transition-all">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=80&h=80&fit=crop" className="w-6 h-6 rounded-lg object-cover" alt="Gemini Concept" referrerPolicy="no-referrer" />
                              <span className="text-xs font-black text-gray-900">Gemini</span>
                            </div>
                            <span className="text-[7px] font-black tracking-widest uppercase bg-amber-100 text-[#715c00] px-1.5 py-0.5 rounded">FREE</span>
                          </div>
                          <div>
                            <span className="text-xs font-black text-gray-900 block">Gemini 1.5 Pro</span>
                            <span className="text-[9px] text-gray-400 block line-clamp-1 mt-0.5">Advanced multimodal reasoning.</span>
                          </div>
                          <button onClick={() => onNavigateToAuth('register')} className="w-full py-1.5 bg-[#1800ad] hover:bg-black text-white rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors">
                            <span>Analyze</span>
                            <Symbol name="query_stats" className="text-[10px]" />
                          </button>
                        </div>

                        <div className="bg-[#f7f3f0] p-4 rounded-2xl border border-gray-100 space-y-3 shadow-sm hover:border-[#1800ad]/30 transition-all">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <img src="https://images.unsplash.com/photo-1677442136019-21780efad99a?w=80&h=80&fit=crop" className="w-6 h-6 rounded-lg object-cover" alt="Claude Concept" referrerPolicy="no-referrer" />
                              <span className="text-xs font-black text-gray-950">Claude</span>
                            </div>
                            <span className="text-[7px] font-black tracking-widest uppercase bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">PRO</span>
                          </div>
                          <div>
                            <span className="text-xs font-black text-gray-950 block">Claude 3.5 Sonnet</span>
                            <span className="text-[9px] text-gray-500 block line-clamp-1 mt-0.5">Gold standard of logical nuance.</span>
                          </div>
                          <button onClick={() => onNavigateToAuth('register')} className="w-full py-1.5 bg-[#1800ad] hover:bg-black text-white rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors">
                            <span>Analyze</span>
                            <Symbol name="query_stats" className="text-[10px]" />
                          </button>
                        </div>
                      </div>

                      {/* Prompt and Output Area representing actual sandbox result */}
                      <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 space-y-2 text-xs">
                        <span className="text-[9px] text-gray-400 font-extrabold uppercase block font-mono">Simulated Model Output</span>
                        <div className="bg-white p-2.5 rounded-lg text-slate-700 border border-slate-100 text-[10px] leading-relaxed italic">
                          "Model Gemini tuned successfully with Learning Rate <span className="text-[#1800ad] font-bold">0.001</span> and optimal weights calculated in <span className="font-bold text-emerald-600">0.4s</span>."
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedFeatureTab === 'consult' && (
                    <motion.div
                      key="preview-consult"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">LIVE MENTOR HUB</span>
                        <span className="text-xs text-gray-800 font-bold">Konsultasi Tatap Muka</span>
                      </div>

                      {/* Mock Interactive Mentor Card list */}
                      <div className="space-y-3">

                        {/* Mentor Row 1 */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shrink-0" alt="Mentor" referrerPolicy="no-referrer" />
                            <div className="text-left">
                              <span className="text-xs sm:text-sm font-black text-gray-900 block">Dr. Annisa Rahma</span>
                              <span className="text-[9px] sm:text-[10px] text-gray-400 block mt-0.5">Ahli NLP & Model Generative AI</span>
                            </div>
                          </div>
                          <button onClick={() => onNavigateToAuth('login')} className="w-full sm:w-auto text-center px-4 py-2 bg-[#1800ad] hover:bg-black text-white rounded-xl text-[9px] sm:text-[9.5px] font-black uppercase tracking-wider transition-colors cursor-pointer justify-center block whitespace-nowrap">
                            Pilih Mentor
                          </button>
                        </div>

                        {/* Mentor Row 2 */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-80 shadow-sm">
                          <div className="flex items-center gap-3">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shrink-0" alt="Mentor 2" referrerPolicy="no-referrer" />
                            <div className="text-left">
                              <span className="text-xs sm:text-sm font-black text-gray-900 block">Rian Hidayat, M.T.</span>
                              <span className="text-[9px] sm:text-[10px] text-gray-400 block mt-0.5">Spesialis Visi Komputer & YOLO</span>
                            </div>
                          </div>
                          <span className="w-full sm:w-auto text-center px-4 py-2 bg-gray-100 text-gray-400 text-[8.5px] font-black uppercase tracking-wider rounded-xl block">
                            Penuh
                          </span>
                        </div>

                      </div>

                      {/* Interactive Calendar layout summary */}
                      <div className="bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10 p-4 rounded-2xl space-y-2">
                        <span className="text-[9px] font-black uppercase text-[#e8ba00] tracking-wider block">JADWAL BIMBINGAN AKTIF</span>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="w-9 h-9 rounded-xl bg-[#e8ba00]/10 text-[#e8ba00] flex flex-col items-center justify-center font-mono shrink-0 border border-[#e8ba00]/25">
                            <span className="text-[7.5px] font-bold uppercase leading-none block">OKT</span>
                            <span className="text-xs font-black block mt-0.5">14</span>
                          </div>
                          <div className="text-left leading-tight">
                            <span className="text-xs font-bold block text-gray-900">Review Tugas Akhir AI</span>
                            <span className="text-[10px] block mt-1 text-gray-400">14:00 WIB - Ruang Virtual Terbuka</span>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {selectedFeatureTab === 'lms' && (
                    <motion.div
                      key="preview-lms"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-[9px] font-black uppercase text-[#1800ad] bg-[#1800ad]/5 px-2.5 py-1 rounded-md">LMS & KEMAJUAN AKADEMIK</span>
                        <span className="text-xs text-gray-800 font-bold">Progress Dashboard</span>
                      </div>

                      {/* Course progress block identical to logged-in Dashboard.tsx */}
                      <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:border-[#1800ad]/20 transition-all">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                          <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&fit=crop" className="w-full h-full object-cover" alt="YOLO Course" />
                        </div>
                        <div className="flex-1 space-y-2 w-full text-left">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-[#150096] font-black uppercase bg-[#1800ad]/5 px-2 py-0.5 rounded-md">YOLO v8 Object Detection</span>
                            <span className="text-[#1800ad] font-black">65% Progress</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#1800ad] to-[#e8ba00] rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold">
                            <span>SKS: 3 Modul</span>
                            <span>Sertifikat Segera Siap</span>
                          </div>
                        </div>
                      </div>

                      {/* Course Sequence list in beautiful boxes */}
                      <div className="space-y-2">
                        <div className="bg-white border-l-2 border-emerald-500 px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] font-black">✓</div>
                            <span className="text-xs font-semibold text-gray-700 font-sans">Bab 1: Pengenalan Logika Pemrograman AI</span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">100%</span>
                        </div>

                        <div className="bg-white border-l-2 border-[#1800ad] px-3.5 py-2.5 rounded-xl flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-[#1800ad]/10 text-[#1800ad] flex items-center justify-center text-[9px] font-bold animate-pulse">●</div>
                            <span className="text-xs font-bold text-[#1800ad]">Bab 2: Pembuatan Prompt Cerdas & ChatGPT API</span>
                          </div>
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md font-mono animate-pulse">AKTIF</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedFeatureTab === 'forums' && (
                    <motion.div
                      key="preview-forums"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="text-[9px] font-black uppercase text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">FORUM DISKUSI AKTIF</span>
                        <span className="text-xs text-gray-800 font-bold">Kolaborasi Siswa</span>
                      </div>

                      {/* Discussion posts */}
                      <div className="space-y-3">
                        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 space-y-2 shadow-sm">
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="text-amber-600 font-black tracking-wider uppercase bg-amber-50 px-2 py-0.5 rounded-md">IDE BISNIS</span>
                            <span className="text-gray-400 font-bold">@ZulFikri • 2 jam lalu</span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">Bagaimana cara optimalkan performa model di ponsel spek rendah?</h4>
                          <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-1">
                            <span className="flex items-center gap-1"><Symbol name="thumb_up" className="text-[11px] text-[#1800ad]" /> 25 Suka</span>
                            <span className="flex items-center gap-1"><Symbol name="chat" className="text-[11px] text-sky-500" /> 8 Diskusi Aktif</span>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 space-y-2 shadow-sm">
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="text-emerald-600 font-black tracking-wider uppercase bg-emerald-50 px-2 py-0.5 rounded-md">TIM PROYEK</span>
                            <span className="text-gray-400 font-bold">@Amelia_S • Kemarin</span>
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">Mencari anggota tim untuk rintis asisten belajar berbasis sains data!</h4>
                          <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-1">
                            <span className="flex items-center gap-1"><Symbol name="thumb_up" className="text-[11px] text-[#1800ad]" /> 42 Suka</span>
                            <span className="flex items-center gap-1"><Symbol name="chat" className="text-[11px] text-sky-500" /> 15 Diskusi Aktif</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. CLASSIC INSPIRING TESTIMONY CAROUSEL SPLIT */}
      <section id="landing-testimonials" className="bg-white py-20 px-4 md:px-10 lg:px-20 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 space-y-4 text-left">
            <span className="text-[#e8ba00] font-bold text-xl">“</span>
            <h3 className="text-2xl md:text-3.5xl font-display font-bold text-gray-900 leading-tight tracking-tight">
              {selectedLanguage === 'id' ? 'Kisah Sukses Kreator Muda' : 'Real Stories from Young AI Pioneers'}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {selectedLanguage === 'id'
                ? 'Siswa kami telah membuktikan bahwa usia muda bukanlah halangan untuk merintis model deep learning mumpuni di Indonesia.'
                : 'Our students have proven that school age is no limit to engineering high-functioning neural architectures.'}
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-2 sm:gap-6 text-left">

            <div className="border border-gray-100 p-3.5 xs:p-6 rounded-2xl sm:rounded-[24px] bg-gray-50 flex flex-col justify-between space-y-4 shadow-sm">
              <p className="text-[9.5px] sm:text-xs font-bold text-gray-600 italic leading-relaxed line-clamp-6 sm:line-clamp-none">
                “Materi Generative AI sangat komplit. Saya bisa mengaitkan API model pembelajaran ke prototype program pemilah sampah sekolah. Ditambah konsultasi 1-on-1 dengan mentor JagoAI sangat seru!”
              </p>
              <div className="flex items-center gap-2 xs:gap-3">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop" className="w-7 h-7 xs:w-10 xs:h-10 rounded-full object-cover border border-white" alt="Siswa 1" />
                <div className="text-left leading-none">
                  <span className="text-[9px] xs:text-xs font-bold text-gray-900 block">Diki Hermawan</span>
                  <span className="text-[7.5px] xs:text-[10px] text-[#1800ad] font-bold block mt-0.5 xs:mt-1">Siswa SMA Telkom</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 p-3.5 xs:p-6 rounded-2xl sm:rounded-[24px] bg-gray-50 flex flex-col justify-between space-y-4 shadow-sm">
              <p className="text-[9.5px] sm:text-xs font-bold text-gray-600 italic leading-relaxed line-clamp-6 sm:line-clamp-none">
                “Mempelajari linear algebra dan PyTorch di platform interaktif JagoAI School membuat saya jauh lebih santai menjalani ujian sekolah sains data. UI websitenya sangat cantik dan menarik!”
              </p>
              <div className="flex items-center gap-2 xs:gap-3">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop" className="w-7 h-7 xs:w-10 xs:h-10 rounded-full object-cover border border-white" alt="Siswa 2" />
                <div className="text-left leading-none">
                  <span className="text-[9px] xs:text-xs font-bold text-gray-900 block">Sarah Amelia</span>
                  <span className="text-[7.5px] xs:text-[10px] text-[#1800ad] font-bold block mt-0.5 xs:mt-1">Siswa SMK Telkom</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION (UDEMY ACCENT STYLE) */}
      <section id="landing-faq" className="bg-[#f7f9fb] py-20 px-4 md:px-10 lg:px-20 border-t border-gray-100 text-left">
        <div className="max-w-7xl mx-auto space-y-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 text-center tracking-tight">
            {t.faqTitle}
          </h2>

          {/* Interactive Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left side: Expandable FAQs */}
            <div className="lg:col-span-2 space-y-4">
              {[
                {
                  id: 1,
                  qId: 'Apakah JagoAI School cocok untuk pemula tanpa background IT?',
                  qEn: 'Is JagoAI School suitable for IT absolute beginners?',
                  aId: 'Tentu! Kami memiliki kurikulum terstruktur khusus pemula (AI untuk SMP / SMA) yang mengajarkan logika dasar pemrograman dan AI dengan ilustrasi ramah serta seru.',
                  aEn: 'Absolutely! We offer specialized entry tracks (AI for Middle & High School level) explaining key concepts with easy visual paradigms prior to advanced modules.'
                },
                {
                  id: 2,
                  qId: 'Bagaimana cara melakukan sesi konsultasi dengan mentor?',
                  qEn: 'How can I establish a direct consulting session?',
                  aId: 'Siswa JagoAI dapat memilih jadwal mentor yang tersedia di menu Layanan Konsultasi platform, lalu masuk ke ruang konferensi video personal sesuai waktu yang dipilih.',
                  aEn: 'Once registered, users can access the Consultation panel, filter through mentor focus areas, pick an available slot, and launch instant video feeds.'
                },
                {
                  id: 3,
                  qId: 'Bagaimana sistem pembayaran kursus di JagoAI?',
                  qEn: 'What checkout channels are integrated?',
                  aId: 'Kami mendukung transfer bank lokal, e-wallet utama (GoPay, OVO, Dana), dan kartu kredit. Semua transaksi terjamin aman.',
                  aEn: 'Payments can be settled through local Indonesian bank transfers, mainstream e-wallets, or secure transaction gateways.'
                },
                {
                  id: 4,
                  qId: 'Apakah ada sertifikat kelulusan setelah menyelesaikan kursus?',
                  qEn: 'Is there a completion certificate after finishing a course?',
                  aId: 'Ya! Setiap siswa yang menyelesaikan seluruh materi pelajaran dan proyek akhir akan mendapatkan Sertifikat Kelulusan resmi dari JagoAI School dengan verifikasi kode unik (Kredensial).',
                  aEn: 'Yes! Every student who completes all lessons and the final project will receive an official Completion Certificate from JagoAI School with verified credential tracking.'
                },
                {
                  id: 5,
                  qId: 'Apakah materi pembelajaran dapat diakses selamanya?',
                  qEn: 'Is lesson material accessible forever?',
                  aId: 'Benar sekali! Kami memberikan Lifetime Access (Akses Seumur Hidup). Anda dapat mengulang kembali materi video, kuis, dan file sandbox kapan saja tanpa biaya tambahan.',
                  aEn: 'Absolutely! We offer Lifetime Access. You can revisit videos, quizzes, and sandbox files anytime with zero recurring charges.'
                },
                {
                  id: 6,
                  qId: 'Bagaimana jika saya mengalami kesulitan saat mengerjakan latihan coding?',
                  qEn: 'What if I find coding exercises difficult?',
                  aId: 'Anda dapat langsung bertanya di Forum Proyek Kolaborasi, berdiskusi dengan sesama siswa, atau berkonsultasi langsung dengan asisten AI dan asisten mentor di platform.',
                  aEn: 'You can query immediately inside our Project forums, talk to concurrent peers, or check in with friendly helper agents on our platform.'
                },
                {
                  id: 7,
                  qId: 'Apakah kursus di JagoAI School bermanfaat untuk CV atau mendaftar sekolah?',
                  qEn: 'Is the JagoAI School coursework beneficial for school/job applications?',
                  aId: 'Tentu! Sertifikat kelulusan dan portofolio proyek AI nyata yang Anda bangun di sandbox JagoAI School merupakan nilai tambah kredensial akademis dan karir yang sangat kuat.',
                  aEn: 'Indeed! The verified credentials and interactive neural network demo models you host on JagoAI Sandbox will serve as an elegant, outstanding portfolio for admission officers and employers.'
                }
              ].map((faq) => {
                const isOpen = activeFaq === faq.id;
                const question = selectedLanguage === 'id' ? faq.qId : faq.qEn;
                const answer = selectedLanguage === 'id' ? faq.aId : faq.aEn;

                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      <span className="text-xs md:text-sm font-bold text-gray-900 flex items-center gap-3">
                        <Symbol name="help_outline" className="text-[#1800ad] text-base shrink-0" />
                        <span className="leading-snug">{question}</span>
                      </span>
                      <div className={`transform transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#1800ad]' : 'text-gray-400'}`}>
                        <Symbol name="keyboard_arrow_down" className="text-lg" />
                      </div>
                    </button>

                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-gray-100' : 'max-h-0'
                        }`}
                    >
                      <div className="p-5 bg-slate-50/50">
                        <p className="text-xs text-slate-600 pl-7 leading-relaxed font-semibold">
                          {answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side: Needs Help Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5 text-left relative overflow-hidden self-stretch lg:self-start">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#1800ad]/5 rounded-full blur-xl"></div>
              <div className="w-12 h-12 rounded-2xl bg-[#1800ad]/5 text-[#1800ad] flex items-center justify-center shrink-0 border border-[#1800ad]/10">
                <Symbol name="forward_to_inbox" className="text-xl" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedLanguage === 'id' ? 'Butuh Bantuan Langsung?' : 'Need Instant Assistance?'}
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {selectedLanguage === 'id'
                    ? 'Ada kendala pendaftaran, pembayaran, atau kurikulum? Hubungi admin & tim penasihat JagoAI untuk bantuan cepat.'
                    : 'Confused about sign ups, billing, or modular learning blocks? Reach out directly to friendly JagoAI support agents.'}
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2.5 text-xs font-bold text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100/70">
                  <Symbol name="email" className="text-[#1800ad] text-base" />
                  <span>admin.jagoaischool@gmail.com</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateToAuth('register')}
                className="w-full py-3 bg-[#1800ad] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 group cursor-pointer transition-all duration-200"
              >
                <span>{selectedLanguage === 'id' ? 'Tanya Tim JagoAI' : 'Contact Support'}</span>
                <Symbol name="arrow_forward" className="text-sm group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 9. HIGHLY CONVERSATIONAL FOOTER (UDEMY FOOTER ACCENTS) */}
      <footer className="bg-gray-900 text-gray-400 py-12 md:py-16 px-4 md:px-10 lg:px-20 text-left shrink-0">
        <div className="max-w-7xl mx-auto space-y-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Symbol name="cognition" className="text-[#e8ba00] text-xl" />
                </div>
                <span className="text-base font-display font-bold text-white tracking-tight italic">
                  Jago<span className="text-[#e8ba00]">AI</span> School
                </span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed max-w-xs">
                {t.footerSlogan}
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-[10px]">
                <Symbol name="language" className="text-xs text-gray-400" />
                <span>Bahasa Indonesia / English</span>
              </div>
            </div>

            <div className="space-y-3 font-medium text-xs text-left">
              <p className="text-[10px] font-bold uppercase text-white tracking-widest">{selectedLanguage === 'id' ? 'EKSPLORASI' : 'EXPLORE'}</p>
              <ul className="space-y-2">
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">Python & Machine Learning</span></li>
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">Generative AI Hub</span></li>
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">Robotics & Vision</span></li>
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">UTBK / SNBT Sains Data</span></li>
              </ul>
            </div>

            <div className="space-y-3 font-medium text-xs text-left">
              <p className="text-[10px] font-bold uppercase text-white tracking-widest">{selectedLanguage === 'id' ? 'LAYANAN' : 'SERVICES'}</p>
              <ul className="space-y-2">
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">{t.why1Title}</span></li>
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">JagoAI Business</span></li>
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">{selectedLanguage === 'id' ? 'Sertifikasi Kompetensi AI' : 'AI Competency Certification'}</span></li>
              </ul>
            </div>

            <div className="space-y-3 font-medium text-xs text-left">
              <p className="text-[10px] font-bold uppercase text-white tracking-widest">{selectedLanguage === 'id' ? 'TENTANG KAMI' : 'ABOUT US'}</p>
              <ul className="space-y-2">
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">Hubungi JagoAI</span></li>
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">Pernyataan Privasi</span></li>
                <li><span onClick={() => onNavigateToAuth('login')} className="hover:text-[#e8ba00] cursor-pointer transition-colors block">Syarat & Ketentuan</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <span className="text-[11px] font-medium">© 2026 JagoAI School. {selectedLanguage === 'id' ? 'Hak Cipta Dilindungi Undang-Undang.' : 'All Rights Reserved.'}</span>
          </div>

        </div>
      </footer>

      {/* 10. SINGLE-COURSE ACTION SPECIFIC DETAIL OVERLAY DRAWER */}
      <AnimatePresence>
        {selectedCourseDetail && (
          <div className="fixed inset-0 z-[1100] flex justify-end">
            {/* Backdrop shadow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourseDetail(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto text-left"
            >
              <div className="space-y-6">

                {/* Close row */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-md">
                    {selectedCourseDetail.category}
                  </span>
                  <button
                    onClick={() => setSelectedCourseDetail(null)}
                    className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-black transition-all"
                  >
                    <Symbol name="close" className="text-xl" />
                  </button>
                </div>

                {/* Course Header Image */}
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 relative shadow-inner">
                  <img src={selectedCourseDetail.image} alt={selectedCourseDetail.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-gray-900 leading-snug">{selectedCourseDetail.title}</h3>
                  <p className="text-xs text-gray-400 font-medium">{selectedCourseDetail.author}</p>
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-1.5 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-sm font-black text-amber-600">{selectedCourseDetail.rating.toFixed(1)}</span>
                  <div className="flex text-amber-500">
                    <Symbol name="star" className="text-lg fill-1" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">({selectedCourseDetail.reviewsCount} {selectedLanguage === 'id' ? 'ulasan terdaftar' : 'registered reviews'})</span>
                </div>

                {/* Core Skills Taught list */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedLanguage === 'id' ? 'KEALIAN YANG AKAN ANDA DAPAT' : 'SKILLS YOU WILL ACQUIRE'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCourseDetail.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-[#1800ad]/5 text-[#1800ad] rounded-xl text-[10px] font-black uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Access row in overlay (No price as requested) */}
                <div className="p-4.5 bg-gradient-to-r from-[#1800ad]/5 to-transparent rounded-2xl border border-[#1800ad]/10 space-y-2">
                  <span className="text-[10px] font-mono font-black text-[#1800ad] uppercase tracking-wider block">{selectedLanguage === 'id' ? 'AKREDITASI & AKSES KELAS' : 'ACCREDITATION & ACCESS'}</span>
                  <div className="space-y-1.5 text-[11px] text-gray-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Symbol name="check_circle" className="text-emerald-500 text-sm shrink-0" />
                      <span>{selectedLanguage === 'id' ? 'Akses materi penuh seumur hidup' : 'Full lifetime curriculum access'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Symbol name="verified" className="text-[#1800ad] text-sm shrink-0" />
                      <span>{selectedLanguage === 'id' ? 'Sertifikat kompetensi resmi JagoAI School' : 'Official JagoAI School competence certification'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom instant Enroll CTA */}
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => { setSelectedCourseDetail(null); onNavigateToAuth('register'); }}
                  className="w-full py-4.5 bg-[#1800ad] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-[#1800ad]/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Symbol name="school" className="text-sm" />
                  <span>{selectedLanguage === 'id' ? 'Daftar Kelas Sekarang' : 'Enroll in Course Now'}</span>
                </button>
                <p className="text-[9px] text-gray-400 text-center font-medium">{selectedLanguage === 'id' ? 'Akses gratis bersponsor instansi/sekolah terverifikasi.' : 'Free access sponsored by verified institutes.'}</p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
