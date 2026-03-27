/* ════════════════════════════════════════════════════════════════
   AVICO-PRO AUTO UPDATER
   Mise à jour automatique et synchronisation continue
   ════════════════════════════════════════════════════════════════ */

// ─── SYSTÈME DE MISE À JOUR AUTOMATIQUE ───────────────────────────────────
export class AutoUpdater {
  constructor() {
    this.currentVersion = '4.0.0';
    this.updateInterval = 3600000; // 1 heure
    this.checkInterval = null;
    this.isUpdating = false;
    this.updateQueue = [];
    this.lastUpdateCheck = null;
    this.init();
  }

  // Initialisation de l'auto-updater
  init() {
    this.setupVersionCheck();
    this.setupBackgroundSync();
    this.setupCacheUpdater();
    this.setupFeatureUpdater();
    this.startUpdateCycle();
    console.log('🔄 Auto Updater initialized');
  }

  // Configuration du contrôle de version
  setupVersionCheck() {
    // Vérifier la version au démarrage
    this.checkForUpdates();
    
    // Configurer le contrôle périodique
    this.checkInterval = setInterval(() => {
      this.checkForUpdates();
    }, this.updateInterval);
  }

  // Vérification des mises à jour
  async checkForUpdates() {
    if (this.isUpdating) return;
    
    try {
      this.isUpdating = true;
      this.lastUpdateCheck = new Date();
      
      // Vérifier la version du serveur
      const serverVersion = await this.getServerVersion();
      
      if (this.isNewerVersion(serverVersion, this.currentVersion)) {
        await this.performUpdate(serverVersion);
      }
      
      // Vérifier les mises à jour de fonctionnalités
      await this.checkFeatureUpdates();
      
    } catch (error) {
      console.warn('Update check failed:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  // Obtenir la version du serveur
  async getServerVersion() {
    try {
      // 💡 SOLUTION : Ne pas appeler l'API si pas de backend
      console.log('📡 Vérification version serveur désactivée (application frontend-only)');
      return this.currentVersion;
      
      // Code original désactivé (pas de backend API)
      /*
      const response = await fetch('/api/version', {
        cache: 'no-cache',
        headers: {
          'If-Modified-Since': this.lastUpdateCheck?.toUTCString() || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.version;
      }
      */
    } catch (error) {
      console.warn('Failed to get server version:', error);
    }
    
    return this.currentVersion;
  }

  // Comparaison de versions
  isNewerVersion(serverVersion, currentVersion) {
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

  // Effectuer la mise à jour
  async performUpdate(newVersion) {
    console.log(`🔄 Updating from ${this.currentVersion} to ${newVersion}`);
    
    try {
      // Afficher la notification de mise à jour
      this.showUpdateNotification('Mise à jour en cours...');
      
      // Mettre à jour les fichiers statiques
      await this.updateStaticFiles();
      
      // Mettre à jour les modules JavaScript
      await this.updateJavaScriptModules();
      
      // Mettre à jour les styles
      await this.updateStyles();
      
      // Mettre à jour les données de configuration
      await this.updateConfiguration();
      
      // Mettre à jour la version
      this.currentVersion = newVersion;
      
      // Recharger l'application si nécessaire
      if (this.requiresReload(newVersion)) {
        await this.scheduleReload();
      }
      
      this.showUpdateNotification('Mise à jour terminée avec succès!', 'success');
      
    } catch (error) {
      console.error('Update failed:', error);
      this.showUpdateNotification('Échec de la mise à jour', 'error');
    }
  }

  // Mettre à jour les fichiers statiques
  async updateStaticFiles() {
    const staticFiles = [
      '/index.html',
      '/manifest.json',
      '/favicon.ico'
    ];
    
    for (const file of staticFiles) {
      try {
        const response = await fetch(file + '?v=' + Date.now());
        if (response.ok) {
          const content = await response.text();
          // Mettre en cache le nouveau contenu
          await this.cacheFile(file, content);
        }
      } catch (error) {
        console.warn(`Failed to update ${file}:`, error);
      }
    }
  }

  // Mettre à jour les modules JavaScript
  async updateJavaScriptModules() {
    const modules = [
      '/js/app.js',
      '/js/ui.js',
      '/js/firebase.js',
      '/js/ai-analytics.js',
      '/js/reports.js',
      '/js/performance-optimizer.js'
    ];
    
    for (const module of modules) {
      try {
        // Forcer le rechargement du module
        const script = document.querySelector(`script[src="${module}"]`);
        if (script) {
          const newSrc = module + '?v=' + Date.now();
          const newScript = document.createElement('script');
          newScript.src = newSrc;
          newScript.type = 'module';
          
          script.parentNode.replaceChild(newScript, script);
        }
      } catch (error) {
        console.warn(`Failed to update module ${module}:`, error);
      }
    }
  }

  // Mettre à jour les styles
  async updateStyles() {
    const styles = [
      '/style.css'
    ];
    
    for (const style of styles) {
      try {
        const link = document.querySelector(`link[href="${style}"]`);
        if (link) {
          const newHref = style + '?v=' + Date.now();
          link.href = newHref;
        }
      } catch (error) {
        console.warn(`Failed to update style ${style}:`, error);
      }
    }
  }

  // Mettre à jour la configuration
  async updateConfiguration() {
    try {
      const response = await fetch('/api/config?v=' + Date.now());
      if (response.ok) {
        const config = await response.json();
        
        // Mettre à jour la configuration globale
        if (window.SAMCI_CONFIG) {
          Object.assign(window.SAMCI_CONFIG, config);
        } else {
          window.SAMCI_CONFIG = config;
        }
        
        // Déclencher un événement de mise à jour de configuration
        window.dispatchEvent(new CustomEvent('config-updated', { detail: config }));
      }
    } catch (error) {
      console.warn('Failed to update configuration:', error);
    }
  }

  // Vérifier si un rechargement est nécessaire
  requiresReload(newVersion) {
    const [major, minor] = newVersion.split('.').map(Number);
    const [currentMajor, currentMinor] = this.currentVersion.split('.').map(Number);
    
    // Rechargement nécessaire pour les changements majeurs ou mineurs
    return major > currentMajor || minor > currentMinor;
  }

  // Planifier un rechargement
  async scheduleReload() {
    // Attendre que les opérations en cours se terminent
    await this.waitForIdleState();
    
    // Afficher une notification de rechargement
    this.showUpdateNotification('L\'application va redémarrer dans 5 secondes...', 'info');
    
    // Recharger après 5 secondes
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  // Attendre un état inactif
  async waitForIdleState() {
    return new Promise(resolve => {
      const checkIdle = () => {
        if (document.readyState === 'complete' && !window.performanceOptimizer?.isOptimizing) {
          resolve();
        } else {
          setTimeout(checkIdle, 100);
        }
      };
      checkIdle();
    });
  }

  // Mettre en cache un fichier
  async cacheFile(url, content) {
    try {
      const cache = await caches.open('samci-static');
      const response = new Response(content, {
        headers: { 'Content-Type': 'text/html' }
      });
      await cache.put(url, response);
    } catch (error) {
      console.warn(`Failed to cache ${url}:`, error);
    }
  }

  // Configuration de la synchronisation en arrière-plan
  setupBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        // Enregistrer la synchronisation en arrière-plan
        return registration.sync.register('background-sync');
      });
    }
  }

  // Configuration du cache updater
  setupCacheUpdater() {
    // Mettre à jour le cache périodiquement
    setInterval(() => {
      this.updateCache();
    }, 1800000); // Toutes les 30 minutes
  }

  // Mettre à jour le cache
  async updateCache() {
    try {
      const cache = await caches.open('samci-dynamic');
      const requests = await cache.keys();
      
      // Supprimer les entrées expirées
      const now = Date.now();
      for (const request of requests) {
        const response = await cache.match(request);
        const timestamp = response?.headers.get('x-cache-timestamp');
        const ttl = response?.headers.get('x-cache-ttl');
        
        if (timestamp && ttl && parseInt(ttl) < now) {
          await cache.delete(request);
        }
      }
      
      console.log('🗑️ Cache updated successfully');
    } catch (error) {
      console.warn('Cache update failed:', error);
    }
  }

  // Configuration du mise à jour des fonctionnalités
  setupFeatureUpdater() {
    // Écouter les événements de mise à jour de fonctionnalités
    window.addEventListener('feature-update', (event) => {
      this.handleFeatureUpdate(event.detail);
    });
  }

  // Gérer les mises à jour de fonctionnalités
  async handleFeatureUpdate(featureData) {
    try {
      const { feature, version, config } = featureData;
      
      console.log(`🔄 Updating feature: ${feature} v${version}`);
      
      // Mettre à jour la configuration de la fonctionnalité
      if (window.SAMCI_CONFIG?.features) {
        window.SAMCI_CONFIG.features[feature] = {
          ...window.SAMCI_CONFIG.features[feature],
          version,
          config,
          lastUpdated: new Date().toISOString()
        };
      }
      
      // Recharger les modules de la fonctionnalité si nécessaire
      if (this.requiresFeatureReload(feature, version)) {
        await this.reloadFeature(feature);
      }
      
      // Notifier les utilisateurs
      this.showFeatureUpdateNotification(feature, version);
      
    } catch (error) {
      console.error(`Failed to update feature ${feature}:`, error);
    }
  }

  // Vérifier si une fonctionnalité nécessite un rechargement
  requiresFeatureReload(feature, newVersion) {
    const currentFeature = window.SAMCI_CONFIG?.features?.[feature];
    if (!currentFeature) return true;
    
    return this.isNewerVersion(newVersion, currentFeature.version);
  }

  // Recharger une fonctionnalité
  async reloadFeature(feature) {
    const featureModules = {
      'ai-analytics': '/js/ai-analytics.js',
      'reports': '/js/reports.js',
      'mobile-app': '/mobile-app.js'
    };
    
    const modulePath = featureModules[feature];
    if (modulePath) {
      try {
        // Forcer le rechargement du module
        const script = document.querySelector(`script[src="${modulePath}"]`);
        if (script) {
          const newSrc = modulePath + '?v=' + Date.now();
          const newScript = document.createElement('script');
          newScript.src = newSrc;
          newScript.type = 'module';
          
          script.parentNode.replaceChild(newScript, script);
        }
      } catch (error) {
        console.warn(`Failed to reload feature ${feature}:`, error);
      }
    }
  }

  // Vérifier les mises à jour de fonctionnalités
  async checkFeatureUpdates() {
    try {
      const response = await fetch('/api/features/updates');
      if (response.ok) {
        const updates = await response.json();
        
        for (const update of updates) {
          window.dispatchEvent(new CustomEvent('feature-update', { detail: update }));
        }
      }
    } catch (error) {
      console.warn('Failed to check feature updates:', error);
    }
  }

  // Démarrer le cycle de mise à jour
  startUpdateCycle() {
    // Cycle de mise à jour continu
    setInterval(() => {
      this.performMaintenanceTasks();
    }, 600000); // Toutes les 10 minutes
  }

  // Tâches de maintenance
  async performMaintenanceTasks() {
    console.log('🔧 Performing maintenance tasks...');
    
    // Nettoyer le cache
    await this.updateCache();
    
    // Optimiser les performances
    if (window.performanceOptimizer) {
      window.performanceOptimizer.optimizeMemory();
    }
    
    // Vérifier les mises à jour de sécurité
    await this.checkSecurityUpdates();
    
    // Synchroniser les données
    await this.syncData();
  }

  // Vérifier les mises à jour de sécurité
  async checkSecurityUpdates() {
    try {
      const response = await fetch('/api/security/updates');
      if (response.ok) {
        const updates = await response.json();
        
        if (updates.length > 0) {
          console.warn('🔒 Security updates available:', updates);
          this.showSecurityUpdateNotification(updates);
        }
      }
    } catch (error) {
      console.warn('Failed to check security updates:', error);
    }
  }

  // Synchroniser les données
  async syncData() {
    try {
      // Synchroniser les données locales avec le serveur
      if (window.syncAllData) {
        await window.syncAllData();
      }
      
      // Synchroniser les données hors ligne
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration.sync) {
          await registration.sync.register('data-sync');
        }
      }
    } catch (error) {
      console.warn('Data sync failed:', error);
    }
  }

  // Afficher une notification de mise à jour
  showUpdateNotification(message, type = 'info') {
    if (window.showToast) {
      window.showToast(`🔄 ${message}`, type);
    }
  }

  // Afficher une notification de mise à jour de fonctionnalité
  showFeatureUpdateNotification(feature, version) {
    if (window.showToast) {
      window.showToast(`✨ Fonctionnalité ${feature} mise à jour v${version}`, 'success');
    }
  }

  // Afficher une notification de mise à jour de sécurité
  showSecurityUpdateNotification(updates) {
    if (window.showToast) {
      window.showToast(`🔒 ${updates.length} mise(s) à jour de sécurité disponible(s)`, 'warning');
    }
  }

  // Forcer une mise à jour manuelle
  async forceUpdate() {
    console.log('🔄 Forcing manual update...');
    await this.checkForUpdates();
  }

  // Obtenir le statut de mise à jour
  getUpdateStatus() {
    return {
      currentVersion: this.currentVersion,
      isUpdating: this.isUpdating,
      lastUpdateCheck: this.lastUpdateCheck,
      updateQueue: this.updateQueue.length
    };
  }

  // Arrêter l'auto-updater
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log('⏹️ Auto Updater stopped');
  }
}

// Initialisation globale
window.autoUpdater = new AutoUpdater();

console.log('🔄 Auto-updater system loaded');
