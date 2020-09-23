<template>
	<view class="container">
		<view class="content">
			<view class="logo">
				<view class="logo-title">
					<!-- 闻广咨询 -->
					{{$config.brandall}}
				</view>
				<view class="title-content">
					智能舆情系统
					<!-- <text>智</text>
					<text>能</text>
					<text>舆</text>
					<text>情</text>
					<text>系</text>
					<text>统</text> -->
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<image src="../../static/user.png" mode="widthFix"></image>
				<input type="text" v-model="phoneData" :disabled="isRotate" class="uni-input" name="" placeholder="请输入用户名" placeholder-style="color: #fff;" />
			</view>
			<view class="uni-form-item uni-column">
				<image src="../../static/password.png" mode="widthFix"></image>
				<input type="password" v-model="passData" :disabled="isRotate" class="uni-input" name="" placeholder="请输入登录密码" placeholder-style="color: #fff;" />
			</view>
			<!-- <button 
				type="primary"
				:rotate="isRotate"
				@click.native="startLogin()"
			>
				登录
			</button> -->
			<button :class="['buttonBorder',!isRotate?'dlbutton':'dlbutton_loading']" @click.native="startLogin()">
				<view :class="isRotate?'rotate_loop':''">
					<text v-if="isRotate" class="cuIcon cuIcon-loading1 "></text>
					<text v-if="!isRotate">登录</text>
				</view>
			</button>
			<!-- <view class="margin-top-xl">
				{{phoneData}}
			</view>
			<view class="">
				{{passData}}
			</view> -->
			
		</view>
		<view class="cu-bar tabbar justify-center text-xs flex align-center text-white">
			北京多媒闻广咨询有限公司出品
		</view>
		<!-- <view class="links"><view @tap="gotoForgetPassword">忘记密码？</view><view>|</view><view class="link-highlight" @tap="gotoRegistration">注册账号</view></view> -->
	</view>
</template>

