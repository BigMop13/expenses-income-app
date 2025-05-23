import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // Show a confirmation dialog to the user
    if (confirm('Nowa wersja aplikacji jest dostępna. Czy chcesz ją zainstalować?')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('Aplikacja jest gotowa do pracy offline')
  }
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')
