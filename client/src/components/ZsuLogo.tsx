interface ZsuLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

export function ZsuLogo({ size = 36, className = '' }: ZsuLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Емблема Збройних Сил України"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        {/* Малиновий градієнт хреста ЗСУ */}
        <radialGradient id="zsuCrimson" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>

        {/* Золотий градієнт для мечів та канта */}
        <linearGradient id="zsuGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        {/* Синій градієнт медальйона */}
        <radialGradient id="zsuBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </radialGradient>

        {/* Тінь для об'єму */}
        <filter id="zsuShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6" />
        </filter>
      </defs>

      <g filter="url(#zsuShadow)">
        {/* Схрещені золоті мечі вістрям угору */}
        {/* Меч 1: лівий нижній -> правий верхній */}
        <path
          d="M 18 82 L 82 18 M 80 15 L 85 20 M 15 85 L 20 80 M 13 87 A 2.5 2.5 0 1 0 17 83 A 2.5 2.5 0 1 0 13 87"
          stroke="url(#zsuGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Меч 2: правий нижній -> лівий верхній */}
        <path
          d="M 82 82 L 18 18 M 20 15 L 15 20 M 85 85 L 80 80 M 87 87 A 2.5 2.5 0 1 0 83 83 A 2.5 2.5 0 1 0 87 87"
          stroke="url(#zsuGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Прямий рівнокінцевий хрест ЗСУ з розбіжними кінцями */}
        <path
          d="M 44 38
             L 42 16 L 30 10 L 50 14 L 70 10 L 58 16 L 56 38
             L 62 44
             L 84 42 L 90 30 L 86 50 L 90 70 L 84 58 L 62 56
             L 56 62
             L 58 84 L 70 90 L 50 86 L 30 90 L 42 84 L 44 62
             L 38 56
             L 16 58 L 10 70 L 14 50 L 10 30 L 16 42 L 38 44
             Z"
          fill="url(#zsuCrimson)"
          stroke="url(#zsuGold)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Внутрішній декоративний кант хреста */}
        <path
          d="M 45 40
             L 43.5 20 L 34 15 L 50 18 L 66 15 L 56.5 20 L 55 40
             L 60 45
             L 80 43.5 L 85 34 L 82 50 L 85 66 L 80 56.5 L 60 55
             L 55 60
             L 56.5 80 L 66 85 L 50 82 L 34 85 L 43.5 80 L 45 60
             L 40 55
             L 20 56.5 L 15 66 L 18 50 L 15 34 L 20 43.5 L 40 45
             Z"
          fill="none"
          stroke="#fef08a"
          strokeWidth="0.6"
          opacity="0.7"
        />

        {/* Круглий синій медальйон у центрі */}
        <circle cx="50" cy="50" r="15" fill="url(#zsuBlue)" stroke="url(#zsuGold)" strokeWidth="1.8" />
        <circle cx="50" cy="50" r="13" fill="none" stroke="#60a5fa" strokeWidth="0.5" opacity="0.6" />

        {/* Золотий Тризуб Володимира Великого */}
        <g fill="url(#zsuGold)">
          {/* Центральний зубець */}
          <path d="M 48.8 40.5 L 50 37.5 L 51.2 40.5 L 51.2 55 L 48.8 55 Z" />
          <path d="M 50 36.5 L 51 38.5 L 49 38.5 Z" />

          {/* Ліве крило тризуба */}
          <path d="M 46.5 42 C 45 43 44 45.5 44 48 C 44 52 46.5 54 48.8 55 L 48.8 53 C 47.5 52.2 46 50.5 46 48 C 46 46.5 46.8 45 47.5 44.5 Z" />
          <path d="M 43.5 44 C 43.5 42 45 40.5 46.5 40.5 L 47 42 C 45.8 42 45 43 45 44.5 Z" />

          {/* Праве крило тризуба */}
          <path d="M 53.5 42 C 55 43 56 45.5 56 48 C 56 52 53.5 54 51.2 55 L 51.2 53 C 52.5 52.2 54 50.5 54 48 C 54 46.5 53.2 45 52.5 44.5 Z" />
          <path d="M 56.5 44 C 56.5 42 55 40.5 53.5 40.5 L 53 42 C 54.2 42 55 43 55 44.5 Z" />

          {/* Основа тризуба */}
          <path d="M 48 55 L 52 55 L 50.8 59 L 49.2 59 Z" />
          <rect x="47" y="59" width="6" height="1.5" rx="0.5" />
        </g>
      </g>
    </svg>
  );
}

export default ZsuLogo;
