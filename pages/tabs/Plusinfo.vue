<template>
	<view class="">
		<view class="">
			<view class="cu-list flex text-center justify-between bg-white padding-lr-sm" >
				<view class="cu-item  padding-tb-sm" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.type">{{item.name}}</view>
			</view>
			<!-- <view class="cu-list grid text-center col-4" >
				<view class="cu-item" :class="index==TabCur?' cur':''" v-if="index>=5" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.type">{{item.name}}</view>
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
		<view class="cu-list menu sm-border">
			<view class="cu-item " :class="item.IsRead == 0?'text-red':'text-gray'" @tap.stop="toInfo(item,index)" hover-class="cur" v-for="(item,index) in list" :key="index + item.Article_ID">
				<view class="content padding-tb-xs">
					<view class="response">
						<text class="text-cut text-df">{{item.Title}}</text>
					</view>
					<view class=" text-sm">
						| <text class="margin-lr-xs">{{item.Media}}</text>
						| <text class="margin-lr-xs">{{item.date}}</text>
						| <text class="margin-lr-xs">{{item.IsRead == 0?'未读':'已读'}}</text>
					</view>
				</view>
				<view class="action text-xxl padding-lr padding-tb-sm" @tap.stop="bookMark(item,index)">
					<text class="cuIcon-favor line-red" v-if="item.IsBookMark == 0"></text>
					<text class="cuIcon-favorfill line-red" v-else></text>
					<!-- <button class="cu-btn sm icon" :class="item.ISBook == 'null'?'line-red':'bg-red'">
					</button>
					<view class="info-add line-red text-xs">收藏</view> -->
				</view>
			</view>
			<view class="cu-load" :class="!isLoad?'loading':'over'"></view>
		</view>
		
	</view>
</template>

<script>
	var that;
	import { getArticle, searchArticle, addBookMark, deleteBookMark } from '@/utils/api.js'
	import utils from '../../utils/util.js'
	export default {
		data() {
			return {
				tabList: this.$config.cars,
				TabCur: 0,
				infoList: [],
				infoTarget: 'all',
				list: [],
				searchData: '',
				userId: '',
				isLoad: false,
				pageNum: 0,
				totalPage: null,
				// isSearch: false,
				ProjectName: 'Good'
			}
		},
		props: {
			loadDataEventCount:{
				type:Number,
				default:0
			}
		},
		watch: {
			loadDataEventCount() {
				this.setReachBottom();
			}
		},
		mounted() {
			that = this;
			console.log(that.tabList);
			const value = uni.getStorageSync('userData');
			// that.getUserId()
			that.userId = value.userid
			console.log(value);
			that.getArticle()
		},
		onReachBottom(e){
			console.log(e);
			console.log(that.totalPage);
		},
		methods: {
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				let target = e.currentTarget.dataset
				let infoList = that.infoList
				that.TabCur = target.id;
				that.infoTarget = target.target;
				that.pageNum = 0
				that.searchData = ''
				// that.isSearch = false
				that.getArticle()
			},
			getArticle(){
				let data 
				if(!that.searchData){
					data = {
						ProjectName: 'Good',
						UserID: that.userId,
						PageNum: that.pageNum,
						Product: that.infoTarget
					}
				} else {
					data = {
						ProjectName: 'Good',
						UserID: that.userId,
						PageNum: that.pageNum,
						Product: that.infoTarget,
						title: that.searchData
					}
				}
				console.log(data)
				uni.showLoading()
				getArticle(data).then(res => {
					uni.hideLoading()
					console.log('getArticle',res)
					if(res.data.successCode == '1'){
						that.totalPage = res.data.pagecount
						// console.log(that.totalPage);
						let datas = res.data.data
						datas.map((item,index) => {
							item.date = utils.formatDates(new Date(item.MediaDate * 1000))
						})
						if(that.pageNum == 0){
							that.list = datas
							return
						}
						that.list = that.list.concat(datas)
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					console.log(err)
					that.showToast(err.msg) 
				})
			},
			//加载更多
			setReachBottom() {
				if(that.pageNum == that.totalPage){
					that.isLoad = true
					return
				}
				that.pageNum++;
				console.log(that.pageNum);
				that.getArticle()
			},
			toInfo(e,i){
				console.log(e)
				console.log(i)
				that.$set(that.list[i],'IsRead',1)
				uni.navigateTo({
				    url: '../infoDetail/infoDetail?id=' + e.Article_ID + '&ProjectName=Good' + '&UserID=' + that.userId
				});
			},
			bookMark(e,i){
				uni.showLoading()
				if(e.IsBookMark == 0){
					that.addBookMark(e,i)
				} else {
					that.deleteBookMark(e,i)
				}
				// vm.$set(vm.list,1,{id: “220”，text: "vue2.2"})
			},
			addBookMark(e,i){
				console.log(e);
				console.log(i);
				let data = {
					ArticleID: e.Article_ID,
					UserID: that.userId,
					ProjectName: 'Good',
					...e
					// MediaDate: e.date
				}
				console.log(data);
				addBookMark(data).then(res => {
					console.log('addBookMark',res)
					if(res.data.successCode == '1'){
						uni.hideLoading()
						that.$set(that.list[i],'IsBookMark',1)
						
						uni.showToast({
							title:'收藏成功',
							success() {
								
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
			deleteBookMark(e,i){
				let data = {
					Article_ID: e.Article_ID,
					UserID: that.userId
				}
				console.log(data);
				deleteBookMark(data).then(res => {
					console.log('deleteBookMark',res)
					if(res.data.successCode == '1'){
						uni.hideLoading()
						that.$set(that.list[i],'IsBookMark',0)
						uni.showToast({
							title:'取消收藏'
						})
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					console.log(err)
					that.showToast(err.msg) 
				})
			},
			getUserId(){
				let userId = getApp().globalData.userData.userid
				if(!userId){
					return
				}
				that.userId = userId
				// try {
				//     const value = uni.getStorageSync('userData');
				//     if (value) {
				//         console.log(value);
				// 		that.userId = value.userid
				//     }
				// } catch (e) {
				//     const value = uni.getStorageSync('userData');
				//     if (value) {
				//         console.log(value);
				// 		that.userId = value.userid
				//     }
				// }
			},
			searchArticle(){
				if(!that.searchData){
					that.showToast('搜索关键词不能为空')
					return
				}
				// that.isSearch = true
				that.getArticle()
			},
			
			showToast(e) {
				uni.showToast({
					title: e,
					icon: 'none',
					mask: true,
					duration: 2000
				})
			}, 
		},
	
	}
</script>

<style>
	.cu-list+.cu-list{
		margin: 0;
	}
	.cu-list.grid>.cu-item{
		padding: 20upx 0;
	}
	.cu-item.cur{
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
	.cu-list.menu>.cu-item .content{
		width: calc(100% - 90upx - 44upx);
	}
	.cu-list.menu>.cu-item{
		padding: 0 0 0 30upx;
		min-height: 60upx;
	}
</style>
