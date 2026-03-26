/* ════════════════════════════════════════════════════════════════
   AVICO-PRO PERFORMANCE OPTIMIZER
   Optimisation des performances et monitoring en temps réel
   ════════════════════════════════════════════════════════════════ */

// ─── OPTIMISEUR DE PERFORMANCE ───────────────────────────────────────
export class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      pageLoad: 0,
      renderTime: 0,
      memoryUsage: 0,
      networkLatency: 0,
      cacheHitRate: 0
    };
    this.cache = new Map();
    this.observers = [];
    this.isOptimizing = false;
    this.init();
  }

  // Initialisation de l'optimiseur
  init() {
    this.setupPerformanceMonitoring();
    this.setupIntersectionObserver();
    this.setupLazyLoading();
    this.setupServiceWorker();
    this.optimizeImages();
    this.minifyCSS();
    this.optimizeJavaScript();
    console.log('🚀 Performance Optimizer initialized');
  }

  // Monitoring des performances
  setupPerformanceMonitoring() {
    // Observer les métriques de performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            this.metrics.pageLoad = entry.loadEventEnd - entry.loadEventStart;
          }
          if (entry.entryType === 'measure') {
            this.metrics.renderTime = entry.duration;
          }
        });
      });
      observer.observe({ entryTypes: ['navigation', 'measure', 'paint'] });
    }

    // Monitoring de la mémoire
    if ('memory' in performance) {
      setInterval(() => {
        this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
        this.checkMemoryUsage();
      }, 5000);
    }

    // Monitoring du réseau
    this.monitorNetworkPerformance();
  }

  // Optimisation des images
  optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.loading = 'lazy';
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    });
  }

  // Setup Intersection Observer pour le lazy loading
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadContent(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1
    });

    // Observer les éléments à charger paresseusement
    document.querySelectorAll('[data-lazy]').forEach(el => {
      observer.observe(el);
    });
  }

  // Lazy loading du contenu
  setupLazyLoading() {
    // Lazy loading des modules JavaScript
    const lazyModules = document.querySelectorAll('[data-module]');
    lazyModules.forEach(module => {
      const moduleName = module.dataset.module;
      import(`./modules/${moduleName}.js`)
        .then(mod => {
          module.innerHTML = mod.default.render();
        })
        .catch(err => console.warn(`Failed to load module ${moduleName}:`, err));
    });
  }

  // Setup Service Worker pour le cache
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
          this.setupCacheStrategy(registration);
        })
        .catch(err => console.warn('Service Worker registration failed:', err));
    }
  }

  // Stratégie de cache avancée
  setupCacheStrategy(registration) {
    // Cache des ressources statiques
    const staticAssets = [
      '/',
      '/index.html',
      '/style.css',
      '/manifest.json',
      '/js/app.js'
    ];

    // Cache des données dynamiques avec TTL
    const dynamicData = [
      '/api/stocks',
      '/api/ventes',
      '/api/clients'
    ];

    this.cacheResources(staticAssets, 'static');
    this.cacheResources(dynamicData, 'dynamic', 300000); // 5 minutes TTL
  }

  // Mise en cache des ressources
  async cacheResources(urls, type, ttl = 3600000) {
    const cache = await caches.open(`samci-${type}`);
    const now = Date.now();

    for (const url of urls) {
      try {
        const response = await fetch(url);
        const cachedResponse = response.clone();
        
        // Ajouter metadata TTL
        const headers = new Headers(cachedResponse.headers);
        headers.set('x-cache-timestamp', now.toString());
        headers.set('x-cache-ttl', (now + ttl).toString());
        
        const modifiedResponse = new Response(cachedResponse.body, {
          status: cachedResponse.status,
          statusText: cachedResponse.statusText,
          headers: headers
        });
        
        await cache.put(url, modifiedResponse);
      } catch (error) {
        console.warn(`Failed to cache ${url}:`, error);
      }
    }
  }

  // Optimisation du CSS
  minifyCSS() {
    const styles = document.querySelectorAll('style[data-minify]');
    styles.forEach(style => {
      const originalCSS = style.textContent;
      const minifiedCSS = this.minifyCSSContent(originalCSS);
      style.textContent = minifiedCSS;
    });
  }

  // Minification du CSS
  minifyCSSContent(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
      .trim();
  }

  // Optimisation du JavaScript
  optimizeJavaScript() {
    // Defer loading of non-critical JavaScript
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      script.defer = true;
    });

    // Async loading of analytics and tracking scripts
    const asyncScripts = document.querySelectorAll('script[data-async]');
    asyncScripts.forEach(script => {
      script.async = true;
    });
  }

  // Monitoring du réseau
  monitorNetworkPerformance() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      this.metrics.networkLatency = connection.rtt || 0;
      
      connection.addEventListener('change', () => {
        this.metrics.networkLatency = connection.rtt || 0;
        this.adaptToNetworkConditions(connection);
      });
    }
  }

  // Adaptation aux conditions réseau
  adaptToNetworkConditions(connection) {
    const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                           connection.effectiveType === '2g' || 
                           connection.saveData;

    if (isSlowConnection) {
      this.enableDataSaverMode();
    } else {
      this.disableDataSaverMode();
    }
  }

  // Mode économiseur de données
  enableDataSaverMode() {
    // Désactiver les animations
    document.body.classList.add('data-saver');
    
    // Charger des images de plus faible qualité
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const src = img.dataset.src;
      img.dataset.src = src.replace('/high/', '/low/');
    });
    
    // Désactiver le préchargement
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    preloadLinks.forEach(link => link.remove());
  }

  // Désactiver le mode économiseur de données
  disableDataSaverMode() {
    document.body.classList.remove('data-saver');
    // Recharger les images haute qualité si nécessaire
  }

  // Vérification de l'utilisation mémoire
  checkMemoryUsage() {
    const memoryMB = this.metrics.memoryUsage / 1024 / 1024;
    
    if (memoryMB > 100) { // Si plus de 100MB
      this.optimizeMemory();
    }
  }

  // Optimisation de la mémoire
  optimizeMemory() {
    // Nettoyer le cache
    this.cleanupCache();
    
    // Libérer les objets inutilisés
    if (window.gc) {
      window.gc();
    }
    
    console.log('🧹 Memory optimization performed');
  }

  // Nettoyage du cache
  cleanupCache() {
    const now = Date.now();
    const cacheKeysToDelete = [];

    this.cache.forEach((value, key) => {
      if (value.expiry && value.expiry < now) {
        cacheKeysToDelete.push(key);
      }
    });

    cacheKeysToDelete.forEach(key => this.cache.delete(key));
    console.log(`🗑️ Cleaned up ${cacheKeysToDelete.length} expired cache entries`);
  }

  // Chargement du contenu différé
  loadContent(element) {
    const contentType = element.dataset.lazy;
    
    switch (contentType) {
      case 'image':
        this.loadLazyImage(element);
        break;
      case 'component':
        this.loadLazyComponent(element);
        break;
      case 'data':
        this.loadLazyData(element);
        break;
    }
  }

  // Chargement d'image différée
  loadLazyImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.classList.add('loaded');
    }
  }

  // Chargement de composant différé
  async loadLazyComponent(container) {
    const componentName = container.dataset.component;
    
    try {
      const module = await import(`./components/${componentName}.js`);
      const component = new module.default();
      container.innerHTML = component.render();
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
    }
  }

  // Chargement de données différées
  async loadLazyData(element) {
    const dataSource = element.dataset.source;
    
    try {
      const response = await fetch(dataSource);
      const data = await response.json();
      
      if (element.dataset.render) {
        this.renderData(element, data);
      }
    } catch (error) {
      console.error(`Failed to load data from ${dataSource}:`, error);
    }
  }

  // Rendu des données
  renderData(element, data) {
    const renderFunction = element.dataset.render;
    
    switch (renderFunction) {
      case 'table':
        this.renderTable(element, data);
        break;
      case 'chart':
        this.renderChart(element, data);
        break;
      case 'list':
        this.renderList(element, data);
        break;
    }
  }

  // Rendu de tableau
  renderTable(container, data) {
    let html = '<table class="table"><thead><tr>';
    
    // En-têtes
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        html += `<th>${key}</th>`;
      });
      html += '</tr></thead><tbody>';
      
      // Données
      data.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(value => {
          html += `<td>${value}</td>`;
        });
        html += '</tr>';
      });
    }
    
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  // Rendu de liste
  renderList(container, data) {
    let html = '<ul class="data-list">';
    
    data.forEach(item => {
      html += `<li>${JSON.stringify(item)}</li>`;
    });
    
    html += '</ul>';
    container.innerHTML = html;
  }

  // Obtenir les métriques de performance
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      timestamp: Date.now()
    };
  }

  // Optimisation automatique
  startAutoOptimization() {
    if (this.isOptimizing) return;
    
    this.isOptimizing = true;
    
    setInterval(() => {
      this.optimizeMemory();
      this.cleanupCache();
      this.updateMetrics();
    }, 60000); // Toutes les minutes
  }

  // Mise à jour des métriques
  updateMetrics() {
    // Calculer le taux de succès du cache
    const totalRequests = performance.getEntriesByType('resource').length;
    const cachedRequests = performance.getEntriesByType('resource').filter(
      entry => entry.transferSize === 0
    ).length;
    
    this.metrics.cacheHitRate = totalRequests > 0 ? (cachedRequests / totalRequests) * 100 : 0;
    
    console.log('📊 Performance metrics updated:', this.getMetrics());
  }
}

