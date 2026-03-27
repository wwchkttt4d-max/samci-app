// Script de diagnostic Firebase
console.log('🔧 Diagnostic Firebase démarré...');

// Vérifier la configuration Firebase
function checkFirebaseConfig() {
  console.log('📋 Configuration Firebase:');
  console.log('  - Firebase disponible:', typeof firebase !== 'undefined');
  console.log('  - db (Firestore) disponible:', typeof db !== 'undefined');
  
  if (typeof firebase !== 'undefined') {
    console.log('  - Version Firebase:', firebase.SDK_VERSION);
  }
  
  // Vérifier les variables globales
  console.log('📊 Variables globales:');
  
  if (typeof DB !== 'undefined') {
    console.log('  - DB.ventes:', DB.ventes?.length || 0);
    console.log('  - DB.stocks:', DB.stocks?.length || 0);
    console.log('  - DB.clients:', DB.clients?.length || 0);
  }
}

// Vérifier les erreurs Firebase
function checkFirebaseErrors() {
  // Intercepter les erreurs console
  const originalError = console.error;
  console.error = function(...args) {
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('Firebase') || args[0].includes('firestore') || 
         args[0].includes('auth') || args[0].includes('permission'))) {
      console.log('🚨 Erreur Firebase détectée:', ...args);
    }
    originalError.apply(console, args);
  };
}

// Test de connexion Firebase
async function testFirebaseConnection() {
  try {
    console.log('🔗 Test de connexion Firebase...');
    
    if (typeof db !== 'undefined') {
      // Test simple: essayer de lire une collection
      const testQuery = query(collection(db, 'test'), limit(1));
      const snapshot = await getDocs(testQuery);
      console.log('✅ Connexion Firebase réussie');
      console.log('📊 Collections disponibles: test');
    } else {
      console.log('❌ db (Firestore) non disponible');
    }
  } catch (error) {
    console.log('❌ Erreur de connexion Firebase:', error);
    console.log('📝 Détails:', error.code, error.message);
  }
}

// Diagnostic complet (exécuté automatiquement)
function runDiagnostic() {
  console.log('🔍 === DIAGNOSTIC FIREBASE COMPLET ===');
  checkFirebaseConfig();
  checkFirebaseErrors();
  testFirebaseConnection();
  console.log('🔍 === FIN DU DIAGNOSTIC ===');
}

// Nettoyer le diagnostic (supprime les boutons)
function cleanupDiagnostic() {
  const existingButtons = document.querySelectorAll('[data-diagnostic-button]');
  existingButtons.forEach(btn => btn.remove());
  console.log('🧹 Boutons de diagnostic nettoyés');
}

// Lancer le diagnostic automatiquement au chargement
setTimeout(runDiagnostic, 3000);

// Nettoyer automatiquement les boutons de diagnostic
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    cleanupDiagnostic();
    console.log('🔧 Diagnostic Firebase exécuté - plus de boutons visibles');
  }, 3000);
});
