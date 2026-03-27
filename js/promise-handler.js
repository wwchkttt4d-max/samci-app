// Gestionnaire global des erreurs de Promise pour AVICO-PRO
console.log('🛡️ Gestionnaire d\'erreurs Promise activé...');

// Intercepter toutes les rejections de Promise non gérées
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;
  
  // Créer un Error object si ce n'en est pas un
  const properError = error instanceof Error ? error : new Error(
    typeof error === 'object' ? JSON.stringify(error) : String(error)
  );
  
  console.error('🚨 Promise rejetée non gérée:', {
    message: properError.message,
    stack: properError.stack,
    original: error,
    type: typeof error
  });
  
  // Messages spécifiques selon le type d'erreur
  let userMessage = '⚠️ Une erreur est survenue, veuillez réessayer';
  
  if (typeof error === 'object' && error.code) {
    switch (error.code) {
      case 'permission-denied':
        userMessage = '🔒 Permission refusée, vérifiez vos droits Firebase';
        break;
      case 'unavailable':
        userMessage = '🌐 Service Firebase indisponible';
        break;
      case 'unauthenticated':
        userMessage = '🔐 Non authentifié, veuillez vous reconnecter';
        break;
      default:
        userMessage = `⚠️ Erreur Firebase: ${error.message || error.code}`;
    }
  }
  
  // Afficher un message utilisateur-friendly
  if (typeof showToast === 'function') {
    showToast(userMessage, 'warn');
  }
  
  // Empêcher l'affichage de l'erreur par défaut dans la console
  event.preventDefault();
});

// Intercepter les erreurs JavaScript globales
window.addEventListener('error', (event) => {
  console.error('🚨 Erreur JavaScript globale:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
  
  // Afficher un message utilisateur-friendly pour les erreurs critiques
  if (typeof showToast === 'function' && event.error?.name !== 'ChunkLoadError') {
    showToast('❌ Erreur système, actualisez la page', 'error');
  }
});

// Fonction utilitaire pour exécuter des Promises en toute sécurité
function safePromise(promise, errorMessage = 'Opération échouée') {
  return promise
    .catch(error => {
      console.error(`❌ ${errorMessage}:`, error);
      
      // Créer une Error object si ce n'en est pas une
      const properError = error instanceof Error ? error : new Error(JSON.stringify(error));
      
      // Messages spécifiques
      let userMessage = `❌ ${errorMessage}`;
      
      if (typeof error === 'object' && error.code) {
        switch (error.code) {
          case 'permission-denied':
            userMessage = '🔒 Permission refusée';
            break;
          case 'unavailable':
            userMessage = '🌐 Service indisponible';
            break;
          default:
            userMessage = `❌ Erreur: ${error.message || error.code}`;
        }
      }
      
      // Afficher un message à l'utilisateur
      if (typeof showToast === 'function') {
        showToast(userMessage, 'error');
      }
      
      // Relancer l'erreur pour permettre un traitement ultérieur
      throw properError;
    });
}

// Fonction pour wrapper les appels Firebase
function safeFirebaseCall(fn, ...args) {
  try {
    const result = fn(...args);
    
    // Si c'est une Promise, la rendre safe
    if (result && typeof result.catch === 'function') {
      return safePromise(result, 'Erreur Firebase');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Erreur appel Firebase:', error);
    if (typeof showToast === 'function') {
      showToast('❌ Erreur de connexion au serveur', 'error');
    }
    return null;
  }
}

// Wrapper pour les fonctions async avec try/catch automatique
function safeAsync(fn, ...args) {
  return Promise.resolve()
    .then(() => fn(...args))
    .catch(error => {
      console.error('❌ Erreur async:', error);
      if (typeof showToast === 'function') {
        showToast('❌ Opération échouée', 'error');
      }
      return null;
    });
}

// Exposer les fonctions globalement
window.safePromise = safePromise;
window.safeFirebaseCall = safeFirebaseCall;
window.safeAsync = safeAsync;

console.log('✅ Gestionnaire d\'erreurs Promise initialisé');
