/* ════════════════════════════════════════════════════════════════
ui.js — AVICO-PRO Gestion Avicole
════════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   UTILITAIRES DE SÉCURITÉ
────────────────────────────────────────────────────────────── */

// Hashage des mots de passe
function hashPassword(password) {
  return btoa(password + 'samci-salt-2024');
}

// Vérification des mots de passe
function verifyPassword(hashedPassword, plainPassword) {
  return hashedPassword === hashPassword(plainPassword);
}

// Validation d'email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Sanitisation des entrées
function sanitizeInput(str) {
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

/* ──────────────────────────────────────────────────────────────
1. CONSTANTES & ÉTAT GLOBAL UI
────────────────────────────────────────────────────────────── */

// Vérifier si UI est déjà défini (conflit avec node_modules)
if (typeof window.UI !== 'undefined') {
  console.warn('⚠️ UI déjà défini, utilisation de la version existante');
} else {
  // Déclarer UI seulement si non défini
  const UI = {
    currentPage : 'dashboard',
    currentUser : null,
    toastQueue  : [],
    confirmCb   : null,
    notifList   : [],

    // Mapping page → titre affiché dans le header
    pageTitles: {
      dashboard   : 'Tableau de bord',
      caisse      : 'Point de Vente',
      equipe      : 'Équipe du jour',
      stocks      : 'Stocks',
      ventes      : 'Ventes & Commandes',
      clients     : 'Clients',
      fournisseurs: 'Fournisseurs',
      livraisons  : 'Livraisons',
      comptabilite: 'Comptabilité',
      rapports    : 'Rapports',
      parametres  : 'Paramètres',
    },

    // Mapping page → libellé du bouton principal
    pageActions: {
      dashboard   : '+ Nouveau',
      caisse      : '🧾 Historique',
      equipe      : '✏️ Affecter',
      stocks      : '+ Entrée stock',
      ventes      : '+ Commande',
      clients     : '+ Client',
      fournisseurs: '+ Fournisseur',
      livraisons  : '+ Tournée',
      comptabilite: '+ Opération',
      rapports    : '⬇️ Exporter PDF',
      parametres  : '💾 Enregistrer',
    },

    // État des modales
    modals: {
      login   : false,
      confirm : false,
      settings: false,
      employee: false,
    },

    // État de l'application
    initialized: false,
  };

  // Exposer UI globalement pour éviter les conflits
  window.UI = UI;
}

/* ──────────────────────────────────────────────────────────────
2. INITIALISATION
────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initDate();
  initLoginListeners();
  checkAutoLogin();
});

/** Affiche la date courante dans le header */
function initDate() {
  const el = document.getElementById('pageDate');
  if (!el) return;
  const now = new Date();
  const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  el.textContent = now.toLocaleDateString('fr-FR', opts);
}

/** Écoute Entrée sur le champ mot de passe (sécurité) */
function initLoginListeners() {
  const pwd = document.getElementById('loginPwd');
  if (pwd) {
    pwd.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  }
}

/** Si un token de session existe, restaure la session */
function checkAutoLogin() {
  try {
    const saved = localStorage.getItem('sam_session');
    if (saved) {
      const user = JSON.parse(saved);
      if (user && user.email) {
        applyUserSession(user);
        return;
      }
    }
  } catch (_) {
    // ignore
  }
  // Sinon, la page de login reste visible
}

/* ──────────────────────────────────────────────────────────────
3. AUTHENTIFICATION
────────────────────────────────────────────────────────────── */

// Utilisateurs de démonstration (mots de passe hashés)
const DEMO_USERS = [
  { email: 'admin@avico-pro.ci',   pwd: hashPassword('admin123'),   name: 'Administrateur',  role: 'Admin',        avatar: 'AD' },
  { email: 'vendeur@avico-pro.ci', pwd: hashPassword('vendeur123'), name: 'Vendeur AVICO',     role: 'Vendeur',      avatar: 'VE' },
  { email: 'livreur@avico-pro.ci', pwd: hashPassword('livreur123'), name: 'Livreur AVICO',     role: 'Livreur',      avatar: 'LI' },
  { email: 'compta@avico-pro.ci',  pwd: hashPassword('compta123'),  name: 'Comptable AVICO',   role: 'Comptabilité', avatar: 'CO' },
];

/**
 * Connexion : appelée par onclick="doLogin()" dans l’HTML
 */
function doLogin() {
  const emailEl = document.getElementById('loginEmail');
  const pwdEl   = document.getElementById('loginPwd');
  const btn     = document.querySelector('.login-btn');

  if (!emailEl || !pwdEl) return;

  const email    = emailEl.value.trim().toLowerCase();
  const password = pwdEl.value;

  // Validation basique
  if (!email) {
    shakeInput(emailEl);
    showToast('⚠️ Veuillez saisir votre email', 'warn');
    return;
  }
  if (!password) {
    shakeInput(pwdEl);
    showToast('⚠️ Veuillez saisir votre mot de passe', 'warn');
    return;
  }

  // Animation bouton
  if (btn) {
    btn.textContent = 'Connexion…';
    btn.disabled = true;
  }

  setTimeout(() => {
    try {
      // Cherche dans les users démo (avec vérification de hash)
      let user = DEMO_USERS.find(u => u.email === email && verifyPassword(u.pwd, password));

      // Cherche aussi dans les employés ajoutés manuellement
      if (!user) {
        const employees = JSON.parse(localStorage.getItem('sam_employees') || '[]');
        const emp = employees.find(e => e.email && e.email.toLowerCase() === email && verifyPassword(e.password, password));
        if (emp) {
          user = {
            email : emp.email,
            name  : emp.name,
            role  : emp.role,
            avatar: emp.name.slice(0, 2).toUpperCase(),
          };
        }
      }

      if (btn) {
        btn.textContent = 'Se connecter →';
        btn.disabled = false;
      }

      if (user) {
        localStorage.setItem('sam_session', JSON.stringify(user));
        applyUserSession(user);
        showToast(`✅ Bienvenue, ${user.name} !`, 'success');
      } else {
        shakeInput(emailEl);
        shakeInput(pwdEl);
        showToast('❌ Email ou mot de passe incorrect', 'error');
        pwdEl.value = '';
        pwdEl.focus();
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      showToast('❌ Erreur de connexion, veuillez réessayer', 'error');
      if (btn) {
        btn.textContent = 'Se connecter →';
        btn.disabled = false;
      }
    }
  }, 400);
}

/** Active la session et affiche l’application */
function applyUserSession(user) {
  UI.currentUser = user;

  // Met à jour la sidebar
  const avatarEl = document.getElementById('sbAvatar');
  const nameEl   = document.getElementById('sbUserName');
  const roleEl   = document.getElementById('sbUserRole');
  if (avatarEl) avatarEl.textContent = user.avatar || user.name.slice(0, 2).toUpperCase();
  if (nameEl)   nameEl.textContent   = user.name;
  if (roleEl)   roleEl.textContent   = user.role;

  // Cache le login, affiche l’app
  const loginPage = document.getElementById('loginPage');
  const appEl     = document.getElementById('app');
  if (loginPage) loginPage.style.display = 'none';
  if (appEl)     appEl.classList.remove('hidden');

  // Navigate vers le tableau de bord
  nav('dashboard', document.querySelector('[data-page="dashboard"]'));

  // Déclenche l’initialisation de l’app si app.js est chargé
  if (typeof initApp === 'function') initApp(user);
}

/* ──────────────────────────────────────────────────────────────
4. FONCTIONS D'ENREGISTREMENT DES DONNÉES
────────────────────────────────────────────────────────────── */

// Ajouter un nouveau produit depuis l'interface (sécurisé)
function addNewProduct() {
  openModal('➕ Ajouter un produit', `
    <div class="form-group">
      <label>Nom du produit</label>
      <input type="text" id="new-produit-nom" placeholder="Ex: Œufs de poule" required>
    </div>
    <div class="form-group">
      <label>Catégorie</label>
      <select id="new-produit-categorie">
        <option value="Œufs">Œufs</option>
        <option value="Poulets">Poulets</option>
      </select>
    </div>
    <div class="form-group">
      <label>Unité</label>
      <select id="new-produit-unite">
        <option value="Plateau 30">Plateau 30</option>
        <option value="Tête">Tête</option>
        <option value="Kg">Kg</option>
      </select>
    </div>
    <div class="form-group">
      <label>Quantité en stock</label>
      <input type="number" id="new-produit-qte" min="0" required>
    </div>
    <div class="form-group">
      <label>Seuil alerte</label>
      <input type="number" id="new-produit-seuil" min="0" required>
    </div>
    <div class="form-group">
      <label>Prix de vente (FCFA)</label>
      <input type="number" id="new-produit-prix" min="0" required>
    </div>
  `, `
    <button class="header-btn primary" onclick="saveNewProduct()"> Enregistrer</button>
    <button class="header-btn" onclick="closeModal()">Annuler</button>
  `);
}

function saveNewProduct() {
  const produit = document.getElementById('new-produit-nom')?.value.trim();
  const categorie = document.getElementById('new-produit-categorie')?.value;
  const unite = document.getElementById('new-produit-unite')?.value;
  const qte = parseInt(document.getElementById('new-produit-qte')?.value) || 0;
  const seuil = parseInt(document.getElementById('new-produit-seuil')?.value) || 0;
  const prix = parseInt(document.getElementById('new-produit-prix')?.value) || 0;
  
  if (!produit || !categorie || !unite || isNaN(qte) || isNaN(seuil) || isNaN(prix)) {
    showToast(' Veuillez remplir tous les champs correctement', 'error');
    return;
  }
  
  if (qte < 0 || seuil < 0 || prix < 0) {
    showToast(' Les valeurs doivent être positives', 'error');
    return;
  }
  
  const newProduct = {
    id: Date.now(),
    produit: produit,
    categorie: categorie,
    unite: unite,
    qte: qte,
    seuil: seuil,
    prix: prix,
    prixDetail: prix,
    prixGros: Math.floor(prix * 0.9),
    icone: categorie === 'Œufs' ? ' ' : ' '
  };
  
  DB.stocks.push(newProduct);
  closeModal();
  renderStocks();
  showToast(' Produit ajouté avec succès', 'success');
}

// Ajouter un nouveau client depuis l'interface (sécurisé)
function addNewClient() {
  openModal('➕ Ajouter un client', `
    <div class="form-group">
      <label>Nom du client</label>
      <input type="text" id="new-client-nom" placeholder="Nom complet / Raison sociale" required>
    </div>
    <div class="form-group">
      <label>Type</label>
      <select id="new-client-type">
        <option value="Restaurant">Restaurant</option>
        <option value="Supermarché">Supermarché</option>
        <option value="Hôtel">Hôtel</option>
        <option value="Revendeur">Revendeur</option>
        <option value="Particulier">Particulier</option>
      </select>
    </div>
    <div class="form-group">
      <label>Téléphone</label>
      <input type="tel" id="new-client-tel" placeholder="07 XX XX XX XX" required>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="new-client-email" placeholder="email@exemple.com">
    </div>
  `, `
    <button class="header-btn primary" onclick="saveNewClient()">💾 Enregistrer</button>
    <button class="header-btn" onclick="closeModal()">Annuler</button>
  `);
}

function saveNewClient() {
  const nom = document.getElementById('new-client-nom')?.value.trim();
  const type = document.getElementById('new-client-type')?.value;
  const tel = document.getElementById('new-client-tel')?.value.trim();
  const email = document.getElementById('new-client-email')?.value.trim();
  
  if (!nom || !type || !tel) {
    showToast('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }
  
  if (email && !validateEmail(email)) {
    showToast('⚠️ Email invalide', 'error');
    return;
  }
  
  const clientData = {
    id: Date.now(),
    nom: sanitizeInput(nom),
    type: sanitizeInput(type),
    tel: sanitizeInput(tel),
    email: sanitizeInput(email),
    ca: 0,
    solde: 0,
    points: 0,
    statut: 'Actif'
  };
  
  // Ajouter localement
  if (typeof DB !== 'undefined' && DB.clients) {
    DB.clients.push(clientData);
  }
  
  // Sauvegarder dans Firebase
  if (typeof addClientToFirebase === 'function') {
    addClientToFirebase(clientData);
  }
  
  closeModal();
  
  // Rafraîchir l'interface
  if (typeof renderClients === 'function') {
    renderClients();
  }
  if (typeof populatePosClients === 'function') {
    populatePosClients();
  }
  
  showToast('✅ Client ajouté avec succès', 'success');
}

// Ajouter une nouvelle vente depuis l'interface
function addNewSale() {
  const client = prompt('Nom du client:');
  const montant = parseInt(prompt('Montant de la vente:'));
  const produits = prompt('Produits vendus:');
  
  if (!client || isNaN(montant) || !produits) {
    showToast('⚠️ Veuillez remplir tous les champs correctement', 'error');
    return;
  }
  
  const venteData = {
    num: 'V-' + String(Date.now()).slice(-6),
    client: sanitizeInput(client),
    produits: sanitizeInput(produits),
    montant: montant,
    date: new Date().toISOString().slice(0, 10),
    type: 'vente',
    statut: 'Payée',
    remise: 0
  };
  
  if (typeof addVenteToFirebase === 'function') {
    addVenteToFirebase(venteData);
  } else {
    showToast('❌ Fonction d\'enregistrement non disponible', 'error');
  }
}

// Ajouter un nouveau fournisseur depuis l'interface
function addNewSupplier() {
  const nom = prompt('Nom du fournisseur:');
  const contact = prompt('Contact (Nom Téléphone):');
  const produits = prompt('Produits (séparés par des virgules):');
  const delai = prompt('Délai de livraison:');
  
  if (!nom || !contact || !produits || !delai) {
    showToast('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }
  
  const fournisseurData = {
    nom: sanitizeInput(nom),
    contact: sanitizeInput(contact),
    produits: produits.split(',').map(p => sanitizeInput(p.trim())),
    delai: sanitizeInput(delai),
    cmdYTD: 0,
    note: '5.0⭐',
    statut: 'Actif'
  };
  
  if (typeof addFournisseurToFirebase === 'function') {
    addFournisseurToFirebase(fournisseurData);
  } else {
    showToast('❌ Fonction d\'enregistrement non disponible', 'error');
  }
}

// Ajouter une nouvelle livraison depuis l'interface
function addNewDelivery() {
  const client = prompt('Nom du client:');
  const livreur = prompt('Nom du livreur:');
  const km = parseInt(prompt('Distance en km:'));
  
  if (!client || !livreur || isNaN(km)) {
    showToast('⚠️ Veuillez remplir tous les champs correctement', 'error');
    return;
  }
  
  const livraisonData = {
    num: 'LIV-' + String(Date.now()).slice(-6),
    client: sanitizeInput(client),
    livreur: sanitizeInput(livreur),
    date: new Date().toISOString().slice(0, 10),
    km: km,
    statut: 'En préparation'
  };
  
  if (typeof addLivraisonToFirebase === 'function') {
    addLivraisonToFirebase(livraisonData);
  } else {
    showToast('❌ Fonction d\'enregistrement non disponible', 'error');
  }
}

// Ajouter une opération comptable depuis l'interface
function addNewAccountingEntry() {
  const libelle = prompt('Libellé de l\'opération:');
  const categorie = prompt('Catégorie (CA/Achats/Transport/Services):');
  const type = prompt('Type (recette/depense):');
  const montant = parseInt(prompt('Montant:'));
  
  if (!libelle || !categorie || !type || isNaN(montant)) {
    showToast('⚠️ Veuillez remplir tous les champs correctement', 'error');
    return;
  }
  
  const comptaData = {
    date: new Date().toISOString().slice(0, 10),
    libelle: sanitizeInput(libelle),
    categorie: sanitizeInput(categorie),
    type: sanitizeInput(type),
    montant: montant
  };
  
  if (typeof addComptaToFirebase === 'function') {
    addComptaToFirebase(comptaData);
  } else {
    showToast('❌ Fonction d\'enregistrement non disponible', 'error');
  }
}

// Rendre les fonctions globales
window.addNewProduct = addNewProduct;
window.addNewClient = addNewClient;
window.addNewSale = addNewSale;
window.addNewSupplier = addNewSupplier;
window.addNewDelivery = addNewDelivery;
window.addNewAccountingEntry = addNewAccountingEntry;
function doLogout() {
  showConfirm('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', '🚪', ok => {
    if (!ok) return;
    localStorage.removeItem('sam_session');
    UI.currentUser = null;

    const loginPage = document.getElementById('loginPage');
    const appEl     = document.getElementById('app');
    if (appEl)     appEl.classList.add('hidden');
    if (loginPage) loginPage.style.display = '';

    showToast('👋 À bientôt !', 'info');
  });
}

/** Animation shake sur un input invalide */
function shakeInput(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  el.style.borderColor = '#e74c3c';
  setTimeout(() => {
    el.style.animation   = '';
    el.style.borderColor = '';
  }, 1500);
}

/* Injecte le keyframe shake si absent */
(function injectShakeKeyframe() {
  if (document.getElementById('shake-kf')) return;
  const s = document.createElement('style');
  s.id = 'shake-kf';
  s.textContent =
    '@keyframes shake {' +
    '0%,100%{transform:translateX(0)}' +
    '20%{transform:translateX(-8px)}' +
    '40%{transform:translateX(8px)}' +
    '60%{transform:translateX(-5px)}' +
    '80%{transform:translateX(5px)}' +
    '}';
  document.head.appendChild(s);
})();

/* ──────────────────────────────────────────────────────────────
4. NAVIGATION
────────────────────────────────────────────────────────────── */

/**
 * Change de page
 * @param {string} pageId  - identifiant de la page (ex: 'dashboard')
 * @param {HTMLElement} [btn] - bouton sidebar cliqué (optionnel)
 */
function nav(pageId, btn) {
  // Désactive tous les items sidebar
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));

  // Active le bon item
  if (btn) {
    btn.classList.add('active');
  } else {
    const target = document.querySelector(`[data-page="${pageId}"]`);
    if (target) target.classList.add('active');
  }

  // Masque toutes les pages, affiche la bonne
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');

  UI.currentPage = pageId;

  // Met à jour le titre du header
  const titleEl = document.getElementById('pageTitle');
  const dateEl  = document.getElementById('pageDate');
  if (titleEl) {
    titleEl.innerHTML = `${escapeHtml(UI.pageTitles[pageId] || pageId)} `;
    if (dateEl) titleEl.appendChild(dateEl);
  }

  // Met à jour le libellé du bouton principal
  const actionBtn = document.getElementById('mainActionBtn');
  if (actionBtn) actionBtn.textContent = UI.pageActions[pageId] || '+ Nouveau';

  // Déclenche le rendu spécifique à la page si app.js le fournit
  const renderFn = `render${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`;
  if (typeof window[renderFn] === 'function') window[renderFn]();

  // Cas spécial : rapports → init graphiques
  if (pageId === 'rapports' && typeof renderRapports === 'function') renderRapports();

  // Ferme la sidebar sur mobile si nécessaire
  closeSidebarMobile();
}

/** Ferme la sidebar en mode mobile */
function closeSidebarMobile() {
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('open');
  }
}

/* ──────────────────────────────────────────────────────────────
5. ACTION BOUTON PRINCIPAL (handleAction)
────────────────────────────────────────────────────────────── */

/** Action du bouton principal du header selon la page courante */
function handleAction() {
  switch (UI.currentPage) {
    case 'stocks':
      if (typeof addNewProduct === 'function') addNewProduct();
      else if (typeof openNewStock === 'function') openNewStock();
      else openGenericModal('Entrée de stock', buildStockForm());
      break;
    case 'clients':
      if (typeof addNewClient === 'function') addNewClient();
      else if (typeof openNewClient === 'function') openNewClient();
      else openGenericModal('Nouveau client', buildClientForm());
      break;
    case 'ventes':
      if (typeof addNewSaleEntry === 'function') addNewSaleEntry();
      else if (typeof addNewSale === 'function') addNewSale();
      else if (typeof openNewVente === 'function') openNewVente();
      else openGenericModal('Nouvelle commande', buildVenteForm());
      break;
    case 'fournisseurs':
      if (typeof addNewSupplier === 'function') addNewSupplier();
      else if (typeof addNewSupplier === 'function') addNewSupplier();
      else if (typeof openNewFourn === 'function') openNewFourn();
      else openGenericModal('Nouveau fournisseur', buildFournisseurForm());
      break;
    case 'livraisons':
      if (typeof addNewDelivery === 'function') addNewDelivery();
      else if (typeof openNewLivraison === 'function') openNewLivraison();
      else openGenericModal('Nouvelle tournée', buildLivraisonForm());
      break;
    case 'comptabilite':
      if (typeof addNewAccountingEntry === 'function') addNewAccountingEntry();
      else if (typeof openNewCompta === 'function') openNewCompta();
      else openGenericModal('Nouvelle opération', buildComptaForm());
      break;
    case 'equipe':
      openAffectModal();
      break;
    case 'rapports':
      exportData();
      break;
    case 'parametres':
      saveSettings();
      break;
    case 'caisse':
      showVenteHistory();
      break;
    default:
      showToast('ℹ️ Action non disponible pour cette page', 'info');
  }
}

/* ──────────────────────────────────────────────────────────────
6. SYSTÈME DE TOASTS
────────────────────────────────────────────────────────────── */

/**
 * Affiche un toast
 * @param {string} msg
 * @param {'success'|'error'|'warn'|'info'} [type]
 * @param {number} [duration]
 */
function showToast(msg, type = 'success', duration = 3500) {
  const zone = document.getElementById('toastZone');
  if (!zone) return;

  const colors = {
    success: { bg: '#2E7D32', icon: '✅' },
    error  : { bg: '#C62828', icon: '❌' },
    warn   : { bg: '#F57F17', icon: '⚠️' },
    info   : { bg: '#1565C0', icon: 'ℹ️' },
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.className = 'sam-toast';
  toast.style.cssText =
    'display:flex;align-items:center;gap:10px;' +
    `background:${c.bg};color:white;` +
    'padding:12px 18px;border-radius:12px;' +
    'font-size:13px;font-weight:500;' +
    'box-shadow:0 6px 24px rgba(0,0,0,0.25);' +
    'animation:toastIn 0.3s ease;cursor:pointer;' +
    'max-inline-size:360px;word-break:break-word;';
  toast.innerHTML = `<span style="font-size:16px">${escapeHtml(c.icon)}</span><span>${escapeHtml(msg)}</span>`;
  toast.addEventListener('click', () => removeToast(toast));

  zone.appendChild(toast);

  const timer = setTimeout(() => removeToast(toast), duration);
  toast._timer = timer;
}

function removeToast(toast) {
  clearTimeout(toast._timer);
  toast.style.animation = 'toastOut 0.3s ease forwards';
  setTimeout(() => toast.remove(), 300);
}

/* Keyframes toasts */
(function injectToastKeyframes() {
  if (document.getElementById('toast-kf')) return;
  const s = document.createElement('style');
  s.id = 'toast-kf';
  s.textContent =
    '#toastZone{position:fixed;inset-block-end:24px;inset-inline-end:24px;z-index:99999;' +
    'display:flex;flex-direction:column;gap:8px;align-items:flex-end}' +
    '@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}' +
    '@keyframes toastOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(40px)}}';
  document.head.appendChild(s);
})();

/* ──────────────────────────────────────────────────────────────
7. MODALE GÉNÉRIQUE
────────────────────────────────────────────────────────────── */

/**
 * Ouvre la modale générique (titre + contenu HTML + footer optionnel)
 */
function openModal(title, bodyHTML, footerHTML = '') {
  const overlay  = document.getElementById('modalOverlay');
  const titleEl  = document.getElementById('modalTitle');
  const bodyEl   = document.getElementById('modalBody');
  const footerEl = document.getElementById('modalFooter');

  if (!overlay) return;

  if (titleEl)  titleEl.innerHTML  = title;
  if (bodyEl)   bodyEl.innerHTML   = bodyHTML;
  if (footerEl) footerEl.innerHTML = footerHTML;

  overlay.classList.add('open');
  overlay.style.display = 'flex';
}

/** Alias pratique */
function openGenericModal(title, bodyHTML, footerHTML) {
  openModal(title, bodyHTML, footerHTML);
}

/** Ferme la modale générique */
function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.style.display = 'none';
  }
}

/* ──────────────────────────────────────────────────────────────
8. MODALE DE CONFIRMATION
────────────────────────────────────────────────────────────── */

/**
 * Affiche une boîte de confirmation
 * @param {string}   title
 * @param {string}   msg
 * @param {string}   icon
 * @param {Function} callback  - cb(true) si confirmé, cb(false) sinon
 */
function showConfirm(title, msg, icon, callback) {
  UI.confirmCb = callback;

  const overlay = document.getElementById('confirmOverlay');
  const titleEl = document.getElementById('confirmTitle');
  const msgEl   = document.getElementById('confirmMsg');
  const iconEl  = document.getElementById('confirmIcon');

  if (titleEl) titleEl.textContent = title;
  if (msgEl)   msgEl.textContent   = msg;
  if (iconEl)  iconEl.textContent  = icon || '⚠️';

  if (overlay) overlay.style.display = 'flex';
}

/** Appelé par les boutons Annuler / Confirmer de la boîte de confirmation */
function closeConfirm(result) {
  const overlay = document.getElementById('confirmOverlay');
  if (overlay) overlay.style.display = 'none';
  if (typeof UI.confirmCb === 'function') {
    UI.confirmCb(result);
    UI.confirmCb = null;
  }
}

/* ──────────────────────────────────────────────────────────────
9. NOTIFICATIONS
────────────────────────────────────────────────────────────── */

/** Affiche le panneau de notifications */
function showNotifs() {
  const notifs = UI.notifList.length
    ? UI.notifList
        .map(n => `<div style="padding:10px 0;border-block-end:1px solid #f0f0f0;font-size:13px">${n}</div>`)
        .join('')
    : '<div style="text-align:center;color:#aaa;padding:24px;font-size:13px">Aucune notification</div>';

  openModal('🔔 Notifications', notifs);

  // Efface le point rouge
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = 'none';
}

/**
 * Ajoute une notification
 * @param {string} msg
 */
function addNotif(msg) {
  UI.notifList.unshift(msg);
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = 'block';
}

/* ──────────────────────────────────────────────────────────────
10. FILTRES DE TABLEAUX
────────────────────────────────────────────────────────────── */

/**
 * Filtre générique sur un tbody par texte
 * @param {string} tbodyId
 * @param {string} query
 */
function filterTbl(tbodyId, query) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const q = query.toLowerCase().trim();
  Array.from(tbody.rows).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

/** Filtre le tableau des stocks par catégorie */
function filterStockCat(cat) {
  const tbody = document.getElementById('stock-tbody');
  if (!tbody) return;
  Array.from(tbody.rows).forEach(row => {
    row.style.display = !cat || row.cells[1]?.textContent.includes(cat) ? '' : 'none';
  });
}

/** Filtre les ventes par statut */
function filterVentesStatut(statut) {
  const tbody = document.getElementById('ventes-tbody');
  if (!tbody) return;
  Array.from(tbody.rows).forEach(row => {
    row.style.display = !statut || row.textContent.includes(statut) ? '' : 'none';
  });
}

/** Filtre les ventes par type (commande / vente directe) */
function filterVentesType(type, btn) {
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const tbody = document.getElementById('ventes-tbody');
  if (!tbody) return;
  Array.from(tbody.rows).forEach(row => {
    row.style.display = !type || row.dataset.type === type ? '' : 'none';
  });
}

/** Filtre les clients par type */
function filterClientsType(type) {
  const tbody = document.getElementById('clients-tbody');
  if (!tbody) return;
  Array.from(tbody.rows).forEach(row => {
    row.style.display = !type || row.textContent.includes(type) ? '' : 'none';
  });
}

/** Filtre la comptabilité (recettes / dépenses) */
function filterCompta(type) {
  const tbody = document.getElementById('compta-tbody');
  if (!tbody) return;
  Array.from(tbody.rows).forEach(row => {
    row.style.display = !type || row.dataset.type === type ? '' : 'none';
  });
}

/* ──────────────────────────────────────────────────────────────
11. FORMULAIRES INTÉGRÉS (fallback si app.js absent)
────────────────────────────────────────────────────────────── */

function buildStockForm() {
  return `
  <div class="form-grid" style="padding:4px 0">
    <div class="form-group">
      <label class="form-label">Produit *</label>
      <select class="form-input" id="f-stock-produit">
        <option value="">Sélectionner…</option>
        <option>🥚 Œufs (plateau)</option>
        <option>🐓 Poulet chair (tête)</option>
        <option>🐓 Poulet fermier (tête)</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Quantité *</label>
      <input class="form-input" type="number" id="f-stock-qty" min="1" placeholder="0">
    </div>
    <div class="form-group">
      <label class="form-label">Fournisseur</label>
      <input class="form-input" id="f-stock-fourn" placeholder="Nom du fournisseur">
    </div>
    <div class="form-group">
      <label class="form-label">Prix unitaire (FCFA)</label>
      <input class="form-input" type="number" id="f-stock-prix" min="0" placeholder="0">
    </div>
    <div class="form-group">
      <label class="form-label">Date de péremption</label>
      <input class="form-input" type="date" id="f-stock-exp">
    </div>
    <div class="form-group">
      <label class="form-label">Note</label>
      <input class="form-input" id="f-stock-note" placeholder="Optionnel">
    </div>
  </div>`;
}

function buildClientForm() {
  return `
  <div class="form-grid" style="padding:4px 0">
    <div class="form-group full">
      <label class="form-label">Nom complet *</label>
      <input class="form-input" id="f-cl-nom" placeholder="ex : Kouassi Jean">
    </div>
    <div class="form-group">
      <label class="form-label">Téléphone *</label>
      <input class="form-input" id="f-cl-tel" type="tel" placeholder="+225 07 00 00 00 00">
    </div>
    <div class="form-group">
      <label class="form-label">Type</label>
      <select class="form-input" id="f-cl-type">
        <option>Particulier</option>
        <option>Revendeur</option>
        <option>Restaurant</option>
        <option>Hôtel</option>
        <option>Supermarché</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input class="form-input" id="f-cl-email" type="email" placeholder="email@domaine.com">
    </div>
    <div class="form-group">
      <label class="form-label">Adresse</label>
      <input class="form-input" id="f-cl-adresse" placeholder="Quartier / Commune">
    </div>
    <div class="form-group">
      <label class="form-label">Solde crédit (FCFA)</label>
      <input class="form-input" id="f-cl-solde" type="number" value="0">
    </div>
  </div>`;
}

function buildVenteForm() {
  return `
  <div class="form-grid" style="padding:4px 0">
    <div class="form-group full">
      <label class="form-label">Client *</label>
      <input class="form-input" id="f-v-client" placeholder="Nom du client">
    </div>
    <div class="form-group">
      <label class="form-label">Produit</label>
      <select class="form-input" id="f-v-produit">
        <option>🥚 Œufs (plateau)</option>
        <option>🐓 Poulet chair</option>
        <option>🐓 Poulet fermier</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Quantité</label>
      <input class="form-input" type="number" id="f-v-qty" min="1" value="1">
    </div>
    <div class="form-group">
      <label class="form-label">Montant total (FCFA)</label>
      <input class="form-input" type="number" id="f-v-montant" min="0">
    </div>
    <div class="form-group">
      <label class="form-label">Date de livraison</label>
      <input class="form-input" type="date" id="f-v-date">
    </div>
    <div class="form-group">
      <label class="form-label">Statut</label>
      <select class="form-input" id="f-v-statut">
        <option>En cours</option>
        <option>Préparée</option>
        <option>Livrée</option>
        <option>Payée</option>
      </select>
    </div>
  </div>`;
}

function buildFournisseurForm() {
  return `
  <div class="form-grid" style="padding:4px 0">
    <div class="form-group full">
      <label class="form-label">Nom *</label>
      <input class="form-input" id="f-fo-nom" placeholder="ex : Ferme Konan & Frères">
    </div>
    <div class="form-group">
      <label class="form-label">Téléphone *</label>
      <input class="form-input" id="f-fo-tel" type="tel" placeholder="+225 05 00 00 00 00">
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input class="form-input" id="f-fo-email" type="email">
    </div>
    <div class="form-group">
      <label class="form-label">Produits fournis</label>
      <input class="form-input" id="f-fo-produits" placeholder="ex : Œufs, Poulets">
    </div>
    <div class="form-group">
      <label class="form-label">Délai livraison (jours)</label>
      <input class="form-input" id="f-fo-delai" type="number" min="0" value="2">
    </div>
    <div class="form-group">
      <label class="form-label">Note qualité (/10)</label>
      <input class="form-input" id="f-fo-note" type="number" min="0" max="10" value="8">
    </div>
  </div>`;
}

function buildLivraisonForm() {
  return `
  <div class="form-grid" style="padding:4px 0">
    <div class="form-group">
      <label class="form-label">Livreur *</label>
      <input class="form-input" id="f-li-livreur" placeholder="Nom du livreur">
    </div>
    <div class="form-group">
      <label class="form-label">Véhicule</label>
      <input class="form-input" id="f-li-vehicule" placeholder="ex : Moto, Camion">
    </div>
    <div class="form-group full">
      <label class="form-label">Clients à livrer</label>
      <textarea class="form-input" id="f-li-clients" rows="3" placeholder="Un client par ligne"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Heure de départ</label>
      <input class="form-input" id="f-li-heure" type="time">
    </div>
    <div class="form-group">
      <label class="form-label">Statut</label>
      <select class="form-input" id="f-li-statut">
        <option>En attente</option>
        <option>En route</option>
        <option>Livrée</option>
      </select>
    </div>
  </div>`;
}

function buildComptaForm() {
  return `
  <div class="form-grid" style="padding:4px 0">
    <div class="form-group full">
      <label class="form-label">Libellé *</label>
      <input class="form-input" id="f-co-libelle" placeholder="ex : Achat poussins">
    </div>
    <div class="form-group">
      <label class="form-label">Type</label>
      <select class="form-input" id="f-co-type">
        <option value="recette">💰 Recette</option>
        <option value="depense">💸 Dépense</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Catégorie</label>
      <select class="form-input" id="f-co-cat">
        <option>Ventes</option>
        <option>Approvisionnement</option>
        <option>Salaires</option>
        <option>Transport</option>
        <option>Loyer</option>
        <option>Divers</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Montant (FCFA) *</label>
      <input class="form-input" type="number" id="f-co-montant" min="0" placeholder="0">
    </div>
    <div class="form-group">
      <label class="form-label">Date</label>
      <input class="form-input" type="date" id="f-co-date">
    </div>
  </div>`;
}

/* ──────────────────────────────────────────────────────────────
12. MODULE ÉQUIPE
────────────────────────────────────────────────────────────── */

/** Ouvre la modale d’affectation de l’équipe */
function openAffectModal() {
  const employees = JSON.parse(localStorage.getItem('sam_employees') || '[]');

  if (!employees.length) {
    showToast('⚠️ Aucun employé. Ajoutez-en via le bouton ➕ Nouveau', 'warn');
    return;
  }

  const rows = employees
    .map(
      e => `
      <tr>
        <td><strong>${escHtml(e.name)}</strong></td>
        <td>${escHtml(e.role)}</td>
        <td>
          <select class="form-select" data-emp-id="${e.id}" style="font-size:12px;padding:5px 8px;border-radius:8px;border:1.5px solid var(--border)">
            <option value="online"  ${e.status === 'online'  ? 'selected' : ''}>🟢 En ligne</option>
            <option value="away"    ${e.status === 'away'    ? 'selected' : ''}>🟡 En déplacement</option>
            <option value="offline" ${e.status === 'offline' ? 'selected' : ''}>⚫ Hors-ligne</option>
          </select>
        </td>
      </tr>`
    )
    .join('');

  const body = `
    <p style="font-size:13px;color:var(--text3);margin-block-end:14px">
      Définissez le statut de chaque membre pour aujourd'hui.
    </p>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead>
          <tr><th>Nom</th><th>Rôle</th><th>Statut</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  const footer = `
    <button class="header-btn primary" onclick="saveAffectations()">✅ Enregistrer</button>
    <button class="header-btn" onclick="closeModal()">Annuler</button>`;

  openModal('✏️ Affecter l\'équipe du jour', body, footer);
}

/** Sauvegarde les affectations */
function saveAffectations() {
  const employees = JSON.parse(localStorage.getItem('sam_employees') || '[]');
  document.querySelectorAll('[data-emp-id]').forEach(sel => {
    const id  = parseInt(sel.dataset.empId, 10);
    const emp = employees.find(e => e.id === id);
    if (emp) emp.status = sel.value;
  });
  localStorage.setItem('sam_employees', JSON.stringify(employees));
  closeModal();
  refreshEquipe();
  showToast('✅ Affectations enregistrées', 'success');
}

/** Rafraîchit l’affichage de l’équipe */
function refreshEquipe() {
  if (typeof renderEquipe === 'function') {
    renderEquipe();
    return;
  }
  // Fallback UI minimal si app.js absent
  const grid = document.getElementById('equipeGrid');
  if (!grid) return;

  const employees = JSON.parse(localStorage.getItem('sam_employees') || '[]');

  if (!employees.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--text3);font-size:13px">
        <div style="font-size:32px;margin-block-end:8px">👥</div>
        Aucun employé enregistré.<br>
        Cliquez sur <strong>➕ Nouveau</strong> pour ajouter des membres.
      </div>`;
    return;
  }

  grid.innerHTML = employees
    .map(emp => {
      const isGerant = emp.role.toLowerCase().includes('gérant') || emp.role.toLowerCase().includes('admin');
      const cls      = isGerant ? 'gerant' : 'livreur';
      const initiales = emp.name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      const statusDot = { online: '🟢', away: '🟡', offline: '⚫' }[emp.status] || '⚫';
      return `
        <div class="membre-card ${cls}">
          <div class="membre-avatar">
            ${initiales}
            <div class="membre-status-dot ${emp.status || 'offline'}"></div>
          </div>
          <div class="membre-info">
            <div class="membre-nom">${escHtml(emp.name)}</div>
            <div class="membre-role-tag">${isGerant ? '👑' : '🚚'} ${escHtml(emp.role)}</div>
            <div class="membre-meta">${statusDot} ${statusLabel(emp.status)}</div>
          </div>
        </div>`;
    })
    .join('');

  // Mise à jour compteurs footer
  const online  = employees.filter(e => e.status === 'online').length;
  const away    = employees.filter(e => e.status === 'away').length;
  const offline = employees.filter(e => e.status === 'offline').length;

  const foOnline  = document.getElementById('footer-online');
  const foAway    = document.getElementById('footer-away');
  const foOffline = document.getElementById('footer-offline');
  if (foOnline)  foOnline.textContent  = online;
  if (foAway)    foAway.textContent    = away;
  if (foOffline) foOffline.textContent = offline;

  // KPI Équipe
  const gerant = employees.find(
    e => e.role.toLowerCase().includes('gérant') && e.status === 'online'
  );
  const kpiGerantNom = document.getElementById('kpi-gerant-nom');
  if (kpiGerantNom) kpiGerantNom.textContent = gerant ? gerant.name : '—';

  const kpiLivreurs = document.getElementById('kpi-livreurs-actifs');
  if (kpiLivreurs) {
    kpiLivreurs.textContent = employees.filter(
      e => e.role.toLowerCase().includes('livreur') && e.status !== 'offline'
    ).length;
  }

  // Label date équipe
  const labelEl = document.getElementById('equipeDateLabel');
  if (labelEl) {
    const d = new Date();
    labelEl.textContent = d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }
}

function statusLabel(status) {
  return (
    {
      online : 'En ligne',
      away   : 'En déplacement',
      offline: 'Hors-ligne',
    }[status] || 'Inconnu'
  );
}

/** Ajoute un employé (appelé depuis la modale empModal) */
function addEmployee(employee) {
  const list = JSON.parse(localStorage.getItem('sam_employees') || '[]');
  list.push(employee);
  localStorage.setItem('sam_employees', JSON.stringify(list));
  refreshEquipe();
}

/* ──────────────────────────────────────────────────────────────
13. PARAMÈTRES
────────────────────────────────────────────────────────────── */

/** Sauvegarde les paramètres de l’entreprise */
function saveSettings() {
  const fields = [
    'set-nom',
    'set-rc',
    'set-tel',
    'set-email',
    'set-addr',
    'set-seuil-oeufs',
    'set-seuil-poulets',
  ];
  const settings = {};
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) settings[id] = el.value;
  });
  localStorage.setItem('sam_settings', JSON.stringify(settings));
  showToast('✅ Paramètres enregistrés', 'success');
}

