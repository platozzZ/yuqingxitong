<template>
	<view class="">
		<view class="cu-card article">
			<view class="cu-item shadow">
				<view class="qiun-charts tree">
					<echarts :option="optionTree" class="charts chartstree"></echarts>
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
		optionTree: {
			type: Object,
			required: true
			// type: Array,
			// default: []
		}
	},
	mounted() {
		console.log(this.optionTree);
	}
}
</script>

<style scoped>
	
	.qiun-charts.tree{
		width: 100%;
		height: 2000upx;
		min-height: 2000upx;
		background-color: #FFFFFF;
	}
	.charts {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
	}
	
</style>
