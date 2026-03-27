/* ══════════════════════════════════════════
   AVICO-PRO — Firebase Integration
   Configuration et fonctions de synchronisation
══════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, query, orderBy, limit, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTSsajA7ClPXnYBERAeTD8ZVNSgrlil-w",
  authDomain: "samci-avicole.firebaseapp.com",
  projectId: "samci-avicole",
  storageBucket: "samci-avicole.firebasestorage.app",
  messagingSenderId: "453007633274",
  appId: "1:453007633274:web:2c2812f95854c3c0c9c4c3",
  measurementId: "G-1JY3JHD1T7"
};

// Initialiser Firebase avec gestion d'erreurs
let app, db, auth;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('✅ Firebase initialisé avec succès');
} catch (error) {
  console.error('❌ Erreur initialisation Firebase:', error);
  // Fonctions de secours si Firebase échoue
  window.firebaseError = true;
}

// Export des instances pour utilisation dans app.js
export { db, auth, collection, onSnapshot, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, query, orderBy, limit, where };

// Fonctions de synchronisation
export async function syncAllData() {
  // Vérifier si Firebase est disponible
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, utilisation des données locales');
    createDemoData();
    return false;
  }
  
  try {
    console.log('🔄 Synchronisation avec Firebase...');
    
    // Synchroniser les stocks avec données réelles
    const stocksSnapshot = await getDocs(collection(db, 'Stocks'));
    const firebaseStocks = [];
    stocksSnapshot.forEach(doc => {
      firebaseStocks.push({ id: doc.id, ...doc.data() });
    });
    
    // Synchroniser les ventes
    const ventesSnapshot = await getDocs(collection(db, 'Sales'));
    const firebaseVentes = [];
    ventesSnapshot.forEach(doc => {
      firebaseVentes.push({ id: doc.id, ...doc.data() });
    });
    
    // Synchroniser les clients
    const clientsSnapshot = await getDocs(collection(db, 'Clients'));
    const firebaseClients = [];
    clientsSnapshot.forEach(doc => {
      firebaseClients.push({ id: doc.id, ...doc.data() });
    });
    
    // Mettre à jour la base locale
    if (typeof window !== 'undefined' && window.DB) {
      window.DB.stocks = firebaseStocks.length > 0 ? firebaseStocks : window.DB.stocks;
      window.DB.ventes = firebaseVentes.length > 0 ? firebaseVentes : window.DB.ventes;
      window.DB.clients = firebaseClients.length > 0 ? firebaseClients : window.DB.clients;
      
      console.log('📊 Données synchronisées:');
      console.log('  - Stocks:', window.DB.stocks.length);
      console.log('  - Ventes:', window.DB.ventes.length);
      console.log('  - Clients:', window.DB.clients.length);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur de synchronisation:', error);
    // En cas d'erreur, créer des données de démonstration
    if (typeof window !== 'undefined' && window.DB) {
      console.log('📝 Création des données de démonstration...');
      createDemoData();
    }
    return false;
  }
}

// Fonction pour créer des données de démonstration si Firebase est vide
function createDemoData() {
  if (!window.DB) return;
  
  // Ajouter des stocks de démonstration
  const demoStocks = [
    { id: 1001, produit: 'Œufs blancs frais', categorie: 'Œufs', unite: 'Plateau 30', qte: 250, seuil: 100, prixDetail: 2000, prixGros: 1800, icone: '🥚', peremption: '2026-04-15' },
    { id: 1002, produit: 'Œufs marron fermiers', categorie: 'Œufs', unite: 'Plateau 30', qte: 180, seuil: 80, prixDetail: 2500, prixGros: 2200, icone: '🥚', peremption: '2026-04-20' },
    { id: 1003, produit: 'Poulets entiers', categorie: 'Poulets', unite: 'Tête', qte: 85, seuil: 30, prixDetail: 3500, prixGros: 3200, icone: '🐓', peremption: '2026-04-10' },
    { id: 1004, produit: 'Poulets découpés', categorie: 'Poulets', unite: 'Kg', qte: 45, seuil: 20, prixDetail: 4500, prixGros: 4200, icone: '🍗', peremption: '2026-04-12' }
  ];
  
  // Ajouter des clients de démonstration
  const demoClients = [
    { id: 2001, nom: 'Restaurant Le Gourmet', type: 'Restaurant', tel: '07 12 34 56 78', ca: 850000, solde: 125000, points: 85, statut: 'Actif' },
    { id: 2002, nom: 'Supermarché Proxima', type: 'Supermarché', tel: '07 20 12 34 56', ca: 1200000, solde: 450000, points: 120, statut: 'Actif' },
    { id: 2003, nom: 'Hôtel Ivoire Palace', type: 'Hôtel', tel: '07 21 45 67 89', ca: 2100000, solde: 890000, points: 210, statut: 'Actif' },
    { id: 2004, nom: 'Marché Central', type: 'Revendeur', tel: '07 08 98 76 54', ca: 650000, solde: 78000, points: 65, statut: 'Actif' }
  ];
  
  // Ajouter des ventes de démonstration
  const demoVentes = [
    { id: 3001, num: 'V-2024-001', client: 'Restaurant Le Gourmet', clientId: '2001', produits: '10 plt Œufs blancs + 5 têtes poulets', montant: 37500, date: '2024-03-24', type: 'vente', statut: 'Payée', remise: 0 },
    { id: 3002, num: 'V-2024-002', client: 'Supermarché Proxima', clientId: '2002', produits: '25 plt Œufs marron + 12 têtes poulets', montant: 85000, date: '2024-03-24', type: 'vente', statut: 'Payée', remise: 2000 },
    { id: 3003, num: 'V-2024-003', client: 'Hôtel Ivoire Palace', clientId: '2003', produits: '40 plt Œufs blancs + 20 têtes poulets', montant: 125000, date: '2024-03-23', type: 'vente', statut: 'Payée', remise: 5000 }
  ];
  
  // Mettre à jour la base locale
  window.DB.stocks = [...window.DB.stocks, ...demoStocks];
  window.DB.clients = [...window.DB.clients, ...demoClients];
  window.DB.ventes = [...window.DB.ventes, ...demoVentes];
  
  console.log('📝 Données de démonstration créées:', {
    stocks: demoStocks.length,
    clients: demoClients.length,
    ventes: demoVentes.length
  });
}

export function watchStocks() {
  // Vérifier si Firebase est disponible
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, surveillance stocks désactivée');
    return Promise.resolve(); // ✅ Retourner une Promise résolue
  }
  
  const stocksCollection = collection(db, 'Stocks');
  
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(stocksCollection, 
      (snapshot) => {
        try {
          let lastUpdatedStock = null;
          
          snapshot.docChanges().forEach((change) => {
            const stockData = { id: change.doc.id, ...change.doc.data() };
            lastUpdatedStock = stockData;
            
            if (change.type === 'added') {
              console.log('📦 Nouveau stock ajouté:', stockData);
              if (typeof window !== 'undefined' && window.DB && window.DB.stocks) {
                const existingIndex = window.DB.stocks.findIndex(s => s.id === change.doc.id);
                if (existingIndex === -1) {
                  window.DB.stocks.push(stockData);
                }
              }
            }
            
            if (change.type === 'modified') {
              console.log('📝 Stock modifié:', stockData);
              if (typeof window !== 'undefined' && window.DB && window.DB.stocks) {
                const existingIndex = window.DB.stocks.findIndex(s => s.id === change.doc.id);
                if (existingIndex !== -1) {
                  window.DB.stocks[existingIndex] = stockData;
                }
              }
            }
            
            if (change.type === 'removed') {
              console.log('🗑️ Stock supprimé:', stockData);
              if (typeof window !== 'undefined' && window.DB && window.DB.stocks) {
                window.DB.stocks = window.DB.stocks.filter(s => s.id !== change.doc.id);
              }
            }
          });
          
          // Mettre à jour l'interface
          if (typeof renderStocks === 'function') renderStocks();
          if (typeof populatePosProducts === 'function') populatePosProducts();
          if (typeof renderDashboard === 'function') renderDashboard();
          
          // Notification
          if ('Notification' in window && Notification.permission === 'granted' && lastUpdatedStock) {
            new Notification('📦 AVICO-PRO', {
              body: `Stock mis à jour: ${lastUpdatedStock.produit}`,
              icon: '/favicon.ico'
            });
          }
          
          resolve(); // ✅ Succès
        } catch (error) {
          console.error('❌ Erreur dans watchStocks:', error);
          reject(error); // ❌ Erreur
        }
      },
      (error) => {
        console.error('❌ Erreur Firebase watchStocks:', error);
        reject(new Error(`Firebase surveillance stocks: ${error.message || error}`)); // ❌ Erreur Firebase
      }
    );
    
    // Retourner la fonction unsubscribe pour pouvoir arrêter l'écoute
    resolve(unsubscribe);
  });
}

// ── SYNCHRONISATION TEMPS RÉEL COMPLÈTE ───────────────────────────────
export function enableRealTimeSync() {
  // Vérifier si Firebase est disponible
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, synchronisation temps réel désactivée');
    return;
  }
  
  console.log('🔄 Activation synchronisation temps réel complète...');
  
  // Ventes - mise à jour instantanée
  try {
    onSnapshot(collection(db, 'Sales'), (snapshot) => {
      const ventes = [];
      snapshot.forEach(doc => {
        ventes.push({ id: doc.id, ...doc.data() });
      });
      
      // Fusionner avec les ventes locales au lieu de remplacer
      if (window.DB && window.DB.ventes) {
        // Garder les ventes locales qui ne sont pas encore sur Firebase
        const localVentes = window.DB.ventes.filter(v => !v.id || v.id.toString().startsWith('local_'));
        // Ajouter les ventes de Firebase
        const firebaseVentes = ventes.filter(v => v.id && !v.id.toString().startsWith('local_'));
        // Fusionner
        window.DB.ventes = [...firebaseVentes, ...localVentes];
      } else {
        window.DB.ventes = ventes;
      }
      
      if (typeof renderVentes === 'function') renderVentes();
      if (typeof renderDashboard === 'function') renderDashboard();
      
      console.log('💰 Ventes synchronisées en temps réel:', ventes.length);
      console.log('📊 Total ventes après fusion:', window.DB.ventes.length);
    });
  } catch (error) {
    console.error('❌ Erreur synchronisation ventes temps réel:', error);
  }

  // Clients - mise à jour instantanée
  onSnapshot(collection(db, 'Clients'), (snapshot) => {
    const clients = [];
    snapshot.forEach(doc => {
      clients.push({ id: doc.id, ...doc.data() });
    });
    window.DB.clients = clients;
    
    if (typeof renderClients === 'function') renderClients();
    if (typeof populatePosClients === 'function') populatePosClients();
    
    console.log('👥 Clients synchronisés en temps réel:', clients.length);
  });
}

export async function saveStockToFirebase(stockData) {
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, vente locale uniquement');
    return { id: 'local_' + Date.now() };
  }
  
  try {
    const docRef = await addDoc(collection(db, 'Stocks'), stockData);
    console.log('✅ Stock sauvegardé sur Firebase:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('❌ Erreur sauvegarde stock Firebase:', error);
    return { id: 'local_' + Date.now() };
  }
}

export async function saveVenteToFirebase(venteData) {
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, vente locale uniquement');
    return { id: 'local_' + Date.now() };
  }
  
  try {
    const docRef = await addDoc(collection(db, 'Sales'), venteData);
    console.log('✅ Vente sauvegardée sur Firebase:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('❌ Erreur sauvegarde vente Firebase:', error);
    return { id: 'local_' + Date.now() };
  }
}

export async function saveClientToFirebase(clientData) {
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, client local uniquement');
    return { id: 'local_' + Date.now() };
  }
  
  try {
    const docRef = await addDoc(collection(db, 'Clients'), clientData);
    console.log('✅ Client sauvegardé sur Firebase:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('❌ Erreur sauvegarde client Firebase:', error);
    return { id: 'local_' + Date.now() };
  }
}

export async function saveEmployeeToFirebase(employeeData) {
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, employé local uniquement');
    return false;
  }
  
  try {
    await addDoc(collection(db, 'Employees'), {
      ...employeeData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Employé enregistré dans Firebase');
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement employé:', error);
    return false;
  }
}

export async function saveFournisseurToFirebase(fournisseurData) {
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, fournisseur local uniquement');
    return false;
  }
  
  try {
    await addDoc(collection(db, 'Fournisseurs'), fournisseurData);
    console.log('✅ Fournisseur enregistré dans Firebase');
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement fournisseur:', error);
    return false;
  }
}

export async function saveLivraisonToFirebase(livraisonData) {
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, livraison locale uniquement');
    return false;
  }
  
  try {
    await addDoc(collection(db, 'Livraisons'), livraisonData);
    console.log('✅ Livraison enregistrée dans Firebase');
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement livraison:', error);
    return false;
  }
}

export async function saveComptaToFirebase(comptaData) {
  if (window.firebaseError || !db) {
    console.warn('⚠️ Firebase non disponible, compta locale uniquement');
    return false;
  }
  
  try {
    await addDoc(collection(db, 'Comptabilite'), comptaData);
    console.log('✅ Opération comptabilité enregistrée dans Firebase');
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement comptabilité:', error);
    return false;
  }
}

console.log('🔥 Module Firebase AVICO-PRO chargé avec gestion d\'erreurs');
