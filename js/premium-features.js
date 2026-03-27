// Fonctionnalités Premium AVICO-PRO - Module IA et Analytics Avancés
console.log('🤖 Module IA et Analytics Premium AVICO-PRO activé...');

// ──────────────────────────────────────────────────────────────
// 1. IA PRÉDICTIVE POUR GESTION AVANCÉE
// ───────────────────────────────────────────────────────────────

class AIPredictiveEngine {
  constructor() {
    this.models = {
      sales: new SalesPredictionModel(),
      inventory: new InventoryOptimizationModel(),
      pricing: new DynamicPricingModel(),
      customer: new CustomerBehaviorModel()
    };
  }

  // Prédiction des ventes sur 30 jours
  predictSales(historicalData = null) {
    const data = historicalData || (window.DB?.ventes || []);
    if (data.length < 7) return this.generateMockPrediction();

    // Analyse des tendances
    const dailySales = this.analyzeDailySales(data);
    const trends = this.detectTrends(dailySales);
    const seasonality = this.detectSeasonality(data);
    
    return {
      predictions: this.generateSalesPredictions(trends, seasonality),
      confidence: this.calculateConfidence(data),
      recommendations: this.generateSalesRecommendations(trends)
    };
  }

  // Optimisation intelligente des stocks
  optimizeInventory() {
    const stocks = window.DB?.stocks || [];
    const ventes = window.DB?.ventes || [];
    
    return stocks.map(stock => {
      const salesVelocity = this.calculateSalesVelocity(stock.id, ventes);
      const stockoutRisk = this.calculateStockoutRisk(stock, salesVelocity);
      const optimalLevel = this.calculateOptimalStock(salesVelocity);
      
      return {
        ...stock,
        analytics: {
          salesVelocity,
          stockoutRisk,
          optimalLevel,
          reorderPoint: optimalLevel * 0.3,
          maxStock: optimalLevel * 2.5,
          daysOfSupply: stock.qte / (salesVelocity || 1)
        }
      };
    });
  }

  // Tarification dynamique basée sur l'IA
  calculateDynamicPricing(productId) {
    const product = window.DB?.stocks?.find(s => s.id === productId);
    if (!product) return null;

    const demand = this.calculateDemandScore(productId);
    const competition = this.analyzeCompetition(productId);
    const seasonality = this.getCurrentSeasonalityFactor();
    const costs = this.calculateTotalCosts(productId);

    const basePrice = product.prixDetail || 0;
    const dynamicPrice = basePrice * (1 + (demand * 0.2) + (seasonality * 0.1) - (competition * 0.15));

    return {
      currentPrice: basePrice,
      recommendedPrice: Math.round(dynamicPrice),
      priceElasticity: this.calculatePriceElasticity(productId),
      optimalRange: {
        min: Math.round(dynamicPrice * 0.9),
        max: Math.round(dynamicPrice * 1.2)
      },
      reasoning: this.generatePricingReasoning(demand, competition, seasonality)
    };
  }

  // Analyse comportementale des clients
  analyzeCustomerBehavior(customerId) {
    const customer = window.DB?.clients?.find(c => c.id === customerId);
    if (!customer) return null;

    const purchases = window.DB?.ventes?.filter(v => v.clientId === customerId) || [];
    
    return {
      customer,
      behavior: {
        purchaseFrequency: this.calculatePurchaseFrequency(purchases),
        averageOrderValue: this.calculateAOV(purchases),
        preferredProducts: this.getPreferredProducts(purchases),
        loyaltyScore: this.calculateLoyaltyScore(purchases),
        churnRisk: this.calculateChurnRisk(purchases),
        nextPurchasePrediction: this.predictNextPurchase(purchases),
        lifetimeValue: this.calculateCLV(purchases)
      },
      recommendations: this.generateCustomerRecommendations(purchases)
    };
  }

  // Méthodes internes
  analyzeDailySales(ventes) {
    const dailyMap = {};
    ventes.forEach(vente => {
      const day = vente.date?.split(' ')[0] || new Date().toISOString().split('T')[0];
      dailyMap[day] = (dailyMap[day] || 0) + vente.montant;
    });
    return Object.entries(dailyMap).map(([date, amount]) => ({ date, amount }));
  }

