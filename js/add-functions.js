// Fonctions d'ajout pour toutes les sections AVICO-PRO
console.log('🔧 Fonctions d\'ajout globales chargées...');

// Ajouter un nouveau fournisseur depuis l'interface (sécurisé)
function addNewSupplier() {
  openModal('➕ Ajouter un fournisseur', `
    <div class="form-group">
      <label>Nom du fournisseur</label>
      <input type="text" id="new-supplier-nom" placeholder="Nom de l'entreprise" required>
    </div>
    <div class="form-group">
      <label>Spécialité</label>
      <select id="new-supplier-specialite">
        <option value="Alimentation">Alimentation</option>
        <option value="Équipement">Équipement</option>
        <option value="Services">Services</option>
        <option value="Autre">Autre</option>
      </select>
    </div>
    <div class="form-group">
      <label>Téléphone</label>
      <input type="tel" id="new-supplier-tel" placeholder="07 XX XX XX XX" required>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input type="email" id="new-supplier-email" placeholder="email@fournisseur.com">
    </div>
    <div class="form-group">
      <label>Adresse</label>
      <input type="text" id="new-supplier-adresse" placeholder="Adresse complète">
    </div>
  `, `
    <button class="header-btn primary" onclick="saveNewSupplier()">💾 Enregistrer</button>
    <button class="header-btn" onclick="closeModal()">Annuler</button>
  `);
}

