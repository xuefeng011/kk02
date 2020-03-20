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
			<!-- #ifdef MP-WEIXIN -->
			<view class="cu-item" v-if="hasLogin">
				<view class="content padding-tb-sm" @click="handleShowSubModel">
					<view>
						<text class="cuIcon-time text-blue margin-right-xs"></text>按时提醒</view>
					<view class="text-gray text-sm" v-if="mainData.subdesc">
						<text class="cuIcon-infofill margin-right-xs"></text> {{mainData.subdesc}}</view>
				</view>
				<view class="action" @click="handleShowSubModel">
					<switch class="switch-blue skin" :checked="mainData.issub" disabled></switch>
				</view>
			</view>
			<!-- #endif -->

			<view class="cu-item">
				<button class="cu-btn content">
					<text class="text-grey">当前版本 1.0.3</text>
				</button>
			</view>
		</view>

		<lb-picker ref="picker" v-model="selectPicker" mode="multiSelector" :list="list" :level="2" @change="handleChange"
		 @confirm="handleConfirm" @cancle="handleCancle">
			<view slot="confirm-text">
				<text class="text-blue text-lg">确认设置</text>
			</view>
			<view slot="action-center">
				<text class="text-red text-lg" @click="handleGuanbi">取消提醒</text>
			</view>
		</lb-picker>




	</view>
</template>

<script>
	import {
		diffday,
		templateId
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
				huoyuedu: 0,
				selectPicker: [],

				list: [{
						label: '每周',
						value: '1',
						children: [{
								label: '周一',
								value: '1',
							},
							{
								label: '周二',
								value: '2',
							},
							{
								label: '周三',
								value: '3',
							},
							{
								label: '周四',
								value: '4',
							},
							{
								label: '周五',
								value: '5',
							},
							{
								label: '周六',
								value: '6',
							},
							{
								label: '周日',
								value: '7',
							},
						]
					},
					{
						label: '每月',
						value: '2',
						children: [{
								label: '1日',
								value: '1'
							},
							{
								label: '2日',
								value: '2'
							},
							{
								label: '3日',
								value: '3'
							},
							{
								label: '4日',
								value: '4'
							},
							{
								label: '5日',
								value: '5'
							},
							{
								label: '6日',
								value: '6'
							},
							{
								label: '7日',
								value: '7'
							},
							{
								label: '8日',
								value: '8'
							},
							{
								label: '9日',
								value: '9'
							},
							{
								label: '10日',
								value: '10'
							},
							{
								label: '11日',
								value: '11'
							},
							{
								label: '12日',
								value: '12'
							},
							{
								label: '13日',
								value: '13'
							},
							{
								label: '14日',
								value: '14'
							},
							{
								label: '15日',
								value: '15'
							},
							{
								label: '16日',
								value: '16'
							},
							{
								label: '17日',
								value: '17'
							},
							{
								label: '18日',
								value: '18'
							},
							{
								label: '19日',
								value: '19'
							},
							{
								label: '20日',
								value: '20'
							},
							{
								label: '21日',
								value: '21'
							},
							{
								label: '22日',
								value: '22'
							},
							{
								label: '23日',
								value: '23'
							},
							{
								label: '24日',
								value: '24'
							},
							{
								label: '25日',
								value: '25'
							},
							{
								label: '26日',
								value: '26'
							},
							{
								label: '27日',
								value: '27'
							},
							{
								label: '28日',
								value: '28'
							}
						]
					},

				]

			};
		},
		onLoad: function() {
			// #ifdef MP-ALIPAY

			uni.setNavigationBar({
				reset: true,
				backgroundColor: '#fe0000',
				frontColor: "#ffffff",
				title: '我的',
			});
			uni.setNavigationBarColor({
				backgroundColor: '#fe0000',
				frontColor: "#ffffff"
			})
			// #endif


		},
		onShareAppMessage: function(options) {
			var that = this;
			// 设置菜单中的转发按钮触发转发事件时的转发内容
			var shareObj = {
				title: "空空资产管家", // 默认是小程序的名称(可以写slogan等)
				path: '/pages/index/startup', // 默认是当前页面，必须是以‘/’开头的完整路径
				imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
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
			...mapActions(['ApiLogin', 'ApiSaveSubs']),
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
			},
			handleShowSubModel() {
				this.$refs["picker"].show()
			},
			subsMessage({
				desc,
				k1,
				k2
			}) {
				let _this = this;
				wx.requestSubscribeMessage({
					tmplIds: [templateId],
					success(res) {
						//开发文档文档详细对的说明，接口调用返回的结果是什么
						//https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html
						if (res.errMsg === 'requestSubscribeMessage:ok') {
							wx.cloud
								.callFunction({
									//通过调用云函数，实现用户点击允许我们发送订阅消息，
									//将该数据订阅保存到数据库，以便在满足条件的时候发送给用户
									name: 'subscribeMessage',
									data: {
										type: "sub",
										data: {
											k1:k1,
											k2:k2,
											desc:desc
										},
										templateId: templateId,
										//这个是给用户发送订阅消息后，用户点击订阅消息进入小程序的相关页面，一定要是在线的才可以
										page: 'pages/index/index',
									},
								})
								.then(async () => {

									await _this.ApiSaveSubs({
										"issub": true,
										"subdesc": desc,
									})

									wx.showToast({
										title: '订阅成功',
										icon: 'success',
										duration: 2000,
									});


									_this.$refs["picker"].hide()
								})
								.catch((e) => {
									wx.showToast({
										title: '订阅失败',
										icon: 'success',
										duration: 2000,
									});
								});
						}
					},
					fail() {
						wx.showToast({
							title: '订阅失败',
							icon: 'success',
							duration: 2000,
						});
					}
				})

			},
			sendMessage() {
				wx.cloud.callFunction({
					name: 'subscribeMessage',
					data: {
						type: "send",
					},
					success(res) {
						wx.showToast({
							title: '设置成功',
							icon: 'success',
							duration: 2000,
						});
						console.log(res)
					},
					fail(re) {
						console.log(re)
					}
				})

			},
			async handleConfirm({
				item,
				value
			}) {
				console.log("handleConfirm", item, value)



				let a1 = item[0]["label"];
				let a2 = item[1]["label"];


				let k1 = item[0]["value"];
				let k2 = item[1]["value"];

				return this.subsMessage({
					desc: `${a1}${a2}`,
					k1: k1,
					k2: k2
				})



			},
			handleCancle() {
				this.issub = false
			},
			handleChange() {

			},
			async handleGuanbi() {
				var _this = this;
				console.log("handleGuanbi")


				uni.showModal({
					title: '确认取消 按时提醒功能?',
					async success(e) {
						console.error("succ", e)
						if (e.confirm) {
							await _this.ApiSaveSubs({
								"issub": false,
								"subdesc": "",
							})
							wx.showToast({
								title: '取消成功',
								icon: 'success',
								duration: 2000,
							});
							_this.$refs["picker"].hide()
						}

					},
					fail() {
						console.error("fail")

					}
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
