<template>
	<view class="">
		<view class="padding-top-sm">
			<!-- <view class=" flex justify-center">
				<view class="main-capsule text-xs flex justify-center text-df">
					<view class="main-capsule-item" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.id">
						{{item.name}}
					</view>
				</view>
			</view> -->
			
			<u-dropdown :close-on-click-mask="mask" ref="uDropdown" :borderBottom="borderBottom" height="50" @open="openDropdown">
				<u-dropdown-item @change="change" :value="dropOption[0][dropItemIndex[0]].value" :title="dropOption[0][dropItemIndex[0]].label" :options="dropOption[0]"></u-dropdown-item>
				<u-dropdown-item @change="change" :value="dropOption[1][dropItemIndex[1]].value" :title="dropOption[1][dropItemIndex[1]].label" :options="dropOption[1]"></u-dropdown-item>
			</u-dropdown>
			
			<view class="cu-card">
				<view class="cu-item shadow" v-for="(item,index) in wordData" :key="index">
					<view class="padding-top-sm text-center text-xl text-red bg-white">
						{{item.type == 'all'?$config.brand + '各车型正面词云图':item.type + '正面词云图'}}
					</view>
					<view class="qiun-charts">
						<!-- <canvas :canvas-id="'canvasWord' + index" :id="'canvasWord' + index" class="charts"></canvas> -->
						<word-cloud-chart
							:id="'wordcloud' + index"
							:data="option[index]"
							:width="'100%'"
							:height="'400rpx'"
							v-if="isShowChart"
						>
						</word-cloud-chart>
					</view>
				</view>
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
				isShowChart: false,
				mask: true,
				dropOption: [
					[
						{
							label: '本周',
							value: 'ThisWeek',
						},
						{
							label: '上周',
							value: 'LastWeek',
						},
						{
							label: '本月',
							value: 'ThisMonth',
						},
						{
							label: '上月',
							value: 'LastMonth',
						}
					],
					[
						{
							label: 'ALL',
							value: 'ALL',
						},
						{
							label: 'PGC',
							value: 'PGC',
						},
						{
							label: 'UGC',
							value: 'UGC',
						},
						
					],
				],
				borderBottom: false,
				activeColor: '#fff',
				inactiveColor: '#cc0000',
				dropIndex: null,
				dropItemIndex: [0,0]
			}
		},
		mounted() {
			that = this;
			// ProjectName=WordCloudBad&Period=week
			
			// let data = {
			// 	ProjectName: 'WordCloudGood',
			// 	Period: 'week'
			// }
			let data = {
				ProjectName: 'WordCloudGood',
				Period: 'ThisWeek',
				Para: 'ALL',
			}
			that.getWordCloud(data)
			that.cWidth=uni.upx2px(750 - 60) + '';
			that.cHeight=uni.upx2px(400) + '';
		},
		methods: {
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				// console.log(this.scrollLeftData)
				let target = e.currentTarget.dataset
				that.TabCur = target.id;
				// that.nameCur = target.target
				let data = {
					ProjectName: 'WordCloudGood',
					Period: target.target
				}
				that.getWordCloud(data)
			},
			change(value,index) {
				console.log(value);
				console.log(index);
				// that.dropItemIndex = that.dropItemIndex
				that.$set(that.dropItemIndex,that.dropIndex,index)
				console.log(that.dropItemIndex);
				// let data
				// if(that.dropIndex == 0){
					
				// }
				let data = {
					ProjectName: 'WordCloudGood',
					Period: that.dropOption[0][that.dropItemIndex[0]].value,
					Para: that.dropOption[1][that.dropItemIndex[1]].value
				}
				that.getWordCloud(data)
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			openDropdown(index){
				console.log(index);
				that.dropIndex = index
			},
			getWordCloud(data){
				that.isShowChart = false
				uni.showLoading()
				getWordCloud(data).then(res => {
					uni.hideLoading()
					that.isShowChart = true
					console.log(data)
					console.log('getWordCloud',res)
					if(res.data.successCode == '1'){
						that.wordData = res.data.data
						console.log(res.data.data.length > 0);
						if(res.data.data.length > 0){
							let optionList = []
							res.data.data.map((item,index) => {
								let wordlist = []
								item.WordList.map((iteml,indexl) => {
									wordlist.push({
										name: iteml.keyword,
										value: iteml.nums
									})
								})
								// that.option.push(wordlist)
								optionList.push(wordlist)
							})
							that.option = optionList
							console.log(that.option);
						} else {
							that.showToast(res.data.msg) 
							
						}
						// res.data.data.map((itemd,indexd) => {
						// 	let Word = {series: []}
						// 	itemd.WordList.map((item,index) => {
						// 		let num = parseInt(Math.random()*(20-6+1)+6,10);
						// 		// console.log(num)
						// 		Word.series.push({
						// 			name: item.keyword,
						// 			textSize: num,
						// 			value: item.nums
						// 		})
								
						// 	})
						// 	that.showWord("canvasWord" + indexd,Word);
						// })
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.text) 
				})
			},
			// showWord(canvasId,chartData){
			// 	// console.log(canvasId)
			// 	// console.log(chartData)
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
			// 				// type: 'normal'
			// 				// type: 'random'
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
	
	/deep/ .u-dropdown__menu{
		justify-content: center;
	}
	/deep/ .u-dropdown__menu__item{
		flex-grow: 0;
		flex-basis: auto;
		padding: 0 30rpx;
	}
</style>