function saveNewSupplier() {
  const nom = document.getElementById('new-supplier-nom')?.value.trim();
  const specialite = document.getElementById('new-supplier-specialite')?.value;
  const tel = document.getElementById('new-supplier-tel')?.value.trim();
  const email = document.getElementById('new-supplier-email')?.value.trim();
  const adresse = document.getElementById('new-supplier-adresse')?.value.trim();
  
  if (!nom || !specialite || !tel) {
    showToast('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }
  
  if (email && !validateEmail(email)) {
    showToast('⚠️ Email invalide', 'error');
    return;
  }
  
  const supplierData = {
    id: Date.now(),
    nom: sanitizeInput(nom),
    specialite: sanitizeInput(specialite),
    tel: sanitizeInput(tel),
    email: sanitizeInput(email),
    adresse: sanitizeInput(adresse),
    statut: 'Actif'
  };
  
  // Ajouter localement
  if (typeof DB !== 'undefined' && DB.fournisseurs) {
    DB.fournisseurs.push(supplierData);
  }
  
  // Sauvegarder dans Firebase
  if (typeof addFournisseurToFirebase === 'function') {
    addFournisseurToFirebase(supplierData);
  }
  
  closeModal();
  
  // Rafraîchir l'interface
  if (typeof renderFournisseurs === 'function') {
    renderFournisseurs();
  }
  
  showToast('✅ Fournisseur ajouté avec succès', 'success');
}

// Ajouter une nouvelle livraison depuis l'interface (sécurisé)
function addNewDelivery() {
  openModal('➕ Ajouter une livraison', `
    <div class="form-group">
      <label>Date de livraison</label>
      <input type="date" id="new-delivery-date" required>
    </div>
    <div class="form-group">
      <label>Livreur</label>
      <select id="new-delivery-livreur">
        <option value="Livreur 1">Livreur 1</option>
        <option value="Livreur 2">Livreur 2</option>
        <option value="Autre">Autre</option>
      </select>
    </div>
    <div class="form-group">
      <label>Zone</label>
      <input type="text" id="new-delivery-zone" placeholder="Zone de livraison" required>
    </div>
    <div class="form-group">
      <label>Statut</label>
      <select id="new-delivery-statut">
        <option value="En cours">En cours</option>
        <option value="Terminée">Terminée</option>
        <option value="Annulée">Annulée</option>
      </select>
    </div>
  `, `
    <button class="header-btn primary" onclick="saveNewDelivery()">💾 Enregistrer</button>
    <button class="header-btn" onclick="closeModal()">Annuler</button>
  `);
}

function saveNewDelivery() {
  const date = document.getElementById('new-delivery-date')?.value;
  const livreur = document.getElementById('new-delivery-livreur')?.value;
  const zone = document.getElementById('new-delivery-zone')?.value.trim();
  const statut = document.getElementById('new-delivery-statut')?.value;
  
  if (!date || !livreur || !zone) {
    showToast('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }
  
  const deliveryData = {
    id: Date.now(),
    date: sanitizeInput(date),
    livreur: sanitizeInput(livreur),
    zone: sanitizeInput(zone),
    statut: sanitizeInput(statut)
  };
  
  // Ajouter localement
  if (typeof DB !== 'undefined' && DB.livraisons) {
    DB.livraisons.push(deliveryData);
  }
  
  // Sauvegarder dans Firebase
  if (typeof addLivraisonToFirebase === 'function') {
    addLivraisonToFirebase(deliveryData);
  }
  
  closeModal();
  
  // Rafraîchir l'interface
  if (typeof renderLivraisons === 'function') {
    renderLivraisons();
  }
  
  showToast('✅ Livraison ajoutée avec succès', 'success');
}

// Ajouter une nouvelle opération comptable depuis l'interface (sécurisé)
function addNewAccountingEntry() {
  openModal('➕ Ajouter une opération', `
    <div class="form-group">
      <label>Date</label>
      <input type="date" id="new-compta-date" required>
    </div>
    <div class="form-group">
      <label>Type</label>
      <select id="new-compta-type">
        <option value="Recette">Recette</option>
        <option value="Dépense">Dépense</option>
      </select>
    </div>
    <div class="form-group">
      <label>Montant</label>
      <input type="number" id="new-compta-montant" placeholder="0" required>
    </div>
    <div class="form-group">
      <label>Description</label>
      <input type="text" id="new-compta-description" placeholder="Description de l'opération" required>
    </div>
    <div class="form-group">
      <label>Catégorie</label>
      <select id="new-compta-categorie">
        <option value="Ventes">Ventes</option>
        <option value="Achats">Achats</option>
        <option value="Salaires">Salaires</option>
        <option value="Autre">Autre</option>
      </select>
    </div>
  `, `
    <button class="header-btn primary" onclick="saveNewAccountingEntry()">💾 Enregistrer</button>
    <button class="header-btn" onclick="closeModal()">Annuler</button>
  `);
}

function saveNewAccountingEntry() {
  const date = document.getElementById('new-compta-date')?.value;
  const type = document.getElementById('new-compta-type')?.value;
  const montant = parseFloat(document.getElementById('new-compta-montant')?.value);
  const description = document.getElementById('new-compta-description')?.value.trim();
  const categorie = document.getElementById('new-compta-categorie')?.value;
  
  if (!date || !type || isNaN(montant) || !description) {
    showToast('⚠️ Veuillez remplir tous les champs correctement', 'error');
    return;
  }
  
  const comptaData = {
    id: Date.now(),
    date: sanitizeInput(date),
    type: sanitizeInput(type),
    montant: montant,
    description: sanitizeInput(description),
    categorie: sanitizeInput(categorie)
  };
  
  // Ajouter localement
  if (typeof DB !== 'undefined' && DB.comptabilite) {
    DB.comptabilite.push(comptaData);
  }
  
  // Sauvegarder dans Firebase
  if (typeof addComptaToFirebase === 'function') {
    addComptaToFirebase(comptaData);
  }
  
  closeModal();
  
  // Rafraîchir l'interface
  if (typeof renderComptabilite === 'function') {
    renderComptabilite();
  }
  
  showToast('✅ Opération comptable ajoutée avec succès', 'success');
}

// Ajouter une nouvelle vente depuis l'interface (sécurisé)
function addNewSaleEntry() {
  openModal('➕ Ajouter une vente', `
    <div class="form-group">
      <label>Date</label>
      <input type="date" id="new-vente-date" required>
    </div>
    <div class="form-group">
      <label>Client</label>
      <select id="new-vente-client">
        <option value="">Sélectionner un client</option>
      </select>
    </div>
    <div class="form-group">
      <label>Montant</label>
      <input type="number" id="new-vente-montant" placeholder="0" required>
    </div>
    <div class="form-group">
      <label>Produits</label>
      <textarea id="new-vente-produits" placeholder="Liste des produits vendus" required></textarea>
    </div>
    <div class="form-group">
      <label>Type de paiement</label>
      <select id="new-vente-paiement">
        <option value="Espèces">Espèces</option>
        <option value="Carte">Carte</option>
        <option value="Mobile">Mobile Money</option>
      </select>
    </div>
  `, `
    <button class="header-btn primary" onclick="saveNewSaleEntry()">💾 Enregistrer</button>
    <button class="header-btn" onclick="closeModal()">Annuler</button>
  `);
}

function saveNewSaleEntry() {
  const date = document.getElementById('new-vente-date')?.value;
  const clientId = document.getElementById('new-vente-client')?.value;
  const montant = parseFloat(document.getElementById('new-vente-montant')?.value);
  const produits = document.getElementById('new-vente-produits')?.value.trim();
  const paiement = document.getElementById('new-vente-paiement')?.value;
  
  if (!date || isNaN(montant) || !produits) {
    showToast('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
    return;
  }
  
  // Récupérer le nom du client
  let clientName = 'Client anonyme';
  if (clientId && typeof DB !== 'undefined' && DB.clients) {
    const client = DB.clients.find(c => c.id == clientId);
    if (client) clientName = client.nom;
  }
  
  const venteData = {
    id: Date.now(),
    date: sanitizeInput(date),
    clientId: clientId || null,
    client: clientName,
    montant: montant,
    produits: sanitizeInput(produits),
    paiement: sanitizeInput(paiement),
    statut: 'Payée'
  };
  
  // Ajouter localement
  if (typeof DB !== 'undefined' && DB.ventes) {
    DB.ventes.push(venteData);
  }
  
  // Sauvegarder dans Firebase
  if (typeof addVenteToFirebase === 'function') {
    addVenteToFirebase(venteData);
  }
  
  closeModal();
  
  // Rafraîchir l'interface
  if (typeof renderVentes === 'function') {
    renderVentes();
  }
  if (typeof renderDashboard === 'function') {
    renderDashboard();
  }
  
  showToast('✅ Vente ajoutée avec succès', 'success');
}

// Exposer les fonctions globalement
window.addNewSupplier = addNewSupplier;
window.saveNewSupplier = saveNewSupplier;
window.addNewDelivery = addNewDelivery;
window.saveNewDelivery = saveNewDelivery;
window.addNewAccountingEntry = addNewAccountingEntry;
window.saveNewAccountingEntry = saveNewAccountingEntry;
window.addNewSaleEntry = addNewSaleEntry;
window.saveNewSaleEntry = saveNewSaleEntry;

console.log('✅ Fonctions d\'ajout globales initialisées');
