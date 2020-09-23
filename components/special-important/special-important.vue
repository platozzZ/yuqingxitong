<template>
	<view class="">
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
		importantData: {
			type: Array,
			default: () => []
		},
		importantOption: {
			type: Object,
			required: true
		},
		
	},
	mounted() {
		console.log(this.importantData);
		console.log(this.importantOption);
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
