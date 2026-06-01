const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const host = '127.0.0.1';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Gérer les URLs
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Vérifier si le fichier existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Fichier non trouvé</h1>');
      return;
    }

    // Obtenir l'extension du fichier
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Lire et servir le fichier
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Erreur serveur</h1>');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(port, host, () => {
  console.log(`\n🚀 Serveur démarré avec succès!`);
  console.log(`📍 URL: http://${host}:${port}`);
  console.log(`📁 Répertoire: ${__dirname}`);
  console.log(`⏰ Heure: ${new Date().toLocaleString('fr-FR')}`);
  console.log(`\n🌐 Ouvrez votre navigateur et allez à: http://${host}:${port}`);
  console.log(`🛑 Pour arrêter: Ctrl+C\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${port} déjà utilisé. Essayez un autre port.`);
  } else {
    console.log(`❌ Erreur serveur: ${err.message}`);
  }
});
