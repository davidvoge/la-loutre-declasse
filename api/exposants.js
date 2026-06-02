import { sendExposantApplication } from '../lib/sendExposantApplication.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await sendExposantApplication(req.body, process.env);
    return res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Envoi impossible';
    const clientErrors = [
      'Le prénom est requis',
      'Le nom est requis',
      'Adresse e-mail invalide',
      'Le nom du stand est requis',
      'Nombre de mètres linéaires invalide',
    ];
    const status = clientErrors.includes(message) ? 400 : 502;
    return res.status(status).json({ error: message });
  }
}
