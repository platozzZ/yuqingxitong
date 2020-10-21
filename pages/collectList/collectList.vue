<template>
	<view class="">
		<cu-custom :isBack="true" :noMore="true"><block slot="content">智能舆情系统</block></cu-custom>
		<view class="top-list">
			
			<!-- <view class="cu-list flex text-center justify-between bg-white padding-lr-sm" >
				<view class="cu-item  padding-tb-sm" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.type">{{item.name}}</view>
			</view> -->
		</view>
		<view class="cu-bar search">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="请输入您想要的关键词搜索吧" confirm-type="search" v-model="searchData"></input>
			</view>
			<view class="action">
				<button class="cu-btn shadow-blur round bg-white" @tap="searchArticle">搜索</button>
			</view>
		</view>
		<view class="">
			<view class="cu-list menu sm-border">
				<view 
					class="cu-item " 
					:class="item.ProjectName == 0?'text-red':'text-blue'"
					@tap.stop="toInfo(item)"
					hover-class="cur"
					v-for="(item,index) in infoList"
					:key="index"
				>
					<view class="content padding-tb-sm response">
						<view class="">
							<text class="text-cut">{{item.Title}}</text>
						</view>
						<view class=" text-sm">
							| <text class="margin-lr-xs">{{item.Media}}</text>
							| <text class="margin-lr-xs">{{item.MediaDate}}</text>
						</view>
					</view>
					<view class="action padding-left-sm" @click.stop="removeBookMark(item.Article_ID,index)" :data-id="item.Article_ID">
						<button class="cu-btn sm icon text-xxl" :class="item.ProjectName == 0?'line-red':'line-blue'">
							<text class="cuIcon-close"></text>
						</button>
					</view>
				</view>
				
			</view>
		</view>
		<uni-load-more :status="status"></uni-load-more>
		<!-- <view class="cu-load" :class="!isLoad?'loading':'over'"></view> -->
	</view>
</template>

<script>	
	var that
	import { getBookList, deleteBookMark } from '@/utils/api.js'
	import utils from '../../utils/util.js'
	export default {
		data () {
			return {
				tabList: this.$config.cars,
				TabCur: 0,
				infoList: [],
				infoTarget: 'all',
				list: [],
				searchData: '',
				userId: '',
				pageNum: 1,
				totalPage: 0,
				status: 'more'
				// showContainer: false
			}
		},
		onLoad() {
			that = this
			const value = uni.getStorageSync('userData');
			// that.getUserId()
			that.userId = value.userid
			let data = {
				UserID: value.userid,
				PageNum: 0
// /ashx/Main/LoginPage.ashx?type=GetBookMarkList&UserID=1&PageNum=0&Title=皓影
			}
			that.getBookList(data)
		},
		onReachBottom(){
			if(that.totalPage >= that.pageNum){
				that.status = 'loading'
				let data
				if(!that.searchData){
					data = {
						UserID: that.userId,
						PageNum: that.pageNum,
					}
				} else {
					data = {
						UserID: that.userId,
						PageNum: that.pageNum,
						Title: that.searchData
					}
				}
				that.getBookList(data)
				return
			}
			that.status = 'noMore'
			
		},
		methods: {
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				let target = e.currentTarget.dataset
				// let infoList = that.infoList
				// console.log(this.scrollLeftData)
				that.TabCur = target.id;
				that.infoTarget = target.target;
				
				// for(let i = 0; i < infoList.length; i++){
				// 	if(infoList[i].type == target.target){
				// 		that.list = infoList[i].mediaList
				// 		break
				// 	}
				// }
			},
			getBookList(data){
				console.log(data)
				uni.showLoading()
				getBookList(data).then(res => {
					uni.hideLoading()
					console.log('getBookList',res)
					if(res.data.successCode == '1'){
						let datas = res.data.data
						
						that.totalPage = res.data.pagecount
						// console.log(that.totalPage);
						// let datas = res.data.data
						// datas.map((item,index) => {
						// 	item.date = utils.formatDates(new Date(item.MediaDate * 1000))
						// })
						if(data.pageNum == 1){
							that.infoList = []
							return
						}
						that.infoList = that.infoList.concat(datas)
						that.pageNum++;
						if(datas.length == 0 || data.pageNum == res.data.pagecount){
							that.status = 'noMore';
							return
						}
						that.status = 'more';
						
						
						// if(datas.length == 0){
						// 	// that.showContainer = false
						// 	that.infoList = []
						// 	that.status = 'noMore';
						// 	that.showToast('无更多数据')
						// 	return
						// }
						// // that.infoList = datas
						// that.totalPage = res.data.pagecount
						// if(that.pageNum == 0){
						// 	that.infoList = datas
						// 	return
						// }
						// that.infoList = that.infoList.concat(datas)
						// that.status = 'more';
					} else {
						that.showToast(res.data.msg) 
					}
					if(!!data.Title){
						that.isLoad = true
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.text) 
				})
			},
			toInfo(e){
				console.log('toInfo',e)
				uni.navigateTo({
					url: '../infoDetail/infoDetail?id=' + e.Article_ID + '&date=' + e.date
				})
			},
			removeBookMark(e,i){
				uni.showLoading()
				console.log('remove',e,i)
				that.deleteBookMark(e,i)
			},
			deleteBookMark(e,i){
				let data = {
					// UserID=1&Article_ID=w360870859
					Article_ID: e,
					UserID: that.userId
				}
				deleteBookMark(data).then(res => {
					console.log('deleteBookMark',res)
					if(res.data.successCode == '1'){
						uni.showToast({
							title:'取消收藏'
						})
						that.infoList.splice(i, 1);
						console.log(that.infoList);
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					console.log(err)
					that.showToast(err.text) 
				})
			},
			searchArticle(){
				// if(!that.searchData){
				// 	that.showToast('搜索关键词不能为空')
				// 	return
				// }
				let data
				if(!that.searchData){
					data = {
						UserID: that.userId,
						PageNum: 0,
					}
				} else {
					data = {
						UserID: that.userId,
						PageNum: 0,
						Title: that.searchData
					}
				}
				that.getBookList(data)
			},
			getUserId(){
				try {
				    const value = uni.getStorageSync('userData');
				    if (value) {
				        console.log(value);
						that.userId = value.userid
				    }
				} catch (e) {
				    const value = uni.getStorageSync('userData');
				    if (value) {
				        console.log(value);
						that.userId = value.userid
				    }
				}
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
	.top-list .cu-list+.cu-list{
		margin: 0;
	}
	.top-list .cu-list.grid>.cu-item{
		padding: 20upx 0;
	}
	.top-list .cu-item.cur{
		color: #cc0000;
	}
	.cu-bar.search{
		min-height: 36px;
	}
	.cu-bar .search-form{
		background: #fff;
		height: 26px;
		line-height: 26px;
	}
	.cu-bar.search .cu-btn{
		height: 26px;
	}
	/* .cu-list.menu>.cu-item .content{
		width: calc(100% - 90upx - 44upx);
	}
	.cu-list.menu>.cu-item{
		padding: 0 0 0 30upx;
	} */
	.cu-item .content{
		width: calc(100% - 200rpx);
	}
	.cu-item .action .cu-btn{
		position: relative;
		z-index: 999999;
	}
</style>
