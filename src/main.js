import { createApp } from 'vue'
import App from './App.vue'
// Tailwind CSS
import './assets/tailwind.css'
import router from './router'

createApp(App).use(router).mount('#app')
