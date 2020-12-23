<template>
	<view class="">
		<!-- <canvas v-if="showCanvas" class="watermarkCans" canvas-id="watermarkCanvas"></canvas> -->
		<view class="cu-card article margin-top-sm">
			<view class="cu-item shadow padding-tb-sm padding-lr" v-for="(item,index) in absData" :key="index">
				<view class="abs-title text-xxl text-red text-center">{{item.Breed}}</view>
				<view class="abs-content text-sm flex align-center justify-center margin-tb-sm">
					<view class="text-xxl text-red padding-tb-xs padding-lr-sm bg-default margin-lr-xs">{{item.InfoTotal}}</view>条
				</view>
				<view class="abs-bot flex align-center justify-center ">
					负<view class="text-xl text-blue padding-tb-xs padding-lr-sm bg-default margin-lr-xs">{{item.InfoBad}}</view>条,
					负面率<view class="text-xl text-blue padding-tb-xs padding-lr-sm bg-default margin-lr-xs">
						{{item.BadRate + '%'}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var that 
	import { getAbs } from '@/utils/api.js'
	export default {
		data() {
			return {
				absData: [],
			}
		},
		mounted() {
			that = this;
			that.getAbs()
		},
		methods: {
			getAbs(e){
				getAbs().then(res => {
					console.log('getAbs',res)
					if(res.data.successCode == '1'){
						that.absData = res.data.data
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					console.log(err)
					that.showToast(res.data.msg) 
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

<style>
	.cu-card>.cu-item{
		margin: 0 30upx 20upx;
	}
	
	.bg-default{
		background: #f1f1f1;
	}
</style>
