/* ════════════════════════════════════════
   SÉCURITÉ AVANCÉE - Niveau Entreprise
   Hashage SHA-256, Validation, Protection XSS
══════════════════════════════════════════ */

// ─── Hashage moderne SHA-256 ───────────────────────────────
export async function hashPassword(password, salt = 'samci-salt-2024') {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.warn('⚠️ SHA-256 non supporté, fallback vers btoa:', error);
    return btoa(password + salt); // Fallback pour vieux navigateurs
  }
}

// ─── Vérification de mot de passe ───────────────────────────────
export async function verifyPassword(hashedPassword, plainPassword, salt = 'samci-salt-2024') {
  const computedHash = await hashPassword(plainPassword, salt);
  return hashedPassword === computedHash;
}

// ─── Validation d'email avancée ───────────────────────────────
export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const isValid = emailRegex.test(email);
  
  return {
    valid: isValid,
    value: isValid ? email.toLowerCase().trim() : email,
    error: isValid ? null : 'Format d\'email invalide'
  };
}

// ─── Sanitisation avec DOMPurify ───────────────────────────
export function sanitizeInput(input, options = {}) {
  if (typeof input !== 'string') return '';
  
  // Configuration de base
  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span'],
    ALLOWED_ATTR: ['class', 'id'],
    KEEP_CONTENT: true
  };
  
  const config = { ...defaultConfig, ...options };
  
  try {
    // Si DOMPurify est disponible
    if (typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(input, config);
    }
    
    // Fallback manuel
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  } catch (error) {
    console.error('🚨 Erreur de sanitisation:', error);
    return '';
  }
}

// ─── Validation de téléphone ───────────────────────────────────────
export function validatePhone(phone) {
  const phoneRegex = /^(\+|00)?(\d{1,3}[-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
  const isValid = phoneRegex.test(phone.replace(/\s/g, ''));
  
  return {
    valid: isValid,
    value: phone.replace(/\s/g, ''),
    formatted: isValid ? phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4') : phone,
    error: isValid ? null : 'Format de téléphone invalide'
  };
}

// ─── Validation de montant ───────────────────────────────────────
export function validateAmount(amount) {
  const num = parseFloat(amount);
  
  return {
    valid: !isNaN(num) && num >= 0 && num <= 999999999,
    value: num,
    formatted: new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(num),
    error: isNaN(num) ? 'Montant invalide' : 
           num < 0 ? 'Le montant doit être positif' :
           num > 999999999 ? 'Montant trop élevé' : null
  };
}

// ─── Validation de texte ───────────────────────────────────────
export function validateText(text, options = {}) {
  const {
    minLength = 1,
    maxLength = 255,
    required = true,
    allowEmpty = false
  } = options;
  
  const trimmed = text.trim();
  
  if (required && !allowEmpty && trimmed.length === 0) {
    return {
      valid: false,
      value: '',
      error: 'Ce champ est requis'
    };
  }
  
  if (trimmed.length < minLength) {
    return {
      valid: false,
      value: trimmed,
      error: `Minimum ${minLength} caractères requis`
    };
  }
  
  if (trimmed.length > maxLength) {
    return {
      valid: false,
      value: trimmed,
      error: `Maximum ${maxLength} caractères autorisés`
    };
  }
  
  return {
    valid: true,
    value: trimmed
  };
}

// ─── Protection XSS avancée ───────────────────────────────────
export function protectXSS(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// ─── Validation de formulaire complète ───────────────────────────────
export function validateForm(formData, schema) {
  const errors = {};
  let isValid = true;
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];
    const validation = validateField(value, rules);
    
    if (!validation.valid) {
      errors[field] = validation.error;
      isValid = false;
    }
  }
  
  return {
    valid: isValid,
    errors,
    data: formData
  };
}

// ─── Validation de champ individuelle ───────────────────────────────
function validateField(value, rules) {
  for (const rule of rules) {
    const result = rule(value);
    if (!result.valid) {
      return result;
    }
  }
  
  return { valid: true, value };
}

// ─── Règles de validation prédéfinies ───────────────────────────
export const ValidationRules = {
  required: (value) => ({
    valid: value !== undefined && value !== null && value.toString().trim() !== '',
    error: 'Ce champ est requis'
  }),
  
  email: (value) => validateEmail(value),
  
  phone: (value) => validatePhone(value),
  
  amount: (value) => validateAmount(value),
  
  text: (options = {}) => (value) => validateText(value, options),
  
  password: (minLength = 8) => (value) => ({
    valid: value && value.length >= minLength,
    error: value ? `Minimum ${minLength} caractères requis` : 'Mot de passe requis'
  }),
  
  minLength: (min) => (value) => ({
    valid: value && value.length >= min,
    error: value ? `Minimum ${min} caractères requis` : null
  }),
  
  maxLength: (max) => (value) => ({
    valid: !value || value.length <= max,
    error: value && value.length > max ? `Maximum ${max} caractères autorisés` : null
  })
};

// ─── Rate limiting pour sécurité ───────────────────────────────
export class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) { // 5 requêtes par minute
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  isAllowed(identifier = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Nettoyer les anciennes requêtes
    this.requests = this.requests.filter(time => time > windowStart);
    
    // Compter les requêtes dans la fenêtre
    const recentRequests = this.requests.filter(time => time >= windowStart).length;
    
    if (recentRequests >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
  
  getTimeUntilNextRequest() {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const oldestInWindow = this.requests.find(time => time >= windowStart);
    
    if (!oldestInWindow || this.requests.length < this.maxRequests) {
      return 0;
    }
    
    return this.windowMs - (now - oldestInWindow);
  }
}

// ─── CSRF Protection ───────────────────────────────────────
export function generateCSRFToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validateCSRFToken(token, sessionToken) {
  return token && sessionToken && token === sessionToken;
}

// ─── Audit de sécurité ───────────────────────────────────────
export class SecurityAudit {
  constructor() {
    this.violations = [];
  }
  
  logViolation(type, details) {
    const violation = {
      type,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.violations.push(violation);
    console.warn('🚨 Security Violation:', violation);
    
    // Envoyer à Firebase pour monitoring
    this.reportViolation(violation);
  }
  
  async reportViolation(violation) {
    try {
      if (typeof db !== 'undefined') {
        await addDoc(collection(db, 'security_violations'), violation);
      }
    } catch (error) {
      console.error('❌ Impossible de reporter la violation:', error);
    }
  }
  
  getReport() {
    return {
      violations: this.violations,
      score: this.calculateSecurityScore(),
      timestamp: new Date().toISOString()
    };
  }
  
  calculateSecurityScore() {
    const baseScore = 100;
    const deductionPerViolation = 10;
    return Math.max(0, baseScore - (this.violations.length * deductionPerViolation));
  }
}

// ─── Export global ───────────────────────────────────────
export const securityAudit = new SecurityAudit();

console.log('🔐 Module de sécurité avancée chargé avec succès');
