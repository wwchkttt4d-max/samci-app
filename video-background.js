// ─── Gestion vidéo de fond pour page de connexion ───────────────────────
class VideoBackground {
  constructor() {
    this.video = null;
    this.isPlaying = false;
    this.init();
  }

  init() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupVideo());
    } else {
      this.setupVideo();
    }
  }

  setupVideo() {
    this.video = document.getElementById('chickenVideo');
    
    if (this.video) {
      // Configuration de la vidéo
      this.video.muted = true;
      this.video.loop = true;
      this.video.playsInline = true;
      
      // Gérer le démarrage automatique
      this.video.addEventListener('canplay', () => {
        this.video.play().catch(error => {
          console.warn('⚠️ Erreur lecture vidéo:', error);
          // Fallback vers une image statique si la vidéo ne peut pas être lue
          this.fallbackToImage();
        });
      });

      // Gérer les erreurs de chargement
      this.video.addEventListener('error', (e) => {
        console.error('❌ Erreur chargement vidéo:', e);
        this.fallbackToImage();
      });

      // Tenter de jouer la vidéo
      this.video.load();
      
      console.log('🎬 Vidéo de fond initialisée');
    } else {
      console.warn('⚠️ Élément vidéo non trouvé');
      this.fallbackToImage();
    }
  }

  fallbackToImage() {
    // Créer un arrière-plan de secours avec image
    const videoBackground = document.querySelector('.video-background');
    if (videoBackground) {
      videoBackground.style.background = `
        linear-gradient(135deg, 
          rgba(0,0,0,0.8) 0%, 
          rgba(46,125,50,0.6) 50%, 
          rgba(0,0,0,0.9) 100%
        ),
        url('https://images.unsplash.com/photo-1578662996442-48f231b5b4c8?w=1920&h=1080&fit=crop')
        center/cover
      `;
      videoBackground.innerHTML = '';
      console.log('🖼️ Fallback vers image de fond appliqué');
    }
  }

  // Contrôle de la vidéo
  pause() {
    if (this.video && !this.video.paused) {
      this.video.pause();
      this.isPlaying = false;
    }
  }

  play() {
    if (this.video && this.video.paused) {
      this.video.play().catch(error => {
        console.warn('⚠️ Erreur reprise vidéo:', error);
      });
      this.isPlaying = true;
    }
  }

  // Optimisation pour les performances
  optimizeForMobile() {
    if (window.innerWidth <= 768 && this.video) {
      // Réduire la qualité sur mobile pour économiser la bande passante
      this.video.style.filter = 'brightness(0.8) contrast(1.1)';
      console.log('📱 Optimisation mobile appliquée');
    }
  }
}

// ─── Initialisation automatique ───────────────────────────────
let videoBackground;

document.addEventListener('DOMContentLoaded', () => {
  videoBackground = new VideoBackground();
  
  // Optimiser pour mobile si nécessaire
  if (window.innerWidth <= 768) {
    videoBackground.optimizeForMobile();
  }
  
  // Gérer le focus des champs pour optimiser les performances
  const inputs = document.querySelectorAll('.login-field input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      videoBackground.pause();
    });
    
    input.addEventListener('blur', () => {
      videoBackground.play();
    });
  });
});

// Exporter pour utilisation externe
window.VideoBackground = VideoBackground;

console.log('🎬 Gestion vidéo de fond chargée');
