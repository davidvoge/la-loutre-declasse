import { Resend } from 'resend';
import { calculateExposantPrice } from './calculateExposantPrice.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function validateExposantPayload(body) {
  const firstName = String(body?.firstName ?? '').trim();
  const lastName = String(body?.lastName ?? '').trim();
  const email = String(body?.email ?? '').trim().toLowerCase();
  const phone = String(body?.phone ?? '').trim();
  const standName = String(body?.standName ?? '').trim();
  const meters = Number(body?.meters);

  if (!firstName) throw new Error('Le prénom est requis');
  if (!lastName) throw new Error('Le nom est requis');
  if (!email || !EMAIL_RE.test(email)) throw new Error('Adresse e-mail invalide');
  if (!standName) throw new Error('Le nom du stand est requis');

  const price = calculateExposantPrice(meters);
  if (price === null) throw new Error('Nombre de mètres linéaires invalide');

  return {
    firstName,
    lastName,
    email,
    phone: phone || null,
    standName,
    meters,
    price,
  };
}

export async function sendExposantApplication(body, env) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Configuration Resend manquante');
  }

  const from = env.RESEND_FROM_EMAIL || 'La Loutre déclasse <onboarding@resend.dev>';
  const to = env.EXPOSANTS_NOTIFY_EMAIL || 'crealoutres@gmail.com';

  const data = validateExposantPayload(body);
  const resend = new Resend(apiKey);

  const subject = `Candidature exposant — ${data.standName}`;
  const html = `
    <h2>Nouvelle candidature exposant</h2>
    <p><strong>Stand :</strong> ${escapeHtml(data.standName)}</p>
    <p><strong>Prénom :</strong> ${escapeHtml(data.firstName)}</p>
    <p><strong>Nom :</strong> ${escapeHtml(data.lastName)}</p>
    <p><strong>E-mail :</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Téléphone :</strong> ${escapeHtml(data.phone || '—')}</p>
    <p><strong>Mètres linéaires :</strong> ${data.meters} m</p>
    <p><strong>Prix estimé :</strong> ${data.price} €</p>
  `;

  const text = [
    'Nouvelle candidature exposant',
    '',
    `Stand : ${data.standName}`,
    `Prénom : ${data.firstName}`,
    `Nom : ${data.lastName}`,
    `E-mail : ${data.email}`,
    `Téléphone : ${data.phone || '—'}`,
    `Mètres linéaires : ${data.meters} m`,
    `Prix estimé : ${data.price} €`,
  ].join('\n');

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: data.email,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message || 'Envoi impossible pour le moment');
  }

  return { ok: true };
}
