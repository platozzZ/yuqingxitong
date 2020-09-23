<script>
	var that
	import Vue from 'vue'
	import axios from "axios"
	import { getSystem } from '@/utils/api.js'
	export default {
		onLaunch: function() {
			that = this
			console.log(that);
			that.getSystem()
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
			
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		
			
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
			
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			userData: ''
		},
		methods:{
			getSystem(e){
				getSystem().then(res => {
					console.log('getSystem',res.data)
					if(res.data.successCode == '1'){
						let configData = {
							brandall: res.data.data.SystemName,
							brand: res.data.data.abbr,
							cars: res.data.data.product
						}
						console.log(configData);
						// _this.systemName = res.data.data[0].SystemName
						Vue.prototype.$config = configData
						// Vue.prototype.$systemName = res.data.data[0].SystemName
						// Vue.prototype.$systemAbbr = res.data.data[0].abbr
						// uni.setStorageSync('systemName',res.data.data[0].SystemName)
					}
				}).catch(err => {
					// console.log('getSystem',err)
					// _this.showToast(err.text)
					// error
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
				
			},
			// 获取配置文件
			// getBaseUrl() {
			// 	axios.get('./static/config.json', { headers: { "Cache-Control": "no-cache" } }).then((res) => {
			// 		console.log('getBaseUrl:',res);
			// 		Vue.prototype.$BASE_URL = res.data.BASE_URL;
			// 		// console.log(this);
			// 		// console.log(this.$BASE_URL);
			//     })
			// },
			// getCars() {
			// 	axios.get('./static/car.json', { headers: { "Cache-Control": "no-cache" } }).then((res) => {
			// 		console.log('getCars:',res);
			// 		Vue.prototype.$config = res.data
			// 		// console.log(this);
			// 		// console.log(this.$BASE_URL);
			//     })
			// }
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* @import "static/css/uni.css"; */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import url("/components/gaoyia-parse/parse.css");
	@import "static/css/common.css";
</style>
