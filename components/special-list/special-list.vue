<template>
	<view class="cu-list menu sm-border margin-top">
		<view 
			class="cu-item" 
			v-for="(item,index) in list" 
			:key="item.Article_ID"
			:class="item.ProjectName == 0?'text-red':'text-blue'"
			@tap.stop="toInfo(item,index)"
		>
			<view class="content padding-tb-xs">
				<view class="response">
					<text class="text-cut text-df">{{item.Title}}</text>
				</view>
				<view class=" text-sm">
					| <text class="margin-lr-xs">{{item.Media}}</text>
					| <text class="margin-lr-xs">{{item.date}}</text>
					<!-- | <text class="margin-lr-xs">{{item.IsRead == 0?'未读':'已读'}}</text> -->
				</view>
			</view>
			<!-- <view class="action text-xxl padding-lr padding-tb-sm" @tap.stop="bookMark(item,index)">
				<text class="cuIcon-favor line-blue" v-if="item.IsBookMark == 0"></text>
				<text class="cuIcon-favorfill line-blue" v-else></text>
			</view> -->
		</view>
		<!-- <uni-load-more :status="status"></uni-load-more> -->
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			default: function(e) {
				return []
			}
		}
	},
	data() {
		return {
			status: 'more'
		}
	},
	mounted() {
		console.log(this.list);
	},
	methods: {
		toInfo(e,i){
			console.log(e)
			console.log(i)
			// that.$set(that.list[i],'IsRead',1)
			uni.navigateTo({
			    url: '../../pages/infoDetail/infoDetail?id=' + e.Article_ID,
				// + '&ProjectName=Bad' + '&UserID=' + that.userId
			});
		},
		click() {
			this.$emit('click');
		},
		close(e) {
			this.$emit('close');
		}
	}
}
</script>

<style>
	.cu-list.menu>.cu-item .content{
		width: 100%;
	}
</style>
