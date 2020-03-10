<template>
	<view>
		<cu-custom bgColor="title-bg" :isBack="true" :isHome="true">
			<block slot="backText"></block>
			<block slot="homeText"></block>
			<block slot="content">日志</block>
		</cu-custom>
		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange"></text>
				日志：
			</view>
		</view>

		<view class="cu-bar bg-white solid-bottom  sm-border">
			<view class="cu-item">
				<view class="padding flex flex-wrap justify-between align-center bg-white">
					<button class="cu-btn round line-black margin-left-sm" @click="handleSearch('all')">all</button>
					<button class="cu-btn round line-purple margin-left-sm" @click="handleSearch('login')">login</button>
					<button class="cu-btn round line-pink margin-left-sm" @click="handleSearch('create')">create</button>
					<button class="cu-btn round line-cyan margin-left-sm" @click="handleSearch('update')">update</button>
				</view>
			</view>
		</view>

		<view class="cu-bar bg-white solid-bottom sm-border">
			<view class="cu-item">
				<view class="padding flex flex-wrap justify-between align-center bg-white">
					<button class="cu-btn bg-white margin-left-sm" @click="handleSearchEnv('all')">all</button>
					<button class="cu-btn bg-green margin-left-sm" @click="handleSearchEnv('weixin')">weixin</button>
					<button class="cu-btn bg-blue margin-left-sm" @click="handleSearchEnv('alipay')">alipay</button>
				</view>
			</view>
		</view>

		<view class="cu-list menu padding-top-sm">
			<view class="cu-item" v-for="item in dataList" :key="item._id">
				<view class="action"><button class="cu-btn bg-green margin-right-sm" v-if="item.env=='weixin'">{{item.env}}</button></view>
				<view class="action"><button class="cu-btn bg-blue margin-right-sm" v-if="item.env=='alipay'">{{item.env}}</button></view>
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
			<view class="action flex-sub" @click="handlePre">
				<text class="text-grey">上一页</text>
			</view>
			<view class="action">
				<text class="text-grey text-lg">
					< {{(pageindex+1)}}>
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
				searchtype: "all",
				searchenv: "all"
			};
		},
		async onLoad(option) {
			this.pageindex = 0;
		},
		onShow() {
			this.getData()
		},
		onLoad: function() {
			// #ifdef MP-ALIPAY

			uni.setNavigationBar({
				reset: true,
				backgroundColor: '#fe0000',
				frontColor:"#ffffff",
				title: '日志',
			});
			uni.setNavigationBarColor({
				backgroundColor: '#fe0000',
				frontColor:"#ffffff"
			})
			// #endif
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

				if (this.searchenv != 'all') {
					Object.assign(condition, {
						'env': this.searchenv
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
			},
			handleSearchEnv(env) {
				this.pageindex = 0
				this.searchenv = env;
				this.getData()
			}
		}
	};
</script>

<style scoped>
	.change {}
</style>
