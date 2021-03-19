import Vue from 'vue'
import App from './App.vue'
import router from './router'

import mock from './mock-data.js'

let data = {
  possible: mock,
  current: [],
  previous:[],
  generating: false,
}

new Vue({
  router,
  data,
  render: h => h(App)
}).$mount('#app')
