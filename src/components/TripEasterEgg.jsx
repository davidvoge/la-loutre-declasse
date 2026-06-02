import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './TripEasterEgg.css';

const CALM_DURATION_MS = 3000;
const PINCH_STOP_RATIO = 0.12;

function touchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

const TRIP_MESSAGES = [
  'la loutre te voit',
  'tous les noms sont encore plus gros',
  'convergence des loutres',
  'prix libre même dans ta tête',
];

const FLOATING_WORDS = [
  { text: 'LOUTRE', top: '12%', left: '8%', rot: -14, delay: 0 },
  { text: 'DÉCLASSE', top: '22%', right: '6%', rot: 8, delay: 0.4 },
  { text: 'LOUTRE', top: '55%', left: '4%', rot: 12, delay: 0.8 },
  { text: 'PRIX LIBRE', top: '68%', right: '10%', rot: -6, delay: 1.2 },
  { text: 'LOUTRE', top: '38%', left: '72%', rot: -18, delay: 0.6 },
  { text: 'DÉCLASSE', top: '82%', left: '28%', rot: 5, delay: 1.6 },
];

const TRAIL_COLORS = ['#FFE600', '#F4ECD8', '#E33B1F', '#C97A2A'];
const TRAIL_COUNT = 10;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return prefersReducedMotion;
}

export function useTripEasterEgg() {
  const [isTripping, setIsTripping] = useState(false);
  const [calmMessage, setCalmMessage] = useState(false);
  const timeoutRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const clearTripTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const stopTrip = useCallback(() => {
    clearTripTimeout();
    setIsTripping(false);
  }, [clearTripTimeout]);

  const triggerTrip = useCallback(() => {
    if (isTripping || calmMessage) return;

    if (prefersReducedMotion) {
      setCalmMessage(true);
      timeoutRef.current = setTimeout(() => {
        setCalmMessage(false);
        timeoutRef.current = null;
      }, CALM_DURATION_MS);
      return;
    }

    setIsTripping(true);
  }, [isTripping, calmMessage, prefersReducedMotion, clearTripTimeout]);

  useEffect(() => {
    if (!isTripping) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') stopTrip();
    };

    let pinchStart = null;

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinchStart = touchDistance(e.touches);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length !== 2 || pinchStart === null) return;
      const current = touchDistance(e.touches);
      const ratio = Math.abs(current - pinchStart) / pinchStart;
      if (ratio >= PINCH_STOP_RATIO) {
        stopTrip();
        pinchStart = null;
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length < 2) pinchStart = null;
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isTripping, stopTrip]);

  useEffect(() => () => clearTripTimeout(), [clearTripTimeout]);

  return { isTripping, triggerTrip, stopTrip, calmMessage };
}

function CursorTrail({ active }) {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const particles = Array.from({ length: TRAIL_COUNT }, (_, i) => {
      const el = document.createElement('div');
      el.className = 'trip-cursor-trail__dot';
      el.style.background = TRAIL_COLORS[i % TRAIL_COLORS.length];
      el.style.opacity = '0';
      container.appendChild(el);
      return { el, x: 0, y: 0, life: 0 };
    });
    particlesRef.current = particles;

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      particles.forEach((p, i) => {
        const target = mouseRef.current;
        const ease = 0.18 + i * 0.04;
        p.x += (target.x - p.x) * ease;
        p.y += (target.y - p.y) * ease;
        p.life = Math.min(1, p.life + 0.08);
        const size = 6 + (TRAIL_COUNT - i) * 1.2;
        p.el.style.transform = `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`;
        p.el.style.width = `${size}px`;
        p.el.style.height = `${size}px`;
        p.el.style.opacity = String(0.75 - i * 0.06);
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      particles.forEach((p) => p.el.remove());
      particlesRef.current = [];
    };
  }, [active]);

  if (!active) return null;

  return (
    <div ref={containerRef} className="trip-cursor-trail" aria-hidden="true" />
  );
}

function TripOverlay({ active }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setMessageIndex(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % TRIP_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <>
      <svg className="trip-warp-svg" aria-hidden="true">
        <defs>
          <filter id="trip-warp-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="3"
              seed="42"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="16s"
                values="0.008;0.025;0.015;0.008"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                dur="16s"
                values="0;28;18;8;28;0"
                keyTimes="0;0.25;0.5;0.65;0.85;1"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      <div className="trip-warp-layer" aria-hidden="true" />

      <div className="trip-noise-boost" aria-hidden="true" />

      <div className="trip-floating-words" aria-hidden="true">
        {FLOATING_WORDS.map((word) => (
          <span
            key={`${word.text}-${word.top}-${word.left ?? word.right}`}
            className="trip-floating-words__item"
            style={{
              top: word.top,
              left: word.left,
              right: word.right,
              '--trip-rot': `${word.rot}deg`,
              '--trip-delay': `${word.delay}s`,
            }}
          >
            {word.text}
          </span>
        ))}
      </div>

      <div className="trip-message" aria-hidden="true">
        <p key={messageIndex} className="trip-message__text">
          {TRIP_MESSAGES[messageIndex]}
        </p>
      </div>

      <CursorTrail active={active} />
    </>
  );
}

function TripExitHint({ visible }) {
  if (!visible) return null;

  return createPortal(
    <div className="trip-exit-hint" role="status">
      <span className="trip-exit-hint__keyboard">Échap pour arrêter</span>
      <span className="trip-exit-hint__sep" aria-hidden="true">
        ·
      </span>
      <span className="trip-exit-hint__touch">Pince avec 2 doigts pour arrêter</span>
    </div>,
    document.body,
  );
}

export function TripEasterEggLayer({ isTripping }) {
  return (
    <>
      <TripOverlay active={isTripping} />
      <TripExitHint visible={isTripping} />
    </>
  );
}

export function CalmTripToast({ visible }) {
  if (!visible) return null;

  return (
    <div className="trip-calm-toast" role="status">
      la loutre te voit. (version calme)
    </div>
  );
}