  detectTrends(dailySales) {
    if (dailySales.length < 2) return { trend: 'stable', growth: 0 };
    
    const firstHalf = dailySales.slice(0, Math.floor(dailySales.length / 2));
    const secondHalf = dailySales.slice(Math.floor(dailySales.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.amount, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.amount, 0) / secondHalf.length;
    
    const growth = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    return {
      trend: growth > 5 ? 'growth' : growth < -5 ? 'decline' : 'stable',
      growth: Math.round(growth),
      momentum: growth > 0 ? 'positive' : 'negative'
    };
  }

  generateSalesPredictions(trends, seasonality) {
    const predictions = [];
    const baseValue = window.DB?.ventes?.reduce((sum, v) => sum + v.montant, 0) / 30 || 100000;
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const seasonalFactor = seasonality[date.getMonth()] || 1;
      const trendFactor = 1 + (trends.growth / 100) * (i / 30);
      const randomVariation = 0.9 + Math.random() * 0.2;
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        predicted: Math.round(baseValue * seasonalFactor * trendFactor * randomVariation),
        confidence: Math.max(0.6, 0.95 - (i * 0.01))
      });
    }
    
    return predictions;
  }

  calculateSalesVelocity(productId, ventes) {
    const productSales = ventes.filter(v => v.produits?.includes(productId.toString()));
    if (productSales.length === 0) return 0;
    
    const days = 30;
    const totalQuantity = productSales.reduce((sum, v) => sum + 1, 0);
    return totalQuantity / days;
  }

  calculateStockoutRisk(stock, velocity) {
    if (velocity === 0) return 0;
    const daysOfSupply = stock.qte / velocity;
    return Math.max(0, Math.min(1, (15 - daysOfSupply) / 15));
  }

  generateMockPrediction() {
    const predictions = [];
    const baseValue = 150000;
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        predicted: Math.round(baseValue * (0.9 + Math.random() * 0.3)),
        confidence: 0.7 + Math.random() * 0.2
      });
    }
    
    return { predictions, confidence: 0.75, recommendations: ['Collect more data for better predictions'] };
  }
}

// ──────────────────────────────────────────────────────────────
// 2. GAMIFICATION ET ENGAGEMENT CLIENT
// ───────────────────────────────────────────────────────────────

class GamificationEngine {
  constructor() {
    this.achievements = this.initializeAchievements();
    this.leaderboard = [];
    this.challenges = this.initializeChallenges();
  }

  initializeAchievements() {
    return [
      { id: 'first_sale', name: 'Première Vente', icon: '🎯', points: 10, description: 'Effectuez votre première vente' },
      { id: 'sales_master', name: 'Maître des Ventes', icon: '💎', points: 100, description: '100 ventes réalisées' },
      { id: 'customer_hero', name: 'Héros des Clients', icon: '⭐', points: 50, description: '20 clients satisfaits' },
      { id: 'inventory_guru', name: 'Gourou des Stocks', icon: '📦', points: 75, description: 'Gestion parfaite des stocks' },
      { id: 'revenue_champion', name: 'Champion du Revenu', icon: '🏆', points: 200, description: '1M de FCFA de revenu' }
    ];
  }

  initializeChallenges() {
    return [
      { id: 'weekly_sales', name: 'Défi Ventes Hebdo', target: 10, current: 0, reward: 50, unit: 'ventes' },
      { id: 'customer_acquisition', name: 'Défi Acquisition', target: 5, current: 0, reward: 30, unit: 'clients' },
      { id: 'revenue_target', name: 'Objectif Revenu', target: 500000, current: 0, reward: 100, unit: 'FCFA' }
    ];
  }

  checkAchievements(userStats) {
    const newAchievements = [];
    
    this.achievements.forEach(achievement => {
      if (!userStats.achievements?.includes(achievement.id)) {
        if (this.isAchievementUnlocked(achievement, userStats)) {
          newAchievements.push(achievement);
        }
      }
    });
    
    return newAchievements;
  }

