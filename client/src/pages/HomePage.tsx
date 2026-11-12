import { useState, useEffect } from 'react';
import HeroSlider from '../components/HeroSlider';
import NewsCard from '../components/NewsCard';
import { getTopNews, NewsItem } from '../services/api';
import '../styles/pages/_home.scss';

function HomePage() {
  const [topNews, setTopNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopNews = async () => {
      try {
        setLoading(true);
        const data = await getTopNews();
        setTopNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Помилка завантаження');
      } finally {
        setLoading(false);
      }
    };
    fetchTopNews();
  }, []);

  return (
    <div className="home-page">
      <HeroSlider />

      <section className="home-page__top-news">
        <div className="home-page__container">
          <div className="home-page__section-header">
            <span className="home-page__section-icon">📋</span>
            <h2 className="home-page__section-title">10 головних новин порталу</h2>
            <div className="home-page__section-line"></div>
          </div>

          {loading && (
            <div className="home-page__loading">
              <div className="home-page__spinner"></div>
              <p>Завантаження новин...</p>
            </div>
          )}

          {error && (
            <div className="home-page__error">
              <p>⚠ {error}</p>
            </div>
          )}

          {!loading && !error && topNews.length === 0 && (
            <div className="home-page__empty">
              <p>Новини поки відсутні</p>
            </div>
          )}

          {!loading && !error && topNews.length > 0 && (
            <div className="home-page__news-grid">
              {topNews.map((news) => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  title={news.title}
                  excerpt={news.excerpt}
                  category={news.category}
                  image_url={news.image_url}
                  created_at={news.created_at}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
