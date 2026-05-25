/* ══════════════════════════════════════════
   AVICO-PRO — Logique applicative v5
   SAM-CI — Société Avicole Moderne de C.I.
   Corrigé : DB sur window, un seul module,
   Firebase sync propre, pas de doublons
══════════════════════════════════════════ */

import {
  db, auth,
  collection, onSnapshot, addDoc, doc, setDoc, getDoc,
  updateDoc, deleteDoc, query, orderBy, limit, where,
  syncAllData, watchStocks, enableRealTimeSync,
  saveStockToFirebase, saveEmployeeToFirebase, saveClientToFirebase,
  saveVenteToFirebase, saveFournisseurToFirebase,
  saveLivraisonToFirebase, saveComptaToFirebase
} from './js/firebase.js';

/* ══════════════════════════════════════════
   BASE DE DONNÉES — exposée sur window.DB
   (firebase.js y accède via window.DB)
══════════════════════════════════════════ */
window.DB = {
  stocks: [
    { id: 1, produit: 'Œufs blancs standard',    categorie: 'Œufs',    unite: 'Plateau 30', qte: 1200, seuil: 500, prixDetail: 1800, prixGros: 1650, icone: '🥚', peremption: '2026-06-10' },
    { id: 2, produit: 'Œufs marron premium',     categorie: 'Œufs',    unite: 'Plateau 30', qte: 850,  seuil: 300, prixDetail: 2200, prixGros: 2000, icone: '🥚', peremption: '2026-06-08' },
    { id: 3, produit: 'Œufs bio fermier',        categorie: 'Œufs',    unite: 'Plateau 30', qte: 320,  seuil: 150, prixDetail: 2800, prixGros: 2500, icone: '🥚', peremption: '2026-06-05' },
    { id: 5, produit: 'Poulet entier vif',       categorie: 'Poulets', unite: 'Tête',       qte: 820,  seuil: 200, prixDetail: 3800, prixGros: 3500, icone: '🐓' },
    { id: 6, produit: 'Poulet découpe portions', categorie: 'Poulets', unite: 'Kg',         qte: 45,   seuil: 20,  prixDetail: 5200, prixGros: 4800, icone: '🍗' },
    { id: 7, produit: 'Poulet congelé',          categorie: 'Poulets', unite: 'Kg',         qte: 120,  seuil: 50,  prixDetail: 4500, prixGros: 4100, icone: '🐔' },
  ],
  clients: [
    { id: 1, nom: 'Restaurant Le Gourmet',   type: 'Restaurant',  tel: '07 12 34 56 78', ca: 2850000, solde: 125000, points: 285, statut: 'Actif' },
    { id: 2, nom: 'Supermarché Proxima',     type: 'Supermarché', tel: '07 20 12 34 56', ca: 1200000, solde: 450000, points: 120, statut: 'Actif' },
    { id: 3, nom: 'Hôtel Ivoire Palace',     type: 'Hôtel',       tel: '07 21 45 67 89', ca: 2100000, solde: 890000, points: 210, statut: 'Actif' },
    { id: 4, nom: 'Marché Central',          type: 'Revendeur',   tel: '07 08 98 76 54', ca: 650000,  solde: 78000,  points: 65,  statut: 'Actif' },
    { id: 5, nom: 'Boulangerie La Baguette', type: 'Restaurant',  tel: '07 15 23 45 67', ca: 450000,  solde: 25000,  points: 45,  statut: 'Actif' },
  ],
  ventes: [
    { id: 1, num: 'V-2025-001', client: 'Restaurant Le Gourmet',  produits: '50 plt Œufs blancs',                    montant: 90000,  date: '2025-05-20', type: 'vente',    statut: 'Payée' },
    { id: 2, num: 'V-2025-002', client: 'Hôtel Ivoire Palace',    produits: '30 plt Œufs marron + 25 têtes poulets', montant: 125000, date: '2025-05-21', type: 'vente',    statut: 'Payée' },
    { id: 3, num: 'V-2025-003', client: 'Supermarché Proxima',    produits: '100 plt Œufs bio',                      montant: 250000, date: '2025-05-22', type: 'vente',    statut: 'Payée' },
    { id: 4, num: 'V-2025-004', client: 'Marché Central',         produits: '40 plt Œufs + 50 têtes poulets',        montant: 180000, date: '2025-05-23', type: 'commande', statut: 'En cours' },
    { id: 5, num: 'V-2025-005', client: 'Boulangerie La Baguette',produits: '20 plt Œufs blancs',                    montant: 36000,  date: '2025-05-24', type: 'vente',    statut: 'Payée' },
  ],
  fournisseurs: [
    { id: 1, nom: 'Ferme Avicole Nord',     contact: 'M. Koné 07 11 22 33 44',     produits: ['Œufs blancs', 'Œufs marron'],     delai: '48h', cmdYTD: 120, note: '4.8⭐', statut: 'Actif' },
    { id: 2, nom: 'Alimentation Voltaïque', contact: 'K. Bamba 07 22 45 67 89',    produits: ['Aliments poulets', 'Suppléments'], delai: '24h', cmdYTD: 45,  note: '4.5⭐', statut: 'Actif' },
    { id: 3, nom: 'Emballages Ivoiriens',   contact: 'Y. Ouattara 07 20 11 22 33', produits: ['Plateaux', 'Cartons'],             delai: '72h', cmdYTD: 28,  note: '4.2⭐', statut: 'Actif' },
  ],
  livraisons: [
    { id: 1, num: 'LIV-001', client: 'Restaurant Le Gourmet', statut: 'Livrée',   livreur: 'Traoré Moussa', date: '2025-05-20', km: 8  },
    { id: 2, num: 'LIV-002', client: 'Hôtel Ivoire Palace',   statut: 'En route', livreur: 'Kouamé Jean',   date: '2025-05-25', km: 12 },
    { id: 3, num: 'LIV-003', client: 'Supermarché Proxima',   statut: 'Livrée',   livreur: 'Aya Koné',      date: '2025-05-22', km: 6  },
  ],
  comptabilite: [
    { id: 1, date: '2025-05-20', libelle: 'Ventes journalières',  categorie: 'CA',        type: 'recette', montant: 251000 },
    { id: 2, date: '2025-05-20', libelle: 'Achat aliments',       categorie: 'Achats',    type: 'depense', montant: 45000  },
    { id: 3, date: '2025-05-21', libelle: 'Transport livraisons', categorie: 'Transport', type: 'depense', montant: 12000  },
    { id: 4, date: '2025-05-22', libelle: 'Électricité',          categorie: 'Services',  type: 'depense', montant: 35000  },
  ],
  mouvements: [
    { id: 1, date: '2025-05-20', produit: 'Œufs blancs standard', type: 'entree', qte: 500, motif: 'Réception ferme'   },
    { id: 2, date: '2025-05-21', produit: 'Œufs marron premium',  type: 'sortie', qte: 200, motif: 'Vente restaurant'  },
    { id: 3, date: '2025-05-22', produit: 'Poulet entier vif',    type: 'entree', qte: 100, motif: 'Réception élevage' },
  ],
  employees: [],
};

// Alias court
const DB = window.DB;

/* ══════════════════════════════════════════
   UTILISATEURS
══════════════════════════════════════════ */
function hashPwd(p) { return btoa(p + 'samci-salt-2024'); }

