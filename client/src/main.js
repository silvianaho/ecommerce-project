import Vue from 'vue';
import App from './App.vue';
import router from './router'

require('bootstrap/dist/css/bootstrap.css')

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')