<template>
	<view class="">
		<view class="padding-top-sm">
			<view class=" flex justify-center">
				<view class="main-capsule text-xs flex justify-center text-df">
					<view class="main-capsule-item" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.id">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="cu-card">
				<view class="cu-item shadow" v-for="(item,index) in wordData" :key="index">
					<view class="padding-top-sm text-center text-xl text-red bg-white">
						{{item.type == 'all'? $config.brand + '各车型负面词云图':item.type + '及竞品负面词云图'}}
						<!-- 广本全车型负面词云图 -->
					</view>
					<view class="qiun-charts">
						<!-- <canvas :canvas-id="'canvasWord' + index" :id="'canvasWord' + index" class="charts"></canvas> -->
						<word-cloud-chart
							:id="'wordcloud' + index"
							:data="option[index]"
							:width="'100%'"
							:height="'400rpx'"
						>
						</word-cloud-chart>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	var that;
	import { getWordCloud } from '@/utils/api.js'
	// import uCharts from '@/components/u-charts/u-charts.js';
	// var canvaWord=null;
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
				ProjectName: 'WordCloudBad',
				Period: 'week'
			}
			that.getWordCloud(data)
			
			that.cWidth=uni.upx2px(750 - 60);
			that.cHeight=uni.upx2px(400);
			
		},
		methods: {
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				// console.log(this.scrollLeftData)
				let target = e.currentTarget.dataset
				that.TabCur = target.id;
				// that.nameCur = target.target
				let data = {
					ProjectName: 'WordCloudBad',
					Period: target.target
				}
				that.getWordCloud(data)
			},
			getWordCloud(data){
				uni.showLoading()
				getWordCloud(data).then(res => {
					uni.hideLoading()
					console.log(data)
					console.log('getWordCloud',res)
					if(res.data.successCode == '1'){
						that.wordData = res.data.data
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
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(res.data.msg) 
				})
			},
			// showWord(canvasId,chartData){
			// 	canvaWord=new uCharts({
			// 		$this:that,
			// 		canvasId: canvasId,
			// 		type: 'word',
			// 		background:'#fff',
			// 		animation: true,
			// 		pixelRatio: 1,
			// 		series: chartData.series,
			// 		width: that.cWidth,
			// 		height: that.cHeight,
			// 		extra: {
			// 			word: {
			// 				type: 'vertical',
			// 				autoColors: true
			// 			}
			// 		}
			// 	});
			// },
			showToast(e) {
				uni.showToast({
					title: e,
					icon: 'none',
					mask: true,
					duration: 2000
				})
			}, 
			touchWord(e){
			  canvaWord.showToolTip(e, {
			  	format: function (item) {
			  		return item.name
			  	}
			  });
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
