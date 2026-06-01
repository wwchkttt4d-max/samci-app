const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const host = '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const root = __dirname;

// Parse auth users from .env.local
function parseAuthUsers() {
  const envUsers = process.env.VITE_AUTH_USERS || 'admin@avico-pro.ci:admin123,admin@sam-ci.ci:admin123,vendeur@avico-pro.ci:vendeur123,vendeur@sam-ci.ci:vendeur123,livreur@avico-pro.ci:livreur123,livreur@sam-ci.ci:livreur123,compta@avico-pro.ci:compta123,compta@sam-ci.ci:compta123';
  return envUsers.split(',').map(pair => {
    const [email, password] = pair.split(':');
    return { email: email.trim(), password: password.trim() };
  });
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function writeLog(message) {
  fs.appendFile(path.join(root, 'local-server.log'), `${new Date().toISOString()} ${message}\n`, () => {});
}

function resolveRequestPath(url) {
  const cleanUrl = decodeURIComponent((url || '/').split('?')[0]);
  const requested = cleanUrl === '/' ? '/index.html' : cleanUrl;
  const filePath = path.resolve(root, `.${requested}`);
  return filePath.startsWith(root) ? filePath : path.join(root, '404.html');
}

const server = http.createServer((req, res) => {
  // API endpoint for auth users
  if (req.url === '/api/auth-users') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(parseAuthUsers()));
    return;
  }

  const filePath = resolveRequestPath(req.url);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (error, data) => {
    if (error) {
      const fallback = path.join(root, 'index.html');
      fs.readFile(fallback, (fallbackError, fallbackData) => {
        if (fallbackError) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Fichier introuvable');
          return;
        }
        // Inject AUTH_USERS into index.html
        const html = fallbackData.toString().replace(
          /const AUTH_USERS = \[[\s\S]*?\];/,
          `const AUTH_USERS = ${JSON.stringify(parseAuthUsers())};`
        );
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      });
      return;
    }

    // Inject AUTH_USERS if serving index.html
    let content = data;
    if (filePath.endsWith('index.html')) {
      content = data.toString().replace(
        /const AUTH_USERS = \[[\s\S]*?\];/,
        `const AUTH_USERS = ${JSON.stringify(parseAuthUsers())};`
      );
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(content);
  });
});

server.on('error', error => {
  writeLog(`ERROR ${error.message}`);
});

server.listen(port, host, () => {
  writeLog(`READY http://${host}:${port}/`);
});