  isAchievementUnlocked(achievement, stats) {
    switch (achievement.id) {
      case 'first_sale':
        return stats.totalSales >= 1;
      case 'sales_master':
        return stats.totalSales >= 100;
      case 'customer_hero':
        return stats.totalClients >= 20;
      case 'inventory_guru':
        return stats.inventoryEfficiency >= 0.9;
      case 'revenue_champion':
        return stats.totalRevenue >= 1000000;
      default:
        return false;
    }
  }

  updateLeaderboard() {
    // Simuler un leaderboard compétitif
    this.leaderboard = [
      { name: 'Vous', points: this.calculateUserPoints(), rank: 1, trend: 'up' },
      { name: 'Concurrent A', points: Math.floor(this.calculateUserPoints() * 0.8), rank: 2, trend: 'down' },
      { name: 'Concurrent B', points: Math.floor(this.calculateUserPoints() * 0.6), rank: 3, trend: 'stable' },
      { name: 'Concurrent C', points: Math.floor(this.calculateUserPoints() * 0.4), rank: 4, trend: 'up' }
    ];
    
    return this.leaderboard;
  }

  calculateUserPoints() {
    const stats = this.getUserStats();
    let points = 0;
    
    points += stats.totalSales * 5;
    points += stats.totalClients * 10;
    points += Math.floor(stats.totalRevenue / 10000);
    points += (stats.achievements?.length || 0) * 50;
    
    return points;
  }

  getUserStats() {
    const ventes = window.DB?.ventes || [];
    const clients = window.DB?.clients || [];
    
    return {
      totalSales: ventes.length,
      totalClients: clients.length,
      totalRevenue: ventes.reduce((sum, v) => sum + v.montant, 0),
      achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
      inventoryEfficiency: this.calculateInventoryEfficiency()
    };
  }
}

// ──────────────────────────────────────────────────────────────
// 3. MARKETING AUTOMATISÉ ET CRM AVANCÉ
// ───────────────────────────────────────────────────────────────

class MarketingAutomation {
  constructor() {
    this.campaigns = [];
    this.segments = this.initializeSegments();
    this.automations = this.initializeAutomations();
  }

  initializeSegments() {
    return [
      { id: 'vip_customers', name: 'Clients VIP', criteria: 'total_spent > 100000' },
      { id: 'new_customers', name: 'Nouveaux Clients', criteria: 'days_since_first_purchase < 30' },
      { id: 'at_risk', name: 'Clients à Risque', criteria: 'days_since_last_purchase > 60' },
      { id: 'high_potential', name: 'Haut Potentiel', criteria: 'purchase_frequency > 2 AND avg_order_value > 50000' }
    ];
  }

  initializeAutomations() {
    return [
      {
        id: 'welcome_series',
        name: 'Série de Bienvenue',
        trigger: 'new_customer',
        actions: [
          { type: 'email', delay: 0, template: 'welcome' },
          { type: 'email', delay: 3, template: 'onboarding_tip' },
          { type: 'sms', delay: 7, template: 'special_offer' }
        ]
      },
      {
        id: 're_engagement',
        name: 'Réengagement',
        trigger: 'inactive_customer',
        actions: [
          { type: 'email', delay: 0, template: 'we_miss_you' },
          { type: 'push', delay: 3, template: 'special_discount' },
          { type: 'sms', delay: 7, template: 'personal_offer' }
        ]
      }
    ];
  }

  segmentCustomers() {
    const customers = window.DB?.clients || [];
    const ventes = window.DB?.ventes || [];
    
    return this.segments.map(segment => {
      const segmentedCustomers = customers.filter(customer => {
        return this.evaluateSegmentCriteria(customer, segment.criteria, ventes);
      });
      
      return {
        ...segment,
        customers: segmentedCustomers,
        count: segmentedCustomers.length,
        insights: this.generateSegmentInsights(segmentedCustomers, ventes)
      };
    });
  }

