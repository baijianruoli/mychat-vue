import Vue from 'vue'
import Router from 'vue-router'
import user from "../view/user";
import index from "../view/index";
Vue.use(Router)

export default new Router({
  routes: [
    {
      name:'index',
      path: '/',
      component:index

    },{
      name:'user',
      path: '/user',
      component:user
    }
      ],
  mode:'history'
})
