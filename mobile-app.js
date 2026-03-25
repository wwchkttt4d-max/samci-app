/* ════════════════════════════════════════════════════════════════
   SAM-CI MOBILE - APPLICATION NATIVE HYBRIDE
   Progressive Web App (PWA) avec capacités natives
   ════════════════════════════════════════════════════════════════ */

// ─── SERVICE WORKER POUR FONCTIONNALITÉS NATIVES ───────────────────────────────
const CACHE_NAME = 'samci-mobile-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/js/firebase.js',
  '/js/ui.js',
  '/js/ai-analytics.js',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('📱 Installation SAM-CI Mobile...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Fichiers mis en cache:', urlsToCache.length);
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Activation SAM-CI Mobile...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retourner la réponse mise en cache
        if (response) {
          return response;
        }

        // Pas de cache - faire la requête réseau
        return fetch(event.request).then(response => {
          // Mettre en cache les nouvelles requêtes
          if (event.request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        });
      })
      .catch(() => {
        // Mode hors ligne - retourner page offline
        return new Response(
          '<h1>📱 SAM-CI Hors Ligne</h1><p>Vérifiez votre connexion</p>',
          { status: 503, statusText: 'Service Unavailable' }
        );
      })
  );
});

// ─── CAPACITÉS NATIVES ANDROID/iOS ───────────────────────────────────────────
class NativeCapabilities {
  constructor() {
    this.isInstalled = this.checkIfInstalled();
    this.hasCamera = this.checkCamera();
    this.hasGPS = this.checkGPS();
    this.hasNotifications = this.checkNotifications();
  }

  checkIfInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
  }

  checkCamera() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  checkGPS() {
    return 'geolocation' in navigator;
  }

  checkNotifications() {
    return 'Notification' in window;
  }

  // Scanner codes-barres avec la caméra
  async scanBarcode() {
    if (!this.hasCamera) {
      throw new Error('📷 Caméra non disponible');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Créer un élément vidéo pour le scan
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Intégration avec un scanner de codes-barres (ex: QuaggaJS)
      return new Promise((resolve, reject) => {
        // Simulation de scan - à remplacer avec vraie librairie
        setTimeout(() => {
          const simulatedCode = 'SAMCI' + Math.random().toString(36).substr(2, 9).toUpperCase();
          resolve({
            code: simulatedCode,
            format: 'CODE128',
            timestamp: new Date().toISOString()
          });
        }, 2000);
      });
    } catch (error) {
      console.error('❌ Erreur scan code-barres:', error);
      throw error;
    }
  }

  // Géolocalisation pour livraisons
  async getCurrentLocation() {
    if (!this.hasGPS) {
      throw new Error('📍 GPS non disponible');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          });
        },
        error => {
          reject(new Error('📍 Erreur GPS: ' + error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  // Partage natif
  async shareData(data) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SAM-CI - ' + data.title,
          text: data.text,
          url: data.url
        });
        return true;
      } catch (error) {
        console.log('❌ Partage annulé par l\'utilisateur');
        return false;
      }
    } else {
      // Fallback pour navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = data.text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (typeof showToast === 'function') {
        showToast('📋 Données copiées dans le presse-papiers', 'info');
      }
      return true;
    }
  }

  // Vibration pour les notifications
  vibrate(pattern = [200, 100, 200]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Plein écran pour l'interface POS
  requestFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  // Mode sombre/clair automatique
  enableAutoTheme() {
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const updateTheme = (e) => {
        if (e.matches) {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
      };

      darkModeQuery.addListener(updateTheme);
      updateTheme(darkModeQuery);
    }
  }
}

// ─── INTERFACE MOBILE OPTIMISÉE ───────────────────────────────────────────────
class MobileUI {
  constructor() {
    this.native = new NativeCapabilities();
    this.isMobile = this.detectMobile();
    this.setupMobileOptimizations();
  }

  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  setupMobileOptimizations() {
    if (!this.isMobile) return;

    // Optimisations tactiles
    this.setupTouchInteractions();
    
    // Interface adaptative
    this.setupResponsiveLayout();
    
    // Performance mobile
    this.optimizePerformance();
    
    // Gestures mobiles
    this.setupGestures();
  }

  setupTouchInteractions() {
    // Désactiver le zoom sur double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    });

    // Scroll fluide
    document.body.style.touchAction = 'pan-y';
    document.body.style.webkitOverflowScrolling = 'touch';
  }

