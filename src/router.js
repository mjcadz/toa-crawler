import Vue from 'vue'
import Router from 'vue-router'
import ToA from '@/views/ToA'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Landing', component: ToA }
  ]
})
