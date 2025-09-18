import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Importar Font Awesome
const loadFontAwesome = (): void => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
  document.head.appendChild(link)
}
loadFontAwesome()

const app = createApp(App)

// Asegúrate de usar el router y pinia en este orden
app.use(router)  // <-- PRIMERO el router
app.use(createPinia())

app.mount('#app')