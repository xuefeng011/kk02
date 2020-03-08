import Vue from 'vue'
import App from './App'
import store from './store'

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)



Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$store = store;

const app = new Vue({
    ...App
})
app.$mount()
