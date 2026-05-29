const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const root = __dirname;

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
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fallbackData);
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
});

server.on('error', error => {
  writeLog(`ERROR ${error.message}`);
});

server.listen(port, host, () => {
  writeLog(`READY http://${host}:${port}/`);
});
