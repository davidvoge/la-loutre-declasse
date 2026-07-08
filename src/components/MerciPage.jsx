import { useState } from 'react';
import { IconFacebook, IconInsta, IconMail } from './icons';
import { CREME, JAUNE, NOIR, NOISE, ROUGE } from './theme.jsx';
import './MerciPage.css';

const MERCIS = [
  'aux artistes',
  'aux exposant·es',
  'aux participant·es',
  'aux bénévoles',
  'aux producteur·rices',
];

export default function MerciPage() {
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
      setMessage('Inscrit·e ! On te prévient pour la prochaine édition.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Inscription impossible');
    }
  }

  return (
    <div className="merci-page" style={{ backgroundImage: NOISE }}>
      <main className="merci-page__main">
        <div className="merci-page__brand">
          <img src="/assets/logo-mark.png" alt="La Loutre déclasse" />
          <div className="merci-page__brand-titles">
            <span className="merci-page__name">LA LOUTRE DÉCLASSE</span>
            <span className="merci-page__edition">// 2ᵉ ÉDITION · 3-5 JUILLET 2026</span>
          </div>
        </div>

        <div className="merci-page__eyebrow">// C&apos;EST FINI POUR CETTE ANNÉE</div>

        <h1 className="merci-page__title">MERCI.</h1>

        <ul className="merci-page__list">
          {MERCIS.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>

        <p className="merci-page__next">À l&apos;année prochaine. 🦦</p>

        <div className="merci-page__newsletter">
          <h2>
            RESTE
            <br />
            DANS LA BOUCLE.
          </h2>
          <p>Laisse ton email, on te prévient dès qu&apos;on prépare la 3ᵉ édition.</p>
          <form className="merci-newsletter-form" onSubmit={handleNewsletterSubmit}>
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
              className={`merci-newsletter-form__status${
                status === 'success' ? ' merci-newsletter-form__status--success' : ''
              }${status === 'error' ? ' merci-newsletter-form__status--error' : ''}`}
              role="status"
            >
              {message}
            </p>
          )}
        </div>

        <div className="merci-page__contact">
          <a href="mailto:contact@laconvergencedesloutres.fr" aria-label="E-mail">
            <IconMail size={18} color={CREME} />
          </a>
          <a
            href="https://www.instagram.com/convergencedesloutres/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <IconInsta size={18} color={CREME} />
          </a>
          <a
            href="https://www.facebook.com/p/La-Convergence-des-Loutres-61556130330890/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <IconFacebook size={18} color={CREME} />
          </a>
        </div>

        <div className="merci-page__legal">
          © 2026 LA LOUTRE DÉCLASSE // CONVERGENCE DES LOUTRES // ASSO LOI 1901
        </div>
      </main>
    </div>
  );
}

export { NOIR, JAUNE, CREME, ROUGE };
