/* ════════════════════════════════════════════════════════════════
   AVICO-PRO - SYSTÈME COMPLET DE POINT DE VENTE
   Gestion complète du POS avec panier, produits et paiements
   ════════════════════════════════════════════════════════════════ */

class PointOfSaleSystem {
  constructor() {
    this.cart = [];
    this.currentClient = null;
    this.products = [];
    this.init();
  }

  init() {
    this.loadProducts();
    this.loadClients();
    this.renderProductGrid();
    this.bindEvents();
    console.log('🛒 Système de point de vente AVICO-PRO initialisé');
  }

  loadProducts() {
    // Charger les produits depuis la base de données
    this.products = window.DB?.produits || [
      { id: 1, nom: "Œufs frais", categorie: "Œufs", prix: 2500, unite: "plateau", stock: 150, icone: "🥚" },
      { id: 2, nom: "Poulet entier", categorie: "Poulets", prix: 3500, unite: "pièce", stock: 80, icone: "🐓" },
      { id: 3, nom: "Caisse de 30 œufs", categorie: "Œufs", prix: 6000, unite: "caisse", stock: 45, icone: "📦" },
      { id: 4, nom: "Poulet découpé", categorie: "Poulets", prix: 4000, unite: "kg", stock: 25, icone: "🍗" },
      { id: 5, nom: "Œufs bio", categorie: "Œufs", prix: 3500, unite: "plateau", stock: 30, icone: "🥚" },
      { id: 6, nom: "Poulet fermier", categorie: "Poulets", prix: 4500, unite: "pièce", stock: 40, icone: "🐔" }
    ];
  }

  loadClients() {
    const select = document.getElementById('posClientSelect');
    if (select && window.DB?.clients) {
      select.innerHTML = '<option value="">— Vente anonyme —</option>' +
        window.DB.clients.map(client => 
          `<option value="${client.id}">${client.nom}</option>`
        ).join('');
    }
  }

