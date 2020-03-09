<template>
	<view>
		<cu-custom bgColor="light bg-blue" :isBack="true">
			<block slot="backText"><text class="">返回</text></block>
			<block slot="content">日志</block>
		</cu-custom>

		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange"></text>
				日志：
			</view>
			<view class="padding flex flex-wrap justify-between align-center bg-white">
				<button class="cu-btn round line-black margin-left-sm" @click="handleSearch('all')">all</button>
				<button class="cu-btn round line-purple margin-left-sm" @click="handleSearch('login')">login</button>
				<button class="cu-btn round line-pink margin-left-sm" @click="handleSearch('create')">create</button>
				<button class="cu-btn round line-cyan margin-left-sm" @click="handleSearch('update')">update</button>
			</view>
		</view>
		<view class="cu-list menu">
			<view class="cu-item" v-for="item in dataList" :key="item._id">
				<view class="action"><button class="cu-btn round line-purple margin-right-sm" v-if="item.logtype=='login'">{{item.logtype}}</button></view>
				<view class="action"><button class="cu-btn round line-pink margin-right-sm" v-if="item.logtype=='create'">{{item.logtype}}</button></view>
				<view class="action"><button class="cu-btn round line-cyan margin-right-sm" v-if="item.logtype=='update'">{{item.logtype}}</button></view>
				<view class="content flex flex-direction">
					<view class="text-gray">{{item.createAt}}</view>
					<view class="text-gray text-sm">{{item._openid}}</view>
				</view>
				<view class="action"><text class="text-grey text-sm">{{item.nickName||'未登录'}}</text></view>
			</view>
			<view class="cu-item" v-if="dataList.length===0">
				<view class="action"><text class="text-grey text-sm">暂无数据...</text></view>
			</view>
		</view>
		<view class="cu-bar foot flex text-center row bg-white">
			<view class="action flex-sub" style="border-right:2px solid #eee;" @click="handlePre">
				<text class="text-grey">上一页</text>
			</view>
			<view class="action">
				<text class="text-grey text-lg">
					<{{(pageindex+1)}}>
				</text>
			</view>
			<view class="action flex-sub" @click="handleNext">
				<text class="text-grey">下一页</text>
			</view>
		</view>

	</view>
</template>

<script>
	import accounts from '../../utils/index.js';
	import {
		orderBy
	} from '../../utils/common.js'
	import {
		mapActions
	} from 'vuex';

	export default {
		data() {
			return {
				dataList: [],
				pageindex: 0,
				searchtype: "all"
			};
		},
		async onLoad(option) {
			this.pageindex = 0;
		},
		onShow() {
			this.getData()
		},
		methods: {
			...mapActions(['ApiGetLogData']),
			handlePre() {
				this.pageindex--
				this.getData()
			},
			handleNext() {
				this.pageindex++
				this.getData()
			},
			async getData() {
				let condition = {}

				if (this.searchtype != 'all') {
					Object.assign(condition, {
						'logtype': this.searchtype
					})
				}

				let res = await this.ApiGetLogData({
					condition: condition,
					limit: 5,
					skip: this.pageindex
				})

				this.dataList = res;

			},
			async onPullDownRefresh() {

				await this.getData();
				uni.stopPullDownRefresh();
			},
			handleSearch(type) {
				this.pageindex = 0
				this.searchtype = type;
				this.getData()
			}
		}
	};
</script>

<style scoped>
	.change {}
</style>
