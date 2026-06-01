/* ════════════════════════════════════════════════════════════
   AVICO-PRO - GESTIONNAIRE DE VERSION
   Système complet de gestion des versions et des mises à jour
   ═══════════════════════════════════════════════════════════ */

class VersionManager {
  constructor() {
    this.versions = {
      current: '2.1.0',
      available: '2.1.1',
      previous: ['2.0.9', '2.0.8', '2.0.7']
    };
    
    this.updateConfig = {
      autoCheck: true,
      checkInterval: 3600000, // 1 heure
      showNotifications: true,
      autoInstall: false
    };
    
    this.init();
  }

  // Initialisation du gestionnaire de version
  init() {
    console.log('🔧 Initialisation du gestionnaire de version...');
    
    // Mettre à jour le numéro de version
    this.updateVersionNumber();
    
    // Ajouter les informations de version dans l'interface
    this.addVersionInfo();
    
    // Créer le panneau de contrôle des versions
    this.createVersionControlPanel();
    
    // Configurer les mises à jour automatiques
    this.setupAutoUpdates();
    
    console.log(`✅ Version ${this.versions.current} initialisée`);
  }

  // Mettre à jour le numéro de version
  updateVersionNumber() {
    // Mettre à jour les éléments existants
    const versionElements = document.querySelectorAll('.app-version');
    versionElements.forEach(el => {
      el.textContent = this.versions.current;
    });
    
    // Ajouter la version dans le meta
    let versionMeta = document.querySelector('meta[name="version"]');
    if (!versionMeta) {
      versionMeta = document.createElement('meta');
      versionMeta.name = 'version';
      document.head.appendChild(versionMeta);
    }
    versionMeta.content = this.versions.current;
  }

  // Ajouter les informations de version dans l'interface
  addVersionInfo() {
    // Ajouter dans le header si existe
    const header = document.querySelector('.header, header');
    if (header) {
      const versionBadge = document.createElement('div');
      versionBadge.className = 'version-badge';
      versionBadge.innerHTML = `
        <span style="
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
          margin-left: 10px;
        ">v${this.versions.current}</span>
      `;
      header.appendChild(versionBadge);
    }
  }

