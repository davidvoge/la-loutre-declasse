import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateExposantPrice } from '../../lib/calculateExposantPrice.js';
import {
  EXPOSANT_MAX_METERS,
  EXPOSANT_PRICE_3M,
  EXPOSANT_PRICE_PER_METER,
} from '../data/festival';
import { JAUNE, NOIR, NOISE } from './theme.jsx';
import './ExposantsPage.css';

const METER_OPTIONS = Array.from({ length: EXPOSANT_MAX_METERS }, (_, i) => i + 1);

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  standName: '',
  meters: 3,
};

export default function ExposantsPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const price = useMemo(
    () => calculateExposantPrice(form.meters),
    [form.meters],
  );

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/exposants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          standName: form.standName,
          meters: form.meters,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Envoi impossible pour le moment');
      }
      setStatus('success');
      setMessage('Candidature envoyée ! On te recontacte très vite.');
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Envoi impossible pour le moment');
    }
  }

  return (
    <div className="exposants-page" style={{ backgroundImage: NOISE }}>
      <header className="exposants-page__header">
        <div className="site-container exposants-page__header-inner">
          <Link to="/" className="exposants-page__back">
            ← Retour au festival
          </Link>
          <div className="exposants-page__brand">
            <img src="/assets/logo-mark.png" alt="" width={40} height={40} />
            <span>LA LOUTRE DÉCLASSE</span>
          </div>
        </div>
      </header>

      <main className="exposants-page__main">
        <div className="site-container site-container--narrow">
          <div className="section-intro">
            <div className="section-intro__eyebrow section-intro__eyebrow--red">
              // APPEL À EXPOSANTS
            </div>
            <h1 className="section-intro__title">CANDIDATURE STAND.</h1>
            <p className="exposants-page__intro">
              {EXPOSANT_PRICE_PER_METER} €/m · {EXPOSANT_PRICE_3M} € les 3 m · {EXPOSANT_MAX_METERS} m
              maximum
            </p>
          </div>

          <form className="exposants-form" onSubmit={handleSubmit} noValidate>
            <div className="exposants-form__row">
              <label className="exposants-form__field">
                <span>Prénom *</span>
                <input
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  required
                  disabled={status === 'loading'}
                />
              </label>
              <label className="exposants-form__field">
                <span>Nom *</span>
                <input
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  required
                  disabled={status === 'loading'}
                />
              </label>
            </div>

            <label className="exposants-form__field">
              <span>E-mail *</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                disabled={status === 'loading'}
              />
            </label>

            <label className="exposants-form__field">
              <span>Téléphone (optionnel)</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                disabled={status === 'loading'}
              />
            </label>

            <label className="exposants-form__field">
              <span>Nom du stand (produits vendus, etc.) *</span>
              <input
                type="text"
                name="standName"
                value={form.standName}
                onChange={(e) => updateField('standName', e.target.value)}
                required
                disabled={status === 'loading'}
              />
            </label>

            <fieldset className="exposants-form__meters" disabled={status === 'loading'}>
              <legend>Mètres linéaires souhaités *</legend>
              <div className="exposants-form__meters-grid" role="radiogroup" aria-label="Mètres linéaires">
                {METER_OPTIONS.map((m) => {
                  const optionPrice = calculateExposantPrice(m);
                  const id = `meters-${m}`;
                  return (
                    <label key={m} className="exposants-form__meter-option">
                      <input
                        type="radio"
                        name="meters"
                        id={id}
                        value={m}
                        checked={form.meters === m}
                        onChange={() => updateField('meters', m)}
                      />
                      <span className="exposants-form__meter-label">
                        {m} m
                        <span className="exposants-form__meter-price">{optionPrice} €</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="exposants-price" aria-live="polite">
              <span className="exposants-price__label">Estimation</span>
              <span className="exposants-price__value">{price} €</span>
              <span className="exposants-price__detail">
                pour {form.meters} m linéaire{form.meters > 1 ? 's' : ''}
              </span>
            </div>

            <button
              type="submit"
              className="exposants-form__submit"
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading' ? 'ENVOI…' : 'ENVOYER MA CANDIDATURE →'}
            </button>

            {message && (
              <p
                className={`exposants-form__status exposants-form__status--${status}`}
                role="status"
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </main>

      <footer className="exposants-page__footer" style={{ color: JAUNE, background: NOIR }}>
        <div className="site-container">
          <p>La Loutre déclasse · 3–5 juillet 2026</p>
        </div>
      </footer>
    </div>
  );
}
