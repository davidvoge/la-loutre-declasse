import { subscribeToNewsletter } from '../lib/subscribeNewsletter.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = req.body?.email;
  const apiKey = process.env.BREVO_API_KEY;

  try {
    await subscribeToNewsletter(email, apiKey);
    return res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Inscription impossible';
    const status = message === 'Adresse e-mail invalide' ? 400 : 502;
    return res.status(status).json({ error: message });
  }
}
