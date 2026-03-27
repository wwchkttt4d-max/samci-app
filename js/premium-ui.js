// Interface Premium AVICO-PRO - Composants UI Avancés
console.log('🎨 Interface Premium AVICO-PRO chargée...');

// ──────────────────────────────────────────────────────────────
// 1. THÈMES PERSONNALISABLES ET MODE NUIT
// ───────────────────────────────────────────────────────────────

class ThemeManager {
  constructor() {
    this.themes = this.initializeThemes();
    this.currentTheme = localStorage.getItem('avico-theme') || 'default';
    this.applyTheme(this.currentTheme);
  }

  initializeThemes() {
    return {
      default: {
        name: 'AVICO-PRO Classic',
        primary: '#2196F3',
        secondary: '#FFC107',
        accent: '#4CAF50',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#212121',
        textSecondary: '#757575'
      },
      dark: {
        name: 'Mode Nuit',
        primary: '#1976D2',
        secondary: '#FFA000',
        accent: '#388E3C',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#ffffff',
        textSecondary: '#b0b0b0'
      },
      ocean: {
        name: 'Océan Profond',
        primary: '#006064',
        secondary: '#00ACC1',
        accent: '#00897B',
        background: '#E0F7FA',
        surface: '#B2EBF2',
        text: '#004D40',
        textSecondary: '#00695C'
      },
      sunset: {
        name: 'Coucher de Soleil',
        primary: '#E65100',
        secondary: '#FF6F00',
        accent: '#D84315',
        background: '#FFF3E0',
        surface: '#FFE0B2',
        text: '#E65100',
        textSecondary: '#F57C00'
      },
      forest: {
        name: 'Forêt Tropicale',
        primary: '#1B5E20',
        secondary: '#4CAF50',
        accent: '#388E3C',
        background: '#E8F5E8',
        surface: '#C8E6C9',
        text: '#1B5E20',
        textSecondary: '#2E7D32'
      }
    };
  }

  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(`--theme-${key}`, value);
      }
    });

    this.currentTheme = themeName;
    localStorage.setItem('avico-theme', themeName);
    
    // Mettre à jour le sélecteur de thème
    this.updateThemeSelector();
  }

  updateThemeSelector() {
    const selector = document.getElementById('theme-selector');
    if (selector) {
      selector.value = this.currentTheme;
    }
  }

  getAvailableThemes() {
    return Object.entries(this.themes).map(([key, theme]) => ({
      id: key,
      name: theme.name,
      preview: theme.primary
    }));
  }
}

// ──────────────────────────────────────────────────────────────
// 2. ANIMATIONS ET TRANSITIONS AVANCÉES
// ───────────────────────────────────────────────────────────────

