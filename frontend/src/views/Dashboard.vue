<template>
  <div class="container">
    <div class="dashboard-header">
      <h1>Panel główny</h1>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card stats-card">
        <h3>Szybkie podsumowanie</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Saldo</span>
            <span class="stat-value">2 500,00 zł</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Przychody</span>
            <span class="stat-value positive">+3 000,00 zł</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Wydatki</span>
            <span class="stat-value negative">-500,00 zł</span>
          </div>
        </div>
      </div>
    </div>
    <div class="dashboard-card transactions-card">
      <TransactionList />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TransactionList from '@/components/TransactionList.vue';

export default {
  name: 'Dashboard',
  components: {
    TransactionList
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    user() {
      return this.currentUser;
    }
  }
}
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

.stat-value.positive {
  color: #10b981;
}

.stat-value.negative {
  color: #ef4444;
}

.budget-progress {
  margin-top: 16px;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress {
  height: 100%;
  background: #10b981;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.budget-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #64748b;
}

.transactions-card {
  margin-top: 24px;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
}
</style> 