import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameSettingsView from '../views/GameSetting.vue'
import PostmanToSwaggerView from '../views/PostmanToSwagger.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: {
        name: 'GameSetting'
      },
      name: 'home',
      component: HomeView,
      props: (route) => ({
        route: route.path,
      })
    },
    {
      path: '/game-settings',
      name: 'GameSetting',
      component: GameSettingsView,
      props: (route) => ({
        route: route.path,
      })
    },
    {
      path: '/postman-to-swagger',
      name: 'PostmanToSwagger',
      component: PostmanToSwaggerView,
      props: (route) => ({
        route: route.path,
      })
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      props: (route) => ({
        route: route.path,
      })
    }
  ]
})

export default router
