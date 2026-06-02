import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BILLETTERIE_URL,
  DAYS,
  EXPOSANTS_SECTION,
  INFOS,
  parseHourSort,
} from '../data/festival';
import { useArtists } from '../hooks/useArtists';
import { usePartners } from '../hooks/usePartners';
import { ICON_MAP, IconInsta, IconMail } from './icons';
import { CalmTripToast, TripEasterEggLayer, useTripEasterEgg } from './TripEasterEgg.jsx';
import { CREME, JAUNE, NOIR, NOISE, ROUGE, Tape } from './theme.jsx';
import './PhotocopieSite.css';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function Header({ onTripTrigger }) {
  const anchorLinks = [
    { label: 'PROG', id: 'programmation' },
    { label: 'TICKETS', id: 'billetterie' },
    { label: 'INFOS', id: 'infos' },
    { label: 'LE FESTIVAL', id: 'hero' },
    { label: 'BÉNÉVOLES', id: 'contact' },
  ];

  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <a
          href="#hero"
          className="site-header__brand"
          onClick={(e) => {
            e.preventDefault();
            if (!window.matchMedia('(max-width: 899px)').matches) {
              scrollTo('hero');
            }
          }}
        >
          <div
            className="site-header__logo site-header__logo--trip-trigger"
            onClick={(e) => {
              if (window.matchMedia('(max-width: 899px)').matches) {
                e.preventDefault();
                e.stopPropagation();
                onTripTrigger?.();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (window.matchMedia('(max-width: 899px)').matches) {
                  e.preventDefault();
                  onTripTrigger?.();
                }
              }
            }}
            role="presentation"
          >
            <img src="/assets/logo-mark.png" alt="La Loutre déclasse" />
          </div>
          <div className="site-header__titles">
            <span className="site-header__name">LA LOUTRE DÉCLASSE</span>
            <span className="site-header__edition">// 2ᵉ ÉDITION · 3-5 JUILLET 26</span>
          </div>
        </a>
        <nav className="site-header__nav" aria-label="Navigation principale">
          {anchorLinks.map(({ label, id }) => (
            <a
              key={label}
              href={`#${id}`}
              className="site-header__link"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
            >
              {label}
            </a>
          ))}
          <Link to="/exposants" className="site-header__link">
            EXPOSANTS
          </Link>
          <a
            href={BILLETTERIE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-header__cta"
          >
            ★ PRÉVENTE OUVERTE
          </a>
        </nav>
      </div>
    </header>
  );
}

const TICKER_ITEMS = [
  'PRÉVENTE OUVERTE',
  'PRIX LIBRE',
  'CAMPING GRATUIT',
  'CANTINE SUR PLACE',
  'MARCHÉ CRÉATEUR',
  'LOGUIVY-PLOUGRAS',
];

const TICKER_TEXT = `${TICKER_ITEMS.map((item) => `★ ${item}`).join(' ')} `;

function Hero({ onTripTrigger }) {
  return (
    <section id="hero" className="hero" style={{ backgroundImage: NOISE }}>
      <div className="site-container hero__inner">
        <div className="hero__badge">2ᵉ ÉDITION · 3-5 JUILLET 2026</div>

        <h1 className="hero__title">
          LA LOUTRE
          <br />
          <span className="hero__title-accent">DÉCLASSE</span>
        </h1>

        <div className="hero__band">
          <div className="hero__band-cell">
            <div className="hero__band-label">DATES</div>
            <div className="hero__band-value">VEN 3 / SAM 4 / DIM 5 JUILLET 26</div>
          </div>
          <div className="hero__band-cell">
            <div className="hero__band-label">OÙ</div>
            <div className="hero__band-value hero__band-value--sm">LOGUIVY-PLOUGRAS (22)</div>
          </div>
          <div className="hero__band-cell hero__band-cell--highlight">
            <div className="hero__band-label">TARIF</div>
            <div className="hero__band-value hero__band-value--sm">PRIX LIBRE</div>
          </div>
        </div>

        <div className="hero__note">
          <div className="hero__note-inner">
            &ldquo;ce festival n&apos;a pas de tête d&apos;affiche.
            <br />
            tous les noms sont gros.&rdquo;{' '}
            <button type="button" className="hero__loutre-trigger" onClick={onTripTrigger}>
              — la loutre
            </button>
            <Tape w={70} rot={-12} style={{ top: -10, left: '50%', marginLeft: -35 }} color={ROUGE} />
          </div>
        </div>
      </div>

      <div className="hero__ticker">
        <div className="hero__ticker-track" aria-hidden="true">
          <span>{TICKER_TEXT}</span>
          <span>{TICKER_TEXT}</span>
        </div>
      </div>
    </section>
  );
}