  // Créer le panneau de contrôle des versions
  createVersionControlPanel() {
    if (document.getElementById('version-control-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'version-control-panel';
    panel.innerHTML = `
      <div style="
        position: fixed;
        top: 800px;
        right: 10px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 99995;
        max-width: 320px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      ">
        <div style="font-weight: bold; margin-bottom: 10px; color: #ffffff; font-size: 14px;">
          🔧 GESTIONNAIRE DE VERSION
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong>Version actuelle:</strong>
          <div id="current-version" style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">
            v${this.versions.current}
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Version disponible:</strong>
          <div id="available-version" style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">
            v${this.versions.available}
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Historique:</strong>
          <div id="version-history" style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">
            ${this.versions.previous.slice(0, 3).map(v => `v${v}`).join(', ')}
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Configuration:</strong>
          <div style="margin-top: 8px; font-size: 11px;">
            <div>✅ Auto-check: ${this.updateConfig.autoCheck ? 'ON' : 'OFF'}</div>
            <div>✅ Notifications: ${this.updateConfig.showNotifications ? 'ON' : 'OFF'}</div>
            <div>✅ Auto-install: ${this.updateConfig.autoInstall ? 'ON' : 'OFF'}</div>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Actions:</strong>
          <div style="margin-top: 8px;">
            <button onclick="versionManager.checkForUpdates()" style="background: #4CAF50; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-right: 5px; margin-bottom: 5px; width: 100%; font-size: 11px;">🔍 Vérifier</button>
            <button onclick="versionManager.simulateUpdate()" style="background: #2196F3; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-right: 5px; margin-bottom: 5px; width: 100%; font-size: 11px;">🔄 Simuler MAJ</button>
            <button onclick="versionManager.showVersionDetails()" style="background: #FF9800; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-bottom: 5px; width: 100%; font-size: 11px;">📋 Détails</button>
            <button onclick="versionManager.toggleAutoUpdate()" style="background: #9C27B0; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; width: 100%; font-size: 11px;">⚙️ Auto-MAJ</button>
          </div>
        </div>

        <div style="margin-bottom: 10px;">
          <strong>Statut:</strong>
          <div id="version-status" style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">
            ✅ Application à jour
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
  }

  // Configurer les mises à jour automatiques
  setupAutoUpdates() {
    if (this.updateConfig.autoCheck) {
      setInterval(() => {
        this.checkForUpdates();
      }, this.updateConfig.checkInterval);
    }
  }

  // Vérifier les mises à jour
  checkForUpdates() {
    console.log('🔍 Vérification des mises à jour...');
    
    const statusEl = document.getElementById('version-status');
    if (statusEl) {
      statusEl.textContent = '🔍 Vérification en cours...';
      statusEl.style.background = 'rgba(255,193,7,0.2)';
    }
    
    // Simuler une vérification
    setTimeout(() => {
      const hasUpdate = Math.random() > 0.6; // 40% de chance d'avoir une mise à jour
      
      if (hasUpdate) {
        this.versions.available = '2.1.2';
        this.updateAvailableVersion();
        
        if (statusEl) {
          statusEl.textContent = '🔄 Mise à jour disponible';
          statusEl.style.background = 'rgba(76,175,80,0.2)';
        }
        
        if (this.updateConfig.showNotifications) {
          this.showUpdateNotification();
        }
      } else {
        if (statusEl) {
          statusEl.textContent = '✅ Application à jour';
          statusEl.style.background = 'rgba(255,255,255,0.1)';
        }
      }
    }, 2000);
  }

  // Mettre à jour la version disponible
  updateAvailableVersion() {
    const availableEl = document.getElementById('available-version');
    if (availableEl) {
      availableEl.textContent = `v${this.versions.available}`;
      availableEl.style.background = 'rgba(76,175,80,0.2)';
    }
  }

  // Afficher la notification de mise à jour
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      padding: 20px;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      z-index: 99999;
      max-width: 350px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 20px;
        ">🔄</div>
        <div>
          <div style="font-weight: bold; font-size: 16px;">Mise à jour disponible</div>
          <div style="font-size: 12px; opacity: 0.9;">Version ${this.versions.available}</div>
        </div>
      </div>
      <div style="margin-bottom: 15px; font-size: 13px;">
        Nouveautés et améliorations de performance...
      </div>
      <div style="display: flex; gap: 10px;">
        <button onclick="versionManager.installUpdate()" style="
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          flex: 1;
        ">Installer</button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: rgba(255,255,255,0.1);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          flex: 1;
        ">Ignorer</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-suppression après 10 secondes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 10000);
  }

  // Simuler une mise à jour
  simulateUpdate() {
    console.log('🔄 Simulation de mise à jour...');
    
    const statusEl = document.getElementById('version-status');
    if (statusEl) {
      statusEl.textContent = '🔄 Installation en cours...';
      statusEl.style.background = 'rgba(33,150,243,0.2)';
    }
    
    // Simuler les étapes d'installation
    const steps = [
      'Téléchargement...',
      'Vérification...',
      'Installation...',
      'Finalisation...'
    ];
    
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      if (statusEl && currentStep < steps.length) {
        statusEl.textContent = `🔄 ${steps[currentStep]}`;
        currentStep++;
      } else {
        clearInterval(stepInterval);
        
        // Mettre à jour la version
        this.versions.previous.unshift(this.versions.current);
        this.versions.current = this.versions.available;
        this.versions.available = '2.1.3';
        
        // Mettre à jour l'interface
        this.updateVersionNumber();
        this.updateVersionInfo();
        
        if (statusEl) {
          statusEl.textContent = '✅ Mise à jour terminée';
          statusEl.style.background = 'rgba(76,175,80,0.2)';
        }
        
        // Afficher le succès
        this.showUpdateSuccess();
        
        // Recharger la page après 2 secondes
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }, 1500);
  }

  // Mettre à jour les informations de version dans le panneau
  updateVersionInfo() {
    const currentEl = document.getElementById('current-version');
    const availableEl = document.getElementById('available-version');
    const historyEl = document.getElementById('version-history');
    
    if (currentEl) {
      currentEl.textContent = `v${this.versions.current}`;
    }
    
    if (availableEl) {
      availableEl.textContent = `v${this.versions.available}`;
      availableEl.style.background = 'rgba(255,255,255,0.1)';
    }
    
    if (historyEl) {
      historyEl.textContent = this.versions.previous.slice(0, 3).map(v => `v${v}`).join(', ');
    }
  }

  // Afficher le succès de la mise à jour
  showUpdateSuccess() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      padding: 20px;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      z-index: 99999;
      max-width: 350px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    
    successDiv.innerHTML = `
      <div style="display: flex; align-items: center;">
        <div style="
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 20px;
        ">✅</div>
        <div>
          <div style="font-weight: bold; font-size: 16px;">Mise à jour réussie</div>
          <div style="font-size: 12px; opacity: 0.9;">Version ${this.versions.current}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      successDiv.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv);
        }
      }, 300);
    }, 3000);
  }

  // Afficher les détails de version
  showVersionDetails() {
    const details = {
      '2.1.0': {
        date: '2026-03-31',
        features: [
          'Correction du problème d\'affichage du montant reçu',
          'Amélioration de la performance mobile',
          'Nouveaux scripts de correction automatique',
          'Mise à jour de sécurité'
        ],
        fixes: [
          'Fix input paiement',
          'Optimisation responsive',
          'Stabilité Firebase'
        ]
      },
      '2.0.9': {
        date: '2026-03-15',
        features: ['Dashboard analytics amélioré'],
        fixes: ['Correction bugs UI']
      },
      '2.0.8': {
        date: '2026-03-01',
        features: ['Nouveaux rapports'],
        fixes: ['Performance optimisée']
      }
    };
    
    console.group('📋 DÉTAILS DES VERSIONS');
    Object.entries(details).forEach(([version, info]) => {
      console.log(`\n🔸 Version ${version} (${info.date})`);
      console.log('📦 Features:', info.features);
      console.log('🔧 Fixes:', info.fixes);
    });
    console.groupEnd();
    
    this.showNotification('Détails des versions affichés dans la console', 'info');
  }

  // Basculer les mises à jour automatiques
  toggleAutoUpdate() {
    this.updateConfig.autoCheck = !this.updateConfig.autoCheck;
    
    const statusText = this.updateConfig.autoCheck ? 'activées' : 'désactivées';
    console.log(`⚙️ Mises à jour automatiques ${statusText}`);
    
    this.showNotification(`Mises à jour automatiques ${statusText}`, 'success');
    
    // Mettre à jour l'affichage
    this.createVersionControlPanel(); // Recréer le panneau pour mettre à jour l'affichage
  }

  // Installer la mise à jour
  installUpdate() {
    console.log('🔄 Installation de la mise à jour...');
    this.simulateUpdate();
  }

  // Afficher une notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      z-index: 99999;
      font-family: monospace;
      font-size: 14px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    switch (type) {
      case 'success':
        notification.style.background = '#4CAF50';
        break;
      case 'warning':
        notification.style.background = '#FF9800';
        break;
      case 'error':
        notification.style.background = '#f44336';
        break;
      default:
        notification.style.background = '#2196F3';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Obtenir les informations de version
  getVersionInfo() {
    return {
      current: this.versions.current,
      available: this.versions.available,
      previous: this.versions.previous,
      config: this.updateConfig
    };
  }
}

// Initialisation globale
let versionManager;

document.addEventListener('DOMContentLoaded', () => {
  // Attendre 1 seconde pour que les autres scripts soient chargés
  setTimeout(() => {
    versionManager = new VersionManager();
    window.versionManager = versionManager;
    
    // Fonctions globales
    window.checkAppVersion = () => versionManager.checkForUpdates();
    window.getVersionInfo = () => versionManager.getVersionInfo();
    
    console.log('✅ Gestionnaire de version prêt');
  }, 1000);
});

// Exporter
if (typeof window !== 'undefined') {
  window.VersionManager = VersionManager;
}
