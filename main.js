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
import store from '@/store';
let vuexStore = require('@/store/$u.mixin.js')
Vue.mixin(vuexStore)

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

app.$mount()
