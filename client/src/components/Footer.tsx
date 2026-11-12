import { Link } from 'react-router-dom';
import ZsuLogo from './ZsuLogo';
import '../styles/components/_footer.scss';

interface FooterLink {
  path: string;
  label: string;
}

const footerLinks: FooterLink[] = [
  { path: '/', label: 'Головна' },
  { path: '/about', label: 'Про сайт' },
  { path: '/gallery', label: 'Галерея' },
  { path: '/news', label: 'Новини' },
  { path: '/contacts', label: 'Контакти' },
  { path: '/admin', label: 'Вхід' },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__row">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <ZsuLogo size={34} className="footer__logo-icon" />
              <span className="footer__logo-text">ВПК-news</span>
            </Link>
            <p className="footer__description">
              Новинний портал огляду сучасних розробок Українського ВПК. Актуальні новини, аналітика
              та огляди оборонних технологій.
            </p>
          </div>

          <div className="footer__links">
            <h4 className="footer__links-title">Навігація</h4>
            <ul className="footer__links-list">
              {footerLinks.map((link) => (
                <li key={link.path} className="footer__links-item">
                  <Link to={link.path} className="footer__links-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__info">
            <h4 className="footer__info-title">Інформація</h4>
            <p className="footer__info-text">Курсова робота з дисципліни "Веб-технології та веб-дизайн"</p>
            <p className="footer__info-text">Тема: "Новинний портал огляду сучаcних розробок Українського ВПК"</p>
            <p className="footer__info-text">React + TypeScript + Node.js</p>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 ВПК-news - новинний портал огляду сучасних розробок Українського ВПК
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
