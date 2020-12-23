<template>
	<view class="">
		<cu-custom><block slot="content">智能舆情系统</block></cu-custom>
		
		<scroll-view scroll-x class="nav fixed bg-default" :style="[{top:CustomBar + 'px'}]" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item bg-white" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.id">
				{{item.name}}
			</view>
		</scroll-view>
		<view class="container" :style="[{top:CustomBar + 32 + 'px'}]">
			<abs-tract v-if="nameCur == 'abstract'"></abs-tract>
			<sound-volume v-if="nameCur == 'soundvolume'"></sound-volume>
			<tr-end v-if="nameCur == 'trend'"></tr-end>
			<plus-info v-if="nameCur == 'plusinfo'" :loadDataEventCount="loadDataEventCount"></plus-info>
			<minus-info v-if="nameCur == 'minusinfo'" :loadDataEventCount="loadDataEventCount"></minus-info>
			<plus-cloud v-if="nameCur == 'pluscloud'"></plus-cloud>
			<minus-cloud v-if="nameCur == 'minuscloud'"></minus-cloud>
			<plus-topic v-if="nameCur == 'plustopic'"></plus-topic>
			<minus-topic v-if="nameCur == 'minustopic'"></minus-topic>
			<spe-cial v-if="nameCur == 'special'" :loadDataEventCount="loadDataEventCount"></spe-cial>
			<coope-ration v-if="nameCur == 'cooperation'"></coope-ration>
			<nocoope-ration v-if="nameCur == 'nocooperation'"></nocoope-ration>
			<plat-form v-if="nameCur == 'platform'"></plat-form>
			<enter-prise v-if="nameCur == 'enterprise'"></enter-prise>
			<heal-thy v-if="nameCur == 'healthy'"></heal-thy>
		</view>
		<view class="cu-bar tabbar bg-white shadow foot justify-center text-xs flex align-center">
			<!-- <text class="cuIcon-newsfill"></text> -->
			北京多媒闻广咨询有限公司出品
		</view>
	</view>
</template>

