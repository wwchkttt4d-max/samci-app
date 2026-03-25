/* ════════════════════════════════════════════════════════════════
   SAM-CI RAPPORTS - GESTION DES RAPPORTS ET IMPRESSION
   Sauvegarde et impression des rapports dans la base de données
   ════════════════════════════════════════════════════════════════ */

// ─── STRUCTURE DE DONNÉES POUR LES RAPPORTS ─────────────────────────────────────
class ReportManager {
  constructor() {
    this.reports = [];
    this.reportTypes = {
      daily: 'Rapport Journalier',
      weekly: 'Rapport Hebdomadaire',
      monthly: 'Rapport Mensuel',
      yearly: 'Rapport Annuel',
      sales: 'Rapport des Ventes',
      stocks: 'Rapport des Stocks',
      financial: 'Rapport Financier',
      custom: 'Rapport Personnalisé'
    };
  }

  // Générer un rapport complet
  async generateReport(type, startDate, endDate, options = {}) {
    const reportData = await this.collectReportData(type, startDate, endDate, options);
    const report = {
      id: Date.now().toString(),
      type: type,
      title: this.reportTypes[type] || 'Rapport',
      startDate: startDate,
      endDate: endDate,
      data: reportData,
      generatedAt: new Date().toISOString(),
      generatedBy: window.UI?.currentUser?.name || 'Utilisateur',
      options: options,
      status: 'generated'
    };

    // Sauvegarder dans Firebase
    await this.saveReportToFirebase(report);
    
    // Ajouter localement
    this.reports.push(report);
    
    console.log('📊 Rapport généré:', report.title);
    return report;
  }

  // Collecter les données pour le rapport
  async collectReportData(type, startDate, endDate, options) {
    const data = {
      summary: {},
      details: {},
      charts: {},
      statistics: {}
    };

    switch(type) {
      case 'daily':
      case 'weekly':
      case 'monthly':
        data.summary = await this.getSummaryData(startDate, endDate);
        data.details = await this.getDetailedData(startDate, endDate);
        data.charts = await this.getChartData(startDate, endDate);
        break;
      
      case 'sales':
        data.summary = await this.getSalesSummary(startDate, endDate);
        data.details = await this.getSalesDetails(startDate, endDate);
        data.charts = await this.getSalesCharts(startDate, endDate);
        break;
      
      case 'stocks':
        data.summary = await this.getStocksSummary();
        data.details = await this.getStocksDetails();
        data.charts = await this.getStocksCharts();
        break;
      
      case 'financial':
        data.summary = await this.getFinancialSummary(startDate, endDate);
        data.details = await this.getFinancialDetails(startDate, endDate);
        data.charts = await this.getFinancialCharts(startDate, endDate);
        break;
    }

    return data;
  }

  // Données résumées
  async getSummaryData(startDate, endDate) {
    const sales = window.DB?.ventes?.filter(v => v.date >= startDate && v.date <= endDate) || [];
    const totalSales = sales.reduce((sum, v) => sum + v.montant, 0);
    const totalTransactions = sales.length;
    const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    const topProducts = this.getTopProducts(sales);
    const topClients = this.getTopClients(sales);

    return {
      totalSales,
      totalTransactions,
      avgTransaction,
      topProducts,
      topClients,
      period: `${startDate} au ${endDate}`
    };
  }

  // Données détaillées
  async getDetailedData(startDate, endDate) {
    const sales = window.DB?.ventes?.filter(v => v.date >= startDate && v.date <= endDate) || [];
    const stocks = window.DB?.stocks || [];
    const clients = window.DB?.clients || [];

    return {
      sales: sales.map(s => ({
        id: s.id,
        numero: s.num,
        client: s.client,
        montant: s.montant,
        date: s.date,
        statut: s.statut,
        produits: s.produits
      })),
      stocks: stocks.map(s => ({
        id: s.id,
        produit: s.produit,
        quantite: s.qte,
        unite: s.unite,
        seuil: s.seuil,
        prix: s.prix,
        statut: s.qte < s.seuil ? 'Critique' : 'Normal'
      })),
      clients: clients.map(c => ({
        id: c.id,
        nom: c.nom,
        telephone: c.telephone,
        type: c.type,
        ca: c.ca || 0,
        solde: c.solde || 0
      }))
    };
  }

