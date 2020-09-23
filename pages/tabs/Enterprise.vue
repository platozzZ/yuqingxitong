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
			<!-- <view class="tab-content" v-if="TabCur == 0"> -->
				<view class="cu-card article">
					<view class="cu-item shadow" style="margin-top: 20upx">
						<view class="title text-center">
							企业领导人声量
						</view>
						<view class="qiun-charts">
							<echarts :option="option1" class="charts"></echarts>
						</view>
					</view>
				</view>
				<view class="cu-card article">
					<view class="cu-item shadow" style="margin-top: 0;">
						<view class="title text-center">
							企业领导人话题
						</view>
						<view class="padding-lr flex flex-direction">
							<view class="" :class="index == 0?'margin-0':'margin-top-sm'" v-for="(item,index) in topList" :key="index" >
								<view class="flex justify-between topitem margin-bottom-xs">
									<view class="flex-sub text-sm text-cut">
										{{item.Topic}}
									</view>
									<view class="margin-left-sm text-red">{{item.value}}</view>
								</view>
								
							</view>
						</view>
					</view>
				</view>
				<view class="cu-card article">
					<view class="cu-item shadow" style="margin-top: 0;">
						<view class="title text-center">
							 {{$config.brandall + '及竞品企业舆情声量排序'}}
						</view>
						<view class="qiun-charts">
							<echarts :option="option2" class="charts"></echarts>
						</view>
					</view>
				</view>
			<!-- </view> -->
		</view>
	</view>
</template>

<script>
	import echarts from "@/components/echarts/echarts.vue";
	var that;
	import { getEnterprise } from '@/utils/api.js'
	export default {
		components: {
			echarts
		},
		data() {
			return {
				tabList: [
					{
						id: "week",
						name: '周度排行',
					}, {
						id: "month",
						name: '月度排行',
					}
				],
				TabCur: 0,
				topList: [],
				hondaValue: '',
				option1: {},
				option2: {},
			}
		},
		mounted() {
			that = this;
			let data = {
				Period: 'week'
			}
			that.getEnterprise(data)
		},
		methods: {
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				// console.log(this.scrollLeftData)
				let target = e.currentTarget.dataset
				that.TabCur = target.id;
				let data = {
					Period: target.target
				}
				that.getEnterprise(data)
			},
			getEnterprise(data){
				uni.showLoading()
				getEnterprise(data).then(res => {
					console.log('getEnterprise',res)
					if(res.data.successCode == '1'){
						let art = res.data.data
						let xData1 = []
						let xData2 = []
						let seriesData1 = []
						let seriesData2 = []
						art.map((item,index) => {
							if(item.type == 'all'){
								item.MediaTypeList.map((itemm,indexm) => {
									xData1.push(itemm)
									item.List.map((iteml,indexl) => {
										if(itemm == iteml.Leader){
											seriesData1.push(iteml.value)
										}
									})
								})
							}
							if(item.type == 'Topic'){
								that.topList = item.List
							}
							if(item.type == 'EnterpriseVolume'){
								let list1 = that.deepCopy(item.list)
								list1 = list1.sort(that.compare('value'));
								console.log(list1)
								list1.map((iteml,indexl) => {
									if(iteml.Enterprise == '广汽本田'){
										that.hondaValue = item.value
										// iteml.value = {
										// 	value: iteml.value,
										// 	itemStyle: {
										// 		color: '#cc0000',
										// 	}
										// }
									}
									xData2.push(iteml.Enterprise)
									seriesData2.push(iteml.value)
								})
							}
						})
						that.setOption(0,xData1,seriesData1)
						that.setOption(1,xData2,seriesData2)
					} else {
						that.showToast(res.data.msg) 
					}
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.msg) 
				})
			},
			compare(arg) {
			    return function(a, b) {
			        return b[arg] - a[arg];
			    }
			},
			deepCopy(obj) {
			    let tmp = JSON.stringify(obj); 
			    let result = JSON.parse(tmp); 
			    return result;
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
			setOption(index,xData,seriesData){
				let option = {
					backgroundColor: '#fff',
					tooltip: {
						show: index == 0? false : true,
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
						left: index == 0?'20' : '48',
						right: "20",
						bottom: index == 0?'20' : '35',
						top: "20",
						containLabel: false
					},
					xAxis: [{
						type: "category",
						axisLabel: {
							fontSize: 10,
							rotate: index == 0?'0' : '35'
						},
						data: xData
					}],
					yAxis: [{
						show: index == 0?false : true,
						type: "value",
						axisLabel: {
							formatter: function(v){
								return  that.tranNumber(v);
							}
						}
					}],
					series: [{
						label: {
							show: index == 0?true : false,
							position: 'top',
							color: '#cc0000',
						},
						barMaxWidth: 40,
						itemStyle: {
							color: index == 0?'#cc0000' : function(params){
								// console.log(params)
				                var c ='';
				                if(params.name == '广汽本田'){
				                    c='#cc0000'
				                }else{
				                    c='#8799a3'
				                }
				                return c;
				            }
						},
						name: "声量",
						type: "bar",
						data: seriesData
					}],
				}
				if(index == 0){
					that.option1 = option
				} else {
					that.option2 = option
				}
				// return option
			},
			
		}
	}
</script>

<style>
	.cu-card.article>.cu-item .title{
		color: #cc0000;
		font-size: 36upx;
	}
	.topitem{
		height: 40upx;
		line-height: 40upx;
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
