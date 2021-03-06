import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueRx from 'vue-rx'
import router from './router'

Vue.use(VueRx)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
