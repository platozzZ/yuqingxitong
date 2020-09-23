<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<!-- <view class="cu-bar fixed" :style="style" :class="['bgRed',bgImage!=''?'none-bg text-white bg-img':'',bgColor]"> -->
			<view class="cu-bar fixed bg-red text-white" :style="style">
				<view class="action" @tap="BackPage">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			};
		},
		name: 'cu-custom2',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			
		}
	}
</script>

<style>
	
</style>
