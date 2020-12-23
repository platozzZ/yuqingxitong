<template>
	<view>
		<view class="bg-white padding-top-sm">
			<u-dropdown :close-on-click-mask="mask" ref="uDropdown" :borderBottom="borderBottom" height="50" @open="openDropdown">
				<!-- @change="change" :value="dropOption[0][dropItemIndex[0]].value" :options="dropOption[0]" -->
				<u-dropdown-item :title="tagIndex == null?'其他':dropOption[0][tagIndex].label">
					<view class="slot-content">
						<view class="item-box">
							<view class="item" :class="index == tagIndex ? 'active' : ''" @tap="tagClick(index)" v-for="(item, index) in dropOption[0]" :key="index">
								{{item.label}}
							</view>
						</view>
						<view class="custom-container flex align-center u-m-b-50">
							自定义时间：
							<view class="flex-sub">
								<view class="custom-time u-m-b-30">
									<u-input v-model="pickerStar" :custom-style="customStyle" type="select" height="60" placeholder="请选择开始时间" :border="true" @click="handleTime('star')" />
								</view>
								<!-- <view class="margin-tb-sm">至</view> -->
								<view class="custom-time">
									<u-input v-model="pickerEnd" :custom-style="customStyle" type="select" height="60" placeholder="请选择截止时间" :border="true" @click="handleTime('end')" />
								</view>
							</view>
						</view>
						<u-button type="error" @click="handleClick">确定</u-button>
					</view>
					
				</u-dropdown-item>
				<u-dropdown-item @change="change" :value="dropOption[1][dropItemIndex[1]].value" :title="dropOption[1][dropItemIndex[1]].label" :options="dropOption[1]"></u-dropdown-item>
				<u-dropdown-item @change="change" :value="dropOption[2][dropItemIndex[2]].value" :title="dropOption[2][dropItemIndex[2]].label" :options="dropOption[2]"></u-dropdown-item>
			</u-dropdown>
			<view class="" v-if="showChart">			
				<view class="" v-for="(item,index) in volDatas" :key="index">
					<view class="margin-top-sm text-center text-xl text-red bg-white">
						{{item.type == 'all'? $config.brand + '各车型舆情声量':item.type + '及竞品声量比较'}}
					</view>
					<view class="qiun-charts">
						<echarts :option="option[index]" class="charts"></echarts>
					</view>
				</view>
			</view>
			
		</view>
		<u-picker
			v-model="pickerShow"
			:default-time="defaultTime"
			:start-year="starTime"
			:end-year="endTime"
			:params="params"
			@confirm="pickerConfirm"
		></u-picker>
	</view>
</template>

