/* ════════════════════════════════════════════════════════════════
   AVICO-PRO - SYNCHRONISATION FIREBASE COMPLÈTE
   Sauvegarde automatique de toutes les données dans Firebase
   ════════════════════════════════════════════════════════════════ */

// Importer les fonctions Firebase nécessaires
import { db, collection, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, limit } from './firebase.js';

class FirebaseSyncManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.lastSyncTime = null;
    this.syncInterval = 30000; // 30 secondes
    this.maxRetries = 3;
    this.retryCount = 0;
    
    this.init();
  }

  init() {
    console.log('🔥 Initialisation de la synchronisation Firebase...');
    
    // Écouter les changements de connexion
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
      console.log('🌐 Connexion rétablie - Synchronisation en cours...');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📵 Mode hors ligne - Données locales utilisées');
    });

    // Démarrer la synchronisation automatique
    this.startAutoSync();
    
    // Synchroniser au chargement
    this.syncAllData();
  }

  // ─── SYNCHRONISATION AUTOMATIQUE ───────────────────────────────────────
  startAutoSync() {
    setInterval(() => {
      if (this.isOnline) {
        this.syncAllData();
      }
    }, this.syncInterval);
  }

  // ─── SYNCHRONISATION COMPLÈTE ─────────────────────────────────────────
  async syncAllData() {
    if (!this.isOnline || !db) {
      console.warn('⚠️ Firebase non disponible ou hors ligne');
      return false;
    }

    try {
      console.log('🔄 Synchronisation complète avec Firebase...');
      
      // Synchroniser toutes les collections
      await Promise.all([
        this.syncProducts(),
        this.syncClients(),
        this.syncVentes(),
        this.syncStocks(),
        this.syncComptabilite(),
        this.syncFournisseurs(),
        this.syncLivraisons(),
        this.syncEmployes()
      ]);

      this.lastSyncTime = new Date();
      this.retryCount = 0;
      
      if (typeof showToast === 'function') {
        showToast('✅ Données synchronisées avec Firebase', 'success');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erreur de synchronisation:', error);
      this.handleSyncError(error);
      return false;
    }
  }

  // ─── SYNCHRONISATION PRODUITS ───────────────────────────────────────
  async syncProducts() {
    try {
      const productsRef = collection(db, 'Produits');
      const snapshot = await getDocs(productsRef);
      
      // Récupérer les données Firebase
      const firebaseProducts = [];
      snapshot.forEach(doc => {
        firebaseProducts.push({ id: doc.id, ...doc.data() });
      });

      // Fusionner avec les données locales
      const localProducts = window.DB?.produits || [];
      const mergedProducts = this.mergeData(localProducts, firebaseProducts, 'produits');
      
      // Mettre à jour les données locales
      if (window.DB) {
        window.DB.produits = mergedProducts;
      }

      // Sauvegarder les nouveaux produits locaux dans Firebase
      for (const product of localProducts) {
        if (!firebaseProducts.find(fp => fp.id === product.id)) {
          await addDoc(productsRef, product);
        }
      }

      console.log(`✅ ${mergedProducts.length} produits synchronisés`);
      return mergedProducts;
    } catch (error) {
      console.error('❌ Erreur synchronisation produits:', error);
      throw error;
    }
  }

  // ─── SYNCHRONISATION CLIENTS ───────────────────────────────────────
  async syncClients() {
    try {
      const clientsRef = collection(db, 'Clients');
      const snapshot = await getDocs(clientsRef);
      
      const firebaseClients = [];
      snapshot.forEach(doc => {
        firebaseClients.push({ id: doc.id, ...doc.data() });
      });

      const localClients = window.DB?.clients || [];
      const mergedClients = this.mergeData(localClients, firebaseClients, 'clients');
      
      if (window.DB) {
        window.DB.clients = mergedClients;
      }

      // Sauvegarder les nouveaux clients locaux dans Firebase
      for (const client of localClients) {
        if (!firebaseClients.find(fc => fc.id === client.id)) {
          await addDoc(clientsRef, client);
        }
      }

      console.log(`✅ ${mergedClients.length} clients synchronisés`);
      return mergedClients;
    } catch (error) {
      console.error('❌ Erreur synchronisation clients:', error);
      throw error;
    }
  }

  // ─── SYNCHRONISATION VENTES ───────────────────────────────────────
  async syncVentes() {
    try {
      const ventesRef = collection(db, 'Ventes');
      const snapshot = await getDocs(ventesRef);
      
      const firebaseVentes = [];
      snapshot.forEach(doc => {
        firebaseVentes.push({ id: doc.id, ...doc.data() });
      });

      const localVentes = window.DB?.ventes || [];
      const mergedVentes = this.mergeData(localVentes, firebaseVentes, 'ventes');
      
      if (window.DB) {
        window.DB.ventes = mergedVentes;
      }

      // Sauvegarder les nouvelles ventes locales dans Firebase
      for (const vente of localVentes) {
        if (!firebaseVentes.find(fv => fv.id === vente.id)) {
          await addDoc(ventesRef, vente);
        }
      }

      console.log(`✅ ${mergedVentes.length} ventes synchronisées`);
      return mergedVentes;
    } catch (error) {
      console.error('❌ Erreur synchronisation ventes:', error);
      throw error;
    }
  }

  // ─── SYNCHRONISATION STOCKS ───────────────────────────────────────
  async syncStocks() {
    try {
      const stocksRef = collection(db, 'Stocks');
      const snapshot = await getDocs(stocksRef);
      
      const firebaseStocks = [];
      snapshot.forEach(doc => {
        firebaseStocks.push({ id: doc.id, ...doc.data() });
      });

      const localStocks = window.DB?.stocks || [];
      const mergedStocks = this.mergeData(localStocks, firebaseStocks, 'stocks');
      
      if (window.DB) {
        window.DB.stocks = mergedStocks;
      }

      // Sauvegarder les nouveaux stocks locaux dans Firebase
      for (const stock of localStocks) {
        if (!firebaseStocks.find(fs => fs.id === stock.id)) {
          await addDoc(stocksRef, stock);
        }
      }

      console.log(`✅ ${mergedStocks.length} stocks synchronisés`);
      return mergedStocks;
    } catch (error) {
      console.error('❌ Erreur synchronisation stocks:', error);
      throw error;
    }
  }

  // ─── SYNCHRONISATION COMPTABILITÉ ───────────────────────────────────
  async syncComptabilite() {
    try {
      const comptaRef = collection(db, 'Comptabilite');
      const snapshot = await getDocs(comptaRef);
      
      const firebaseCompta = [];
      snapshot.forEach(doc => {
        firebaseCompta.push({ id: doc.id, ...doc.data() });
      });

      const localCompta = window.DB?.comptabilite || [];
      const mergedCompta = this.mergeData(localCompta, firebaseCompta, 'comptabilite');
      
      if (window.DB) {
        window.DB.comptabilite = mergedCompta;
      }

      // Sauvegarder les nouvelles opérations locales dans Firebase
      for (const operation of localCompta) {
        if (!firebaseCompta.find(fc => fc.id === operation.id)) {
          await addDoc(comptaRef, operation);
        }
      }

      console.log(`✅ ${mergedCompta.length} opérations comptables synchronisées`);
      return mergedCompta;
    } catch (error) {
      console.error('❌ Erreur synchronisation comptabilité:', error);
      throw error;
    }
  }

  // ─── SYNCHRONISATION FOURNISSEURS ───────────────────────────────────
  async syncFournisseurs() {
    try {
      const fournisseursRef = collection(db, 'Fournisseurs');
      const snapshot = await getDocs(fournisseursRef);
      
      const firebaseFournisseurs = [];
      snapshot.forEach(doc => {
        firebaseFournisseurs.push({ id: doc.id, ...doc.data() });
      });

      const localFournisseurs = window.DB?.fournisseurs || [];
      const mergedFournisseurs = this.mergeData(localFournisseurs, firebaseFournisseurs, 'fournisseurs');
      
      if (window.DB) {
        window.DB.fournisseurs = mergedFournisseurs;
      }

      console.log(`✅ ${mergedFournisseurs.length} fournisseurs synchronisés`);
      return mergedFournisseurs;
    } catch (error) {
      console.error('❌ Erreur synchronisation fournisseurs:', error);
      throw error;
    }
  }

  // ─── SYNCHRONISATION LIVRAISONS ─────────────────────────────────────
  async syncLivraisons() {
    try {
      const livraisonsRef = collection(db, 'Livraisons');
      const snapshot = await getDocs(livraisonsRef);
      
      const firebaseLivraisons = [];
      snapshot.forEach(doc => {
        firebaseLivraisons.push({ id: doc.id, ...doc.data() });
      });

      const localLivraisons = window.DB?.livraisons || [];
      const mergedLivraisons = this.mergeData(localLivraisons, firebaseLivraisons, 'livraisons');
      
      if (window.DB) {
        window.DB.livraisons = mergedLivraisons;
      }

      console.log(`✅ ${mergedLivraisons.length} livraisons synchronisées`);
      return mergedLivraisons;
    } catch (error) {
      console.error('❌ Erreur synchronisation livraisons:', error);
      throw error;
    }
  }

  // ─── SYNCHRONISATION EMPLOYÉS ───────────────────────────────────────
  async syncEmployes() {
    try {
      const employesRef = collection(db, 'Employes');
      const snapshot = await getDocs(employesRef);
      
      const firebaseEmployes = [];
      snapshot.forEach(doc => {
        firebaseEmployes.push({ id: doc.id, ...doc.data() });
      });

      const localEmployes = window.DB?.employes || [];
      const mergedEmployes = this.mergeData(localEmployes, firebaseEmployes, 'employes');
      
      if (window.DB) {
        window.DB.employes = mergedEmployes;
      }

      console.log(`✅ ${mergedEmployes.length} employés synchronisés`);
      return mergedEmployes;
    } catch (error) {
      console.error('❌ Erreur synchronisation employés:', error);
      throw error;
    }
  }

  // ─── FUSION DES DONNÉES ─────────────────────────────────────────────
  mergeData(localData, firebaseData, collectionName) {
    const merged = [...localData];
    const localIds = new Set(localData.map(item => item.id));
    
    // Ajouter les données Firebase qui n'existent pas localement
    firebaseData.forEach(firebaseItem => {
      if (!localIds.has(firebaseItem.id)) {
        merged.push(firebaseItem);
      }
    });

    // Sauvegarder localement
    localStorage.setItem(`avico_${collectionName}`, JSON.stringify(merged));
    
    return merged;
  }

  // ─── GESTION DES ERREURS ───────────────────────────────────────────
  handleSyncError(error) {
    this.retryCount++;
    
    if (this.retryCount < this.maxRetries) {
      console.log(`🔄 Tentative de resynchronisation (${this.retryCount}/${this.maxRetries})...`);
      setTimeout(() => {
        this.syncAllData();
      }, 5000 * this.retryCount); // Délai exponentiel
    } else {
      console.error('❌ Échec de synchronisation après plusieurs tentatives');
      if (typeof showToast === 'function') {
        showToast('❌ Erreur de synchronisation avec Firebase', 'error');
      }
    }
  }

  // ─── SYNCHRONISATION MANUELLE ───────────────────────────────────────
  async manualSync() {
    if (!this.isOnline) {
      if (typeof showToast === 'function') {
        showToast('📵 Hors ligne - Impossible de synchroniser', 'error');
      }
      return false;
    }

    if (typeof showToast === 'function') {
      showToast('🔄 Synchronisation manuelle en cours...', 'info');
    }

    return await this.syncAllData();
  }

  // ─── SAUVEGARDE IMMÉDIATE ───────────────────────────────────────────
  async saveToFirebase(collectionName, data) {
    if (!this.isOnline || !db) {
      this.addToSyncQueue(collectionName, data);
      return false;
    }

    try {
      const collectionRef = collection(db, collectionName);
      await addDoc(collectionRef, data);
      console.log(`✅ Donnée sauvegardée dans ${collectionName}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur sauvegarde dans ${collectionName}:`, error);
      this.addToSyncQueue(collectionName, data);
      return false;
    }
  }

  // ─── GESTION DE LA FILE D'ATTENTE ───────────────────────────────────
  addToSyncQueue(collectionName, data) {
    this.syncQueue.push({
      collection: collectionName,
      data: data,
      timestamp: new Date().toISOString()
    });
    
    console.log(`📋 Ajouté à la file d'attente: ${collectionName}`);
  }

  async processSyncQueue() {
    if (this.syncQueue.length === 0) return;

    console.log(`🔄 Traitement de ${this.syncQueue.length} éléments en attente...`);

    for (const item of this.syncQueue) {
      try {
        await this.saveToFirebase(item.collection, item.data);
        // Retirer de la file d'attente en cas de succès
        this.syncQueue = this.syncQueue.filter(q => q !== item);
      } catch (error) {
        console.error(`❌ Erreur traitement file d'attente:`, error);
      }
    }
  }

  // ─── STATUT DE SYNCHRONISATION ───────────────────────────────────────
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      lastSync: this.lastSyncTime,
      queueLength: this.syncQueue.length,
      retryCount: this.retryCount
    };
  }
}

