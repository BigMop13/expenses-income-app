<template>
  <div class="budget-container">
    <h2>Budżetowanie</h2>
    <form @submit.prevent="saveBudget">
      <input v-model.number="amount" type="number" placeholder="Kwota budżetu" required />
      <input v-model="category" type="text" placeholder="Kategoria (opcjonalnie)" />
      <button type="submit">Ustaw budżet</button>
    </form>
    <div v-if="budgets.length">
      <h3>Twoje budżety:</h3>
      <ul>
        <li v-for="(b, idx) in budgets" :key="b._id || idx">
          {{ b.amount }} zł na kategorię: {{ b.category || 'ogólny' }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import budgetService from '../services/budgetService';

export default {
  name: 'Budget',
  data() {
    return {
      amount: '',
      category: '',
      budgets: []
    }
  },
  async mounted() {
    await this.fetchBudgets();
  },
  methods: {
    async fetchBudgets() {
      this.budgets = await budgetService.getBudgets();
    },
    async saveBudget() {
      await budgetService.addBudget({ amount: this.amount, category: this.category });
      this.amount = '';
      this.category = '';
      await this.fetchBudgets();
    }
  }
}
</script>
<style scoped>
.budget-container { max-width: 400px; margin: 40px auto; padding: 24px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; }
form { display: flex; flex-direction: column; gap: 12px; }
button { padding: 8px 16px; border-radius: 6px; border: none; background: #4CAF50; color: #fff; font-size: 16px; cursor: pointer; }
button:hover { background: #388e3c; }
ul { margin-top: 24px; }
</style> 