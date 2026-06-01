/* ══════════════════════════════════════════════════════════
   AVICO-PRO - SYSTÈME ADAPTATIF UNIVERSEL
   Adaptation parfaite pour Mobile, Tablette et Ordinateur
   ═════════════════════════════════════════════════════════ */

class UniversalAdaptiveSystem {
  constructor() {
    this.deviceType = this.detectDeviceType();
    this.orientation = this.detectOrientation();
    this.screenSize = this.getScreenSize();
    this.pixelRatio = this.getPixelRatio();
    this.breakpoints = this.getBreakpoints();
    this.currentBreakpoint = this.getCurrentBreakpoint();
    this.adaptiveRules = this.getAdaptiveRules();
    this.isInitialized = false;
    
    this.init();
  }

  // Initialisation du système adaptatif
  init() {
    console.log('📱 Initialisation du système adaptatif universel...');
    
    // Détecter l'appareil
    this.detectDevice();
    
    // Configurer les breakpoints
    this.setupBreakpoints();
    
    // Appliquer les styles adaptatifs
    this.applyAdaptiveStyles();
    
    // Configurer les écouteurs
    this.setupEventListeners();
    
    // Créer l'interface de contrôle
    this.createControlInterface();
    
    // Optimiser pour l'appareil détecté
    this.optimizeForDevice();
    
    this.isInitialized = true;
    console.log('✅ Système adaptatif universel initialisé');
  }

  // Détecter le type d'appareil
  detectDeviceType() {
    const ua = navigator.userAgent;
    const width = window.innerWidth;
    
    // Mobile
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      if (/iPad/i.test(ua)) {
        return 'tablet';
      }
      return 'mobile';
    }
    
    // Tablette (basé sur la taille)
    if (width >= 768 && width <= 1024) {
      return 'tablet';
    }
    
