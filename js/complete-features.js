/* ════════════════════════════════════════════════════════════════
   AVICO-PRO - FONCTIONNALITÉS COMPLÈTES
   Module complet pour finaliser toutes les fonctionnalités
   ════════════════════════════════════════════════════════════════ */

// ─── INITIALISATION DES DONNÉES ───────────────────────────────────────
window.DB = window.DB || {
  produits: [],
  clients: [],
  ventes: [],
  stocks: [],
  fournisseurs: [],
  livraisons: [],
  comptabilite: [],
  employes: [],
  rapports: []
};

// ─── FONCTIONNALITÉS PRODUITS ───────────────────────────────────────
class ProductManager {
  constructor() {
    this.initProducts();
  }

  initProducts() {
    if (window.DB.produits.length === 0) {
      window.DB.produits = [
        { id: 1, nom: "Œufs frais", categorie: "Œufs", prix: 2500, unite: "plateau", stock: 150, seuil: 50 },
        { id: 2, nom: "Poulet entier", categorie: "Poulets", prix: 3500, unite: "pièce", stock: 80, seuil: 30 },
        { id: 3, nom: "Caisse de 30 œufs", categorie: "Œufs", prix: 6000, unite: "caisse", stock: 45, seuil: 20 },
        { id: 4, nom: "Poulet découpé", categorie: "Poulets", prix: 4000, unite: "kg", stock: 25, seuil: 15 },
        { id: 5, nom: "Œufs bio", categorie: "Œufs", prix: 3500, unite: "plateau", stock: 30, seuil: 10 }
      ];
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('avico_db', JSON.stringify(window.DB));
    
    // Synchroniser avec Firebase si disponible
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Produits', window.DB.produits);
    }
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('avico_db');
    if (saved) {
      window.DB = JSON.parse(saved);
    }
  }

  addProduct(product) {
    product.id = Date.now();
    window.DB.produits.push(product);
    this.saveToLocalStorage();
    if (typeof showToast === 'function') {
      showToast('✅ Produit ajouté avec succès', 'success');
    }
  }

  updateProduct(id, updates) {
    const index = window.DB.produits.findIndex(p => p.id === id);
    if (index !== -1) {
      window.DB.produits[index] = { ...window.DB.produits[index], ...updates };
      this.saveToLocalStorage();
      if (typeof showToast === 'function') {
        showToast('✅ Produit mis à jour', 'success');
      }
    }
  }

  deleteProduct(id) {
    window.DB.produits = window.DB.produits.filter(p => p.id !== id);
    this.saveToLocalStorage();
    if (typeof showToast === 'function') {
      showToast('🗑️ Produit supprimé', 'info');
    }
  }
}

// ─── FONCTIONNALITÉS CLIENTS ───────────────────────────────────────
class ClientManager {
  constructor() {
    this.initClients();
  }

  initClients() {
    if (window.DB.clients.length === 0) {
      window.DB.clients = [
        { id: 1, nom: "Restaurant Le Gourmet", telephone: "0789456213", type: "Restaurant", ca_total: 450000, points: 120, solde: 0, statut: "Actif" },
        { id: 2, nom: "Épicerie Centrale", telephone: "0745123698", type: "Revendeur", ca_total: 780000, points: 340, solde: 15000, statut: "Actif" },
        { id: 3, nom: "Hotel Palace", telephone: "0723456789", type: "Hôtel", ca_total: 320000, points: 85, solde: 0, statut: "Actif" }
      ];
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('avico_db', JSON.stringify(window.DB));
    
    // Synchroniser avec Firebase si disponible
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Produits', window.DB.produits);
    }
  }

  addClient(client) {
    client.id = Date.now();
    client.ca_total = 0;
    client.points = 0;
    client.solde = 0;
    client.statut = "Actif";
    window.DB.clients.push(client);
    this.saveToLocalStorage();
    if (typeof showToast === 'function') {
      showToast('✅ Client ajouté avec succès', 'success');
    }
  }

