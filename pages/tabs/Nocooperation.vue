<template>
	<view class="">
		<view class="padding-top-sm">
			<view class=" flex justify-center">
				<view class="main-capsule text-xs flex justify-center text-df">
					<view class="main-capsule-item" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.id" :data-type="item.type">
						{{item.name}}
						<text class="margin-left-sm toogle-change" @click.stop="toogleChange(index)">(...)</text>
						
					</view>
				</view>
			</view>
			<view class="slot-content" :style="{ width: slotWidth + 'px', left: slotLeft + 'px'}" v-show="showSlotContent">
				<view class="item-box">
					<view class="item flex align-center justify-between" :class="[item.active ? 'active' : '']" @tap="tagClick(index)" v-for="(item, index) in list" :key="index">
						{{item.label}}
						<text class="slot-icon" :class="item.active ? 'cuIcon-squarecheckfill text-blue' : 'cuIcon-square'"></text>
					</view>
				</view>
				<button class="cu-btn bg-red sm slot-btn" @click="slotBtnClick">确定</button>
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
	import { getMediaNoList } from '@/utils/api.js'
	export default {
		data() {
			return {
				tabList: [
					{
						id: "y",
						name: '友好媒体TOP50',
					}, {
						id: "n",
						name: '不友好媒体TOP50',
					}
				],
				TabCur: 0,
				goodList: [],
				badList: [],
				list: [{
						label: '一月',
						active: false,
					},
					{
						label: '二月',
						active: false,
					},
					{
						label: '三月',
						active: false,
					},
					{
						label: '四月',
						active: false,
					},
					{
						label: '五月',
						active: false,
					},
					{
						label: '六月',
						active: false,
					},
					{
						label: '七月',
						active: false,
					},
					{
						label: '八月',
						active: false,
					},
					{
						label: '九月',
						active: false,
					},
					{
						label: '十月',
						active: false,
					},
					{
						label: '十一月',
						active: false,
					},
					{
						label: '十二月',
						active: false,
					}
				],
				slotWidth: 0,
				slotTop: 0,
				slotLeft: 0,
				slotDisplay: 'none',
				showSlotContent: false,
			}
		},
		mounted() {
			that = this;
			that.getMediaNoList()
		},
		methods: {
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				// console.log(this.scrollLeftData)
				// that.setStyle(e.currentTarget.dataset.id)
				that.TabCur = e.currentTarget.dataset.id;
				that.showSlotContent = false
			},
			tagClick(index) {
				this.list[index].active = !this.list[index].active;
			},
			slotBtnClick(){
				let { list, slotDisplay } = that
				let thisYear = that.$u.timeFormat(this.timestamp, 'yyyy');
				console.log(that.$u.timeFormat(this.timestamp, 'yyyy'));
				let data = []
				list.map((item,index) => {
					if(item.active){
						data.push(thisYear + '-' +that.formatNumber(index+ 1))
					}
				})
				console.log(data);
				let datas = JSON.stringify(data)
				console.log(datas);
				console.log('that.getMediaList(datas)');
				that.getMediaNoList({sWhereSQL:datas})
				
				that.showSlotContent = false
			},
			formatNumber(n){
			  n = n.toString()
			  return n[1] ? n : '0' + n
			},
			toogleChange(e){
				console.log(e);
				// if(that.showSlotContent){
				// 	that.showSlotContent = false
				// 	return
				// }
				// if(that.TabCur == e){
				// 	that.showSlotContent = !that.showSlotContent
				// 	return
				// }
				// that.$refs['date' + e].$el.style.display = 'block'
				if(that.TabCur != e){
					let { list } = that
					list.map((item,index) => {
						item.active = false
					})
					that.list = list
				}
				that.setStyle(e)
				that.TabCur = e
			},
			setStyle(index){
				const query = uni.createSelectorQuery().in(this).select('.main-capsule-item');
				uni.createSelectorQuery().selectAll('.main-capsule-item').boundingClientRect(res => {
				    console.log('reac', res)
				    that.slotWidth = res[index].width
				    // that.slotTop = res[e].top + 
				    that.slotLeft = res[index].left
				    // that.slotDisplay = 'block'
					if(that.TabCur == index){
						that.showSlotContent = !that.showSlotContent
						return
					}
					that.showSlotContent = true
				}).exec()
			},
			getMediaNoList(data){
				console.log(data);
				uni.showLoading()
				getMediaNoList(data).then(res => {
					console.log('getMediaNoList',res)
					if(res.data.successCode == '1'){
						uni.hideLoading()
						let art = res.data.data
						art.map((item,index) => {
							if(item.type == 'NonFriendGood'){
								that.goodList = item.List
							} else if(item.type == 'NonFriendBad'){
								that.badList = item.List
							}
						})
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
</style>
<style lang="scss">
	.slot-content {
		background-color: #FFFFFF;
		padding: 24rpx;
		position: absolute;
		z-index: 1;
		transition: all 0.05s ease-in-out 0s;
		// display: flex;
		.item-box {
			margin-bottom: 20rpx;
			display: flex;
			flex-direction: column;
			// flex-wrap: wrap;
			// justify-content: space-between;
			
			.item {
				padding: 10rpx 0;
				// border: 1px solid $u-type-primary;
				// color: $u-type-primary;
				// padding: 8rpx 40rpx;
				// border-radius: 100rpx;
				// margin-top: 30rpx;
			}
			
			.active {
				.slot-icon{
					color: #cc0000;
				}
				
				// color: #FFFFFF;
				// background-color: $u-type-primary;
			}
		}
		.slot-btn{
			width: 100%;
		}
	}
</style>