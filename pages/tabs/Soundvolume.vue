<template>
	<view>
		<view class="bg-white padding-top-sm">
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
			<view class="" v-if="showChart">			
				<view class="" v-for="(item,index) in volDatas" :key="index">
					<view class="margin-top-sm text-center text-xl text-red bg-white">
						{{item.type == 'all'? $config.brand + '各车型舆情声量':item.type + '及竞品声量比较'}}
					</view>
					<!-- <p-lazy-render :data="option" :time="300" :limit="50" trackByData> -->
						<view class="qiun-charts">
							<echarts :option="option[index]" class="charts"></echarts>
							<!-- <view class="" slot="tip">
								tipssssssssssssssssss
							</view> -->
						</view>
					<!-- </p-lazy-render> -->
				</view>
			</view>
			<!-- <view class="margin-top-sm padding-top-sm text-center text-xl text-red bg-white">
				广本各车型舆情声量
			</view>
			<view class="qiun-charts">
				<echarts :option="option" class="charts"></echarts>
			</view>
			<view class="margin-top-sm padding-top-sm text-center text-xl text-red bg-white">
				雅阁及竞品声量比较
			</view>
			<view class="qiun-charts">
				<echarts :option="option" class="charts"></echarts>
			</view>
			<view class="margin-top-sm padding-top-sm text-center text-xl text-red bg-white">
				凌派及竞品声量比较
			</view>
			<view class="qiun-charts">
				<echarts :option="option" class="charts"></echarts>
			</view> -->
		</view>
		
	</view>
</template>

<script>
	import echarts from "@/components/echarts/echarts.vue";
	// import volDatas from '../../utils/demo.js';
	var that;
	import { getVol } from '@/utils/api.js'
	export default {
		components: {
			echarts
		},
		data() {
			return {
				tabList: [
					{
						id: "week",
						name: '本周'
					}, {
						id: "month",
						name: 'ALL'
					}, 
					// {
					// 	id: "season",
					// 	name: '本季'
					// }
				],
				TabCur: 0,
				nameCur: 'week',
				volDatas: [],
				showChart: false,
				option: [],
				value1: '2',
				value2: '3',
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
				// carData: {}
			}
		},
		mounted() {
			that = this;
			let data = {
				Period: 'ThisWeek',
				Para: 'ALL',
			}
			that.getVol(data)
			// that.carData = that.$config
		},
		methods: {
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				let target = e.currentTarget.dataset
				// console.log(this.scrollLeftData)
				that.TabCur = target.id;
				// that.nameCur = target.target
				let data = {
					period: target.target,
				}
				that.getVol(data)
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
					Period: that.dropOption[0][that.dropItemIndex[0]].value,
					Para: that.dropOption[1][that.dropItemIndex[1]].value
				}
				that.getVol(data)
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			openDropdown(index){
				console.log(index);
				that.dropIndex = index
			},
			getVol(data){
				uni.showLoading()
				that.showChart = false
				getVol(data).then(res => {
					console.log(data)
					console.log('getVol',res)
					if(res.data.successCode == '1'){
						that.showChart = true
						that.volDatas = res.data.data
						that.option = new Array(res.data.data.length)
						
						that.options(res.data.data)
					} else {
						that.showToast(res.data.msg) 
					}
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.data.msg) 
				})
			},
			options(optionData){
				// let optionData = that.volDatas
				console.log(optionData)
				let option = []
				optionData.map((item,index) => {
					let seriesData = []
					let legendData = []
					item.mediaList.map((itemm,indexm) => {
						let yData = []
						legendData.push(itemm.mediaType)
						item.carList.map((itemc,indexc) => {
							itemm.list.map((iteml,indexl) => {
								if(iteml.product == itemc){
									yData.push(iteml.nums)
								}
							})
						})
						seriesData.push({
							name: itemm.mediaType,
							barMaxWidth: 24,
							type: 'bar',
							stack: '声量',
							data: yData
						})
					})
					// console.log(legendData)
					// console.log(seriesData)
					option.push(that.setOption(legendData,item.carList,seriesData))
				})
				console.log(that.option);
				// console.log(option).splice(indexl,1,option)
				that.option = option
				console.log(that.option);
			},
			setOption(legendData,xData,seriesData){
				// console.log(legendData)
				// console.log(xData)
				console.log(seriesData)
				let option = {
					// #f37b1d;#fbbd08;#8dc63f; #39b54a;#1cbbb4;#0081ff; #6739b6;#9c26b0;#e03997; #a5673f;#8799a3

					// #008ad2       #6b5fc2      #e67b60     #08b19c     #1c74b3
					// color: ['#f37b1d','#8dc63f','#6739b6','#1cbbb4','#e03997','#fbbd08'],
					color: ['#0070c0','#c300d9','#c00000','#51d874','#ed6663','#806d9e','#45046a','#6a3906','#001977','#007130'],
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
						icon: 'rect',
						itemWidth: 10,
						itemHeight: 10,
						top: 2,
						textStyle: {
							fontSize: 10
						}
					},
					grid: {
						left: "20",
						right: "20",
						bottom: "50",
						top: "20",
						containLabel: false
					},
					xAxis: {
						type: "category",
						axisLabel: {
							fontSize: 10,
							rotate: 30
						},
						data: xData
					},
					yAxis: [{
						show: false,
						type: "value",
						splitNumber: 80,
						// scale:true,
						axisLine: {
							show: false,
						}
					}],
					series: seriesData
					// series: [{
					// 		name: "APP",
					// 		type: "bar",
					// 		stack: "声量",
					// 		data: seriesData[0]
					// 	},
					// 	{
					// 		name: "论坛",
					// 		type: "bar",
					// 		stack: "声量",
					// 		data: seriesData[1]
					// 	},
					// 	{
					// 		name: "平面",
					// 		type: "bar",
					// 		stack: "声量",
					// 		data: seriesData[2]
					// 	},
					// 	{
					// 		name: "网络",
					// 		type: "bar",
					// 		stack: "声量",
					// 		data: seriesData[3]
					// 	},
					// 	{
					// 		name: "微博",
					// 		type: "bar",
					// 		stack: "声量",
					// 		data: seriesData[4]
					// 	},
					// 	{
					// 		name: "微信",
					// 		type: "bar",
					// 		stack: "声量",
					// 		data: seriesData[5]
					// 	}
					// ]
				}
				// this.option = option
				return option
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
	/deep/ .u-dropdown__menu{
		justify-content: center;
	}
	/deep/ .u-dropdown__menu__item{
		flex-grow: 0;
		flex-basis: auto;
		padding: 0 30rpx;
	}
</style>