function Lineup({ lineup, onOpenArtist }) {
  return (
    <section id="programmation" className="lineup">
      <div className="site-container">
        <div className="lineup__head">
          <h2 className="lineup__title">à l&apos;affiche.</h2>
          <div className="lineup__days">
            {DAYS.map((d) => (
              <a
                key={d.id}
                href={`#${d.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(d.id);
                }}
              >
                {d.short} {d.date}
              </a>
            ))}
          </div>
        </div>

        <div className="lineup__poster">
          <div className="lineup__names">
            {lineup.filter((a) => a.showOnPoster !== false).map((a, i) => {
              const invert = i === 2 || i === 5;
              return (
                <button
                  key={a.id}
                  type="button"
                  className={`lineup__name lineup__name--${a.size}${invert ? ' lineup__name--invert' : ''}`}
                  style={{ transform: `rotate(${(i % 7 - 3) * 0.5}deg)` }}
                  onClick={() => onOpenArtist(a.id)}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
          <p className="lineup__extras">
            + ATELIERS · MARCHÉ D&apos;ARTISAN·ES · REPAS &amp; BUVETTE · BRUNCH DIMANCHE · CAMPING · TOMBOLA
          </p>
        </div>
      </div>
    </section>
  );
}

function DayBlock({ day, lineup, onOpenArtist }) {
  const acts = lineup
    .filter((a) => a.day === day.id)
    .sort((a, b) => parseHourSort(a.time) - parseHourSort(b.time));

  return (
    <div id={day.id} className="day-block">
      <div className="day-block__head">
        <span className="day-block__label">{day.label}.</span>
        <span className="day-block__date">{day.date} 26</span>
        <span className="day-block__count">// {acts.length} ACTES</span>
      </div>
      <div className="day-block__acts">
        {acts.map((a, i) => (
          <article
            key={a.id}
            className={`act-row${i % 2 === 0 ? ' act-row--yellow' : ' act-row--creme'}`}
            style={{ transform: `rotate(${(i % 3 - 1) * 0.15}deg)` }}
          >
            <div className="act-row__time">{a.time}</div>
            <div className="act-row__main">
              <h3>{a.name}</h3>
              <div className="act-row__genre">{a.genre}</div>
            </div>
            <div className="act-row__desc">
              {a.desc.slice(0, 70)}
              {a.desc.length > 70 ? '…' : ''}
            </div>
            <button type="button" className="act-row__btn" onClick={() => onOpenArtist(a.id)}>
              + d&apos;infos
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Timetable({ lineup, onOpenArtist }) {
  return (
    <section className="timetable" style={{ backgroundImage: NOISE }}>
      <div className="site-container">
        <div className="section-intro">
          <div className="section-intro__eyebrow">// JOUR PAR JOUR</div>
          <h2 className="section-intro__title section-intro__title--yellow">
            QU&apos;EST-CE QU&apos;ON FAIT ?
          </h2>
        </div>
        {DAYS.map((d) => (
          <DayBlock key={d.id} day={d} lineup={lineup} onOpenArtist={onOpenArtist} />
        ))}
      </div>
    </section>
  );
}

function AppelExposants() {
  const { eyebrow, title, lede, cta } = EXPOSANTS_SECTION;

  return (
    <section id="exposants" className="appel-exposants" style={{ backgroundImage: NOISE }}>
      <div className="site-container site-container--narrow">
        <div className="section-intro">
          <div className="section-intro__eyebrow section-intro__eyebrow--red">{eyebrow}</div>
          <h2 className="section-intro__title section-intro__title--yellow">{title}</h2>
          <p className="appel-exposants__kicker">7 €/m · 20 € les 3 m · 6 m max</p>
        </div>

        <div className="appel-exposants__card">
          <div className="appel-exposants__badge">MARCHÉ DU FESTIVAL</div>
          <div>
            <p className="appel-exposants__lede">{lede}</p>
          </div>
          <Link to="/exposants" className="appel-exposants__cta">
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Billetterie() {
  return (
    <section id="billetterie" className="billetterie">
      <div className="site-container site-container--narrow">
        <div className="section-intro">
          <div className="section-intro__eyebrow section-intro__eyebrow--red">// PRÉVENTE · BILLETTERIE</div>
          <h2 className="section-intro__title">CHOPE TON BILLET.</h2>
          <p className="billetterie__kicker">Prix libre · prévente ouverte</p>
        </div>

        <div className="billetterie__card">
          <div className="billetterie__badge">PRÉVENTE OUVERTE</div>
          <div>
            <p className="billetterie__lede">
              <strong>Réserver à l&apos;avance nous aide énormément à organiser le festival.</strong> Tu paies
              ce que tu peux, ce que tu veux, ce qui te semble juste.
            </p>
            <p className="billetterie__note">
              Si tu cherches une idée, beaucoup mettent autour de 20€ pour les 3 jours — mais vraiment, c&apos;est
              toi qui décides.
              <br />
              Camping inclus. Cantine sur place. Bar coopératif.
            </p>
          </div>
          <a
            href={BILLETTERIE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="billetterie__cta"
          >
            RÉSERVER EN PRÉVENTE <span>↗</span>
          </a>
        </div>

        <p className="billetterie__redirect">
          Prévente hébergée sur HelloAsso. Tu seras redirigé·e en cliquant.
        </p>
      </div>
    </section>
  );
}

function Infos() {
  return (
    <section id="infos" className="infos" style={{ backgroundImage: NOISE }}>
      <div className="site-container">
        <div className="section-intro">
          <div className="section-intro__eyebrow">// INFOS PRATIQUES</div>
          <h2 className="section-intro__title section-intro__title--yellow">AVANT DE DÉBARQUER.</h2>
        </div>
        <div className="infos__grid">
          {INFOS.map((info, i) => {
            const I = ICON_MAP[info.icon];
            return (
              <div
                key={info.title}
                className="info-card"
                style={{ transform: `rotate(${(i % 3 - 1) * 0.3}deg)` }}
              >
                <Tape w={60} rot={-6} style={{ top: -12, left: 18 }} color={ROUGE} />
                <div className="info-card__icon">
                  <I size={22} color={JAUNE} />
                </div>
                <h3>{info.title}</h3>
                <p>{info.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer({ partners }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Inscription impossible');
      }

      setStatus('success');
      setMessage('Inscrit·e ! On t\'envoie les actus très bientôt.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Inscription impossible');
    }
  }

  return (
    <footer id="contact" className="site-footer" style={{ backgroundImage: NOISE }}>
      <div className="site-container">
        <div className="site-footer__grid">
          <div className="site-footer__newsletter">
            <h2>
              REÇOIS LA
              <br />
              NEWSLETTER.
            </h2>
            <p>On t&apos;envoie les actus de la convergence tous les mois.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="TON@EMAIL.FR"
                aria-label="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? '…' : 'OK →'}
              </button>
            </form>
            {message && (
              <p
                className={`newsletter-form__status${
                  status === 'success' ? ' newsletter-form__status--success' : ''
                }${status === 'error' ? ' newsletter-form__status--error' : ''}`}
                role="status"
              >
                {message}
              </p>
            )}
          </div>
          <div>
            <h4>// LE FESTIVAL</h4>
            <ul>
              {[
                ['Programmation', 'programmation'],
                ['Billetterie', 'billetterie'],
                ['Infos pratiques', 'infos'],
                ['Éditions passées', 'hero'],
              ].map(([label, id]) => (
                <li key={label}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(id);
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>// CONTACT</h4>
            <ul>
              <li>
                <a href="mailto:contact@laconvergencedesloutres.fr">contact@laconvergencedesloutres.fr</a>
              </li>
              <li>
                <a href="tel:+33256392176">02 56 39 21 76</a>
              </li>
              <li className="site-footer__social">
                <a href="#" aria-label="Instagram">
                  <IconInsta size={18} color={NOIR} />
                </a>
                <a href="mailto:contact@laconvergencedesloutres.fr" aria-label="E-mail">
                  <IconMail size={18} color={NOIR} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {partners.length > 0 && (
          <div className="site-footer__partners">
            <span className="site-footer__partners-label">// avec</span>
            <div className="site-footer__partners-list">
              {partners.map((partner) => {
                const content = partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="site-footer__partners-logo"
                  />
                ) : (
                  <span className="site-footer__partners-name">{partner.name}</span>
                );

                return partner.url ? (
                  <a
                    key={partner.id}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-footer__partners-item"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={partner.id} className="site-footer__partners-item">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="site-footer__legal">
          <span>© 2026 LA LOUTRE DÉCLASSE // CONVERGENCE DES LOUTRES // ASSO LOI 1901</span>
          <span>SITE FAIT À LA MAIN · COPIEZ-LE</span>
        </div>
      </div>
    </footer>
  );
}

function ArtistModal({ artistId, lineup, onClose }) {
  const artist = artistId ? lineup.find((a) => a.id === artistId) : null;
  const bodyRef = useRef(null);
  const [scrollState, setScrollState] = useState({ canScroll: false, atBottom: false });

  const updateScrollState = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const canScroll = el.scrollHeight > el.clientHeight + 4;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 12;
    setScrollState({ canScroll, atBottom });
  }, []);

  useEffect(() => {
    if (!artist) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', updateScrollState);
    const frame = requestAnimationFrame(updateScrollState);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', updateScrollState);
      cancelAnimationFrame(frame);
    };
  }, [artist, onClose, updateScrollState]);

  useEffect(() => {
    if (!artist || !bodyRef.current) return;
    bodyRef.current.scrollTop = 0;
    const frame = requestAnimationFrame(updateScrollState);
    return () => cancelAnimationFrame(frame);
  }, [artist?.id, updateScrollState]);

  if (!artist) return null;

  const dayLabel = DAYS.find((d) => d.id === artist.day);
  const showScrollHint = scrollState.canScroll && !scrollState.atBottom;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal__bar">
          <span>
            // FICHE ARTISTE · {dayLabel?.short} {dayLabel?.date}
          </span>
          <button type="button" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <div className="modal__photo">
          <img src={artist.img} alt="" onLoad={updateScrollState} />
          <div className="modal__photo-noise" style={{ backgroundImage: NOISE }} />
          <div className="modal__photo-badge">{artist.time}</div>
        </div>

        <div
          ref={bodyRef}
          className="modal__body"
          onScroll={updateScrollState}
        >
          <div className="modal__genre">{artist.genre}</div>
          <h2 id="modal-title">{artist.name}</h2>
          <p>{artist.long}</p>
          {artist.url && artist.url !== '#' && (
            <div className="modal__actions">
              <a href={artist.url} target="_blank" rel="noopener noreferrer">
                {artist.urlLabel || 'Écouter'} <span>↗</span>
              </a>
              <a href={BILLETTERIE_URL} target="_blank" rel="noopener noreferrer">
                Réserver en prévente <span>↗</span>
              </a>
            </div>
          )}
          {showScrollHint && (
            <div className="modal__scroll-hint" aria-hidden="true">
              ↓ Faire défiler pour en voir plus
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PhotocopieSite() {
  const [openArtist, setOpenArtist] = useState(null);
  const { lineup } = useArtists();
  const { partners } = usePartners();
  const { isTripping, triggerTrip, calmMessage } = useTripEasterEgg();

  return (
    <div className={`photocopie-site${isTripping ? ' trip-active' : ''}`}>
      <Header onTripTrigger={triggerTrip} />
      <Hero onTripTrigger={triggerTrip} />
      <Lineup lineup={lineup} onOpenArtist={setOpenArtist} />
      <Timetable lineup={lineup} onOpenArtist={setOpenArtist} />
      <Billetterie />
      <Infos />
      <AppelExposants />
      <Footer partners={partners} />
      <ArtistModal artistId={openArtist} lineup={lineup} onClose={() => setOpenArtist(null)} />
      <TripEasterEggLayer isTripping={isTripping} />
      <CalmTripToast visible={calmMessage} />
    </div>
  );
}

export { NOIR, JAUNE, CREME, ROUGE };
