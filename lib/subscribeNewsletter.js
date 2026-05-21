export const BREVO_LIST_IDS = [36, 29];

export async function subscribeToNewsletter(email, apiKey) {
  if (!apiKey) {
    throw new Error('Configuration Brevo manquante');
  }

  const trimmed = String(email || '').trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new Error('Adresse e-mail invalide');
  }

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      email: trimmed,
      listIds: BREVO_LIST_IDS,
      updateEnabled: true,
    }),
  });

  if (response.status === 201 || response.status === 204) {
    return { ok: true };
  }

  let message = 'Inscription impossible pour le moment';
  try {
    const data = await response.json();
    if (data?.message) message = data.message;
  } catch {
    // ignore JSON parse errors
  }

  throw new Error(message);
}
