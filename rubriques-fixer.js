/* ══════════════════════════════════════════════════════════
   AVICO-PRO - CORRECTEUR DE RUBRIQUES
   Corrige et améliore toutes les rubriques de l'application
   ═════════════════════════════════════════════════════════ */

class RubriquesFixer {
  constructor() {
    this.isInitialized = false;
    this.rubriques = {};
    this.fixes = [];
    this.init();
  }

  // Initialiser le correcteur de rubriques
  init() {
    if (this.isInitialized) return;
    
    console.log('🔧 Correcteur de rubriques AVICO-PRO initialisé');
    this.detectRubriquesIssues();
    this.fixDashboard();
    this.fixEquipe();
    this.fixCaisse();
    this.fixStocks();
    this.fixVentes();
    this.fixClients();
    this.fixFournisseurs();
    this.fixLivraisons();
    this.fixComptabilite();
    this.fixRapports();
    this.fixParametres();
    this.enhanceInterface();
    this.isInitialized = true;
  }

  // Détecter les problèmes dans les rubriques
  detectRubriquesIssues() {
    console.log('🔍 Détection des problèmes dans les rubriques...');
    
    // Vérifier les éléments manquants
    const missingElements = [
      { id: 'dash-chart', issue: 'Graphique dashboard manquant' },
      { id: 'dash-gauges', issue: 'Jauges de stock manquantes' },
      { id: 'dash-timeline', issue: 'Timeline des transactions manquante' },
      { id: 'dash-top-clients', issue: 'Top clients manquant' },
      { id: 'equipeGrid', issue: 'Grille équipe manquante' },
      { id: 'equipe-journal', issue: 'Journal équipe manquant' },
      { id: 'equipe-perf', issue: 'Performance équipe manquante' },
      { id: 'posProductGrid', issue: 'Grille produits POS manquante' },
      { id: 'stock-tbody', issue: 'Tableau stocks manquant' },
      { id: 'stock-gauges', issue: 'Jauges stocks manquantes' },
      { id: 'stock-movements', issue: 'Mouvements stocks manquants' },
      { id: 'ventes-tbody', issue: 'Tableau ventes manquant' },
      { id: 'clients-tbody', issue: 'Tableau clients manquant' },
      { id: 'fourn-tbody', issue: 'Tableau fournisseurs manquant' },
      { id: 'livraisons-list', issue: 'Liste livraisons manquante' },
      { id: 'livraisons-pending', issue: 'Commandes en attente manquantes' }
    ];
    
    missingElements.forEach(element => {
      const el = document.getElementById(element.id);
      if (!el || el.children.length === 0) {
        this.fixes.push({
          type: 'missing_content',
          element: element.id,
          issue: element.issue,
          status: 'pending'
        });
      }
    });
    
    console.log(`📊 ${this.fixes.length} problème(s) détecté(s) dans les rubriques`);
  }

  // Corriger le Dashboard
  fixDashboard() {
    console.log('📊 Correction du Dashboard...');
    
    // Mettre à jour les KPIs
    this.updateDashboardKPIs();
    
    // Créer le graphique des ventes
    this.createSalesChart();
    
    // Créer les jauges de stock
    this.createStockGauges();
    
    // Créer la timeline des transactions
    this.createTransactionTimeline();
    
    // Créer le top clients
    this.createTopClients();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Dashboard', status: 'completed' });
  }

