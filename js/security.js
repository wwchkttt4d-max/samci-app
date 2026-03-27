// Fonctions de sécurité pour AVICO-PRO
console.log('🔒 Module de sécurité AVICO-PRO chargé');

// Fonction d'échappement HTML pour prévenir XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Fonction de nettoyage d'input
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprime les chevrons
    .replace(/javascript:/gi, '') // Supprime les protocoles javascript
    .replace(/on\w+\s*=/gi, '') // Supprime les handlers d'événements
    .substring(0, 255); // Limite la longueur
}

// Validation d'email simple
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Hash simple de mot de passe (pour démo seulement)
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertit en 32-bit integer
  }
  return btoa(hash.toString()).replace(/[^a-zA-Z0-9]/g, '');
}

// Vérification de mot de passe
function verifyPassword(hash, password) {
  return hashPassword(password) === hash;
}

// Chiffrement simple pour localStorage (à améliorer en production)
function encryptData(data, key = 'avico-pro-2024') {
  try {
    return btoa(JSON.stringify(data));
  } catch (e) {
    console.warn('⚠️ Erreur de chiffrement:', e);
    return null;
  }
}

// Déchiffrement simple pour localStorage
function decryptData(encryptedData, key = 'avico-pro-2024') {
  try {
    return JSON.parse(atob(encryptedData));
  } catch (e) {
    console.warn('⚠️ Erreur de déchiffrement:', e);
    return null;
  }
}

// Fonctions sécurisées pour localStorage
function secureSetItem(key, value) {
  const encrypted = encryptData(value);
  if (encrypted) {
    localStorage.setItem(key, encrypted);
  }
}

function secureGetItem(key) {
  const encrypted = localStorage.getItem(key);
  if (encrypted) {
    return decryptData(encrypted);
  }
  return null;
}

// Validation des entrées numériques
function validateNumber(value, min = 0, max = Infinity) {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
}

// Validation des entrées texte
function validateText(value, minLength = 1, maxLength = 255) {
  return typeof value === 'string' && 
         value.trim().length >= minLength && 
         value.trim().length <= maxLength;
}

// Exposer les fonctions globalement
window.escapeHtml = escapeHtml;
window.sanitizeInput = sanitizeInput;
window.validateEmail = validateEmail;
window.hashPassword = hashPassword;
window.verifyPassword = verifyPassword;
window.encryptData = encryptData;
window.decryptData = decryptData;
window.secureSetItem = secureSetItem;
window.secureGetItem = secureGetItem;
window.validateNumber = validateNumber;
window.validateText = validateText;

console.log('✅ Fonctions de sécurité AVICO-PRO initialisées');
