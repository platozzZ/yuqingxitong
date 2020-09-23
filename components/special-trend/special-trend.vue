<template>
	<view class="">
		<view class="cu-card article">
			<view class="cu-item shadow">
				<view class="qiun-charts">
					<echarts :option="trendOption" class="charts"></echarts>
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
		trendOption: {
			type: Object,
			required: true
		}
	},
	mounted() {
		console.log(this.trendOption);
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
	
</style>
