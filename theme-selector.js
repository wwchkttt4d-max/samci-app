/* ═══════════════════════════════════════════════════════════════════════════════
   AVICO-PRO - SÉLECTEUR DE THÈMES SUBLIMES
   Interface pour changer les couleurs de l'application
   ═══════════════════════════════════════════════════════════════════════════════ */

class ThemeSelector {
  constructor() {
    this.themes = {
      'sublime': {
        name: 'Sublime Violet',
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        icon: '🌌'
      },
      'ocean': {
        name: 'Océan Profond',
        primary: 'linear-gradient(135deg, #0077be 0%, #004d7a 100%)',
        secondary: 'linear-gradient(135deg, #00a8cc 0%, #0077be 100%)',
        accent: 'linear-gradient(135deg, #74c0fc 0%, #339af0 100%)',
        icon: '🌊'
      },
      'sunset': {
        name: 'Coucher Soleil',
        primary: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
        secondary: 'linear-gradient(135deg, #ff9ff3 0%, #ff6b6b 100%)',
        accent: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
        icon: '🌅'
      },
      'forest': {
        name: 'Forêt Tropicale',
        primary: 'linear-gradient(135deg, #27ae60 0%, #16a085 100%)',
        secondary: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
        accent: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)',
        icon: '🌿'
      },
      'royal': {
        name: 'Royal Luxe',
        primary: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
        secondary: 'linear-gradient(135deg, #fd79a8 0%, #6c5ce7 100%)',
        accent: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
        icon: '👑'
      },
      'avico': {
        name: 'AVICO Original',
        primary: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
        secondary: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        accent: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
        icon: '🐔'
      }
    };
    
