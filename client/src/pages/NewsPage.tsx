import { useState, useEffect, useCallback } from 'react';
import NewsCard from '../components/NewsCard';
import { getNews, NewsItem } from '../services/api';
import '../styles/pages/_news.scss';

const categories = ['Всі', 'БПЛА', 'Артилерія', 'Морські дрони', 'Бронетехніка', 'РЕБ', 'Ракетне озброєння', 'Стрілецька зброя'];

function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Всі');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const params: { search?: string; category?: string; sort?: string } = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeCategory !== 'Всі') params.category = activeCategory;
      params.sort = sort;
      const data = await getNews(params);
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeCategory, sort]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="news-page">
      <section className="news-page__hero">
        <div className="news-page__container">
          <h1 className="news-page__title">Новини ВПК</h1>
          <p className="news-page__subtitle">
            Актуальні новини та події оборонно-промислового комплексу України
          </p>
        </div>
      </section>

      <section className="news-page__content">
        <div className="news-page__container">
          <div className="news-page__controls">
            <div className="news-page__search">
              <span className="news-page__search-icon">🔍</span>
              <input
                type="text"
                className="news-page__search-input"
                placeholder="Пошук новин..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="news-page__search-clear"
                  onClick={() => setSearch('')}
                  type="button"
                  aria-label="Очистити пошук"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="news-page__sort">
              <label htmlFor="sort-select" className="news-page__sort-label">
                Сортування:
              </label>
              <select
                id="sort-select"
                className="news-page__sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="new">Нові спочатку</option>
                <option value="old">Старі спочатку</option>
              </select>
            </div>
          </div>

          <div className="news-page__filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`news-page__filter-btn ${
                  activeCategory === cat ? 'news-page__filter-btn--active' : ''
                }`}
                onClick={() => setActiveCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && (
            <div className="news-page__loading">
              <div className="news-page__spinner"></div>
              <p>Завантаження новин...</p>
            </div>
          )}

          {error && (
            <div className="news-page__error">
              <p>⚠ {error}</p>
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            <div className="news-page__empty">
              <span className="news-page__empty-icon">📭</span>
              <h3>Немає результатів</h3>
              <p>Спробуйте змінити параметри пошуку або фільтрації</p>
            </div>
          )}

          {!loading && !error && news.length > 0 && (
            <div className="news-page__grid">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  category={item.category}
                  image_url={item.image_url}
                  created_at={item.created_at}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default NewsPage;
