import { useState, useEffect } from 'react';
import Lightbox from '../components/Lightbox';
import { getGallery, GalleryItem } from '../services/api';
import '../styles/pages/_gallery.scss';

const categories = ['Всі', 'БПЛА', 'Артилерія', 'Морські дрони', 'Бронетехніка', 'РЕБ'];

const categoryGradients: Record<string, string> = {
  'БПЛА': 'linear-gradient(135deg, #1a2980, #26d0ce)',
  'Артилерія': 'linear-gradient(135deg, #c31432, #240b36)',
  'Морські дрони': 'linear-gradient(135deg, #0f2027, #2c5364)',
  'Бронетехніка': 'linear-gradient(135deg, #3c3b3f, #605c3c)',
  'РЕБ': 'linear-gradient(135deg, #4e2a84, #7b4397)',
};

const categoryIcons: Record<string, string> = {
  'БПЛА': '🛩',
  'Артилерія': '💥',
  'Морські дрони': '🚢',
  'Бронетехніка': '🛡',
  'РЕБ': '📡',
};

function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Всі');
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    description: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const category = activeCategory === 'Всі' ? undefined : activeCategory;
        const data = await getGallery(category);
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Помилка завантаження');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [activeCategory]);

  const openLightbox = (item: GalleryItem) => {
    setLightbox({
      isOpen: true,
      imageUrl: item.image_url,
      title: item.title,
      description: item.description,
    });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="gallery-page">
      <section className="gallery-page__hero">
        <div className="gallery-page__container">
          <h1 className="gallery-page__title">Галерея</h1>
          <p className="gallery-page__subtitle">
            Фотогалерея сучасних зразків озброєння та військової техніки українського виробництва
          </p>
        </div>
      </section>

      <section className="gallery-page__content">
        <div className="gallery-page__container">
          <div className="gallery-page__filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`gallery-page__filter-btn ${
                  activeCategory === cat ? 'gallery-page__filter-btn--active' : ''
                }`}
                onClick={() => setActiveCategory(cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && (
            <div className="gallery-page__loading">
              <div className="gallery-page__spinner"></div>
              <p>Завантаження галереї...</p>
            </div>
          )}

          {error && (
            <div className="gallery-page__error">
              <p>⚠ {error}</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="gallery-page__empty">
              <span className="gallery-page__empty-icon">🖼</span>
              <p>Елементи галереї відсутні</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="gallery-page__grid">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="gallery-page__card"
                  onClick={() => openLightbox(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') openLightbox(item);
                  }}
                >
                  <div className="gallery-page__card-image">
                    {item.image_url && !failedImages[item.id] ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        onError={() => setFailedImages((prev) => ({ ...prev, [item.id]: true }))}
                      />
                    ) : (
                      <div
                        className="gallery-page__card-placeholder"
                        style={{
                          backgroundImage:
                            categoryGradients[item.category] ||
                            'linear-gradient(135deg, #1a2332, #3b82f6)',
                        }}
                      >
                        <span className="gallery-page__card-placeholder-icon">
                          {categoryIcons[item.category] || '🖼'}
                        </span>
                      </div>
                    )}
                    <div className="gallery-page__card-overlay">
                      <span className="gallery-page__card-zoom">🔍</span>
                    </div>
                  </div>
                  <div className="gallery-page__card-info">
                    <h3 className="gallery-page__card-title">{item.title}</h3>
                    <p className="gallery-page__card-description">{item.description}</p>
                    <span className="gallery-page__card-category">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
        imageUrl={lightbox.imageUrl}
        title={lightbox.title}
        description={lightbox.description}
      />
    </div>
  );
}

export default GalleryPage;
