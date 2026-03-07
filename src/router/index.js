import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'

import ClientView from '../views/ClientView.vue'
import AdminView from '../views/AdminView.vue'
import SignIn from '@/components/SignIn.vue'
import { auth } from '@/firebase'
import { ROLE, } from '@/constants'

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
      component: AdminView,
      meta: { requiresAuth: true }
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


const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth, 
      (user) => {
        removeListener();
        resolve(user);
      },
      // reject
    );
  });
};
router.beforeEach(async (to, from) => {
  const isProjector = to.path === '/' && to.query.role === ROLE.PROJECTOR;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth) || isProjector;

  if (requiresAuth) {
    const currentUser = await getCurrentUser();
    
    if (currentUser) {
      return true;
    } else {
      return { 
        name: 'sign-in', 
        query: { redirect: to.fullPath } 
      };
    }
  } else {
    return true;
  }
});


export default router