<script>
	import echarts from "@/components/echarts/echarts.vue";
	var that;
	export default {
		components: {
			echarts
		},
		data() {
			return {
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
					[
						{
							label: '全部',
							value: 'ALL',
						},
						{
							label: '正面',
							value: '0',
						},
						{
							label: '负面',
							value: '1',
						},
						// {
						// 	label: '其他',
						// 	value: '2',
						// },
					],
				],
				borderBottom: false,
				activeColor: '#fff',
				inactiveColor: '#cc0000',
				dropIndex: null,
				dropItemIndex: [0,0,0],
				tagIndex: 0,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				pickerShow: false,
				defaultTime: '',
				pickerType: '',
				pickerStar: '',
				pickerEnd: '',
				customStyle: {
					fontSize: '26rpx'
				},
				queryForm: {
					type: 'GetVolume',
					Period: 'ThisWeek',
					Para: 'ALL',
					DiaoXing: 'ALL',
					BeginDate: '',
					EndDate: '',
				},
				// carData: {}
			}
		},
		mounted() {
			that = this
			that.getVol(that.queryForm)
			// that.carData = that.$config
		},
		methods: {
			tagClick(index){
				that.tagIndex = index
				that.pickerStar = ''
				that.pickerEnd = ''
			},
			handleTime(e){
				let time = that.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd')
				// console.log(time)
				if(e == 'star'){
					if(!that.pickerStar){
						that.defaultTime = time + ' 00:00:00'
					} else {
						that.defaultTime = that.pickerStar
					}
				} else {
					if(!that.pickerEnd){
						that.defaultTime = time + ' 23:59:59'
					} else {
						that.defaultTime = that.pickerEnd 
					}
				}
					console.log(that.defaultTime);
				that.pickerShow = true
				that.pickerType = e
			},
			pickerConfirm(e){
				that.tagIndex = null
				let time = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':' + e.second
				if(that.pickerType == 'star'){
					if(!!that.pickerEnd && time > that.pickerEnd){
						that.showToast('开始时间不能大于结束时间')
						return
					}
					that.pickerStar = time
					return
				}
				if(!!that.pickerStar && time < that.pickerStar){
					that.showToast('结束时间不能小于开始时间')
					return
				}
				that.pickerEnd = time
			},
			handleClick(){
				// that.queryForm.Para = that.dropOption[1][that.dropItemIndex[1]].value
				// that.queryForm.DiaoXing = that.dropOption[2][that.dropItemIndex[2]].value
				if(!that.pickerStar && !that.pickerEnd){
					that.queryForm.type = 'GetVolume'
					that.queryForm.Period = that.dropOption[0][that.tagIndex].value
					that.queryForm.BeginDate = ''
					that.queryForm.EndDate = ''
				} else {
					that.queryForm.type = 'GetVolumeS'
					that.queryForm.Period = ''
					that.queryForm.BeginDate = that.pickerStar
					that.queryForm.EndDate = that.pickerEnd
				}
				console.log(that.queryForm)
				that.getVol(that.queryForm)
				that.closeDropdown()
			},
			change(value,index) {
				console.log(value);
				console.log(index);
				// that.dropItemIndex = that.dropItemIndex
				that.$set(that.dropItemIndex,that.dropIndex,index)
				console.log(that.dropItemIndex);
				that.queryForm.Para = that.dropOption[1][that.dropItemIndex[1]].value
				that.queryForm.DiaoXing = that.dropOption[2][that.dropItemIndex[2]].value
				if(!that.pickerStar && !that.pickerEnd){
					that.queryForm.type = 'GetVolume'
					that.queryForm.Period = that.dropOption[0][that.tagIndex].value
					that.queryForm.BeginDate = ''
					that.queryForm.EndDate = ''
				} else {
					that.queryForm.type = 'GetVolumeS'
					that.queryForm.Period = ''
					that.queryForm.BeginDate = that.pickerStar
					that.queryForm.EndDate = that.pickerEnd
				}
				console.log(that.queryForm)
				that.getVol(that.queryForm)
				// let data = {
				// 	Period: that.dropOption[0][that.dropItemIndex[0]].value,
				// 	Para: that.dropOption[1][that.dropItemIndex[1]].value
				// }
				// that.getVol(data)
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			openDropdown(index){
				console.log(index);
				that.dropIndex = index
			},
			getVol(data){
				console.log('getVol-data',data)
				that.showChart = false
				that.$u.post('/ashx/Volume/Volume.ashx',data).then(res => {
					console.log('getVol',res);
					that.showChart = true
					that.volDatas = res
					that.option = new Array(res.length)
					that.options(res)
				}).catch(err => {
					console.log('getTrend-catch', err);
				});
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
				let option = {
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
<style lang="scss" scoped>
$color-primary: #cc0000;
.slot-content {
	background-color: #FFFFFF;
	padding: 24rpx;
	
	.item-box {
		margin-bottom: 30rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.item {
			border: 1px solid $color-primary;
			color: $color-primary;
			padding: 4rpx 30rpx;
			border-radius: 8rpx;
			margin-top: 30rpx;
			font-size: 26rpx;
		}
		
		.active {
			color: #FFFFFF;
			background-color: $color-primary;
		}
	}
	.custom-container{
		font-size: 26rpx;
		.custom-time{
			flex: 1;
		}
	}
}
</style>