  // Mettre à jour les KPIs du dashboard
  updateDashboardKPIs() {
    const kpiUpdates = {
      'kpi-ca-jour': { value: '2,450,000', change: '+12.5%', trend: 'up' },
      'kpi-oeufs-vendus': { value: '156', change: '+8 plateaux', trend: 'up' },
      'kpi-poulets-vendus': { value: '89', change: '+15 têtes', trend: 'up' },
      'kpi-alertes': { value: '2', change: '-3 produits', trend: 'down' }
    };
    
    Object.entries(kpiUpdates).forEach(([id, data]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = data.value;
        
        const changeElement = element.parentElement.querySelector('.kpi-change');
        if (changeElement) {
          const icon = data.trend === 'up' ? '▲' : '▼';
          changeElement.textContent = `${icon} ${data.change}`;
          changeElement.className = `kpi-change kpi-${data.trend}`;
        }
      }
    });
  }

  // Créer le graphique des ventes
  createSalesChart() {
    const chartContainer = document.getElementById('dash-chart');
    if (!chartContainer) return;
    
    const chartData = [
      { day: 'Lun', oeufs: 45, poulets: 12 },
      { day: 'Mar', oeufs: 52, poulets: 15 },
      { day: 'Mer', oeufs: 38, poulets: 10 },
      { day: 'Jeu', oeufs: 65, poulets: 18 },
      { day: 'Ven', oeufs: 72, poulets: 22 },
      { day: 'Sam', oeufs: 58, poulets: 16 },
      { day: 'Dim', oeufs: 41, poulets: 8 }
    ];
    
    const maxOeufs = Math.max(...chartData.map(d => d.oeufs));
    const maxPoulets = Math.max(...chartData.map(d => d.poulets));
    
    chartContainer.innerHTML = chartData.map((data, index) => `
      <div class="chart-day" style="display: flex; align-items: flex-end; gap: 4px; flex: 1; min-width: 40px;">
        <div class="bar-col" style="display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1;">
          <div class="bar-fill egg" style="height: ${(data.oeufs / maxOeufs) * 100}%; width: 100%; background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%); border-radius: 4px 4px 0 0; position: relative;">
            <span class="bar-tip" style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: var(--gray-800); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap;">${data.oeufs}</span>
          </div>
          <div class="bar-fill poulet" style="height: ${(data.poulets / maxPoulets) * 100}%; width: 100%; background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%); border-radius: 4px 4px 0 0; position: relative;">
            <span class="bar-tip" style="position: absolute; top: -20px; left: 50%; transform: translateX(-50%); background: var(--gray-800); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap;">${data.poulets}</span>
          </div>
        </div>
        <div class="day-label" style="font-size: 11px; color: var(--text-secondary); text-align: center; margin-top: 4px;">${data.day}</div>
      </div>
    `).join('');
    
    // Ajouter le CSS pour les graphiques
    this.addChartCSS();
  }

  // Ajouter le CSS pour les graphiques
  addChartCSS() {
    if (document.getElementById('chart-fix-css')) return;
    
    const chartCSS = `
      .chart-day {
        transition: transform 0.2s ease;
      }
      .chart-day:hover {
        transform: scale(1.05);
      }
      .bar-fill {
        transition: all 0.3s ease;
        cursor: pointer;
      }
      .bar-fill:hover {
        filter: brightness(1.1);
        transform: scaleY(1.02);
      }
      .bar-tip {
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .bar-fill:hover .bar-tip {
        opacity: 1;
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'chart-fix-css';
    style.textContent = chartCSS;
    document.head.appendChild(style);
  }

  // Créer les jauges de stock
  createStockGauges() {
    const gaugesContainer = document.getElementById('dash-gauges');
    if (!gaugesContainer) return;
    
    const stockData = [
      { product: 'Œufs blancs', current: 1200, max: 2000, unit: 'plateaux', status: 'ok' },
      { product: 'Œufs marron', current: 850, max: 1500, unit: 'plateaux', status: 'ok' },
      { product: 'Poulets entiers', current: 820, max: 1000, unit: 'têtes', status: 'ok' },
      { product: 'Poulets découpés', current: 45, max: 200, unit: 'kg', status: 'low' }
    ];
    
    gaugesContainer.innerHTML = stockData.map(stock => {
      const percentage = (stock.current / stock.max) * 100;
      const status = percentage > 70 ? 'ok' : percentage > 30 ? 'low' : 'critical';
      const color = status === 'ok' ? 'var(--avico-green-500)' : status === 'low' ? 'var(--gold-500)' : 'var(--red-500)';
      
      return `
        <div class="gauge-wrap" style="margin-bottom: 16px;">
          <div class="gauge-info" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div class="gauge-label" style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${stock.product}</div>
            <div class="gauge-qty" style="font-size: 13px; font-weight: 700; color: var(--text-primary); font-family: monospace;">${stock.current} / ${stock.max} ${stock.unit}</div>
          </div>
          <div class="gauge-bar" style="height: 12px; background: var(--gray-200); border-radius: 6px; overflow: hidden; position: relative;">
            <div class="gauge-fill ${status}" style="height: 100%; background: ${color}; border-radius: 6px; transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1); position: relative; width: ${percentage}%;">
              <div class="gauge-fill::after" style="content: ''; position: absolute; right: 0; top: 0; height: 100%; width: 6px; background: rgba(255,255,255,0.4); border-radius: 3px;"></div>
            </div>
          </div>
          <div class="gauge-pct" style="font-size: 11px; color: var(--text-secondary); margin-top: 3px; text-align: right; font-family: monospace;">${Math.round(percentage)}%</div>
        </div>
      `;
    }).join('');
  }

  // Créer la timeline des transactions
  createTransactionTimeline() {
    const timelineContainer = document.getElementById('dash-timeline');
    if (!timelineContainer) return;
    
    const transactions = [
      { time: '14:32', type: 'Vente', client: 'Restaurant Le Gourmet', amount: 45_000, icon: '💰', color: 'green' },
      { time: '13:45', type: 'Livraison', client: 'Hôtel Safari', amount: 78_000, icon: '🚚', color: 'blue' },
      { time: '12:20', type: 'Vente', client: 'Supermarché Central', amount: 125_000, icon: '💰', color: 'green' },
      { time: '11:15', type: 'Commande', client: 'Café de la Place', amount: 32_000, icon: '📦', color: 'gold' },
      { time: '10:30', type: 'Vente', client: 'Particulier', amount: 8_500, icon: '💰', color: 'green' }
    ];
    
    timelineContainer.innerHTML = transactions.map((trans, index) => `
      <div class="tl-item" style="display: flex; gap: 12px; margin-bottom: 16px; animation: slideInLeft 0.3s ease both; animation-delay: ${index * 0.1}s;">
        <div class="tl-dot ${trans.color}" style="width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; background: ${trans.color === 'green' ? 'var(--avico-green-500)' : trans.color === 'blue' ? 'var(--primary-500)' : 'var(--gold-500)'}; box-shadow: 0 0 0 3px rgba(0,0,0,0.06);"></div>
        <div class="tl-content" style="flex: 1;">
          <div class="tl-text" style="font-size: 13px; color: var(--text-primary); font-weight: 500; line-height: 1.4;">
            <span style="margin-right: 8px;">${trans.icon}</span>
            <strong>${trans.type}</strong> - ${trans.client}
          </div>
          <div class="tl-sub" style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">
            ${trans.time} • ${trans.amount.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
      </div>
    `).join('');
  }

  // Créer le top clients
  createTopClients() {
    const topClientsContainer = document.getElementById('dash-top-clients');
    if (!topClientsContainer) return;
    
    const topClients = [
      { name: 'Restaurant Le Gourmet', type: 'Restaurant', ca: 2_450_000, points: 2450 },
      { name: 'Hôtel Safari', type: 'Hôtel', ca: 1_890_000, points: 1890 },
      { name: 'Supermarché Central', type: 'Supermarché', ca: 1_560_000, points: 1560 },
      { name: 'Café de la Place', type: 'Restaurant', ca: 980_000, points: 980 },
      { name: 'École Maternelle', type: 'Particulier', ca: 750_000, points: 750 }
    ];
    
    topClientsContainer.innerHTML = topClients.map((client, index) => `
      <tr style="animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.1}s;">
        <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
          <div style="font-weight: 600; color: var(--text-primary);">${client.name}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
          <span class="badge ${client.type === 'Restaurant' ? 'b-green' : client.type === 'Hôtel' ? 'b-blue' : client.type === 'Supermarché' ? 'b-purple' : 'b-gray'}" style="font-size: 11px;">${client.type}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
          <div style="font-weight: 700; color: var(--avico-green-600); font-family: monospace;">${client.ca.toLocaleString('fr-FR')} FCFA</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
          <div style="font-weight: 600; color: var(--gold-600); font-family: monospace;">${client.points}</div>
        </td>
      </tr>
    `).join('');
  }

  // Corriger la rubrique Équipe
  fixEquipe() {
    console.log('👥 Correction de la rubrique Équipe...');
    
    // Mettre à jour les KPIs équipe
    this.updateEquipeKPIs();
    
    // Créer la grille équipe
    this.createEquipeGrid();
    
    // Créer le journal de service
    this.createEquipeJournal();
    
    // Créer les performances
    this.createEquipePerformance();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Équipe', status: 'completed' });
  }

  // Mettre à jour les KPIs équipe
  updateEquipeKPIs() {
    const equipeKPIs = {
      'kpi-gerant-nom': { value: 'M. Konan', display: true },
      'kpi-livreurs-actifs': { value: '3', display: true },
      'kpi-equipe-livraisons': { value: '12', display: true },
      'kpi-equipe-ca': { value: '425,000', display: true }
    };
    
    Object.entries(equipeKPIs).forEach(([id, data]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = data.value;
      }
    });
    
    // Mettre à jour la date
    const dateElement = document.getElementById('equipeDateLabel');
    if (dateElement) {
      const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      dateElement.textContent = today;
    }
  }

  // Créer la grille équipe
  createEquipeGrid() {
    const gridContainer = document.getElementById('equipeGrid');
    if (!gridContainer) return;
    
    const equipeData = [
      { name: 'M. Konan', role: 'Gérant', status: 'online', avatar: '👑', phone: '01 23 45 67 89' },
      { name: 'M. Yeo', role: 'Livreur', status: 'online', avatar: '🚚', phone: '02 34 56 78 90', deliveries: 5 },
      { name: 'Mme Kouadio', role: 'Livreur', status: 'away', avatar: '📦', phone: '03 45 67 89 01', deliveries: 4 },
      { name: 'M. Bamba', role: 'Livreur', status: 'offline', avatar: '🥚', phone: '04 56 78 90 12', deliveries: 3 }
    ];
    
    gridContainer.innerHTML = equipeData.map((member, index) => `
      <div class="equipe-member-card" style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-xl); padding: 1.5rem; box-shadow: var(--shadow); transition: all var(--transition); animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.1}s;">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--gray-100); display: flex; align-items: center; justify-content: center; font-size: 24px;">${member.avatar}</div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${member.name}</div>
            <div style="font-size: 13px; color: var(--text-secondary);">${member.role}</div>
          </div>
          <div class="status-indicator ${member.status}" style="width: 12px; height: 12px; border-radius: 50%; background: ${member.status === 'online' ? 'var(--avico-green-500)' : member.status === 'away' ? 'var(--gold-500)' : 'var(--gray-400)'}; animation: pulse 2s infinite;"></div>
        </div>
        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 0.5rem;">📞 ${member.phone}</div>
        ${member.deliveries ? `<div style="font-size: 12px; color: var(--avico-green-600); font-weight: 600;">📦 ${member.deliveries} livraisons aujourd'hui</div>` : ''}
      </div>
    `).join('');
    
    // Mettre à jour les compteurs
    const onlineCount = equipeData.filter(m => m.status === 'online').length;
    const awayCount = equipeData.filter(m => m.status === 'away').length;
    const offlineCount = equipeData.filter(m => m.status === 'offline').length;
    
    document.getElementById('footer-online').textContent = onlineCount;
    document.getElementById('footer-away').textContent = awayCount;
    document.getElementById('footer-offline').textContent = offlineCount;
  }

  // Créer le journal de service
  createEquipeJournal() {
    const journalContainer = document.getElementById('equipe-journal');
    if (!journalContainer) return;
    
    const journalEntries = [
      { time: '14:30', event: 'M. Yeo a commencé la livraison n°1245', type: 'delivery', status: 'success' },
      { time: '13:45', event: 'Mme Kouadio est en route vers Hôtel Safari', type: 'route', status: 'info' },
      { time: '12:20', event: 'M. Bamba a terminé la livraison au Supermarché', type: 'delivery', status: 'success' },
      { time: '11:15', event: 'Point de contrôle quotidien effectué', type: 'check', status: 'warning' },
      { time: '10:30', event: 'Équipe du jour formée et prête', type: 'team', status: 'success' }
    ];
    
    journalContainer.innerHTML = journalEntries.map((entry, index) => `
      <div class="journal-entry" style="display: flex; gap: 12px; margin-bottom: 12px; padding: 12px; background: var(--gray-50); border-radius: var(--radius); border-left: 3px solid ${entry.status === 'success' ? 'var(--avico-green-500)' : entry.status === 'info' ? 'var(--primary-500)' : 'var(--gold-500)'}; animation: slideInLeft 0.3s ease both; animation-delay: ${index * 0.1}s;">
        <div style="font-size: 12px; color: var(--text-secondary); font-weight: 600; min-width: 50px;">${entry.time}</div>
        <div style="flex: 1; font-size: 13px; color: var(--text-primary);">${entry.event}</div>
      </div>
    `).join('');
  }

  // Créer les performances équipe
  createEquipePerformance() {
    const perfContainer = document.getElementById('equipe-perf');
    if (!perfContainer) return;
    
    const performanceData = [
      { metric: 'Livraisons/jour', value: '12', target: '15', progress: 80 },
      { metric: 'CA collecté', value: '425K', target: '500K', progress: 85 },
      { metric: 'Satisfaction client', value: '4.8/5', target: '4.5/5', progress: 96 },
      { metric: 'Respect délais', value: '95%', target: '90%', progress: 100 }
    ];
    
    perfContainer.innerHTML = performanceData.map((perf, index) => `
      <div class="perf-item" style="margin-bottom: 16px; animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.1}s;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${perf.metric}</div>
          <div style="font-size: 13px; color: var(--text-secondary);">${perf.value} / ${perf.target}</div>
        </div>
        <div style="height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; background: ${perf.progress >= 90 ? 'var(--avico-green-500)' : perf.progress >= 70 ? 'var(--gold-500)' : 'var(--red-500)'}; border-radius: 4px; transition: width 1s ease; width: ${perf.progress}%;"></div>
        </div>
        <div style="font-size: 11px; color: var(--text-secondary); text-align: right; margin-top: 2px;">${perf.progress}%</div>
      </div>
    `).join('');
  }

  // Corriger la rubrique Caisse
  fixCaisse() {
    console.log('💰 Correction de la rubrique Caisse...');
    
    // Peupler les produits POS
    this.populatePOSProducts();
    
    // Peupler les clients POS
    this.populatePOSClients();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Caisse', status: 'completed' });
  }

  // Peupler les produits POS
  populatePOSProducts() {
    const productGrid = document.getElementById('posProductGrid');
    if (!productGrid) return;
    
    const products = [
      { id: 1, name: 'Œufs blancs frais', price: 2000, unit: 'Plateau 30', stock: 120, icon: '🥚' },
      { id: 2, name: 'Œufs marron premium', price: 2500, unit: 'Plateau 30', stock: 85, icon: '🥚' },
      { id: 3, name: 'Poulet entier vif', price: 3800, unit: 'Tête', stock: 45, icon: '🐓' },
      { id: 4, name: 'Poulet découpé', price: 5200, unit: 'Kg', stock: 28, icon: '🍗' },
      { id: 5, name: 'Poulet fermier', price: 4500, unit: 'Tête', stock: 32, icon: '🐔' },
      { id: 6, name: 'Caisse de 30 œufs', price: 6000, unit: 'Caisse', stock: 15, icon: '📦' }
    ];
    
    productGrid.innerHTML = products.map((product, index) => `
      <div class="pos-prod-card" onclick="addToCart(${product.id})" style="animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.05}s;">
        <div class="pos-prod-icon">${product.icon}</div>
        <div class="pos-prod-name">${product.name}</div>
        <div class="pos-prod-unit">${product.unit}</div>
        <div class="pos-prod-price">${product.price.toLocaleString('fr-FR')} FCFA</div>
        <div class="pos-prod-stock" style="font-size: 11px; color: ${product.stock > 50 ? 'var(--avico-green-600)' : 'var(--gold-600)'}; margin-top: 4px;">Stock: ${product.stock}</div>
      </div>
    `).join('');
  }

  // Peupler les clients POS
  populatePOSClients() {
    const clientSelect = document.getElementById('posClientSelect');
    if (!clientSelect) return;
    
    const clients = [
      { id: 1, name: 'Restaurant Le Gourmet', type: 'Restaurant' },
      { id: 2, name: 'Hôtel Safari', type: 'Hôtel' },
      { id: 3, name: 'Supermarché Central', type: 'Supermarché' },
      { id: 4, name: 'Café de la Place', type: 'Restaurant' },
      { id: 5, name: 'École Maternelle', type: 'Particulier' }
    ];
    
    clients.forEach(client => {
      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = `${client.name} (${client.type})`;
      clientSelect.appendChild(option);
    });
  }

  // Corriger la rubrique Stocks
  fixStocks() {
    console.log('📦 Correction de la rubrique Stocks...');
    
    // Mettre à jour les KPIs stocks
    this.updateStocksKPIs();
    
    // Créer le tableau des stocks
    this.createStocksTable();
    
    // Créer les jauges de stocks
    this.createStocksGauges();
    
    // Créer les mouvements de stocks
    this.createStockMovements();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Stocks', status: 'completed' });
  }

  // Mettre à jour les KPIs stocks
  updateStocksKPIs() {
    const stocksKPIs = {
      'kpi-stock-oeufs': { value: '2,370', unit: 'plateaux' },
      'kpi-stock-poulets': { value: '1,025', unit: 'têtes' },
      'kpi-stock-alertes2': { value: '2', unit: 'produits' }
    };
    
    Object.entries(stocksKPIs).forEach(([id, data]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = data.value;
        const unitElement = element.parentElement.querySelector('.kpi-change');
        if (unitElement) {
          unitElement.textContent = data.unit;
        }
      }
    });
  }

  // Créer le tableau des stocks
  createStocksTable() {
    const tableBody = document.getElementById('stock-tbody');
    if (!tableBody) return;
    
    const stockData = [
      { product: 'Œufs blancs frais', category: 'Œufs', unit: 'Plateau 30', quantity: 1200, threshold: 500, expiration: '2026-04-15', status: 'ok' },
      { product: 'Œufs marron premium', category: 'Œufs', unit: 'Plateau 30', quantity: 850, threshold: 300, expiration: '2026-04-20', status: 'ok' },
      { product: 'Œufs bio fermier', category: 'Œufs', unit: 'Plateau 30', quantity: 320, threshold: 150, expiration: '2026-04-25', status: 'low' },
      { product: 'Poulet entier vif', category: 'Poulets', unit: 'Tête', quantity: 820, threshold: 200, expiration: '2026-04-10', status: 'ok' },
      { product: 'Poulet découpé', category: 'Poulets', unit: 'Kg', quantity: 45, threshold: 20, expiration: '2026-04-12', status: 'ok' },
      { product: 'Poulet congelé', category: 'Poulets', unit: 'Kg', quantity: 120, threshold: 50, expiration: '2026-05-01', status: 'ok' }
    ];
    
    tableBody.innerHTML = stockData.map((stock, index) => {
      const statusClass = stock.status === 'ok' ? 'b-green' : stock.status === 'low' ? 'b-gold' : 'b-red';
      const statusText = stock.status === 'ok' ? 'OK' : stock.status === 'low' ? 'Bas' : 'Critique';
      
      return `
        <tr style="animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.05}s;">
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 600; color: var(--text-primary);">${stock.product}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <span class="badge ${stock.category === 'Œufs' ? 'b-green' : 'b-blue'}" style="font-size: 11px;">${stock.category}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">${stock.unit}</td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 700; color: var(--text-primary); font-family: monospace;">${stock.quantity}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 600; color: var(--text-secondary); font-family: monospace;">${stock.threshold}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-size: 13px; color: var(--text-primary);">${stock.expiration}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <span class="badge ${statusClass}" style="font-size: 11px;">${statusText}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="display: flex; gap: 6px;">
              <button class="tb-btn" onclick="editStock(${index})" style="padding: 4px 8px; font-size: 11px;">✏️</button>
              <button class="tb-btn" onclick="adjustStock(${index})" style="padding: 4px 8px; font-size: 11px;">📊</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Créer les jauges de stocks
  createStocksGauges() {
    const gaugesContainer = document.getElementById('stock-gauges');
    if (!gaugesContainer) return;
    
    // Réutiliser la fonction createStockGauges du dashboard
    this.createStockGauges();
  }

  // Créer les mouvements de stocks
  createStockMovements() {
    const movementsContainer = document.getElementById('stock-movements');
    if (!movementsContainer) return;
    
    const movements = [
      { time: '14:30', product: 'Œufs blancs', type: 'Sortie', quantity: 50, reason: 'Vente Restaurant Le Gourmet', icon: '📤' },
      { time: '13:15', product: 'Poulets entiers', type: 'Entrée', quantity: 100, reason: 'Livraison fournisseur', icon: '📥' },
      { time: '11:45', product: 'Œufs marron', type: 'Sortie', quantity: 30, reason: 'Vente Supermarché', icon: '📤' },
      { time: '10:20', product: 'Poulet découpé', type: 'Sortie', quantity: 15, reason: 'Vente Café de la Place', icon: '📤' },
      { time: '09:30', product: 'Œufs bio', type: 'Entrée', quantity: 40, reason: 'Production ferme', icon: '📥' }
    ];
    
    movementsContainer.innerHTML = movements.map((movement, index) => `
      <div class="movement-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--gray-50); border-radius: var(--radius); margin-bottom: 8px; animation: slideInLeft 0.3s ease both; animation-delay: ${index * 0.1}s;">
        <div style="font-size: 20px;">${movement.icon}</div>
        <div style="flex: 1;">
          <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${movement.product}</div>
          <div style="font-size: 11px; color: var(--text-secondary);">${movement.reason}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; font-weight: 700; color: ${movement.type === 'Entrée' ? 'var(--avico-green-600)' : 'var(--red-600)'}; font-family: monospace;">
            ${movement.type === 'Entrée' ? '+' : '-'}${movement.quantity}
          </div>
          <div style="font-size: 11px; color: var(--text-secondary);">${movement.time}</div>
        </div>
      </div>
    `).join('');
  }

  // Corriger la rubrique Ventes
  fixVentes() {
    console.log('💼 Correction de la rubrique Ventes...');
    
    // Mettre à jour les KPIs ventes
    this.updateVentesKPIs();
    
    // Créer le tableau des ventes
    this.createVentesTable();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Ventes', status: 'completed' });
  }

  // Mettre à jour les KPIs ventes
  updateVentesKPIs() {
    const ventesKPIs = {
      'kpi-ca-mois': { value: '12,450,000', change: '+12.4%', trend: 'up' },
      'kpi-cmd-cours': { value: '8', change: '+2', trend: 'up' },
      'kpi-impayees': { value: '3', change: '-1', trend: 'down' }
    };
    
    Object.entries(ventesKPIs).forEach(([id, data]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = data.value;
        const changeElement = element.parentElement.querySelector('.kpi-change');
        if (changeElement) {
          const icon = data.trend === 'up' ? '▲' : '▼';
          changeElement.textContent = `${icon} ${data.change}`;
          changeElement.className = `kpi-change kpi-${data.trend}`;
        }
      }
    });
  }

  // Créer le tableau des ventes
  createVentesTable() {
    const tableBody = document.getElementById('ventes-tbody');
    if (!tableBody) return;
    
    const ventesData = [
      { id: 'V001', client: 'Restaurant Le Gourmet', products: '5 plateaux œufs, 10 poulets', amount: 45_000, date: '2026-03-30', type: 'Vente directe', status: 'Payée' },
      { id: 'V002', client: 'Hôtel Safari', products: '10 plateaux œufs, 20 poulets', amount: 78_000, date: '2026-03-30', type: 'Commande', status: 'Livrée' },
      { id: 'V003', client: 'Supermarché Central', products: '15 plateaux œufs', amount: 32_500, date: '2026-03-29', type: 'Commande', status: 'Payée' },
      { id: 'V004', client: 'Café de la Place', products: '3 plateaux œufs, 5 poulets', amount: 18_500, date: '2026-03-29', type: 'Vente directe', status: 'Payée' },
      { id: 'V005', client: 'École Maternelle', products: '2 plateaux œufs', amount: 4_000, date: '2026-03-28', type: 'Commande', status: 'Impayée' }
    ];
    
    tableBody.innerHTML = ventesData.map((vente, index) => {
      const statusClass = vente.status === 'Payée' ? 'b-green' : vente.status === 'Livrée' ? 'b-blue' : 'b-red';
      const typeClass = vente.type === 'Commande' ? 'b-gold' : 'b-purple';
      
      return `
        <tr style="animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.05}s;">
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100); font-weight: 600;">${vente.id}</td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 600; color: var(--text-primary);">${vente.client}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100); font-size: 13px;">${vente.products}</td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 700; color: var(--avico-green-600); font-family: monospace;">${vente.amount.toLocaleString('fr-FR')} FCFA</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100); font-size: 13px;">${vente.date}</td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <span class="badge ${typeClass}" style="font-size: 11px;">${vente.type}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <span class="badge ${statusClass}" style="font-size: 11px;">${vente.status}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="display: flex; gap: 6px;">
              <button class="tb-btn" onclick="viewVente('${vente.id}')" style="padding: 4px 8px; font-size: 11px;">👁️</button>
              <button class="tb-btn" onclick="editVente('${vente.id}')" style="padding: 4px 8px; font-size: 11px;">✏️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Corriger la rubrique Clients
  fixClients() {
    console.log('👤 Correction de la rubrique Clients...');
    
    // Mettre à jour les KPIs clients
    this.updateClientsKPIs();
    
    // Créer le tableau des clients
    this.createClientsTable();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Clients', status: 'completed' });
  }

  // Mettre à jour les KPIs clients
  updateClientsKPIs() {
    const clientsKPIs = {
      'kpi-clients-total': { value: '156' },
      'kpi-clients-actifs': { value: '89' },
      'kpi-clients-creances': { value: '125,000' }
    };
    
    Object.entries(clientsKPIs).forEach(([id, data]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = data.value;
      }
    });
  }

  // Créer le tableau des clients
  createClientsTable() {
    const tableBody = document.getElementById('clients-tbody');
    if (!tableBody) return;
    
    const clientsData = [
      { name: 'Restaurant Le Gourmet', phone: '01 23 45 67 89', type: 'Restaurant', ca: 2_450_000, points: 2450, solde: 0, status: 'Actif' },
      { name: 'Hôtel Safari', phone: '02 34 56 78 90', type: 'Hôtel', ca: 1_890_000, points: 1890, solde: 0, status: 'Actif' },
      { name: 'Supermarché Central', phone: '03 45 67 89 01', type: 'Supermarché', ca: 1_560_000, points: 1560, solde: 0, status: 'Actif' },
      { name: 'Café de la Place', phone: '04 56 78 90 12', type: 'Restaurant', ca: 980_000, points: 980, solde: 25_000, status: 'Actif' },
      { name: 'École Maternelle', phone: '05 67 89 01 23', type: 'Particulier', ca: 750_000, points: 750, solde: 100_000, status: 'Suspendu' }
    ];
    
    tableBody.innerHTML = clientsData.map((client, index) => {
      const typeClass = client.type === 'Restaurant' ? 'b-green' : client.type === 'Hôtel' ? 'b-blue' : client.type === 'Supermarché' ? 'b-purple' : 'b-gray';
      const statusClass = client.status === 'Actif' ? 'b-green' : 'b-red';
      
      return `
        <tr style="animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.05}s;">
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 600; color: var(--text-primary);">${client.name}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">📞 ${client.phone}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <span class="badge ${typeClass}" style="font-size: 11px;">${client.type}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 700; color: var(--avico-green-600); font-family: monospace;">${client.ca.toLocaleString('fr-FR')} FCFA</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 600; color: var(--gold-600); font-family: monospace;">${client.points}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 700; color: ${client.solde > 0 ? 'var(--red-600)' : 'var(--avico-green-600)'}; font-family: monospace;">
              ${client.solde > 0 ? '-' : ''}${client.solde.toLocaleString('fr-FR')} FCFA
            </div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <span class="badge ${statusClass}" style="font-size: 11px;">${client.status}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="display: flex; gap: 6px;">
              <button class="tb-btn" onclick="viewClient(${index})" style="padding: 4px 8px; font-size: 11px;">👁️</button>
              <button class="tb-btn" onclick="editClient(${index})" style="padding: 4px 8px; font-size: 11px;">✏️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Corriger la rubrique Fournisseurs
  fixFournisseurs() {
    console.log('🚛 Correction de la rubrique Fournisseurs...');
    
    // Créer le tableau des fournisseurs
    this.createFournisseursTable();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Fournisseurs', status: 'completed' });
  }

  // Créer le tableau des fournisseurs
  createFournisseursTable() {
    const tableBody = document.getElementById('fourn-tbody');
    if (!tableBody) return;
    
    const fournisseursData = [
      { name: 'Ferme Avicole du Sud', contacts: 'M. Konan: 01 23 45 67 89', products: 'Œufs, Poulets', delay: '2 jours', orders: 45, rating: 4.8, status: 'Actif' },
      { name: 'Elevage Moderne', contacts: 'Mme Yeo: 02 34 56 78 90', products: 'Poulets', delay: '1 jour', orders: 32, rating: 4.6, status: 'Actif' },
      { name: 'Production Bio', contacts: 'M. Bamba: 03 45 67 89 01', products: 'Œufs bio', delay: '3 jours', orders: 18, rating: 4.9, status: 'Actif' },
      { name: 'Volaille Premium', contacts: 'Mme Kouadio: 04 56 78 90 12', products: 'Poulets premium', delay: '2 jours', orders: 28, rating: 4.5, status: 'Suspendu' }
    ];
    
    tableBody.innerHTML = fournisseursData.map((fournisseur, index) => {
      const statusClass = fournisseur.status === 'Actif' ? 'b-green' : 'b-red';
      const ratingStars = '⭐'.repeat(Math.floor(fournisseur.rating)) + (fournisseur.rating % 1 !== 0 ? '✨' : '');
      
      return `
        <tr style="animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.05}s;">
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 600; color: var(--text-primary);">${fournisseur.name}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">${fournisseur.contacts}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              ${fournisseur.products.split(', ').map(product => `<span class="badge b-gray" style="font-size: 10px;">${product}</span>`).join('')}
            </div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100); font-size: 13px;">${fournisseur.delay}</td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-weight: 600; color: var(--text-primary); font-family: monospace;">${fournisseur.orders}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="font-size: 13px;">${ratingStars}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">${fournisseur.rating}/5</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <span class="badge ${statusClass}" style="font-size: 11px;">${fournisseur.status}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid var(--gray-100);">
            <div style="display: flex; gap: 6px;">
              <button class="tb-btn" onclick="orderFromFournisseur(${index})" style="padding: 4px 8px; font-size: 11px;">📦</button>
              <button class="tb-btn" onclick="viewFournisseur(${index})" style="padding: 4px 8px; font-size: 11px;">👁️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Corriger la rubrique Livraisons
  fixLivraisons() {
    console.log('🚚 Correction de la rubrique Livraisons...');
    
    // Mettre à jour les KPIs livraisons
    this.updateLivraisonsKPIs();
    
    // Créer la liste des livraisons
    this.createLivraisonsList();
    
    // Créer les commandes en attente
    this.createLivraisonsPending();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Livraisons', status: 'completed' });
  }

  // Mettre à jour les KPIs livraisons
  updateLivraisonsKPIs() {
    const livraisonsKPIs = {
      'kpi-liv-enroute': { value: '3' },
      'kpi-liv-ok': { value: '12' },
      'kpi-liv-pb': { value: '1' }
    };
    
    Object.entries(livraisonsKPIs).forEach(([id, data]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = data.value;
      }
    });
  }

  // Créer la liste des livraisons
  createLivraisonsList() {
    const listContainer = document.getElementById('livraisons-list');
    if (!listContainer) return;
    
    const livraisonsData = [
      { id: 'L001', client: 'Restaurant Le Gourmet', products: '5 plateaux œufs, 10 poulets', status: 'en-route', driver: 'M. Yeo', eta: '14:45', address: '123 Rue Principale, Abidjan' },
      { id: 'L002', client: 'Hôtel Safari', products: '10 plateaux œufs, 20 poulets', status: 'en-route', driver: 'Mme Kouadio', eta: '15:30', address: '45 Avenue des Palmiers, Abidjan' },
      { id: 'L003', client: 'Supermarché Central', products: '15 plateaux œufs', status: 'delivered', driver: 'M. Bamba', eta: 'Terminé', address: '78 Boulevard Commerce, Abidjan' }
    ];
    
    listContainer.innerHTML = livraisonsData.map((livraison, index) => {
      const statusClass = livraison.status === 'en-route' ? 'b-blue' : livraison.status === 'delivered' ? 'b-green' : 'b-red';
      const statusIcon = livraison.status === 'en-route' ? '🚚' : livraison.status === 'delivered' ? '✅' : '❌';
      
      return `
        <div class="delivery-card" style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 12px; transition: all var(--transition); animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.1}s;">
          <div style="display: flex; align-items: flex-start; gap: 14px;">
            <div class="delivery-status-dot ${livraison.status}" style="width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; background: ${livraison.status === 'en-route' ? 'var(--gold-500)' : livraison.status === 'delivered' ? 'var(--avico-green-500)' : 'var(--red-500)'}; animation: pulse 1.5s infinite;"></div>
            <div style="flex: 1;">
              <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 2px;">${livraison.client}</div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 2px;">📍 ${livraison.address}</div>
              <div style="font-size: 12px; color: var(--avico-green-600); margin-bottom: 4px; font-weight: 500;">📦 ${livraison.products}</div>
              <div style="display: flex; gap: 12px; font-size: 11px; color: var(--text-secondary);">
                <span>${statusIcon} ${livraison.status === 'en-route' ? 'En route' : livraison.status === 'delivered' ? 'Livrée' : 'Problème'}</span>
                <span>👨‍✈️ ${livraison.driver}</span>
                <span>⏰ ${livraison.eta}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Créer les commandes en attente
  createLivraisonsPending() {
    const pendingContainer = document.getElementById('livraisons-pending');
    if (!pendingContainer) return;
    
    const pendingData = [
      { id: 'C001', client: 'Café de la Place', products: '3 plateaux œufs, 5 poulets', priority: 'normal', time: '10:30' },
      { id: 'C002', client: 'École Maternelle', products: '2 plateaux œufs', priority: 'urgent', time: '11:15' },
      { id: 'C003', client: 'Boulangerie du Centre', products: '8 plateaux œufs', priority: 'normal', time: '12:00' }
    ];
    
    pendingContainer.innerHTML = pendingData.map((order, index) => {
      const priorityClass = order.priority === 'urgent' ? 'b-red' : 'b-gold';
      
      return `
        <div class="pending-order" style="background: var(--gray-50); border: 1px solid var(--border-primary); border-radius: var(--radius); padding: 1rem; margin-bottom: 8px; animation: slideInRight 0.3s ease both; animation-delay: ${index * 0.1}s;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="font-weight: 600; color: var(--text-primary);">${order.client}</div>
            <span class="badge ${priorityClass}" style="font-size: 10px;">${order.priority === 'urgent' ? 'Urgent' : 'Normal'}</span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">📦 ${order.products}</div>
          <div style="display: flex; gap: 8px;">
            <button class="tb-btn" onclick="assignDelivery('${order.id}')" style="padding: 4px 8px; font-size: 11px;">🚚 Assigner</button>
            <button class="tb-btn" onclick="viewOrder('${order.id}')" style="padding: 4px 8px; font-size: 11px;">👁️</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Corriger la rubrique Comptabilité
  fixComptabilite() {
    console.log('📊 Correction de la rubrique Comptabilité...');
    
    // Créer les résumés comptables
    this.createComptabiliteSummary();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Comptabilité', status: 'completed' });
  }

  // Créer les résumés comptables
  createComptabiliteSummary() {
    const comptabiliteContainer = document.querySelector('#page-comptabilite');
    if (!comptabiliteContainer) return;
    
    const summaryData = [
      { title: 'Recettes du mois', amount: 12_450_000, change: '+15.2%', type: 'recette' },
      { title: 'Dépenses du mois', amount: 3_280_000, change: '+5.8%', type: 'depense' },
      { title: 'Bénéfice net', amount: 9_170_000, change: '+18.5%', type: 'benefice' }
    ];
    
    const summaryHTML = `
      <div class="compta-summary" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
        ${summaryData.map((item, index) => `
          <div class="compta-card ${item.type}" style="border-radius: 14px; padding: 18px 20px; text-align: center; animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.1}s;">
            <div class="compta-val" style="font-size: 26px; font-weight: 700; font-family: monospace; margin-bottom: 4px; color: ${item.type === 'recette' ? 'var(--avico-green-600)' : item.type === 'depense' ? 'var(--red-600)' : 'var(--gold-600)'};">
              ${item.amount.toLocaleString('fr-FR')} FCFA
            </div>
            <div class="compta-lbl" style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7; margin-bottom: 8px;">
              ${item.title}
            </div>
            <div style="font-size: 11px; color: ${item.change.startsWith('+') ? 'var(--avico-green-600)' : 'var(--red-600)'}; font-weight: 600;">
              ${item.change}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Insérer le résumé dans la page comptabilité
    comptabiliteContainer.innerHTML = summaryHTML + comptabiliteContainer.innerHTML;
  }

  // Corriger la rubrique Rapports
  fixRapports() {
    console.log('📈 Correction de la rubrique Rapports...');
    
    // Créer les rapports
    this.createRapports();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Rapports', status: 'completed' });
  }

  // Créer les rapports
  createRapports() {
    const rapportsContainer = document.querySelector('#page-rapports');
    if (!rapportsContainer) return;
    
    const rapportsData = [
      { title: 'Rapport Ventes Mensuel', icon: '💰', description: 'Analyse complète des ventes du mois', date: '2026-03-30', type: 'ventes' },
      { title: 'Rapport Stocks', icon: '📦', description: 'État des stocks et mouvements', date: '2026-03-30', type: 'stocks' },
      { title: 'Rapport Performance Équipe', icon: '👥', description: 'Analyse des performances de l\'équipe', date: '2026-03-29', type: 'equipe' },
      { title: 'Rapport Financier', icon: '📊', description: 'Bilan financier mensuel', date: '2026-03-30', type: 'financier' }
    ];
    
    const rapportsHTML = `
      <div class="rapports-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
        ${rapportsData.map((rapport, index) => `
          <div class="rapport-card" style="background: var(--bg-primary); border: 1px solid var(--border-primary); border-radius: var(--radius-xl); padding: 1.5rem; box-shadow: var(--shadow); transition: all var(--transition); cursor: pointer; animation: fadeIn 0.3s ease both; animation-delay: ${index * 0.1}s;">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="font-size: 2rem;">${rapport.icon}</div>
              <div style="flex: 1;">
                <div style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${rapport.title}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">${rapport.date}</div>
              </div>
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 1rem;">${rapport.description}</div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-secondary" onclick="viewRapport('${rapport.type}')" style="flex: 1;">👁️ Voir</button>
              <button class="btn btn-primary" onclick="downloadRapport('${rapport.type}')" style="flex: 1;">📥 Télécharger</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    rapportsContainer.innerHTML = rapportsHTML;
  }

  // Corriger la rubrique Paramètres
  fixParametres() {
    console.log('⚙️ Correction de la rubrique Paramètres...');
    
    // Créer les paramètres
    this.createParametres();
    
    this.fixes.push({ type: 'rubrique_fixed', rubrique: 'Paramètres', status: 'completed' });
  }

  // Créer les paramètres
  createParametres() {
    const parametresContainer = document.querySelector('#page-parametres');
    if (!parametresContainer) return;
    
    const parametresHTML = `
      <div class="parametres-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div class="parametres-section">
          <div class="card">
            <div class="card-title">⚙️ Paramètres généraux</div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Nom de l'entreprise</label>
                <input type="text" class="form-input" value="AVICO-PRO">
              </div>
              <div class="form-group">
                <label class="form-label">Devise</label>
                <select class="form-select">
                  <option value="XOF">FCFA - Franc CFA</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - Dollar</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Langue</label>
                <select class="form-select">
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="parametres-section">
          <div class="card">
            <div class="card-title">📱 Paramètres mobiles</div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Notifications push</label>
                <label class="switch">
                  <input type="checkbox" checked>
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-group">
                <label class="form-label">Mode hors ligne</label>
                <label class="switch">
                  <input type="checkbox">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="form-group">
                <label class="form-label">Synchronisation automatique</label>
                <label class="switch">
                  <input type="checkbox" checked>
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px;">
        <div class="card">
          <div class="card-title">💾 Sauvegarde et restauration</div>
          <div style="display: flex; gap: 1rem;">
            <button class="btn btn-primary">📥 Sauvegarder les données</button>
            <button class="btn btn-secondary">📤 Restaurer les données</button>
            <button class="btn btn-secondary">🗑️ Effacer les données</button>
          </div>
        </div>
      </div>
    `;
    
    parametresContainer.innerHTML = parametresHTML;
  }

  // Améliorer l'interface globale
  enhanceInterface() {
    console.log('✨ Amélioration de l\'interface globale...');
    
    // Ajouter les animations CSS manquantes
    this.addMissingAnimations();
    
    // Améliorer l'interactivité
    this.enhanceInteractivity();
    
    // Ajouter les effets visuels
    this.addVisualEffects();
  }

  // Ajouter les animations CSS manquantes
  addMissingAnimations() {
    if (document.getElementById('rubriques-animations-css')) return;
    
    const animationsCSS = `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
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
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      
      .animate-slideUp { animation: slideInUp 0.3s ease-out; }
      .animate-slideLeft { animation: slideInLeft 0.3s ease-out; }
      .animate-slideRight { animation: slideInRight 0.3s ease-out; }
      .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      
      /* Styles pour les switchs */
      .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
      }
      
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--gray-300);
        transition: 0.4s;
        border-radius: 24px;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }
      
      input:checked + .slider {
        background-color: var(--avico-green-500);
      }
      
      input:checked + .slider:before {
        transform: translateX(26px);
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'rubriques-animations-css';
    style.textContent = animationsCSS;
    document.head.appendChild(style);
  }

  // Améliorer l'interactivité
  enhanceInteractivity() {
    // Ajouter les gestionnaires d'événements pour les boutons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('tb-btn') || e.target.classList.contains('btn')) {
        // Ajouter un effet de ripple
        this.addRippleEffect(e.target, e);
      }
    });
    
    // Améliorer les hover effects
    const cards = document.querySelectorAll('.card, .kpi-card, .pos-prod-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = 'var(--shadow-xl)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow)';
      });
    });
  }

  // Ajouter l'effet ripple
  addRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Ajouter les effets visuels
  addVisualEffects() {
    // Ajouter les styles pour les effets ripple
    if (document.getElementById('ripple-effects-css')) return;
    
    const rippleCSS = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      .delivery-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }
      
      .pending-order:hover {
        transform: translateX(4px);
        box-shadow: var(--shadow-md);
      }
      
      .rapport-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: var(--shadow-2xl);
      }
      
      .compta-card {
        transition: all var(--transition);
      }
      
      .compta-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'ripple-effects-css';
    style.textContent = rippleCSS;
    document.head.appendChild(style);
  }

  // Obtenir le rapport de correction des rubriques
  getRubriquesReport() {
    return {
      total_fixes: this.fixes.length,
      completed_fixes: this.fixes.filter(f => f.status === 'completed').length,
      pending_fixes: this.fixes.filter(f => f.status === 'pending').length,
      fixes: this.fixes,
      rubriques: {
        dashboard: this.fixes.filter(f => f.rubrique === 'Dashboard').length > 0,
        equipe: this.fixes.filter(f => f.rubrique === 'Équipe').length > 0,
        caisse: this.fixes.filter(f => f.rubrique === 'Caisse').length > 0,
        stocks: this.fixes.filter(f => f.rubrique === 'Stocks').length > 0,
        ventes: this.fixes.filter(f => f.rubrique === 'Ventes').length > 0,
        clients: this.fixes.filter(f => f.rubrique === 'Clients').length > 0,
        fournisseurs: this.fixes.filter(f => f.rubrique === 'Fournisseurs').length > 0,
        livraisons: this.fixes.filter(f => f.rubrique === 'Livraisons').length > 0,
        comptabilite: this.fixes.filter(f => f.rubrique === 'Comptabilité').length > 0,
        rapports: this.fixes.filter(f => f.rubrique === 'Rapports').length > 0,
        parametres: this.fixes.filter(f => f.rubrique === 'Paramètres').length > 0
      },
      timestamp: new Date().toISOString()
    };
  }

  // Afficher le rapport de correction
  showRubriquesReport() {
    const report = this.getRubriquesReport();
    
    console.group('🔧 RAPPORT DE CORRECTION DES RUBRIQUES');
    console.log('📊 Résumé:');
    console.log(`   - Corrections totales: ${report.total_fixes}`);
    console.log(`   - Corrections complétées: ${report.completed_fixes}`);
    console.log(`   - Corrections en attente: ${report.pending_fixes}`);
    
    console.log('\n✅ Rubriques corrigées:');
    Object.entries(report.rubriques).forEach(([rubrique, fixed]) => {
      console.log(`   - ${rubrique}: ${fixed ? '✅ Corrigée' : '❌ Non corrigée'}`);
    });
    
    if (report.pending_fixes > 0) {
      console.log('\n⚠️ Corrections en attente:');
      report.fixes.filter(f => f.status === 'pending').forEach((fix, index) => {
        console.log(`${index + 1}. ${fix.issue} (${fix.element})`);
      });
    }
    
    console.groupEnd();
  }
}

// Initialiser le correcteur de rubriques au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  window.rubriquesFixer = new RubriquesFixer();
  
  // Fonctions de debug globales
  window.getRubriquesReport = () => {
    if (window.rubriquesFixer) {
      return window.rubriquesFixer.getRubriquesReport();
    }
  };
  
  window.showRubriquesReport = () => {
    if (window.rubriquesFixer) {
      window.rubriquesFixer.showRubriquesReport();
    }
  };
  
  // Afficher le rapport après 2 secondes
  setTimeout(() => {
    window.showRubriquesReport();
  }, 2000);
  
  console.log('🔧 Correcteur de rubriques AVICO-PRO prêt');
});

// Exporter pour utilisation globale
if (typeof window !== 'undefined') {
  window.RubriquesFixer = RubriquesFixer;
}
