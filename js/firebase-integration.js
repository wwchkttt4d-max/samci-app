/* ════════════════════════════════════════════════════════════════
   AVICO-PRO - INTÉGRATION FIREBASE AMÉLIORÉE
   Intégration complète avec tous les modules existants
   ════════════════════════════════════════════════════════════════ */

// Importer le gestionnaire de synchronisation
import { FirebaseSyncManager } from './firebase-sync.js';

// Étendre les classes existantes pour inclure la synchronisation Firebase
class EnhancedProductManager {
  constructor(originalManager) {
    this.original = originalManager;
  }

  saveToFirebase() {
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Produits', window.DB.produits);
    }
  }

  addProduct(product) {
    const result = this.original.addProduct(product);
    this.saveToFirebase();
    return result;
  }

  updateProduct(id, updates) {
    const result = this.original.updateProduct(id, updates);
    this.saveToFirebase();
    return result;
  }

  deleteProduct(id) {
    const result = this.original.deleteProduct(id);
    this.saveToFirebase();
    return result;
  }
}

class EnhancedClientManager {
  constructor(originalManager) {
    this.original = originalManager;
  }

  saveToFirebase() {
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Clients', window.DB.clients);
    }
  }

  addClient(client) {
    const result = this.original.addClient(client);
    this.saveToFirebase();
    return result;
  }

  updateClient(id, updates) {
    const result = this.original.updateClient(id, updates);
    this.saveToFirebase();
    return result;
  }
}

class EnhancedVenteManager {
  constructor(originalManager) {
    this.original = originalManager;
  }

  saveToFirebase() {
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Ventes', window.DB.ventes);
    }
  }

  addVente(vente) {
    const result = this.original.addVente(vente);
    this.saveToFirebase();
    return result;
  }
}

class EnhancedStockManager {
  constructor(originalManager) {
    this.original = originalManager;
  }

  saveToFirebase() {
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Stocks', window.DB.stocks);
    }
  }

  updateStock(produit, quantite) {
    const result = this.original.updateStock(produit, quantite);
    this.saveToFirebase();
    return result;
  }
}

class EnhancedComptabiliteManager {
  constructor(originalManager) {
    this.original = originalManager;
  }

  saveToFirebase() {
    if (window.firebaseSyncManager) {
      window.firebaseSyncManager.saveToFirebase('Comptabilite', window.DB.comptabilite);
    }
  }

  addOperation(operation) {
    const result = this.original.addOperation(operation);
    this.saveToFirebase();
    return result;
  }
}

// ─── INTÉGRATION AVEC LE SYSTÈME POS ───────────────────────────────────────
class EnhancedPOSSystem {
  constructor(originalPOS) {
    this.original = originalPOS;
  }

  validateSale() {
    const result = this.original.validateSale();
    
    // Synchroniser la vente avec Firebase
    if (window.firebaseSyncManager && window.DB.ventes.length > 0) {
      const lastVente = window.DB.ventes[0];
      window.firebaseSyncManager.saveToFirebase('Ventes', [lastVente]);
    }
    
    return result;
  }

  saveQuote() {
    const result = this.original.saveQuote();
    
    // Synchroniser le devis avec Firebase
    if (window.firebaseSyncManager && window.DB.devis && window.DB.devis.length > 0) {
      const lastDevis = window.DB.devis[0];
      window.firebaseSyncManager.saveToFirebase('Devis', [lastDevis]);
    }
    
    return result;
  }
}