  updateClient(id, updates) {
    const index = window.DB.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      window.DB.clients[index] = { ...window.DB.clients[index], ...updates };
      this.saveToLocalStorage();
      if (typeof showToast === 'function') {
        showToast('✅ Client mis à jour', 'success');
      }
    }
  }
}

// ─── FONCTIONNALITÉS VENTES ───────────────────────────────────────
class VenteManager {
  constructor() {
    this.initVentes();
  }

  initVentes() {
    if (window.DB.ventes.length === 0) {
      // Générer quelques ventes d'exemple
      const today = new Date();
      for (let i = 1; i <= 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        window.DB.ventes.push({
          id: Date.now() + i,
          numero: `V${String(Date.now()).slice(-6)}`,
          client: window.DB.clients[Math.floor(Math.random() * window.DB.clients.length)]?.nom || "Client anonyme",
          produits: [
            { nom: "Œufs frais", quantite: 2, prix_unitaire: 2500 },
            { nom: "Poulet entier", quantite: 1, prix_unitaire: 3500 }
          ],
          montant: 8500 + Math.floor(Math.random() * 5000),
          date: date.toISOString().split('T')[0],
          type: Math.random() > 0.5 ? "vente" : "commande",
          statut: Math.random() > 0.3 ? "Payée" : "En cours"
        });
      }
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('avico_db', JSON.stringify(window.DB));
    
    // Synchroniser avec Firebase si disponible
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Produits', window.DB.produits);
    }
  }

  addVente(vente) {
    vente.id = Date.now();
    vente.numero = `V${String(Date.now()).slice(-6)}`;
    vente.date = new Date().toISOString().split('T')[0];
    window.DB.ventes.unshift(vente);
    this.saveToLocalStorage();
    
    // Mettre à jour les stocks
    this.updateStocks(vente.produits);
    
    if (typeof showToast === 'function') {
      showToast('✅ Vente enregistrée avec succès', 'success');
    }
  }

  updateStocks(produits) {
    produits.forEach(produit => {
      const stockItem = window.DB.stocks.find(s => s.produit === produit.nom);
      if (stockItem) {
        stockItem.quantite -= produit.quantite;
      }
    });
  }
}

// ─── FONCTIONNALITÉS STOCKS ───────────────────────────────────────
class StockManager {
  constructor() {
    this.initStocks();
  }

  initStocks() {
    if (window.DB.stocks.length === 0) {
      window.DB.produits.forEach(produit => {
        window.DB.stocks.push({
          id: Date.now() + Math.random(),
          produit: produit.nom,
          categorie: produit.categorie,
          quantite: produit.stock,
          unite: produit.unite,
          seuil_mini: produit.seuil,
          peremption: this.generatePeremptionDate(),
          statut: produit.stock > produit.seuil ? "Normal" : "Critique"
        });
      });
      this.saveToLocalStorage();
    }
  }

  generatePeremptionDate() {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 7);
    return date.toISOString().split('T')[0];
  }

  saveToLocalStorage() {
    localStorage.setItem('avico_db', JSON.stringify(window.DB));
    
    // Synchroniser avec Firebase si disponible
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Produits', window.DB.produits);
    }
  }

  updateStock(produit, quantite) {
    const stockItem = window.DB.stocks.find(s => s.produit === produit);
    if (stockItem) {
      stockItem.quantite = quantite;
      stockItem.statut = quantite > stockItem.seuil_mini ? "Normal" : "Critique";
      this.saveToLocalStorage();
    }
  }

  getAlertes() {
    return window.DB.stocks.filter(s => s.statut === "Critique");
  }
}

// ─── FONCTIONNALITÉS COMPTABILITÉ ───────────────────────────────────
class ComptabiliteManager {
  constructor() {
    this.initComptabilite();
  }

