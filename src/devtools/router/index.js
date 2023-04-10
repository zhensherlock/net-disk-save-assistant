import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home'

const routes = [
  {
    path: '/',
    name: 'DevToolsHome',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