  setupResponsiveLayout() {
    // Adapter la taille des polices
    const adjustFontSize = () => {
      const width = window.innerWidth;
      const fontSize = Math.max(14, Math.min(16, width / 40));
      document.documentElement.style.fontSize = fontSize + 'px';
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
  }

  optimizePerformance() {
    // Réduire les animations sur mobile
    if (this.isMobile) {
      document.body.classList.add('reduce-animations');
      
      // Optimiser les images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.loading = 'lazy';
      });
    }
  }

  setupGestures() {
    let startX = 0;
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Swipe horizontal pour navigation
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.navigatePrevious(); // Swipe droite
        } else {
          this.navigateNext(); // Swipe gauche
        }
      }
      
      // Swipe vertical pour actions rapides
      if (Math.abs(deltaY) > 100) {
        if (deltaY < 0) {
          this.showQuickActions(); // Swipe haut
        } else {
          this.hideQuickActions(); // Swipe bas
        }
      }
    });
  }

  navigatePrevious() {
    // Navigation page précédente
    const pages = ['dashboard', 'caisse', 'stocks', 'ventes'];
    const currentPage = window.UI?.currentPage || 'dashboard';
    const currentIndex = pages.indexOf(currentPage);
    
    if (currentIndex > 0) {
      const previousPage = pages[currentIndex - 1];
      if (typeof nav === 'function') {
        nav(previousPage, document.querySelector(`[data-page="${previousPage}"]`));
      }
    }
  }

  navigateNext() {
    // Navigation page suivante
    const pages = ['dashboard', 'caisse', 'stocks', 'ventes'];
    const currentPage = window.UI?.currentPage || 'dashboard';
    const currentIndex = pages.indexOf(currentPage);
    
    if (currentIndex < pages.length - 1) {
      const nextPage = pages[currentIndex + 1];
      if (typeof nav === 'function') {
        nav(nextPage, document.querySelector(`[data-page="${nextPage}"]`));
      }
    }
  }

  showQuickActions() {
    // Afficher actions rapides (nouvelle vente, nouveau stock, etc.)
    const quickActions = document.getElementById('mobile-quick-actions');
    if (quickActions) {
      quickActions.classList.add('visible');
    }
  }

  hideQuickActions() {
    // Masquer les actions rapides
    const quickActions = document.getElementById('mobile-quick-actions');
    if (quickActions) {
      quickActions.classList.remove('visible');
    }
  }
}

// ─── INITIALISATION APPLICATION MOBILE ─────────────────────────────────────────
export function initializeMobileApp() {
  console.log('📱 Initialisation SAM-CI Mobile...');
  
  // Vérifier si l'application est installée
  const native = new NativeCapabilities();
  
  if (native.isInstalled) {
    console.log('📱 Application installée - Mode natif activé');
    document.body.classList.add('native-app');
  }

  // Initialiser l'interface mobile
  const mobileUI = new MobileUI();
  
  // Demander les permissions nécessaires
  requestMobilePermissions();
  
  // Configurer le mode hors ligne
  setupOfflineMode();
  
  console.log('✅ SAM-CI Mobile initialisée avec succès');
}

function requestMobilePermissions() {
  // Demander la permission pour les notifications
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      console.log('🔔 Permission notifications:', permission);
    });
  }

  // Demander la permission pour la caméra (quand nécessaire)
  if ('mediaDevices' in navigator) {
    // La permission sera demandée lors de l'utilisation
    console.log('📷 Caméra disponible (permission à la demande)');
  }
}

function setupOfflineMode() {
  // Afficher le statut de connexion
  const updateConnectionStatus = () => {
    const isOnline = navigator.onLine;
    const statusElement = document.getElementById('connection-status');
    
    if (statusElement) {
      statusElement.className = isOnline ? 'online' : 'offline';
      statusElement.textContent = isOnline ? '🟢 En ligne' : '🔴 Hors ligne';
    }
    
    if (!isOnline) {
      if (typeof showToast === 'function') {
        showToast('📱 Mode hors ligne - Données locales utilisées', 'warn');
      }
    }
  };

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
  updateConnectionStatus();
}

// ─── EXPORT POUR UTILISATION GLOBALE ───────────────────────────────────────
export { NativeCapabilities, MobileUI };

// Auto-initialisation si le DOM est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMobileApp);
} else {
  initializeMobileApp();
}