/** Charge les paramètres sauvegardés */
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('sam_settings') || '{}');
    Object.entries(s).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
  } catch (_) {
    // ignore
  }
}

/* ──────────────────────────────────────────────────────────────
14. EXPORT
────────────────────────────────────────────────────────────── */

/**
 * Export basique : impression ou téléchargement JSON
 */
function exportData() {
  const page = UI.currentPage;

  if (page === 'rapports') {
    showToast('🖨️ Ouverture de l\'aperçu impression…', 'info');
    setTimeout(() => window.print(), 400);
    return;
  }

  // Export JSON générique des données localStorage
  const data = {
    exportedAt: new Date().toISOString(),
    page,
    employees: JSON.parse(localStorage.getItem('sam_employees') || '[]'),
    settings : JSON.parse(localStorage.getItem('sam_settings') || '{}'),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `samci-export-${page}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Export téléchargé', 'success');
}

/* ──────────────────────────────────────────────────────────────
15. CAISSE — UTILITAIRES UI
────────────────────────────────────────────────────────────── */

/** Calcule et affiche la monnaie à rendre */
function calcMonnaie() {
  const totalEl   = document.getElementById('grandTotal');
  const inputEl   = document.getElementById('paymentInput');
  const monnaieEl = document.getElementById('monnaieDisplay');
  const monnaieV  = document.getElementById('monnaieVal');

  if (!totalEl || !inputEl) return;

  const total = parseFCFA(totalEl.textContent);
  const recu  = parseFloat(inputEl.value) || 0;
  const rendu = recu - total;

  if (monnaieEl) monnaieEl.style.display = recu > 0 ? 'block' : 'none';
  if (monnaieV)  monnaieV.textContent = Math.max(0, rendu).toLocaleString('fr-FR');
  if (monnaieEl) {
    monnaieEl.style.color = rendu < 0 ? 'var(--red)' : 'var(--green-dark)';
  }
}

/** Affiche l’historique des ventes */
function showVenteHistory() {
  const sales = JSON.parse(localStorage.getItem('sam_sales') || '[]');
  if (!sales.length) {
    openModal(
      '🧾 Historique des ventes',
      '<div style="text-align:center;padding:32px;color:#aaa">Aucune vente enregistrée</div>'
    );
    return;
  }

  const rows = sales
    .slice(-20)
    .reverse()
    .map(
      s => `
      <tr>
        <td>${new Date(s.date).toLocaleDateString('fr-FR')}</td>
        <td>${escHtml(s.client || '—')}</td>
        <td>${formatFCFA(s.total)}</td>
        <td><span class="badge b-green">Payée</span></td>
      </tr>`
    )
    .join('');

  openModal(
    '🧾 Historique des ventes',
    `
    <div class="tbl-wrap">
      <table class="tbl">
        <thead>
          <tr><th>Date</th><th>Client</th><th>Montant</th><th>Statut</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`
  );
}

/* ──────────────────────────────────────────────────────────────
16. UTILITAIRES
────────────────────────────────────────────────────────────── */

/**
 * Formate un nombre en FCFA
 * @param {number} n
 * @returns {string}
 */
function formatFCFA(n) {
  return (n || 0).toLocaleString('fr-FR') + ' FCFA';
}

/**
 * Parse un texte "1 234 FCFA" → 1234
 * @param {string} txt
 * @returns {number}
 */
function parseFCFA(txt) {
  return (
    parseFloat(
      (txt || '0')
        .replace(/\s/g, '')
        .replace('FCFA', '')
        .replace(',', '.')
    ) || 0
  );
}

/**
 * Échappe le HTML pour prévenir les injections
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Debounce léger
 * @param {Function} fn
 * @param {number} [ms]
 */
function debounce(fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

/* ──────────────────────────────────────────────────────────────
17. EXPOSITION GLOBALE
────────────────────────────────────────────────────────────── */

// Toutes les fonctions utilisées dans les onclick="" du HTML
// doivent être sur window pour être accessibles

Object.assign(window, {
  // Auth
  doLogin,
  doLogout,
  // Navigation
  nav,
  // Action principale
  handleAction,
  // Toasts
  showToast,
  // Modales
  openModal,
  openGenericModal,
  closeModal,
  // Confirmation
  showConfirm,
  closeConfirm,
  // Notifications
  showNotifs,
  addNotif,
  // Filtres
  filterTbl,
  filterStockCat,
  filterVentesStatut,
  filterVentesType,
  filterClientsType,
  filterCompta,
  // Équipe
  openAffectModal,
  saveAffectations,
  refreshEquipe,
  addEmployee,
  // Paramètres
  saveSettings,
  loadSettings,
  // Caisse
  calcMonnaie,
  showVenteHistory,
  // Export
  exportData,
  // Utilitaires publics
  formatFCFA,
  parseFCFA,
  escHtml,
  debounce,
  // Rapports (placeholder si app.js ne le définit pas)
  renderRapports: window.renderRapports || function () {},
});

// Chargement final des paramètres
loadSettings();

// Log de confirmation
console.log('%c✅ ui.js AVICO-PRO chargé', 'color:#2E7D32;font-weight:700;font-size:13px');