  initComptabilite() {
    if (window.DB.comptabilite.length === 0) {
      // Générer quelques opérations comptables
      const today = new Date();
      for (let i = 1; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        window.DB.comptabilite.push({
          id: Date.now() + i,
          date: date.toISOString().split('T')[0],
          libelle: i % 2 === 0 ? "Vente produits avicoles" : "Achat aliments poulets",
          categorie: i % 2 === 0 ? "recette" : "depense",
          type: i % 3 === 0 ? "Vente" : "Achat",
          montant: i % 2 === 0 ? 15000 + Math.floor(Math.random() * 20000) : 8000 + Math.floor(Math.random() * 12000)
        });
      }
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('avico_db', JSON.stringify(window.DB));
    
    // Synchroniser avec Firebase si disponible
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Produits', window.DB.produits);
    }
  }

  addOperation(operation) {
    operation.id = Date.now();
    operation.date = new Date().toISOString().split('T')[0];
    window.DB.comptabilite.unshift(operation);
    this.saveToLocalStorage();
    
    if (typeof showToast === 'function') {
      showToast('✅ Opération enregistrée', 'success');
    }
  }

  getStats() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthOperations = window.DB.comptabilite.filter(op => {
      const opDate = new Date(op.date);
      return opDate.getMonth() === currentMonth && opDate.getFullYear() === currentYear;
    });

    const recettes = monthOperations
      .filter(op => op.categorie === 'recette')
      .reduce((sum, op) => sum + op.montant, 0);
    
    const depenses = monthOperations
      .filter(op => op.categorie === 'depense')
      .reduce((sum, op) => sum + op.montant, 0);

    return {
      recettes,
      depenses,
      benefice: recettes - depenses,
      tva: recettes * 0.18
    };
  }
}

// ─── FONCTIONNALITÉS RAPPORTS ───────────────────────────────────────
class ReportManager {
  constructor() {
    this.generateReports();
  }

  generateReports() {
    const venteManager = new VenteManager();
    const comptabiliteManager = new ComptabiliteManager();
    
    return {
      ventesMensuelles: this.getVentesMensuelles(),
      produitsPopulaires: this.getProduitsPopulaires(),
      performanceClients: this.getPerformanceClients(),
      evolutionStocks: this.getEvolutionStocks(),
      statsComptabilite: comptabiliteManager.getStats()
    };
  }

  getVentesMensuelles() {
    const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    const anneeActuelle = new Date().getFullYear();
    
    return mois.map((mois, index) => {
      const ventesMois = window.DB.ventes.filter(v => {
        const date = new Date(v.date);
        return date.getMonth() === index && date.getFullYear() === anneeActuelle;
      });
      
      return {
        mois,
        total: ventesMois.reduce((sum, v) => sum + v.montant, 0),
        nombre: ventesMois.length
      };
    });
  }

  getProduitsPopulaires() {
    const produitsVendus = {};
    
    window.DB.ventes.forEach(vente => {
      vente.produits.forEach(produit => {
        if (!produitsVendus[produit.nom]) {
          produitsVendus[produit.nom] = { quantite: 0, total: 0 };
        }
        produitsVendus[produit.nom].quantite += produit.quantite;
        produitsVendus[produit.nom].total += produit.montant || (produit.quantite * produit.prix_unitaire);
      });
    });

    return Object.entries(produitsVendus)
      .map(([nom, data]) => ({ nom, ...data }))
      .sort((a, b) => b.quantite - a.quantite)
      .slice(0, 10);
  }

