import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';
// import Hello from '@/components/Hello';
import goods from '@/components/goods/goods';
import seller from '@/components/seller/seller';
import ratings from '@/components/ratings/ratings';
import '@/common/stylus/index.styl';

Vue.use(Router);
Vue.use(VueResource);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      // name: 'goods',
      component: goods
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    },
    {
      path: '/ratings',
      name: ratings,
      component: ratings
    }
  ]
});
