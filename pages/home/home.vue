<template>
	<view class="">
		
	</view>
</template>

<script>
	var that;
	import { getSystem } from '@/utils/api.js'
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			that= this;
			uni.showLoading()
			let userData = uni.getStorageSync('userData')
			console.log(userData);
			if(!userData){
				uni.reLaunch({
					url: '../login/login'
				})
			} else {
				uni.reLaunch({
					url: '../index/index'
				})
			}
		},
		methods: {
			getSystem(e){
				console.log(e);
				getSystem().then(res => {
					console.log('getSystem',res)
					if(res.data.successCode == '1'){
						_this.systemName = res.data.data[0].SystemName
						uni.setStorageSync('systemName',res.data.data[0].SystemName)
					}
				}).catch(err => {
					console.log('getSystem',err)
					_this.showToast(err.text)
					// error
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
				
			},
		}
	}
</script>

<style>
</style>
