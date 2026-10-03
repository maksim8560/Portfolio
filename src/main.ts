import { createApp } from 'vue'
import App from './App.vue'
import { vCount, vReveal } from './directives'
import './styles.css'

createApp(App).directive('reveal', vReveal).directive('count', vCount).mount('#app')
