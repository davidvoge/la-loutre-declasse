import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { sendExposantApplication } from './lib/sendExposantApplication.js';
import { subscribeToNewsletter } from './lib/subscribeNewsletter.js';
import { BILLETTERIE_URL } from './src/data/festival.js';

const EXTERNAL_REDIRECTS = {
  '/presse': 'https://drive.google.com/drive/folders/19Alatmqgz_Zl52zddsh1MOGCb5gMFapr?usp=sharing',
  '/billeterie': BILLETTERIE_URL,
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'newsletter-api-dev',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const path = req.url?.split('?')[0];
            const destination = path && EXTERNAL_REDIRECTS[path];
            if (destination) {
              res.writeHead(302, { Location: destination });
              res.end();
              return;
            }
            next();
          });

          server.middlewares.use('/api/newsletter', async (req, res, next) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            try {
              const body = await readJsonBody(req);
              await subscribeToNewsletter(body.email, env.BREVO_API_KEY);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Inscription impossible';
              const status = message === 'Adresse e-mail invalide' ? 400 : 502;
              res.statusCode = status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: message }));
            }
          });

          server.middlewares.use('/api/exposants', async (req, res, next) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            try {
              const body = await readJsonBody(req);
              await sendExposantApplication(body, env);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
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
              res.statusCode = status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: message }));
            }
          });
        },
      },
    ],
  };
});
