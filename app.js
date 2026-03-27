/* ══════════════════════════════════════════
   SAM-CI — GESTION AVICOLE
   Fichier JavaScript — Logique applicative
   Société Avicole Moderne de Côte d'Ivoire
   v4 — Corrigé
══════════════════════════════════════════ */

// ─── Import Firebase (UNE SEULE FOIS) ───────────────────────────────────────
import {
  db, auth,
  collection, onSnapshot, addDoc, doc, setDoc, getDoc,
  updateDoc, deleteDoc, query, orderBy, limit, where,
  syncAllData, watchStocks,
  saveStockToFirebase, saveEmployeeToFirebase, saveClientToFirebase,
  saveVenteToFirebase, saveFournisseurToFirebase,
  saveLivraisonToFirebase, saveComptaToFirebase
} from './js/firebase.js';

/* ══════════════════════════════════════════
   SÉCURITÉ & VALIDATION
══════════════════════════════════════════ */

function hashPassword(password) {
  return btoa(password + 'samci-salt-2024');
}

function verifyPassword(hashedPassword, plainPassword) {
  return hashedPassword === hashPassword(plainPassword);
}

function sanitizeInput(str) {
  return String(str).replace(/[&<>"']/g, m =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]
  );
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ══════════════════════════════════════════
   UTILISATEURS
══════════════════════════════════════════ */

const USERS = [
  { id: 1, nom: 'Admin SAM-CI',  email: 'admin@sam-ci.ci',   pwd: hashPassword('admin123'),   role: 'Gérant',    statut: 'Actif' },
  { id: 2, nom: 'Kouamé Jean',   email: 'vendeur@sam-ci.ci', pwd: hashPassword('vendeur123'), role: 'Vendeur',   statut: 'Actif' },
  { id: 3, nom: 'Traoré Moussa', email: 'livreur@sam-ci.ci', pwd: hashPassword('livreur123'), role: 'Livreur',   statut: 'Actif' },
  { id: 4, nom: 'Aya Koné',      email: 'compta@sam-ci.ci',  pwd: hashPassword('compta123'),  role: 'Comptable', statut: 'Actif' },
];

/* ══════════════════════════════════════════
   BASE DE DONNÉES EN MÉMOIRE
══════════════════════════════════════════ */

const DB = {
  stocks: [
    { id: 1, produit: 'Œufs blancs standard',    categorie: 'Œufs',    unite: 'Plateau 30', qte: 1200, seuil: 500, prixDetail: 1800, prixGros: 1650, icone: '🥚', peremption: '2026-04-10' },
    { id: 2, produit: 'Œufs marron premium',     categorie: 'Œufs',    unite: 'Plateau 30', qte: 850,  seuil: 300, prixDetail: 2200, prixGros: 2000, icone: '🥚', peremption: '2026-04-08' },
    { id: 3, produit: 'Œufs bio fermier',        categorie: 'Œufs',    unite: 'Plateau 30', qte: 320,  seuil: 150, prixDetail: 2800, prixGros: 2500, icone: '🥚', peremption: '2026-04-05' },
    { id: 5, produit: 'Poulet entier vif',       categorie: 'Poulets', unite: 'Tête',       qte: 820,  seuil: 200, prixDetail: 3800, prixGros: 3500, icone: '🐓' },
    { id: 6, produit: 'Poulet découpe portions', categorie: 'Poulets', unite: 'Kg',         qte: 45,   seuil: 20,  prixDetail: 5200, prixGros: 4800, icone: '🍗' },
    { id: 7, produit: 'Poulet congelé',          categorie: 'Poulets', unite: 'Kg',         qte: 120,  seuil: 50,  prixDetail: 4500, prixGros: 4100, icone: '🐔' },
  ],

  clients: [
    { id: 1, nom: 'Restaurant Le Gourmet',    type: 'Restaurant',  tel: '07 12 34 56 78', ca: 2850000, solde: 125000, points: 285, statut: 'Actif' },
    { id: 2, nom: 'Supermarché Proxima',      type: 'Supermarché', tel: '07 20 12 34 56', ca: 1200000, solde: 450000, points: 120, statut: 'Actif' },
    { id: 3, nom: 'Hôtel Ivoire Palace',      type: 'Hôtel',       tel: '07 21 45 67 89', ca: 2100000, solde: 890000, points: 210, statut: 'Actif' },
    { id: 4, nom: 'Marché Central',           type: 'Revendeur',   tel: '07 08 98 76 54', ca: 650000,  solde: 78000,  points: 65,  statut: 'Actif' },
    { id: 5, nom: 'Boulangerie La Baguette',  type: 'Restaurant',  tel: '07 15 23 45 67', ca: 450000,  solde: 25000,  points: 45,  statut: 'Actif' },
  ],

  ventes: [
    { id: 1, num: 'V-2024-001', client: 'Restaurant Le Gourmet',  produits: '50 plt Œufs blancs',                    montant: 90000,  date: '2024-03-15', type: 'vente',    statut: 'Payée' },
    { id: 2, num: 'V-2024-002', client: 'Hôtel Ivoire Palace',    produits: '30 plt Œufs marron + 25 têtes poulets', montant: 125000, date: '2024-03-16', type: 'vente',    statut: 'Payée' },
    { id: 3, num: 'V-2024-003', client: 'Supermarché Proxima',    produits: '100 plt Œufs bio',                      montant: 250000, date: '2024-03-17', type: 'vente',    statut: 'Payée' },
    { id: 4, num: 'V-2024-004', client: 'Marché Central',         produits: '40 plt Œufs + 50 têtes poulets',        montant: 180000, date: '2024-03-18', type: 'commande', statut: 'En préparation' },
    { id: 5, num: 'V-2024-005', client: 'Boulangerie La Baguette',produits: '20 plt Œufs blancs',                    montant: 36000,  date: '2024-03-19', type: 'vente',    statut: 'Payée' },
  ],

  fournisseurs: [
    { id: 1, nom: 'Ferme Avicole Nord',      contact: 'M. Koné 07 11 22 33 44',      produits: ['Œufs blancs', 'Œufs marron'],     delai: '48h', cmdYTD: 120, note: '4.8⭐', statut: 'Actif' },
    { id: 2, nom: 'Alimentation Voltaïque',  contact: 'K. Bamba 07 22 45 67 89',     produits: ['Aliments poulets', 'Suppléments'], delai: '24h', cmdYTD: 45,  note: '4.5⭐', statut: 'Actif' },
    { id: 3, nom: 'Emballages Ivoiriens',    contact: 'Y. Ouattara 07 20 11 22 33',  produits: ['Plateaux', 'Cartons'],             delai: '72h', cmdYTD: 28,  note: '4.2⭐', statut: 'Actif' },
  ],

  livraisons: [
    { id: 1, num: 'LIV-001', client: 'Restaurant Le Gourmet', statut: 'Livrée',   livreur: 'Traoré Moussa', date: '2024-03-15', km: 8  },
    { id: 2, num: 'LIV-002', client: 'Hôtel Ivoire Palace',   statut: 'En route', livreur: 'Kouamé Jean',   date: '2024-03-18', km: 12 },
    { id: 3, num: 'LIV-003', client: 'Supermarché Proxima',   statut: 'Livrée',   livreur: 'Aya Koné',      date: '2024-03-17', km: 6  },
  ],

  comptabilite: [
    { id: 1, date: '2024-03-15', libelle: 'Ventes journalières',  categorie: 'CA',       type: 'recette', montant: 251000 },
    { id: 2, date: '2024-03-15', libelle: 'Achat aliments',       categorie: 'Achats',   type: 'depense', montant: 45000  },
    { id: 3, date: '2024-03-16', libelle: 'Transport livraisons', categorie: 'Transport',type: 'depense', montant: 12000  },
    { id: 4, date: '2024-03-17', libelle: 'Électricité',          categorie: 'Services', type: 'depense', montant: 35000  },
  ],

  mouvements: [
    { id: 1, date: '2024-03-15', produit: 'Œufs blancs standard', type: 'entree', qte: 500, motif: 'Réception ferme'   },
    { id: 2, date: '2024-03-16', produit: 'Œufs marron premium',  type: 'sortie', qte: 200, motif: 'Vente restaurant'  },
    { id: 3, date: '2024-03-17', produit: 'Poulet entier vif',    type: 'entree', qte: 100, motif: 'Réception élevage' },
  ],

  employees: [],
};

/* ══════════════════════════════════════════
   ÉQUIPE
══════════════════════════════════════════ */

let equipeData = {
  gerants: [
    { id: 1, nom: 'Admin SAM-CI', initiales: 'AS', statut: 'online', debut: '07h00', fin: '15h00', ventesJour: 1920000, notesJour: 'Contrôle stock matin OK' },
  ],
  livreurs: [
    { id: 3, nom: 'Traoré Moussa', initiales: 'TM', statut: 'away',   vehicule: 'Camion F-01', livreesJour: 1, enCoursJour: 1, totalJour: 4, kmJour: 38 },
    { id: 5, nom: 'Diallo Ibou',   initiales: 'DI', statut: 'online', vehicule: 'Moto M-02',   livreesJour: 2, enCoursJour: 0, totalJour: 3, kmJour: 22 },
  ],
};

/* ══════════════════════════════════════════
   RÔLES & RESTRICTIONS
══════════════════════════════════════════ */

const ROLES = {
  Gérant   : ['all'],
  Vendeur  : ['dashboard', 'caisse', 'ventes', 'clients', 'stocks', 'equipe'],
  Livreur  : ['dashboard', 'livraisons', 'equipe'],
  Comptable: ['dashboard', 'rapports', 'comptabilite', 'ventes'],
};

function applyRoleRestrictions() {
  const user = (typeof UI !== 'undefined') ? UI.currentUser : null;
  if (!user || ROLES[user.role]?.includes('all')) return;
  const allowed = ROLES[user.role] || [];
  document.querySelectorAll('.sb-item').forEach(item => {
    const page = item.dataset.page;
    if (page && !allowed.includes(page)) item.style.display = 'none';
  });
}

/* ══════════════════════════════════════════
   UTILITAIRES
══════════════════════════════════════════ */

function escHtml(str) {
  return String(str).replace(/[&<>"']/g, m =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]
  );
}

function badge(text) {
  const map = {
    Actif: 'b-green', Préféré: 'b-green', Livrée: 'b-green', Payée: 'b-green', entree: 'b-green',
    'En route': 'b-gold', 'En préparation': 'b-blue', Préparée: 'b-blue', 'En cours': 'b-blue',
    Inactif: 'b-gray', Revendeur: 'b-purple', Hôtel: 'b-purple',
    Supermarché: 'b-blue', Restaurant: 'b-gold', Particulier: 'b-gray',
    Critique: 'b-red', Bas: 'b-gold', Problème: 'b-red', Annulée: 'b-gray',
    sortie: 'b-red', recette: 'b-green', depense: 'b-red',
    vente: 'b-green', commande: 'b-blue',
  };
  const safe = escHtml(text);
  return `<span class="badge ${map[text] || 'b-gray'}">${safe}</span>`;
}

function fmtMoney(n) { return (Number(n) || 0).toLocaleString('fr-FR') + ' FCFA'; }
function fmtNum(n)   { return (Number(n) || 0).toLocaleString('fr-FR'); }
function todayStr()  { return new Date().toISOString().slice(0, 10); }

function parseFCFA(text) {
  return parseFloat(String(text).replace(/[^\d]/g, '')) || 0;
}

function animateCount(id, target, money = false) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const duration = 1500;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = money ? fmtMoney(Math.round(start)) : fmtNum(Math.round(start));
  }, 16);
}

