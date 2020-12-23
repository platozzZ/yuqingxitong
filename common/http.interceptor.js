// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token
// 同时，我们也可以在此使用getApp().globalData，如果你把token放在getApp().globalData的话，也是可以使用的
import baseUrl from '@/static/config.js'
console.log(baseUrl);
const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: baseUrl,
		showLoading: true, // 是否显示请求中的loading
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		// 如果将此值设置为true，拦截回调中将会返回服务端返回的所有数据response，而不是response.data
		// 设置为true后，就需要在this.$u.http.interceptor.response进行多一次的判断，请打印查看具体值
		// originalData: true, 
		// 设置自定义头部content-type
		header: {
			// 'content-type': 'application/json;charset=UTF-8',
			"Content-Type": "application/x-www-form-urlencoded",
			
		},
	});
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		// config.header.Token = 'xxxxxx';
		
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式，见：https://uviewui.com/components/globalVariable.html
		config.header.token = vm.token;
		config.header.openid = vm.openid;
		config.header.longitude = vm.longitude;
		config.header.latitude = vm.latitude;
		
		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;
		
		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;
		
		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的，所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
		
		// // 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
		// if(config.url == '/user/login') config.header.noToken = true;
		// // 最后需要将config进行return
		// return config;
		// // 如果return一个false值，则会取消本次请求
		// // if(config.url == '/user/rest') return false; // 取消某次请求
		return config; 
	}
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		console.log('interceptor',res);
		// console.log(Vue);
		// console.log(Vue.prototype);
		// console.log(Vue.prototype.$u);
		// console.log(Vue.prototype.$u.toast);
		// 如果把originalData设置为了true，这里得到将会是服务器返回的所有的原始数据
		// 判断可能变成了res.statueCode，或者res.data.code之类的，请打印查看结果
		if(res.successCode == '1') {
			// 如果把originalData设置为了true，这里return回什么，this.$u.post的then回调中就会得到什么
			return res.data;  
		} else if(res.successCode == 201){
			// 假设201为token失效，这里跳转登录
			vm.$u.toast(res.message);
			setTimeout(() => {
				// 此为uView的方法，详见路由相关文档
				vm.$u.route('/pages/login/login')
			}, 1500)
			return false;
		} else {
			vm.$u.toast(res.msg);
			return false
		}
		// return false;
	}
}

export default {
	install
}