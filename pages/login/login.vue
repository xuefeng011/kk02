<template>
	<view>

		<cu-custom bgColor="title-bg" :isBack="false" :isHome="true">
			<block slot="backText"></block>
			<block slot="homeText"></block>
			<block slot="content">我的</block>
		</cu-custom>



		<view class="cu-card">
			<view class="cu-item" style="margin:0;">
				<view class="cu-list menu-avatar" v-if="hasLogin">
					<view class="cu-item">
						<!-- #ifdef MP-ALIPAY -->
						<view class="cu-avatar round lg" :style="{ 'background-image': `url(${userInfo.avatar})` }"></view>
						<!-- #endif -->
						<!-- #ifndef MP-ALIPAY -->
						<view class="cu-avatar round lg" :style="{ 'background-image': `url(${userInfo.avatarUrl})` }"></view>
						<!-- #endif -->
						<view class="content flex-sub">
							<view class="text-grey">{{ userInfo.nickName }}</view>
						</view>
					</view>
				</view>

				<view class="cu-list menu-avatar" v-else>
					<view class="cu-item">
						<view class="cu-avatar round lg"></view>
						<view class="content flex-sub">
							<!-- #ifdef MP-WEIXIN -->
							<button class="cu-btn text-grey" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">未登录,请登录</button>
							<!-- #endif -->
							<!-- #ifdef MP-ALIPAY -->
							<button class="cu-btn text-grey" open-type="getAuthorize" scope="userInfo" @getAuthorize="getAuthorize">未登录,请登录</button>
							<!-- #endif -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="wxlogin padding" v-if="!hasLogin">
			<view class="flex flex-direction">
				<!-- #ifdef MP-WEIXIN -->
				<button class="cu-btn bg-green text-lg" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">微信一键登录</button>
				<!-- <button class="cu-btn bg-green text-lg" @click="loginMp">微信一键登录</button> -->
				<!-- #endif -->

				<!-- #ifdef MP-ALIPAY -->
				<button class="cu-btn bg-blue text-lg" open-type="getAuthorize" scope="userInfo" @getAuthorize="getAuthorize">支付宝一键登录</button>
				<!-- #endif -->
			</view>
		</view>
		<view class="cu-list grid col-3">
			<view class="cu-item">
				<view class="text-xxl">
					{{cnt}}
				</view>
				<text class="text-black">记账种类数</text>
			</view>
			<view class="cu-item">
				<view class="text-xxl">
					{{days}}
				</view>
				<text class="text-black">总记账天数</text>
			</view>
			<view class="cu-item">
				<view class="text-xxl text-gray">
					<text text-sm>{{lastdate}}</text>
				</view>
				<text class="text-black">上一次更新</text>
			</view>
		</view>


		<view class="cu-list menu sm-border card-menu margin-top padding-top-sm" style="margin:0;border-radius: 0;">
			<view class="cu-item arrow" v-if="haspermiss">
				<button class="cu-btn content" @click="handleGotoLog">
					<text class="text-grey">查看日志</text>
				</button>
			</view>
			<view class="cu-item">
				<button class="cu-btn content">
					<text class="text-grey">当前版本 1.0.3</text>
				</button>
			</view>
		</view>


	</view>
</template>

<script>
	import {
		diffday
	} from '../../utils/common.js'

	import {
		loginMp,
		loginAlipay
	} from '../../utils/loginhelper.js'

	import {
		mapState,
		mapGetters,
		mapActions,
		mapMutations
	} from 'vuex';
	export default {
		computed: { ...mapState(['hasLogin', 'userInfo', 'mainData']),
			cnt() {
				try {
					return this.mainData.details.length
				} catch (e) {
					return 0;
				}
			},
			lastdate() {
				try {
					return this.mainData.updateAt || '--'
				} catch (e) {
					return "--"
				}
			},
			days() {
				if (this.mainData.updateAt == null || this.mainData.updateAt == null) {
					return 0;
				}
				try {
					return diffday(this.mainData.updateAt, this.mainData.createAt) + 1
				} catch (e) {
					return '--'
				}
			},
			haspermiss() {

				try {

					return this.hasLogin && this.mainData.isadmin;
				} catch (e) {
					return false
				}
			}
		},

		data() {
			return {
				openid: '',
				huoyuedu: 0
			};
		},
		onLoad: function() {
			// #ifdef MP-ALIPAY

			uni.setNavigationBar({
				reset: true,
				backgroundColor: '#fe0000',
				frontColor:"#ffffff",
				title: '我的',
			});
			uni.setNavigationBarColor({
				backgroundColor: '#fe0000',
				frontColor:"#ffffff"
			})
			// #endif
		},
		methods: {
			...mapActions(['ApiLogin']),
			async getuserinfo(e) {
				if (e.detail.userInfo) {
					let userinfo = e.detail.userInfo;
					this.$store.commit('login', userinfo);
					console.log('Login 用户授权登录', userinfo);

					return loginMp().then(async openid => {

						console.log("xxxx", openid)

						Object.assign(userinfo, {
							openid
						})
						console.log("userinfo", userinfo)
						return await this.ApiLogin(userinfo);
					}).catch(async error => {
						return await this.ApiLogin(userinfo);
					})


				}
			},
			getAuthorize(e) {
				let _this = this;


				console.error("getAuthorize")

				my.getOpenUserInfo({
					fail: (res) => {},
					success: async (res) => {
						console.error("getOpenUserInfo", res)

						let userinfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response  


						return loginAlipay().then(async openid => {

							console.log("xxxx", openid)

							Object.assign(userinfo, {
								openid
							})
							console.log("userinfo", userinfo)
							return await this.ApiLogin(userinfo);
						}).catch(async error => {
							return await this.ApiLogin(userinfo);
						})


						// my.getAuthCode({
						// 	scopes: 'auth_base',
						// 	success: async (authinfo) => {
						// 		console.error("auth_base authCode", authinfo.authCode)
						// 		Object.assign(userInfo, {
						// 			openid: authinfo.authCode
						// 		})
						// 		console.error("userInfo", userInfo)

						// 		_this.$store.commit('login', userInfo);
						// 		console.log('Login 用户授权登录', userInfo);
						// 		await _this.ApiLogin(userInfo);



						// 	},
						// });

					}
				});






			},
			handleGotoLog() {
				uni.navigateTo({
					url: `../log/log`
				});
			}
		}
	};
</script>

<style scoped>
	.wxlogin {
		position: absolute;
		top: 50%;
		width: 100%;
	}
</style>
