// Script de diagnostic de connexion AVICO-PRO
console.log('🔍 Diagnostic de connexion démarré...');

// Fonction pour tester la connexion
function testLogin() {
  console.log('🧪 Test du système de connexion...');
  
  // Vérifier si les fonctions existent
  console.log('📋 Vérification des fonctions:');
  console.log('  - hashPassword disponible:', typeof hashPassword !== 'undefined');
  console.log('  - verifyPassword disponible:', typeof verifyPassword !== 'undefined');
  console.log('  - doLogin disponible:', typeof doLogin !== 'undefined');
  console.log('  - DEMO_USERS disponible:', typeof DEMO_USERS !== 'undefined');
  
  // Vérifier les utilisateurs démo
  if (typeof DEMO_USERS !== 'undefined') {
    console.log('👥 Utilisateurs démo disponibles:');
    DEMO_USERS.forEach(user => {
      const hashTest = hashPassword('admin123');
      const verification = verifyPassword(user.pwd, 'admin123');
      console.log(`  - ${user.email}: hash=${user.pwd.substring(0, 10)}..., verification=${verification}`);
    });
  }
  
  // Test de connexion manuel
  console.log('🔐 Test de connexion manuel:');
  const testEmail = 'admin@avico-pro.ci';
  const testPassword = 'admin123';
  
  if (typeof hashPassword !== 'undefined' && typeof verifyPassword !== 'undefined') {
    const testHash = hashPassword(testPassword);
    const testVerification = verifyPassword(testHash, testPassword);
    console.log(`  - Hash de "${testPassword}": ${testHash}`);
    console.log(`  - Vérification: ${testVerification}`);
    
    // Test avec les utilisateurs démo
    if (typeof DEMO_USERS !== 'undefined') {
      const foundUser = DEMO_USERS.find(u => u.email === testEmail && verifyPassword(u.pwd, testPassword));
      console.log(`  - Utilisateur trouvé:`, foundUser ? foundUser.name : 'Non');
    }
  }
  
  // Vérifier les éléments DOM
  console.log('🌐 Éléments DOM:');
  console.log('  - loginEmail:', document.getElementById('loginEmail') ? '✅' : '❌');
  console.log('  - loginPwd:', document.getElementById('loginPwd') ? '✅' : '❌');
  console.log('  - loginBtn:', document.querySelector('.login-btn') ? '✅' : '❌');
  
  // Vérifier le localStorage
  console.log('💾 localStorage:');
  console.log('  - sam_session:', localStorage.getItem('sam_session') ? '✅' : '❌');
  console.log('  - sam_employees:', localStorage.getItem('sam_employees') ? '✅' : '❌');
}

// Fonction pour réinitialiser la connexion
function resetLogin() {
  console.log('🔄 Réinitialisation de la connexion...');
  
  // Effacer le localStorage
  localStorage.removeItem('sam_session');
  localStorage.removeItem('sam_employees');
  
  // Réinitialiser les champs
  const emailEl = document.getElementById('loginEmail');
  const pwdEl = document.getElementById('loginPwd');
  const btn = document.querySelector('.login-btn');
  
  if (emailEl) emailEl.value = '';
  if (pwdEl) pwdEl.value = '';
  if (btn) {
    btn.textContent = 'Se connecter →';
    btn.disabled = false;
  }
  
  // Cacher l'application et montrer le login
  const loginPage = document.getElementById('loginPage');
  const appEl = document.getElementById('app');
  
  if (loginPage) loginPage.style.display = '';
  if (appEl) appEl.classList.add('hidden');
  
  console.log('✅ Connexion réinitialisée');
  if (typeof showToast === 'function') {
    showToast('🔄 Connexion réinitialisée', 'info');
  }
}

// Nettoyer tous les boutons de diagnostic
function cleanupDiagnosticButtons() {
  const existingButtons = document.querySelectorAll('[data-diagnostic-button]');
  existingButtons.forEach(btn => btn.remove());
  console.log('🧹 Boutons de diagnostic nettoyés');
}

// Lancer le diagnostic automatiquement
setTimeout(testLogin, 1000);

// Nettoyer automatiquement les boutons
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    cleanupDiagnosticButtons();
    console.log('� Diagnostic connexion exécuté - plus de boutons visibles');
  }, 3000);
});
