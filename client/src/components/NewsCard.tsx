import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/_news-card.scss';

interface NewsCardProps {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  created_at: string;
}

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

const categoryIcons: Record<string, string> = {
  'БПЛА': '🛩',
  'Артилерія': '💥',
  'Морські дрони': '🚢',
  'Бронетехніка': '🛡',
  'РЕБ': '📡',
  'Ракетне озброєння': '🚀',
  'Стрілецька зброя': '🎯',
  'Загальне': '📰',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function NewsCard({ id, title, excerpt, category, image_url, created_at }: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const badgeColor = categoryColors[category] || '#6b7280';
  const icon = categoryIcons[category] || '📰';

  return (
    <Link to={`/news/${id}`} className="news-card">
      <div className="news-card__image-wrapper">
        {image_url && !imgError ? (
          <img
            src={image_url}
            alt={title}
            className="news-card__image"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="news-card__image-placeholder">
            <span className="news-card__image-placeholder-icon">{icon}</span>
          </div>
        )}
        <span className="news-card__category-badge" style={{ backgroundColor: badgeColor }}>
          {category}
        </span>
      </div>
      <div className="news-card__body">
        <h3 className="news-card__title">{title}</h3>
        <p className="news-card__excerpt">{excerpt}</p>
        <div className="news-card__meta">
          <time className="news-card__date" dateTime={created_at}>
            {formatDate(created_at)}
          </time>
          <span className="news-card__read-more">Читати далі →</span>
        </div>
      </div>
    </Link>
  );
}

export default NewsCard;
