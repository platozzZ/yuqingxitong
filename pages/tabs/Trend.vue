<template>
	<view>
		<view class="bg-white padding-top-sm">
			<view class=" flex justify-center">
				<view class="main-capsule text-xs flex justify-center text-df">
					<view class="main-capsule-item" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.id">
						{{item.name}}
					</view>
				</view>
			</view>
			
			<view class="" v-for="(item,index) in trendDatas" :key="index + item.type">
				<view class=" padding-top-sm text-center text-xl text-red bg-white">
					{{item.type == 'all'? $config.brand + '各车型舆情走势':item.type + '及竞品走势比较'}}
				</view>
				<view class="qiun-charts">
					<echarts :option="option[index]" class="charts"></echarts>
				</view>
			</view>
			
			<!-- 
			<view class="margin-top-sm padding-top-sm text-center text-xl text-red bg-white">
				广本各车型舆情走势
			</view>
			<view class="qiun-charts">
				<echarts :option="option" class="charts"></echarts>
			</view>
			<view class="margin-top-sm padding-top-sm text-center text-xl text-red bg-white">
				雅阁及竞品走势比较
			</view>
			<view class="qiun-charts">
				<echarts :option="option" class="charts"></echarts>
			</view>
			<view class="margin-top-sm padding-top-sm text-center text-xl text-red bg-white">
				凌派及竞品走势比较
			</view>
			<view class="qiun-charts">
				<echarts :option="option" class="charts"></echarts>
			</view> -->
		</view>
	</view>
</template>

<script>
	// import Week from '../soundvolume/week.vue'
	// import Month from '../soundvolume/month.vue'
	// import Season from '../soundvolume/season.vue'
	// import uCharts from '@/components/u-charts/u-charts.js';
	// import  { isJSON } from '@/common/checker.js';
	
	import echarts from "@/components/echarts/echarts.vue";
	var that;
	import { getTrend } from '@/utils/api.js'
	import utils from '../../utils/util.js'
	// import trendData from '../../utils/trendData.js';
	export default {
		components: {
			echarts
		},
		data() {
			return {
				tabList: [
					{
						id: "week",
						name: '近一周'
					}, {
						id: "month",
						name: '近一月'
					}, {
						id: "season",
						name: '近一季'
					}
				],
				TabCur: 0,
				trendDatas: [],
				option: [],
				// carData: {}
			}
		},
		mounted() {
			that = this;
			// that.carData = that.$config
			let data = {
				period: 'week'
			}
			that.getTrend(data)
		},
		methods: {
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				// console.log(this.scrollLeftData)
				let target = e.currentTarget.dataset
				that.TabCur = target.id
				let data = {
					period: target.target
				}
				that.getTrend(data)
			},
			getTrend(data){
				uni.showLoading()
				getTrend(data).then(res => {
					uni.hideLoading()
					console.log('getTrend',res)
					if(res.data.successCode == '1'){
						// formatMD
						let art = res.data.data
						let xData = []
						
						that.trendDatas = res.data.data
						that.options(res.data.data)
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(res.data.msg) 
				})
			},
			options(data){
				let optionData = data
				let option = []
				// console.log(optionData)
				optionData.map((item,index) => {
					let xData = []
					// let seriesData = []
					let seriesData = []
					item.mediaList.map((itemm,indexm) => {
						xData.push(utils.formatMD(new Date(itemm.mediaDate)))
					})
					item.carList.map((itemc,indexc) => {
						let yData = []
						item.mediaList.map((itema,indexa) => {
							itema.list.map((iteml,indexl) => {
								if(iteml.product == itemc){
									yData.push(iteml.nums)
								}
							})
						})
						// console.log(yData)
						seriesData.push({
							name: itemc,
							type: 'line',
							// stack: '',
							smooth: true,
							data: yData
						})
					})
					
					option.push(that.setOption(item.carList,xData,seriesData))
				})
				// console.log(option)
				that.option = option
			},
			setOption(legendData,xData,seriesData){
				// console.log(legendData)
				// console.log(legendData,xData,seriesData)
				// console.log(seriesData)
				let option = {
	// #f37b1d;#fbbd08;#8dc63f; #39b54a;#1cbbb4;#0081ff; #6739b6;#9c26b0;#e03997; #a5673f;#8799a3
					color: ['#c00000','#0070c0','#45046a','#001977','#6a3906','#ed6663','#007130','#c300d9','#51d874','#806d9e'],
					backgroundColor: '#fff',
					tooltip: {
						trigger: "axis",
						axisPointer: {
							type: "cross",
							animation: false,
							label: {
								backgroundColor: "#6a7985",
								precision: 0
							}
						},
						textStyle: {
							fontSize: 10
						},
						positionStatus: true, // 自定义变量：是否防止tooltip超出画布
						formatterStatus: true, // 自定义变量：是否格式化tooltip，设置为false时下面三项均不起作用
						// formatterUnit: '元', // 自定义变量：数值后面的单位
						// formatFloat2: false, // 自定义变量：是否格式化为两位小数
						// formatThousands: false // 自定义变量：是否添加千分位
					},
					legend: {
						data: legendData,
						// data: ["雅阁", "冠道", "缤智", "奥德赛", "凌派", "飞度", "理念VE-1", "皓影"],
						// icon: 'rect',
						itemWidth: 10,
						itemHeight: 6,
						top: 2,
						textStyle: {
							fontSize: 10
						}
					},
					grid: {
						left: "50",
						right: "20",
						bottom: "25",
						top: "30",
						containLabel: false
					},
					xAxis: {
						type: "category",
						axisLabel: {
							fontSize: 10,
							// rotate: 30,
							showMinLabel: true,//显示最小值
							showMaxLabel: true,//显示最大值
						},
						boundaryGap: false,
						data: xData
					},
					yAxis: [{
						type: "value",
					}],
					series: seriesData
				}
				
				return option
			},
		}
	}
</script>

<style>
	.border-bottom{
		border-bottom: 1rpx solid #ececec;
	}
	.qiun-charts {
		width: 100%;
		height: 500upx;
		background-color: #FFFFFF;
	}
	
	.charts {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
	}
</style>
