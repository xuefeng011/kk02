<template>
	<view>
		<cu-custom bgColor="light bg-blue text-black" :isBack="false">
			<block slot="backText">返回</block>
			<block slot="content">我的资产</block>
		</cu-custom>

		<view class="cu-chat light bg-blue text-black padding-sm text-center solid-bottom">
			<view class="basis-df border padding-bottom-sm text-xxl">
				<view class="text-gray text-sm">净资产</view>
				<view class="text-price">{{ mainData.jingzichan }}</view>
			</view>
			<view class="flex text-xl">
				<view class="basis-df border text-center">
					<view class="text-gray text-sm padding-bottom-sm">资产</view>
					<view class="text-price">{{ mainData.zongzichan }}</view>
				</view>
				<view class="basis-df text-center solid-left">
					<view class="text-gray text-sm padding-bottom-sm">负债</view>
					<view class="text-price">{{ mainData.fuzhai }}</view>
				</view>
			</view>
		</view>
		<view v-for="detail in mainData.details" :key="detail.type">
			<view class="cu-bar bg-white solid-top margin-top-xs dashed-bottom">
				<view class="action">
					<text class="text-blue"></text>
					{{ detail.name }}
				</view>
				<view class="action">
					<text class="text-price text-lg fr text-gray" v-if="!account[detail.type].isfu" style="align-self: center;">{{ detail._total }}</text>
					<text class="text-price text-lg fr text-green" v-else style="align-self: center;">{{ -detail._total }}</text>
				</view>
			</view>

			<view class="cu-list menu sm-border">
				<view class="cu-item arrow" v-for="item in detail.details" :key="item._id">
					<view class="content flex row " @click="handleEditAccount(item)">
						<view :class="account[detail.type].icon" class=" acion text-orange round text-xsl"></view>
						<view class="flex flex-direction flex-sub self-center margin-left-sm" style="align-self: center;">
							<text class="text-grey text-lg">{{ item.name }}</text>
							<text class="text-gray text-sm">{{ item.desc }}</text>
						</view>
						<text class="text-price fr text-grey" v-if="!account[detail.type].isfu" style="align-self: center;">{{ item.money }}</text>
						<text class="text-price fr text-green" v-else style="align-self: center;">{{ -item.money }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="padding">
			<view class="flex flex-direction"><button class="cu-btn bg-white margin-tb-sm lg" @click="handleAddAccount">添加</button></view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapMutations
	} from 'vuex';
	import accounts from '../../utils/index.js'

	import {
		delay
	} from '../../utils/common.js'

	export default {
		computed: {
			...mapState(['hasLogin', 'userInfo', 'mainData'])
		},
		components: {},
		onLaunch: function() {

		},
		onShow: function() {
			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});

		},
		onLoad: function() {
			let acc = []
			accounts.map((p, i) => {
				acc[i + 1] = p
			})
			this.account = acc;
		},
		data() {
			return {
				account: []
			};
		},
		methods: {
			...mapActions(['ApiGetMainData']),
			checkLogin() {
				if (this.hasLogin) {
					console.log('tapHome haslogin');
					return true;
				} else {
					console.log('tapHome notlogin');
					uni.showToast({
						icon: 'none',
						title: '请登录'
					});
					uni.switchTab({
						url: '/pages/login/login'
					});
					return false;
				}
			},
			async onPullDownRefresh() {
				console.log('refresh', this.mainData);
				await this.ApiGetMainData();
				uni.stopPullDownRefresh();

				// uni.pageScrollTo({
				// 	duration: 300,
				// 	scrollTop: 0
				// });
			},
			handleAddAccount() {
				if (!this.checkLogin()) {
					return;
				}
				uni.navigateTo({
					url: '../edit/addaccount'
				});
			},
			handleEditAccount(item) {
				if (!this.checkLogin()) {
					return;
				}
				this.gotoEdit(item);
			},
			gotoEdit(item) {
				uni.navigateTo({
					url: `../edit/edit?item=${encodeURIComponent(JSON.stringify(item))}`
				});
			}
		}
	};
</script>

<style scoped></style>