class AnimationEngine {
  constructor() {
    this.animations = this.initializeAnimations();
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  initializeAnimations() {
    return {
      slideIn: 'translateX(-100%)',
      slideOut: 'translateX(100%)',
      fadeIn: 'opacity(0)',
      fadeOut: 'opacity(1)',
      scaleIn: 'scale(0.8)',
      scaleOut: 'scale(1.1)',
      rotateIn: 'rotate(-180deg)',
      bounce: 'translateY(-20px)',
      pulse: 'scale(1.05)'
    };
  }

  animate(element, animation, duration = 300, easing = 'ease-out') {
    if (this.isReduced || !element) return Promise.resolve();

    element.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
    
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        element.style.transform = this.animations[animation] || animation;
        element.style.opacity = animation.includes('fade') ? '0' : '1';
        
        setTimeout(() => {
          element.style.transition = '';
          resolve();
        }, duration);
      });
    });
  }

  staggeredAnimation(elements, animation, delay = 100) {
    return Promise.all(
      elements.map((element, index) => 
        setTimeout(() => this.animate(element, animation), index * delay)
      )
    );
  }

  createParticleEffect(x, y, count = 10) {
    if (this.isReduced) return;

    const colors = ['#2196F3', '#FFC107', '#4CAF50', '#FF5722', '#9C27B0'];
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 10000;
        animation: particle-float 1s ease-out forwards;
      `;
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  }
}

// ──────────────────────────────────────────────────────────────
// 3. WIDGETS INTERACTIFS AVANCÉS
// ───────────────────────────────────────────────────────────────

class WidgetFactory {
  constructor() {
    this.widgets = new Map();
    this.registerDefaultWidgets();
  }

  registerDefaultWidgets() {
    // Widget KPI Animé
    this.widgets.set('animated-kpi', {
      template: (data) => `
        <div class="animated-kpi-widget" data-value="${data.value}">
          <div class="kpi-icon">${data.icon}</div>
          <div class="kpi-content">
            <div class="kpi-label">${data.label}</div>
            <div class="kpi-value" data-target="${data.value}">0</div>
            <div class="kpi-change ${data.trend}">
              ${data.trend === 'up' ? '↑' : '↓'} ${data.change}%
            </div>
          </div>
          <div class="kpi-sparkline">
            <canvas width="60" height="20"></canvas>
          </div>
        </div>
      `,
      onMount: (element) => this.animateKPIValue(element)
    });

    // Widget Graphique Interactif
    this.widgets.set('interactive-chart', {
      template: (data) => `
        <div class="interactive-chart-widget">
          <div class="chart-header">
            <h3>${data.title}</h3>
            <div class="chart-controls">
              <button class="chart-period" data-period="day">Jour</button>
              <button class="chart-period" data-period="week">Semaine</button>
              <button class="chart-period" data-period="month">Mois</button>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="chart-${data.id}" width="400" height="200"></canvas>
          </div>
          <div class="chart-tooltip" style="display: none;"></div>
        </div>
      `,
      onMount: (element) => this.setupInteractiveChart(element)
    });

    // Widget Carte Interactive
    this.widgets.set('interactive-map', {
      template: (data) => `
        <div class="interactive-map-widget">
          <div class="map-header">
            <h3>${data.title}</h3>
            <div class="map-controls">
              <button class="map-zoom-in">+</button>
              <button class="map-zoom-out">-</button>
              <button class="map-fullscreen">⛶</button>
            </div>
          </div>
          <div class="map-container" id="map-${data.id}">
            <div class="map-placeholder">
              <div class="map-marker" style="left: 30%; top: 40%;">📍</div>
              <div class="map-marker" style="left: 60%; top: 30%;">📍</div>
              <div class="map-marker" style="left: 45%; top: 60%;">📍</div>
            </div>
          </div>
        </div>
      `,
      onMount: (element) => this.setupInteractiveMap(element)
    });

    // Widget Liste Animée
    this.widgets.set('animated-list', {
      template: (data) => `
        <div class="animated-list-widget">
          <div class="list-header">
            <h3>${data.title}</h3>
            <button class="list-refresh">🔄</button>
          </div>
          <div class="list-content">
            ${data.items.map((item, index) => `
              <div class="list-item" style="animation-delay: ${index * 100}ms">
                <div class="item-icon">${item.icon}</div>
                <div class="item-content">
                  <div class="item-title">${item.title}</div>
                  <div class="item-subtitle">${item.subtitle}</div>
                </div>
                <div class="item-value">${item.value}</div>
                <div class="item-progress">
                  <div class="progress-bar" style="width: ${item.progress}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `,
      onMount: (element) => this.animateListItems(element)
    });
  }

  createWidget(type, data) {
    const widget = this.widgets.get(type);
    if (!widget) return null;

    const container = document.createElement('div');
    container.className = 'premium-widget';
    container.innerHTML = widget.template(data);

    // Exécuter le callback onMount
    if (widget.onMount) {
      setTimeout(() => widget.onMount(container), 100);
    }

    return container;
  }

  animateKPIValue(element) {
    const valueElement = element.querySelector('.kpi-value');
    const target = parseInt(valueElement.dataset.target);
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      valueElement.textContent = Math.round(current).toLocaleString();
    }, 20);
  }

  setupInteractiveChart(element) {
    const canvas = element.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const tooltip = element.querySelector('.chart-tooltip');

    // Dessiner un graphique simple
    this.drawSimpleChart(ctx, canvas.width, canvas.height);

    // Ajouter l'interactivité
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      tooltip.style.display = 'block';
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y - 30}px`;
      tooltip.textContent = `Valeur: ${Math.round(y)}`;
    });

    canvas.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  }

  drawSimpleChart(ctx, width, height) {
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < width; i += 20) {
      const y = height / 2 + Math.sin(i * 0.1) * 50;
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }

    ctx.stroke();
  }

  setupInteractiveMap(element) {
    const markers = element.querySelectorAll('.map-marker');
    
    markers.forEach(marker => {
      marker.addEventListener('click', () => {
        this.createMapPopup(marker);
      });

      marker.addEventListener('mouseenter', () => {
        marker.style.transform = 'scale(1.2)';
        marker.style.zIndex = '10';
      });

      marker.addEventListener('mouseleave', () => {
        marker.style.transform = 'scale(1)';
        marker.style.zIndex = '1';
      });
    });
  }

  createMapPopup(marker) {
    const popup = document.createElement('div');
    popup.className = 'map-popup';
    popup.innerHTML = `
      <div class="popup-content">
        <h4>Client VIP</h4>
        <p>Revenu: 250,000 FCFA</p>
        <p>Dernière visite: Il y a 2 jours</p>
      </div>
    `;
    
    popup.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      left: ${marker.offsetLeft + 20}px;
      top: ${marker.offsetTop - 40}px;
    `;
    
    marker.parentElement.appendChild(popup);
    
    setTimeout(() => popup.remove(), 3000);
  }

  animateListItems(element) {
    const items = element.querySelectorAll('.list-item');
    items.forEach((item, index) => {
      item.style.animation = 'slideInLeft 0.5s ease-out forwards';
      item.style.animationDelay = `${index * 100}ms`;
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 4. EFFETS VISUELS ET PARTICULES
// ───────────────────────────────────────────────────────────────

class VisualEffects {
  constructor() {
    this.particles = [];
    this.isRunning = false;
  }

  createBackgroundEffect(type = 'particles') {
    const container = document.createElement('div');
    container.className = 'background-effect';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    `;

    switch (type) {
      case 'particles':
        this.createParticleBackground(container);
        break;
      case 'gradient':
        this.createGradientBackground(container);
        break;
      case 'waves':
        this.createWaveBackground(container);
        break;
    }

    document.body.appendChild(container);
    return container;
  }

  createParticleBackground(container) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'bg-particle';
      
      const size = Math.random() * 4 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(33, 150, 243, 0.3);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        animation: float-particle ${duration}s infinite ease-in-out;
      `;
      
      container.appendChild(particle);
    }
  }

  createGradientBackground(container) {
    const gradient = document.createElement('div');
    gradient.style.cssText = `
      position: absolute;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, 
        rgba(33, 150, 243, 0.1) 0%, 
        rgba(255, 193, 7, 0.1) 25%, 
        rgba(76, 175, 80, 0.1) 50%, 
        rgba(33, 150, 243, 0.1) 100%);
      animation: gradient-shift 15s ease infinite;
    `;
    container.appendChild(gradient);
  }

  createWaveBackground(container) {
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.className = 'bg-wave';
      
      wave.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 200%;
        height: 100px;
        background: linear-gradient(transparent, rgba(33, 150, 243, 0.1));
        border-radius: 50%;
        animation: wave-motion ${8 + i * 2}s infinite ease-in-out;
        animation-delay: ${i * 0.5}s;
      `;
      
      container.appendChild(wave);
    }
  }

  createSuccessAnimation(x, y) {
    const success = document.createElement('div');
    success.className = 'success-animation';
    success.innerHTML = '✅';
    success.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: 24px;
      z-index: 10000;
      animation: success-bounce 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(success);
    setTimeout(() => success.remove(), 600);
  }

  createLoadingSpinner(container) {
    const spinner = document.createElement('div');
    spinner.className = 'premium-spinner';
    spinner.innerHTML = `
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    `;
    
    spinner.style.cssText = `
      display: inline-block;
      width: 40px;
      height: 40px;
      position: relative;
    `;
    
    if (container) {
      container.appendChild(spinner);
    }
    
    return spinner;
  }
}

// ──────────────────────────────────────────────────────────────
// 5. COMPOSANTS UI AVANCÉS
// ───────────────────────────────────────────────────────────────

class AdvancedComponents {
  constructor() {
    this.modals = new Map();
    this.tooltips = new Map();
  }

  createPremiumModal(options) {
    const modal = document.createElement('div');
    modal.className = 'premium-modal';
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="closePremiumModal('${options.id}')"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">${options.title}</h2>
          <button class="modal-close" onclick="closePremiumModal('${options.id}')">✕</button>
        </div>
        <div class="modal-content">
          ${options.content}
        </div>
        <div class="modal-footer">
          ${options.actions || ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modals.set(options.id, modal);

    // Animation d'entrée
    requestAnimationFrame(() => {
      modal.classList.add('modal-open');
    });

    return modal;
  }

  createAdvancedTooltip(element, content, options = {}) {
    const tooltip = document.createElement('div');
    tooltip.className = 'advanced-tooltip';
    tooltip.innerHTML = content;
    
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      max-width: 200px;
    `;

    document.body.appendChild(tooltip);

    element.addEventListener('mouseenter', (e) => {
      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
      tooltip.style.opacity = '1';
    });

    element.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });

    this.tooltips.set(element, tooltip);
    return tooltip;
  }

  createProgressBar(value, options = {}) {
    const container = document.createElement('div');
    container.className = 'progress-container';
    
    const progress = document.createElement('div');
    progress.className = 'progress-bar';
    progress.style.width = `${value}%`;
    
    if (options.animated) {
      progress.style.transition = 'width 1s ease-out';
      setTimeout(() => progress.style.width = `${value}%`, 100);
    }

    container.innerHTML = `
      <div class="progress-label">${options.label || ''}</div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${value}%"></div>
        <div class="progress-value">${value}%</div>
      </div>
    `;

    return container;
  }

  createNotificationCard(notification) {
    const card = document.createElement('div');
    card.className = `notification-card ${notification.type || 'info'}`;
    
    card.innerHTML = `
      <div class="notification-icon">${notification.icon || '📢'}</div>
      <div class="notification-content">
        <div class="notification-title">${notification.title}</div>
        <div class="notification-message">${notification.message}</div>
      </div>
      <div class="notification-actions">
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;

    // Animation d'entrée
    card.style.animation = 'slideInRight 0.3s ease-out';

    // Auto-suppression
    if (notification.autoClose !== false) {
      setTimeout(() => {
        card.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => card.remove(), 300);
      }, notification.duration || 5000);
    }

    return card;
  }
}

// ──────────────────────────────────────────────────────────────
// 6. STYLES CSS POUR LES COMPOSANTS PREMIUM
// ───────────────────────────────────────────────────────────────

const premiumStyles = `
/* Animations */
@keyframes float-particle {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes gradient-shift {
  0% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-25%) translateY(-25%); }
  100% { transform: translateX(-50%) translateY(0); }
}

@keyframes wave-motion {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-25%) translateY(-20px); }
}

