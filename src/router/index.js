import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MainPage from '../views/MainPage.vue'
import ManagerPage from '../views/ManagerPage.vue'
import MessagePage from '../views/MessagePage.vue'
import RecordPage from '../views/RecordPage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register
  },
  {
    path: '/MainPage',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/ManagerPage',
    name: 'ManagerPage',
    component: ManagerPage
  },
  {
    path: '/MessagePage',
    name: 'MessagePage',
    component: MessagePage
  },
  {
    path: '/RecordPage',
    name: 'RecordPage',
    component: RecordPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
