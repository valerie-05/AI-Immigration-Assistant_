import { useEffect, useState } from 'react';
import { Newspaper, Globe } from 'lucide-react';
import { NewsCard } from './components/NewsCard';
import { NewsModal } from './components/NewsModal';
import { FloatingChatbox } from './components/FloatingChatbox';
import { supabase, type NewsArticle } from './lib/supabase';

function App() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('immigration_news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'visa', 'policy', 'travel', 'citizenship'];

  const filteredNews = filter === 'all'
    ? news
    : news.filter(article => article.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Immigration Assistant</h1>
                <p className="text-sm text-gray-600">Clear guidance for your immigration journey</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Newspaper className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Latest Immigration News</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No news articles found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-3">Need Personalized Guidance?</h3>
            <p className="text-blue-100 mb-4">
              Our AI assistant can help answer your specific immigration questions in plain language.
              Click the chat button in the bottom-right corner to get started!
            </p>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>• Get answers about visas, green cards, and citizenship</li>
              <li>• Listen to responses in your preferred language</li>
              <li>• Save guidance for later reference</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          <p className="text-sm">
            AI Immigration Assistant - Making immigration information clear, accessible, and less intimidating
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Powered by Gemini AI and ElevenLabs
          </p>
        </div>
      </footer>

      {selectedArticle && (
        <NewsModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      <FloatingChatbox />
    </div>
  );
}

export default App;
