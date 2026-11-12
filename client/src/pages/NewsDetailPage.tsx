import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsById, NewsItem } from '../services/api';
import '../styles/pages/_news-detail.scss';

const categoryColors: Record<string, string> = {
  'БПЛА': '#3b82f6',
  'Артилерія': '#ef4444',
  'Морські дрони': '#06b6d4',
  'Бронетехніка': '#f59e0b',
  'РЕБ': '#8b5cf6',
  'Ракетне озброєння': '#10b981',
  'Стрілецька зброя': '#ec4899',
  'Загальне': '#6b7280',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getNewsById(id);
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Помилка завантаження');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="news-detail">
        <div className="news-detail__container">
          <div className="news-detail__loading">
            <div className="news-detail__spinner"></div>
            <p>Завантаження статті...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-detail">
        <div className="news-detail__container">
          <div className="news-detail__error">
            <span className="news-detail__error-icon">⚠</span>
            <h2>Помилка</h2>
            <p>{error}</p>
            <Link to="/news" className="news-detail__back-btn">
              ← Повернутися до новин
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-detail">
        <div className="news-detail__container">
          <div className="news-detail__error">
            <span className="news-detail__error-icon">🔍</span>
            <h2>Новину не знайдено</h2>
            <Link to="/news" className="news-detail__back-btn">
              ← Повернутися до новин
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const badgeColor = categoryColors[news.category] || '#6b7280';

  return (
    <div className="news-detail">
      <div className="news-detail__container">
        <Link to="/news" className="news-detail__back-btn">
          ← Повернутися до новин
        </Link>

        <article className="news-detail__article">
          <header className="news-detail__header">
            <span
              className="news-detail__category-badge"
              style={{ backgroundColor: badgeColor }}
            >
              {news.category}
            </span>
            <h1 className="news-detail__title">{news.title}</h1>
            <div className="news-detail__meta">
              <span className="news-detail__author">
                <span className="news-detail__meta-icon">✍</span>
                {news.author}
              </span>
              <time className="news-detail__date" dateTime={news.created_at}>
                <span className="news-detail__meta-icon">📅</span>
                {formatDate(news.created_at)}
              </time>
            </div>
          </header>

          {news.image_url && !imgError && (
            <div className="news-detail__image-wrapper">
              <img
                src={news.image_url}
                alt={news.title}
                className="news-detail__image"
                onError={() => setImgError(true)}
              />
            </div>
          )}

          <div className="news-detail__excerpt">
            <p>{news.excerpt}</p>
          </div>

          <div className="news-detail__content">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export default NewsDetailPage;
