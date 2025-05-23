<template>
  <div class="container">
    <div class="report-header">
      <h1>Raporty i statystyki</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Ładowanie danych...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchStats" class="retry-button">Spróbuj ponownie</button>
    </div>

    <div v-else class="report-grid">
      <!-- Monthly Overview -->
      <div class="report-card stats-card">
        <h3>Miesięczne podsumowanie</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Saldo</span>
            <span class="stat-value" :class="{ 'positive': stats.balance > 0, 'negative': stats.balance < 0 }">
              {{ formatCurrency(stats.balance || 0) }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Przychody</span>
            <span class="stat-value positive">
              {{ formatCurrency(stats.monthly?.income || 0) }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Wydatki</span>
            <span class="stat-value negative">
              {{ formatCurrency(Math.abs(stats.monthly?.expenses || 0)) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="report-card category-card">
        <h3>Kategorie</h3>
        <div v-if="stats.categoryBreakdown && stats.categoryBreakdown.length > 0" class="category-list">
          <div v-for="category in stats.categoryBreakdown" :key="category._id" class="category-item">
            <div class="category-info">
              <span class="category-name">{{ category._id }}</span>
              <span class="category-count">({{ category.count }} transakcji)</span>
            </div>
            <div class="category-amounts">
              <div v-if="category.income > 0" class="amount-detail">
                <span class="amount-label">Przychody:</span>
                <span class="amount positive">{{ formatCurrency(category.income) }}</span>
              </div>
              <div v-if="category.expenses > 0" class="amount-detail">
                <span class="amount-label">Wydatki:</span>
                <span class="amount negative">{{ formatCurrency(category.expenses) }}</span>
              </div>
              <div class="amount-detail total">
                <span class="amount-label">Bilans:</span>
                <span class="amount" :class="{ 'positive': category.total > 0, 'negative': category.total < 0 }">
                  {{ formatCurrency(category.total) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          Brak transakcji w tym miesiącu
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import transactionService from '@/services/transactionService';

export default {
  name: 'Report',
  setup() {
    const stats = ref({
      monthly: { income: 0, expenses: 0 },
      categoryBreakdown: [],
      balance: 0
    });
    const loading = ref(true);
    const error = ref(null);

    const fetchStats = async () => {
      loading.value = true;
      error.value = null;
      try {
        const data = await transactionService.getDashboardStats();
        stats.value = data;
      } catch (err) {
        error.value = 'Nie udało się pobrać statystyk. Spróbuj ponownie.';
        console.error('Error fetching stats:', err);
      } finally {
        loading.value = false;
      }
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
      }).format(amount);
    };

    // Refresh stats every 30 seconds
    let refreshInterval;
    onMounted(() => {
      fetchStats();
      refreshInterval = setInterval(fetchStats, 30000);
    });

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    });

    return {
      stats,
      loading,
      error,
      fetchStats,
      formatCurrency
    };
  }
};
</script>

<style scoped>
.container {
  padding: 24px;
}

.report-header {
  margin-bottom: 24px;
}

.report-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.report-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: background-color 0.2s;
  gap: 12px;
}

.category-item:hover {
  background-color: #f1f5f9;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.category-count {
  color: #64748b;
  font-size: 0.9rem;
}

.category-amounts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.amount-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.amount-detail.total {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
}

.amount-label {
  color: #64748b;
}

.amount {
  font-weight: 500;
}

.positive {
  color: #10b981;
}

.negative {
  color: #ef4444;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 1rem;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #388e3c;
}

.no-data {
  text-align: center;
  color: #64748b;
  padding: 20px;
  font-style: italic;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .report-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .report-card {
    padding: 20px;
  }
}
</style> 