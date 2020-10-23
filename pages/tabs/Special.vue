<template>
	<view>
		<view class="cu-card article">
			<view class="cu-item shadow">
				<view class="title text-red text-center text-xl">
					负面专项
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
				<view class="padding-sm">
					<uni-pagination :current="current" :total="total" :show-icon="true" @change="change" />
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
		<special-important :importantData="importantData" :importantOption="importantOption" v-if="TabCur == 1"></special-important>
		<special-platform :platData="platData" :platOption="platOption" v-if="TabCur == 2"></special-platform>
		<special-tree :optionTree="optionTree" v-if="TabCur == 3"></special-tree>
		<special-list :list="specialList" :status="status" v-if="TabCur == 4"></special-list>
	</view>
</template>

<script>
	let treeLength = 0
	import echarts from "@/components/echarts/echarts.vue";
	var that;
	import {getSpecial, getSpecialList, getSpecialCount } from '@/utils/api.js'
	import utils from '../../utils/util.js'
	export default {
		components: {
			echarts
		},
		data() {
			return {
				tabList: [
					{
						id: "GetSpecialVolumn",
						name: '声量',
					}, {
						id: "GetSpecialImportant",
						name: '话题',
					}, {
						id: "GetSpecialPlatform",
						name: '平台'
					}, {
						id: "GetSpecialPath",
						name: '路径'
					}, {
						id: "GetSpecialItemData",
						name: '数据'
					}
				],
				topList: [],
				topCurName: '',
				projectName: 'GetSpecialVolumn',
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
				treeLen: 0,
				total: 10,
				current: 1,
				specialList: [],
				page: 1,
				totalPage: 0,
				status: 'more'
				
			}
		},
		props: {
			loadDataEventCount:{
				type:Number,
				default:0
			}
		},
		watch: {
			loadDataEventCount() {
				if(this.TabCur == 4){
					this.setReachBottom();
				}
			}
		},
		mounted() {
			that = this;
			let data = {
				CurPage: 1,
				PerNum: 10
			}
			that.getSpecialList(data)
			that.getSpecialCount()
			// that.getSpecial(data,...(EventName: '))
		},
		methods: {
			tabSelect(e,i) {
				console.log(e)
				console.log(i)
				that.projectName = e.id
				that.TabCur = i
				let val 
				if(e.id == 'GetSpecialItemData'){
					val = {
						type: e.id,
						EventName: that.eventName,
						CurPage: 1,
						PerNum: 20
					}
				} else {
					val = {
						type: e.id,
						EventName: that.eventName
					}
				}
				that.getSpecial(val)
			},
			topTabSelect(e,i){
				console.log(e);
				console.log(i);
				that.eventName = e.EventName
				that.topCur = i
				let val
				if(that.TabCur == '4'){
					val = {
						type: that.projectName,
						EventName: e.EventName,
						CurPage: 1,
						PerNum: 20
					}
				} else {
					val = {
						type: that.projectName,
						EventName: e.EventName
					}
				}
				// let val = {
				// 	type: that.projectName,
				// 	EventName: e.EventName
				// }
				that.getSpecial(val)
			},
			change(e) {
				console.log(e)
				// {type: "next", current: 2}
				// {type: "prev", current: 1}
				this.current = e.current
				let data = {
					CurPage: e.current,
					PerNum: 10
				}
				that.getSpecialList(data)
			},
			getSpecialCount(){
				getSpecialCount().then(res => {
					console.log('getSpecialCount',res)
					that.total = res.data.data
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.msg) 
				})
			},  
			getSpecialList(data){
				console.log(data);
				uni.showLoading()
				getSpecialList(data).then(res => {
					uni.hideLoading()
					console.log('getSpecialList',res)
					if(res.data.successCode == '1'){
						// if(!data.EventName){
							that.topList = res.data.data[0].list
							that.eventName = res.data.data[0].list[0].EventName
							console.log(res.data.data[0].list[0].EventName);
							let formData = {
								type: 'GetSpecialVolumn',
								EventName: res.data.data[0].list[0].EventName
							}
							that.getSpecial(formData)
						// 	let val = {
						// 		ProjectName: 'TopicTrend',
						// 		EventName: res.data.data[0].EventName
						// 	}
						// 	that.getSpecial(val)
						// 	return
						// }
						// if(data.ProjectName == 'TopicTrend'){
						// 	// console.log(res.data.data[0])
						// 	that.optionTrend(res.data.data[0])
						// }
						// if(data.ProjectName == 'TopicImportant'){
						// 	// console.log('importantData:',res.data.data[0])
						// 	let importantDatas = res.data.data[0]
						// 	console.log(importantDatas)
						// 	let importantData = []
						// 	importantDatas.List.map((item,index) => {
						// 		if(item.GoodTopic) importantData.push(item.GoodTopic)
									
						// 		if(item.BadTopic) importantData.push(item.BadTopic)
						// 	})
						// 	that.importantData = importantData
						// 	console.log(importantData)
						// 	that.optionImportant(importantDatas.List[0].DiaoxingList)
						// }
						// if(data.ProjectName == 'TopicPlatform'){
						// 	that.platData = res.data.data[0].MediaList
						// 	that.optionPlat(res.data.data[0].MediaList)
						// }
						// if(data.ProjectName == 'TopicSpread'){
						// 	that.treeOption(res.data.data)
						// }
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
			getSpecial(data){
				console.log(data);
				uni.showLoading()
				getSpecial(data).then(res => {
					uni.hideLoading()
					console.log('getSpecial',res)
					if(res.data.successCode == '1'){
						if(data.type == 'GetSpecialVolumn'){
							that.optionTrend(res.data.data[0])
						} else if(data.type == 'GetSpecialImportant'){
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
							
						} else if(data.type == 'GetSpecialPlatform'){
							that.platData = res.data.data[0].MediaList
							that.optionPlat(res.data.data[0].MediaList)
						} else if(data.type == 'GetSpecialPath'){
							that.treeOption(res.data.data)
						} else if(data.type == 'GetSpecialItemData'){
							that.totalPage = res.data.allPage
							// console.log(that.totalPage);
							// let datas = res.data.data
							// datas.map((item,index) => {
							// 	item.date = utils.formatTimes(new Date(item.MediaDate * 1000))
							// })
							console.log(res.data.data);
							console.log(res.data.data[0]);
							console.log(res.data.data[0].list);
							if(res.data.data[0].list){
								let specialList = res.data.data[0].list
								specialList.map((item,index) => {
									item.date = utils.formatTimes(new Date(item.MediaDate * 1000))
								})
								if(data.CurPage == 1){
									that.specialList = []
									// return
								}
								that.specialList = that.specialList.concat(specialList)
								that.page++;
								if(specialList.length == 0 || data.CurPage == res.data.allPage){
									that.status = 'noMore';
									return
								}
								that.status = 'more';
							} else {
								that.specialList = []
								that.status = 'noMore';
								
							}
							// that.specialList = res.data.data[0].list
						}
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.msg) 
				})
			},
			
			//加载更多
			setReachBottom() {
				if(that.totalPage >= that.page){
					that.status = 'loading'
					let val = {
						type: that.projectName,
						EventName: that.eventName,
						CurPage: that.page,
						PerNum: 20
					}
					that.getSpecial(val)
					// that.getArticle()
					return
				}
				that.status = 'noMore'
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
			// getLength(list,i){
			// 	list.map(item => {
			// 		if(item.children && item.children.length > 0){
			// 			that.getLength(item.children)
			// 		} else {
			// 			that.treeLen++
			// 		}
			// 	})
			// },
			treeOption(treeData){
				console.log(treeData)
				// that.treeLen = 0
				// that.getLength(treeData)
				// console.log(that.treeLen);
				// let treeCan = that.treeLen * 10
				
				let option = {
					tooltip: {
						trigger: 'item',
						triggerOn: 'click',
						positionStatus: true, // 自定义变量：是否防止tooltip超出画布
						formatter: '{b}'
					},
					series: [
						{
							type: 'tree',
							top: '10',
							left: '10',
							bottom: '10',
							right: '50',
							symbolSize: 7,
							label: {
								position: 'top',//标签的位置。
								// rotate: 20,
								verticalAlign: 'middle',
								align: 'left',
								fontSize: 9,
							},
							leaves: {
								label: {
									position: 'right',
									verticalAlign: 'middle',
									align: 'left',
									// formatter: function (value) {
									// 	// console.log(value);
									// 	var maxlength=5;
									// 	if (value.name.length>maxlength) {
									// 		return value.name.substring(0, maxlength-1)+'...';
									// 	} else{
									// 		return value.name;
									// 	};
									// },
								}
							},
							expandAndCollapse: false,
							animationDuration: 550,
							animationDurationUpdate: 750,
							data: treeData
						}
					]
				}
				console.log(option);
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