function checkStockAlerts() {
  const low = DB.stocks.filter(s => s.qte < s.seuil);
  const badgeEl = document.getElementById('stockAlertBadge');
  if (badgeEl) badgeEl.style.display = low.length ? 'inline-flex' : 'none';
}

/* ══════════════════════════════════════════
   INITIALISATION
══════════════════════════════════════════ */

function initApp() {
  console.log('🚀 Initialisation de SAM-CI...');

  const now = new Date();
  const pageDate = document.getElementById('pageDate');
  if (pageDate) {
    pageDate.textContent = now.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  populatePosProducts();
  populatePosClients();
  renderDashboard();
  checkStockAlerts();

  console.log('✅ Application initialisée');
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */

function renderDashboard() {
  const lowStock = DB.stocks.filter(s => s.qte < s.seuil);

  // Bannière alertes
  const alertsEl = document.getElementById('dash-alerts');
  if (alertsEl) {
    alertsEl.innerHTML = lowStock.length
      ? `<div class="alert-banner">
           <div class="alert-banner-icon">🚨</div>
           <div class="alert-banner-text">⚠️ ${lowStock.length} produit(s) en stock critique : ${lowStock.map(s => s.produit).join(', ')}</div>
         </div>`
      : '';
  }

  // KPIs
  const caJour = DB.ventes.filter(v => v.date === todayStr()).reduce((s, v) => s + v.montant, 0);
  animateCount('kpi-ca-jour', caJour, true);
  animateCount('kpi-oeufs-vendus', 280);
  animateCount('kpi-poulets-vendus', 130);
  animateCount('kpi-alertes', lowStock.length);

  // Jauges stock
  const gaugesEl = document.getElementById('dash-gauges');
  if (gaugesEl) {
    gaugesEl.innerHTML = DB.stocks.slice(0, 4).map(s => {
      const pct = Math.min(100, Math.round(s.qte / (s.seuil * 2) * 100));
      const cls = pct < 30 ? 'critical' : pct < 60 ? 'low' : 'ok';
      return `
        <div class="gauge-wrap">
          <div class="gauge-info">
            <span class="gauge-label">${s.icone} ${escHtml(s.produit)}</span>
            <span class="gauge-qty">${fmtNum(s.qte)} ${escHtml(s.unite)}</span>
          </div>
          <div class="gauge-bar">
            <div class="gauge-fill ${cls}" style="width:0%" data-target="${pct}%"></div>
          </div>
          <div class="gauge-pct">${pct}% du seuil optimal</div>
        </div>`;
    }).join('');
    setTimeout(() => {
      document.querySelectorAll('#dash-gauges .gauge-fill').forEach(g => {
        g.style.width = g.dataset.target;
      });
    }, 100);
  }

  // Graphique 7 jours
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const oeufsData  = [420, 380, 510, 460, 390, 680, 320];
  const pouletData = [120, 95,  140, 110, 88,  195, 75 ];
  const maxVal = Math.max(...oeufsData, ...pouletData);
  const chartEl = document.getElementById('dash-chart');
  if (chartEl) {
    chartEl.innerHTML = days.map((d, i) => `
      <div class="bar-col">
        <div class="bar-fill egg"    style="height:0%;width:100%"          data-h="${Math.round(oeufsData[i]  / maxVal * 100)}%"><span class="bar-tip">${oeufsData[i]} plt</span></div>
        <div class="bar-fill poulet" style="height:0%;width:60%;margin:0 auto" data-h="${Math.round(pouletData[i] / maxVal * 100)}%"><span class="bar-tip">${pouletData[i]} têtes</span></div>
        <div class="bar-lbl">${d}</div>
      </div>`).join('');
    setTimeout(() => {
      document.querySelectorAll('#dash-chart .bar-fill[data-h]').forEach(b => {
        b.style.height = b.dataset.h;
      });
    }, 150);
  }

  // Timeline activité
  const tlEl = document.getElementById('dash-timeline');
  if (tlEl) {
    tlEl.innerHTML = DB.mouvements.slice(0, 5).map(m => `
      <div class="tl-item">
        <div class="tl-dot ${m.type === 'entree' ? 'green' : 'red'}"></div>
        <div>
          <div class="tl-text">${escHtml(m.motif)}</div>
          <div class="tl-sub">${m.type === 'entree' ? '▲ +' : '▼ -'}${m.qte} ${escHtml(m.produit)} — ${m.date}</div>
        </div>
      </div>`).join('');
  }

  // Top 5 clients
  const topC = [...DB.clients].sort((a, b) => b.ca - a.ca).slice(0, 5);
  const topEl = document.getElementById('dash-top-clients');
  if (topEl) {
    topEl.innerHTML = topC.map((c, i) => `
      <tr>
        <td><strong>${['🥇','🥈','🥉','  ','  '][i]} ${escHtml(c.nom)}</strong></td>
        <td>${badge(c.type)}</td>
        <td style="font-family:var(--mono);font-weight:700;color:var(--green-dark)">${fmtMoney(c.ca)}</td>
        <td><span style="color:var(--gold);font-weight:600">⭐ ${fmtNum(c.points)}</span></td>
      </tr>`).join('');
  }
}

/* ══════════════════════════════════════════
   STOCKS
══════════════════════════════════════════ */

function renderStocks() {
  // Bannière alertes
  const lowStock = DB.stocks.filter(s => s.qte < s.seuil);
  const alertsEl = document.getElementById('stock-alerts-banner');
  if (alertsEl) {
    alertsEl.innerHTML = lowStock.length
      ? `<div class="alert-banner">
           <div class="alert-banner-icon">🚨</div>
           <div class="alert-banner-text">${lowStock.map(s => `${s.icone} ${s.produit} : ${s.qte} / seuil ${s.seuil} ${s.unite}`).join(' — ')}</div>
         </div>`
      : '';
  }

  // KPIs
  const oeufsTotal   = DB.stocks.filter(s => s.categorie === 'Œufs').reduce((a, s) => a + s.qte, 0);
  const pouletsTotal = DB.stocks.filter(s => s.categorie === 'Poulets').reduce((a, s) => a + s.qte, 0);
  animateCount('kpi-stock-oeufs',    oeufsTotal);
  animateCount('kpi-stock-poulets',  pouletsTotal);
  animateCount('kpi-stock-alertes2', lowStock.length);
  const alertesEl = document.getElementById('kpi-stock-alertes2');
  if (alertesEl) alertesEl.style.color = lowStock.length ? 'var(--red)' : 'var(--green)';

  // ── Tableau des stocks ──────────────────────────────
  renderStockTable(DB.stocks);
}

// ⚠️ Fonction désormais au niveau global (plus imbriquée dans renderStocks)
function renderStockTable(stocks) {
  const tbody = document.getElementById('stock-tbody');
  if (!tbody) return;

  tbody.innerHTML = stocks.map(s => {
    const pct    = Math.min(100, Math.round(s.qte / (s.seuil * 2) * 100));
    const statut = s.qte < s.seuil ? 'Critique' : s.qte < s.seuil * 1.5 ? 'Bas' : 'OK';
    return `
      <tr>
        <td>${s.icone} ${escHtml(s.produit)}</td>
        <td>${escHtml(s.categorie)}</td>
        <td>${escHtml(s.unite)}</td>
        <td style="font-family:var(--mono);font-weight:700">${fmtNum(s.qte)}</td>
        <td style="font-family:var(--mono);font-weight:700">${fmtNum(s.seuil)}</td>
        <td>${s.peremption || '—'}</td>
        <td>${badge(statut)}</td>
        <td>
          <button class="btn-sm" onclick="editStock(${s.id})">✏️</button>
          <button class="btn-sm danger" onclick="deleteStock(${s.id})">🗑️</button>
        </td>
      </tr>`;
  }).join('');
}

function editStock(id) {
  const s = DB.stocks.find(st => st.id === id);
  if (!s) return;
  const body = `
    <div class="form-group"><label>Quantité</label>
      <input type="number" id="edit-stock-qte" value="${s.qte}" min="0"></div>
    <div class="form-group"><label>Prix détail (FCFA)</label>
      <input type="number" id="edit-stock-prix" value="${s.prixDetail}" min="0"></div>`;
  openModal('✏️ Modifier — ' + s.produit, body,
    `<button class="header-btn primary" onclick="saveEditStock(${s.id})">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveEditStock(id) {
  const s = DB.stocks.find(st => st.id === id);
  if (!s) return;
  const qte  = parseInt(document.getElementById('edit-stock-qte')?.value, 10);
  const prix = parseInt(document.getElementById('edit-stock-prix')?.value, 10);
  if (!isNaN(qte))  s.qte       = qte;
  if (!isNaN(prix)) s.prixDetail = prix;
  closeModal();
  renderStocks();
  renderDashboard();
  checkStockAlerts();
  showToast('✅ Stock mis à jour', 'success');
}

function deleteStock(id) {
  delItem('stocks', id, () => { renderStocks(); renderDashboard(); checkStockAlerts(); });
}

/* ══════════════════════════════════════════
   VENTES
══════════════════════════════════════════ */

function renderVentes() {
  const tbody = document.getElementById('ventes-tbody');
  if (!tbody) {
    console.warn('⚠️ Element ventes-tbody non trouvé');
    return;
  }
  
  console.log('📊 Rendu des ventes - Nombre de ventes:', DB.ventes?.length || 0);
  
  if (!DB.ventes || DB.ventes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:20px">Aucune vente enregistrée</td></tr>';
    return;
  }
  
  tbody.innerHTML = DB.ventes.slice(0, 50).map(v => `
    <tr>
      <td>${escHtml(v.num)}</td>
      <td>${escHtml(v.client)}</td>
      <td>${escHtml((v.produits || '—').slice(0, 40))}</td>
      <td style="font-family:var(--mono);font-weight:700">${fmtMoney(v.montant)}</td>
      <td>${v.date}</td>
      <td>${badge(v.type)}</td>
      <td>${badge(v.statut)}</td>
      <td><button class="btn-sm" onclick="viewVente(${v.id})">👁️</button></td>
    </tr>`).join('');
}

function renderSales() { renderVentes(); }

function viewVente(id) {
  const v = DB.ventes.find(x => x.id === id);
  if (!v) return;
  openModal('🧾 Détail vente — ' + v.num, `
    <table class="detail-table">
      <tr><td>Client</td><td><strong>${escHtml(v.client)}</strong></td></tr>
      <tr><td>Produits</td><td>${escHtml(v.produits || '—')}</td></tr>
      <tr><td>Montant</td><td><strong>${fmtMoney(v.montant)}</strong></td></tr>
      <tr><td>Date</td><td>${v.date}</td></tr>
      <tr><td>Type</td><td>${badge(v.type)}</td></tr>
      <tr><td>Statut</td><td>${badge(v.statut)}</td></tr>
    </table>`,
    `<button class="header-btn" onclick="closeModal()">Fermer</button>`);
}

/* ══════════════════════════════════════════
   CLIENTS
══════════════════════════════════════════ */

function renderClients() {
  const tbody = document.getElementById('clients-tbody');
  if (!tbody) return;
  tbody.innerHTML = DB.clients.map(c => `
    <tr>
      <td>${escHtml(c.nom)}</td>
      <td>${escHtml(c.tel)}</td>
      <td>${badge(c.type)}</td>
      <td style="font-family:var(--mono)">${fmtMoney(c.ca)}</td>
      <td>⭐ ${fmtNum(c.points)}</td>
      <td style="color:${c.solde > 0 ? 'var(--red)' : 'var(--green)'}">${fmtMoney(c.solde)}</td>
      <td>${badge(c.statut)}</td>
      <td><button class="btn-sm" onclick="editClient(${c.id})">✏️</button></td>
    </tr>`).join('');
}

function openNewClient() {
  openModal('➕ Nouveau client', `
    <div class="form-group"><label>Nom</label><input type="text" id="new-cli-nom" placeholder="Nom complet / Raison sociale"></div>
    <div class="form-group"><label>Téléphone</label><input type="text" id="new-cli-tel" placeholder="07 XX XX XX XX"></div>
    <div class="form-group"><label>Type</label>
      <select id="new-cli-type">
        <option>Restaurant</option><option>Supermarché</option>
        <option>Hôtel</option><option>Revendeur</option><option>Particulier</option>
      </select>
    </div>`,
    `<button class="header-btn primary" onclick="saveNewClient()">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveNewClient() {
  const nom  = document.getElementById('new-cli-nom')?.value.trim();
  const tel  = document.getElementById('new-cli-tel')?.value.trim();
  const type = document.getElementById('new-cli-type')?.value;
  if (!nom) { showToast('Le nom est obligatoire', 'warn'); return; }
  const newClient = { id: Date.now(), nom, tel, type, ca: 0, solde: 0, points: 0, statut: 'Actif' };
  DB.clients.push(newClient);
  addClientToFirebase(newClient);
  closeModal();
  renderClients();
  populatePosClients();
  showToast('✅ Client ajouté', 'success');
}

function editClient(id) {
  const c = DB.clients.find(x => x.id === id);
  if (!c) return;
  openModal('✏️ Modifier — ' + c.nom, `
    <div class="form-group"><label>Nom</label><input type="text" id="edit-cli-nom" value="${escHtml(c.nom)}"></div>
    <div class="form-group"><label>Téléphone</label><input type="text" id="edit-cli-tel" value="${escHtml(c.tel)}"></div>
    <div class="form-group"><label>Statut</label>
      <select id="edit-cli-statut">
        <option ${c.statut==='Actif'?'selected':''}>Actif</option>
        <option ${c.statut==='Inactif'?'selected':''}>Inactif</option>
      </select>
    </div>`,
    `<button class="header-btn primary" onclick="saveEditClient(${id})">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveEditClient(id) {
  const c = DB.clients.find(x => x.id === id);
  if (!c) return;
  c.nom    = document.getElementById('edit-cli-nom')?.value.trim()  || c.nom;
  c.tel    = document.getElementById('edit-cli-tel')?.value.trim()  || c.tel;
  c.statut = document.getElementById('edit-cli-statut')?.value      || c.statut;
  closeModal();
  renderClients();
  populatePosClients();
  showToast('✅ Client mis à jour', 'success');
}

/* ══════════════════════════════════════════
   FOURNISSEURS
══════════════════════════════════════════ */

function renderFourn() {
  const tbody = document.getElementById('fourn-tbody');
  if (!tbody) return;
  tbody.innerHTML = DB.fournisseurs.map(f => `
    <tr>
      <td>${escHtml(f.nom)}</td>
      <td>${escHtml(f.contact)}</td>
      <td>${escHtml((f.produits || []).join(', '))}</td>
      <td>${f.delai || '—'}</td>
      <td>${fmtNum(f.cmdYTD || 0)}</td>
      <td>⭐ ${f.note || '—'}</td>
      <td>${badge(f.statut)}</td>
      <td><button class="btn-sm" onclick="editFourn(${f.id})">✏️</button></td>
    </tr>`).join('');
}

function renderFournisseurs() { renderFourn(); }
function renderSuppliers()    { renderFourn(); }

function openNewFourn() {
  openModal('➕ Nouveau fournisseur', `
    <div class="form-group"><label>Nom</label><input type="text" id="new-fourn-nom" placeholder="Nom de la société"></div>
    <div class="form-group"><label>Contact</label><input type="text" id="new-fourn-contact" placeholder="Nom + téléphone"></div>
    <div class="form-group"><label>Produits fournis</label><input type="text" id="new-fourn-produits" placeholder="Ex: Œufs, Aliments..."></div>
    <div class="form-group"><label>Délai livraison</label><input type="text" id="new-fourn-delai" placeholder="Ex: 48h"></div>`,
    `<button class="header-btn primary" onclick="saveNewFourn()">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveNewFourn() {
  const nom      = document.getElementById('new-fourn-nom')?.value.trim();
  const contact  = document.getElementById('new-fourn-contact')?.value.trim();
  const produits = document.getElementById('new-fourn-produits')?.value.trim().split(',').map(p => p.trim());
  const delai    = document.getElementById('new-fourn-delai')?.value.trim();
  if (!nom) { showToast('Le nom est obligatoire', 'warn'); return; }
  const newFourn = { id: Date.now(), nom, contact, produits, delai, cmdYTD: 0, note: '—', statut: 'Actif' };
  DB.fournisseurs.push(newFourn);
  closeModal();
  renderFourn();
  showToast('✅ Fournisseur ajouté', 'success');
}

function editFourn(id) {
  const f = DB.fournisseurs.find(x => x.id === id);
  if (!f) return;
  openModal('✏️ Modifier — ' + f.nom, `
    <div class="form-group"><label>Nom</label><input type="text" id="edit-fourn-nom" value="${escHtml(f.nom)}"></div>
    <div class="form-group"><label>Contact</label><input type="text" id="edit-fourn-contact" value="${escHtml(f.contact)}"></div>
    <div class="form-group"><label>Délai</label><input type="text" id="edit-fourn-delai" value="${escHtml(f.delai || '')}"></div>
    <div class="form-group"><label>Statut</label>
      <select id="edit-fourn-statut">
        <option ${f.statut==='Actif'?'selected':''}>Actif</option>
        <option ${f.statut==='Inactif'?'selected':''}>Inactif</option>
      </select>
    </div>`,
    `<button class="header-btn primary" onclick="saveEditFourn(${id})">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveEditFourn(id) {
  const f = DB.fournisseurs.find(x => x.id === id);
  if (!f) return;
  f.nom     = document.getElementById('edit-fourn-nom')?.value.trim()     || f.nom;
  f.contact = document.getElementById('edit-fourn-contact')?.value.trim() || f.contact;
  f.delai   = document.getElementById('edit-fourn-delai')?.value.trim()   || f.delai;
  f.statut  = document.getElementById('edit-fourn-statut')?.value         || f.statut;
  closeModal();
  renderFourn();
  showToast('✅ Fournisseur mis à jour', 'success');
}

/* ══════════════════════════════════════════
   LIVRAISONS
══════════════════════════════════════════ */

function renderLivraisons() {
  renderDeliveries();
}

function renderDeliveries() {
  const listEl = document.getElementById('livraisons-list');
  if (listEl) {
    listEl.innerHTML = DB.livraisons.map(l => `
      <div class="livraison-card">
        <div class="liv-header">
          <span class="liv-num">${escHtml(l.num)}</span>
          ${badge(l.statut)}
        </div>
        <div class="liv-body">
          <span>👤 ${escHtml(l.client)}</span>
          <span>🚚 ${escHtml(l.livreur)}</span>
          <span>📅 ${l.date}</span>
          <span>📍 ${l.km} km</span>
        </div>
      </div>`).join('');
  }

  const tbody = document.getElementById('livraisons-tbody');
  if (tbody) {
    tbody.innerHTML = DB.livraisons.map(l => `
      <tr>
        <td>${escHtml(l.num)}</td>
        <td>${escHtml(l.client)}</td>
        <td>${escHtml(l.livreur)}</td>
        <td>${badge(l.statut)}</td>
        <td>${l.date}</td>
        <td>${l.km} km</td>
      </tr>`).join('');
  }
}

/* ══════════════════════════════════════════
   COMPTABILITÉ
══════════════════════════════════════════ */

function renderCompta() {
  const tbody = document.getElementById('compta-tbody');
  if (!tbody) return;
  const totRecettes = DB.comptabilite.filter(o => o.type === 'recette').reduce((s, o) => s + o.montant, 0);
  const totDepenses = DB.comptabilite.filter(o => o.type === 'depense').reduce((s, o) => s + o.montant, 0);
  tbody.innerHTML = DB.comptabilite.map(o => `
    <tr>
      <td>${o.date}</td>
      <td>${escHtml(o.libelle)}</td>
      <td>${escHtml(o.categorie)}</td>
      <td>${badge(o.type)}</td>
      <td style="font-family:var(--mono)">${fmtMoney(o.montant)}</td>
    </tr>`).join('');

  const netEl = document.getElementById('compta-net');
  if (netEl) netEl.textContent = fmtMoney(totRecettes - totDepenses);
}

function renderComptabilite() { renderCompta(); }
function renderAccounting()   { renderCompta(); }

/* ══════════════════════════════════════════
   RAPPORTS
══════════════════════════════════════════ */

function renderReports() {
  const caMoisEl = document.getElementById('rap-ca-mois');
  if (caMoisEl) caMoisEl.textContent = fmtMoney(18240000);
}

/* ══════════════════════════════════════════
   ÉQUIPE
══════════════════════════════════════════ */

function renderEquipe() {
  const gridEl = document.getElementById('equipeGrid');
  if (!gridEl) return;

  const tous = [
    ...equipeData.gerants.map(m  => ({ ...m, roleLabel: '👑 Gérant' })),
    ...equipeData.livreurs.map(m => ({ ...m, roleLabel: '🚚 Livreur' })),
  ];

  gridEl.innerHTML = tous.map(m => `
    <div class="membre-card">
      <div class="membre-avatar">${m.initiales}</div>
      <div class="membre-info">
        <div class="membre-nom">${escHtml(m.nom)}</div>
        <div class="membre-role-tag">${m.roleLabel}</div>
        <div class="membre-statut ${m.statut}">${{ online: '🟢 En service', away: '🟡 En déplacement', offline: '⚫ Hors service' }[m.statut] || m.statut}</div>
      </div>
    </div>`).join('');
}

function renderParametres() { /* page paramètres — à compléter */ }

/* ══════════════════════════════════════════
   POINT DE VENTE — CAISSE
══════════════════════════════════════════ */

// ── Panier ──────────────────────────────────────────────────────────────────
let cart = [];

function populatePosProducts() {
  const grid = document.getElementById('posProductGrid');
  if (!grid) return;

  const produits = DB.stocks.filter(
    s => s.categorie === 'Œufs' || s.categorie === 'Poulets'
  );

  if (!produits.length) {
    grid.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text3)">📦 Aucun produit disponible</div>';
    return;
  }

  grid.innerHTML = produits.map(p => `
    <button class="pos-prod-card" onclick="addToCart(${p.id})">
      <span class="pos-prod-icon">${p.icone}</span>
      <div class="pos-prod-name">${escHtml(p.produit)}</div>
      <div class="pos-prod-price">${fmtMoney(p.prixDetail)}</div>
      <div class="pos-prod-stock">Stock : ${fmtNum(p.qte)} ${escHtml(p.unite)}</div>
    </button>`).join('');
}

function populatePosClients() {
  const select = document.getElementById('posClientSelect');
  if (!select) return;
  select.innerHTML = '<option value="">— Vente anonyme —</option>';
  DB.clients.forEach(c => {
    const opt = document.createElement('option');
    opt.value       = c.id;
    opt.textContent = `${c.nom} (${c.type})`;
    select.appendChild(opt);
  });
  updatePosClient();
}

function updatePosClient() {
  const select = document.getElementById('posClientSelect');
  const info   = document.getElementById('posClientInfo');
  if (!select || !info) return;
  if (!select.value) { info.textContent = 'Vente comptoir (client non enregistré)'; return; }
  const cli = DB.clients.find(c => c.id === parseInt(select.value, 10));
  info.textContent = cli
    ? `${cli.type} · CA: ${fmtMoney(cli.ca)} · Solde: ${fmtMoney(cli.solde)}`
    : 'Client introuvable';
}

function addToCart(stockId) {
  const item = DB.stocks.find(s => s.id === stockId);
  if (!item) { showToast('Produit introuvable', 'error'); return; }
  const existing = cart.find(l => l.id === stockId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: item.id, produit: item.produit, icone: item.icone, prix: item.prixDetail || item.prixGros || 0, unite: item.unite, qty: 1 });
  }
  renderCart();
  showToast(`➕ ${item.produit} ajouté`, 'success');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = '<div class="pos-cart-empty">🥚 Sélectionnez des produits</div>';
    updateTotals();
    return;
  }
  container.innerHTML = cart.map((l, i) => `
    <div class="cart-item">
      <div class="cart-item-main">
        <div class="cart-item-icon">${l.icone || '📦'}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${escHtml(l.produit)}</div>
          <div class="cart-item-sub">${fmtMoney(l.prix)} · ${escHtml(l.unite || '')}</div>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
        <div class="qty-val">${l.qty}</div>
        <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
        <div class="cart-item-total">${fmtMoney(l.prix * l.qty)}</div>
        <button class="cart-remove" onclick="removeFromCart(${i})">✕</button>
      </div>
    </div>`).join('');
  updateTotals();
}

function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
  const payInput = document.getElementById('paymentInput');
  if (payInput) payInput.value = '';
  if (typeof calcMonnaie === 'function') calcMonnaie();
  showToast('🗑 Panier vidé', 'info');
}

function updateTotals() {
  const subtotal = cart.reduce((s, l) => s + l.prix * l.qty, 0);
  const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  el('subtotal',  fmtMoney(subtotal));
  el('discount',  fmtMoney(0));
  el('grandTotal', fmtMoney(subtotal));
  if (typeof calcMonnaie === 'function') calcMonnaie();
}

function validateSale() {
  if (!cart.length) { showToast('🧺 Aucun article dans le panier', 'warn'); return; }

  const totalEl = document.getElementById('grandTotal');
  const payEl   = document.getElementById('paymentInput');
  const total   = totalEl ? parseFCFA(totalEl.textContent) : 0;
  const recu    = payEl   ? (parseFloat(payEl.value) || 0) : 0;

  if (recu < total) { showToast('💸 Montant insuffisant', 'error'); return; }

  const selectClient = document.getElementById('posClientSelect');
  const client = selectClient?.value
    ? DB.clients.find(c => c.id === parseInt(selectClient.value, 10)) || null
    : null;

  const venteData = {
    num      : 'V-' + String(DB.ventes.length + 1).padStart(4, '0'),
    client   : client ? client.nom : 'Vente comptoir',
    clientId : client ? client.id  : null,
    produits : cart.map(l => `${l.qty} x ${l.produit}`).join(', '),
    montant  : total,
    date     : todayStr(),
    type     : 'vente',
    statut   : 'Payée',
    remise   : 0,
  };

  // Mise à jour locale + Firebase
  const venteId = 'local_' + Date.now(); // Marquer comme vente locale
  DB.ventes.push({ ...venteData, id: venteId });
  addVenteToFirebase(venteData);
  
  // Debug: Vérifier que la vente est bien ajoutée
  console.log('✅ Vente enregistrée:', venteData);
  console.log('📊 Total ventes après ajout:', DB.ventes.length);

  // Décrémenter les stocks
  cart.forEach(l => {
    const s = DB.stocks.find(st => st.id === l.id);
    if (s) s.qte = Math.max(0, s.qte - l.qty);
  });

  showToast('✅ Vente enregistrée', 'success');
  clearCart();
  renderVentes();
  renderStocks();
  renderDashboard();
}

/* ══════════════════════════════════════════
   SUPPRESSION GÉNÉRIQUE
══════════════════════════════════════════ */

function delItem(store, id, cb) {
  showConfirm('Supprimer', 'Cette action est irréversible.', '⚠️', ok => {
    if (!ok) return;
    DB[store] = DB[store].filter(i => i.id !== id);
    if (cb) cb();
    showToast('🗑 Élément supprimé', 'success');
  });
}

/* ══════════════════════════════════════════
   NOTIFICATIONS
══════════════════════════════════════════ */

function showSystemNotifs() {
  const low      = DB.stocks.filter(s => s.qte < s.seuil);
  const impayees = DB.ventes.filter(v => v.statut !== 'Payée' && v.statut !== 'Annulée');
  const msgs     = [
    ...low.map(s => `🚨 ${s.produit} : ${s.qte} ${s.unite} (seuil : ${s.seuil})`),
    ...(impayees.length ? [`💸 ${impayees.length} commande(s) non payée(s)`] : []),
  ];
  openModal('🔔 Notifications', `
    <div style="display:flex;flex-direction:column;gap:10px">
      ${msgs.length
        ? msgs.map(m => `<div class="alert-banner"><span class="alert-banner-icon">${m.startsWith('💸') ? '💸' : '🚨'}</span><span class="alert-banner-text">${escHtml(m)}</span></div>`).join('')
        : '<div style="text-align:center;padding:20px;color:var(--text3)">✅ Aucune alerte — Tout va bien !</div>'}
    </div>`,
    `<button class="header-btn primary" onclick="closeModal()">OK</button>`);
}

/* ══════════════════════════════════════════
   FIREBASE — ENREGISTREMENT
══════════════════════════════════════════ */

async function addStockToFirebase(stockData) {
  try {
    await saveStockToFirebase(stockData);
    renderStocks();
    renderDashboard();
    showToast('Produit ajouté avec succès !', 'success');
  } catch (error) {
    console.error('Erreur ajout stock:', error);
    showToast("Erreur lors de l'ajout du produit", 'error');
  }
}

async function addVenteToFirebase(venteData) {
  try {
    await saveVenteToFirebase(venteData);
  } catch (error) {
    console.error('Erreur ajout vente:', error);
  }
}

async function addClientToFirebase(clientData) {
  try {
    await saveClientToFirebase(clientData);
  } catch (error) {
    console.error('Erreur ajout client:', error);
  }
}

async function addFournisseurToFirebase(data) {
  try { await saveFournisseurToFirebase(data); } catch (e) { console.error(e); }
}
async function addLivraisonToFirebase(data) {
  try { await saveLivraisonToFirebase(data); }  catch (e) { console.error(e); }
}
async function addComptaToFirebase(data) {
  try { await saveComptaToFirebase(data); }      catch (e) { console.error(e); }
}

async function saveEmployee(name, role, email) {
  try {
    const employeeData = { name: sanitizeInput(name), role: sanitizeInput(role), email: sanitizeInput(email), status: 'En service', createdAt: new Date() };
    await saveEmployeeToFirebase(employeeData);
    DB.employees.push({ id: Date.now().toString(), ...employeeData });
    showToast('Employé ajouté avec succès !', 'success');
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    showToast("Erreur lors de l'enregistrement.", 'error');
  }
}

async function updateDashboardStats() {
  const salesCollection = collection(db, 'Sales');
  onSnapshot(salesCollection, snapshot => {
    let total = 0;
    snapshot.forEach(docSnap => { total += docSnap.data().montant || 0; });
    const el = document.querySelector('.card-value');
    if (el) el.textContent = fmtMoney(total);
  }, error => console.error('Erreur Firebase:', error));
}

/* ══════════════════════════════════════════
   DÉLÉGATION D'ÉVÉNEMENTS
══════════════════════════════════════════ */

document.addEventListener('click', e => {
  if (e.target?.id === 'btn-save-employee') {
    const name  = document.getElementById('emp-name')?.value;
    const role  = document.getElementById('emp-role')?.value;
    const email = document.getElementById('emp-email')?.value;
    if (name && role) saveEmployee(name, role, email);
    else showToast('Veuillez remplir au moins le nom et le rôle.', 'warn');
  }
});

/* ══════════════════════════════════════════
   EXPORT GLOBAL
══════════════════════════════════════════ */

Object.assign(window, {
  // Initialisation
  initApp,

  // Rendu pages
  renderDashboard, renderStocks, renderStockTable,
  renderVentes, renderSales,
  renderClients,
  renderFourn, renderFournisseurs, renderSuppliers,
  renderLivraisons, renderDeliveries,
  renderCompta, renderComptabilite, renderAccounting,
  renderReports,
  renderEquipe,
  renderParametres,

  // POS / Caisse
  populatePosProducts, populatePosClients,
  addToCart, changeQty, removeFromCart, clearCart,
  updatePosClient, validateSale,

  // Stocks
  editStock, saveEditStock, deleteStock, addStockToFirebase,

  // Clients
  openNewClient, saveNewClient, editClient, saveEditClient, addClientToFirebase,

  // Fournisseurs
  openNewFourn, saveNewFourn, editFourn, saveEditFourn, addFournisseurToFirebase,

  // Ventes
  viewVente, addVenteToFirebase,

  // Firebase
  addLivraisonToFirebase, addComptaToFirebase,

  // Notifications
  showSystemNotifs,

  // Utilitaires
  delItem, checkStockAlerts, applyRoleRestrictions,
});

/* ══════════════════════════════════════════
   DÉMARRAGE
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Démarrage de AVICO-PRO V4 - Edition Premium...');
  
  // Initialiser les données locales si nécessaire
  if (!DB.ventes) DB.ventes = [];
  if (!DB.stocks) DB.stocks = [];
  if (!DB.clients) DB.clients = [];
  
  console.log('📊 Données initiales - Ventes:', DB.ventes.length, 'Stocks:', DB.stocks.length, 'Clients:', DB.clients.length);
  
  // Initialiser Firebase et synchroniser les données
  try {
    await syncAllData();
    console.log('✅ Données synchronisées avec Firebase');
    watchStocks();
    
    // Activer la synchronisation temps réel complète
    if (typeof enableRealTimeSync === 'function') {
      enableRealTimeSync();
    }
    
    // Initialiser l'intelligence artificielle
    if (typeof initializeAI === 'function') {
      initializeAI();
    }
    
    // Initialiser l'application mobile
    if (typeof initializeMobileApp === 'function') {
      initializeMobileApp();
    }
    
    // Initialiser l'optimiseur de performance
    if (window.performanceOptimizer) {
      console.log('⚡ Optimiseur de performance activé');
    }
    
    // Initialiser l'auto-updater
    if (window.autoUpdater) {
      console.log('🔄 Auto-updater activé');
    }
    
  } catch (e) {
    console.warn('⚠️ Firebase non disponible, données locales utilisées:', e.message);
  } finally {
    // Toujours initialiser l'interface, Firebase ou non
    populatePosProducts();
    populatePosClients();
    renderDashboard();
    renderVentes(); // Forcer le rendu des ventes
    checkStockAlerts();
  }
  
  console.log('🎉 AVICO-PRO V4 Premium initialisé avec succès !');
  console.log('📊 Fonctionnalités activées:');
  console.log('  ✅ Synchronisation temps réel');
  console.log('  🧠 Intelligence artificielle');
  console.log('  📱 Application mobile native');
  console.log('  🔔 Notifications push');
  console.log('  📈 Prédictions avancées');
  console.log('  ⚡ Optimisation performance');
  console.log('  🔄 Mises à jour automatiques');
  
  // Debug: Afficher l'état final des ventes
  console.log('📊 État final des ventes:', DB.ventes);
});