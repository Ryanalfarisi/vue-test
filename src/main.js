import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)
Vue.config.productionTip = false
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-select/dist/vue-select.css';
import "../src/assets/global.css";

// Vue moment
Vue.use(require("vue-moment"));

import http from "./plugins/axios.js";
Vue.use(http);
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
