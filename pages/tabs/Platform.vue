<template>
	<view class="">
		<view class="padding-top-sm">
			<!-- <view class=" flex justify-center">
				<view class="main-capsule text-xs flex justify-center text-df">
					<view class="main-capsule-item" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.id" :data-type="item.type">
						{{item.name}}
					</view>
				</view>
			</view> -->
			
			<u-dropdown :close-on-click-mask="mask" ref="uDropdown" :borderBottom="borderBottom" height="50" @open="openDropdown">
				<u-dropdown-item @change="change" :value="dropOption[0][dropItemIndex[0]].value" :title="dropOption[0][dropItemIndex[0]].label" :options="dropOption[0]"></u-dropdown-item>
				<u-dropdown-item @change="change" :value="dropOption[1][dropItemIndex[1]].value" :title="dropOption[1][dropItemIndex[1]].label" :options="dropOption[1]"></u-dropdown-item>
			</u-dropdown>
			<!-- <view class="tab-content" v-if="TabCur == 0"> -->
				<view class="cu-card article" v-for="(item,index) in platData" :key="index">
					<view class="cu-item shadow">
						<view class="title">
							{{item.type == 'all'? $config.brand + '各平台声量':item.type + 'TOP10'}}
						</view>
						<view class="qiun-charts">
							<echarts :option="option[index]" class="charts"></echarts>
						</view>
					</view>
				</view>
				<!-- <view class="cu-card article">
					<view class="cu-item shadow" style="margin-top: 0;">
						<view class="title">
							APP平台对广本的声量TOP10
						</view>
						<view class="qiun-charts">
							<echarts :option="option" class="charts"></echarts>
						</view>
					</view>
				</view>
				<view class="cu-card article">
					<view class="cu-item shadow" style="margin-top: 0;">
						<view class="title">
							自媒体对广本的声量TOP10
						</view>
						<view class="qiun-charts">
							<echarts :option="option" class="charts"></echarts>
						</view>
					</view>
				</view> -->
			<!-- </view> -->
		</view>
	</view>
</template>

<script>
	import echarts from "@/components/echarts/echarts.vue";
	var that;
	import { getPlat } from '@/utils/api.js'
	export default {
		components: {
			echarts
		},
		data() {
			return {
				tabList: [
					{
						id: "week",
						name: '本周排行',
					}, {
						id: "month",
						name: '本月排行',
					}
				],
				TabCur: 0,
				option: [],
				platData: [],
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
			let data = {
				Period: 'ThisWeek',
				Para: 'ALL',
			}
			that.getPlat(data)
		},
		methods: {
			tabSelect(e) {
				let target = e.currentTarget.dataset
				console.log(e.currentTarget.dataset)
				// console.log(this.scrollLeftData)
				that.TabCur = target.id;
				that.getPlat(target.target)
			},
			change(value,index) {
				console.log(value);
				console.log(index);
				// that.dropItemIndex = that.dropItemIndex
				that.$set(that.dropItemIndex,that.dropIndex,index)
				console.log(that.dropItemIndex);
				let data = {
					Period: that.dropOption[0][that.dropItemIndex[0]].value,
					Para: that.dropOption[1][that.dropItemIndex[1]].value
				}
				that.getPlat(data)
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			openDropdown(index){
				console.log(index);
				that.dropIndex = index
			},
			getPlat(data){
				uni.showLoading()
				getPlat(data).then(res => {
					uni.hideLoading()
					console.log('getPlat',res)
					if(res.data.successCode == '1'){
						
						that.platData = res.data.data
						that.options(res.data.data)
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.msg) 
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
					item.List.map((itemm,indexm) => {
						xData.push(itemm.Media)
						seriesData.push(itemm.value)
						// seriesData.push({
						// 	name: itemm.Media,
						// 	barMaxWidth: 40,
						// 	type: "bar",
						// 	data: itemm.value
						// })
					})
					
					option.push(that.setOption(index,xData,seriesData))
				})
				console.log(option)
				that.option = option
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
						bottom: index == 0?'30':'50',
						top: "10",
						containLabel: false
					},
					xAxis: {
						type: "category",
						axisLabel: {
							fontSize: 10,
							rotate: 30
							// rotate: index == 0?0:30
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
						// label: {
						// 	show: true,
						// 	position: 'top',
						// 	color: '#2a5caa'
						// },
						// itemStyle: {
						// 	color: '#2a5caa'
						// },
						name: "声量",
						barMaxWidth: 40,
						type: "bar",
						data: seriesData
					}]
				}
				return option
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
			
		}
	}
</script>

<style>
	
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