// ─── FONCTION D'INITIALISATION ─────────────────────────────────────────────
function initializeFirebaseIntegration() {
  console.log('🔥 Initialisation de l\'intégration Firebase...');

  // Attendre que tous les modules soient chargés
  setTimeout(() => {
    if (window.uiRenderer) {
      // Remplacer les gestionnaires par les versions améliorées
      if (window.uiRenderer.productManager) {
        window.uiRenderer.productManager = new EnhancedProductManager(window.uiRenderer.productManager);
      }
      
      if (window.uiRenderer.clientManager) {
        window.uiRenderer.clientManager = new EnhancedClientManager(window.uiRenderer.clientManager);
      }
      
      if (window.uiRenderer.venteManager) {
        window.uiRenderer.venteManager = new EnhancedVenteManager(window.uiRenderer.venteManager);
      }
      
      if (window.uiRenderer.stockManager) {
        window.uiRenderer.stockManager = new EnhancedStockManager(window.uiRenderer.stockManager);
      }
      
      if (window.uiRenderer.comptabiliteManager) {
        window.uiRenderer.comptabiliteManager = new EnhancedComptabiliteManager(window.uiRenderer.comptabiliteManager);
      }

      console.log('✅ Gestionnaires améliorés avec Firebase');
    }

    // Intégrer avec le système POS
    if (window.posSystem) {
      window.posSystem = new EnhancedPOSSystem(window.posSystem);
      console.log('✅ Système POS amélioré avec Firebase');
    }

    // Ajouter des indicateurs de synchronisation
    addSyncIndicators();

    // Synchronisation initiale
    if (window.firebaseSyncManager) {
      setTimeout(() => {
        window.firebaseSyncManager.syncAllData();
      }, 2000);
    }

  }, 1000);
}

// ─── INDICATEURS DE SYNCHRONISATION ───────────────────────────────────────
function addSyncIndicators() {
  // Ajouter un indicateur de statut de synchronisation
  const statusDiv = document.createElement('div');
  statusDiv.id = 'sync-status';
  statusDiv.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: white;
    border: 2px solid var(--green);
    border-radius: 12px;
    padding: 12px 16px;
    box-shadow: var(--shadow);
    z-index: 1000;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: var(--transition);
  `;
  
  statusDiv.innerHTML = `
    <span id="sync-icon">🔄</span>
    <span id="sync-text">Synchronisation...</span>
  `;
  
  document.body.appendChild(statusDiv);

  // Mettre à jour le statut périodiquement
  setInterval(updateSyncStatus, 5000);
}

function updateSyncStatus() {
  if (!window.firebaseSyncManager) return;

  const status = window.firebaseSyncManager.getSyncStatus();
  const icon = document.getElementById('sync-icon');
  const text = document.getElementById('sync-text');
  const statusDiv = document.getElementById('sync-status');

  if (status.isOnline) {
    if (status.lastSync) {
      const timeAgo = getTimeAgo(status.lastSync);
      icon.textContent = '✅';
      text.textContent = `Sync: ${timeAgo}`;
      statusDiv.style.borderColor = 'var(--green)';
    } else {
      icon.textContent = '🔄';
      text.textContent = 'Synchronisation...';
      statusDiv.style.borderColor = 'var(--gold)';
    }
  } else {
    icon.textContent = '📵';
    text.textContent = 'Hors ligne';
    statusDiv.style.borderColor = 'var(--red)';
  }

  if (status.queueLength > 0) {
    text.textContent += ` (${status.queueLength} en attente)`;
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'à l\'instant';
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`;
  return `il y a ${Math.floor(seconds / 86400)}j`;
}

// ─── ÉCOUTEURS D'ÉVÉNEMENTS ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser l'intégration après le chargement complet
  setTimeout(initializeFirebaseIntegration, 2000);
});

// Écouter les changements de connexion pour mettre à jour l'interface
window.addEventListener('online', () => {
  if (typeof showToast === 'function') {
    showToast('🌐 Connexion rétablie - Synchronisation automatique', 'success');
  }
});

window.addEventListener('offline', () => {
  if (typeof showToast === 'function') {
    showToast('📵 Mode hors ligne - Données locales utilisées', 'warn');
  }
});

// ─── EXPORTS ───────────────────────────────────────────────────────────────
export {
  EnhancedProductManager,
  EnhancedClientManager,
  EnhancedVenteManager,
  EnhancedStockManager,
  EnhancedComptabiliteManager,
  EnhancedPOSSystem,
  initializeFirebaseIntegration
};

// Auto-initialisation
if (typeof window !== 'undefined') {
  window.initializeFirebaseIntegration = initializeFirebaseIntegration;
}
