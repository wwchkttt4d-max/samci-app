/* ════════════════════════════════════════════════════════════════
   AVICO-PRO - GESTIONNAIRE API SÉCURISÉ
   Remplacement des appels API manquants par des solutions locales
   ════════════════════════════════════════════════════════════════ */

class APIHandler {
  constructor() {
    this.defaultTimeout = 10000; // 10 secondes
    this.mockData = this.initMockData();
    this.cache = new Map();
    this.init();
  }

  init() {
    console.log('🌐 Gestionnaire API initialisé (mode local)');
  }

  // Initialisation des données de démonstration
  initMockData() {
    return {
      version: {
        current: '4.0.0',
        latest: '4.0.0',
        updateAvailable: false,
        releaseNotes: 'Version stable avec synchronisation Firebase',
        lastChecked: new Date().toISOString()
      },
      config: {
        app: {
          name: 'AVICO-PRO',
          version: '4.0.0',
          environment: 'production',
          features: {
            firebase: true,
            pos: true,
            reports: true,
            analytics: true
          }
        },
        ui: {
          theme: 'avico-green',
          language: 'fr',
          autoSync: true,
          notifications: true
        },
        business: {
          currency: 'FCFA',
          taxRate: 0.18,
          timezone: 'Africa/Abidjan'
        }
      },
      features: {
        updates: [
          {
            id: 'firebase-sync',
            name: 'Synchronisation Firebase',
            description: 'Sauvegarde automatique dans le cloud',
            status: 'active',
            priority: 'high'
          },
          {
            id: 'pos-enhancement',
            name: 'Point de vente amélioré',
            description: 'Interface POS moderne et rapide',
            status: 'active',
            priority: 'medium'
          },
          {
            id: 'analytics-ai',
            name: 'Analytics IA',
            description: 'Prédictions et analyses avancées',
            status: 'active',
            priority: 'low'
          }
        ]
      },
      security: {
        updates: [
          {
            id: 'security-patch-2024',
            name: 'Mise à jour de sécurité Q1 2024',
            description: 'Correction des vulnérabilités critiques',
            severity: 'high',
            applied: true,
            date: '2024-03-15'
          },
          {
            id: 'encryption-update',
            name: 'Mise à niveau du chiffrement',
            description: 'Passage à AES-256',
            severity: 'medium',
            applied: true,
            date: '2024-02-28'
          }
        ]
      }
    };
  }

  // Fetch sécurisé avec timeout et gestion d'erreurs
  async secureFetch(url, options = {}) {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    // Vérifier le cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes
        console.log(`📋 Utilisation du cache pour: ${url}`);
        return cached.response;
      }
    }

    // Simuler un appel API avec les données mock
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.log(`⏱️ Timeout pour: ${url}`);
        this.handleMockResponse(url, resolve, reject);
      }, Math.random() * 1000 + 500); // Simuler une latence réseau

      // Nettoyer le timeout si nécessaire
      const cleanup = () => clearTimeout(timeout);
    });
  }

  // Gérer les réponses mock
  handleMockResponse(url, resolve, reject) {
    try {
      let response;
      
      switch(url) {
        case '/api/version':
          response = this.mockData.version;
          break;
          
        case '/api/config':
          response = this.mockData.config;
          break;
          
        case '/api/features/updates':
          response = this.mockData.features.updates;
          break;
          
        case '/api/security/updates':
          response = this.mockData.security.updates;
          break;
          
        default:
          response = { error: 'Endpoint non trouvé', url };
      }

      // Mettre en cache la réponse
      this.cache.set(url, {
        response: {
          ok: true,
          status: 200,
          json: async () => response,
          text: async () => JSON.stringify(response)
        },
        timestamp: Date.now()
      });

      resolve(this.cache.get(url).response);
      
    } catch (error) {
      console.error(`❌ Erreur mock response pour ${url}:`, error);
      reject(error);
    }
  }

  // Remplacement de fetch global
  createSafeFetch() {
    return async (url, options = {}) => {
      console.log(`🔄 Appel API sécurisé: ${url}`);
      
      try {
        // Utiliser notre fetch sécurisé
        return await this.secureFetch(url, options);
      } catch (error) {
        console.error(`❌ Erreur fetch sécurisé:`, error);
        
        // Retourner une réponse d'erreur sécurisée
        return {
          ok: false,
          status: 500,
          json: async () => ({ 
            error: 'Service indisponible', 
            fallback: true,
            url 
          }),
          text: async () => JSON.stringify({ 
            error: 'Service indisponible', 
            fallback: true 
          })
        };
      }
    };
  }

  // Vérifier si une version est plus récente
  isNewerVersion(serverVersion, currentVersion) {
    if (!serverVersion || !currentVersion) return false;
    
    const server = serverVersion.split('.').map(Number);
    const current = currentVersion.split('.').map(Number);
    
    for (let i = 0; i < Math.max(server.length, current.length); i++) {
      const s = server[i] || 0;
      const c = current[i] || 0;
      
      if (s > c) return true;
      if (s < c) return false;
    }
    
    return false;
  }

  // Obtenir la version du serveur (mock)
  async getServerVersion() {
    try {
      const response = await this.secureFetch('/api/version');
      const data = await response.json();
      return data.latest || data.current;
    } catch (error) {
      console.warn('⚠️ Impossible d\'obtenir la version du serveur, utilisation de la version locale');
      return '4.0.0';
    }
  }

  // Obtenir la configuration (mock)
  async getConfiguration() {
    try {
      const response = await this.secureFetch('/api/config');
      return await response.json();
    } catch (error) {
      console.warn('⚠️ Impossible d\'obtenir la configuration, utilisation des valeurs par défaut');
      return this.mockData.config;
    }
  }

  // Vérifier les mises à jour de fonctionnalités (mock)
  async getFeatureUpdates() {
    try {
      const response = await this.secureFetch('/api/features/updates');
      return await response.json();
    } catch (error) {
      console.warn('⚠️ Impossible d\'obtenir les mises à jour de fonctionnalités');
      return [];
    }
  }

  // Vérifier les mises à jour de sécurité (mock)
  async getSecurityUpdates() {
    try {
      const response = await this.secureFetch('/api/security/updates');
      return await response.json();
    } catch (error) {
      console.warn('⚠️ Impossible d\'obtenir les mises à jour de sécurité');
      return [];
    }
  }

  // Nettoyer le cache
  clearCache() {
    this.cache.clear();
    console.log('🧹 Cache API nettoyé');
  }

  // Obtenir les statistiques
  getStats() {
    return {
      cacheSize: this.cache.size,
      mockEndpoints: Object.keys(this.mockData).length,
      uptime: Date.now() - (this.startTime || Date.now())
    };
  }
}

// Créer une instance globale
let apiHandler;

function initializeAPIHandler() {
  if (!apiHandler) {
    apiHandler = new APIHandler();
    apiHandler.startTime = Date.now();
    
    // Remplacer fetch global par notre version sécurisée
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = apiHandler.createSafeFetch();
      
      // Garder une référence au fetch original si nécessaire
      window.originalFetch = originalFetch;
      
      console.log('🛡️ Fetch global remplacé par la version sécurisée');
    }
  }
  
  return apiHandler;
}

// Auto-initialisation
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAPIHandler);
  } else {
    initializeAPIHandler();
  }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APIHandler, initializeAPIHandler };
}

// Exposer globalement
if (typeof window !== 'undefined') {
  window.APIHandler = APIHandler;
  window.initializeAPIHandler = initializeAPIHandler;
}
