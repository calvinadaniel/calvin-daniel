/**
 * One-time OAuth helper: opens a browser, captures the code, prints a refresh token.
 *
 * Usage (PowerShell):
 *   $env:GOOGLE_CLIENT_ID="..."
 *   $env:GOOGLE_CLIENT_SECRET="..."
 *   npm run auth
 *
 * Create an OAuth Desktop client (or Web client with redirect http://127.0.0.1:53682/).
 */

import http from 'node:http';
import { URL } from 'node:url';
import { exec } from 'node:child_process';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const PORT = 53682;
const REDIRECT = `http://127.0.0.1:${PORT}/`;
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.freebusy',
].join(' ');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, then re-run.');
  process.exit(1);
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

const openBrowser = (url) => {
  const platform = process.platform;
  const cmd =
    platform === 'win32' ? `start "" "${url}"` :
    platform === 'darwin' ? `open "${url}"` :
    `xdg-open "${url}"`;
  exec(cmd);
};

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url, REDIRECT);
    const code = reqUrl.searchParams.get('code');
    const err = reqUrl.searchParams.get('error');
    if (err) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`OAuth error: ${err}`);
      server.close();
      process.exit(1);
    }
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing code');
      return;
    }

    const body = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const tokens = await tokenRes.json();
    if (!tokenRes.ok) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(JSON.stringify(tokens, null, 2));
      server.close();
      process.exit(1);
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<p>Authorized. You can close this tab and return to the terminal.</p>');

    console.log('\n--- Copy into wrangler secrets ---\n');
    console.log('GOOGLE_REFRESH_TOKEN=');
    console.log(tokens.refresh_token || '(missing — revoke app access and re-run with prompt=consent)');
    console.log('\nAlso set BOOKING_CALENDAR_ID=primary (or your calendar ID)\n');
    server.close();
    process.exit(0);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(String(e));
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Listening on', REDIRECT);
  console.log('Opening browser for Google consent…');
  console.log(authUrl.toString());
  openBrowser(authUrl.toString());
});
