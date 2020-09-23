<template>
	<view>
		<view class="cu-card article">
			<view class="cu-item shadow">
				<view class="title text-red text-center text-xl">
					负面专题TOP5（累计声量）
				</view>
				<view class="padding-lr flex flex-direction">
					<view class="flex topitem" :class="[index == topCur?'active':'',index == 0?'margin-0':'margin-top-sm' ]" v-for="(item,index) in topList" :key="item.value + index" >
						<view 
							class="flex justify-between padding-lr-sm bg-blue text-sm topitem-bar" 
							@tap="topTabSelect(item,index)"
							:data-id="index"
						>
						
						<!-- :style="{width: item.value/topList[0].value *100 + '%'}" -->
							{{item.EventName}}
							<text>{{item.value}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class=" flex justify-center">
			<view class="main-capsule flex justify-center text-df">
				<view class="main-capsule-item" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect(item,index)" :data-id="index" :data-target="item.id" :data-type="item.type">
					{{item.name}}
				</view>
			</view>
		</view>
		<special-trend :trendOption="trendOption" v-if="TabCur == 0"></special-trend>
		<special-trend :trendOption="trendOption" v-if="TabCur == 1"></special-trend>
		<special-trend :trendOption="trendOption" v-if="TabCur == 2"></special-trend>
		<special-trend :trendOption="trendOption" v-if="TabCur == 3"></special-trend>
		<!-- <view class="tab-content" v-if="TabCur == 0">
			<view class="cu-card article">
				<view class="cu-item shadow">
					<view class="qiun-charts">
						<echarts :option="trendOption" class="charts"></echarts>
					</view>
				</view>
			</view>
		</view> -->
		<view class="tab-content" v-if="TabCur == 1">
			<view class="cu-card article">
				<view class="cu-item shadow">
					<view class="title">
						话题调性占比
					</view>
					<view class="qiun-charts">
						<echarts :option="importantOption" class="charts"></echarts>
					</view>
				</view>
			</view>
			<view class="cu-card article" v-for="(item,index) in importantData" :key="item.MediaType" v-if="item.length > 0">
				<view class="cu-item shadow" style="margin-top: 0;">
					<view class="title text-center text-xl" :class="index == 0?'text-red':'text-blue'">
						{{index == 0?'正面话题声量排序':'负面话题声量排序'}} 
					</view>
					<!-- <view class="padding-lr flex flex-direction">
						<view class="flex topitem active" v-for="(iteml,indexl) in item.list" :key="index + indexl" >
							<view class="flex justify-between padding-lr-sm bg-blue text-sm topitem-bar">
								{{iteml.MediaName}}
								<text>{{iteml.value}}</text>
							</view>
						</view>
					</view> -->
					<view class="padding-lr flex flex-direction">
						<view class="" :class="indexl == 0?'margin-0':'margin-top-sm'" v-for="(iteml,indexl) in item" :key="index + indexl" >
							<view class="flex justify-between align-center topitem margin-bottom-xs">
								<view
									class="flex-sub text-cut text-sm special" 
								>
									{{iteml.Topic}}
								</view>
								<view class="margin-left-sm" :class="index == 0?'text-red':'text-blue'">{{iteml.value}}</view>
							</view>
							<!-- <view class="response text-cut text-gray">
								{{iteml.Topic}}
							</view> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tab-content" v-if="TabCur == 2">
			<view class="cu-card article" v-for="(item,index) in platData" :key="item.MediaType" v-if="item.list.length>0">
				<view class="cu-item shadow" :style="{'marginTop':index>0 ? '0':''}">
					<view class="title">
						{{item.MediaType == 'all'?'各类型媒体声量分布':item.MediaType + '声量分布'}}
					</view>
					<view class="qiun-charts">
						<echarts :option="platOption[index]" class="charts"></echarts>
					</view>
				</view>
			</view>
			<!-- <view class="cu-card article">
				<view class="cu-item shadow" style="margin-top: 0;">
					<view class="title">
						APP平台声量分布
					</view>
					<view class="qiun-charts">
						<echarts :option="option22" class="charts"></echarts>
					</view>
				</view>
			</view>
			<view class="cu-card article">
				<view class="cu-item shadow" style="margin-top: 0;">
					<view class="title">
						自媒体声量TOP10
					</view>
					<view class="qiun-charts">
						<echarts :option="option23" class="charts"></echarts>
					</view>
				</view>
			</view> -->
		</view>
		<view class="tab-content" v-if="TabCur == 3">
			<view class="cu-card article">
				<view class="cu-item shadow">
					<view class="qiun-charts tree">
						<echarts :option="optionTree" class="charts chartstree"></echarts>
					</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import echarts from "@/components/echarts/echarts.vue";
	var that;
	import { getSpecial } from '@/utils/api.js'
	import utils from '../../utils/util.js'
	export default {
		components: {
			echarts
		},
		data() {
			return {
				tabList: [
					{
						id: "TopicTrend",
						name: '声量趋势',
					}, {
						id: "TopicImportant",
						name: '重点话题',
					}, {
						id: "TopicPlatform",
						name: '传播平台'
					}, {
						id: "TopicSpread",
						name: '传播路径'
					}
				],
				topList: [],
				topCurName: '',
				projectName: 'TopicTrend',
				eventName: '',
				topCur: 0,
				TabCur: 0,
				specialData: [],
				importantData: [],
				platData: [],
				optionTree: {},
				trendOption: {},
				importantOption: {},
				platOption: [],
				
				
			}
		},
		mounted() {
			that = this;
			// that.getSpecial('TopicVolume')
			// ProjectName=TopicTrend&EventName=专项-第四代飞度配置表泄露
			let data = {
				ProjectName: 'TopicTrend'
			}
			that.getSpecial(data)
			// that.getSpecial(data,...(EventName: '))
		},
		methods: {
			tabSelect(e,i) {
				console.log(e)
				console.log(i)
				that.projectName = e.id
				that.TabCur = i
				let val = {
					ProjectName: e.id,
					EventName: that.eventName
				}
				that.getSpecial(val)
			},
			topTabSelect(e,i){
				console.log(e);
				console.log(i);
				that.eventName = e.EventName
				that.topCur = i
				let val = {
					ProjectName: that.projectName,
					EventName: e.EventName
				}
				that.getSpecial(val)
				// let target = e.currentTarget.dataset
				// let specialData = that.specialData
				// specialData.map((item,index) => {
				// 	if(e.EventName == item.type){
						
				// 	}
				// })
			},
			getSpecial(data){
				console.log(data);
				uni.showLoading()
				getSpecial(data).then(res => {
					uni.hideLoading()
					console.log('getSpecial',res)
					if(res.data.successCode == '1'){
						if(!data.EventName){
							that.topList = res.data.data
							that.eventName = res.data.data[0].EventName
							let val = {
								ProjectName: 'TopicTrend',
								EventName: res.data.data[0].EventName
							}
							that.getSpecial(val)
							return
						}
						if(data.ProjectName == 'TopicTrend'){
							// console.log(res.data.data[0])
							that.optionTrend(res.data.data[0])
						}
						if(data.ProjectName == 'TopicImportant'){
							// console.log('importantData:',res.data.data[0])
							let importantDatas = res.data.data[0]
							console.log(importantDatas)
							let importantData = []
							importantDatas.List.map((item,index) => {
								if(item.GoodTopic) importantData.push(item.GoodTopic)
									
								if(item.BadTopic) importantData.push(item.BadTopic)
							})
							that.importantData = importantData
							console.log(importantData)
							that.optionImportant(importantDatas.List[0].DiaoxingList)
						}
						if(data.ProjectName == 'TopicPlatform'){
							that.platData = res.data.data[0].MediaList
							that.optionPlat(res.data.data[0].MediaList)
						}
						if(data.ProjectName == 'TopicSpread'){
							that.treeOption(res.data.data)
						}
						// list.map((item,index) => {
						// 	if(item.type == "all"){
						// 		// item.list.map()
						// 		that.topList = item.list
						// 		that.topCurName = item.list[0].EventName
						// 	}
						// })
					} else {
						that.showToast(res.data.msg) 
					}
						// that.TabCur = i
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.msg) 
				})
			},
			getSpecials(e){
				uni.showLoading()
				getSpecial(e).then(res => {
					uni.hideLoading()
					console.log('getSpecial',res)
					if(res.data.successCode == '1'){
						
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.msg) 
				})
			},
			setOption(index,xData,seriesData){
				let option = {
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
						show: false,
					},
					grid: {
						left: "45",
						right: "20",
						bottom: index == 0?'30':'60',
						top: "10",
						containLabel: false
					},
					xAxis: {
						type: "category",
						axisLabel: {
							fontSize: 10,
							rotate: 30
						},
						// boundaryGap: false,
						data: xData
					},
					yAxis: [{
						type: "value",
						axisLabel: {
							formatter: function(v){
								return  that.tranNumber(v);
							}
						}
					}],
					// series: seriesData,
					series: [{
						name: "平台声量",
						barMaxWidth: 24,
						type: "bar",
						data: seriesData
					}]
				}
				return option
			},
			optionPlat(data){
				let optionData = data
				let option = []
				console.log(optionData)
				optionData.map((item,index) => {
					let xData = []
					// let seriesData = []
					let seriesData = []
					item.list.map((itemm,indexm) => {
						xData.push(itemm.MediaType?itemm.MediaType:itemm.MediaName)
						seriesData.push(itemm.value)
					})
					
					option.push(that.setOption(index,xData,seriesData))
				})
				console.log(option)
				that.platOption = option
			},
			
			optionTrend(data){
				console.log(data)
				let optionData = data
				let xData = []
				let seriesData = []
				optionData.day.map((item,index) => {
					xData.push(utils.formatMD(new Date(item.mediaDate)))
					seriesData.push(item.value)
				})
				let option = {
					// notMerge: true, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
					// color: ['#2a5caa','#6950a1','#e0861a','#65c294','#7a1723','#145b7d'],
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
						show: false
					},
					grid: {
						left: "10%",
						right: "20",
						bottom: "20",
						top: "20",
						containLabel: false
					},
					xAxis: [{
						type: "category",
						splitLine: { //网格线
							show: true
						},
						axisLabel: {
							fontSize: 10,
							// rotate: 30
						},
						boundaryGap: false,
						data: xData
					}],
					yAxis: [{
						type: "value",
						splitLine: { //网格线
							show: true
						},
					}],
					series: [{
						name: "产品信息",
						type: "line",
						smooth: true,
						data: seriesData
					}]
				}
				that.trendOption = option
			},
			optionImportant(data){
				console.log(data)
				let optionData = data
				let xData = []
				let seriesData = []
				optionData.map((item,index) => {
					xData.push(item.diaoxing)
					seriesData.push({value: item.percent.replace("%",""),name: item.diaoxing})
				})
				console.log(seriesData)
				let option = {
					// tooltip: {
					// 	trigger: 'item',
					// 	formatter: '{b}: \n{c} ({d}%)'
					// },
					legend: {
						// show: false,
						orient: 'vertical',
						right: 10,
						top: '35%',
						itemWidth: 14,
						itemHeight: 14,
						data: xData
					},
					series: [
						{
							name: '话题调性',
							type: 'pie',
							radius: ['40%', '90%'],
							// hoverAnimation: true,
							label: {
								normal: {
									show: true,
									textStyle: {
										fontSize: 12,
										color: '#fff'
									},
									position: 'inside',
									rotate: 30,
									align: 'right',
									// formatter:'{d}%'
									formatter:function(data){
										// console.log(data)
										return Math.round(data.percent)+"%";
									} ,
								},
							},
							// emphasis: {
							// 	label: {
							// 		show: true,
							// 		fontSize: '14',
							// 	}
							// },
							data: seriesData
						}
					]
				}
				that.importantOption = option
			},
			treeOption(treeData){
				console.log(treeData)
				let option = {
					series: [
						{
							type: 'tree',
							top: '10',
							left: '15',
							bottom: '10',
							right: '15',
							symbolSize: 7,
							label: {
								position: 'left',
								verticalAlign: 'middle',
								align: 'right',
								fontSize: 9
							},
							leaves: {
								label: {
									position: 'right',
									verticalAlign: 'middle',
									align: 'left'
								}
							},
							expandAndCollapse: false,
							animationDuration: 550,
							animationDurationUpdate: 750,
							data: treeData
						}
					]
				}
				that.optionTree = option
			},
			
			tranNumber(num){
			    var numStr = num.toString();
			    // 十万以内直接返回
			    if (numStr.length <5 ) {
			        return numStr;
			    }
			    //大于8位数是亿
			    else if (numStr.length > 8) {
			        var decimal = numStr.substring(numStr.length - 8, numStr.length - 8 );
			        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
			    }
			    //大于6位数是十万 (以10W分割 10W以下全部显示)
			    else if (numStr.length > 5) {
			        var decimal = numStr.substring(numStr.length - 4, numStr.length - 4)
			        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
			    }else if(numStr.length == 5){
			        var decimal = numStr.substring(numStr.length - 3, numStr.length - 4)
			        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
			 
			        
			    }
			   
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
	.cu-card.article>.cu-item .title{
		color: #cc0000;
		font-size: 36upx;
	}
	.cu-card.article>.cu-item .title.text-blue{
		color: #0060BE;
	}
	.topitem .special.bg-blue{
		background-color: #0060BE;
	}
	.topitem{
		height: 50upx;
		line-height: 50upx;
	}
	.topitem .bg-blue{
		background-color: rgba(0,96,190,.5);
	}
	.topitem.active .bg-blue{
		background-color: #0060BE;
	}
	/* .topitem-bar{
		min-width: 50%;
	} */
	.topitem:nth-child(1) .topitem-bar{
		width: 100%;
	}
	.topitem:nth-child(2) .topitem-bar{
		width: 80%;
	}
	.topitem:nth-child(3) .topitem-bar{
		width: 70%;
	}
	.topitem:nth-child(4) .topitem-bar{
		width: 66%;
	}
	.topitem:nth-child(5) .topitem-bar{
		width: 60%;
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
	
	.qiun-charts.tree{
		max-height: 900upx;
	}
</style>
