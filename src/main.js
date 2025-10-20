import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './styles/main.scss'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons/coreui'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(CoreuiVue)
app.use(Toast)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.mount('#app')
