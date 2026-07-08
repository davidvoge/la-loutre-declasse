const Icon = ({ d, size = 20, color = 'currentColor', stroke = 1.8, fill = 'none' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export const IconCar = ({ size = 22, color }) => (
  <Icon size={size} color={color} d="M3 13l2-6h14l2 6M3 13v5h2v-2h14v2h2v-5M3 13h18M7 17v.01M17 17v.01" />
);
export const IconTent = ({ size = 22, color }) => (
  <Icon size={size} color={color} d="M12 3l9 17H3L12 3zM12 3v17M8 20l4-8 4 8" />
);
export const IconFork = ({ size = 22, color }) => (
  <Icon size={size} color={color} d="M8 3v6a2 2 0 002 2v10M16 3v6a2 2 0 01-2 2M8 3v3M12 3v3M16 3v3" />
);
export const IconKids = ({ size = 22, color }) => (
  <Icon size={size} color={color} d="M9 11a3 3 0 116 0 3 3 0 01-6 0zM5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2M12 3v3" />
);
export const IconAccess = ({ size = 22, color }) => (
  <Icon size={size} color={color} d="M12 5a2 2 0 110-4 2 2 0 010 4zM12 7v6h5l3 6M12 13a6 6 0 11-5.2 9" />
);
export const IconHeart = ({ size = 22, color }) => (
  <Icon size={size} color={color} d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" />
);
export const IconMarket = ({ size = 22, color }) => (
  <Icon size={size} color={color} d="M3 9l2-4h14l2 4M3 9h18M5 9v10a2 2 0 002 2h10a2 2 0 002-2V9M9 13v4M15 13v4" />
);
export const IconMail = ({ size = 18, color }) => (
  <Icon
    size={size}
    color={color}
    d="M3 7l9 6 9-6M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
  />
);
export const IconInsta = ({ size = 18, color }) => (
  <Icon
    size={size}
    color={color}
    d="M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8zM12 8a4 4 0 100 8 4 4 0 000-8zM18 6v.01"
  />
);

export const IconFacebook = ({ size = 18, color }) => (
  <Icon
    size={size}
    color={color}
    d="M15 4h-2a4 4 0 00-4 4v3H6v3h3v7h3v-7h3l1-3h-4V8a1 1 0 011-1h2V4z"
  />
);

export const ICON_MAP = {
  car: IconCar,
  tent: IconTent,
  fork: IconFork,
  market: IconMarket,
  kids: IconKids,
  access: IconAccess,
  heart: IconHeart,
};
