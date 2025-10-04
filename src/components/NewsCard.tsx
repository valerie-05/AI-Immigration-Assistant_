import { Clock, ExternalLink } from 'lucide-react';

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

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
}

export function NewsCard({ article, onClick }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
    <article
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100"
    >
      {article.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {formatDate(article.published_at)}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{article.source}</span>
          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-1 text-xs"
            >
              Read more <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
