// Fichier de test pour vérifier le fonctionnement des ventes
console.log('🧪 Test du système de ventes...');

// Supprimer TOUS les boutons de test
function removeTestButtons() {
  const existingButtons = document.querySelectorAll('[data-test-button]');
  existingButtons.forEach(btn => btn.remove());
}

// Nettoyer les ventes de test au chargement
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Supprimer tous les boutons de test
    removeTestButtons();
    
    // Nettoyer automatiquement les ventes de test
    if (typeof DB !== 'undefined' && DB.ventes) {
      DB.ventes = DB.ventes.filter(v => !v.id || (!v.id.includes('test_') && !v.id.includes('local_')));
      if (typeof renderVentes === 'function') {
        renderVentes();
      }
      console.log('🗑️ Ventes de test nettoyées automatiquement');
    }
    
    console.log('🧪 Système de test nettoyé - plus de boutons visibles');
  }, 1000);
});
