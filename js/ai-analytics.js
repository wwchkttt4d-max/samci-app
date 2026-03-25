/* ════════════════════════════════════════════════════════════════
   SAM-CI IA - INTELLIGENCE ARTIFICIELLE AVANCÉE
   Analyse prédictive et recommandations intelligentes
   ════════════════════════════════════════════════════════════════ */

// ─── ANALYSE PRÉDICTIVE DES VENTES ───────────────────────────────────────
export class SalesPredictor {
  constructor(historicalData = []) {
    this.historicalData = historicalData;
    this.seasonalFactors = {
      'Jan': 0.8, 'Fev': 0.7, 'Mar': 0.9, 'Avr': 1.0,
      'Mai': 1.1, 'Jui': 1.2, 'Jul': 1.3,
      'Aou': 1.2, 'Sep': 1.0, 'Oct': 0.9,
      'Nov': 0.8, 'Dec': 1.4
    };
  }

  // Prédire les ventes des 7 prochains jours
  predictNext7Days(productCategory) {
    const recentSales = this.getRecentSales(productCategory, 30);
    const avgDaily = recentSales.reduce((sum, sale) => sum + sale.montant, 0) / recentSales.length;
    
    const predictions = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      
      const monthName = futureDate.toLocaleDateString('fr-FR', { month: 'short' });
      const seasonalFactor = this.seasonalFactors[monthName] || 1.0;
      const trendFactor = 1 + (i * 0.02); // Légère croissance tendancielle
      
      const predictedSales = avgDaily * seasonalFactor * trendFactor;
      const confidence = Math.max(0.7, 1 - (i * 0.05)); // Confiance décroissante
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predicted: Math.round(predictedSales),
        confidence: Math.round(confidence * 100),
        category: productCategory
      });
    }
    
    return predictions;
  }

  getRecentSales(category, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return window.DB?.ventes?.filter(sale => 
      sale.date >= cutoffDate.toISOString().split('T')[0] &&
      (sale.category === category || sale.produits?.toLowerCase().includes(category.toLowerCase()))
    ) || [];
  }
}

// ─── SYSTÈME DE RECOMMANDATIONS INTELLIGENT ─────────────────────────────────
export class SmartRecommendations {
  constructor() {
    this.rules = {
      stock: {
        low: { threshold: 0.2, priority: 'high', message: 'Stock critique - Réapprovisionnement urgent' },
        medium: { threshold: 0.5, priority: 'medium', message: 'Stock bas - Planifier réapprovisionnement' },
        optimal: { threshold: 0.8, priority: 'low', message: 'Stock optimal' }
      },
      sales: {
        increasing: { threshold: 1.15, message: 'Ventes en hausse - Augmenter les stocks' },
        decreasing: { threshold: 0.85, message: 'Ventes en baisse - Analyser la concurrence' }
      }
    };
  }

