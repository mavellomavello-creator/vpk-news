import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ZsuLogo from './ZsuLogo';
import Tooltip from './Tooltip';
import '../styles/components/_header.scss';

interface NavLink {
  path: string;
  label: string;
}

const navLinks: NavLink[] = [
  { path: '/', label: 'Головна' },
  { path: '/about', label: 'Про сайт' },
  { path: '/gallery', label: 'Галерея' },
  { path: '/news', label: 'Новини' },
  { path: '/contacts', label: 'Контакти' },
  { path: '/admin', label: 'Вхід' },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <Link to="/" className="header__logo">
          <ZsuLogo size={36} className="header__logo-icon" />
          <span className="header__logo-text">ВПК-news</span>
        </Link>

        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__nav-list">
            {navLinks.map((link) => (
              <li key={link.path} className="header__nav-item">
                <Link
                  to={link.path}
                  className={`header__nav-link ${
                    location.pathname === link.path ? 'header__nav-link--active' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Tooltip content="Меню навігації" position="bottom">
          <button
            className={`header__burger ${isMenuOpen ? 'header__burger--active' : ''}`}
            onClick={toggleMenu}
            aria-label="Меню навігації"
            type="button"
          >
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
          </button>
        </Tooltip>
      </div>
    </header>
  );
}

export default Header;