  renderProductGrid() {
    const grid = document.getElementById('posProductGrid');
    if (!grid) return;

    grid.innerHTML = this.products.map(product => `
      <div class="pos-prod-card" onclick="posSystem.addToCart(${product.id})">
        <div class="pos-prod-icon">${product.icone}</div>
        <div class="pos-prod-name">${product.nom}</div>
        <div class="pos-prod-unit">${product.unite}</div>
        <div class="pos-prod-price">${product.prix.toLocaleString()} FCFA</div>
      </div>
    `).join('');
  }

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantite++;
    } else {
      this.cart.push({
        id: product.id,
        nom: product.nom,
        prix: product.prix,
        unite: product.unite,
        quantite: 1,
        icone: product.icone
      });
    }

    this.renderCart();
    this.updateTotals();
    
    if (typeof showToast === 'function') {
      showToast(`✅ ${product.nom} ajouté au panier`, 'success');
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.renderCart();
    this.updateTotals();
  }

  updateQuantity(productId, newQuantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item && newQuantity > 0) {
      item.quantite = newQuantity;
      this.renderCart();
      this.updateTotals();
    }
  }

  renderCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    if (this.cart.length === 0) {
      cartItems.innerHTML = '<div class="pos-cart-empty">🥚 Sélectionnez des produits</div>';
      return;
    }

    cartItems.innerHTML = this.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-main">
          <div class="cart-item-icon">${item.icone}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.nom}</div>
            <div class="cart-item-unit">${item.unite} • ${item.prix.toLocaleString()} FCFA</div>
          </div>
        </div>
        <div class="cart-item-actions">
          <div class="cart-qty">
            <button class="qty-btn" onclick="posSystem.updateQuantity(${item.id}, ${item.quantite - 1})">−</button>
            <span class="qty-val">${item.quantite}</span>
            <button class="qty-btn" onclick="posSystem.updateQuantity(${item.id}, ${item.quantite + 1})">+</button>
          </div>
          <div class="cart-price">${(item.prix * item.quantite).toLocaleString()} FCFA</div>
          <button class="cart-remove" onclick="posSystem.removeFromCart(${item.id})">×</button>
        </div>
      </div>
    `).join('');
  }

  updateTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    const discount = 0; // Logique de remise à implémenter
    const total = subtotal - discount;

    document.getElementById('subtotal').textContent = `${subtotal.toLocaleString()} FCFA`;
    document.getElementById('discount').textContent = `${discount.toLocaleString()} FCFA`;
    document.getElementById('grandTotal').textContent = `${total.toLocaleString()} FCFA`;
  }

  clearCart() {
    this.cart = [];
    this.renderCart();
    this.updateTotals();
    
    // Réinitialiser le champ de paiement
    const paymentInput = document.getElementById('paymentInput');
    if (paymentInput) {
      paymentInput.value = '';
    }
    
    // Cacher la monnaie
    const monnaieDisplay = document.getElementById('monnaieDisplay');
    if (monnaieDisplay) {
      monnaieDisplay.style.display = 'none';
    }

    if (typeof showToast === 'function') {
      showToast('🗑️ Panier vidé', 'info');
    }
  }

  validateSale() {
    if (this.cart.length === 0) {
      if (typeof showToast === 'function') {
        showToast('⚠️ Le panier est vide', 'error');
      }
      return;
    }

    const total = this.cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    const paymentInput = document.getElementById('paymentInput');
    const montantRecu = parseFloat(paymentInput?.value) || 0;

    if (montantRecu < total) {
      if (typeof showToast === 'function') {
        showToast('⚠️ Montant reçu insuffisant', 'error');
      }
      return;
    }

    // Créer la vente
    const vente = {
      produits: this.cart.map(item => ({
        nom: item.nom,
        quantite: item.quantite,
        prix_unitaire: item.prix
      })),
      montant: total,
      montant_recu: montantRecu,
      monnaie: montantRecu - total,
      client: this.currentClient?.nom || 'Client anonyme',
      date: new Date().toISOString().split('T')[0],
      type: 'vente',
      statut: 'Payée'
    };

    // Enregistrer la vente
    if (window.DB && window.DB.ventes) {
      window.DB.ventes.unshift({
        ...vente,
        id: Date.now(),
        numero: `V${String(Date.now()).slice(-6)}`
      });
      
      // Sauvegarder dans localStorage
      localStorage.setItem('avico_db', JSON.stringify(window.DB));
    }

    // Mettre à jour les stocks
    this.updateStocks();

    // Afficher la confirmation
    this.showSaleConfirmation(vente);

    // Vider le panier
    this.clearCart();
  }

  updateStocks() {
    if (!window.DB?.stocks) return;

    this.cart.forEach(item => {
      const stockItem = window.DB.stocks.find(s => s.produit === item.nom);
      if (stockItem) {
        stockItem.quantite -= item.quantite;
        stockItem.statut = stockItem.quantite > stockItem.seuil_mini ? 'Normal' : 'Critique';
      }
    });

    // Re-render les stocks si la page est active
    if (document.getElementById('page-stocks')?.classList.contains('active')) {
      setTimeout(() => {
        if (typeof uiRenderer !== 'undefined' && uiRenderer.renderProducts) {
          uiRenderer.renderProducts();
        }
      }, 500);
    }
  }

  showSaleConfirmation(vente) {
    const details = vente.produits.map(p => 
      `${p.nom}: ${p.quantite} ${p.quantite > 1 ? 'unités' : 'unité'} × ${p.prix_unitaire.toLocaleString()} FCFA`
    ).join('\n');

    const message = `
✅ **VENTE ENREGISTRÉE**

**N°:** ${vente.numero}
**Client:** ${vente.client}
**Date:** ${vente.date}

**Produits:**
${details}

