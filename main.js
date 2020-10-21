import Vue from 'vue'
import App from './App'

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)


// import defaultConfig from './static/car.js'
// Vue.prototype.$config = defaultConfig
// const cars = require('static/car.json')
// Vue.prototype.$config = cars


Vue.config.productionTip = false
import uView from "uview-ui";
Vue.use(uView);
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