// ─── MONITORING EN TEMPS RÉEL ───────────────────────────────────────────
export class RealTimeMonitor {
  constructor() {
    this.alerts = [];
    this.thresholds = {
      memoryUsage: 100 * 1024 * 1024, // 100MB
      pageLoadTime: 3000, // 3 seconds
      cacheHitRate: 80 // 80%
    };
    this.init();
  }

  init() {
    this.setupAlerts();
    this.setupPerformanceTracking();
    console.log('📡 Real-time Monitor initialized');
  }

  setupAlerts() {
    // Alertes de performance
    setInterval(() => {
      this.checkPerformanceAlerts();
    }, 10000); // Toutes les 10 secondes
  }

  setupPerformanceTracking() {
    // Observer les changements de performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.trackPerformanceEntry(entry);
        });
      });
      
      observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
    }
  }

  trackPerformanceEntry(entry) {
    if (entry.duration > this.thresholds.pageLoadTime) {
      this.addAlert('slow-load', `Slow loading detected: ${entry.duration}ms`, 'warning');
    }
  }

  checkPerformanceAlerts() {
    if (performance.memory) {
      const memoryUsage = performance.memory.usedJSHeapSize;
      if (memoryUsage > this.thresholds.memoryUsage) {
        this.addAlert('high-memory', `High memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`, 'error');
      }
    }
  }

  addAlert(type, message, severity = 'info') {
    const alert = {
      id: Date.now(),
      type,
      message,
      severity,
      timestamp: new Date().toISOString()
    };
    
    this.alerts.push(alert);
    this.showAlert(alert);
    
    // Nettoyer les anciennes alertes
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  showAlert(alert) {
    // Afficher l'alerte dans l'interface
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${alert.severity}`;
    alertElement.innerHTML = `
      <strong>${alert.type}:</strong> ${alert.message}
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    const container = document.querySelector('.alerts-container') || document.body;
    container.appendChild(alertElement);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
      if (alertElement.parentElement) {
        alertElement.remove();
      }
    }, 5000);
  }

  getAlerts() {
    return this.alerts;
  }
}

// Initialisation globale
window.performanceOptimizer = new PerformanceOptimizer();
window.realTimeMonitor = new RealTimeMonitor();

// Démarrer l'optimisation automatique
window.performanceOptimizer.startAutoOptimization();

console.log('⚡ Performance monitoring and optimization system loaded');
