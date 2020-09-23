<template>
	<view class="">
		<view class="padding-top-sm">
			<view class="cu-card">
				<view class="cu-item shadow" v-for="(item,index) in wordData" :key="index">
					<view class="padding-top-sm text-center text-xl text-red bg-white">
						{{item.type == 'all'?'广本各车型正面词云图':item.type + '正面词云图'}}
					</view>
					<view class="qiun-charts">
						<!-- <canvas :canvas-id="'canvasWord' + index" :id="'canvasWord' + index" class="charts"></canvas> -->
						
							<word-cloud-chart
								:id="'canvasWord' + index"
								:data="option[index]"
								:width="'100%'"
								:height="'400upx'"
							>
							</word-cloud-chart>
					</view>
				</view>
				<!-- <view class="cu-item shadow">
					<view class="padding-top-sm text-center text-xl text-red bg-white">
						雅阁及竞品正面词云图
					</view>
					<view class="qiun-charts">
						<canvas canvas-id="canvasWord1" id="canvasWord1" class="charts"></canvas>
						
					</view>
				</view>
				<view class="cu-item shadow">
					<view class="padding-top-sm text-center text-xl text-red bg-white">
						凌派及竞品正面词云图
					</view>
					<view class="qiun-charts">
						<canvas canvas-id="canvasWord2" id="canvasWord2" class="charts"></canvas>
						
					</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import { getWordCloud } from '@/utils/api.js'
	var that;
	export default {
		data() {
			return {
				tabList: [
					{
						id: "week",
						name: '本周'
					}, {
						id: "month",
						name: '本月'
					}, {
						id: "season",
						name: '本季'
					}
				],
				TabCur: 0,
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				textarea:'',
				wordData: [],
				option: [],
			}
		},
		mounted() {
			that = this;
			let data = {
				ProjectName: 'WordCloudGood',
				Period: 'week'
			}
			that.getWordCloud(data)
			that.cWidth=uni.upx2px(750 - 60) + '';
			that.cHeight=uni.upx2px(400) + '';
			console.log(that.cWidth);
			console.log(typeof(that.cWidth));
			console.log(that.cHeight);
			console.log(typeof(that.cHeight));
		},
		methods: {
			getWordCloud(data){
				uni.showLoading()
				getWordCloud(data).then(res => {
					uni.hideLoading()
					console.log(data)
					console.log('getWordCloud',res.data)
					if(res.data.successCode == '1'){
						res.data.data.map((item,index) => {
							let wordlist = []
							item.WordList.map((iteml,indexl) => {
								wordlist.push({
									name: iteml.keyword,
									value: iteml.nums
								})
							})
							that.option.push(wordlist)
						})
						that.wordData = res.data.data
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(res.data.msg) 
				})
			},
			
		}
	}
</script>

<style>
	.cu-card>.cu-item{
		margin: 20upx 30upx;
	}
	.qiun-charts {
		width: 100%;
		height: 400upx;
		background-color: #FFFFFF;
	}
	
	.charts {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
	}
</style>
