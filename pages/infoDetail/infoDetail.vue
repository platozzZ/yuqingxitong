<template>
	<view class="bg-white">
		<cu-custom bgColor="" :isBack="true" :noMore="true" :hasAdd="true" :favorFill="favorFill" @toggleAdd="toggleAdd"><block slot="content">智能舆情系统</block></cu-custom>
		<view class="" v-if="hasContent">
			<view class="info-title text-xxl padding">
				{{art.Title}}
			</view>
			<view class="text-sm padding-lr">
				<view class="">
					{{art.Media + ' | ' + art.Author}}
				</view>
				<view class="text-gray">
					{{art.date}}
				</view>
			</view>
			<view class="info-content padding">
				<view class="info-content-html" v-html="art.Contents"></view>
				<!-- <u-parse :content="art.Contents" /> -->
			</view>
		</view>
		<view class="info-none" v-if="noContent">
			该媒体页面已变更
		</view>
	</view>
</template>

<script>	
	var that
	import { getArticleDetail, addBookMark, deleteBookMark } from '@/utils/api.js'
	// import uParse from '@/components/gaoyia-parse/parse.vue'
	import utils from '../../utils/util.js'
	export default {
		// components: {
		// 	uParse
		// },
		data () {
			return {
				articleId: null,
				hasContent: false,
				noContent: false,
				favorFill: false,
				art: '',
				userId: ''
			}
		},
		onLoad(option) {
			console.log(option)
			that = this
			// that.getUserId()
			const value = uni.getStorageSync('userData');
			// that.getUserId()
			that.userId = value.userid
			that.articleId = option.id
			let data = {
				Article_ID: option.id,
				// MediaDate: option.date,
				ProjectName: option.ProjectName,
				UserID: option.UserID
				// Article_ID=b38876840&ProjectName=Good / Bad&UserID=1
			}
			that.getArticleDetail(data)
		},
		methods: {
			getArticleDetail(data){
				console.log(data);
				uni.showLoading()
				getArticleDetail(data).then(res => {
					uni.hideLoading()
					console.log('getArticleDetail',res)
					if(res.data.successCode == '1'){
						if(res.data.data.length == 0){
							// that.showToast()
							that.noContent = true
							return
						}
						let art = res.data.data[0]
						art.date = utils.formatDates(new Date(art.MediaDate * 1000))
						console.log(art)
						if(art.IsBookMark == 1){
							that.favorFill = true
						}
						// console.log('getArticleDetail',art)
						that.art = art
						that.hasContent = true
						that.noContent = false
					} else {
						that.hasContent = false
						that.noContent = true
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					uni.hideLoading()
					that.hasContent = false
					that.noContent = true
					console.log(err)
					that.showToast(err.msg) 
				})
			},
			addBookMark(e){
				let data = {
					ArticleID: e,
					UserID: that.userId
				}
				addBookMark(data).then(res => {
					console.log('addBookMark',res)
					if(res.data.successCode == '1'){
						uni.showToast({
							title:'收藏成功'
						})
						that.favorFill = true
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					console.log(err)
					that.showToast(err.msg) 
				})
			},
			deleteBookMark(e){
				let data = {
					ArticleID: e,
					UserID: that.userId
				}
				deleteBookMark(data).then(res => {
					console.log('deleteBookMark',res)
					if(res.data.successCode == '1'){
						uni.showToast({
							title:'取消收藏'
						})
						that.favorFill = false
					} else {
						that.showToast(res.data.msg) 
					}
				}).catch(err => {
					console.log(err)
					that.showToast(err.msg) 
				})
			},
			toggleAdd(e){
				console.log(that.articleId);
				if(!that.articleId){
					that.showToast('该媒体页面已变更')
					return
				}
				console.log(e)
				uni.showLoading()
				if(!e.favorFill){
					that.addBookMark(that.art.BookMarkID)
				} else {
					// that.favorFill = !that.favorFill
					that.deleteBookMark(that.art.BookMarkID)
				}
				// that.favorFill = !that.favorFill
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
		},
		
	}

</script>

<style>
	.info-none{
		position: fixed;
		top: 40%;
		width: 100%;
		text-align: center;
	}
	.info-content img{
	}
	.info-content-html{
		width: 100%;
		word-wrap: break-word;
		overflow: hidden;
	}
	.info-content-html img,.info-content-html image{
		max-width: 100%!important;
	}
</style>