<script>
	import { getLogin, getSystem } from '@/utils/api.js'
	var _this;
	export default {
		data() {
			return {
				systemName: '',
				phoneData:'', //用户/电话
				passData:'', //密码
				isRotate: false, //是否加载旋转
			}
		},
		mounted() {
			_this= this;
			// let systemName = uni.getStorageSync('systemName')
			// console.log(systemName);
			// if(!systemName){
			// 	_this.getSystem('mounted')
			// } else {
			// 	_this.systemName = systemName
			// }
			//this.isLogin();
		},
		methods: {
			startLogin(){
				//登录
				console.log()
				if(_this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (_this.phoneData == "") {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '用户名不能为空'
				    });
				    return;
				}
			    if (_this.passData == "") {
			        uni.showToast({
			            icon: 'none',
						position: 'bottom',
			            title: '密码不正确'
			        });
			        return;
			    }
				_this.isRotate=true
				let loginData = {
					type: 'GetUserInfo',
					User_Name: _this.phoneData,
					PWD: _this.passData
				}
				getLogin(loginData).then(res => {
					console.log('getLogin',res)
					if(res.data.successCode == '1'){
						// _this.isRotate=false
						let userdata = {
							"username":res.data.data[0].User_Name,
							"userid":res.data.data[0].User_ID
						} //保存用户信息和accesstoken
						console.log(res.data.data[0])
						console.log(res.data.data[0].User_ID)
						console.log(userdata)
						getApp().globalData.userData = userdata
						uni.setStorageSync('userData', userdata); //存入缓存
						// _this.$store.dispatch("setUserData",userdata); //存入状态
						// try {
						// 	uni.setStorageSync('setUserData', userdata); //存入缓存
						// } catch (e) {
						// 	// error
						// }
						uni.showToast({
							title: '登录成功',
							icon: 'success',
							success() {
								setTimeout(function(){
									uni.reLaunch({
										url: '../index/index'
									})
								},3000)
							}
						})
					} else {
						_this.showToast(res.data.msg) 
					}
					_this.isRotate = false
				}).catch(err => {
					console.log('getLoginError',err)
					_this.showToast(err.text)
					_this.isRotate = false
					// error
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
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
			showToast(e) {
				uni.showToast({
					title: e,
					icon: 'none',
					mask: true,
					duration: 2000
				})
			}, 
		}
	}
</script>

<style lang="scss" scoped>
	@import url("../../static/css/icon.css");
	$color-primary: #fff;
	
	page,body{
		width: 100%;
		height: 100%;
		background: #cc0000;
		// background-color: red; /* 浏览器不支持时显示 */
		background-image: linear-gradient(#cc0000, #e44264);
	}
	.container{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	.logo{
	    text-align: center;
		color: #FFFFFF;
		padding: 100rpx 0;
	}
	.logo-title{
		text-align: center;
		font-size: 60upx;
		padding-bottom: 40upx;
		
	}
	.title-content{
		text-align: center;
		font-size: 36upx;
		letter-spacing: 20upx
		// padding: 30rpx 0;
	}
	.content{
		padding: 60upx;
		flex: 1;
		width: 100%;
		// height: 100%;
	}
	
	.uni-form-item{
		display: flex;
		align-items: center;
		height: 80upx;
		margin-bottom: 60upx;
		padding: 0 20upx;
		color: #FFFFFF;
		border-bottom: 1px solid #FFFFFF;
		.uni-input{
			flex: 1;
			font-size: 30upx;
			// padding: 7px 0;
			height: 100%;
			line-height: 1;
		}
		image{
			width: 40upx;
			height: 40upx;
			margin-right: 20upx;
		}
	}
	button[type="primary"]{
		background-color: $color-primary;
		border-radius:2.5rem;
		font-size: 34upx;
		margin-top: 120upx;
		color: #ff4444;
	}
	.links{
		text-align: center;
		margin-top: 40upx;
		font-size: 26upx;
		color: #999;
		view{
			display: inline-block;
			vertical-align: top;
			margin: 0 10upx;
		}
		.link-highlight{
			color: $color-primary
		}
	}
	.dlbutton {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ff4444;
		font-size: 34upx;
		margin-top: 120upx;
		width:100%;
		height:100upx;
		background: #fff;
		box-shadow:0upx 0upx 13upx 0upx rgba(255,255,255,0.4);
		border-radius:2.5rem;
	}
	.dlbutton_loading {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ff4444;
		font-size: 34upx;
		width:100upx;
		height:100upx;
		background: #fff;
		box-shadow:0upx 0upx 13upx 0upx rgba(255,255,255,0.4);
		border-radius:2.5rem;
		margin-top: 120upx;
	}
	.buttonBorder{
	    border: none ;
	    border-radius: 2.5rem ;
	    -webkit-box-shadow: 0 0 60upx 0 rgba(0,0,0,.2) ;
	    box-shadow: 0 0 60upx 0 rgba(0,0,0,.2) ;
	    -webkit-transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	    -moz-transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	    -ms-transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	    -o-transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	    transition: all 0.4s cubic-bezier(.57,.19,.51,.95);
	}
	
	/* 旋转动画 */
	.rotate_loop{
		-webkit-transition-property: -webkit-transform;
	    -webkit-transition-duration: 1s;
	    -moz-transition-property: -moz-transform;
	    -moz-transition-duration: 1s;
	    -webkit-animation: rotate 1s linear infinite;
	    -moz-animation: rotate 1s linear infinite;
	    -o-animation: rotate 1s linear infinite;
	    animation: rotate 1s linear infinite;
	}
	@-webkit-keyframes rotate{from{-webkit-transform: rotate(0deg)}
	    to{-webkit-transform: rotate(360deg)}
	}
	@-moz-keyframes rotate{from{-moz-transform: rotate(0deg)}
	    to{-moz-transform: rotate(359deg)}
	}
	@-o-keyframes rotate{from{-o-transform: rotate(0deg)}
	    to{-o-transform: rotate(359deg)}
	}
	@keyframes rotate{from{transform: rotate(0deg)}
	    to{transform: rotate(359deg)}
	}
	.cu-bar.tabbar{
		box-shadow: none;
	}
</style>