    this.currentTheme = localStorage.getItem('avico-theme') || 'sublime';
    this.init();
  }

  init() {
    this.createThemeSelector();
    this.applyTheme(this.currentTheme);
    this.addKeyboardShortcuts();
  }

  createThemeSelector() {
    // Créer l'interface du sélecteur de thèmes
    const selector = document.createElement('div');
    selector.id = 'theme-selector';
    selector.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 10002;
      font-family: 'Poppins', sans-serif;
    `;

    // Bouton principal
    const mainButton = document.createElement('button');
    mainButton.innerHTML = '🎨';
    mainButton.style.cssText = `
      background: var(--gradient-primary);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    `;

    // Panel des thèmes
    const themePanel = document.createElement('div');
    themePanel.id = 'theme-panel';
    themePanel.style.cssText = `
      position: absolute;
      top: 60px;
      left: 0;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      padding: 20px;
      min-width: 280px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
    `;

    // Titre
    const title = document.createElement('h3');
    title.textContent = 'Thèmes Sublimes';
    title.style.cssText = `
      margin: 0 0 15px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
      text-align: center;
    `;

    // Liste des thèmes
    const themeList = document.createElement('div');
    themeList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;

    Object.entries(this.themes).forEach(([key, theme]) => {
      const themeOption = document.createElement('div');
      themeOption.className = 'theme-option';
      themeOption.dataset.theme = key;
      themeOption.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
        background: #f8fafc;
      `;

      // Icône
      const icon = document.createElement('span');
      icon.textContent = theme.icon;
      icon.style.cssText = `
        font-size: 20px;
        width: 30px;
        text-align: center;
      `;

      // Infos
      const info = document.createElement('div');
      info.style.cssText = `
        flex: 1;
      `;

      const name = document.createElement('div');
      name.textContent = theme.name;
      name.style.cssText = `
        font-weight: 600;
        color: #1a202c;
        font-size: 14px;
      `;

      // Aperçu des couleurs
      const preview = document.createElement('div');
      preview.style.cssText = `
        display: flex;
        gap: 4px;
        margin-top: 4px;
      `;

      const colors = [
        theme.primary.split(',')[0].split('(')[1],
        theme.secondary.split(',')[0].split('(')[1],
        theme.accent.split(',')[0].split('(')[1]
      ];

      colors.forEach(color => {
        const colorDot = document.createElement('div');
        colorDot.style.cssText = `
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${color};
          border: 1px solid rgba(0,0,0,0.1);
        `;
        preview.appendChild(colorDot);
      });

      info.appendChild(name);
      info.appendChild(preview);

      // Indicateur actif
      const active = document.createElement('div');
      active.innerHTML = '✓';
      active.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #10b981;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        opacity: 0;
        transition: opacity 0.2s ease;
      `;

      themeOption.appendChild(icon);
      themeOption.appendChild(info);
      themeOption.appendChild(active);

      // Événements
      themeOption.addEventListener('click', () => {
        this.applyTheme(key);
        this.updateUI();
      });

      themeOption.addEventListener('mouseenter', () => {
        themeOption.style.background = '#e2e8f0';
        themeOption.style.transform = 'translateX(5px)';
      });

      themeOption.addEventListener('mouseleave', () => {
        if (key !== this.currentTheme) {
          themeOption.style.background = '#f8fafc';
          themeOption.style.transform = 'translateX(0)';
        }
      });

      themeList.appendChild(themeOption);
    });

    // Séparateur
    const separator = document.createElement('div');
    separator.style.cssText = `
      height: 1px;
      background: #e2e8f0;
      margin: 15px 0;
    `;

    // Options supplémentaires
    const options = document.createElement('div');
    options.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;

    // Toggle mode sombre
    const darkModeToggle = document.createElement('label');
    darkModeToggle.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: background 0.2s ease;
    `;

    const darkModeCheckbox = document.createElement('input');
    darkModeCheckbox.type = 'checkbox';
    darkModeCheckbox.checked = document.body.getAttribute('data-theme') === 'dark';
    darkModeCheckbox.style.cssText = `
      margin: 0;
    `;

    const darkModeLabel = document.createElement('span');
    darkModeLabel.textContent = '🌙 Mode sombre';
    darkModeLabel.style.cssText = `
      font-size: 14px;
      color: #4a5568;
    `;

    darkModeToggle.appendChild(darkModeCheckbox);
    darkModeToggle.appendChild(darkModeLabel);

    darkModeToggle.addEventListener('click', () => {
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('avico-theme-mode', isDark ? 'light' : 'dark');
      darkModeCheckbox.checked = !isDark;
    });

    options.appendChild(darkModeToggle);

    // Assembler le panel
    themePanel.appendChild(title);
    themePanel.appendChild(themeList);
    themePanel.appendChild(separator);
    themePanel.appendChild(options);

    // Gérer l'ouverture/fermeture
    let isOpen = false;

    mainButton.addEventListener('click', () => {
      isOpen = !isOpen;
      if (isOpen) {
        themePanel.style.opacity = '1';
        themePanel.style.visibility = 'visible';
        themePanel.style.transform = 'translateY(0)';
        mainButton.style.transform = 'rotate(45deg)';
      } else {
        themePanel.style.opacity = '0';
        themePanel.style.visibility = 'hidden';
        themePanel.style.transform = 'translateY(-10px)';
        mainButton.style.transform = 'rotate(0deg)';
      }
    });

    // Fermer en cliquant dehors
    document.addEventListener('click', (e) => {
      if (isOpen && !selector.contains(e.target)) {
        isOpen = false;
        themePanel.style.opacity = '0';
        themePanel.style.visibility = 'hidden';
        themePanel.style.transform = 'translateY(-10px)';
        mainButton.style.transform = 'rotate(0deg)';
      }
    });

    // Assembler le sélecteur
    selector.appendChild(mainButton);
    selector.appendChild(themePanel);
    document.body.appendChild(selector);

    // Mettre à jour l'UI
    this.updateUI();
  }

  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;

    // Appliquer les variables CSS
    const root = document.documentElement;
    root.style.setProperty('--gradient-primary', theme.primary);
    root.style.setProperty('--gradient-secondary', theme.secondary);
    root.style.setProperty('--gradient-accent', theme.accent);

    // Extraire les couleurs principales
    const primaryColor = theme.primary.match(/#[0-9a-f]{6}/i)[0];
    const secondaryColor = theme.secondary.match(/#[0-9a-f]{6}/i)[0];
    const accentColor = theme.accent.match(/#[0-9a-f]{6}/i)[0];

    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);
    root.style.setProperty('--accent-color', accentColor);

    // Ajouter la classe du thème
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeName}`);

    // Sauvegarder
    this.currentTheme = themeName;
    localStorage.setItem('avico-theme', themeName);

    // Animation de transition
    this.animateThemeChange();

    // Notification
    this.showNotification(`Thème "${theme.name}" appliqué !`);
  }

  updateUI() {
    // Mettre à jour l'indicateur actif
    document.querySelectorAll('.theme-option').forEach(option => {
      const theme = option.dataset.theme;
      const active = option.querySelector('div:last-child');
      
      if (theme === this.currentTheme) {
        option.style.background = 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)';
        option.style.borderColor = '#667eea';
        option.style.transform = 'translateX(5px)';
        active.style.opacity = '1';
      } else {
        option.style.background = '#f8fafc';
        option.style.borderColor = 'transparent';
        option.style.transform = 'translateX(0)';
        active.style.opacity = '0';
      }
    });
  }

  animateThemeChange() {
    // Animation fluide lors du changement de thème
    const elements = document.querySelectorAll('.card, .btn, .header-btn, .sidebar, .login-box');
    elements.forEach((el, index) => {
      el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.transform = 'scale(0.98)';
      el.style.opacity = '0.7';
      
      setTimeout(() => {
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
      }, index * 50);
    });
  }

  showNotification(message) {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10003;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  addKeyboardShortcuts() {
    // Raccourcis clavier pour changer de thème
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Shift + T
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.cycleTheme();
      }
      
      // Ctrl/Cmd + Shift + D pour mode sombre
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('avico-theme-mode', isDark ? 'light' : 'dark');
      }
    });
  }

  cycleTheme() {
    const themeKeys = Object.keys(this.themes);
    const currentIndex = themeKeys.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    const nextTheme = themeKeys[nextIndex];
    
    this.applyTheme(nextTheme);
    this.updateUI();
  }
}

// Initialiser le sélecteur de thèmes
document.addEventListener('DOMContentLoaded', () => {
  new ThemeSelector();
});

// Styles d'animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(30px);
    }
  }

  .theme-option:hover {
    background: #e2e8f0 !important;
    transform: translateX(5px) !important;
  }

  #theme-selector button:hover {
    transform: scale(1.1) !important;
    box-shadow: 0 6px 16px rgba(0,0,0,0.3) !important;
  }

  #theme-panel {
    max-height: 80vh;
    overflow-y: auto;
  }

  #theme-panel::-webkit-scrollbar {
    width: 6px;
  }

  #theme-panel::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  #theme-panel::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }

  #theme-panel::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }
`;
document.head.appendChild(style);

console.log('🎨 Sélecteur de thèmes sublimes chargé !');
