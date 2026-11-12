import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ZsuLogo from './ZsuLogo';
import '../styles/components/_hero-slider.scss';

export interface Slide {
  title: string;
  subtitle: string;
  category: string;
  specs: string;
  image: string;
  link: string;
  gradient?: string;
}

export const defaultSlides: Slide[] = [
  {
    title: 'САУ "Богдана"',
    subtitle: 'Українська вогнева міць калібру 155 мм NATO',
    category: 'АРТИЛЕРІЯ',
    specs: 'Калібр: 155 мм • Дальність: до 50 км • Шасі: Tatra 8×8 / КрАЗ',
    image: '/images/news/bogdana.jpg',
    link: '/news',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    title: 'Морський дрон Magura V5',
    subtitle: 'Безекіпажний ударний флот нової ери',
    category: 'МОРСЬКІ ДРОНИ',
    specs: 'Дальність: 800 км • Швидкість: 78 км/год • Бойове навантаження: 320 кг',
    image: '/images/news/magura-v5.jpg',
    link: '/news',
    gradient: 'linear-gradient(135deg, #0c1821 0%, #1b2838 50%, #162447 100%)',
  },
  {
    title: 'Ракета-дрон "Паляниця"',
    subtitle: 'Інноваційна далекобійна зброя відплати',
    category: 'БПЛА ТА РАКЕТИ',
    specs: 'Двигун: турбореактивний • Пуск: наземна платформа • Захист від РЕБ',
    image: '/images/news/palyanytsia.jpg',
    link: '/news',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 50%, #3a1c71 100%)',
  },
  {
    title: 'РК-360МЦ "Нептун"',
    subtitle: 'Легендарний береговий протикорабельний комплекс',
    category: 'МОРСЬКІ ДРОНИ / РАКЕТИ',
    specs: 'Дальність: 280+ км • Бойова частина: 150 кг • Висота польоту: 3-10 м',
    image: '/images/news/neptun.jpg',
    link: '/news',
    gradient: 'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3557 100%)',
  },
  {
    title: 'РСЗВ "Вільха-М"',
    subtitle: 'Високоточні кориговані ракетні удари до 130 км',
    category: 'АРТИЛЕРІЯ',
    specs: 'Калібр: 300 мм • Система наведення: інерціальна + GPS • Точність: < 10 м',
    image: '/images/news/vilkha-m.jpg',
    link: '/news',
    gradient: 'linear-gradient(135deg, #1a1c20 0%, #2d3436 50%, #2c3e50 100%)',
  },
  {
    title: 'БПЛА "Лютий"',
    subtitle: 'Далекобійний ударний дрон стратегічного радіуса',
    category: 'БПЛА',
    specs: 'Дальність: 1000+ км • Бойова частина: 75 кг • Стійкість до РЕБ',
    image: '/images/news/liutyi.jpg',
    link: '/news',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
  },
];

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % defaultSlides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + defaultSlides.length) % defaultSlides.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="hero-slider" aria-label="Головний слайдер новітніх розробок ВПК України">
      <div className="hero-slider__track">
        {defaultSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slider__slide ${
              index === currentSlide ? 'hero-slider__slide--active' : ''
            }`}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(10, 14, 23, 0.45) 0%, rgba(10, 14, 23, 0.75) 55%, rgba(10, 14, 23, 0.95) 100%), linear-gradient(90deg, rgba(10, 14, 23, 0.85) 0%, rgba(10, 14, 23, 0.4) 60%, rgba(10, 14, 23, 0.85) 100%), url('${slide.image}')`,
            }}
          >
            <div className="hero-slider__overlay">
              <div className="hero-slider__content">
                {/* Категорія з мілітарі-бейджем */}
                <div className="hero-slider__badge-wrapper">
                  <span className="hero-slider__badge">
                    <span className="hero-slider__badge-dot">●</span> {slide.category}
                  </span>
                  <span className="hero-slider__status-tag">НА ОЗБРОЄННІ ЗСУ</span>
                </div>

                {/* Заголовок розробки */}
                <h1 className="hero-slider__title">{slide.title}</h1>

                {/* Підзаголовок */}
                <p className="hero-slider__subtitle">{slide.subtitle}</p>

                {/* Технічні характеристики */}
                {slide.specs && (
                  <p className="hero-slider__specs">
                    <span className="hero-slider__specs-icon">⚡</span> {slide.specs}
                  </p>
                )}

                {/* Декоративний роздільник з емблемою ЗСУ */}
                <div className="hero-slider__decoration">
                  <span className="hero-slider__line"></span>
                  <ZsuLogo size={28} className="hero-slider__zsu-icon" />
                  <span className="hero-slider__line"></span>
                </div>

                {/* Кнопки переходу */}
                <div className="hero-slider__actions">
                  <Link to={slide.link} className="hero-slider__btn hero-slider__btn--primary">
                    Читати огляд розробки →
                  </Link>
                  <Link to="/gallery" className="hero-slider__btn hero-slider__btn--secondary">
                    Переглянути в галереї 🖼
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Навігаційні стрілки */}
      <button
        className="hero-slider__arrow hero-slider__arrow--prev"
        onClick={prevSlide}
        aria-label="Попередній слайд"
        type="button"
      >
        ‹
      </button>
      <button
        className="hero-slider__arrow hero-slider__arrow--next"
        onClick={nextSlide}
        aria-label="Наступний слайд"
        type="button"
      >
        ›
      </button>

      {/* Індикатори перемикання слайдів */}
      <div className="hero-slider__dots">
        {defaultSlides.map((_, index) => (
          <button
            key={index}
            className={`hero-slider__dot ${
              index === currentSlide ? 'hero-slider__dot--active' : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Слайд ${index + 1}: ${defaultSlides[index].title}`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

export default HeroSlider;
