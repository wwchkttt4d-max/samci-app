// Mini serveur Express pour AVICO-PRO (optionnel)
// Pour lancer : node mini-server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir les fichiers statiques
app.use(express.static(__dirname));

// API Routes
app.get('/api/version', (req, res) => {
  res.json({
    version: '4.0.0',
    name: 'AVICO-PRO',
    lastUpdated: new Date().toISOString()
  });
});

// Route par défaut vers index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur AVICO-PRO démarré sur http://localhost:${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}/api/version`);
});

// Pour utiliser ce serveur :
// 1. npm install express
// 2. node mini-server.js
// 3. Allez sur http://localhost:3000
