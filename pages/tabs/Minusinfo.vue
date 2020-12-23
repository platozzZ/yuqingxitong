<template>
	<view class="">
		<view class="">
			<view class="cu-list flex text-center justify-between bg-white padding-lr-sm" >
				<view class="cu-item tabitem padding-tb-sm" :class="index==TabCur?' cur':''" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.type">{{item.name}}</view>
			</view>
			<!-- <view class="cu-list grid text-center col-5" >
				<view class="cu-item" :class="index==TabCur?' cur':''" v-if="index<5" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.type">{{item.name}}</view>
			</view>
			<view class="cu-list grid text-center col-4" >
				<view class="cu-item" :class="index==TabCur?' cur':''" v-if="index>=5" v-for="(item,index) in tabList" :key="index" @tap="tabSelect" :data-id="index" :data-target="item.type">{{item.name}}</view>
			</view> -->
		</view>
		<!-- <view class="padding-bottom-sm padding-top-xs bg-white">
			<u-dropdown :close-on-click-mask="mask" ref="uDropdown" :borderBottom="borderBottom" height="50" @open="openDropdown">
				<u-dropdown-item @change="change" :value="dropOption[0][dropItemIndex[0]].value" :title="dropOption[0][dropItemIndex[0]].label" :options="dropOption[0]"></u-dropdown-item>
				<u-dropdown-item @change="change" :value="dropOption[1][dropItemIndex[1]].value" :title="dropOption[1][dropItemIndex[1]].label" :options="dropOption[1]"></u-dropdown-item>
			</u-dropdown>
		</view> -->
		<view class="cu-bar search padding-tb-xs">
			<view class="flex align-center">
				<!-- <u-input v-model="selectTitle[index]" :custom-style="customStyle" input-align="center" type="select" @click="handleClick(index)" v-for="(item,index) in dropOption" :key="index" /> -->
				<u-button type="error" :custom-style="customStyle" size="mini" v-for="(item,index) in dropOption" :key="index" @click="handleClick(index)">
					{{selectTitle[index]}}
					<u-icon name="arrow-down-fill" :custom-style="customStyleIcon" color="#fff"></u-icon>
				</u-button>
				<!-- <u-button type="error">ALL</u-button> -->
			</view>
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="请输入关键词" confirm-type="search" v-model="searchData"></input>
			</view>
			<view class="action">
				<button class="cu-btn shadow-blur round bg-white" @tap="searchArticle">搜索</button>
			</view>
		</view>
		<view class="cu-list menu sm-border">
			<view 
				class="cu-item" 
				:class="item.IsRead == 0?'text-blue':'text-gray'" 
				v-for="(item,index) in list" 
				:key="item.Article_ID"
				@tap.stop="toInfo(item,index)"
			>
				<!-- <view class="content padding-tb-sm response">
					<view>
						<text class="text-cut">{{item.Title}}</text>
					</view>
					<view class=" text-sm">
						| <text class="margin-lr-xs">{{item.Media}}</text>
						| <text class="margin-lr-xs">{{item.date}}</text>
						| <text class="margin-lr-xs">未读</text>
					</view>
				</view>
				
				<view class="action text-xxl padding-lr padding-tb-sm" @tap.stop="bookMark(item)">
					<text class="cuIcon-favor line-blue" v-if="item.ISBook == 'null'"></text>
					<text class="cuIcon-favorfill bg-blue" v-else></text>
				</view> -->
				
				
				<view class="content padding-tb-xs">
					<view class="response">
						<text class="text-cut text-df">{{item.Title}}</text>
					</view>
					<view class=" text-sm">
						| <text class="margin-lr-xs">{{item.media}}</text>
						| <text class="margin-lr-xs">{{item.date}}</text>
						| <text class="margin-lr-xs">{{item.IsRead == 0?'未读':'已读'}}</text>
					</view>
				</view>
				<view class="action text-xxl padding-lr padding-tb-sm" @tap.stop="bookMark(item,index)">
					<text class="cuIcon-favor line-blue" v-if="item.IsBookMark == 0"></text>
					<text class="cuIcon-favorfill line-blue" v-else></text>
				</view>
				
				
			</view>
			<!-- <view class="cu-item text-gray">
				<view class="content padding-tb-sm response">
					<view>
						<text class="text-cut">广汽本田新款冠道正式亮相广汽本田新款冠道正式亮相广汽本田新款冠道正式亮相广汽本田新款冠道正式亮相</text>
					</view>
					<view class=" text-sm">
						| <text class="margin-lr-xs">凤凰网</text>
						| <text class="margin-lr-xs">3月27日</text>
						| <text class="margin-lr-xs">已读</text>
					</view>
				</view>
			</view> -->
			<!-- <view class="cu-load" :class="!isLoad?'loading':'over'"></view> -->
			<uni-load-more :status="status"></uni-load-more>
		</view>
		<u-select v-model="selectShow" mode="single-column" :list="dropOption[dropIndex]" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	var that;
	import { getArticle,searchArticle, addBookMark, deleteBookMark } from '@/utils/api.js'
	import utils from '../../utils/util.js'
	export default {
		data() {
			return {
				selectShow: false,
				selectTitle: ['默认排序','ALL'],
				tabList: this.$config.cars,
				TabCur: 0,
				infoList: [],
				infoTarget: 'all',
				list: [],
				searchData: '',
				userId: '',
				isLoad: false,
				pageNum: 1,
				totalPage: null,
				status: 'more',
				// isSearch: false,
				ProjectName: 'Bad',
				mask: true,
				dropOption: [
					[
						{
							label: '默认排序',
							value: 'ThisWeek',
						},
						{
							label: '按阅读量排序',
							value: 'LastWeek',
						},
						{
							label: '按评论量排序',
							value: 'ThisMonth',
						}
					],
					[
						{
							label: 'ALL',
							value: 'ALL',
						},
						{
							label: 'PGC',
							value: 'PGC',
						},
						{
							label: 'UGC',
							value: 'UGC',
						},
						
					],
				],
				borderBottom: false,
				activeColor: '#fff',
				inactiveColor: '#cc0000',
				dropIndex: null,
				dropItemIndex: [0,0],
				customStyle: {
					// width: 'a',
					color: '#fff',
					marginLeft: '30rpx'
				},
				customStyleIcon: {
					marginLeft: '6rpx'
				}
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
			const value = uni.getStorageSync('userData');
			// that.getUserId()
			that.userId = value.userid
			console.log(value);
			
			that.getArticle()
		},
		methods: {
			handleClick(index){
				that.dropIndex = index
				that.selectShow = true
			},
			confirm(e){
				console.log(e)
				that.selectTitle[that.dropIndex] = e[0].label
			},
			change(value,index) {
				console.log(value);
				console.log(index);
				// that.dropItemIndex = that.dropItemIndex
				that.$set(that.dropItemIndex,that.dropIndex,index)
				console.log(that.dropItemIndex);
				// that.queryForm.Para = that.dropOption[1][that.dropItemIndex[1]].value
				// that.queryForm.DiaoXing = that.dropOption[2][that.dropItemIndex[2]].value
				// if(!that.pickerStar && !that.pickerEnd){
				// 	that.queryForm.type = 'GetTrend'
				// 	that.queryForm.Period = that.dropOption[0][that.tagIndex].value
				// 	that.queryForm.BeginDate = ''
				// 	that.queryForm.EndDate = ''
				// } else {
				// 	that.queryForm.type = 'GetTrendS'
				// 	that.queryForm.Period = ''
				// 	that.queryForm.BeginDate = that.pickerStar
				// 	that.queryForm.EndDate = that.pickerEnd
				// }
				// console.log(that.queryForm)
				// that.getTrend(that.queryForm)
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			openDropdown(index){
				console.log(index);
				that.dropIndex = index
			},
			tabSelect(e) {
				console.log(e.currentTarget.dataset)
				let target = e.currentTarget.dataset
				let infoList = that.infoList
				// console.log(this.scrollLeftData)
				that.TabCur = target.id;
				that.infoTarget = target.target;
				that.pageNum = 1
				that.searchData = ''
				// that.isSearch = false
				that.getArticle()
			},
			
			getArticle(){
				let data 
				if(!that.searchData){
					data = {
						ProjectName: 'Bad',
						UserID: that.userId,
						PageNum: that.pageNum,
						Product: that.infoTarget
					}
				} else {
					data = {
						ProjectName: 'Bad',
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
						// that.totalPage = res.data.pagecount
						// console.log(that.totalPage);
						// let datas = res.data.data
						// datas.map((item,index) => {
						// 	item.date = utils.formatDates(new Date(item.MediaDate * 1000))
						// })
						// if(that.pageNum == 0){
						// 	that.list = datas
						// 	return
						// }
						// that.list = that.list.concat(datas)
						that.totalPage = res.data.pagecount
						// console.log(that.totalPage);
						let datas = res.data.data
						datas.map((item,index) => {
							item.date = utils.formatTimes(new Date(item.MediaDate * 1000))
						})
						if(data.PageNum == 1){
							that.list = []
							// return
						}
						that.list = that.list.concat(datas)
						that.pageNum++;
						if(datas.length == 0 || data.PageNum == res.data.pagecount){
							that.status = 'noMore';
							return
						}
						that.status = 'more';
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
				if(that.totalPage >= that.pageNum){
					that.status = 'loading'
					that.getArticle()
					return
				}
				that.status = 'noMore'
			},
			toInfo(e,i){
				console.log(e)
				console.log(i)
				that.$set(that.list[i],'IsRead',1)
				uni.navigateTo({
				    url: '../infoDetail/infoDetail?id=' + e.Article_ID + '&ProjectName=Bad' + '&UserID=' + that.userId
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
					ProjectName: 'Bad',
					...e
					// Title: e.Title,
					// LinkURL: e.LinkURL
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
				console.log(getApp().globalData.userData);
				let userId = getApp().globalData.userData.userid
				if(!userId){
					return
				}
				that.userId = userId
			},
			searchArticle(){
				if(!that.searchData){
					that.showToast('搜索关键词不能为空')
					return
				}
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
		}
	}
</script>

<style>
	.cu-list+.cu-list{
		margin: 0;
	}
	.cu-list.grid>.cu-item{
		padding: 20upx 0;
	}
	.cu-item.tabitem{
		line-height: 1;
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
	/deep/ .u-dropdown__menu{
		justify-content: center;
	}
	/deep/ .u-dropdown__menu__item{
		flex-grow: 0;
		flex-basis: auto;
		padding: 0 30rpx;
		width: 200rpx;
	}
</style>
