import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';

require('bootstrap/dist/css/bootstrap.css')

Vue.use(BootstrapVue)
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')