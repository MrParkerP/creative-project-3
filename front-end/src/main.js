import Vue from 'vue'
import App from './App.vue'
import router from './router'

import mock from './mock-data.js'

let data = {
  possible: mock,
  user: '',
  generating: false,
  showLogout: true,
}

new Vue({
  router,
  data,
  created() {
    if (this.$route.path !== '/'){
      this.$router.push('/');
    }

  },
  render: h => h(App)
}).$mount('#app')
