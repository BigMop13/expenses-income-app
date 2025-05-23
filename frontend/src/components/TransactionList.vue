<template>
  <div class="transaction-list">
    <div class="header">
      <h2 class="title">Transakcje</h2>
      <button class="add-button" @click="showModal = true">
        Dodaj transakcję
      </button>
    </div>
    
    <!-- Transaction List -->
    <div v-if="loading" class="loading-state">
      <p>Ładowanie transakcji...</p>
    </div>
    
    <div v-else class="transactions">
      <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
        <div class="transaction-info">
          <div class="transaction-main">
            <span class="category">{{ transaction.category }}</span>
            <span class="description">{{ transaction.description }}</span>
          </div>
          <div class="transaction-details">
            <span class="date">{{ formatDate(transaction.date) }}</span>
            <span :class="['amount', transaction.amount >= 0 ? 'income' : 'expense']">
              {{ formatAmount(transaction.amount) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !transactions.length" class="empty-state">
      <p>Brak transakcji</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchTransactions" class="retry-button">
        Spróbuj ponownie
      </button>
    </div>

    <!-- Add Transaction Modal -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
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
            <button type="button" class="cancel-button" @click="showModal = false">
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

<script setup>
import { ref, onMounted } from 'vue';
import transactionService from '@/services/transactionService';

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
    console.error('Failed to fetch transactions:', err);
    error.value = 'Nie udało się pobrać transakcji. Spróbuj ponownie później.';
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
    
    newTransaction.value = {
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    };
    
    showModal.value = false;
  } catch (err) {
    console.error('Failed to add transaction:', err);
    alert('Nie udało się dodać transakcji. Spróbuj ponownie później.');
  } finally {
    submitting.value = false;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN'
  }).format(amount);
};

onMounted(() => {
  fetchTransactions();
});
</script>

<style scoped>
.transaction-list {
  width: 100%;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.add-button {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.add-button:hover {
  background-color: #059669;
}

.transactions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.transaction-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.transaction-main {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category {
  font-weight: 600;
  color: #2c3e50;
}

.description {
  color: #666;
  font-size: 0.9em;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.date {
  color: #666;
  font-size: 0.9em;
}

.amount {
  font-weight: 600;
  font-size: 1.1em;
  white-space: nowrap;
}

.amount.income {
  color: #10b981;
}

.amount.expense {
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 20px;
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
  padding: 20px;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin: 0 0 20px;
  color: #2c3e50;
  font-size: 20px;
}

.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #4b5563;
}

.form-group input {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 16px;
  width: 100%;
}

.form-group input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
    padding: 12px;
  }

  .transaction-info {
    flex-direction: column;
    gap: 12px;
  }

  .transaction-details {
    align-items: flex-start;
    width: 100%;
  }

  .amount {
    font-size: 1.2em;
  }
}

.cancel-button {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #4b5563;
}

.submit-button {
  padding: 8px 16px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-button:hover {
  background-color: #f9fafb;
}

.submit-button:hover {
  background-color: #059669;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 20px;
}

.error-state {
  color: #ef4444;
  background: #fef2f2;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #dc2626;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>
