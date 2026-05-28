import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { subscribeToNewsletter } from './lib/subscribeNewsletter.js';

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
            if (req.url === '/presse' || req.url?.startsWith('/presse?')) {
              res.writeHead(302, {
                Location: 'https://drive.google.com/drive/folders/19Alatmqgz_Zl52zddsh1MOGCb5gMFapr?usp=sharing',
              });
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
        },
      },
    ],
  };
});
