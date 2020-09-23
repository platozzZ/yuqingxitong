<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<!-- <view class="cu-bar fixed" :style="style" :class="['bgRed',bgImage!=''?'none-bg text-white bg-img':'',bgColor]"> -->
			<view class="cu-bar fixed bg-red text-white" :style="style">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="action" v-else>
					<image src="../../static/logo.png" class="p-logo"></image>
					<!-- <slot name="backText"></slot> -->
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<view class="action" @tap="toggleSelector" v-if="!noMore">
					<text class="cuIcon-more text-xl"></text>
				</view>
				<view class="action" @tap="toggleAdd" v-if="hasAdd">
					<text class="cuIcon-favor text-xl" v-if="!favorFill"></text>
					<text class="cuIcon-favorfill text-xl" v-else></text>
				</view>
				<!-- <slot name="right"></slot> -->
			</view>
			<view class="mask" v-if="showSelector" @tap="toggleSelector" :style="[{top:CustomBar + 'px'}]">
				<view class="uni-combox__selector">
					<scroll-view scroll-y="true" class="uni-combox__selector-scroll">
						
						<view class="uni-combox__selector-item" v-for="(item,index) in moreData" :key="index" @tap="onSelectorClick(index)" >
							 <!-- @click="onSelectorClick(index)" -->
							<text>{{item.name}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	// var that
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				showSelector: false,
				// favorFill: false,
				moreData: [
					{name: '密码设置'},
					{name: '打开收藏'},
					
				]
			};
		},
		name: 'cu-custom',
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
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			noMore: {
				type: Boolean,
				default: false
			},
			hasAdd: {
				type: Boolean,
				default: false
			},
			favorFill: {
				type: Boolean,
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		mounted(){
			// that = this
			console.log(this.$props)
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			toggleSelector() {
				this.showSelector = !this.showSelector
			},
			toggleAdd(e) {
				console.log(e)
				// this.$props.favorFill = !this.$props.favorFill
				this.$emit("toggleAdd",{favorFill:this.$props.favorFill});
			},
			onSelectorClick(index) {
				console.log(this.showSelector)
				console.log(index)
				if(index == 0){
					uni.navigateTo({
						url: '../../pages/password/password'
					})
				} else {
					uni.navigateTo({
						url: '../../pages/collectList/collectList'
					})
				}
				this.showSelector == false
				console.log(this.showSelector)
				// this.$emit('input', this.inputVal)
			},
		}
	}
</script>

<style>
	.cu-custom .cu-bar{
		overflow: hidden;
	}
	.p-logo{
		width: 146rpx;
		height: 66rpx;
	}
	.mask{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		z-index: 9999;
		background: rgba(0,0,0,.4);
	}
	.uni-combox__selector {
		box-sizing: border-box;
		position: fixed;
		top: 45px;
		right: 20upx;
		width: 200upx;
		background-color: #FFFFFF;
		border-radius: 6px;
		box-shadow: #DDDDDD 4px 4px 8px, #DDDDDD -4px -4px 8px;
		z-index: 10000;
	}
	
	.uni-combox__selector-scroll {
		max-height: 200px;
		box-sizing: border-box;
	}
	
	.uni-combox__selector::before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border-bottom: solid 6px #FFFFFF;
		border-right: solid 6px transparent;
		border-left: solid 6px transparent;
		left: 170upx;
		top: -6px;
		margin-left: -6px;
	}
	
	.uni-combox__selector-empty,
	.uni-combox__selector-item {
		/* #ifdef APP-NVUE */
		display: flex;
		/* #endif */
		line-height: 36px;
		font-size: 14px;
		text-align: center;
		border-bottom: solid 1px #DDDDDD;
		margin: 0px 10px;
	}
	
	.uni-combox__selector-empty:last-child,
	.uni-combox__selector-item:last-child {
		border-bottom: none;
	}
</style>
