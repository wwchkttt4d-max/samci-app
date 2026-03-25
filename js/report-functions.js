/* ════════════════════════════════════════════════════════════════
   SAM-CI FONCTIONS DE RAPPORTS - INTERFACE UTILISATEUR
   Fonctions pour générer, sauvegarder et imprimer les rapports
   ════════════════════════════════════════════════════════════════ */

// ─── FONCTIONS GLOBALES POUR LES RAPPORTS ───────────────────────────────────────
window.generateAndSaveReport = async () => {
  const reportType = document.getElementById('report-type')?.value;
  const startDate = document.getElementById('report-start-date')?.value;
  const endDate = document.getElementById('report-end-date')?.value;

  if (!reportType) {
    if (typeof showToast === 'function') {
      showToast('❌ Veuillez sélectionner un type de rapport', 'error');
    }
    return;
  }

  if (!startDate || !endDate) {
    if (typeof showToast === 'function') {
      showToast('❌ Veuillez sélectionner une période', 'error');
    }
    return;
  }

  try {
    if (typeof showToast === 'function') {
      showToast('📊 Génération du rapport en cours...', 'info');
    }

    const report = await window.generateReport(reportType, startDate, endDate);
    
    if (report) {
      // Afficher le rapport dans la liste
      await loadExistingReports();
      
      if (typeof showToast === 'function') {
        showToast('✅ Rapport généré et sauvegardé avec succès', 'success');
      }
    }
  } catch (error) {
    console.error('❌ Erreur génération rapport:', error);
    if (typeof showToast === 'function') {
      showToast('❌ Erreur lors de la génération du rapport', 'error');
    }
  }
};

window.loadExistingReports = async () => {
  try {
    if (typeof showToast === 'function') {
      showToast('📋 Chargement des rapports...', 'info');
    }

    const reports = await window.loadReports();
    
    // Afficher le conteneur des rapports
    const container = document.getElementById('reports-list-container');
    if (container) {
      container.style.display = 'block';
    }

    // Mettre à jour le tableau
    const tbody = document.getElementById('reports-tbody');
    if (tbody) {
      tbody.innerHTML = '';
      
      if (reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text3)">Aucun rapport disponible</td></tr>';
      } else {
        reports.forEach(report => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${report.title}</td>
            <td>${report.startDate} au ${report.endDate}</td>
            <td>${new Date(report.generatedAt).toLocaleDateString('fr-FR')}</td>
            <td>
              <button class="header-btn" onclick="printReport('${report.id}')" style="margin-right:8px">🖨️ Imprimer</button>
              <button class="header-btn" onclick="deleteReport('${report.id}')" style="background-color:#dc3545">🗑️ Supprimer</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      }
    }

    if (typeof showToast === 'function') {
      showToast(`📋 ${reports.length} rapport(s) trouvé(s)`, 'success');
    }
  } catch (error) {
    console.error('❌ Erreur chargement rapports:', error);
    if (typeof showToast === 'function') {
      showToast('❌ Erreur lors du chargement des rapports', 'error');
    }
  }
};

// ─── INITIALISATION AUTOMATIQUE DES DATES ───────────────────────────────────────
window.initializeReportDates = () => {
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  const startDateInput = document.getElementById('report-start-date');
  const endDateInput = document.getElementById('report-end-date');

  if (startDateInput && !startDateInput.value) {
    startDateInput.value = lastMonth.toISOString().split('T')[0];
  }

  if (endDateInput && !endDateInput.value) {
    endDateInput.value = today.toISOString().split('T')[0];
  }
};

// ─── RAPPORTS PRÉDÉFINIS RAPIDES ─────────────────────────────────────────────────
window.generateQuickReport = async (type) => {
  const today = new Date();
  let startDate, endDate;

  switch(type) {
    case 'today':
      startDate = endDate = today.toISOString().split('T')[0];
      break;
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      startDate = weekStart.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
      break;
    case 'month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
      break;
    case 'year':
      startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
      break;
    default:
      return;
  }

  // Mettre à jour les champs du formulaire
  const startDateInput = document.getElementById('report-start-date');
  const endDateInput = document.getElementById('report-end-date');
  const typeSelect = document.getElementById('report-type');

  if (startDateInput) startDateInput.value = startDate;
  if (endDateInput) endDateInput.value = endDate;
  if (typeSelect) typeSelect.value = 'daily';

  // Générer le rapport
  await window.generateAndSaveReport();
};