const USERS = [
  { id: 1, nom: 'Admin SAM-CI',  email: 'admin@sam-ci.ci',   pwd: hashPwd('admin123'),   role: 'Gérant',    statut: 'Actif' },
  { id: 2, nom: 'Kouamé Jean',   email: 'vendeur@sam-ci.ci', pwd: hashPwd('vendeur123'), role: 'Vendeur',   statut: 'Actif' },
  { id: 3, nom: 'Traoré Moussa', email: 'livreur@sam-ci.ci', pwd: hashPwd('livreur123'), role: 'Livreur',   statut: 'Actif' },
  { id: 4, nom: 'Aya Koné',      email: 'compta@sam-ci.ci',  pwd: hashPwd('compta123'),  role: 'Comptable', statut: 'Actif' },
];

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
   RÔLES
══════════════════════════════════════════ */
const ROLES = {
  Gérant   : ['all'],
  Vendeur  : ['dashboard', 'caisse', 'ventes', 'clients', 'stocks', 'equipe'],
  Livreur  : ['dashboard', 'livraisons', 'equipe'],
  Comptable: ['dashboard', 'rapports', 'comptabilite', 'ventes'],
};

function applyRoleRestrictions() {
  const user = window.UI?.currentUser;
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
  return String(str ?? '').replace(/[&<>"']/g, m =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[m]);
}

function badge(text) {
  const map = {
    Actif:'b-green', Préféré:'b-green', Livrée:'b-green', Payée:'b-green', entree:'b-green',
    'En route':'b-gold', 'En préparation':'b-blue', Préparée:'b-blue', 'En cours':'b-blue',
    Inactif:'b-gray', Revendeur:'b-purple', Hôtel:'b-purple',
    Supermarché:'b-blue', Restaurant:'b-gold', Particulier:'b-gray',
    Critique:'b-red', Bas:'b-gold', Problème:'b-red', Annulée:'b-gray',
    sortie:'b-red', recette:'b-green', depense:'b-red',
    vente:'b-green', commande:'b-blue',
  };
  return `<span class="badge ${map[text]||'b-gray'}">${escHtml(text)}</span>`;
}

function fmtMoney(n) { return (Number(n)||0).toLocaleString('fr-FR') + ' FCFA'; }
function fmtNum(n)   { return (Number(n)||0).toLocaleString('fr-FR'); }
function todayStr()  { return new Date().toISOString().slice(0,10); }

function animateCount(id, target, money = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 1200;
  const step = target / (duration / 16);
  let val = 0;
  const t = setInterval(() => {
    val += step;
    if (val >= target) { val = target; clearInterval(t); }
    el.textContent = money ? fmtMoney(Math.round(val)) : fmtNum(Math.round(val));
  }, 16);
}

function checkStockAlerts() {
  const low = DB.stocks.filter(s => s.qte < s.seuil);
  const badge = document.getElementById('stockAlertBadge');
  if (badge) badge.style.display = low.length ? 'inline-flex' : 'none';
}

/* ══════════════════════════════════════════
   INITIALISATION
══════════════════════════════════════════ */
function initApp(user) {
  console.log('🚀 initApp() appelé');
  populatePosProducts();
  populatePosClients();
  renderDashboard();
  checkStockAlerts();
  applyRoleRestrictions();
  // Remplir le tableau des utilisateurs dans Paramètres
  renderUsersTable();
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function renderDashboard() {
  const DB = window.DB;
  const lowStock = DB.stocks.filter(s => s.qte < s.seuil);

  const alertsEl = document.getElementById('dash-alerts');
  if (alertsEl) {
    alertsEl.innerHTML = lowStock.length
      ? `<div class="alert-banner"><div class="alert-banner-icon">🚨</div>
         <div class="alert-banner-text">⚠️ ${lowStock.length} produit(s) en stock critique : ${lowStock.map(s=>s.produit).join(', ')}</div></div>`
      : '';
  }

  const caJour = DB.ventes.filter(v => v.date === todayStr()).reduce((s,v)=>s+v.montant,0);
  const caTotal = DB.ventes.reduce((s,v)=>s+(v.statut==='Payée'?v.montant:0),0);
  const oeufVendus = DB.ventes.filter(v=>v.date===todayStr()).reduce((s,v)=>{
    const m = (v.produits||'').match(/(\d+)\s*(plt|plateau|plateaux)/i);
    return s + (m ? parseInt(m[1]) : 0);
  }, 0);

  animateCount('kpi-ca-jour',       caJour,     true);
  animateCount('kpi-oeufs-vendus',  oeufVendus);
  animateCount('kpi-poulets-vendus',DB.ventes.filter(v=>v.date===todayStr()).length);
  animateCount('kpi-alertes',       lowStock.length);

  // Jauges stock
  const gaugesEl = document.getElementById('dash-gauges');
  if (gaugesEl) {
    gaugesEl.innerHTML = DB.stocks.slice(0,4).map(s => {
      const pct = Math.min(100, Math.round(s.qte / (s.seuil*2) * 100));
      const cls = pct < 30 ? 'critical' : pct < 60 ? 'low' : 'ok';
      return `<div class="gauge-wrap">
        <div class="gauge-info">
          <span class="gauge-label">${s.icone} ${escHtml(s.produit)}</span>
          <span class="gauge-qty">${fmtNum(s.qte)} ${escHtml(s.unite)}</span>
        </div>
        <div class="gauge-bar"><div class="gauge-fill ${cls}" style="width:${pct}%"></div></div>
        <div class="gauge-pct">${pct}% du niveau optimal</div>
      </div>`;
    }).join('');
  }

  // Timeline dernières transactions
  const timelineEl = document.getElementById('dash-timeline');
  if (timelineEl) {
    const recent = [...DB.ventes].sort((a,b)=>b.id-a.id).slice(0,5);
    timelineEl.innerHTML = recent.length
      ? recent.map(v=>`
        <div class="timeline-item">
          <div class="timeline-dot ${v.statut==='Payée'?'green':'gold'}"></div>
          <div class="timeline-content">
            <div class="timeline-title">${escHtml(v.client)}</div>
            <div class="timeline-sub">${escHtml(v.produits||'').slice(0,50)} · ${fmtMoney(v.montant)}</div>
            <div class="timeline-date">${v.date}</div>
          </div>
        </div>`).join('')
      : '<div style="text-align:center;color:var(--text3);padding:16px">Aucune transaction</div>';
  }

  // Graphique barres 7 jours
  const chartEl = document.getElementById('dash-chart');
  if (chartEl) {
    const days = Array.from({length:7},(_,i)=>{
      const d = new Date(); d.setDate(d.getDate()-6+i);
      return d.toISOString().slice(0,10);
    });
    const maxV = 300000;
    chartEl.innerHTML = days.map(d=>{
      const dayVentes = DB.ventes.filter(v=>v.date===d).reduce((s,v)=>s+v.montant,0);
      const pct = Math.round(dayVentes/maxV*100);
      const label = d.slice(8)+'/'+d.slice(5,7);
      return `<div class="bar-col">
        <div class="bar-value">${dayVentes>0?fmtMoney(dayVentes):''}</div>
        <div class="bar" style="height:${pct}%;background:var(--green)"></div>
        <div class="bar-label">${label}</div>
      </div>`;
    }).join('');
  }

  // Top 5 clients
  const topEl = document.getElementById('dash-top-clients');
  if (topEl) {
    const topC = [...DB.clients].sort((a,b)=>b.ca-a.ca).slice(0,5);
    topEl.innerHTML = topC.map((c,i)=>`
      <tr>
        <td><strong>${['🥇','🥈','🥉','4️⃣','5️⃣'][i]} ${escHtml(c.nom)}</strong></td>
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
  const DB = window.DB;
  const lowStock = DB.stocks.filter(s=>s.qte<s.seuil);
  const alertsEl = document.getElementById('stock-alerts-banner');
  if (alertsEl) {
    alertsEl.innerHTML = lowStock.length
      ? `<div class="alert-banner"><div class="alert-banner-icon">🚨</div>
         <div class="alert-banner-text">${lowStock.map(s=>`${s.icone} ${s.produit} : ${s.qte}/${s.seuil} ${s.unite}`).join(' — ')}</div></div>`
      : '';
  }

  const oeufsTotal   = DB.stocks.filter(s=>s.categorie==='Œufs').reduce((a,s)=>a+s.qte,0);
  const pouletsTotal = DB.stocks.filter(s=>s.categorie==='Poulets').reduce((a,s)=>a+s.qte,0);
  animateCount('kpi-stock-oeufs',    oeufsTotal);
  animateCount('kpi-stock-poulets',  pouletsTotal);
  animateCount('kpi-stock-alertes2', lowStock.length);
  const alertesEl2 = document.getElementById('kpi-stock-alertes2');
  if (alertesEl2) alertesEl2.style.color = lowStock.length ? 'var(--red)' : 'var(--green)';

  renderStockTable(DB.stocks);

  // Jauges
  const gaugesEl = document.getElementById('stock-gauges');
  if (gaugesEl) {
    gaugesEl.innerHTML = DB.stocks.map(s=>{
      const pct = Math.min(100,Math.round(s.qte/(s.seuil*2)*100));
      const cls = pct<30?'critical':pct<60?'low':'ok';
      return `<div class="gauge-wrap">
        <div class="gauge-info">
          <span class="gauge-label">${s.icone} ${escHtml(s.produit)}</span>
          <span class="gauge-qty">${fmtNum(s.qte)} ${escHtml(s.unite)}</span>
        </div>
        <div class="gauge-bar"><div class="gauge-fill ${cls}" style="width:${pct}%"></div></div>
      </div>`;
    }).join('');
  }

  // Mouvements récents
  const movEl = document.getElementById('stock-movements');
  if (movEl) {
    movEl.innerHTML = DB.mouvements.slice(-5).reverse().map(m=>`
      <div class="mvt-row">
        <span class="mvt-dot ${m.type==='entree'?'green':'red'}"></span>
        <div>
          <div class="mvt-produit">${escHtml(m.produit)}</div>
          <div class="mvt-detail">${m.type==='entree'?'📥':'📤'} ${m.qte} · ${escHtml(m.motif)} · <span class="mvt-date">${m.date}</span></div>
        </div>
      </div>`).join('') || '<div style="color:var(--text3);padding:12px">Aucun mouvement</div>';
  }
}

function renderStockTable(stocks) {
  const tbody = document.getElementById('stock-tbody');
  if (!tbody) return;
  if (!stocks.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--text3)">Aucun produit en stock</td></tr>';
    return;
  }
  tbody.innerHTML = stocks.map(s=>{
    const pct    = Math.min(100,Math.round(s.qte/(s.seuil*2)*100));
    const statut = s.qte<s.seuil?'Critique':s.qte<s.seuil*1.5?'Bas':'OK';
    return `<tr>
      <td>${s.icone} ${escHtml(s.produit)}</td>
      <td>${escHtml(s.categorie)}</td>
      <td>${escHtml(s.unite)}</td>
      <td style="font-family:var(--mono);font-weight:700;color:${s.qte<s.seuil?'var(--red)':'inherit'}">${fmtNum(s.qte)}</td>
      <td style="font-family:var(--mono)">${fmtNum(s.seuil)}</td>
      <td>${s.peremption||'—'}</td>
      <td>${badge(statut)}</td>
      <td>
        <button class="btn-sm" onclick="editStock(${s.id})">✏️</button>
        <button class="btn-sm danger" onclick="deleteStock(${s.id})">🗑️</button>
      </td>
    </tr>`;
  }).join('');
}

function openNewStock() {
  if (typeof openModal !== 'function') return;
  openModal('➕ Entrée stock', `
    <div class="form-group"><label>Produit *</label>
      <input type="text" id="ns-produit" placeholder="Ex: Œufs blancs"></div>
    <div class="form-group"><label>Catégorie *</label>
      <select id="ns-cat"><option>Œufs</option><option>Poulets</option><option>Accessoires</option></select></div>
    <div class="form-group"><label>Unité</label>
      <input type="text" id="ns-unite" placeholder="Plateau 30 / Tête / Kg"></div>
    <div class="form-group"><label>Quantité *</label>
      <input type="number" id="ns-qte" min="0" value="0"></div>
    <div class="form-group"><label>Seuil alerte</label>
      <input type="number" id="ns-seuil" min="0" value="50"></div>
    <div class="form-group"><label>Prix détail (FCFA)</label>
      <input type="number" id="ns-prix" min="0" value="0"></div>`,
    `<button class="header-btn primary" onclick="saveNewStock()">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveNewStock() {
  const DB = window.DB;
  const produit = document.getElementById('ns-produit')?.value.trim();
  const cat     = document.getElementById('ns-cat')?.value;
  const unite   = document.getElementById('ns-unite')?.value.trim() || 'Unité';
  const qte     = parseInt(document.getElementById('ns-qte')?.value,10) || 0;
  const seuil   = parseInt(document.getElementById('ns-seuil')?.value,10) || 50;
  const prix    = parseInt(document.getElementById('ns-prix')?.value,10) || 0;
  if (!produit) { showToast('Le nom du produit est obligatoire','warn'); return; }
  const icone = cat==='Œufs'?'🥚':cat==='Poulets'?'🐓':'📦';
  const newStock = { id: Date.now(), produit, categorie: cat, unite, qte, seuil, prixDetail: prix, prixGros: Math.round(prix*0.9), icone };
  DB.stocks.push(newStock);
  saveStockToFirebase(newStock);
  closeModal();
  renderStocks();
  renderDashboard();
  checkStockAlerts();
  showToast('✅ Produit ajouté','success');
}

function editStock(id) {
  const DB = window.DB;
  const s = DB.stocks.find(st=>st.id===id);
  if (!s) return;
  openModal('✏️ Modifier — '+s.produit, `
    <div class="form-group"><label>Quantité</label>
      <input type="number" id="edit-stock-qte" value="${s.qte}" min="0"></div>
    <div class="form-group"><label>Prix détail (FCFA)</label>
      <input type="number" id="edit-stock-prix" value="${s.prixDetail}" min="0"></div>
    <div class="form-group"><label>Seuil alerte</label>
      <input type="number" id="edit-stock-seuil" value="${s.seuil}" min="0"></div>`,
    `<button class="header-btn primary" onclick="saveEditStock(${id})">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveEditStock(id) {
  const DB = window.DB;
  const s = DB.stocks.find(st=>st.id===id);
  if (!s) return;
  const qte   = parseInt(document.getElementById('edit-stock-qte')?.value,10);
  const prix  = parseInt(document.getElementById('edit-stock-prix')?.value,10);
  const seuil = parseInt(document.getElementById('edit-stock-seuil')?.value,10);
  if (!isNaN(qte))   s.qte        = qte;
  if (!isNaN(prix))  s.prixDetail = prix;
  if (!isNaN(seuil)) s.seuil      = seuil;
  closeModal();
  renderStocks();
  renderDashboard();
  checkStockAlerts();
  showToast('✅ Stock mis à jour','success');
}

function deleteStock(id) {
  delItem('stocks', id, ()=>{ renderStocks(); renderDashboard(); checkStockAlerts(); });
}

/* ══════════════════════════════════════════
   VENTES
══════════════════════════════════════════ */
function renderVentes() {
  const DB = window.DB;
  const tbody = document.getElementById('ventes-tbody');
  if (!tbody) return;

  const caM = DB.ventes.filter(v=>v.statut==='Payée').reduce((s,v)=>s+v.montant,0);
  animateCount('kpi-ca-mois',caM,true);
  animateCount('kpi-cmd-cours', DB.ventes.filter(v=>v.statut==='En cours'||v.statut==='En préparation').length);
  animateCount('kpi-impayees',  DB.ventes.filter(v=>v.statut!=='Payée'&&v.statut!=='Annulée').length);

  if (!DB.ventes.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:20px">Aucune vente enregistrée</td></tr>';
    return;
  }
  tbody.innerHTML = [...DB.ventes].sort((a,b)=>String(b.id).localeCompare(String(a.id))).slice(0,50).map(v=>`
    <tr>
      <td style="font-family:var(--mono);font-size:12px">${escHtml(v.num||'—')}</td>
      <td>${escHtml(v.client||'—')}</td>
      <td style="font-size:12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml((v.produits||'—').slice(0,50))}</td>
      <td style="font-family:var(--mono);font-weight:700">${fmtMoney(v.montant)}</td>
      <td>${v.date||'—'}</td>
      <td>${badge(v.type||'vente')}</td>
      <td>${badge(v.statut||'En cours')}</td>
      <td><button class="btn-sm" onclick="viewVente('${v.id}')">👁️</button></td>
    </tr>`).join('');
}

function renderSales() { renderVentes(); }

function viewVente(id) {
  const DB = window.DB;
  const v = DB.ventes.find(x=>String(x.id)===String(id));
  if (!v) return;
  openModal('🧾 Détail — '+v.num, `
    <table class="detail-table">
      <tr><td>Client</td><td><strong>${escHtml(v.client)}</strong></td></tr>
      <tr><td>Produits</td><td>${escHtml(v.produits||'—')}</td></tr>
      <tr><td>Montant</td><td><strong>${fmtMoney(v.montant)}</strong></td></tr>
      <tr><td>Date</td><td>${v.date}</td></tr>
      <tr><td>Type</td><td>${badge(v.type)}</td></tr>
      <tr><td>Statut</td><td>${badge(v.statut)}</td></tr>
    </table>`,
    `<button class="header-btn" onclick="closeModal()">Fermer</button>`);
}

function openNewVente() {
  openModal('➕ Nouvelle commande', `
    <div class="form-group"><label>Client</label>
      <select id="nv-client"><option value="">— Anonyme —</option>
      ${window.DB.clients.map(c=>`<option value="${c.nom}">${escHtml(c.nom)}</option>`).join('')}
      </select></div>
    <div class="form-group"><label>Produits</label>
      <input type="text" id="nv-produits" placeholder="Ex: 10 plt Œufs blancs"></div>
    <div class="form-group"><label>Montant (FCFA) *</label>
      <input type="number" id="nv-montant" min="0" value="0"></div>
    <div class="form-group"><label>Type</label>
      <select id="nv-type"><option value="commande">Commande</option><option value="vente">Vente directe</option></select></div>`,
    `<button class="header-btn primary" onclick="saveNewVente()">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveNewVente() {
  const DB = window.DB;
  const client   = document.getElementById('nv-client')?.value || 'Vente comptoir';
  const produits = document.getElementById('nv-produits')?.value.trim();
  const montant  = parseInt(document.getElementById('nv-montant')?.value,10)||0;
  const type     = document.getElementById('nv-type')?.value||'commande';
  if (!produits||montant<=0) { showToast('Produits et montant obligatoires','warn'); return; }
  const newV = {
    id: 'local_'+Date.now(),
    num: 'V-'+new Date().getFullYear()+'-'+String(DB.ventes.length+1).padStart(4,'0'),
    client, produits, montant, type, date: todayStr(), statut:'En cours', remise:0
  };
  DB.ventes.push(newV);
  saveVenteToFirebase(newV);
  closeModal();
  renderVentes();
  renderDashboard();
  showToast('✅ Commande enregistrée','success');
}

/* ══════════════════════════════════════════
   CLIENTS
══════════════════════════════════════════ */
function renderClients() {
  const DB = window.DB;
  const tbody = document.getElementById('clients-tbody');
  if (!tbody) return;
  animateCount('kpi-clients-total',  DB.clients.length);
  animateCount('kpi-clients-actifs', DB.clients.filter(c=>c.statut==='Actif').length);
  animateCount('kpi-clients-creances',DB.clients.reduce((s,c)=>s+(c.solde||0),0),true);
  tbody.innerHTML = DB.clients.map(c=>`
    <tr>
      <td><strong>${escHtml(c.nom)}</strong></td>
      <td>${escHtml(c.tel||'—')}</td>
      <td>${badge(c.type)}</td>
      <td style="font-family:var(--mono)">${fmtMoney(c.ca)}</td>
      <td>⭐ ${fmtNum(c.points)}</td>
      <td style="color:${c.solde>0?'var(--red)':'var(--green)'}">${fmtMoney(c.solde)}</td>
      <td>${badge(c.statut)}</td>
      <td>
        <button class="btn-sm" onclick="editClient(${c.id})">✏️</button>
        <button class="btn-sm danger" onclick="deleteClient(${c.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function openNewClient() {
  openModal('➕ Nouveau client', `
    <div class="form-group"><label>Nom *</label>
      <input type="text" id="new-cli-nom" placeholder="Nom complet / Raison sociale"></div>
    <div class="form-group"><label>Téléphone</label>
      <input type="text" id="new-cli-tel" placeholder="07 XX XX XX XX"></div>
    <div class="form-group"><label>Type</label>
      <select id="new-cli-type">
        <option>Restaurant</option><option>Supermarché</option>
        <option>Hôtel</option><option>Revendeur</option><option>Particulier</option>
      </select></div>`,
    `<button class="header-btn primary" onclick="saveNewClient()">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveNewClient() {
  const DB = window.DB;
  const nom  = document.getElementById('new-cli-nom')?.value.trim();
  const tel  = document.getElementById('new-cli-tel')?.value.trim();
  const type = document.getElementById('new-cli-type')?.value;
  if (!nom) { showToast('Le nom est obligatoire','warn'); return; }
  const c = { id: Date.now(), nom, tel, type, ca:0, solde:0, points:0, statut:'Actif' };
  DB.clients.push(c);
  saveClientToFirebase(c);
  closeModal();
  renderClients();
  populatePosClients();
  showToast('✅ Client ajouté','success');
}

function editClient(id) {
  const DB = window.DB;
  const c = DB.clients.find(x=>x.id===id);
  if (!c) return;
  openModal('✏️ Modifier — '+c.nom, `
    <div class="form-group"><label>Nom</label>
      <input type="text" id="edit-cli-nom" value="${escHtml(c.nom)}"></div>
    <div class="form-group"><label>Téléphone</label>
      <input type="text" id="edit-cli-tel" value="${escHtml(c.tel||'')}"></div>
    <div class="form-group"><label>Statut</label>
      <select id="edit-cli-statut">
        <option ${c.statut==='Actif'?'selected':''}>Actif</option>
        <option ${c.statut==='Inactif'?'selected':''}>Inactif</option>
      </select></div>`,
    `<button class="header-btn primary" onclick="saveEditClient(${id})">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveEditClient(id) {
  const DB = window.DB;
  const c = DB.clients.find(x=>x.id===id);
  if (!c) return;
  c.nom    = document.getElementById('edit-cli-nom')?.value.trim()  || c.nom;
  c.tel    = document.getElementById('edit-cli-tel')?.value.trim()  || c.tel;
  c.statut = document.getElementById('edit-cli-statut')?.value      || c.statut;
  closeModal();
  renderClients();
  populatePosClients();
  showToast('✅ Client mis à jour','success');
}

function deleteClient(id) {
  delItem('clients', id, ()=>renderClients());
}

/* ══════════════════════════════════════════
   FOURNISSEURS
══════════════════════════════════════════ */
function renderFourn() {
  const DB = window.DB;
  const tbody = document.getElementById('fourn-tbody');
  if (!tbody) return;
  tbody.innerHTML = DB.fournisseurs.map(f=>`
    <tr>
      <td><strong>${escHtml(f.nom)}</strong></td>
      <td>${escHtml(f.contact||'—')}</td>
      <td>${escHtml((f.produits||[]).join(', '))}</td>
      <td>${f.delai||'—'}</td>
      <td>${fmtNum(f.cmdYTD||0)}</td>
      <td>${f.note||'—'}</td>
      <td>${badge(f.statut)}</td>
      <td>
        <button class="btn-sm" onclick="editFourn(${f.id})">✏️</button>
        <button class="btn-sm danger" onclick="deleteFourn(${f.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function renderFournisseurs() { renderFourn(); }
function renderSuppliers()    { renderFourn(); }

function openNewFourn() {
  openModal('➕ Nouveau fournisseur', `
    <div class="form-group"><label>Nom *</label>
      <input type="text" id="new-fourn-nom" placeholder="Nom de la société"></div>
    <div class="form-group"><label>Contact</label>
      <input type="text" id="new-fourn-contact" placeholder="Nom + téléphone"></div>
    <div class="form-group"><label>Produits fournis</label>
      <input type="text" id="new-fourn-produits" placeholder="Ex: Œufs, Aliments..."></div>
    <div class="form-group"><label>Délai livraison</label>
      <input type="text" id="new-fourn-delai" placeholder="Ex: 48h"></div>`,
    `<button class="header-btn primary" onclick="saveNewFourn()">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveNewFourn() {
  const DB = window.DB;
  const nom      = document.getElementById('new-fourn-nom')?.value.trim();
  const contact  = document.getElementById('new-fourn-contact')?.value.trim();
  const produits = (document.getElementById('new-fourn-produits')?.value||'').split(',').map(p=>p.trim()).filter(Boolean);
  const delai    = document.getElementById('new-fourn-delai')?.value.trim();
  if (!nom) { showToast('Le nom est obligatoire','warn'); return; }
  const f = { id: Date.now(), nom, contact, produits, delai, cmdYTD:0, note:'—', statut:'Actif' };
  DB.fournisseurs.push(f);
  saveFournisseurToFirebase(f);
  closeModal();
  renderFourn();
  showToast('✅ Fournisseur ajouté','success');
}

function editFourn(id) {
  const DB = window.DB;
  const f = DB.fournisseurs.find(x=>x.id===id);
  if (!f) return;
  openModal('✏️ Modifier — '+f.nom, `
    <div class="form-group"><label>Nom</label>
      <input type="text" id="edit-fourn-nom" value="${escHtml(f.nom)}"></div>
    <div class="form-group"><label>Contact</label>
      <input type="text" id="edit-fourn-contact" value="${escHtml(f.contact||'')}"></div>
    <div class="form-group"><label>Délai</label>
      <input type="text" id="edit-fourn-delai" value="${escHtml(f.delai||'')}"></div>
    <div class="form-group"><label>Statut</label>
      <select id="edit-fourn-statut">
        <option ${f.statut==='Actif'?'selected':''}>Actif</option>
        <option ${f.statut==='Inactif'?'selected':''}>Inactif</option>
      </select></div>`,
    `<button class="header-btn primary" onclick="saveEditFourn(${id})">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveEditFourn(id) {
  const DB = window.DB;
  const f = DB.fournisseurs.find(x=>x.id===id);
  if (!f) return;
  f.nom     = document.getElementById('edit-fourn-nom')?.value.trim()     || f.nom;
  f.contact = document.getElementById('edit-fourn-contact')?.value.trim() || f.contact;
  f.delai   = document.getElementById('edit-fourn-delai')?.value.trim()   || f.delai;
  f.statut  = document.getElementById('edit-fourn-statut')?.value         || f.statut;
  closeModal();
  renderFourn();
  showToast('✅ Fournisseur mis à jour','success');
}

function deleteFourn(id) {
  delItem('fournisseurs', id, ()=>renderFourn());
}

/* ══════════════════════════════════════════
   LIVRAISONS
══════════════════════════════════════════ */
function renderLivraisons() { renderDeliveries(); }

function renderDeliveries() {
  const DB = window.DB;
  animateCount('kpi-liv-enroute', DB.livraisons.filter(l=>l.statut==='En route').length);
  animateCount('kpi-liv-ok',      DB.livraisons.filter(l=>l.statut==='Livrée').length);
  animateCount('kpi-liv-pb',      DB.livraisons.filter(l=>l.statut==='Problème').length);

  const listEl = document.getElementById('livraisons-list');
  if (listEl) {
    listEl.innerHTML = DB.livraisons.map(l=>`
      <div class="livraison-card">
        <div class="liv-header">
          <span class="liv-num">${escHtml(l.num)}</span>
          ${badge(l.statut)}
        </div>
        <div class="liv-body">
          <span>👤 ${escHtml(l.client)}</span>
          <span>🚚 ${escHtml(l.livreur||'—')}</span>
          <span>📅 ${l.date}</span>
          <span>📍 ${l.km} km</span>
        </div>
        <div style="margin-top:8px">
          <button class="btn-sm" onclick="updateLivStatut('${l.id}','Livrée')">✅ Livrée</button>
          <button class="btn-sm" onclick="updateLivStatut('${l.id}','Problème')">⚠️ Problème</button>
        </div>
      </div>`).join('');
  }

  const pendingEl = document.getElementById('livraisons-pending');
  if (pendingEl) {
    const pending = DB.ventes.filter(v=>v.type==='commande'&&v.statut==='En cours').slice(0,5);
    pendingEl.innerHTML = pending.length
      ? pending.map(v=>`
        <div class="liv-pending-item">
          <span style="font-weight:600">${escHtml(v.client)}</span>
          <span style="font-size:12px;color:var(--text3)">${escHtml(v.produits||'').slice(0,40)}</span>
          <span style="font-family:var(--mono)">${fmtMoney(v.montant)}</span>
          <button class="btn-sm" onclick="createLivraison('${v.id}')">🚚 Affecter</button>
        </div>`).join('')
      : '<div style="color:var(--text3);padding:16px;text-align:center">✅ Aucune commande en attente</div>';
  }
}

function updateLivStatut(id, newStatut) {
  const DB = window.DB;
  const l = DB.livraisons.find(x=>String(x.id)===String(id));
  if (!l) return;
  l.statut = newStatut;
  renderLivraisons();
  showToast(`📦 Livraison ${newStatut}`,'success');
}

function createLivraison(venteId) {
  const DB = window.DB;
  const v = DB.ventes.find(x=>String(x.id)===String(venteId));
  if (!v) return;
  openModal('🚚 Affecter une livraison', `
    <div class="form-group"><label>Livreur</label>
      <select id="lv-livreur">
        ${equipeData.livreurs.map(l=>`<option>${escHtml(l.nom)}</option>`).join('')}
      </select></div>
    <div class="form-group"><label>Client</label>
      <input type="text" value="${escHtml(v.client)}" readonly></div>`,
    `<button class="header-btn primary" onclick="saveLivraison('${venteId}')">💾 Affecter</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveLivraison(venteId) {
  const DB = window.DB;
  const v       = DB.ventes.find(x=>String(x.id)===String(venteId));
  const livreur = document.getElementById('lv-livreur')?.value;
  if (!v||!livreur) return;
  const newLiv = {
    id: 'liv_'+Date.now(),
    num: 'LIV-'+String(DB.livraisons.length+1).padStart(3,'0'),
    client: v.client, livreur, statut:'En route', date: todayStr(), km: 0
  };
  DB.livraisons.push(newLiv);
  v.statut = 'En préparation';
  saveLivraisonToFirebase(newLiv);
  closeModal();
  renderLivraisons();
  showToast('✅ Livraison affectée à '+livreur,'success');
}

function openNewLivraison() {
  openModal('➕ Nouvelle tournée', `
    <div class="form-group"><label>Client</label>
      <select id="nlv-client"><option value="">— Sélectionner —</option>
      ${window.DB.clients.map(c=>`<option>${escHtml(c.nom)}</option>`).join('')}
      </select></div>
    <div class="form-group"><label>Livreur</label>
      <select id="nlv-livreur">
        ${equipeData.livreurs.map(l=>`<option>${escHtml(l.nom)}</option>`).join('')}
      </select></div>
    <div class="form-group"><label>Distance (km)</label>
      <input type="number" id="nlv-km" min="0" value="0"></div>`,
    `<button class="header-btn primary" onclick="saveNewLivraison()">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveNewLivraison() {
  const DB = window.DB;
  const client  = document.getElementById('nlv-client')?.value;
  const livreur = document.getElementById('nlv-livreur')?.value;
  const km      = parseInt(document.getElementById('nlv-km')?.value,10)||0;
  if (!client||!livreur) { showToast('Veuillez remplir tous les champs','warn'); return; }
  const l = {
    id: 'liv_'+Date.now(),
    num:'LIV-'+String(DB.livraisons.length+1).padStart(3,'0'),
    client, livreur, statut:'En route', date:todayStr(), km
  };
  DB.livraisons.push(l);
  saveLivraisonToFirebase(l);
  closeModal();
  renderLivraisons();
  showToast('✅ Tournée créée','success');
}

/* ══════════════════════════════════════════
   COMPTABILITÉ
══════════════════════════════════════════ */
function renderCompta() {
  const DB = window.DB;
  const tbody = document.getElementById('compta-tbody');
  if (!tbody) return;
  const rec = DB.comptabilite.filter(o=>o.type==='recette').reduce((s,o)=>s+o.montant,0);
  const dep = DB.comptabilite.filter(o=>o.type==='depense').reduce((s,o)=>s+o.montant,0);
  const ben = rec - dep;

  const setEl = (id, val) => { const e=document.getElementById(id); if(e) e.textContent=val; };
  setEl('compta-recettes', fmtMoney(rec));
  setEl('compta-depenses', fmtMoney(dep));
  setEl('compta-benefice', fmtMoney(ben));
  setEl('tva-val', fmtMoney(Math.round(rec*0.18)));

  const benEl = document.getElementById('compta-benefice');
  if (benEl) benEl.style.color = ben>=0 ? 'var(--green-dark)' : 'var(--red)';

  tbody.innerHTML = [...DB.comptabilite].reverse().map(o=>`
    <tr>
      <td>${o.date}</td>
      <td>${escHtml(o.libelle)}</td>
      <td>${escHtml(o.categorie)}</td>
      <td>${badge(o.type)}</td>
      <td style="font-family:var(--mono);color:${o.type==='recette'?'var(--green-dark)':'var(--red)'}">${fmtMoney(o.montant)}</td>
    </tr>`).join('');

  // Graphique répartition dépenses
  const chartEl = document.getElementById('compta-chart');
  if (chartEl) {
    const catTotals = {};
    DB.comptabilite.filter(o=>o.type==='depense').forEach(o=>{
      catTotals[o.categorie] = (catTotals[o.categorie]||0) + o.montant;
    });
    const total = Object.values(catTotals).reduce((s,v)=>s+v,0)||1;
    chartEl.innerHTML = Object.entries(catTotals).map(([cat,val])=>{
      const pct = Math.round(val/total*100);
      return `<div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${escHtml(cat)}</span><span style="font-weight:700">${pct}%</span>
        </div>
        <div style="height:8px;background:#E8F5E8;border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--green);border-radius:4px"></div>
        </div>
      </div>`;
    }).join('');
  }
}

function renderComptabilite() { renderCompta(); }
function renderAccounting()   { renderCompta(); }

function openNewCompta() {
  openModal('➕ Nouvelle opération', `
    <div class="form-group"><label>Type *</label>
      <select id="nc-type"><option value="recette">💰 Recette</option><option value="depense">💸 Dépense</option></select></div>
    <div class="form-group"><label>Libellé *</label>
      <input type="text" id="nc-libelle" placeholder="Ex: Ventes journalières"></div>
    <div class="form-group"><label>Catégorie</label>
      <input type="text" id="nc-cat" placeholder="Ex: CA, Achats, Transport..."></div>
    <div class="form-group"><label>Montant (FCFA) *</label>
      <input type="number" id="nc-montant" min="0" value="0"></div>`,
    `<button class="header-btn primary" onclick="saveNewCompta()">💾 Enregistrer</button>
     <button class="header-btn" onclick="closeModal()">Annuler</button>`);
}

function saveNewCompta() {
  const DB = window.DB;
  const type    = document.getElementById('nc-type')?.value;
  const libelle = document.getElementById('nc-libelle')?.value.trim();
  const cat     = document.getElementById('nc-cat')?.value.trim()||'Divers';
  const montant = parseInt(document.getElementById('nc-montant')?.value,10)||0;
  if (!libelle||montant<=0) { showToast('Libellé et montant obligatoires','warn'); return; }
  const op = { id: Date.now(), date: todayStr(), libelle, categorie: cat, type, montant };
  DB.comptabilite.push(op);
  saveComptaToFirebase(op);
  closeModal();
  renderCompta();
  showToast('✅ Opération enregistrée','success');
}

/* ══════════════════════════════════════════
   RAPPORTS
══════════════════════════════════════════ */
function renderReports() {
  const DB = window.DB;
  const caM = DB.ventes.filter(v=>v.statut==='Payée').reduce((s,v)=>s+v.montant,0);
  const setEl = (id,val)=>{ const e=document.getElementById(id);if(e)e.textContent=val; };
  setEl('rap-ca-mois', fmtMoney(caM));
}

function renderRapports() { renderReports(); }

/* ══════════════════════════════════════════
   ÉQUIPE
══════════════════════════════════════════ */
function renderEquipe() {
  const DB = window.DB;
  const gridEl = document.getElementById('equipeGrid');
  if (!gridEl) return;

  const now = new Date();
  document.getElementById('equipeDateLabel') &&
    (document.getElementById('equipeDateLabel').textContent =
      now.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}));

  const tous = [
    ...equipeData.gerants.map(m=>({...m, classe:'gerant', roleLabel:'👑 Gérant de service'})),
    ...equipeData.livreurs.map(m=>({...m, classe:'livreur', roleLabel:'🚚 Livreur'})),
    ...(DB.employees||[]).map(m=>({
      id: m.id, nom: m.name||m.nom||'—',
      initiales: (m.name||m.nom||'?').slice(0,2).toUpperCase(),
      statut: m.status==='En service'?'online':'offline',
      classe: 'livreur', roleLabel: m.role||'Employé'
    })),
  ];

  gridEl.innerHTML = tous.map(m=>`
    <div class="membre-card ${m.classe}">
      <div class="membre-avatar">
        ${m.initiales}
        <div class="membre-status-dot ${m.statut}"></div>
      </div>
      <div class="membre-info">
        <div class="membre-nom">${escHtml(m.nom)}</div>
        <div class="membre-role-tag">${m.roleLabel}</div>
        <div class="membre-meta">${{online:'🟢 En service',away:'🟡 En déplacement',offline:'⚫ Hors service'}[m.statut]||m.statut}</div>
        ${m.vehicule?`<div class="membre-meta">🚗 ${escHtml(m.vehicule)}</div>`:''}
      </div>
      ${m.ventesJour?`<div class="membre-stats"><div class="membre-stat-val" style="font-size:14px">${fmtMoney(m.ventesJour)}</div><div class="membre-stat-lbl">Ventes</div></div>`:''}
      ${m.livreesJour!==undefined?`<div class="membre-stats"><div class="membre-stat-val">${m.livreesJour}/${m.totalJour}</div><div class="membre-stat-lbl">Livraisons</div></div>`:''}
    </div>`).join('');

  const online  = tous.filter(m=>m.statut==='online').length;
  const away    = tous.filter(m=>m.statut==='away').length;
  const offline = tous.filter(m=>m.statut==='offline').length;

  const setEl = (id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  setEl('footer-online',  online);
  setEl('footer-away',    away);
  setEl('footer-offline', offline);
  setEl('kpi-livreurs-actifs', equipeData.livreurs.filter(l=>l.statut==='online'||l.statut==='away').length);
  setEl('kpi-equipe-livraisons', equipeData.livreurs.reduce((s,l)=>s+(l.livreesJour||0),0));

  const gerant = equipeData.gerants[0];
  if (gerant) {
    const gEl = document.getElementById('kpi-gerant-nom');
    if (gEl) gEl.textContent = gerant.nom;
    setEl('kpi-equipe-ca', fmtMoney(gerant.ventesJour||0));
  }

  // Journal du jour
  const journalEl = document.getElementById('equipe-journal');
  if (journalEl) {
    journalEl.innerHTML = tous.map(m=>`
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--green-pale)">
        <div class="membre-avatar" style="width:36px;height:36px;font-size:12px">${m.initiales}</div>
        <div>
          <div style="font-weight:600;font-size:13px">${escHtml(m.nom)}</div>
          <div style="font-size:11px;color:var(--text3)">${m.roleLabel} · ${m.debut?m.debut+' – '+m.fin:'Heure variable'}</div>
        </div>
        <div style="margin-left:auto">${badge(m.statut==='online'?'Actif':'Inactif')}</div>
      </div>`).join('');
  }
}

function renderParametres() {
  renderUsersTable();
  renderPricesList();
}

function renderUsersTable() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  tbody.innerHTML = USERS.map(u=>`
    <tr>
      <td><strong>${escHtml(u.nom)}</strong></td>
      <td>${escHtml(u.email)}</td>
      <td>${badge(u.role)}</td>
      <td>${badge(u.statut)}</td>
      <td><button class="btn-sm">✏️</button></td>
    </tr>`).join('');
}

function renderPricesList() {
  const el = document.getElementById('prices-list');
  if (!el) return;
  const DB = window.DB;
  el.innerHTML = DB.stocks.map(s=>`
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <span style="flex:1;font-size:13px">${s.icone} ${escHtml(s.produit)}</span>
      <input type="number" value="${s.prixDetail}" min="0"
             class="form-input" style="width:120px" data-stock-id="${s.id}" data-field="prixDetail"
             onchange="updatePrice(${s.id},'detail',this.value)">
      <input type="number" value="${s.prixGros}" min="0"
             class="form-input" style="width:120px" data-stock-id="${s.id}" data-field="prixGros"
             onchange="updatePrice(${s.id},'gros',this.value)">
      <span style="font-size:11px;color:var(--text3);min-width:60px">Détail / Gros</span>
    </div>`).join('');
}

function updatePrice(id, type, val) {
  const DB = window.DB;
  const s = DB.stocks.find(x=>x.id===id);
  if (!s) return;
  const v = parseInt(val,10)||0;
  if (type==='detail') s.prixDetail = v;
  else                 s.prixGros   = v;
}

function savePrices() {
  showToast('✅ Prix enregistrés','success');
}

/* ══════════════════════════════════════════
   POINT DE VENTE — CAISSE
══════════════════════════════════════════ */
let cart = [];

function populatePosProducts() {
  const DB = window.DB;
  const grid = document.getElementById('posProductGrid');
  if (!grid) return;
  const prods = DB.stocks.filter(s=>s.categorie==='Œufs'||s.categorie==='Poulets');
  if (!prods.length) {
    grid.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text3)">📦 Aucun produit disponible</div>';
    return;
  }
  grid.innerHTML = prods.map(p=>`
    <button class="pos-prod-card ${p.qte<p.seuil?'low-stock':''}" onclick="addToCart(${p.id})">
      <span class="pos-prod-icon">${p.icone}</span>
      <div class="pos-prod-name">${escHtml(p.produit)}</div>
      <div class="pos-prod-price">${fmtMoney(p.prixDetail)}</div>
      <div class="pos-prod-stock" style="color:${p.qte<p.seuil?'var(--red)':'var(--text3)'}">Stock : ${fmtNum(p.qte)} ${escHtml(p.unite)}</div>
    </button>`).join('');
}

function populatePosClients() {
  const DB = window.DB;
  const sel = document.getElementById('posClientSelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Vente anonyme —</option>';
  DB.clients.forEach(c=>{
    const o = document.createElement('option');
    o.value = c.id; o.textContent = `${c.nom} (${c.type})`;
    sel.appendChild(o);
  });
  updatePosClient();
}

function updatePosClient() {
  const DB = window.DB;
  const sel  = document.getElementById('posClientSelect');
  const info = document.getElementById('posClientInfo');
  if (!sel||!info) return;
  if (!sel.value) { info.textContent = 'Vente comptoir'; return; }
  const c = DB.clients.find(x=>x.id===parseInt(sel.value,10));
  info.textContent = c ? `${c.type} · CA: ${fmtMoney(c.ca)} · Solde: ${fmtMoney(c.solde)}` : '—';
}

function addToCart(stockId) {
  const DB = window.DB;
  const item = DB.stocks.find(s=>s.id===stockId);
  if (!item) { showToast('Produit introuvable','error'); return; }
  if (item.qte<=0) { showToast('Stock épuisé','warn'); return; }
  const existing = cart.find(l=>l.id===stockId);
  if (existing) { existing.qty++; }
  else { cart.push({ id:item.id, produit:item.produit, icone:item.icone, prix:item.prixDetail||0, unite:item.unite, qte:item.qte, qty:1 }); }
  renderCart();
  showToast(`➕ ${item.produit} ajouté`,'success');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = '<div class="pos-cart-empty">🥚 Sélectionnez des produits</div>';
    updateTotals(); return;
  }
  container.innerHTML = cart.map((l,i)=>`
    <div class="cart-item">
      <div class="cart-item-main">
        <div class="cart-item-icon">${l.icone||'📦'}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${escHtml(l.produit)}</div>
          <div class="cart-item-sub">${fmtMoney(l.prix)} · ${escHtml(l.unite||'')}</div>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
        <div class="qty-val">${l.qty}</div>
        <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
        <div class="cart-item-total">${fmtMoney(l.prix*l.qty)}</div>
        <button class="cart-remove" onclick="removeFromCart(${i})">✕</button>
      </div>
    </div>`).join('');
  updateTotals();
}

function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index,1);
  renderCart();
}

function removeFromCart(index) { cart.splice(index,1); renderCart(); }

function clearCart() {
  cart = [];
  renderCart();
  const p = document.getElementById('paymentInput');
  if (p) p.value = '';
  calcMonnaie();
  showToast('🗑 Panier vidé','info');
}

function updateTotals() {
  const sub = cart.reduce((s,l)=>s+l.prix*l.qty,0);
  const set = (id,val)=>{ const e=document.getElementById(id);if(e)e.textContent=val; };
  set('subtotal', fmtMoney(sub));
  set('discount', fmtMoney(0));
  set('grandTotal', fmtMoney(sub));
  calcMonnaie();
}

function calcMonnaie() {
  const total = cart.reduce((s,l)=>s+l.prix*l.qty,0);
  const recu  = parseFloat(document.getElementById('paymentInput')?.value)||0;
  const disp  = document.getElementById('monnaieDisplay');
  const valEl = document.getElementById('monnaieVal');
  if (!disp||!valEl) return;
  if (recu>0) {
    disp.style.display = 'block';
    const monnaie = recu - total;
    valEl.textContent = fmtMoney(monnaie);
    valEl.style.color = monnaie>=0 ? 'var(--green-dark)' : 'var(--red)';
    disp.textContent = monnaie>=0
      ? `Monnaie à rendre : ${fmtMoney(monnaie)}`
      : `⚠️ Manquant : ${fmtMoney(-monnaie)}`;
  } else { disp.style.display = 'none'; }
}

function validateSale() {
  const DB = window.DB;
  if (!cart.length) { showToast('🧺 Panier vide','warn'); return; }
  const total = cart.reduce((s,l)=>s+l.prix*l.qty,0);
  const recu  = parseFloat(document.getElementById('paymentInput')?.value)||0;
  if (recu < total) { showToast('💸 Montant insuffisant — Manquant : '+fmtMoney(total-recu),'error'); return; }

  const sel    = document.getElementById('posClientSelect');
  const client = sel?.value ? DB.clients.find(c=>c.id===parseInt(sel.value,10)) : null;

  const vente = {
    id      : 'local_'+Date.now(),
    num     : 'V-'+new Date().getFullYear()+'-'+String(DB.ventes.length+1).padStart(4,'0'),
    client  : client ? client.nom : 'Vente comptoir',
    clientId: client ? client.id  : null,
    produits: cart.map(l=>`${l.qty} × ${l.produit}`).join(', '),
    montant : total,
    date    : todayStr(),
    type    : 'vente',
    statut  : 'Payée',
    remise  : 0,
  };

  DB.ventes.push(vente);
  saveVenteToFirebase(vente);

  // Mise à jour stock
  cart.forEach(l=>{
    const s = DB.stocks.find(st=>st.id===l.id);
    if (s) s.qte = Math.max(0, s.qte-l.qty);
  });

  // Mise à jour CA client
  if (client) { client.ca += total; client.points += Math.floor(total/1000); }

  showToast('✅ Vente enregistrée — '+fmtMoney(total),'success');
  clearCart();
  renderVentes();
  renderStocks();
  renderDashboard();
  populatePosProducts();
  checkStockAlerts();
}

/* ══════════════════════════════════════════
   SUPPRESSION GÉNÉRIQUE
══════════════════════════════════════════ */
function delItem(store, id, cb) {
  if (typeof showConfirm !== 'function') {
    window.DB[store] = window.DB[store].filter(i=>i.id!==id);
    if(cb) cb(); showToast('🗑 Supprimé','success'); return;
  }
  showConfirm('Supprimer', 'Cette action est irréversible.', '⚠️', ok=>{
    if (!ok) return;
    window.DB[store] = window.DB[store].filter(i=>i.id!==id);
    if (cb) cb();
    showToast('🗑 Élément supprimé','success');
  });
}

/* ══════════════════════════════════════════
   SAVE EMPLOYEE
══════════════════════════════════════════ */
async function saveEmployee(name, role, email) {
  if (!name) { showToast('Le nom est obligatoire','warn'); return; }
  const emp = { id:'emp_'+Date.now(), name, role, email, status:'En service', createdAt: new Date().toISOString() };
  window.DB.employees.push(emp);
  await saveEmployeeToFirebase(emp);
  showToast('✅ Employé ajouté','success');
  if (typeof refreshEquipe === 'function') refreshEquipe();
  renderEquipe();
}

/* ══════════════════════════════════════════
   EXPORT GLOBAL (toutes les fonctions
   utilisées par onclick dans le HTML)
══════════════════════════════════════════ */
Object.assign(window, {
  // Init
  initApp,
  // Dashboard
  renderDashboard,
  // Stocks
  renderStocks, renderStockTable,
  openNewStock, saveNewStock,
  editStock, saveEditStock, deleteStock,
  // Ventes
  renderVentes, renderSales,
  openNewVente, saveNewVente, viewVente,
  // Clients
  renderClients,
  openNewClient, saveNewClient, editClient, saveEditClient, deleteClient,
  // Fournisseurs
  renderFourn, renderFournisseurs, renderSuppliers,
  openNewFourn, saveNewFourn, editFourn, saveEditFourn, deleteFourn,
  // Livraisons
  renderLivraisons, renderDeliveries,
  updateLivStatut, createLivraison, saveLivraison,
  openNewLivraison, saveNewLivraison,
  // Comptabilité
  renderCompta, renderComptabilite, renderAccounting,
  openNewCompta, saveNewCompta,
  // Rapports
  renderReports, renderRapports,
  // Équipe
  renderEquipe, renderParametres,
  updatePrice, savePrices,
  // POS
  populatePosProducts, populatePosClients, updatePosClient,
  addToCart, changeQty, removeFromCart, clearCart,
  validateSale, calcMonnaie,
  // Employés
  saveEmployee,
  // Utils
  delItem, checkStockAlerts, applyRoleRestrictions,
  fmtMoney, fmtNum, escHtml, todayStr,
});

/* ══════════════════════════════════════════
   DÉLÉGATION MODALE EMPLOYÉ
══════════════════════════════════════════ */
document.addEventListener('click', e => {
  if (e.target?.id === 'btn-save-employee') {
    const name  = document.getElementById('emp-name')?.value?.trim();
    const role  = document.getElementById('emp-role')?.value;
    const email = document.getElementById('emp-email')?.value?.trim();
    if (name && role) saveEmployee(name, role, email || '');
    else showToast('Veuillez remplir le nom et le rôle','warn');
  }
});

/* ══════════════════════════════════════════
   DÉMARRAGE
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('%c🚀 AVICO-PRO v5 — démarrage', 'color:#2E7D32;font-weight:700;font-size:14px');

  // Synchronisation Firebase (non bloquante)
  try {
    await syncAllData();
    watchStocks();
    enableRealTimeSync();
    console.log('%c✅ Firebase connecté', 'color:#F9A825;font-weight:600');
  } catch (err) {
    console.warn('⚠️ Mode offline — données locales utilisées:', err.message);
  }

  // Initialisation interface (toujours exécutée)
  populatePosProducts();
  populatePosClients();
  renderDashboard();
  checkStockAlerts();

  console.log('%c🎉 AVICO-PRO prêt !', 'color:#2E7D32;font-weight:700');
});
