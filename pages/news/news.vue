<template>
	<view class="body-background" style="min-height: 100vh;">
        <custom-input :focus="false" v-model="value" placeholder="输入关键字搜索"><block slot="content">校内新闻</block></custom-input>
        <empty-tip v-if="isEmpty === true" loading></empty-tip>
		<!-- <view class="list-container">
			<view class="list" v-for="(list,listIndex) of viewList" :key="listIndex">
				<view class="item px-3 drop-shadow active-shadow" v-for="(item,index) of list.list" :key="index">
					<view @tap="getNewsDetail(item.newsId,item.newsTitle)">
						<view :id="item.newsId" class="news-title ">{{item.newsTitle}}</view>
						<view class="news-owner ">{{item.newsOwner}}</view>
                        <view class="news-time">{{item.newsTime}}</view>
					</view>
				</view>
			</view>
		</view> -->
        <view class="list" v-for="(item,index) of viewList" :key="index">
        	<view class="item px-3 drop-shadow active-shadow">
        		<view @tap="getNewsDetail(item.newsId,item.newsTitle)">
        			<view :id="item.newsId" class="news-title">{{item.newsTitle}}</view>
                    <view class="news-text">{{item.newsText}}</view>
                    <view class="news-mix">
                        <view class="news-owner">{{item.newsOwner}}</view>
                        <view class="news-time">{{item.newsTime}}</view>
                    </view>
        		</view>
        	</view>
       </view>
		<view v-show="isLoadMore">
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
import { APIs } from '@/staticData/staticData.js';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
import {getTimeToCnameTime} from '@/commonFun.js';
import customInput from '@/components/custom-input.vue';
export default {
	components:{
		uniLoadMore,
        customInput
	},
    watch:{
        value() {
            this.pageNum = 1;
            this.viewList = [];
            this.getNewsList();
        }
    },
	data() {
		return {
			isLoadMore:false,
			loadStatus:'loading',
            isEmpty:true,
			flagList:0,
			pageNum:1,
			viewList:[],
            value: '',
		}
	},
	async mounted() {
		this.getNewsList();
	},
	methods: {
		getNewsDetail(id,title) {
			uni.navigateTo({
			    url: '/pages/news/news-detail?id='+id+'&title='+title+'&isShare=1'
			}); 
		},
		async getNewsList() {
			try {
				const {
					data: { error, data }
				} = await this.$commonFun.rePromise({
					PromiseFunction: this.$http.get.bind(this.$http),
					parms: [
						APIs.getNewsList+"?pageNum=" + this.pageNum + "&pageSize=10"+"&keyword="+this.value
					]
				});
				if (+error == 1) {
                    if (data.length == 0) {
                        this.loadStatus = 'noMore';
                        return;
                    }
					this.pageNum++;
                    // console.log(data);
                    data.forEach(d=>{
                       // d.newsTime = d.newsTime.replace(new RegExp("/","gm"),"-");
                       d.newsTime = getTimeToCnameTime(d.newsTime);
                    });
					this.putInfoToList(data);
                    this.isEmpty = false
					uni.stopPullDownRefresh();
				}
			} catch (e) {
				console.log(e);
			}
		},
		putInfoToList(dataList) {
			let _this = this;
			dataList.forEach(item => {
				this.viewList.push(item)
			})
		},
	},
	onPullDownRefresh() {
		this.pageNum = 1;
		this.viewList = [];
		this.getNewsList();
	},
	onReachBottom(){
        this.isLoadMore = true;
		this.getNewsList();
	},
    onShareAppMessage(res) {
    	// 来自页面内转发按钮
    	return {
    		title: 'gdutday | 校内通知分享给你',
    		path: `/pages/news/news`
    	};
    },
    onShareTimeline(){
    	return {
    		title: 'gdutday | 校内通知分享给你',
    		path: `/pages/news/news`,
            query:'',
    	}
    },
}
</script>

<style lang="stylus" scoped>
        .list
            padding-top: 40rpx
            padding-left: 30rpx
            width calc(100% - 30rpx)
            display flex
            flex-direction column
            .item
                .news-title
                    margin-top 18rpx
                    font-size 35rpx;
                    font-weight:bold;
                .news-text
                    margin-top 15rpx
                    font-size 30rpx
                    margin-bottom 15rpx
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    display: -moz-box;
                    -moz-line-clamp: 2;
                    -moz-box-orient: vertical;
                    word-wrap: break-word;
                    word-break: break-all;
                    white-space: normal;    
                .news-mix
                        display:flex;
                        justify-content:space-between;
                    .news-owner
                        font-size 20rpx
                    .news-type
                        font-size 20rpx
                    .news-time
                        font-size 20rpx
                        right: 0px;
                        margin-bottom 18rpx
</style>
<style>
.body-background {
    background: #f5f5f5;
}
.drop-shadow {
border-radius: 35rpx;
background: #f5f5f5;
box-shadow:  14rpx 14rpx 28rpx #e4e4e4,
             -14rpx -14rpx 28rpx #ffffff;
}
</style>