  // Générer des recommandations basées sur l'analyse
  generateRecommendations() {
    const recommendations = [];
    
    // Analyse des stocks
    window.DB?.stocks?.forEach(stock => {
      const stockRatio = stock.qte / stock.seuil;
      let recommendation;
      
      if (stockRatio <= this.rules.stock.low.threshold) {
        recommendation = {
          type: 'stock_critical',
          priority: 'high',
          product: stock.produit,
          message: `🚨 ${stock.produit}: Stock critique (${stock.qte} ${stock.unite})`,
          action: 'Commander immédiatement',
          suggestedQty: Math.round(stock.seuil * 2)
        };
      } else if (stockRatio <= this.rules.stock.medium.threshold) {
        recommendation = {
          type: 'stock_low',
          priority: 'medium',
          product: stock.produit,
          message: `⚠️ ${stock.produit}: Stock bas (${stock.qte} ${stock.unite})`,
          action: 'Planifier commande',
          suggestedQty: Math.round(stock.seuil * 1.5)
        };
      }
      
      if (recommendation) recommendations.push(recommendation);
    });

    // Analyse des tendances de ventes
    const salesTrend = this.analyzeSalesTrend();
    if (salesTrend.trend === 'increasing') {
      recommendations.push({
        type: 'sales_trend',
        priority: 'medium',
        message: `📈 Ventes en hausse de ${salesTrend.percentage}%`,
        action: 'Augmenter les stocks et le personnel',
        data: salesTrend
      });
    }

    // Analyse des clients
    const topClients = this.getTopClients();
    if (topClients.length > 0) {
      recommendations.push({
        type: 'client_opportunity',
        priority: 'low',
        message: `🏆 Meilleur client: ${topClients[0].name}`,
        action: 'Proposer une fidélisation premium',
        data: topClients[0]
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  analyzeSalesTrend() {
    const recentSales = this.getRecentSales(14);
    const olderSales = this.getRecentSales(28, 14);
    
    if (recentSales.length === 0 || olderSales.length === 0) {
      return { trend: 'stable', percentage: 0 };
    }

    const recentAvg = recentSales.reduce((sum, sale) => sum + sale.montant, 0) / recentSales.length;
    const olderAvg = olderSales.reduce((sum, sale) => sum + sale.montant, 0) / olderSales.length;
    
    const percentage = ((recentAvg - olderAvg) / olderAvg * 100);
    
    return {
      trend: percentage > this.rules.sales.increasing.threshold ? 'increasing' : 
             percentage < this.rules.sales.decreasing.threshold ? 'decreasing' : 'stable',
      percentage: Math.abs(Math.round(percentage)),
      recentAvg,
      olderAvg
    };
  }

  getTopClients(limit = 5) {
    const clientSales = {};
    
    window.DB?.ventes?.forEach(sale => {
      if (!clientSales[sale.client]) {
        clientSales[sale.client] = { name: sale.client, total: 0, count: 0 };
      }
      clientSales[sale.client].total += sale.montant;
      clientSales[sale.client].count++;
    });

    return Object.values(clientSales)
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }

  getRecentSales(days = 14, offset = 0) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days - offset);
    
    return window.DB?.ventes?.filter(sale => 
      sale.date >= cutoffDate.toISOString().split('T')[0]
    ) || [];
  }
}

// ─── TABLEAU DE BORD INTELLIGENT ───────────────────────────────────────────
export class SmartDashboard {
  constructor() {
    this.predictor = new SalesPredictor();
    this.recommendations = new SmartRecommendations();
  }

  // Afficher le dashboard intelligent
  async renderSmartDashboard() {
    console.log('🧠 Génération du dashboard intelligent...');
    
    // Prédictions des ventes
    const oeufsPredictions = this.predictor.predictNext7Days('Œufs');
    const pouletsPredictions = this.predictor.predictNext7Days('Poulets');
    
    // Recommandations
    const recommendations = this.recommendations.generateRecommendations();
    
    // Mettre à jour l'interface
    this.updatePredictionsDisplay(oeufsPredictions, pouletsPredictions);
    this.updateRecommendationsDisplay(recommendations);
    this.updateSmartKPIs();
  }

  updatePredictionsDisplay(oeufsPred, pouletsPred) {
    const predictionsContainer = document.getElementById('ai-predictions');
    if (!predictionsContainer) return;

    const totalOeufs = oeufsPred.reduce((sum, p) => sum + p.predicted, 0);
    const totalPoulets = pouletsPred.reduce((sum, p) => sum + p.predicted, 0);

    predictionsContainer.innerHTML = `
      <div class="ai-section">
        <h3>🧠 Prédictions IA - 7 prochains jours</h3>
        <div class="prediction-grid">
          <div class="prediction-card">
            <div class="prediction-icon">🥚</div>
            <div class="prediction-data">
              <div class="prediction-value">${fmtMoney(totalOeufs)}</div>
              <div class="prediction-label">Ventes œufs prédites</div>
              <div class="prediction-confidence">Confiance: ${Math.round(oeufsPred.reduce((sum, p) => sum + p.confidence, 0) / oeufsPred.length)}%</div>
            </div>
          </div>
          <div class="prediction-card">
            <div class="prediction-icon">🐓</div>
            <div class="prediction-data">
              <div class="prediction-value">${fmtMoney(totalPoulets)}</div>
              <div class="prediction-label">Ventes poulets prédites</div>
              <div class="prediction-confidence">Confiance: ${Math.round(pouletsPred.reduce((sum, p) => sum + p.confidence, 0) / pouletsPred.length)}%</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateRecommendationsDisplay(recommendations) {
    const recommendationsContainer = document.getElementById('ai-recommendations');
    if (!recommendationsContainer) return;

    const priorityColors = {
      high: '#ff4444',
      medium: '#ff8800',
      low: '#00aa00'
    };

    recommendationsContainer.innerHTML = `
      <div class="ai-section">
        <h3>💡 Recommandations intelligentes</h3>
        <div class="recommendations-list">
          ${recommendations.map(rec => `
            <div class="recommendation-item" style="border-left: 4px solid ${priorityColors[rec.priority]}">
              <div class="recommendation-header">
                <span class="recommendation-priority ${rec.priority}">${rec.priority.toUpperCase()}</span>
                <span class="recommendation-message">${rec.message}</span>
              </div>
              <div class="recommendation-action">
                <strong>Action:</strong> ${rec.action}
                ${rec.suggestedQty ? `<br><strong>Quantité suggérée:</strong> ${rec.suggestedQty}` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  updateSmartKPIs() {
    // KPIs calculés par l'IA
    const efficiency = this.calculateOperationalEfficiency();
    const growth = this.calculateGrowthRate();
    const profitability = this.calculateProfitability();

    const kpiContainer = document.getElementById('ai-kpis');
    if (!kpiContainer) return;

    kpiContainer.innerHTML = `
      <div class="ai-section">
        <h3>📊 KPIs Avancés</h3>
        <div class="smart-kpis-grid">
          <div class="smart-kpi-card">
            <div class="smart-kpi-value">${efficiency}%</div>
            <div class="smart-kpi-label">Efficacité opérationnelle</div>
          </div>
          <div class="smart-kpi-card">
            <div class="smart-kpi-value">${growth}%</div>
            <div class="smart-kpi-label">Taux de croissance</div>
          </div>
          <div class="smart-kpi-card">
            <div class="smart-kpi-value">${profitability}%</div>
            <div class="smart-kpi-label">Rentabilité</div>
          </div>
        </div>
      </div>
    `;
  }

  calculateOperationalEfficiency() {
    const totalStock = window.DB?.stocks?.reduce((sum, s) => sum + s.qte, 0) || 0;
    const lowStock = window.DB?.stocks?.filter(s => s.qte < s.seuil).length || 0;
    const efficiency = Math.max(0, 100 - (lowStock / totalStock * 100));
    return Math.round(efficiency);
  }

  calculateGrowthRate() {
    const thisMonth = this.getMonthlySales(0);
    const lastMonth = this.getMonthlySales(1);
    
    if (lastMonth === 0) return 0;
    const growth = ((thisMonth - lastMonth) / lastMonth * 100);
    return Math.round(growth);
  }

  calculateProfitability() {
    const totalRevenue = window.DB?.ventes?.reduce((sum, v) => sum + v.montant, 0) || 0;
    const avgCost = totalRevenue * 0.6; // Estimation 60% de coût
    const profit = totalRevenue - avgCost;
    const profitability = totalRevenue > 0 ? (profit / totalRevenue * 100) : 0;
    return Math.round(profitability);
  }

  getMonthlySales(monthsAgo = 0) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    const yearMonth = date.toISOString().slice(0, 7); // YYYY-MM
    
    return window.DB?.ventes?.filter(v => v.date.startsWith(yearMonth))
      .reduce((sum, v) => sum + v.montant, 0) || 0;
  }
}

// ─── INITIALISATION AUTOMATIQUE ─────────────────────────────────────────────
export function initializeAI() {
  console.log('🧠 Initialisation de l\'intelligence artificielle SAM-CI...');
  
  // Demander la permission pour les notifications
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Initialiser le dashboard intelligent
  const smartDashboard = new SmartDashboard();
  
  // Mettre à jour toutes les 5 minutes
  setInterval(() => {
    smartDashboard.renderSmartDashboard();
  }, 5 * 60 * 1000);

  // Mettre à jour immédiatement
  smartDashboard.renderSmartDashboard();
  
  console.log('✅ IA SAM-CI initialisée avec succès');
}

// Fonctions utilitaires pour le formatage
function fmtMoney(n) { 
  return (Number(n) || 0).toLocaleString('fr-FR') + ' FCFA'; 
}
