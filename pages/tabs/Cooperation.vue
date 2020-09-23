<template>
	<view class="">
		<view class="padding-top-sm">
			<view class=" flex justify-center">
				<view class="main-capsule text-xs flex justify-center text-df">
					<view class="main-capsule-item" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.id" :data-type="item.type">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="topic-content margin-sm" v-if="TabCur == '0'">
				<view class="coop-title bg-red flex justify-around align-center text-sm text-center">
					<view class="coop-item coop-item-index solid-right flex flex-direction align-center justify-center">
						<view class="">正面声量</view>
						<view class="">排名</view>
					</view>
					<view class="coop-item coop-item-name solid-right">
						媒体名称
					</view>
					<view class="coop-item coop-item-num solid-right flex flex-direction align-center justify-center">
						<view class="">传播量累计</view>
						<view class="">(原发+转载)</view>
					</view>
					<view class="coop-item coop-item-type">
						纯友好媒体
					</view>
				</view>
				<view class="coop-list flex justify-around align-center text-sm text-red text-center solid-left" v-for="(item,index) in goodList" :key="'c' + index">
					<view class="coop-item coop-item-index solid-right solid-bottom text-black">
						{{index + 1}}
					</view>
					<view class="coop-item coop-item-name solid-right solid-bottom ">
						<view class="response text-cut">{{item.Media}}</view>
					</view>
					<view class="coop-item coop-item-num solid-right solid-bottom">
						{{item.nums}}
					</view>
					<view class="coop-item coop-item-type solid-right solid-bottom">
						<text class="cuIcon-favorfill" v-if="item.star == '0'"></text>
					</view>
				</view>
			</view>
			<view class="topic-content margin-sm" v-else>
				<view class="coop-title bg-blue flex justify-around align-center text-sm text-center">
					<view class="coop-item coop-item-index solid-right flex flex-direction align-center justify-center">
						<view class="">负面声量</view>
						<view class="">排名</view>
					</view>
					<view class="coop-item coop-item-name solid-right">
						媒体名称
					</view>
					<view class="coop-item coop-item-num solid-right flex flex-direction align-center justify-center">
						<view class="">不友好声量累计</view>
						<view class="">(原发+转载)</view>
					</view>
					<view class="coop-item coop-item-type">
						正面传播量
					</view>
				</view>
				<view class="coop-list flex justify-around align-center text-sm text-blue text-center solid-left" v-for="(item,index) in badList" :key="'n' + index">
					<view class="coop-item coop-item-index solid-right solid-bottom text-black">
						{{index + 1}}
					</view>
					<view class="coop-item coop-item-name solid-right solid-bottom ">
						<view class="response text-cut">{{item.Media}}</view>
					</view>
					<view class="coop-item coop-item-num solid-right solid-bottom">
						{{item.BadNums}}
					</view>
					<view class="coop-item coop-item-type solid-right solid-bottom text-red">
						{{item.goodnums}}
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	var that;
	import { getMediaList } from '@/utils/api.js'
	export default {
		data() {
			return {
				tabList: [
					{
						id: "y",
						name: '友好媒体TOP30',
					}, {
						id: "n",
						name: '不友好媒体TOP30',
					}
				],
				TabCur: 0,
				goodList: [],
				badList: [],
			}
		},
		mounted() {
			that = this;
			that.getMediaList()
		},
		methods: {
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				// console.log(this.scrollLeftData)
				that.TabCur = e.currentTarget.dataset.id;
			},
			getMediaList(){
				uni.showLoading()
				getMediaList().then(res => {
					console.log('getMediaList',res)
					if(res.data.successCode == '1'){
						uni.hideLoading()
						let art = res.data.data
						art.map((item,index) => {
							if(item.type == 'FriendGood'){
								that.goodList = item.List
							} else if(item.type == 'FriendBad'){
								that.badList = item.List
							}
						})
						// that.list = res.data.data
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					console.log(err)
					that.showToast(err.msg) 
				})
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
	.coop-title .coop-item{
		height: 80upx;
		line-height: 80upx;
	}
	.coop-title .coop-item view{
		line-height: 32upx;
	}
	.coop-item-index{
		width: 16%;
	}
	.coop-item-name{
		width: 34%;
	}
	.coop-item-num{
		width: 28%;
	}
	.coop-item-type{
		width: 22%;
	}
	.coop-title .coop-item.solid-right::after{
		border-right: 1upx solid #fff;
	}
	.coop-list .coop-item{
		height: 50upx;
		line-height: 50upx;
	}
	.coop-list.solid-left::after{
		border-left: 1upx solid #cc0000;
	}
	.coop-list.text-blue.solid-left::after{
		border-left: 1upx solid #0060BE;
	}
	
	.coop-list .coop-item.solid-right::after{
		border-right: 1upx solid #cc0000;
	}
	.coop-list .coop-item.solid-bottom::after{
		border-bottom: 1upx solid #cc0000;
	}
	.coop-list.text-blue .coop-item.solid-right::after{
		border-right: 1upx solid #0060BE;
	}
	.coop-list.text-blue .coop-item.solid-bottom::after{
		border-bottom: 1upx solid #0060BE;
	}
	.coop-list:nth-child(even){
		background: #e7ebed;
	}
	
	.cu-list.menu>.cu-item .content{
		width: calc(100% - 220upx);
	}
	.cu-list.menu>.cu-item .action{
		min-width: 50upx;
	}
	.solid-bottom::after{
		border-bottom-width: 2upx;
	}
</style>
