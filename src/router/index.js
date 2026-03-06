import { createRouter, createWebHistory } from 'vue-router'
import ClientView from '../views/ClientView.vue'
import AdminView from '../views/AdminView.vue'
import SignIn from '@/components/SignIn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'client',
      component: ClientView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/sign-in', 
      name: 'sign-in', 
      component: SignIn
    }, 
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router
