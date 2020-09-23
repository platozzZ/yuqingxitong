<template>
	<view class="">
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
	</view>
</template>

<script>
import echarts from '../echarts/echarts.vue';
export default {
	components: {
		echarts
	},
	data() {
		return {
			// trendOption: ''
		};
	},
	props: {
		platData: {
			type: Array,
			default: () => []
		},
		platOption: {
			type: Array,
			default: () => []
		},
	},
	mounted() {
		console.log(this.platData);
	}
}
</script>

<style scoped>
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
	
	.cu-card.article>.cu-item .title{
		color: #cc0000;
		font-size: 36upx;
	}
	.cu-card.article>.cu-item .title.text-blue{
		color: #0060BE;
	}
</style>
