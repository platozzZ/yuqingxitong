<template>
	<view class="">
		<cu-custom :isBack="true" :noMore="true"><block slot="content">智能舆情系统</block></cu-custom>
		<view class="">
			<view class="padding padding-bottom-sm">
				{{'用户名:' + userName}}
			</view>
			<!-- <view class="cu-form-group">
				<input type="password" v-model="passWord" class="uni-input" name="" placeholder="请输入旧密码" />
			</view> -->
			<view class="cu-form-group">
				<input type="" v-model="newPassWord" class="uni-input" name="" placeholder="请输入新密码" />
			</view>
			<view class="padding">
				<button class="cu-btn bg-red block lg" @click="formSubmit">确认</button>
			</view>
		</view>
	</view>
</template>

<script>	
	var that
	import { updatePassword } from '@/utils/api.js'
	import md5 from '../../utils/md5.js'
	export default {
		data () {
			return {
				userName: '',
				passWord: '',
				newPassWord: ''
			}
		},
		onLoad() {
			that = this
			let  value = uni.getStorageSync('userData');
			if (value) {
			    console.log(value);
				that.userName = value.username
			}
			
		},
		methods: {
			formSubmit(e){
				uni.showLoading({
					
				})
				let newPwd = that.newPassWord; //123
				let Md5newPwd = md5(newPwd); //202cb962ac59075b964b07152d234b70
				console.log(Md5newPwd)
				let data = {
					User_Name: that.userName,
					// PWD: that.passWord,
					PWD_new: Md5newPwd
				}
				console.log(data)
				updatePassword(data).then(res => {
					uni.hideLoading()
					console.log('updatePassword',res)
					if(res.data.successCode == '1'){
						console.log(res.data)
						uni.showToast({
							title: '修改成功',
							icon: 'success',
							duration: 3000,
							success() {
								setTimeout(function(){ 
									// uni.redirectTo({
									// 	url: '../login/login'
									// })
									uni.reLaunch({
										url: '../login/login'
									})
								}, 3000)
							}
						})
					} else {
						
					}
				}).catch(err => {
					uni.hideLoading()
						
					console.log(err)
					that.showToast(err.msg) 
				})
			}
		}
	}

</script>

<style>
	
</style>