  evaluateSegmentCriteria(customer, criteria, ventes) {
    // Simplification - en réalité ce serait plus complexe
    if (criteria.includes('total_spent')) {
      const customerSales = ventes.filter(v => v.clientId === customer.id);
      const totalSpent = customerSales.reduce((sum, v) => sum + v.montant, 0);
      return totalSpent > 100000;
    }
    
    return false;
  }

  generateCampaign(segmentId, campaignType) {
    const segment = this.segments.find(s => s.id === segmentId);
    if (!segment) return null;

    return {
      id: Date.now(),
      name: `Campagne ${campaignType} - ${segment.name}`,
      segment: segment,
      type: campaignType,
      status: 'draft',
      content: this.generateCampaignContent(segment, campaignType),
      budget: this.calculateCampaignBudget(segment),
      expectedROI: this.calculateExpectedROI(segment, campaignType)
    };
  }

  generateCampaignContent(segment, type) {
    const templates = {
      vip_customers: {
        email: 'Offre exclusive VIP -15% sur vos prochains achats',
        sms: 'VIP! Profitez de -15% sur tout le catalogue. Code: VIP15',
        push: '🌟 Offre VIP spécialement pour vous!'
      },
      new_customers: {
        email: 'Bienvenue! Découvrez nos offres pour nouveaux clients',
        sms: 'Bienvenue chez AVICO-PRO! Profitez de -10% sur votre premier achat',
        push: '🎉 Bienvenue! Votre offre de bienvenue vous attend!'
      }
    };
    
    return templates[segment.id]?.[type] || 'Offre spéciale pour vous!';
  }
}

// ──────────────────────────────────────────────────────────────
// 4. TABLEAU DE BORD AVANCÉ AVEC WIDGETS PERSONALISABLES
// ───────────────────────────────────────────────────────────────

class AdvancedDashboard {
  constructor() {
    this.widgets = this.initializeWidgets();
    this.layouts = this.initializeLayouts();
    this.realTimeData = new Map();
  }

  initializeWidgets() {
    return [
      { id: 'kpi_sales', name: 'KPI Ventes', type: 'kpi', size: 'large', position: { x: 0, y: 0 } },
      { id: 'ai_predictions', name: 'Prédictions IA', type: 'chart', size: 'medium', position: { x: 1, y: 0 } },
      { id: 'customer_map', name: 'Carte Clients', type: 'map', size: 'large', position: { x: 0, y: 1 } },
      { id: 'inventory_alerts', name: 'Alertes Stocks', type: 'alerts', size: 'small', position: { x: 2, y: 0 } },
      { id: 'revenue_forecast', name: 'Prévisions Revenu', type: 'chart', size: 'medium', position: { x: 1, y: 1 } },
      { id: 'top_products', name: 'Meilleurs Produits', type: 'list', size: 'small', position: { x: 2, y: 1 } }
    ];
  }

  initializeLayouts() {
    return [
      { id: 'executive', name: 'Vue Direction', widgets: ['kpi_sales', 'ai_predictions', 'revenue_forecast'] },
      { id: 'operations', name: 'Vue Opérations', widgets: ['inventory_alerts', 'customer_map', 'top_products'] },
      { id: 'analytics', name: 'Vue Analytics', widgets: ['ai_predictions', 'revenue_forecast', 'customer_map'] }
    ];
  }

  renderWidget(widgetId) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (!widget) return '';