**Total:** ${vente.montant.toLocaleString()} FCFA
**Reçu:** ${vente.montant_recu.toLocaleString()} FCFA
**Monnaie:** ${vente.monnaie.toLocaleString()} FCFA
    `;

    // Afficher dans un modal ou une alerte
    if (typeof openModal === 'function') {
      openModal('✅ Vente Confirmée', `<pre style="text-align: left; font-size: 14px;">${message}</pre>`);
    } else {
      alert(message);
    }
  }

  bindEvents() {
    // Écouteur pour le changement de client
    const clientSelect = document.getElementById('posClientSelect');
    if (clientSelect) {
      clientSelect.addEventListener('change', (e) => {
        const clientId = parseInt(e.target.value);
        this.currentClient = clientId ? window.DB.clients.find(c => c.id === clientId) : null;
        
        const clientInfo = document.getElementById('posClientInfo');
        if (clientInfo && this.currentClient) {
          clientInfo.textContent = `${this.currentClient.type} • ${this.currentClient.telephone}`;
        } else if (clientInfo) {
          clientInfo.textContent = '';
        }
      });
    }

    // Écouteur pour le calcul de la monnaie
    const paymentInput = document.getElementById('paymentInput');
    if (paymentInput) {
      paymentInput.addEventListener('input', () => this.calculateChange());
    }

    // Raccourcis clavier
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'Enter':
            e.preventDefault();
            this.validateSale();
            break;
          case 'Delete':
            e.preventDefault();
            this.clearCart();
            break;
        }
      }
    });
  }

  calculateChange() {
    const total = this.cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    const montantRecu = parseFloat(document.getElementById('paymentInput')?.value) || 0;
    const monnaie = montantRecu - total;

    const monnaieDisplay = document.getElementById('monnaieDisplay');
    const monnaieVal = document.getElementById('monnaieVal');

    if (monnaieDisplay && monnaieVal) {
      if (montantRecu > 0) {
        monnaieDisplay.style.display = 'block';
        monnaieVal.textContent = monnaie.toLocaleString();
        
        // Changer la couleur selon le montant
        if (monnaie >= 0) {
          monnaieDisplay.style.background = 'var(--gold-light)';
          monnaieDisplay.style.color = '#7c5500';
        } else {
          monnaieDisplay.style.background = 'var(--red-light)';
          monnaieDisplay.style.color = 'var(--red)';
        }
      } else {
        monnaieDisplay.style.display = 'none';
      }
    }
  }

  // Méthodes supplémentaires pour la gestion avancée
  applyDiscount(code) {
    // Logique de remise basée sur des codes promo
    const discounts = {
      'CLIENT10': 0.10,
      'FIDELITE15': 0.15,
      'PROMO20': 0.20
    };

    const discountRate = discounts[code.toUpperCase()];
    if (discountRate) {
      const subtotal = this.cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
      const discountAmount = subtotal * discountRate;
      
      document.getElementById('discount').textContent = `${discountAmount.toLocaleString()} FCFA`;
      this.updateTotals();
      
      if (typeof showToast === 'function') {
        showToast(`🎉 Remise de ${(discountRate * 100).toFixed(0)}% appliquée`, 'success');
      }
      return true;
    }
    
    if (typeof showToast === 'function') {
      showToast('❌ Code de remise invalide', 'error');
    }
    return false;
  }

  saveQuote() {
    if (this.cart.length === 0) {
      if (typeof showToast === 'function') {
        showToast('⚠️ Le panier est vide', 'error');
      }
      return;
    }

    const quote = {
      id: Date.now(),
      numero: `D${String(Date.now()).slice(-6)}`,
      produits: this.cart,
      total: this.cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0),
      date: new Date().toISOString(),
      client: this.currentClient?.nom || 'Client anonyme',
      statut: 'En attente'
    };

    // Sauvegarder le devis
    if (!window.DB.devis) window.DB.devis = [];
    window.DB.devis.unshift(quote);
    localStorage.setItem('avico_db', JSON.stringify(window.DB));

    if (typeof showToast === 'function') {
      showToast('📋 Devis enregistré', 'success');
    }
  }
}

// Fonctions globales pour compatibilité avec l'HTML existant
window.posSystem = null;

window.updatePosClient = function() {
  // Cette fonction sera appelée par le onchange du select client
  console.log('Client mis à jour');
};

window.calcMonnaie = function() {
  // Cette fonction sera appelée par oninput du champ paiement
  if (window.posSystem) {
    window.posSystem.calculateChange();
  }
};

window.clearCart = function() {
  if (window.posSystem) {
    window.posSystem.clearCart();
  }
};

window.validateSale = function() {
  if (window.posSystem) {
    window.posSystem.validateSale();
  }
};

// Initialisation du système POS
function initializePOS() {
  console.log('🛒 Initialisation du système de point de vente...');
  window.posSystem = new PointOfSaleSystem();
}

// Auto-initialisation quand la page caisse est active
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si on est sur la page caisse
  const caissePage = document.getElementById('page-caisse');
  if (caissePage) {
    // Initialiser immédiatement si la page est déjà visible
    if (caissePage.classList.contains('active')) {
      initializePOS();
    }
    
    // Observer les changements de page pour initialiser quand nécessaire
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active') && 
            mutation.target.id === 'page-caisse' && 
            !window.posSystem) {
          initializePOS();
        }
      });
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true
    });
  }
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PointOfSaleSystem;
}