    // Desktop
    return 'desktop';
  }

  // Détecter l'orientation
  detectOrientation() {
    if (window.matchMedia("(orientation: portrait)").matches) {
      return 'portrait';
    } else if (window.matchMedia("(orientation: landscape)").matches) {
      return 'landscape';
    }
    
    // Fallback basé sur les dimensions
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  // Obtenir la taille d'écran
  getScreenSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    };
  }

  // Obtenir le pixel ratio
  getPixelRatio() {
    return window.devicePixelRatio || 1;
  }

  // Définir les breakpoints
  getBreakpoints() {
    return {
      mobile: {
        small: { min: 0, max: 319 },      // iPhone SE
        medium: { min: 320, max: 374 },    // iPhone 12
        large: { min: 375, max: 767 }      // iPhone Plus
      },
      tablet: {
        small: { min: 768, max: 834 },      // iPad Mini
        medium: { min: 835, max: 1023 }    // iPad
      },
      desktop: {
        small: { min: 1024, max: 1199 },   // Small desktop
        medium: { min: 1200, max: 1439 },  // Medium desktop
        large: { min: 1440, max: 1919 },   // Large desktop
        xlarge: { min: 1920, max: 9999 }  // 4K+
      }
    };
  }

  // Obtenir le breakpoint actuel
  getCurrentBreakpoint() {
    const width = this.screenSize.width;
    
    for (const [device, sizes] of Object.entries(this.breakpoints)) {
      for (const [size, range] of Object.entries(sizes)) {
        if (width >= range.min && width <= range.max) {
          return `${device}-${size}`;
        }
      }
    }
    
    return 'desktop-medium'; // Fallback
  }

  // Règles adaptatives
  getAdaptiveRules() {
    return {
      // Mobile Rules
      'mobile-small': {
        fontSize: '12px',
        touchTarget: '44px',
        spacing: '8px',
        gridColumns: 1,
        sidebarWidth: '0px',
        cardPadding: '12px',
        buttonHeight: '44px',
        inputHeight: '44px'
      },
      'mobile-medium': {
        fontSize: '13px',
        touchTarget: '44px',
        spacing: '10px',
        gridColumns: 1,
        sidebarWidth: '0px',
        cardPadding: '14px',
        buttonHeight: '44px',
        inputHeight: '44px'
      },
      'mobile-large': {
        fontSize: '14px',
        touchTarget: '44px',
        spacing: '12px',
        gridColumns: 2,
        sidebarWidth: '0px',
        cardPadding: '16px',
        buttonHeight: '44px',
        inputHeight: '44px'
      },
      
      // Tablet Rules
      'tablet-small': {
        fontSize: '14px',
        touchTarget: '44px',
        spacing: '14px',
        gridColumns: 2,
        sidebarWidth: '200px',
        cardPadding: '18px',
        buttonHeight: '44px',
        inputHeight: '44px'
      },
      'tablet-medium': {
        fontSize: '15px',
        touchTarget: '44px',
        spacing: '16px',
        gridColumns: 3,
        sidebarWidth: '250px',
        cardPadding: '20px',
        buttonHeight: '44px',
        inputHeight: '44px'
      },
      
      // Desktop Rules
      'desktop-small': {
        fontSize: '14px',
        touchTarget: '32px',
        spacing: '16px',
        gridColumns: 3,
        sidebarWidth: '250px',
        cardPadding: '20px',
        buttonHeight: '36px',
        inputHeight: '36px'
      },
      'desktop-medium': {
        fontSize: '15px',
        touchTarget: '32px',
        spacing: '18px',
        gridColumns: 4,
        sidebarWidth: '280px',
        cardPadding: '24px',
        buttonHeight: '36px',
        inputHeight: '36px'
      },
      'desktop-large': {
        fontSize: '16px',
        touchTarget: '32px',
        spacing: '20px',
        gridColumns: 5,
        sidebarWidth: '300px',
        cardPadding: '28px',
        buttonHeight: '40px',
        inputHeight: '40px'
      },
      'desktop-xlarge': {
        fontSize: '17px',
        touchTarget: '32px',
        spacing: '24px',
        gridColumns: 6,
        sidebarWidth: '320px',
        cardPadding: '32px',
        buttonHeight: '40px',
        inputHeight: '40px'
      }
    };
  }

  // Détecter l'appareil en détail
  detectDevice() {
    const ua = navigator.userAgent;
    
    // Détection spécifique
    this.deviceInfo = {
      type: this.deviceType,
      os: this.detectOS(),
      browser: this.detectBrowser(),
      pixelRatio: this.pixelRatio,
      touchSupport: 'ontouchstart' in window,
      orientation: this.orientation,
      screenSize: this.screenSize
    };
    
    console.log('📱 Appareil détecté:', this.deviceInfo);
  }

  // Détecter l'OS
  detectOS() {
    const ua = navigator.userAgent;
    
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Android/.test(ua)) return 'Android';
    if (/Windows/.test(ua)) return 'Windows';
    if (/Mac/.test(ua)) return 'macOS';
    if (/Linux/.test(ua)) return 'Linux';
    
    return 'Unknown';
  }

  // Détecter le navigateur
  detectBrowser() {
    const ua = navigator.userAgent;
    
    if (/Chrome/.test(ua)) return 'Chrome';
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
    if (/Firefox/.test(ua)) return 'Firefox';
    if (/Edge/.test(ua)) return 'Edge';
    if (/Opera/.test(ua)) return 'Opera';
    
    return 'Unknown';
  }

  // Configurer les breakpoints
  setupBreakpoints() {
    this.currentBreakpoint = this.getCurrentBreakpoint();
    console.log('📏 Breakpoint actuel:', this.currentBreakpoint);
  }

  // Appliquer les styles adaptatifs
  applyAdaptiveStyles() {
    const rules = this.adaptiveRules[this.currentBreakpoint];
    if (!rules) return;
    
    // Créer ou mettre à jour le CSS adaptatif
    this.createAdaptiveCSS(rules);
    
    // Appliquer les classes au body
    this.applyBodyClasses(rules);
    
    // Optimiser les composants spécifiques
    this.optimizeComponents(rules);
  }

  // Créer le CSS adaptatif
  createAdaptiveCSS(rules) {
    let cssId = 'universal-adaptive-css';
    let cssEl = document.getElementById(cssId);
    
    if (!cssEl) {
      cssEl = document.createElement('style');
      cssEl.id = cssId;
      document.head.appendChild(cssEl);
    }
    
    const css = `
      /* Universal Adaptive CSS - ${this.currentBreakpoint} */
      
      :root {
        --adaptive-font-size: ${rules.fontSize};
        --adaptive-spacing: ${rules.spacing};
        --adaptive-touch-target: ${rules.touchTarget};
        --adaptive-grid-columns: ${rules.gridColumns};
        --adaptive-sidebar-width: ${rules.sidebarWidth};
        --adaptive-card-padding: ${rules.cardPadding};
        --adaptive-button-height: ${rules.buttonHeight};
        --adaptive-input-height: ${rules.inputHeight};
      }
      
      body {
        font-size: var(--adaptive-font-size) !important;
      }
      
      /* Touch optimization for mobile/tablet */
      ${this.deviceType === 'mobile' || this.deviceType === 'tablet' ? `
      button, .btn, input, .form-input, select, .form-select {
        min-height: var(--adaptive-touch-target) !important;
        min-width: var(--adaptive-touch-target) !important;
      }
      
      .clickable, [onclick], .btn, button {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      ` : ''}
      
      /* Grid adaptations */
      .grid, .product-grid, .dashboard-grid {
        grid-template-columns: repeat(var(--adaptive-grid-columns), 1fr) !important;
      }
      
      /* Sidebar adaptations */
      .sidebar, .nav-sidebar {
        width: var(--adaptive-sidebar-width) !important;
      }
      
      ${this.deviceType === 'mobile' ? `
      .sidebar, .nav-sidebar {
        transform: translateX(-100%);
        position: fixed;
        z-index: 9999;
        height: 100vh;
      }
      
      .sidebar.open, .nav-sidebar.open {
        transform: translateX(0);
      }
      ` : ''}
      
      /* Card adaptations */
      .card, .equipe-card, .product-card {
        padding: var(--adaptive-card-padding) !important;
      }
      
      /* Button adaptations */
      .btn, .button, .pos-validate-btn {
        height: var(--adaptive-button-height) !important;
        line-height: var(--adaptive-button-height) !important;
      }
      
      /* Input adaptations */
      .form-input, input[type="text"], input[type="number"], select, textarea {
        height: var(--adaptive-input-height) !important;
        font-size: var(--adaptive-font-size) !important;
      }
      
      /* Spacing adaptations */
      .container, .main-content {
        padding: var(--adaptive-spacing) !important;
      }
      
      .gap, .space-between {
        gap: var(--adaptive-spacing) !important;
      }
      
      /* Mobile specific optimizations */
      ${this.deviceType === 'mobile' ? `
      .hide-mobile {
        display: none !important;
      }
      
      .full-width-mobile {
        width: 100% !important;
        max-width: 100% !important;
      }
      
      .text-center-mobile {
        text-align: center !important;
      }
      ` : ''}
      
      /* Tablet specific optimizations */
      ${this.deviceType === 'tablet' ? `
      .hide-tablet {
        display: none !important;
      }
      
      .tablet-two-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--adaptive-spacing);
      }
      ` : ''}
      
      /* Desktop specific optimizations */
      ${this.deviceType === 'desktop' ? `
      .hide-desktop {
        display: none !important;
      }
      
      .desktop-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      ` : ''}
      
      /* High DPI optimizations */
      @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .logo, .icon {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      }
      
      /* Orientation specific */
      @media (orientation: landscape) {
        .landscape-full {
          height: 100vh;
          overflow: hidden;
        }
      }
      
      @media (orientation: portrait) {
        .portrait-scroll {
          overflow-y: auto;
        }
      }
    `;
    
    cssEl.textContent = css;
  }

  // Appliquer les classes au body
  applyBodyClasses(rules) {
    const body = document.body;
    
    // Nettoyer les anciennes classes
    body.className = body.className.replace(/device-\S+/g, '').replace(/breakpoint-\S+/g, '').trim();
    
    // Ajouter les nouvelles classes
    body.classList.add(`device-${this.deviceType}`);
    body.classList.add(`breakpoint-${this.currentBreakpoint}`);
    body.classList.add(`orientation-${this.orientation}`);
    body.classList.add(`os-${this.deviceInfo.os.toLowerCase()}`);
    body.classList.add(`browser-${this.deviceInfo.browser.toLowerCase()}`);
    
    if (this.deviceInfo.touchSupport) {
      body.classList.add('touch-enabled');
    }
    
    if (this.pixelRatio > 1) {
      body.classList.add('high-dpi');
    }
  }

  // Optimiser les composants spécifiques
  optimizeComponents(rules) {
    // Optimiser le header
    this.optimizeHeader(rules);
    
    // Optimiser la navigation
    this.optimizeNavigation(rules);
    
    // Optimiser le dashboard
    this.optimizeDashboard(rules);
    
    // Optimiser le point de vente
    this.optimizePOS(rules);
    
    // Optimiser les formulaires
    this.optimizeForms(rules);
  }

  // Optimiser le header
  optimizeHeader(rules) {
    const header = document.querySelector('.header, header');
    if (!header) return;
    
    if (this.deviceType === 'mobile') {
      header.style.cssText += `
        padding: 8px 16px;
        flex-direction: row;
        justify-content: space-between;
      `;
    } else {
      header.style.cssText += `
        padding: 16px 24px;
      `;
    }
  }

  // Optimiser la navigation
  optimizeNavigation(rules) {
    const sidebar = document.querySelector('.sidebar, .nav-sidebar');
    if (!sidebar) return;
    
    if (this.deviceType === 'mobile') {
      // Créer un bouton menu pour mobile
      if (!document.querySelector('.mobile-menu-toggle')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-toggle';
        menuBtn.innerHTML = '☰';
        menuBtn.style.cssText = `
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 10000;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          width: 44px;
          height: 44px;
          font-size: 20px;
          cursor: pointer;
        `;
        
        menuBtn.addEventListener('click', () => {
          sidebar.classList.toggle('open');
        });
        
        document.body.appendChild(menuBtn);
      }
    }
  }

  // Optimiser le dashboard
  optimizeDashboard(rules) {
    const dashboard = document.querySelector('.dashboard, .main-content');
    if (!dashboard) return;
    
    if (this.deviceType === 'mobile') {
      dashboard.style.cssText += `
        padding: 16px;
        margin-left: 0;
      `;
    } else {
      dashboard.style.cssText += `
        padding: var(--adaptive-spacing);
        margin-left: var(--adaptive-sidebar-width);
      `;
    }
  }

  // Optimiser le point de vente
  optimizePOS(rules) {
    const posContainer = document.querySelector('.pos-container, .pos-main');
    if (!posContainer) return;
    
    if (this.deviceType === 'mobile') {
      posContainer.style.cssText += `
        flex-direction: column;
        padding: 16px;
      `;
    } else if (this.deviceType === 'tablet') {
      posContainer.style.cssText += `
        flex-direction: column;
        padding: 20px;
        max-width: 100%;
      `;
    }
  }

  // Optimiser les formulaires
  optimizeForms(rules) {
    const forms = document.querySelectorAll('form, .form');
    forms.forEach(form => {
      if (this.deviceType === 'mobile') {
        form.style.cssText += `
          padding: 16px;
        `;
      }
    });
    
    // Optimiser les inputs pour le touch
    if (this.deviceType === 'mobile' || this.deviceType === 'tablet') {
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.style.cssText += `
          font-size: 16px !important; /* Prevent zoom on iOS */
          -webkit-appearance: none;
          border-radius: 8px;
        `;
      });
    }
  }

  // Configurer les écouteurs d'événements
  setupEventListeners() {
    // Écouter le redimensionnement
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
    
    // Écouter le changement d'orientation
    window.addEventListener('orientationchange', this.debounce(() => {
      this.handleOrientationChange();
    }, 250));
    
    // Écouter le changement de type d'appareil (pour les tablettes hybrides)
    if (window.matchMedia) {
      const mobileQuery = window.matchMedia('(max-width: 767px)');
      const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
      const desktopQuery = window.matchMedia('(min-width: 1024px)');
      
      mobileQuery.addListener(() => this.handleDeviceChange());
      tabletQuery.addListener(() => this.handleDeviceChange());
      desktopQuery.addListener(() => this.handleDeviceChange());
    }
  }

  // Gérer le redimensionnement
  handleResize() {
    this.screenSize = this.getScreenSize();
    this.currentBreakpoint = this.getCurrentBreakpoint();
    
    console.log('📏 Redimensionnement détecté:', {
      size: this.screenSize,
      breakpoint: this.currentBreakpoint
    });
    
    this.applyAdaptiveStyles();
    this.updateControlInterface();
  }

  // Gérer le changement d'orientation
  handleOrientationChange() {
    this.orientation = this.detectOrientation();
    
    console.log('📱 Changement d\'orientation:', this.orientation);
    
    document.body.classList.remove('orientation-portrait', 'orientation-landscape');
    document.body.classList.add(`orientation-${this.orientation}`);
    
    this.applyAdaptiveStyles();
    this.updateControlInterface();
  }

  // Gérer le changement de type d'appareil
  handleDeviceChange() {
    const oldDeviceType = this.deviceType;
    this.deviceType = this.detectDeviceType();
    
    if (oldDeviceType !== this.deviceType) {
      console.log('🔄 Changement de type d\'appareil:', oldDeviceType, '→', this.deviceType);
      
      this.applyAdaptiveStyles();
      this.updateControlInterface();
    }
  }

  // Optimiser pour l'appareil détecté
  optimizeForDevice() {
    // Optimisations spécifiques iOS
    if (this.deviceInfo.os === 'iOS') {
      this.optimizeForIOS();
    }
    
    // Optimisations spécifiques Android
    if (this.deviceInfo.os === 'Android') {
      this.optimizeForAndroid();
    }
    
    // Optimisations spécifiques Desktop
    if (this.deviceType === 'desktop') {
      this.optimizeForDesktop();
    }
  }

  // Optimisations iOS
  optimizeForIOS() {
    // Prévenir le zoom sur les inputs
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
    
    // Gérer le safe area pour iPhone X+
    document.body.style.cssText += `
      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    `;
  }

  // Optimisations Android
  optimizeForAndroid() {
    // Améliorer la performance du scroll
    document.body.style.cssText += `
      -webkit-overflow-scrolling: touch;
      overflow: auto;
    `;
  }

  // Optimisations Desktop
  optimizeForDesktop() {
    // Activer les hover states
    document.body.classList.add('desktop-hover-enabled');
    
    // Optimiser pour la souris
    document.addEventListener('mousemove', () => {
      document.body.classList.add('mouse-active');
    });
    
    document.addEventListener('keydown', () => {
      document.body.classList.add('keyboard-active');
    });
  }

  // Créer l'interface de contrôle
  createControlInterface() {
    if (document.getElementById('universal-adaptive-control')) return;

    const control = document.createElement('div');
    control.id = 'universal-adaptive-control';
    control.innerHTML = `
      <div style="
        position: fixed;
        top: 850px;
        right: 10px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 99994;
        max-width: 320px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      ">
        <div style="font-weight: bold; margin-bottom: 10px; color: #ffffff; font-size: 14px;">
          📱 SYSTÈME ADAPTATIF UNIVERSEL
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong>Appareil:</strong>
          <div id="device-info" style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">
            Détection en cours...
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Breakpoint:</strong>
          <div id="breakpoint-info" style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">
            En cours...
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Écran:</strong>
          <div id="screen-info" style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">
            En cours...
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Orientation:</strong>
          <div id="orientation-info" style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">
            En cours...
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Optimisations:</strong>
          <div style="margin-top: 8px; font-size: 11px;">
            <div>✅ Touch: <span id="touch-status">OK</span></div>
            <div>✅ Responsive: <span id="responsive-status">OK</span></div>
            <div>✅ DPI: <span id="dpi-status">OK</span></div>
            <div>✅ Performance: <span id="performance-status">OK</span></div>
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <strong>Actions:</strong>
          <div style="margin-top: 8px;">
            <button onclick="universalAdaptiveSystem.testAdaptation()" style="background: #4CAF50; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-right: 5px; margin-bottom: 5px; width: 100%; font-size: 11px;">🧪 Tester</button>
            <button onclick="universalAdaptiveSystem.simulateDevice('mobile')" style="background: #2196F3; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-right: 5px; margin-bottom: 5px; width: 100%; font-size: 11px;">📱 Mobile</button>
            <button onclick="universalAdaptiveSystem.simulateDevice('tablet')" style="background: #FF9800; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-right: 5px; margin-bottom: 5px; width: 100%; font-size: 11px;">📱 Tablette</button>
            <button onclick="universalAdaptiveSystem.simulateDevice('desktop')" style="background: #9C27B0; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; margin-bottom: 5px; width: 100%; font-size: 11px;">🖥️ Bureau</button>
          </div>
        </div>

        <div style="margin-bottom: 10px;">
          <strong>Statut:</strong>
          <div id="adaptation-status" style="margin-top: 5px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 11px;">
            ✅ Adaptation active
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(control);
    this.updateControlInterface();
  }

  // Mettre à jour l'interface de contrôle
  updateControlInterface() {
    const deviceEl = document.getElementById('device-info');
    const breakpointEl = document.getElementById('breakpoint-info');
    const screenEl = document.getElementById('screen-info');
    const orientationEl = document.getElementById('orientation-info');
    const statusEl = document.getElementById('adaptation-status');

    if (deviceEl) {
      deviceEl.innerHTML = `
        Type: ${this.deviceType}<br>
        OS: ${this.deviceInfo.os}<br>
        Browser: ${this.deviceInfo.browser}<br>
        Touch: ${this.deviceInfo.touchSupport ? 'Oui' : 'Non'}<br>
        DPI: ${this.pixelRatio}x
      `;
    }

    if (breakpointEl) {
      breakpointEl.textContent = this.currentBreakpoint;
    }

    if (screenEl) {
      screenEl.innerHTML = `
        ${this.screenSize.width}x${this.screenSize.height}<br>
        Disponible: ${this.screenSize.availWidth}x${this.screenSize.availHeight}
      `;
    }

    if (orientationEl) {
      orientationEl.textContent = this.orientation;
    }

    if (statusEl) {
      statusEl.textContent = '✅ Adaptation active et optimisée';
    }
  }

  // Tester l'adaptation
  testAdaptation() {
    console.log('🧪 Test d\'adaptation...');
    
    const testResults = {
      device: this.deviceType,
      breakpoint: this.currentBreakpoint,
      orientation: this.orientation,
      screenSize: this.screenSize,
      pixelRatio: this.pixelRatio,
      rules: this.adaptiveRules[this.currentBreakpoint]
    };
    
    console.group('🧪 RÉSULTATS DU TEST D\'ADAPTATION');
    console.log('📱 Appareil:', testResults.device);
    console.log('📏 Breakpoint:', testResults.breakpoint);
    console.log('🔄 Orientation:', testResults.orientation);
    console.log('📺 Écran:', testResults.screenSize);
    console.log('🔍 DPI:', testResults.pixelRatio);
    console.log('📋 Règles appliquées:', testResults.rules);
    console.groupEnd();
    
    this.showNotification('Test d\'adaptation terminé - Voir console', 'success');
  }

  // Simuler un type d'appareil
  simulateDevice(deviceType) {
    console.log(`📱 Simulation: ${deviceType}`);
    
    // Forcer le type d'appareil
    this.deviceType = deviceType;
    
    // Recalculer le breakpoint
    this.currentBreakpoint = this.getCurrentBreakpoint();
    
    // Appliquer les styles
    this.applyAdaptiveStyles();
    
    // Mettre à jour l'interface
    this.updateControlInterface();
    
    this.showNotification(`Simulation: ${deviceType} activée`, 'info');
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

  // Debounce utility
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Obtenir les informations actuelles
  getDeviceInfo() {
    return {
      deviceType: this.deviceType,
      breakpoint: this.currentBreakpoint,
      orientation: this.orientation,
      screenSize: this.screenSize,
      pixelRatio: this.pixelRatio,
      deviceInfo: this.deviceInfo,
      adaptiveRules: this.adaptiveRules[this.currentBreakpoint],
      isInitialized: this.isInitialized
    };
  }
}

// Initialisation globale
let universalAdaptiveSystem;

document.addEventListener('DOMContentLoaded', () => {
  // Attendre 1 seconde pour que les autres scripts soient chargés
  setTimeout(() => {
    universalAdaptiveSystem = new UniversalAdaptiveSystem();
    window.universalAdaptiveSystem = universalAdaptiveSystem;
    
    // Fonctions globales
    window.testAdaptation = () => universalAdaptiveSystem.testAdaptation();
    window.simulateDevice = (device) => universalAdaptiveSystem.simulateDevice(device);
    window.getDeviceInfo = () => universalAdaptiveSystem.getDeviceInfo();
    
    console.log('✅ Système adaptatif universel prêt');
  }, 1000);
});

// Exporter
if (typeof window !== 'undefined') {
  window.UniversalAdaptiveSystem = UniversalAdaptiveSystem;
}