// ─── INITIALISATION GLOBALE ───────────────────────────────────────────
let firebaseSyncManager;

function initializeFirebaseSync() {
  if (!firebaseSyncManager) {
    firebaseSyncManager = new FirebaseSyncManager();
    window.firebaseSyncManager = firebaseSyncManager;
    
    // Ajouter le bouton de synchronisation manuelle
    addSyncButton();
    
    console.log('🔥 Gestionnaire de synchronisation Firebase initialisé');
  }
}

function addSyncButton() {
  // Créer un bouton de synchronisation dans le header
  const header = document.querySelector('.header-right');
  if (header && !document.getElementById('sync-btn')) {
    const syncBtn = document.createElement('button');
    syncBtn.id = 'sync-btn';
    syncBtn.className = 'header-btn';
    syncBtn.innerHTML = '🔄 Sync';
    syncBtn.onclick = () => firebaseSyncManager.manualSync();
    syncBtn.title = 'Synchroniser avec Firebase';
    
    header.appendChild(syncBtn);
  }
}

// Fonctions globales pour utilisation dans l'application
window.syncToFirebase = async function(collectionName, data) {
  if (firebaseSyncManager) {
    return await firebaseSyncManager.saveToFirebase(collectionName, data);
  }
};

window.manualSync = async function() {
  if (firebaseSyncManager) {
    return await firebaseSyncManager.manualSync();
  }
};

window.getSyncStatus = function() {
  if (firebaseSyncManager) {
    return firebaseSyncManager.getSyncStatus();
  }
};

// Auto-initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebaseSync);
} else {
  initializeFirebaseSync();
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseSyncManager;
}
