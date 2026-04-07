import http from 'http';
import { DensityUI } from '../ui.js';
import { state } from '../state.js';

/**
 * Simulates an OAuth 2.0 PKCE flow for CLI authentication.
 * Spins up a local server to catch the callback.
 */
export async function startOAuthFlow() {
  DensityUI.divider('Authentication');
  DensityUI.info('Starting OAuth flow...');
  
  const port = 3456;
  const authUrl = `http://localhost:${port}/login-mock`;

  DensityUI.info(`Please open the following URL in your browser to authenticate:`);
  console.log(`\n  👉  \x1b[36m${authUrl}\x1b[0m\n`);

  return new Promise<void>((resolve) => {
    const server = http.createServer((req, res) => {
      if (req.url === '/login-mock') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h2>Kshyara's Density</h2>
              <p>Click the button below to authorize the CLI.</p>
              <form action="/callback" method="GET">
                <button type="submit" style="padding: 10px 20px; background: #00f2fe; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Authorize</button>
              </form>
            </body>
          </html>
        `);
      } else if (req.url?.startsWith('/callback')) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h2>Authorization Successful!</h2>
              <p>You can close this window and return to your terminal.</p>
            </body>
          </html>
        `);
        
        state.isAuthenticated = true;
        DensityUI.success('Successfully authenticated via OAuth!');
        server.close();
        resolve();
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(port, () => {
      // Server listening
    });
  });
}