// ─── EXPORT DES DONNÉES EN DIFFÉRENTS FORMATS ───────────────────────────────────
window.exportReportData = async (format = 'json') => {
  const reportType = document.getElementById('report-type')?.value;
  const startDate = document.getElementById('report-start-date')?.value;
  const endDate = document.getElementById('report-end-date')?.value;

  if (!reportType || !startDate || !endDate) {
    if (typeof showToast === 'function') {
      showToast('❌ Veuillez remplir tous les champs', 'error');
    }
    return;
  }

  try {
    // Collecter les données brutes
    const data = await window.reportManager.collectReportData(reportType, startDate, endDate, {});
    
    let content, filename, mimeType;

    switch(format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `rapport_${reportType}_${startDate}_${endDate}.json`;
        mimeType = 'application/json';
        break;
      
      case 'csv':
        content = convertToCSV(data);
        filename = `rapport_${reportType}_${startDate}_${endDate}.csv`;
        mimeType = 'text/csv';
        break;
      
      case 'excel':
        // Pour Excel, on utilisera une librairie comme SheetJS dans une version future
        content = convertToCSV(data);
        filename = `rapport_${reportType}_${startDate}_${endDate}.csv`;
        mimeType = 'text/csv';
        break;
      
      default:
        throw new Error('Format non supporté');
    }

    // Télécharger le fichier
    downloadFile(content, filename, mimeType);
    
    if (typeof showToast === 'function') {
      showToast(`📁 Export ${format.toUpperCase()} réussi`, 'success');
    }
  } catch (error) {
    console.error('❌ Erreur export:', error);
    if (typeof showToast === 'function') {
      showToast('❌ Erreur lors de l\'export', 'error');
    }
  }
};

// ─── FONCTIONS UTILITAIRES ───────────────────────────────────────────────────────
function convertToCSV(data) {
  if (!data || !data.details) return '';

  const csvRows = [];
  
  // Traiter les différents types de données
  Object.entries(data.details).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      csvRows.push(`\n=== ${key.toUpperCase()} ===`);
      
      // En-têtes
      const headers = Object.keys(value[0]);
      csvRows.push(headers.join(','));
      
      // Données
      value.forEach(item => {
        const row = headers.map(header => {
          const val = item[header];
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        });
        csvRows.push(row.join(','));
      });
    }
  });

  return csvRows.join('\n');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── INITIALISATION AU CHARGEMENT DE LA PAGE ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialiser les dates par défaut
  window.initializeReportDates();
  
  // Ajouter des écouteurs d'événements
  const reportTypeSelect = document.getElementById('report-type');
  if (reportTypeSelect) {
    reportTypeSelect.addEventListener('change', () => {
      // Adapter l'interface selon le type de rapport
      const startDateInput = document.getElementById('report-start-date');
      const endDateInput = document.getElementById('report-end-date');
      
      if (reportTypeSelect.value === 'daily') {
        // Pour un rapport journalier, forcer la même date
        const today = new Date().toISOString().split('T')[0];
        if (startDateInput) startDateInput.value = today;
        if (endDateInput) endDateInput.value = today;
      }
    });
  }

  console.log('📊 Fonctions de rapports initialisées');
});

// ─── RACCOURCIS CLAVIER ─────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  // Ctrl+R pour générer un rapport rapide
  if (e.ctrlKey && e.key === 'r') {
    e.preventDefault();
    if (document.getElementById('page-rapports')?.classList.contains('active')) {
      window.generateAndSaveReport();
    }
  }
  
  // Ctrl+P pour imprimer (si sur la page des rapports)
  if (e.ctrlKey && e.key === 'p') {
    if (document.getElementById('page-rapports')?.classList.contains('active')) {
      e.preventDefault();
      // Sélectionner le premier rapport disponible et l'imprimer
      const firstPrintBtn = document.querySelector('[onclick^="printReport"]');
      if (firstPrintBtn) {
        const reportId = firstPrintBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
        window.printReport(reportId);
      }
    }
  }
});

console.log('📊 Module de fonctions de rapports SAM-CI chargé');
