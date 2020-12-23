<template>
	<view class="">
		<view class="padding-top-sm">
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
	import { getPlat } from '@/utils/api.js'
	export default {
		components: {
			echarts
		},
		data() {
			return {
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
				dropItemIndex: [0,0],
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
					type: 'GetPlat',
					ProjectName: 'PlatForm',
					Period: 'ThisWeek',
					Para: 'ALL',
					DiaoXing: 'ALL',
					BeginDate: '',
					EndDate: '',
				},
			}
		},
		mounted() {
			that = this;
			that.getPlat(that.queryForm)
		},
		methods: {
			tagClick(index){
				that.tagIndex = index
				that.pickerStar = ''
				that.pickerEnd = ''
			},
			handleTime(e){
				let time = that.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd')
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
					that.queryForm.type = 'GetPlat'
					that.queryForm.Period = that.dropOption[0][that.tagIndex].value
					that.queryForm.BeginDate = ''
					that.queryForm.EndDate = ''
				} else {
					that.queryForm.type = 'GetPlatS'
					that.queryForm.Period = ''
					that.queryForm.BeginDate = that.pickerStar
					that.queryForm.EndDate = that.pickerEnd
				}
				console.log(that.queryForm)
				that.getTrend(that.queryForm)
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
					that.queryForm.type = 'GetPlat'
					that.queryForm.Period = that.dropOption[0][that.tagIndex].value
					that.queryForm.BeginDate = ''
					that.queryForm.EndDate = ''
				} else {
					that.queryForm.type = 'GetPlatS'
					that.queryForm.Period = ''
					that.queryForm.BeginDate = that.pickerStar
					that.queryForm.EndDate = that.pickerEnd
				}
				console.log(that.queryForm)
				that.getPlat(that.queryForm)
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			openDropdown(index){
				console.log(index);
				that.dropIndex = index
			},
			getPlat(data){
				that.$u.post('/ashx/Trend/Trend.ashx',data).then(res => {
					console.log('getPlat',res);
					that.platData = res.data.data
					that.options(res.data.data)
				}).catch(err => {
					console.log('getPlat-catch', err);
				});
				// uni.showLoading()
				// getPlat(data).then(res => {
				// 	uni.hideLoading()
				// 	console.log('getPlat',res)
				// 	if(res.data.successCode == '1'){
						
				// 		that.platData = res.data.data
				// 		that.options(res.data.data)
				// 	} else {
				// 		that.showToast(res.data.msg) 
				// 	}
				// }).catch(err => {
				// 	uni.hideLoading()
				// 	console.log(err)
				// 	that.showToast(err.msg) 
				// })
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
