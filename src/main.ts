import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import components for routing
import Home from './views/Home.vue'
import About from './views/About.vue'
import Socials from './views/Socials.vue'
import Rules from './views/Rules.vue'
import Servers from './views/Servers.vue'
import Status from './views/Status.vue'
import NotFound from './views/NotFound.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/socials', name: 'Socials', component: Socials },
  { path: '/rules', name: 'Rules', component: Rules },
  { path: '/servers', name: 'Servers', component: Servers },
  { path: '/status', name: 'Status', component: Status },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')