    switch (widget.type) {
      case 'kpi':
        return this.renderKPIWidget(widget);
      case 'chart':
        return this.renderChartWidget(widget);
      case 'map':
        return this.renderMapWidget(widget);
      case 'alerts':
        return this.renderAlertsWidget(widget);
      case 'list':
        return this.renderListWidget(widget);
      default:
        return '<div>Widget non disponible</div>';
    }
  }

  renderKPIWidget(widget) {
    const stats = this.calculateKPIs();
    return `
      <div class="widget kpi-widget" data-widget="${widget.id}">
        <div class="widget-header">
          <h3>${widget.name}</h3>
          <button class="widget-refresh" onclick="refreshWidget('${widget.id}')">🔄</button>
        </div>
        <div class="widget-content">
          <div class="kpi-grid">
            <div class="kpi-item">
              <div class="kpi-value">${this.formatNumber(stats.revenueToday)}</div>
              <div class="kpi-label">Revenu Aujourd'hui</div>
              <div class="kpi-change ${stats.revenueChange >= 0 ? 'positive' : 'negative'}">
                ${stats.revenueChange >= 0 ? '↑' : '↓'} ${Math.abs(stats.revenueChange)}%
              </div>
            </div>
            <div class="kpi-item">
              <div class="kpi-value">${stats.ordersToday}</div>
              <div class="kpi-label">Commandes Aujourd'hui</div>
              <div class="kpi-change ${stats.ordersChange >= 0 ? 'positive' : 'negative'}">
                ${stats.ordersChange >= 0 ? '↑' : '↓'} ${Math.abs(stats.ordersChange)}%
              </div>
            </div>
            <div class="kpi-item">
              <div class="kpi-value">${stats.activeCustomers}</div>
              <div class="kpi-label">Clients Actifs</div>
              <div class="kpi-change ${stats.customersChange >= 0 ? 'positive' : 'negative'}">
                ${stats.customersChange >= 0 ? '↑' : '↓'} ${Math.abs(stats.customersChange)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderChartWidget(widget) {
    return `
      <div class="widget chart-widget" data-widget="${widget.id}">
        <div class="widget-header">
          <h3>${widget.name}</h3>
          <button class="widget-refresh" onclick="refreshWidget('${widget.id}')">🔄</button>
        </div>
        <div class="widget-content">
          <canvas id="chart-${widget.id}" width="400" height="200"></canvas>
        </div>
      </div>
    `;
  }

  calculateKPIs() {
    const ventes = window.DB?.ventes || [];
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const todaySales = ventes.filter(v => v.date === today);
    const yesterdaySales = ventes.filter(v => v.date === yesterday);
    
    const revenueToday = todaySales.reduce((sum, v) => sum + v.montant, 0);
    const revenueYesterday = yesterdaySales.reduce((sum, v) => sum + v.montant, 0);
    
    return {
      revenueToday,
      revenueChange: yesterday.length > 0 ? ((revenueToday - revenueYesterday) / revenueYesterday * 100) : 0,
      ordersToday: todaySales.length,
      ordersChange: yesterday.length > 0 ? ((todaySales.length - yesterdaySales.length) / yesterdaySales.length * 100) : 0,
      activeCustomers: new Set(todaySales.map(v => v.clientId)).size,
      customersChange: 0 // Simplifié
    };
  }
}

// ──────────────────────────────────────────────────────────────
// 5. RAPPORTS AVANCÉS ET BUSINESS INTELLIGENCE
// ───────────────────────────────────────────────────────────────

class BusinessIntelligence {
  constructor() {
    this.reports = this.initializeReports();
    this.metrics = this.initializeMetrics();
  }

  initializeReports() {
    return [
      { id: 'executive_summary', name: 'Résumé Exécutif', type: 'executive', frequency: 'daily' },
      { id: 'sales_performance', name: 'Performance Ventes', type: 'sales', frequency: 'weekly' },
      { id: 'customer_analytics', name: 'Analytics Clients', type: 'customer', frequency: 'monthly' },
      { id: 'inventory_analysis', name: 'Analyse Stocks', type: 'inventory', frequency: 'weekly' },
      { id: 'financial_report', name: 'Rapport Financier', type: 'financial', frequency: 'monthly' }
    ];
  }

  generateReport(reportId, period) {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return null;

    switch (report.type) {
      case 'executive':
        return this.generateExecutiveSummary(period);
      case 'sales':
        return this.generateSalesReport(period);
      case 'customer':
        return this.generateCustomerReport(period);
      case 'inventory':
        return this.generateInventoryReport(period);
      case 'financial':
        return this.generateFinancialReport(period);
      default:
        return null;
    }
  }

  generateExecutiveSummary(period) {
    const stats = this.calculateExecutiveMetrics();
    
    return {
      title: 'Résumé Exécutif AVICO-PRO',
      period,
      generated: new Date().toISOString(),
      kpis: {
        revenue: stats.totalRevenue,
        growth: stats.revenueGrowth,
        profit: stats.profit,
        margin: stats.profitMargin,
        customers: stats.totalCustomers,
        satisfaction: stats.customerSatisfaction
      },
      highlights: [
        `Revenu total: ${this.formatNumber(stats.totalRevenue)} FCFA`,
        `Croissance: ${stats.revenueGrowth.toFixed(1)}%`,
        `Marge bénéficiaire: ${stats.profitMargin.toFixed(1)}%`,
        `Clients actifs: ${stats.totalCustomers}`
      ],
      alerts: this.generateExecutiveAlerts(stats),
      recommendations: this.generateExecutiveRecommendations(stats)
    };
  }

  calculateExecutiveMetrics() {
    const ventes = window.DB?.ventes || [];
    const clients = window.DB?.clients || [];
    const stocks = window.DB?.stocks || [];
    
    const totalRevenue = ventes.reduce((sum, v) => sum + v.montant, 0);
    const totalCosts = this.calculateTotalCosts(stocks);
    const profit = totalRevenue - totalCosts;
    
    return {
      totalRevenue,
      revenueGrowth: this.calculateGrowthRate(ventes),
      profit,
      profitMargin: totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0,
      totalCustomers: clients.length,
      customerSatisfaction: 4.2 // Simulé
    };
  }

  // ──────────────────────────────────────────────────────────────
  // 6. NOTIFICATIONS INTELLIGENTES ET ALERTES
  // ───────────────────────────────────────────────────────────────

  generateSmartAlerts() {
    const alerts = [];
    const stocks = window.DB?.stocks || [];
    const ventes = window.DB?.ventes || [];
    
    // Alertes de stocks
    stocks.forEach(stock => {
      if (stock.qte < 10) {
        alerts.push({
          type: 'stock_low',
          priority: 'high',
          title: `Stock faible: ${stock.produit}`,
          message: `Il ne reste que ${stock.qte} unités de ${stock.produit}`,
          action: 'order_stock',
          productId: stock.id
        });
      }
    });
    
    // Alertes de performance
    const todaySales = ventes.filter(v => v.date === new Date().toISOString().split('T')[0]);
    if (todaySales.length === 0 && new Date().getHours() > 14) {
      alerts.push({
        type: 'performance',
        priority: 'medium',
        title: 'Aucune vente aujourd\'hui',
        message: 'Considérez lancer une promotion pour stimuler les ventes',
        action: 'create_promotion'
      });
    }
    
    return alerts;
  }

  // ──────────────────────────────────────────────────────────────
  // 7. UTILITAIRES
  // ───────────────────────────────────────────────────────────────

  formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
  }

  calculateGrowthRate(data) {
    if (data.length < 2) return 0;
    const recent = data.slice(-7);
    const previous = data.slice(-14, -7);
    
    const recentSum = recent.reduce((sum, item) => sum + item.montant, 0);
    const previousSum = previous.reduce((sum, item) => sum + item.montant, 0);
    
    return previousSum > 0 ? ((recentSum - previousSum) / previousSum) * 100 : 0;
  }

  calculateTotalCosts(stocks) {
    return stocks.reduce((sum, stock) => {
      return sum + (stock.prixAchat * stock.qte);
    }, 0);
  }
}

// ──────────────────────────────────────────────────────────────
// INITIALISATION GLOBALE
// ───────────────────────────────────────────────────────────────

// Initialiser les moteurs
window.aiEngine = new AIPredictiveEngine();
window.gamification = new GamificationEngine();
window.marketingAutomation = new MarketingAutomation();
window.advancedDashboard = new AdvancedDashboard();
window.businessIntelligence = new BusinessIntelligence();

// Exposer les fonctions globalement
window.AIPredictiveEngine = AIPredictiveEngine;
window.GamificationEngine = GamificationEngine;
window.MarketingAutomation = MarketingAutomation;
window.AdvancedDashboard = AdvancedDashboard;
window.BusinessIntelligence = BusinessIntelligence;

console.log('✅ Module IA et Analytics Premium AVICO-PRO initialisé avec succès!');
