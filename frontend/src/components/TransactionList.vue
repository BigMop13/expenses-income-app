<template>
  <div class="transaction-list">
    <div class="header">
      <h2 class="title">Transactions</h2>
      <button class="add-button" @click="showModal = true">
        Add Transaction
      </button>
    </div>
    
    <!-- Transaction List -->
    <div class="transactions">
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
    <div v-if="!transactions.length" class="empty-state">
      <p>No transactions found</p>
    </div>

    <!-- Add Transaction Modal -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal" @click.stop>
        <h3>Add New Transaction</h3>
        <form @submit.prevent="addTransaction" class="transaction-form">
          <div class="form-group">
            <label for="category">Category</label>
            <input 
              id="category"
              v-model="newTransaction.category"
              type="text"
              required
              placeholder="e.g., Groceries"
            >
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <input 
              id="description"
              v-model="newTransaction.description"
              type="text"
              required
              placeholder="e.g., Weekly groceries"
            >
          </div>

          <div class="form-group">
            <label for="amount">Amount</label>
            <input 
              id="amount"
              v-model="newTransaction.amount"
              type="number"
              step="0.01"
              required
              placeholder="Enter amount (negative for expense)"
            >
          </div>

          <div class="form-group">
            <label for="date">Date</label>
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
              Cancel
            </button>
            <button type="submit" class="submit-button">
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Sample data - replace with actual data from your backend
const transactions = ref([
  {
    id: '1',
    category: 'Groceries',
    date: new Date('2024-03-20'),
    amount: -50.25,
    description: 'Weekly groceries'
  },
  {
    id: '2',
    category: 'Salary',
    date: new Date('2024-03-19'),
    amount: 3000,
    description: 'Monthly salary'
  },
  {
    id: '3',
    category: 'Entertainment',
    date: new Date('2024-03-18'),
    amount: -25.99,
    description: 'Movie tickets'
  }
]);

const showModal = ref(false);

const newTransaction = ref({
  category: '',
  description: '',
  amount: '',
  date: new Date().toISOString().split('T')[0]
});

const addTransaction = () => {
  const transaction = {
    id: Date.now().toString(), // Simple ID generation
    category: newTransaction.value.category,
    description: newTransaction.value.description,
    amount: parseFloat(newTransaction.value.amount),
    date: new Date(newTransaction.value.date)
  };

  transactions.value.unshift(transaction);
  
  // Reset form
  newTransaction.value = {
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  };
  
  showModal.value = false;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
</script>

<style scoped>
.transaction-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  transition: transform 0.2s ease;
}

.transaction-item:hover {
  transform: translateY(-2px);
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
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
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
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
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
</style>
