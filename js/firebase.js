/* ══════════════════════════════════════════
   SAM-CI — Firebase Integration
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

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export des instances pour utilisation dans app.js
export { db, auth, collection, onSnapshot, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, query, orderBy, limit, where };

// Fonctions de synchronisation
export async function syncAllData() {
  try {
    console.log('🔄 Synchronisation avec Firebase...');
    
    // Synchroniser les stocks avec données réelles
    const stocksSnapshot = await getDocs(collection(db, 'Stocks'));
    const firebaseStocks = stocksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Synchroniser les clients avec données réelles
    const clientsSnapshot = await getDocs(collection(db, 'Clients'));
    const firebaseClients = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Synchroniser les ventes avec données réelles
    const ventesSnapshot = await getDocs(collection(db, 'Ventes'));
    const firebaseVentes = ventesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Mettre à jour la base locale DB si elle existe
    if (typeof window !== 'undefined' && window.DB) {
      window.DB.stocks = firebaseStocks.length > 0 ? firebaseStocks : window.DB.stocks;
      window.DB.clients = firebaseClients.length > 0 ? firebaseClients : window.DB.clients;
      window.DB.ventes = firebaseVentes.length > 0 ? firebaseVentes : window.DB.ventes;
      
      console.log('✅ Données synchronisées:', {
        stocks: firebaseStocks.length,
        clients: firebaseClients.length,
        ventes: firebaseVentes.length
      });
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
  const stocksCollection = collection(db, 'Stocks');
  
  onSnapshot(stocksCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const stockData = { id: change.doc.id, ...change.doc.data() };
      
      if (change.type === 'added') {
        console.log('📦 Nouveau stock ajouté:', stockData);
        // Ajouter à la base locale si elle existe
        if (typeof window !== 'undefined' && window.DB && window.DB.stocks) {
          const existingIndex = window.DB.stocks.findIndex(s => s.id === change.doc.id);
          if (existingIndex === -1) {
            window.DB.stocks.push(stockData);
          }
        }
      }
      
      if (change.type === 'modified') {
        console.log('📝 Stock modifié:', stockData);
        // Mettre à jour la base locale
        if (typeof window !== 'undefined' && window.DB && window.DB.stocks) {
          const existingIndex = window.DB.stocks.findIndex(s => s.id === change.doc.id);
          if (existingIndex !== -1) {
            window.DB.stocks[existingIndex] = stockData;
          }
        }
      }
      
      if (change.type === 'removed') {
        console.log('🗑️ Stock supprimé:', stockData);
        // Supprimer de la base locale
        if (typeof window !== 'undefined' && window.DB && window.DB.stocks) {
          window.DB.stocks = window.DB.stocks.filter(s => s.id !== change.doc.id);
        }
      }
    });
    
    // Mettre à jour l'interface en temps réel
    if (typeof renderStocks === 'function') renderStocks();
    if (typeof populatePosProducts === 'function') populatePosProducts();
    if (typeof renderDashboard === 'function') renderDashboard();
    
    // Notification temps réel
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('📦 SAM-CI', {
        body: `Stock mis à jour: ${stockData.produit}`,
        icon: '/favicon.ico'
      });
    }
  });
}

// ── SYNCHRONISATION TEMPS RÉEL COMPLÈTE ───────────────────────────────
export function enableRealTimeSync() {
  console.log('🔄 Activation synchronisation temps réel complète...');
  
  // Ventes - mise à jour instantanée
  onSnapshot(collection(db, 'Sales'), (snapshot) => {
    const ventes = [];
    snapshot.forEach(doc => {
      ventes.push({ id: doc.id, ...doc.data() });
    });
    window.DB.ventes = ventes;
    
    if (typeof renderVentes === 'function') renderVentes();
    if (typeof renderDashboard === 'function') renderDashboard();
    
    console.log('💰 Ventes synchronisées en temps réel:', ventes.length);
  });

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
  try {
    await addDoc(collection(db, 'Stocks'), {
      ...stockData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Stock enregistré dans Firebase:', stockData.produit);
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement stock:', error);
    return false;
  }
}

export async function saveEmployeeToFirebase(employeeData) {
  try {
    await addDoc(collection(db, 'Employees'), {
      ...employeeData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Employé enregistré dans Firebase:', employeeData.name);
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement employé:', error);
    return false;
  }
}

export async function saveClientToFirebase(clientData) {
  try {
    await addDoc(collection(db, 'Clients'), {
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Client enregistré dans Firebase:', clientData.nom);
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement client:', error);
    return false;
  }
}

export async function saveVenteToFirebase(venteData) {
  try {
    await addDoc(collection(db, 'Ventes'), {
      ...venteData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Vente enregistrée dans Firebase:', venteData.num);
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement vente:', error);
    return false;
  }
}

export async function saveFournisseurToFirebase(fournisseurData) {
  try {
    await addDoc(collection(db, 'Fournisseurs'), {
      ...fournisseurData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Fournisseur enregistré dans Firebase:', fournisseurData.nom);
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement fournisseur:', error);
    return false;
  }
}

export async function saveLivraisonToFirebase(livraisonData) {
  try {
    await addDoc(collection(db, 'Livraisons'), {
      ...livraisonData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Livraison enregistrée dans Firebase:', livraisonData.num);
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement livraison:', error);
    return false;
  }
}

export async function saveComptaToFirebase(comptaData) {
  try {
    await addDoc(collection(db, 'Comptabilite'), {
      ...comptaData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Opération comptabilité enregistrée dans Firebase:', comptaData.libelle);
    return true;
  } catch (error) {
    console.error('❌ Erreur enregistrement comptabilité:', error);
    return false;
  }
}