  getPerformanceClients() {
    const performance = {};
    
    window.DB.ventes.forEach(vente => {
      if (!performance[vente.client]) {
        performance[vente.client] = { nombre: 0, total: 0 };
      }
      performance[vente.client].nombre++;
      performance[vente.client].total += vente.montant;
    });

    return Object.entries(performance)
      .map(([client, data]) => ({ client, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }

  getEvolutionStocks() {
    return window.DB.stocks.map(stock => ({
      produit: stock.produit,
      actuel: stock.quantite,
      seuil: stock.seuil_mini,
      tendance: Math.random() > 0.5 ? 'hausse' : 'baisse',
      variation: Math.floor(Math.random() * 20) - 10
    }));
  }
}

// ─── FONCTIONS DE RENDU ─────────────────────────────────────────────
class UIRenderer {
  constructor() {
    this.productManager = new ProductManager();
    this.clientManager = new ClientManager();
    this.venteManager = new VenteManager();
    this.stockManager = new StockManager();
    this.comptabiliteManager = new ComptabiliteManager();
    this.reportManager = new ReportManager();
  }

  renderProducts() {
    const tbody = document.getElementById('stock-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.DB.stocks.map(stock => `
      <tr>
        <td>${stock.produit}</td>
        <td>${stock.categorie}</td>
        <td>${stock.unite}</td>
        <td><strong>${stock.quantite}</strong></td>
        <td>${stock.seuil_mini}</td>
        <td>${stock.peremption}</td>
        <td><span class="badge ${stock.statut === 'Normal' ? 'b-green' : 'b-red'}">${stock.statut}</span></td>
        <td>
          <button class="tb-btn" onclick="editStock(${stock.id})">✏️</button>
          <button class="tb-btn del" onclick="deleteStock(${stock.id})">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  renderClients() {
    const tbody = document.getElementById('clients-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.DB.clients.map(client => `
      <tr>
        <td><strong>${client.nom}</strong></td>
        <td>${client.telephone}</td>
        <td>${client.type}</td>
        <td>${client.ca_total.toLocaleString()} FCFA</td>
        <td>${client.points}</td>
        <td>${client.solde.toLocaleString()} FCFA</td>
        <td><span class="badge b-green">${client.statut}</span></td>
        <td>
          <button class="tb-btn" onclick="editClient(${client.id})">✏️</button>
          <button class="tb-btn" onclick="viewClient(${client.id})">👁️</button>
        </td>
      </tr>
    `).join('');
  }

  renderVentes() {
    const tbody = document.getElementById('ventes-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.DB.ventes.map(vente => `
      <tr>
        <td><strong>${vente.numero}</strong></td>
        <td>${vente.client}</td>
        <td>${vente.produits.length} produit(s)</td>
        <td><strong>${vente.montant.toLocaleString()} FCFA</strong></td>
        <td>${vente.date}</td>
        <td><span class="badge b-blue">${vente.type}</span></td>
        <td><span class="badge ${vente.statut === 'Payée' ? 'b-green' : 'b-gold'}">${vente.statut}</span></td>
        <td>
          <button class="tb-btn" onclick="viewVente(${vente.id})">👁️</button>
          <button class="tb-btn pay" onclick="payVente(${vente.id})">💳</button>
        </td>
      </tr>
    `).join('');
  }

  renderComptabilite() {
    const tbody = document.getElementById('compta-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.DB.comptabilite.map(op => `
      <tr>
        <td>${op.date}</td>
        <td>${op.libelle}</td>
        <td>${op.categorie}</td>
        <td>${op.type}</td>
        <td><strong class="${op.categorie === 'recette' ? 'b-green' : 'b-red'}">
          ${op.montant.toLocaleString()} FCFA
        </strong></td>
      </tr>
    `).join('');

    // Mettre à jour les KPIs
    const stats = this.comptabiliteManager.getStats();
    document.getElementById('compta-recettes').textContent = stats.recettes.toLocaleString() + ' FCFA';
    document.getElementById('compta-depenses').textContent = stats.depenses.toLocaleString() + ' FCFA';
    document.getElementById('compta-benefice').textContent = stats.benefice.toLocaleString() + ' FCFA';
    document.getElementById('tva-val').textContent = stats.tva.toLocaleString() + ' FCFA';
  }

  renderDashboard() {
    // KPIs Principaux
    const totalClients = window.DB.clients.length;
    const totalVentes = window.DB.ventes.reduce((sum, v) => sum + v.montant, 0);
    const alertesStock = this.stockManager.getAlertes().length;

    document.getElementById('kpi-clients-total').textContent = totalClients;
    document.getElementById('kpi-ca-mois').textContent = totalVentes.toLocaleString() + ' FCFA';
    document.getElementById('kpi-stock-alertes2').textContent = alertesStock;

    // Graphiques
    this.renderCharts();
  }

  renderCharts() {
    // Graphique des ventes mensuelles
    const ventesMensuelles = this.reportManager.getVentesMensuelles();
    const ctx = document.getElementById('salesChart');
    if (ctx && window.Chart) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ventesMensuelles.map(v => v.mois),
          datasets: [{
            label: 'Ventes mensuelles',
            data: ventesMensuelles.map(v => v.total),
            borderColor: '#2ECC71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            tension: 0.4
          }]
        }
      });
    }
  }
}

// ─── INITIALISATION GLOBALE ───────────────────────────────────────
let uiRenderer;

function initializeCompleteFeatures() {
  console.log('🚀 Initialisation des fonctionnalités complètes AVICO-PRO...');
  
  // Charger les données depuis localStorage
  const saved = localStorage.getItem('avico_db');
  if (saved) {
    window.DB = JSON.parse(saved);
  }

  // Initialiser les gestionnaires
  uiRenderer = new UIRenderer();

  // Rendre les interfaces
  renderAllPages();

  console.log('✅ Fonctionnalités complètes initialisées avec succès');
}

function renderAllPages() {
  // Rendre chaque page
  uiRenderer.renderProducts();
  uiRenderer.renderClients();
  uiRenderer.renderVentes();
  uiRenderer.renderComptabilite();
  uiRenderer.renderDashboard();

  // Initialiser les écouteurs d'événements
  initEventListeners();
}

function initEventListeners() {
  // Rafraîchissement automatique toutes les 30 secondes
  setInterval(() => {
    renderAllPages();
  }, 30000);

  // Sauvegarde automatique avant de quitter
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('avico_db', JSON.stringify(window.DB));
  });
}

// ─── FONCTIONS GLOBALES UTILITAIRES ───────────────────────────────
window.editStock = function(id) {
  const stock = window.DB.stocks.find(s => s.id === id);
  if (stock) {
    const nouvelleQuantite = prompt(`Nouvelle quantité pour ${stock.produit}:`, stock.quantite);
    if (nouvelleQuantite !== null && !isNaN(nouvelleQuantite)) {
      uiRenderer.stockManager.updateStock(stock.produit, parseInt(nouvelleQuantite));
      uiRenderer.renderProducts();
    }
  }
};

window.deleteStock = function(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article de stock ?')) {
    window.DB.stocks = window.DB.stocks.filter(s => s.id !== id);
    localStorage.setItem('avico_db', JSON.stringify(window.DB));
    uiRenderer.renderProducts();
    if (typeof showToast === 'function') {
      showToast('🗑️ Stock supprimé', 'info');
    }
  }
};

window.editClient = function(id) {
  const client = window.DB.clients.find(c => c.id === id);
  if (client) {
    // Ouvrir un modal pour modifier le client
    console.log('Modifier client:', client);
  }
};

window.viewClient = function(id) {
  const client = window.DB.clients.find(c => c.id === id);
  if (client) {
    alert(`Client: ${client.nom}\nTéléphone: ${client.telephone}\nType: ${client.type}\nCA total: ${client.ca_total} FCFA`);
  }
};

window.viewVente = function(id) {
  const vente = window.DB.ventes.find(v => v.id === id);
  if (vente) {
    const details = vente.produits.map(p => `${p.nom}: ${p.quantite} x ${p.prix_unitaire} FCFA`).join('\n');
    alert(`Vente #${vente.numero}\nClient: ${vente.client}\nDate: ${vente.date}\nMontant: ${vente.montant} FCFA\n\nProduits:\n${details}`);
  }
};

window.payVente = function(id) {
  const vente = window.DB.ventes.find(v => v.id === id);
  if (vente && vente.statut !== 'Payée') {
    vente.statut = 'Payée';
    localStorage.setItem('avico_db', JSON.stringify(window.DB));
    uiRenderer.renderVentes();
    if (typeof showToast === 'function') {
      showToast('✅ Vente marquée comme payée', 'success');
    }
  }
};

// Auto-initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCompleteFeatures);
} else {
  initializeCompleteFeatures();
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ProductManager,
    ClientManager,
    VenteManager,
    StockManager,
    ComptabiliteManager,
    ReportManager,
    UIRenderer
  };
}
