/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import ListingsComponent from './components/Listings.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

require('bootstrap/dist/css/bootstrap.css')

library.add(faHeart, faHeartSolid)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('listings-component', ListingsComponent);
Vue.use(BootstrapVue)
Vue.config.productionTip = false;

/*
  VUE RENDERING

  Real
  render: function (createElement) {
    return createElement(App);
  }
  short
  render: function (h) {
    return h(App);
  }
  more short
  render: h => h (App)
  
*/

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')