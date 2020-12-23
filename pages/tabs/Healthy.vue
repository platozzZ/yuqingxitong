<template>
	<view>
		<view class="bg-white padding-top-sm" v-if="trendDatas || trendDatas2">
			<!-- <view class=" flex justify-center">
				<view class="main-capsule text-xs flex justify-center text-df">
					<view class="main-capsule-item" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.id">
						{{item.name}}
					</view>
				</view>
			</view> -->
			<u-dropdown :close-on-click-mask="mask" ref="uDropdown" :borderBottom="borderBottom" height="50" @open="openDropdown">
				<u-dropdown-item @change="change" 
					v-for="(item,index) in dropOption"
					:key="index"
					:value="dropOption[index][dropItemIndex[index]].value"
					:title="dropOption[index][dropItemIndex[index]].label" 
					:options="dropOption[index]"
				>
				</u-dropdown-item>
				<!-- <u-dropdown-item @change="change" :value="dropOption[1][dropItemIndex[1]].value" :title="dropOption[1][dropItemIndex[1]].label" :options="dropOption[1]"></u-dropdown-item> -->
			</u-dropdown>
			<view class="" v-for="(item,index) in trendDatas" :key="index + item.type">
				<view class=" padding-top-sm text-center text-xl text-red bg-white">
					全媒体舆情健康度走势
				</view>
				<view class="qiun-charts">
					<echarts :option="option[index]" class="charts"></echarts>
				</view>
			</view>
			<view class="padding-tb">
				<u-dropdown :close-on-click-mask="mask" ref="uDropdown2" :borderBottom="borderBottom" height="50" @open="openDropdown2">
					<u-dropdown-item @change="change2" :value="dropOption2[0][dropItemIndex2[0]].value" :title="dropOption2[0][dropItemIndex2[0]].label" :options="dropOption2[0]"></u-dropdown-item>
					<u-dropdown-item @change="change2" :value="dropOption2[1][dropItemIndex2[1]].value" :title="dropOption2[1][dropItemIndex2[1]].label" :options="dropOption2[1]"></u-dropdown-item>
				</u-dropdown>
				
			</view>
			<view class="" v-for="(item,index) in trendDatas2" :key="item.type + index">
				<view class=" padding-top-sm text-center text-xl text-red bg-white">
					论坛舆情健康度走势
				</view>
				<view class="qiun-charts">
					<echarts :option="option2[index]" class="charts"></echarts>
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
	import echarts from "@/components/echarts/echarts.vue";
	var that;
	import { getHealthMedia, getHealthBbs } from '@/utils/api.js'
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
				trendDatas2: [],
				option: [],
				option2: [],
				mask: true,
				dropOption: [
					[
						{
							label: '按日',
							value: 'ThisWeek',
						},
						{
							label: '按周',
							value: 'LastWeek',
						},
						{
							label: '按月',
							value: 'ThisMonth',
						},
						
					],
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
							label: '平面',
							value: '平面',
						},
						{
							label: '网站',
							value: '网站',
						},
						{
							label: '论坛',
							value: '论坛',
						},
						{
							label: '微博',
							value: '微博',
						},
						{
							label: '自媒体',
							value: '自媒体',
						},
					],
					[
						{
							label: '全部',
							value: 'ThisWeek',
						},
						{
							label: '正面率',
							value: 'LastWeek',
						},
						{
							label: '负面率',
							value: 'ThisMonth',
						},
						
					],
				],
				dropOption2: [
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
							label: '论坛',
							value: '论坛',
						},
						{
							label: '之家',
							value: '之家',
						},
						{
							label: '易车',
							value: '易车',
						},
						{
							label: '爱卡',
							value: '爱卡',
						},
						{
							label: '太平洋',
							value: '太平洋',
						},
						{
							label: '车友圈',
							value: '车友圈',
						},
						{
							label: '虎扑',
							value: '虎扑',
						},
						{
							label: '知乎',
							value: '知乎',
						},
						{
							label: '贴吧',
							value: '贴吧',
						},
					],
				],
				borderBottom: false,
				activeColor: '#fff',
				inactiveColor: '#cc0000',
				dropIndex: null,
				dropIndex2: null,
				dropItemIndex: [0,0,0,0],
				dropItemIndex2: [0,0,0,0]
				// carData: {}
			}
		},
		mounted() {
			that = this;
			// that.carData = that.$config
			// let data = {
			// 	period: 'week'
			// }
			
			let data = {
				period_var: 'ThisWeek',
				MediaType: 'ALL',
			}
			that.getHealthMedia(data)
			let val = {
				period_var: 'ThisWeek',
				MediaType: '论坛',
			}
			that.getHealthBbs(val)
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
				that.getHealthMedia(data)
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
					period_var: that.dropOption[0][that.dropItemIndex[0]].value,
					MediaType: that.dropOption[1][that.dropItemIndex[1]].value
				}
				that.getHealthMedia(data)
			},
			
			change2(value,index) {
				console.log(value);
				console.log(index);
				// that.dropItemIndex = that.dropItemIndex
				that.$set(that.dropItemIndex2,that.dropIndex2,index)
				console.log(that.dropItemIndex2);
				let data = {
					period_var: that.dropOption2[0][that.dropItemIndex2[0]].value,
					MediaType: that.dropOption2[1][that.dropItemIndex2[1]].value
				}
				that.getHealthBbs(data)
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
				this.$refs.uDropdown2.close();
			},
			openDropdown(index){
				console.log(index);
				that.dropIndex = index
			},
			openDropdown2(index){
				console.log(index);
				that.dropIndex2 = index
			},
			getHealthMedia(data){
				uni.showLoading()
				getHealthMedia(data).then(res => {
					uni.hideLoading()
					console.log('getHealthMedia',res)
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
					that.showToast(err.text) 
				})
			},
			getHealthBbs(data){
				uni.showLoading()
				getHealthBbs(data).then(res => {
					uni.hideLoading()
					console.log('getHealthBbs',res)
					if(res.data.successCode == '1'){
						// formatMD
						let art = res.data.data
						let xData = []
						
						that.trendDatas2 = res.data.data
						that.options2(res.data.data)
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.text) 
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
							data: yData,
							markLine: {
								silent: true,
								data: [{
									yAxis: 95
								}],
								lineStyle: {
									color: '#c00000'
								},
								label:{
									position:"end",         //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
									formatter: "95%",
									fontSize: 10
								},
							}
						})
					})
					
					option.push(that.setOption(item.carList,xData,seriesData))
				})
				// console.log(option)
				that.option = option
			},
			options2(data){
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
							showAllSymbol: 'true',
							smooth: true,
							data: yData,
							markLine: {
								silent: true,
								data: [{
									yAxis: 90
								}],
								lineStyle: {
									color: '#c00000'
								},
								label:{
									position:"end",         //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
									formatter: "90%",
									fontSize: 10
								},
							}
						})
					})
					
					option.push(that.setOption(item.carList,xData,seriesData))
				})
				// console.log(option)
				that.option2 = option
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
						right: "28",
						bottom: "25",
						top: "30",
						containLabel: false
					},
					xAxis: {
						type: "category",
						axisLabel: {
							fontSize: 10,
							// rotate: 30,
							// showMinLabel: true,//显示最小值
							// showMaxLabel: true,//显示最大值
						},
						boundaryGap: false,
						data: xData
					},
					yAxis: [{
						type: "value",
						min: 'dataMin',
						max: '100',
						axisLabel: {
							formatter: '{value} %'
						},
					}],
					series: seriesData
				}
				
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