@keyframes success-bounce {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg) translateY(-20px); opacity: 0; }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

/* Widgets Premium */
.premium-widget {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  padding: 20px;
  margin: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.premium-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

/* KPI Animé */
.animated-kpi-widget {
  display: flex;
  align-items: center;
  gap: 15px;
}

.kpi-icon {
  font-size: 32px;
  opacity: 0.8;
}

.kpi-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--theme-primary);
}

.kpi-change.positive { color: #4CAF50; }
.kpi-change.negative { color: #F44336; }

/* Modale Premium */
.premium-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.premium-modal.modal-open {
  opacity: 1;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.premium-modal.modal-open .modal-container {
  transform: scale(1);
}

/* Notifications */
.notification-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin: 8px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid var(--theme-primary);
}

.notification-card.success { border-left-color: #4CAF50; }
.notification-card.warning { border-left-color: #FF9800; }
.notification-card.error { border-left-color: #F44336; }

/* Progress Bars */
.progress-container {
  margin: 10px 0;
}

.progress-track {
  position: relative;
  height: 8px;
  background: #E0E0E0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary));
  border-radius: 4px;
  transition: width 1s ease-out;
}

.progress-value {
  position: absolute;
  right: 8px;
  top: -20px;
  font-size: 12px;
  font-weight: bold;
  color: var(--theme-primary);
}

/* Spinner Premium */
.premium-spinner .spinner-ring {
  position: absolute;
  border: 3px solid transparent;
  border-top-color: var(--theme-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.premium-spinner .spinner-ring:nth-child(1) {
  width: 40px;
  height: 40px;
  animation-delay: 0s;
}

.premium-spinner .spinner-ring:nth-child(2) {
  width: 30px;
  height: 30px;
  top: 5px;
  left: 5px;
  animation-delay: 0.2s;
  border-top-color: var(--theme-secondary);
}

.premium-spinner .spinner-ring:nth-child(3) {
  width: 20px;
  height: 20px;
  top: 10px;
  left: 10px;
  animation-delay: 0.4s;
  border-top-color: var(--theme-accent);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .premium-widget {
    padding: 15px;
    margin: 5px;
  }
  
  .modal-container {
    width: 95%;
    margin: 10px;
  }
  
  .animated-kpi-widget {
    flex-direction: column;
    text-align: center;
  }
}
`;

// ──────────────────────────────────────────────────────────────
// INITIALISATION GLOBALE
// ───────────────────────────────────────────────────────────────

// Ajouter les styles premium
const styleSheet = document.createElement('style');
styleSheet.textContent = premiumStyles;
document.head.appendChild(styleSheet);

// Initialiser les managers
window.themeManager = new ThemeManager();
window.animationEngine = new AnimationEngine();
window.widgetFactory = new WidgetFactory();
window.visualEffects = new VisualEffects();
window.advancedComponents = new AdvancedComponents();

// Exposer les fonctions globales
window.ThemeManager = ThemeManager;
window.AnimationEngine = AnimationEngine;
window.WidgetFactory = WidgetFactory;
window.VisualEffects = VisualEffects;
window.AdvancedComponents = AdvancedComponents;

// Fonctions utilitaires globales
window.createPremiumModal = (options) => window.advancedComponents.createPremiumModal(options);
window.closePremiumModal = (id) => {
  const modal = window.advancedComponents.modals.get(id);
  if (modal) {
    modal.classList.remove('modal-open');
    setTimeout(() => modal.remove(), 300);
    window.advancedComponents.modals.delete(id);
  }
};

window.createNotificationCard = (notification) => 
  window.advancedComponents.createNotificationCard(notification);

console.log('✅ Interface Premium AVICO-PRO initialisée avec succès!');
