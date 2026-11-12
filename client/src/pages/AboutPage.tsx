import ZsuLogo from '../components/ZsuLogo';
import '../styles/pages/_about.scss';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

const features: FeatureCard[] = [
  {
    icon: '📰',
    title: 'Актуальні новини',
    description:
      'Оперативне висвітлення останніх подій та розробок у сфері оборонно-промислового комплексу України. Щоденні оновлення та ексклюзивні матеріали.',
  },
  {
    icon: '🔍',
    title: 'Огляди техніки',
    description:
      'Детальні огляди сучасних зразків озброєння та військової техніки українського виробництва. Технічні характеристики, порівняння та аналіз.',
  },
  {
    icon: '📊',
    title: 'Аналітика ВПК',
    description:
      'Глибокий аналіз тенденцій розвитку оборонної промисловості, експортний потенціал та перспективи міжнародного співробітництва.',
  },
  {
    icon: '🖼',
    title: 'Галерея',
    description:
      'Фотогалерея сучасних зразків озброєння та військової техніки. Ексклюзивні фото з виставок, випробувань та виробництва.',
  },
];

function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-page__hero">
        <div className="about-page__container">
          <h1 className="about-page__title">Про портал ВПК-news</h1>
          <div className="about-page__title-decoration">
            <span className="about-page__title-line"></span>
            <ZsuLogo size={32} className="about-page__title-icon" />
            <span className="about-page__title-line"></span>
          </div>
        </div>
      </section>

      <section className="about-page__mission">
        <div className="about-page__container">
          <div className="about-page__mission-card">
            <h2 className="about-page__mission-title">Наша місія</h2>
            <p className="about-page__mission-text">
              Портал "ВПК-news" створений з метою моніторингу та всебічного висвітлення розвитку
              оборонно-промислового комплексу України. Ми прагнемо надавати об'єктивну та актуальну
              інформацію про досягнення української оборонної промисловості, нові розробки та
              технологічні інновації у військовій сфері.
            </p>
            <p className="about-page__mission-text">
              Проєкт охоплює основні напрями вітчизняного виробництва: безпілотні авіаційні комплекси,
              артилерійські системи, засоби радіоелектронної боротьби, бронетехніку та високоточне
              озброєння.
            </p>
          </div>
        </div>
      </section>

      <section className="about-page__goals">
        <div className="about-page__container">
          <h2 className="about-page__goals-title">Цілі порталу</h2>
          <div className="about-page__goals-grid">
            <div className="about-page__goal-item">
              <span className="about-page__goal-number">01</span>
              <h3 className="about-page__goal-heading">Інформування</h3>
              <p className="about-page__goal-text">
                Своєчасне та достовірне інформування громадськості про стан та перспективи розвитку
                оборонно-промислового комплексу України.
              </p>
            </div>
            <div className="about-page__goal-item">
              <span className="about-page__goal-number">02</span>
              <h3 className="about-page__goal-heading">Аналітика</h3>
              <p className="about-page__goal-text">
                Проведення аналітичних досліджень тенденцій розвитку озброєнь та військової техніки,
                порівняльний аналіз із зарубіжними аналогами.
              </p>
            </div>
            <div className="about-page__goal-item">
              <span className="about-page__goal-number">03</span>
              <h3 className="about-page__goal-heading">Популяризація</h3>
              <p className="about-page__goal-text">
                Підвищення обізнаності суспільства щодо досягнень вітчизняної оборонної
                промисловості та формування позитивного іміджу українського ВПК.
              </p>
            </div>
            <div className="about-page__goal-item">
              <span className="about-page__goal-number">04</span>
              <h3 className="about-page__goal-heading">Архівування</h3>
              <p className="about-page__goal-text">
                Створення систематизованого архіву інформації про зразки озброєння та військової
                техніки українського виробництва.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-page__features">
        <div className="about-page__container">
          <h2 className="about-page__features-title">Розділи порталу</h2>
          <div className="about-page__features-grid">
            {features.map((feature, index) => (
              <div key={index} className="about-page__feature-card">
                <span className="about-page__feature-icon">{feature.icon}</span>
                <h3 className="about-page__feature-heading">{feature.title}</h3>
                <p className="about-page__feature-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-page__team">
        <div className="about-page__container">
          <div className="about-page__team-card">
            <h2 className="about-page__team-title">Команда проєкту</h2>
            <p className="about-page__team-text">
              Портал розроблений у рамках курсової роботи з дисципліни "Веб-технології та веб-дизайн". Проєкт реалізовано з
              використанням сучасних технологій веб-розробки: React, TypeScript, Node.js, Express та SQLite.
            </p>
            <p className="about-page__team-text">
              Наша команда прагне створити якісний інформаційний ресурс, який буде корисним для всіх,
              хто цікавиться розвитком оборонної промисловості України.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
