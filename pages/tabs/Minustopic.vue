<template>
	<view class="">
		<view class="padding-top-sm">
			<view class=" flex justify-center">
				<view class="main-capsule text-xs flex justify-center text-df">
					<view
						class="main-capsule-item" 
						:class="index==TabCur?' cur':''" 
						v-for="(item,index) in tabList" 
						:key="index" 
						@tap="tabSelect" 
						:data-index="index" 
						:data-period="item.period" 
						:data-type="item.type"
						:data-name="item.projectname"
					>
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="topic-content  margin-bottom-sm" v-if="tabType == 'p'">
				<view class="" v-for="(item,index) in topicData" :key="'p' + index">
					<view class="cu-bar bg-white solid-bottom text-blue text-bold margin-top-sm flex justify-between align-center">
						<view class="action text-blue">
							<text class="cuIcon-title"></text> 
							{{item.type == 'all'? $config.brand + '全车型新闻舆情重点话题TOP10':item.type + '新闻舆情重点话题TOP10'}}
						</view>
						<view class="text-blue">
							（篇）
						</view>
					</view>
					<view class="cu-list menu sm-border">
						<view class="cu-item" v-for="(iteml,indexl) in item.mediaList" :key="'p' + index + indexl">
							<view class="content">
								<view class="response">
									<text class="text-cut">{{iteml.Title}}</text>
								</view>
							</view>
							<view class="action text-right text-blue">
								{{iteml.Article_ID}}
							</view>
						</view>
					</view>	
				</view>
				
			</view>
			<view class="topic-content margin-sm" v-if="tabType == 'u'">
				<view class="" v-for="(item,index) in topicData" :key="'u' + index">
					<view class="text-blue text-xl margin-top margin-bottom-sm text-center">
						{{item.type == 'all'? $config.brand + '全车型新闻舆情重点话题TOP10':item.type + '新闻舆情重点话题TOP10'}}
					</view>
					<view class="coop-title bg-blue flex justify-around align-center text-xs text-center">
						<view class="coop-item coop-item-index solid-right">
							标题
						</view>
						<view class="coop-item coop-item-name solid-right">
							点击量
						</view>
						<view class="coop-item coop-item-num solid-right">
							回复量
						</view>
						<view class="coop-item coop-item-type">
							论坛平台
						</view>
					</view>
					<view class="coop-list flex justify-around align-center text-xs text-blue text-center solid-left" v-for="(iteml,indexl) in item.mediaList" :key="'u' + index + indexl">
						<view class="coop-item coop-item-index solid-right solid-bottom text-black">
							<view class="response text-cut">
								{{iteml.Title}}
							</view> 
						</view>
						<view class="coop-item coop-item-name solid-right solid-bottom ">
							<view class="response text-cut">{{iteml.ClickCount}}</view>
						</view>
						<view class="coop-item coop-item-num solid-right solid-bottom">
							<view class="response text-cut">
								{{iteml.ReplyCount}}
							</view> 
						</view>
						<view class="coop-item coop-item-type solid-right solid-bottom">
							<view class="response text-cut">
								{{iteml.Media}}
							</view> 
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var that;
	import { getTopic } from '@/utils/api.js'
	export default {
		data() {
			return {
				tabList: [
					{
						period: "week",
						name: '本周PGC',
						type: "p",
						projectname: 'TopicBadPGC'
					}, {
						period: "month",
						name: '本月PGC',
						type: "p",
						projectname: 'TopicBadPGC'
					}, {
						period: "week",
						name: '本周UGC',
						type: "u",
						projectname: 'TopicBadUGC'
					}, {
						period: "month",
						name: '本月UGC',
						type: "u",
						projectname: 'TopicBadUGC'
					}
					// {
					// 	period: "week",
					// 	name: 'P周话题',
					// 	type: "p",
					// 	projectname: 'TopicBadPGC'
					// }, {
					// 	period: "month",
					// 	name: 'P月话题',
					// 	type: "p",
					// 	projectname: 'TopicBadPGC'
					// }, {
					// 	period: "week",
					// 	name: 'U周话题',
					// 	type: "u",
					// 	projectname: 'TopicBadUGC'
					// }, {
					// 	period: "month",
					// 	name: 'U月话题',
					// 	type: "u",
					// 	projectname: 'TopicBadUGC'
					// }
				],
				TabCur: 0,
				tabType: 'p',
				topicData: [],
			}
		},
		mounted() {
			that = this;
			let data = {
				ProjectName: 'TopicBadPGC',
				Period: 'week'
			}
			that.getTopic(data)
		},
		methods: {
			tabSelect(e) {
				let target = e.currentTarget.dataset
				console.log(target)
				that.TabCur = target.index;
				that.tabType = target.type
				that.topicData = []
				let data = {
					ProjectName: target.name,
					Period: target.period
				}
				that.getTopic(data)
			},
			getTopic(data){
				uni.showLoading()
				getTopic(data).then(res => {
					uni.hideLoading()
					console.log(data)
					console.log('getTopic',res)
					if(res.data.successCode == '1'){
						that.topicData = res.data.data
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(res.data.msg) 
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
		width: 42%;
	}
	.coop-item-name{
		width: 20%;
	}
	.coop-item-num{
		width: 16%;
	}
	.coop-item-type{
		width: 22%;
	}
	.coop-title .coop-item.solid-right::after{
		border-right: 2upx solid #fff;
	}
	.coop-list .coop-item{
		height: 50upx;
		line-height: 50upx;
		/* overflow: hidden; */
	}
	.coop-list.solid-left::after{
		border-left: 2upx solid #cc0000;
	}
	.coop-list.text-blue.solid-left::after{
		border-left: 2upx solid #0060BE;
	}
	
	.coop-list .coop-item.solid-right::after{
		border-right: 2upx solid #cc0000;
	}
	.coop-list .coop-item.solid-bottom::after{
		border-bottom: 2upx solid #cc0000;
	}
	.coop-list.text-blue .coop-item.solid-right::after{
		border-right: 2upx solid #0060BE;
	}
	.coop-list.text-blue .coop-item.solid-bottom::after{
		border-bottom: 2upx solid #0060BE;
	}
	.coop-list:nth-child(even){
		background: #e7ebed;
	}
	.coop-list:nth-child(odd){
		background: #fff;
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
	/* 
	.cu-list.menu>.cu-item .content{
		width: calc(100% - 220upx);
	}
	.cu-list.menu>.cu-item .action{
		min-width: 50upx;
	}
	.solid-bottom::after{
		border-bottom-width: 2upx;
	} */
</style>
