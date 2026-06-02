import React, { useState, useEffect } from 'react';
import { Symbol } from '../components/ui/Symbol';
import { articleService } from '../services/api';

interface ArticleItem {
  id: number;
  title: string;
  description: string;
  author_name: string;
  created_at: string;
  read_time: string;
  image_url: string;
  category: string;
  content: string;
}

interface TrendingNewsItem {
  id: number;
  category_label: string;
  news_title: string;
}

export const Article = ({ onReadMore }: { onReadMore: (article: ArticleItem) => void }) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [trendingNews, setTrendingNews] = useState<TrendingNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ["All", "Vision", "NLP", "Robotics", "Ethics", "Generative AI", "Deep Learning", "UTBK PREP"];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const catParam = activeTab === 'All' ? undefined : activeTab;
        const data = await articleService.getArticles(catParam);
        setArticles(data);
      } catch (err: any) {
        console.error('Failed to load articles:', err);
        setError(err.message || 'Failed to fetch articles feed.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [activeTab]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await articleService.getTrendingNews();
        setTrendingNews(data);
      } catch (err) {
        console.error('Failed to load trending news ticker:', err);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="space-y-12 pb-24 text-left">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-[#1800ad] tracking-tight">AI Insights & News</h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed font-light">Stay ahead of the curve with the latest breakthroughs in Artificial Intelligence, curated by our expert Mentors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-4 md:space-y-10">
          
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#1800ad] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Syncing article feed...</p>
            </div>
          ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <Symbol name="error" className="text-5xl text-red-500" />
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : articles.length > 0 ? (
            articles.map((art) => (
              <div key={art.id} className="bg-white rounded-2xl md:rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all p-3 md:p-10 flex flex-col md:flex-row gap-4 md:gap-10 items-center group">
                <div className="w-full md:w-64 h-32 md:h-48 rounded-xl md:rounded-[32px] overflow-hidden shrink-0">
                  <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={art.title} />
                </div>
                <div className="flex-1 space-y-2 md:space-y-6 text-left w-full">
                  <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                    <span className="px-2 md:px-5 py-0.5 md:py-1.5 bg-[#e8ba00]/10 text-[#e8ba00] text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-full">{art.category}</span>
                    <span className="text-[7px] md:text-[9px] font-bold text-gray-400 uppercase hidden sm:inline">{new Date(art.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <h3 className="text-[11px] md:text-2xl font-display font-bold text-[#1800ad] leading-tight mb-1 md:mb-3 group-hover:text-[#e8ba00] transition-colors line-clamp-2">{art.title}</h3>
                    <div className="flex items-center gap-1.5 mb-2 md:mb-4">
                      <span className="text-[8px] md:text-[10px] font-bold text-gray-400">By {art.author_name}</span>
                      <Symbol name="verified" className="text-emerald-500 text-[10px] md:text-xs" fill />
                    </div>
                    <p className="text-gray-500 text-[9px] md:text-xs leading-relaxed line-clamp-2 hidden sm:block">{art.description}</p>
                  </div>
                  <button 
                    onClick={() => onReadMore(art)}
                    className="flex items-center gap-1 md:gap-2 text-[8px] md:text-[10px] font-black text-[#1800ad] uppercase tracking-widest hover:gap-3 transition-all cursor-pointer border-none bg-transparent"
                  >
                    Read <Symbol name="arrow_forward" className="text-xs md:text-base" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-2">
              <Symbol name="library_books" className="text-5xl text-gray-300" />
              <p className="text-gray-450 font-bold uppercase text-xs">No insights in this category.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Trending News */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm transition-colors space-y-8">
            <h4 className="text-xl font-display font-bold text-[#1800ad] flex items-center gap-3">
              <Symbol name="trending_up" className="text-[#e8ba00]" /> Trending News
            </h4>
            <div className="space-y-8">
              {trendingNews.length > 0 ? (
                trendingNews.map((news) => (
                  <div key={news.id} className="space-y-2 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    <p className="text-[9px] font-black text-[#e8ba00] uppercase tracking-widest">{news.category_label || 'TECH ALERT'}</p>
                    <p className="text-xs font-bold text-gray-900 leading-relaxed hover:text-[#1800ad] cursor-pointer transition-colors">{news.news_title}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs">No trending updates.</p>
              )}
            </div>
          </div>

          {/* Category Cloud */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm transition-colors space-y-8">
            <h4 className="text-lg font-display font-bold text-[#1800ad]">Category Cloud</h4>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <span 
                  key={cat} 
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${
                    activeTab === cat 
                      ? 'bg-[#1800ad] text-white shadow-md' 
                      : 'bg-gray-50 text-gray-400 hover:bg-[#eef2ff] hover:text-[#1800ad]'
                  }`}
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