  // Données pour graphiques
  async getChartData(startDate, endDate) {
    const sales = window.DB?.ventes?.filter(v => v.date >= startDate && v.date <= endDate) || [];
    
    // Regrouper par jour
    const dailySales = {};
    sales.forEach(sale => {
      if (!dailySales[sale.date]) {
        dailySales[sale.date] = 0;
      }
      dailySales[sale.date] += sale.montant;
    });

    return {
      dailySales: Object.entries(dailySales).map(([date, amount]) => ({
        date,
        amount
      })).sort((a, b) => new Date(a.date) - new Date(b.date))
    };
  }

  // Résumé des ventes
  async getSalesSummary(startDate, endDate) {
    const sales = window.DB?.ventes?.filter(v => v.date >= startDate && v.date <= endDate) || [];
    
    const total = sales.reduce((sum, v) => sum + v.montant, 0);
    const paid = sales.filter(v => v.statut === 'Payée').reduce((sum, v) => sum + v.montant, 0);
    const unpaid = sales.filter(v => v.statut !== 'Payée').reduce((sum, v) => sum + v.montant, 0);

    return {
      total,
      paid,
      unpaid,
      transactionCount: sales.length,
      averageTicket: sales.length > 0 ? total / sales.length : 0
    };
  }

  // Détails des ventes
  async getSalesDetails(startDate, endDate) {
    return window.DB?.ventes?.filter(v => v.date >= startDate && v.date <= endDate) || [];
  }

  // Graphiques des ventes
  async getSalesCharts(startDate, endDate) {
    const sales = window.DB?.ventes?.filter(v => v.date >= startDate && v.date <= endDate) || [];
    
    // Ventilation par produit
    const productSales = {};
    sales.forEach(sale => {
      const products = sale.produits?.split(', ') || [];
      products.forEach(product => {
        const cleanProduct = product.replace(/^\d+ x /, '');
        if (!productSales[cleanProduct]) {
          productSales[cleanProduct] = 0;
        }
        productSales[cleanProduct] += sale.montant;
      });
    });

    return {
      byProduct: Object.entries(productSales).map(([product, amount]) => ({
        product,
        amount
      })).sort((a, b) => b.amount - a.amount)
    };
  }

  // Résumé des stocks
  async getStocksSummary() {
    const stocks = window.DB?.stocks || [];
    const totalProducts = stocks.length;
    const lowStock = stocks.filter(s => s.qte < s.seuil).length;
    const totalValue = stocks.reduce((sum, s) => sum + (s.qte * (s.prix || 0)), 0);

    return {
      totalProducts,
      lowStock,
      totalValue,
      stockHealth: totalProducts > 0 ? ((totalProducts - lowStock) / totalProducts * 100) : 0
    };
  }

  // Détails des stocks
  async getStocksDetails() {
    return window.DB?.stocks || [];
  }

  // Graphiques des stocks
  async getStocksCharts() {
    const stocks = window.DB?.stocks || [];
    
    return {
      stockLevels: stocks.map(s => ({
        product: s.produit,
        current: s.qte,
        threshold: s.seuil,
        status: s.qte < s.seuil ? 'Critique' : 'Normal'
      }))
    };
  }

  // Résumé financier
  async getFinancialSummary(startDate, endDate) {
    const sales = window.DB?.ventes?.filter(v => v.date >= startDate && v.date <= endDate) || [];
    const accounting = window.DB?.comptabilite?.filter(c => c.date >= startDate && c.date <= endDate) || [];
    
    const revenue = sales.reduce((sum, v) => sum + v.montant, 0);
    const expenses = accounting.filter(c => c.type === 'Dépense').reduce((sum, c) => sum + c.montant, 0);
    const profit = revenue - expenses;

    return {
      revenue,
      expenses,
      profit,
      margin: revenue > 0 ? (profit / revenue * 100) : 0
    };
  }

  // Détails financiers
  async getFinancialDetails(startDate, endDate) {
    const sales = window.DB?.ventes?.filter(v => v.date >= startDate && v.date <= endDate) || [];
    const accounting = window.DB?.comptabilite?.filter(c => c.date >= startDate && c.date <= endDate) || [];
    
    return {
      sales,
      accounting
    };
  }

  // Graphiques financiers
  async getFinancialCharts(startDate, endDate) {
    const accounting = window.DB?.comptabilite?.filter(c => c.date >= startDate && c.date <= endDate) || [];
    
    // Regrouper par catégorie
    const categoryTotals = {};
    accounting.forEach(entry => {
      if (!categoryTotals[entry.categorie]) {
        categoryTotals[entry.categorie] = { revenue: 0, expense: 0 };
      }
      if (entry.type === 'Recette') {
        categoryTotals[entry.categorie].revenue += entry.montant;
      } else {
        categoryTotals[entry.categorie].expense += entry.montant;
      }
    });

    return {
      byCategory: Object.entries(categoryTotals).map(([category, data]) => ({
        category,
        revenue: data.revenue,
        expense: data.expense,
        net: data.revenue - data.expense
      }))
    };
  }

