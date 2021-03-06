import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/games'
  },
  {
    path: "/games",
      component: () => import("@/views/Leaderboards.vue"),
      children: [
        {
          path: "",
          name: "games",
          component: () => import("@/views/Games.vue")
        },
        {
          path: ":game/:category?",
          name: "game",
          component: () => import("@/views/Game.vue")
        }
      ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
