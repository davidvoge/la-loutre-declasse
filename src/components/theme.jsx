export const NOIR = '#0E0B07';
export const JAUNE = '#FFE600';
export const JAUNE_SALE = '#D4B400';
export const CREME = '#F4ECD8';
export const ROUGE = '#E33B1F';

export const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

export function Tape({ color = JAUNE, w = 80, rot = -4, style = {} }) {
  return (
    <span
      style={{
        position: 'absolute',
        display: 'block',
        width: w,
        height: 22,
        background: color,
        opacity: 0.85,
        transform: `rotate(${rot}deg)`,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
        ...style,
      }}
    />
  );
}

export const impact = '"Arial Black", Impact, sans-serif';
