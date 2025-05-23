<template>
  <div class="report-container">
    <h2>Raportowanie</h2>
    <button @click="generateReport">Generuj przykładowy raport</button>
    <div v-if="report">
      <h3>Podsumowanie:</h3>
      <ul>
        <li v-for="(amount, category) in report.byCategory" :key="category">
          {{ category }}: {{ amount }} zł
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Report',
  data() {
    return {
      report: null
    }
  },
  methods: {
    generateReport() {
      this.report = {
        byCategory: {
          "Groceries": 400,
          "Transport": 120,
          "Entertainment": 200
        }
      }
    }
  }
}
</script>
<style scoped>
.report-container { max-width: 400px; margin: 40px auto; padding: 24px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; }
button { padding: 8px 16px; border-radius: 6px; border: none; background: #4CAF50; color: #fff; font-size: 16px; cursor: pointer; margin-bottom: 16px; }
button:hover { background: #388e3c; }
</style> 