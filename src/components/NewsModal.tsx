import { X, Clock, ExternalLink } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string | null;
  source: string;
  source_url: string | null;
  image_url: string | null;
  category: string;
  published_at: string;
}

interface NewsModalProps {
  article: NewsArticle;
  onClose: () => void;
}

export function NewsModal({ article, onClose }: NewsModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      visa: 'bg-blue-100 text-blue-700',
      policy: 'bg-green-100 text-green-700',
      travel: 'bg-orange-100 text-orange-700',
      citizenship: 'bg-purple-100 text-purple-700',
      general: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(article.published_at)}
            </div>
            <span>•</span>
            <span>{article.source}</span>
            {article.source_url && (
              <>
                <span>•</span>
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                >
                  View Source <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-lg text-gray-700 mb-4 font-medium">
              {article.summary}
            </p>
            {article.content && (
              <div className="text-gray-600 whitespace-pre-wrap">
                {article.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
