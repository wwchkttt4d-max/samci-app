// ─── Animations avicoles pour page de connexion moderne ───────────────────────
class LoginAnimations {
  constructor() {
    this.particles = [];
    this.shapes = [];
    this.lights = [];
    this.init();
  }

  init() {
    this.createParticleContainer();
    this.createParticles();
    this.createShapes();
    this.createLights();
    this.createWaveEffect();
    this.startAnimations();
  }

  createParticleContainer() {
    const container = document.createElement('div');
    container.className = 'particle-container';
    document.getElementById('loginPage').appendChild(container);
  }

  createParticles() {
    const container = document.querySelector('.particle-container');
    
    // Créer des œufs animés
    for (let i = 0; i < 8; i++) {
      const egg = document.createElement('div');
      egg.className = 'particle particle-egg';
      egg.style.left = Math.random() * 100 + '%';
      egg.style.top = Math.random() * 100 + '%';
      egg.style.animationDelay = Math.random() * 8 + 's';
      egg.style.animationDuration = (8 + Math.random() * 4) + 's';
      container.appendChild(egg);
      this.particles.push(egg);
    }

    // Créer des plumes animées
    for (let i = 0; i < 6; i++) {
      const feather = document.createElement('div');
      feather.className = 'particle particle-feather';
      feather.style.left = Math.random() * 100 + '%';
      feather.style.top = Math.random() * 100 + '%';
      feather.style.animationDelay = Math.random() * 10 + 's';
      feather.style.animationDuration = (10 + Math.random() * 5) + 's';
      container.appendChild(feather);
      this.particles.push(feather);
    }

    // Créer des poulets animés
    const chickenEmojis = ['🐔', '🐓', '🐤', '🐥'];
    for (let i = 0; i < 4; i++) {
      const chicken = document.createElement('div');
      chicken.className = 'particle particle-chicken';
      chicken.textContent = chickenEmojis[i % chickenEmojis.length];
      chicken.style.left = Math.random() * 100 + '%';
      chicken.style.top = Math.random() * 100 + '%';
      chicken.style.animationDelay = Math.random() * 12 + 's';
      chicken.style.animationDuration = (12 + Math.random() * 6) + 's';
      container.appendChild(chicken);
      this.particles.push(chicken);
    }
  }

  createShapes() {
    const container = document.querySelector('.particle-container');
    
    // Créer des cercles
    for (let i = 0; i < 3; i++) {
      const circle = document.createElement('div');
      circle.className = 'geometric-shape shape-circle';
      circle.style.left = Math.random() * 100 + '%';
      circle.style.top = Math.random() * 100 + '%';
      circle.style.animationDelay = Math.random() * 20 + 's';
      circle.style.animationDuration = (20 + Math.random() * 10) + 's';
      container.appendChild(circle);
      this.shapes.push(circle);
    }

    // Créer des triangles
    for (let i = 0; i < 2; i++) {
      const triangle = document.createElement('div');
      triangle.className = 'geometric-shape shape-triangle';
      triangle.style.left = Math.random() * 100 + '%';
      triangle.style.top = Math.random() * 100 + '%';
      triangle.style.animationDelay = Math.random() * 20 + 's';
      triangle.style.animationDuration = (20 + Math.random() * 10) + 's';
      container.appendChild(triangle);
      this.shapes.push(triangle);
    }

    // Créer des hexagones
    for (let i = 0; i < 2; i++) {
      const hexagon = document.createElement('div');
      hexagon.className = 'geometric-shape shape-hexagon';
      hexagon.style.left = Math.random() * 100 + '%';
      hexagon.style.top = Math.random() * 100 + '%';
      hexagon.style.animationDelay = Math.random() * 20 + 's';
      hexagon.style.animationDuration = (20 + Math.random() * 10) + 's';
      container.appendChild(hexagon);
      this.shapes.push(hexagon);
    }
  }

  createLights() {
    const container = document.querySelector('.particle-container');
    
    // Créer des effets de lumière
    for (let i = 0; i < 3; i++) {
      const light = document.createElement('div');
      light.className = 'light-effect';
      light.style.left = Math.random() * 100 + '%';
      light.style.top = Math.random() * 100 + '%';
      light.style.animationDelay = Math.random() * 15 + 's';
      light.style.animationDuration = (15 + Math.random() * 8) + 's';
      container.appendChild(light);
      this.lights.push(light);
    }
  }

  createWaveEffect() {
    const container = document.querySelector('.particle-container');
    
    const wave = document.createElement('div');
    wave.className = 'wave-effect';
    container.appendChild(wave);
  }

  startAnimations() {
    // Animation interactive au mouvement de la souris
    this.addMouseInteraction();
    
    // Animation au focus des champs
    this.addInputAnimations();
    
    // Animation de chargement
    this.addLoadingAnimations();
  }

  addMouseInteraction() {
    const loginPage = document.getElementById('loginPage');
    
    loginPage.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Faire bouger les particules en fonction de la souris
      this.particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.5;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        
        particle.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    });
  }

  addInputAnimations() {
    const inputs = document.querySelectorAll('.login-field input');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        // Accélérer les animations quand l'utilisateur tape
        this.particles.forEach(particle => {
          particle.style.animationDuration = '2s';
        });
      });
      
      input.addEventListener('blur', () => {
        // Retourner à la vitesse normale
        this.particles.forEach(particle => {
          particle.style.animationDuration = particle.dataset.originalDuration || '8s';
        });
      });
    });
  }

  addLoadingAnimations() {
    const loginBtn = document.querySelector('.login-btn');
    
    loginBtn.addEventListener('click', () => {
      // Animation de chargement stylisée
      loginBtn.innerHTML = '<span>🔄 Connexion en cours...</span>';
      loginBtn.disabled = true;
      
      // Ajouter une animation de particules autour du bouton
      this.createButtonParticles(loginBtn);
    });
  }

  createButtonParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle particle-egg';
      particle.style.position = 'fixed';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.zIndex = '1000';
      
      const angle = (i / 12) * Math.PI * 2;
      const distance = 100;
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;
      
      document.body.appendChild(particle);
      
      // Animer la particule
      particle.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(1)`, opacity: 0 }
      ], {
        duration: 1000,
        easing: 'ease-out'
      }).onfinish = () => particle.remove();
    }
  }

  // Nettoyer les animations quand la page se cache
  cleanup() {
    this.particles.forEach(particle => particle.remove());
    this.shapes.forEach(shape => shape.remove());
    this.lights.forEach(light => light.remove());
    
    const container = document.querySelector('.particle-container');
    if (container) container.remove();
  }
}

// ─── Initialisation automatique ───────────────────────────────
let loginAnimations;

document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si on est sur la page de login
  const loginPage = document.getElementById('loginPage');
  if (loginPage && !loginPage.classList.contains('hide')) {
    loginAnimations = new LoginAnimations();
  }
});

// Nettoyer quand on se connecte
window.addEventListener('loginSuccess', () => {
  if (loginAnimations) {
    loginAnimations.cleanup();
  }
});

// Exporter pour utilisation externe
window.LoginAnimations = LoginAnimations;

console.log('🎨 Animations de connexion moderne chargées');
