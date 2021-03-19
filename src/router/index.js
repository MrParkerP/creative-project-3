import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ToDo from '../views/To-Do.vue'
import Previous from '../views/Previous.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/to-do-list',
    name: 'ToDo',
    component: ToDo
  },
  {
    path: '/previous-surprises',
    name: 'Previous',
    component: Previous
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
