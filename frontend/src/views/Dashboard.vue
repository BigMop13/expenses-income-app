<template>
  <div class="container">
    <div class="dashboard-header">
      <h1>Panel główny</h1>
      <button class="add-button" @click="showModal = true">
        Dodaj transakcję
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Ładowanie transakcji...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchTransactions" class="retry-button">Spróbuj ponownie</button>
    </div>

    <div v-else class="transactions-container">
      <div class="transactions">
        <div v-for="transaction in transactions" :key="transaction._id" class="transaction-item">
          <div class="transaction-info">
            <div class="transaction-main">
              <span class="category">{{ transaction.category }}</span>
              <span class="description">{{ transaction.description }}</span>
            </div>
            <div class="transaction-details">
              <span class="date">{{ formatDate(transaction.date) }}</span>
              <span :class="['amount', transaction.amount >= 0 ? 'income' : 'expense']">
                {{ formatCurrency(transaction.amount) }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="!loading && !transactions.length" class="empty-state">
          <p>Brak transakcji</p>
        </div>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <h3>Dodaj nową transakcję</h3>
        <form @submit.prevent="addTransaction" class="transaction-form">
          <div class="form-group">
            <label for="category">Kategoria</label>
            <input 
              id="category"
              v-model="newTransaction.category"
              type="text"
              required
              placeholder="np. Zakupy spożywcze"
            >
          </div>

          <div class="form-group">
            <label for="description">Opis</label>
            <input 
              id="description"
              v-model="newTransaction.description"
              type="text"
              required
              placeholder="np. Tygodniowe zakupy"
            >
          </div>

          <div class="form-group">
            <label for="amount">Kwota</label>
            <input 
              id="amount"
              v-model="newTransaction.amount"
              type="number"
              step="0.01"
              required
              placeholder="Wprowadź kwotę (ujemna dla wydatku)"
            >
          </div>

          <div class="form-group">
            <label for="date">Data</label>
            <input 
              id="date"
              v-model="newTransaction.date"
              :max="new Date().toISOString().split('T')[0]"
              type="date"
              required
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
import { ref, onMounted } from 'vue';
import transactionService from '@/services/transactionService';

export default {
  name: 'Dashboard',
  setup() {
    const transactions = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const showModal = ref(false);
    const submitting = ref(false);

    const newTransaction = ref({
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });

    const fetchTransactions = async () => {
      loading.value = true;
      error.value = null;
      try {
        transactions.value = await transactionService.getTransactions();
      } catch (err) {
        error.value = 'Nie udało się pobrać transakcji. Spróbuj ponownie.';
        console.error('Error fetching transactions:', err);
      } finally {
        loading.value = false;
      }
    };

    const addTransaction = async () => {
      submitting.value = true;
      try {
        const transaction = {
          category: newTransaction.value.category,
          description: newTransaction.value.description,
          amount: parseFloat(newTransaction.value.amount),
          date: new Date(newTransaction.value.date)
        };

        await transactionService.addTransaction(transaction);
        await fetchTransactions();
        closeModal();
      } catch (err) {
        console.error('Failed to add transaction:', err);
        alert('Nie udało się dodać transakcji. Spróbuj ponownie później.');
      } finally {
        submitting.value = false;
      }
    };

    const closeModal = () => {
      showModal.value = false;
      newTransaction.value = {
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      };
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN'
      }).format(amount);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    onMounted(() => {
      fetchTransactions();
    });

    return {
      transactions,
      loading,
      error,
      showModal,
      submitting,
      newTransaction,
      fetchTransactions,
      addTransaction,
      closeModal,
      formatCurrency,
      formatDate
    };
  }
};
</script>

<style scoped>
.container {
  padding: 24px;
}

.dashboard-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.transactions-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.transactions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: background-color 0.2s;
}

.transaction-item:hover {
  background-color: #f1f5f9;
}

.transaction-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category {
  font-weight: 600;
  color: #2c3e50;
}

.description {
  color: #64748b;
  font-size: 14px;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.date {
  color: #64748b;
  font-size: 14px;
}

.amount {
  font-weight: 600;
  font-size: 16px;
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

.empty-state {
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

.transaction-form {
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
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
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
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.positive {
  color: #10b981;
}

.negative {
  color: #ef4444;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .transactions-container {
    padding: 16px;
  }

  .transaction-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .transaction-details {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .modal {
    width: 95%;
    padding: 20px;
  }
}
</style> 