  // Obtenir les produits les plus vendus
  getTopProducts(sales) {
    const productCounts = {};
    
    sales.forEach(sale => {
      const products = sale.produits?.split(', ') || [];
      products.forEach(product => {
        const cleanProduct = product.replace(/^\d+ x /, '');
        if (!productCounts[cleanProduct]) {
          productCounts[cleanProduct] = 0;
        }
        productCounts[cleanProduct]++;
      });
    });

    return Object.entries(productCounts)
      .map(([product, count]) => ({ product, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Obtenir les meilleurs clients
  getTopClients(sales) {
    const clientTotals = {};
    
    sales.forEach(sale => {
      if (!clientTotals[sale.client]) {
        clientTotals[sale.client] = 0;
      }
      clientTotals[sale.client] += sale.montant;
    });

    return Object.entries(clientTotals)
      .map(([client, total]) => ({ client, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }

  // Sauvegarder le rapport dans Firebase
  async saveReportToFirebase(report) {
    if (!window.db) {
      console.warn('📊 Firebase non disponible, sauvegarde locale uniquement');
      return false;
    }

    try {
      const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await addDoc(collection(window.db, 'Reports'), {
        ...report,
        createdAt: new Date()
      });
      
      console.log('📊 Rapport sauvegardé dans Firebase:', report.title);
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde rapport:', error);
      return false;
    }
  }

  // Charger les rapports depuis Firebase
  async loadReportsFromFirebase() {
    if (!window.db) {
      console.warn('📊 Firebase non disponible');
      return [];
    }

    try {
      const { collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      const querySnapshot = await getDocs(collection(window.db, 'Reports'));
      const reports = [];
      
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });
      
      this.reports = reports;
      console.log('📊 Rapports chargés:', reports.length);
      return reports;
    } catch (error) {
      console.error('❌ Erreur chargement rapports:', error);
      return [];
    }
  }

  // Supprimer un rapport
  async deleteReport(reportId) {
    if (!window.db) {
      console.warn('📊 Firebase non disponible');
      return false;
    }

    try {
      const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      
      await deleteDoc(doc(window.db, 'Reports', reportId));
      
      // Supprimer localement
      this.reports = this.reports.filter(r => r.id !== reportId);
      
      console.log('📊 Rapport supprimé:', reportId);
      return true;
    } catch (error) {
      console.error('❌ Erreur suppression rapport:', error);
      return false;
    }
  }

  // Imprimer un rapport
  printReport(reportId) {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) {
      console.error('📊 Rapport non trouvé:', reportId);
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(this.generatePrintableHTML(report));
    printWindow.document.close();
    printWindow.print();
  }

  // Générer le HTML imprimable
  generatePrintableHTML(report) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .subtitle { color: #666; margin-bottom: 5px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .summary-item { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
          .summary-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
          .summary-label { color: #666; margin-top: 5px; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${report.title}</div>
          <div class="subtitle">Période: ${report.startDate} au ${endDate}</div>
          <div class="subtitle">Généré le: ${new Date(report.generatedAt).toLocaleDateString('fr-FR')}</div>
          <div class="subtitle">Généré par: ${report.generatedBy}</div>
        </div>

        ${this.generateSummaryHTML(report.data.summary)}
        ${this.generateDetailsHTML(report.data.details)}
        ${this.generateChartsHTML(report.data.charts)}

        <div class="footer">
          <p>SAM-CI - Système de Gestion Avicole</p>
          <p>Rapport généré automatiquement</p>
        </div>
      </body>
      </html>
    `;
  }

  // Générer HTML pour le résumé
  generateSummaryHTML(summary) {
    if (!summary || Object.keys(summary).length === 0) return '';

    let html = '<div class="section"><div class="section-title">Résumé</div><div class="summary">';
    
    Object.entries(summary).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Gérer les objets imbriqués
        if (Array.isArray(value)) {
          html += `<div class="summary-item">
            <div class="summary-value">${value.length}</div>
            <div class="summary-label">${this.formatLabel(key)}</div>
          </div>`;
        } else {
          Object.entries(value).forEach(([subKey, subValue]) => {
            html += `<div class="summary-item">
              <div class="summary-value">${this.formatValue(subValue)}</div>
              <div class="summary-label">${this.formatLabel(subKey)}</div>
            </div>`;
          });
        }
      } else {
        html += `<div class="summary-item">
          <div class="summary-value">${this.formatValue(value)}</div>
          <div class="summary-label">${this.formatLabel(key)}</div>
        </div>`;
      }
    });
    
    html += '</div></div>';
    return html;
  }

  // Générer HTML pour les détails
  generateDetailsHTML(details) {
    if (!details || Object.keys(details).length === 0) return '';

    let html = '<div class="section"><div class="section-title">Détails</div>';
    
    Object.entries(details).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        html += `<h3>${this.formatLabel(key)}</h3>`;
        html += '<table>';
        
        // En-têtes du tableau
        const headers = Object.keys(value[0]);
        html += '<tr>' + headers.map(h => `<th>${this.formatLabel(h)}</th>`).join('') + '</tr>';
        
        // Données du tableau
        value.forEach(item => {
          html += '<tr>' + headers.map(h => `<td>${this.formatValue(item[h])}</td>`).join('') + '</tr>';
        });
        
        html += '</table>';
      }
    });
    
    html += '</div>';
    return html;
  }

  // Générer HTML pour les graphiques
  generateChartsHTML(charts) {
    if (!charts || Object.keys(charts).length === 0) return '';

    let html = '<div class="section"><div class="section-title">Graphiques</div>';
    
    Object.entries(charts).forEach(([key, value]) => {
      html += `<h3>${this.formatLabel(key)}</h3>`;
      
      if (Array.isArray(value)) {
        html += '<table>';
        html += '<tr><th>Élément</th><th>Valeur</th></tr>';
        value.forEach(item => {
          const label = item.product || item.date || item.category || 'Inconnu';
          const val = item.amount || item.total || item.value || 0;
          html += `<tr><td>${label}</td><td>${this.formatValue(val)}</td></tr>`;
        });
        html += '</table>';
      }
    });
    
    html += '</div>';
    return html;
  }

  // Formater les labels
  formatLabel(key) {
    const labels = {
      totalSales: 'Ventes totales',
      totalTransactions: 'Transactions totales',
      avgTransaction: 'Transaction moyenne',
      topProducts: 'Produits populaires',
      topClients: 'Meilleurs clients',
      revenue: 'Revenus',
      expenses: 'Dépenses',
      profit: 'Profit',
      margin: 'Marge',
      totalProducts: 'Produits totaux',
      lowStock: 'Stock bas',
      totalValue: 'Valeur totale'
    };
    
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  // Formater les valeurs
  formatValue(value) {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0
      }).format(value);
    }
    
    if (Array.isArray(value)) {
      return value.length + ' éléments';
    }
    
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    
    return value || '-';
  }
}

// ─── EXPORT GLOBAL ─────────────────────────────────────────────────────────────
export const reportManager = new ReportManager();

// Fonctions globales pour l'interface
window.generateReport = async (type, startDate, endDate, options = {}) => {
  try {
    const report = await reportManager.generateReport(type, startDate, endDate, options);
    if (typeof showToast === 'function') {
      showToast('📊 Rapport généré avec succès', 'success');
    }
    return report;
  } catch (error) {
    console.error('❌ Erreur génération rapport:', error);
    if (typeof showToast === 'function') {
      showToast('❌ Erreur lors de la génération du rapport', 'error');
    }
    return null;
  }
};

window.printReport = (reportId) => {
  try {
    reportManager.printReport(reportId);
    if (typeof showToast === 'function') {
      showToast('🖨️ Impression du rapport en cours', 'info');
    }
  } catch (error) {
    console.error('❌ Erreur impression rapport:', error);
    if (typeof showToast === 'function') {
      showToast('❌ Erreur lors de l\'impression du rapport', 'error');
    }
  }
};

window.deleteReport = async (reportId) => {
  try {
    const success = await reportManager.deleteReport(reportId);
    if (success && typeof showToast === 'function') {
      showToast('📊 Rapport supprimé avec succès', 'success');
    }
    return success;
  } catch (error) {
    console.error('❌ Erreur suppression rapport:', error);
    if (typeof showToast === 'function') {
      showToast('❌ Erreur lors de la suppression du rapport', 'error');
    }
    return false;
  }
};

window.loadReports = async () => {
  try {
    const reports = await reportManager.loadReportsFromFirebase();
    return reports;
  } catch (error) {
    console.error('❌ Erreur chargement rapports:', error);
    return [];
  }
};

console.log('📊 Module de rapports SAM-CI chargé');
