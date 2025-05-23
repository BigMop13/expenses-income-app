<template>
  <div class="container">
    <div class="budget-header">
      <h1>Budżetowanie</h1>
      <button class="add-button" @click="showModal = true">
        Dodaj budżet
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Ładowanie budżetów...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchBudgets" class="retry-button">Spróbuj ponownie</button>
    </div>

    <div v-else class="budget-grid">
      <!-- Current Month Overview -->
      <div class="budget-card overview-card">
        <h3>Podsumowanie budżetu</h3>
        <div class="budget-stats">
          <div class="stat-item">
            <span class="stat-label">Całkowity budżet</span>
            <span class="stat-value">{{ formatCurrency(totalBudget) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Liczba budżetów</span>
            <span class="stat-value">{{ budgets.length }}</span>
          </div>
        </div>
      </div>

      <!-- Budget List -->
      <div class="budget-card list-card">
        <h3>Twoje budżety</h3>
        <div v-if="budgets.length > 0" class="budget-list">
          <div v-for="budget in budgets" :key="budget._id" class="budget-item">
            <div class="budget-info">
              <span class="category">{{ budget.category || 'Budżet ogólny' }}</span>
              <span class="amount">{{ formatCurrency(budget.amount) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          Nie masz jeszcze żadnych budżetów
        </div>
      </div>
    </div>

    <!-- Add Budget Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>Dodaj nowy budżet</h3>
        <form @submit.prevent="saveBudget" class="budget-form">
          <div class="form-group">
            <label for="amount">Kwota</label>
            <input 
              id="amount"
              v-model.number="newBudget.amount"
              type="number"
              step="0.01"
              required
              placeholder="Wprowadź kwotę budżetu"
            >
          </div>

          <div class="form-group">
            <label for="category">Kategoria</label>
            <input 
              id="category"
              v-model="newBudget.category"
              type="text"
              placeholder="Pozostaw puste dla budżetu ogólnego"
            >
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-button" @click="closeModal">
              Anuluj
            </button>
            <button type="submit" class="submit-button" :disabled="submitting">
              {{ submitting ? 'Dodawanie...' : 'Dodaj' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import budgetService from '../services/budgetService';

export default {
  name: 'Budget',
  setup() {
    const budgets = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const showModal = ref(false);
    const submitting = ref(false);

    const newBudget = ref({
      amount: '',
      category: ''
    });

    const totalBudget = computed(() => {
      return budgets.value.reduce((sum, budget) => sum + budget.amount, 0);
    });

    const fetchBudgets = async () => {
      loading.value = true;
      error.value = null;
      try {
        budgets.value = await budgetService.getBudgets();
      } catch (err) {
        error.value = 'Nie udało się pobrać budżetów. Spróbuj ponownie.';
        console.error('Error fetching budgets:', err);
      } finally {
        loading.value = false;
      }
    };

    const saveBudget = async () => {
      submitting.value = true;
      try {
        await budgetService.addBudget({
          amount: newBudget.value.amount,
          category: newBudget.value.category
        });
        await fetchBudgets();
        closeModal();
      } catch (err) {
        console.error('Failed to add budget:', err);
        alert('Nie udało się dodać budżetu. Spróbuj ponownie później.');
      } finally {
        submitting.value = false;
      }
    };

    const closeModal = () => {
      showModal.value = false;
      newBudget.value = {
        amount: '',
        category: ''
      };
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
      }).format(amount);
    };

    onMounted(() => {
      fetchBudgets();
    });

    return {
      budgets,
      loading,
      error,
      showModal,
      submitting,
      newBudget,
      totalBudget,
      fetchBudgets,
      saveBudget,
      closeModal,
      formatCurrency
    };
  }
};
</script>

<style scoped>
.container {
  padding: 24px;
}

.budget-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.budget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.budget-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.budget-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.budget-stats {
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

.budget-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.budget-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: background-color 0.2s;
}

.budget-item:hover {
  background-color: #f1f5f9;
}

.budget-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category {
  font-weight: 600;
  color: #2c3e50;
}

.amount {
  font-weight: 500;
  color: #4CAF50;
}

.add-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #388e3c;
}

/* Loading and Error States */
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.budget-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #e2e8f0;
  color: #475569;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #cbd5e1;
}

.submit-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #388e3c;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .budget-grid {
    grid-template-columns: 1fr;
  }

  .budget-stats {
    grid-template-columns: 1fr;
  }

  .budget-card {
    padding: 20px;
  }

  .modal {
    width: 95%;
    padding: 20px;
  }
}
</style> 