<script>
	var that
	import watermark from '@/common/watermark.js'
	import { getLogin } from '@/utils/api.js'
	import Abstract from '../tabs/Abstract.vue'
	import Soundvolume from '../tabs/Soundvolume.vue'
	import Trend from '../tabs/Trend.vue'
	import Plusinfo from '../tabs/Plusinfo.vue'
	import Minusinfo from '../tabs/Minusinfo.vue'
	import Pluscloud from '../tabs/Pluscloud.vue'
	import Minuscloud from '../tabs/Minuscloud.vue'
	import Plustopic from '../tabs/Plustopic.vue'
	import Minustopic from '../tabs/Minustopic.vue'
	import Special from '../tabs/Special.vue'
	import Cooperation from '../tabs/Cooperation.vue'
	import Nocooperation from '../tabs/Nocooperation.vue'
	import Platform from '../tabs/Platform.vue'
	import Enterprise from '../tabs/Enterprise.vue'
	import Healthy from '../tabs/Healthy.vue'
	export default {
		mixins: [watermark],
		components: {
		    'abs-tract': Abstract,
			'sound-volume': Soundvolume,
			'tr-end': Trend,
			'plus-info': Plusinfo,
			'minus-info': Minusinfo,
			'plus-cloud': Pluscloud,
			'minus-cloud': Minuscloud,
			'plus-topic': Plustopic,
			'minus-topic': Minustopic,
			'spe-cial': Special,
			'coope-ration': Cooperation,
			'nocoope-ration': Nocooperation,
			'plat-form': Platform,
			'enter-prise': Enterprise,
			'heal-thy': Healthy
		},
		data() {
			return {
				tabList: [
					{
						id: "abstract",
						name: '概要',
						// newsid: 0
					}, {
						id: "soundvolume",
						name: '声量',
						// newsid: 23
					}, {
						id: "trend",
						name: '走势',
						// newsid: 223
					}, 
					{
						id: 'healthy',
						name: '健康度',
					},
					{
						id: "plusinfo",
						name: '正资讯',
						// newsid: 221
					}, {
						id: "minusinfo",
						name: '负资讯',
						// newsid: 225
					}, {
						id: "pluscloud",
						name: '正词云',
						// newsid: 208
					}, {
						id: "minuscloud",
						name: '负词云',
						// newsid: 208
					}, 
					// {
					// 	id: "plustopic",
					// 	name: '正话题',
					// 	// newsid: 208
					// }, {
					// 	id: "minustopic",
					// 	name: '负话题',
					// 	// newsid: 208
					// }, 
					{
						id: "special",
						name: '专项',
						// newsid: 208
					}, {
						id: "cooperation",
						name: '合作',
						// newsid: 208
					}, {
						id: "nocooperation",
						name: '非合作',
						// newsid: 208
					}, {
						id: "platform",
						name: '渠道',
						// newsid: 208
					}, 
					// {
					// 	id: "enterprise",
					// 	name: '企业'
					// },
				],
				CustomBar: this.CustomBar,
				tabFirst: true,
				TabCur: 0,
				nameCur: 'abstract',
				scrollLeft: 0,
				scrollLeftData: [],
				loadDataEventCount: 0,
				showCanvas: true,
				canvasText: '',
				canvasText2: ''
			}
		},
		onLoad() {
			that = this
			// console.log()
			console.log(uni.upx2px(26))
			let  value = uni.getStorageSync('userData');
			if (value) {
			    console.log(value);
				let time = that.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd hh:MM:ss')
				let year = that.$u.timeFormat(new Date().getTime(), 'yyyy')
				let starTime,endTime
				starTime = year - 1 + ''
				endTime = year
				console.log(starTime);
				console.log(endTime);
				that.$u.vuex('starTime', starTime);
				that.$u.vuex('endTime', endTime);
				that.canvasText = value.username
				that.canvasText2 = time
				console.log(that.canvasText);
				console.log(that.canvasText2);
			}
			that.initWatermark(); // 可以在水印内容准备好后执行初始化
			
		},
		// onShow() {
			
		// 	console.log(this.noMore)
		// },
		onReachBottom(){
			// console.log(new Date().getTime());
			that.loadDataEventCount = new Date().getTime()
		},
		methods: {
			// toDemo(){
			// 	uni.navigateTo({
			// 		url: '../demo/demo'
			// 	})
			// },
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				// console.log(this.scrollLeftData)
				this.TabCur = e.currentTarget.dataset.id;
				this.nameCur = e.currentTarget.dataset.target
				// this.scrollLeft = this.scrollLeftData[e.currentTarget.dataset.id - 1].left
			},
			getCar(){
				uni.showLoading()
				let data = {
					type: 'GetCheXing'
				}
				getLogin(data).then(res => {
					console.log('getCar',res)
					uni.hideLoading()
					// _this.isRotate = false
					if(res.data.successCode == '1'){
						let list = res.data.data
						let gbCar = []
						list.map((item,index) => {
							if(item.Product != '广汽本田'){
								gbCar.push(item.Product)
							}
						})
						console.log(gbCar)
						getApp().globalData.gbCar = gbCar
					} else {
						_this.showToast(res.data.msg) 
						
					}
				}).catch(err => {
					uni.hideLoading()
					console.log('getLoginError',err)
					_this.showToast(err.msg)
					// error
					// err 有可能是 Error 对象，也有可能是 您自己定义的内容，处理的时候您需要自己判断
					// 一个通用的错误提示组件就可以完成
				})
			},
			getJp(){
				uni.showLoading()
				let data = {
					type: 'GetJingPin',
					productcode: '01'
				}
				getLogin(data).then(res => {
					uni.hideLoading()
					console.log('getJp',res)
					// _this.isRotate = false
					// if(res.data.successCode == '1'){
					// 	uni.showToast({
					// 		title: '登录成功',
					// 		icon: 'success',
					// 		success() {
					// 			setTimeout(function(){
					// 				uni.reLaunch({
					// 					url: '/pages/index/index'
					// 				})
					// 			},3000)
					// 		}
					// 	})
					// } else {
					// 	_this.showToast(res.data.msg) 
					// }
				}).catch(err => {
					uni.hideLoading()
					console.log('getJpError',err)
					// _this.showToast(err.msg)
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
	$color-primary: #cc0000;
	.watermarkCans {
		width: 500rpx;
		height: 500rpx;
		position: absolute;
		z-index: -1;
	}
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	.bg-default{
		background: #f1f1f1;
	}
	.nav{
		width: 100vw;
	}
	.nav .cu-item{
		margin: 0;
		position: relative;
		height: 32px;
		line-height: 32px;
	}
	.nav .cu-item.cur{
		// font-size: 36upx;
		color: $color-primary;
		border: 0;
	}
	.nav .cu-item.cur::after{
		content: "";
		display: block;
		position: absolute;
		height: 4upx;
		width: calc(100% - 40upx);
		left: 20upx;
		// width: 100%;
		// left: 0;
		bottom: 0;
		background: $color-primary;
		z-index: 0;
		border-radius: 10upx;
	}
	.container{
		width: 100vw;
		position: absolute;
		margin-bottom: 60upx;
	}
	.cu-bar{
		min-height: auto;
		height: 60upx!important;
	}
	
	.tabs {
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		background-color: #cc0000;
		/* #ifdef MP-ALIPAY || MP-BAIDU */
		height: 100vh;
		/* #endif */
	}

	.tab-bar {
		width: 750upx;
		height: 84upx;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.tab-bar ::-webkit-scrollbar {
	    display: none;  
	    width: 0 !important;  
	    height: 0 !important;  
	    -webkit-appearance: none;  
	    background: transparent;  
	}
	/* #endif */

	.scroll-view-indicator {
		position: relative;
		height: 2px;
		background-color: transparent;
	}

	.scroll-view-underline {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 0;
		background-color: #007AFF;
	}

	.scroll-view-animation {
		transition-duration: 0.2s;
		transition-property: left;
	}

	.tab-bar-line {
		height: 1upx;
		background-color: #cccccc;
	}

	.tab-box {
		flex: 1;
	}

	.uni-tab-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		padding-left: 20px;
		padding-right: 20px;
	}

	.uni-tab-item-title {
		color: #555;
		font-size: 30upx;
		height: 80upx;
		line-height: 80upx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title-active {
		/* color: #007AFF; */
		font-size: 36upx;
	}

	.swiper-item {
		flex: 1;
		flex-direction: column;
	}

	.page-item {
		flex: 1;
		flex-direction: row;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}
</style>