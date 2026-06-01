/**
 * 🛡️ GESTIONNAIRE DE PROMISES SÉCURISÉ
 * Résout les erreurs de Promise non gérées dans AVICO-PRO
 */

// 🎯 Configuration globale des erreurs
window.PROMISE_CONFIG = {
  enableLogging: true,
  enableToast: true,
  fallbackTimeout: 10000
};

// 📊 Statistiques des erreurs
window.PROMISE_STATS = {
  totalErrors: 0,
  unhandledRejections: 0,
  fetchErrors: 0,
  firebaseErrors: 0
};

/**
 * 🛡️ Wrapper fetch sécurisé avec gestion complète des erreurs
 */
window.safeFetch = async function(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROMISE_CONFIG.fallbackTimeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    PROMISE_STATS.fetchErrors++;
    logError('Fetch Error', error, { url, options });
    
    // Créer une Error object standard
    const standardError = new Error(`Échec fetch: ${error.message}`);
    standardError.originalError = error;
    standardError.url = url;
    standardError.options = options;
    
    throw standardError;
  }
};

/**
 * 🛡️ Wrapper Promise.reject sécurisé
 */
window.safeReject = function(reason, context = '') {
  PROMISE_STATS.totalErrors++;
  
  let error;
  if (reason instanceof Error) {
    error = reason;
  } else {
    // Convertir les objets simples en Error
    error = new Error(
      typeof reason === 'string' ? reason : 
      JSON.stringify(reason)
    );
    error.originalReason = reason;
  }
  
  error.context = context;
  logError('Promise Rejection', error, { context });
  
  return Promise.reject(error);
};

/**
 * 🛡️ Gestionnaire global des rejets non gérés
 */
window.setupGlobalErrorHandlers = function() {
  // Capturer les rejets de Promise non gérés
  window.addEventListener('unhandledrejection', (event) => {
    PROMISE_STATS.unhandledRejections++;
    
    let error = event.reason;
    if (!(error instanceof Error)) {
      error = new Error(
        typeof error === 'string' ? error : 
        JSON.stringify(error)
      );
      error.originalReason = event.reason;
    }
    
    logError('Unhandled Promise Rejection', error);
    
    if (PROMISE_CONFIG.enableToast && window.showToast) {
      showToast('❌ Erreur système non gérée', 'error');
    }
    
    // Empêcher le message d'erreur par défaut du navigateur
    event.preventDefault();
  });
  
  // Capturer les erreurs JavaScript classiques
  window.addEventListener('error', (event) => {
    PROMISE_STATS.totalErrors++;
    logError('JavaScript Error', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
};

/**
 * 📝 Logging structuré des erreurs
 */
function logError(type, error, metadata = {}) {
  if (!PROMISE_CONFIG.enableLogging) return;
  
  const errorInfo = {
    timestamp: new Date().toISOString(),
    type: type,
    message: error.message,
    stack: error.stack,
    metadata: metadata,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.error(`🚨 ${type}:`, errorInfo);
  
  // Sauvegarder dans localStorage pour debugging
  const errors = JSON.parse(localStorage.getItem('avico_errors') || '[]');
  errors.push(errorInfo);
  
  // Garder seulement les 50 dernières erreurs
  if (errors.length > 50) {
    errors.splice(0, errors.length - 50);
  }
  
  localStorage.setItem('avico_errors', JSON.stringify(errors));
}

/**
 * 🛡️ Wrapper Firebase sécurisé
 */
window.safeFirebaseOperation = async function(operation, context = '') {
  try {
    return await operation();
  } catch (error) {
    PROMISE_STATS.firebaseErrors++;
    
    const firebaseError = new Error(`Firebase Error: ${error.message || error}`);
    firebaseError.originalError = error;
    firebaseError.context = context;
    firebaseError.isFirebaseError = true;
    
    logError('Firebase Operation Error', firebaseError, { context });
    
    throw firebaseError;
  }
};

/**
 * 📊 Obtenir les statistiques d'erreurs
 */
window.getErrorStats = function() {
  return {
    ...PROMISE_STATS,
    recentErrors: JSON.parse(localStorage.getItem('avico_errors') || '[]').slice(-10)
  };
};

/**
 * 🧹 Nettoyer les erreurs stockées
 */
window.clearErrorLogs = function() {
  localStorage.removeItem('avico_errors');
  PROMISE_STATS.totalErrors = 0;
  PROMISE_STATS.unhandledRejections = 0;
  PROMISE_STATS.fetchErrors = 0;
  PROMISE_STATS.firebaseErrors = 0;
  console.log('🧹 Logs d\'erreurs nettoyés');
};

// 🚀 Initialisation automatique
if (typeof window !== 'undefined') {
  setupGlobalErrorHandlers();
  console.log('🛡️ Gestionnaire de Promises AVICO-PRO initialisé');
}
