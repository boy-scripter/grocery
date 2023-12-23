import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Home from '../views/Home.vue'
import Store from '../views/Store.vue'
import Product from "../views/Product.vue"
import Category from "../views/Category.vue"
import Checkout from "../views/Checkout.vue"
import Profile from "../views/Profile.vue"
import History from "../views/History.vue"

import AdminIndex from '../views/admin/Index.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import ProductManagement from "../views/admin/ProductManagement.vue"
import Sales from "../views/admin/Sales.vue"

import SellerDashboard from "../views/seller/Dashboard.vue"
import SellerIndex from "../views/seller/Index.vue"

import { Authentication } from "../guard.js"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: Home,
      component: Home,
      beforeEnter: (to, from, next) => Authentication(next),
      children: [
        {
          path: '/product/:id',
          name: 'Product',
          component: Product
        },
        {
          path: '/category/:id',
          name: 'Category',
          component: Category
        },
        {
          path: '/checkout',
          name: 'Checkout',
          component: Checkout
        },
        {
          path: 'store',
          name: Store,
          component: Store,
        },
        {
          path: '/profile',
          name: 'Profile',
          component: Profile
        },
        {
          path: '/history',
          name: 'History',
          component: History
        },
        {
          path: '',
          redirect: { name: Store },
        }
      ]
    },

    {
      path: '/login',
      name: 'Login',
      beforeEnter: (to, from, next) => localStorage.getItem('token') ? next('/home') : next(),
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/admin',
      name: 'Admin',
      beforeEnter: (to, from, next) => Authentication(next),
      component: AdminIndex,
      children: [
        {
          path: 'dashboard',
          component: AdminDashboard
        },
        {
          path: 'sales',
          component: Sales
        },
        {
          path: 'product_management',
          component: ProductManagement
        },
        {
          path: '',
          component: AdminDashboard
        }
      ]
    },
    {
      path: '/seller',
      beforeEnter: (to, from, next) => Authentication(next),
      component: SellerIndex,
      children: [

        {
          path: 'dashboard',
          component: SellerDashboard
        },  
        {
          path: '',
          component: SellerDashboard
        },
      ]

    },
    {
      path: '/',
      redirect: '/login'
    },

  ]
})

export default router
