<template>
	<view>
		<cu-custom bgColor="title-bg" :isBack="false" :isHome="false">
			<block slot="backText"></block>
			<block slot="homeText"></block>
			<block slot="content">我的资产</block>
		</cu-custom>

		<view class="cu-chat title-bg text-center">
			<view class="basis-df border-bottom padding-bottom-sm text-xxl">
				<view class="text-white text-sm">净资产</view>
				<view class="text-price">{{ mainData.jingzichan }}</view>
			</view>
			<view class="flex text-xl padding-bottom-sm">
				<view class="basis-df border text-center">
					<view class="text-white text-sm padding-bottom-sm">资产</view>
					<view class="text-price">{{ mainData.zongzichan }}</view>
				</view>
				<view class="basis-df text-center solid-left">
					<view class="text-white text-sm padding-bottom-sm">负债</view>
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
			<view class="flex flex-direction">
				<!-- <button class="cu-btn bg-white margin-tb-sm lg" @click="handleAddAccount">添加</button> -->
				<button class="cu-btn block line-orange lg" @click="handleAddAccount">
					<text class="cuIcon-add margin-right-sm"></text> 添加</button>
			</view>
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

			// #ifdef MP-ALIPAY

			uni.setNavigationBar({
				reset: true,
				backgroundColor: '#fe0000',
				fontColor: "#ffffff",
				title: "空空资产管家"
			});
			uni.setNavigationBarColor({
				backgroundColor: '#fe0000',
				frontColor: "#ffffff"
			})
			// #endif



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
		onShareAppMessage: function(options) {
			var that = this;
			// 设置菜单中的转发按钮触发转发事件时的转发内容
			var shareObj = {
				title: "空空资产管家", // 默认是小程序的名称(可以写slogan等)
				path: '/pages/index/startup', // 默认是当前页面，必须是以‘/’开头的完整路径
				imageUrl: '../../static/logo.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
				success: function(res) {
					// 转发成功之后的回调
					if (res.errMsg == 'shareAppMessage:ok') {}
				},
				fail: function() {
					// 转发失败之后的回调
					if (res.errMsg == 'shareAppMessage:fail cancel') {
						// 用户取消转发
					} else if (res.errMsg == 'shareAppMessage:fail') {
						// 转发失败，其中 detail message 为详细失败信息
					}
				}
			};
			return shareObj;
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
