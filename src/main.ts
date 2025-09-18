// src/main.ts
import './interceptors/axios'; // ← MANTÉN ESTA LÍNEA si es que tienes este archivo
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

const loadFontAwesome = (): void => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(link);
};
loadFontAwesome();

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount('#app');