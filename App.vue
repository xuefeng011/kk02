<script>
	import Vue from 'vue'
	import {
		mapActions
	} from 'vuex';
	import {
		loginMp,
		loginAlipay
	} from './utils/loginhelper.js'
	export default {
		onLaunch: function() {
			// console.error("App onLaunch")
			var _this = this;
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})

			// #ifndef H5
			uni.getSetting({
				async success(res) {
					console.log("getsettings", res)
					if (res.authSetting['scope.userInfo'] || res.authSetting['userInfo']) {
						console.log("res.authSetting getsettings1")
						// #ifdef MP-ALIPAY
						my.getOpenUserInfo({
							fail: (res) => {},
							success: async (res) => {
								console.error("getOpenUserInfo", res)

								let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response  

								loginAlipay().then(async openid => {
									console.log("openid succ", openid)
									Object.assign(userInfo, {
										openid
									})

									return await _this.ApiLogin(userInfo);

								}).catch(error => {
									console.log("openid error", error)
								})

							}
						});
						// #endif

						// #ifndef MP-ALIPAY
						uni.getUserInfo({
							"withCredentials": true,
							async success(res) {
								console.log("App OnLaunch 用户已授权登录 getUserInfo withCredentials", res.userInfo)
								// //用户已经授权过
								// console.log("app launch haslogin")
								// _this.$store.commit("login", res.userInfo)

								loginMp().then(async openid => {
									console.log("openid succ", openid)
									Object.assign(res.userInfo, {
										openid
									})

									uni.showLoading({
										mask: true,
										title: "加载中..."
									});

									let resultx = await _this.ApiLogin(res.userInfo);

									uni.hideLoading()

									return resultx;

								}).catch(error => {
									console.log("openid error", error)
								})



							}
						})
						// #endif


					} else {
						await _this.ApiLogin({
							nickName: ""
						});
						// console.log("app launch nologin")
					}
				},
				fail: function() {

				}
			})
			// #endif

			// #ifdef H5
			_this.ApiLogin({
				nickName: "模拟登陆"
			});

			// #endif





			// #ifdef MP-WEIXIN
			if (!wx.cloud) {
				console.error('wx.cloud 云能力 不支持')
			} else {
				console.info('wx.cloud 云能力 wx')
				wx.cloud.init({
					env: 'kkenv-uptx1',
					traceUser: true,
				})
			}
			// #endif

			// #ifndef MP-WEIXIN
			if (!uniCloud) {
				console.error('uniCloud 云能力 不支持')
			} else {
				console.info('uniCloud 云能力 alipay')
				uniCloud.init({
					provider: 'aliyun',
					spaceId: '8d40765c-350f-4d9d-8a9c-6a5e00448a4a',
					clientSecret: 'TqZDuijTqF232XbXPJI/xg=='
				});
			}
			// #endif


		},
		onShow: function() {
			console.error('App onShow')
		},
		onLoad: function() {
			console.error('App onLoad')
		},
		methods: {
			...mapActions(['ApiLogin'])

		}

	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0px 40upx 0px;
		justify-content: space-between;
	}

	.nav-li {
		padding: 30upx;
		border-radius: 12upx;
		width: 45%;
		margin: 0 2.5% 40upx;
		background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}

	.nav-li::after {
		content: "";
		position: absolute;
		z-index: -1;
		background-color: inherit;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: -10%;
		border-radius: 10upx;
		opacity: 0.2;
		transform: scale(0.9, 0.9);
	}

	.nav-li.cur {
		color: #fff;
		background: rgb(94, 185, 94);
		box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
	}

	.nav-title {
		font-size: 32upx;
		font-weight: 300;
	}

	.nav-title::first-letter {
		font-size: 40upx;
		margin-right: 4upx;
	}

	.nav-name {
		font-size: 28upx;
		text-transform: Capitalize;
		margin-top: 20upx;
		position: relative;
	}

	.nav-name::before {
		content: "";
		position: absolute;
		display: block;
		width: 40upx;
		height: 6upx;
		background: #fff;
		bottom: 0;
		right: 0;
		opacity: 0.5;
	}

	.nav-name::after {
		content: "";
		position: absolute;
		display: block;
		width: 100upx;
		height: 1px;
		background: #fff;
		bottom: 0;
		right: 40upx;
		opacity: 0.3;
	}

	.nav-name::first-letter {
		font-weight: bold;
		font-size: 36upx;
		margin-right: 1px;
	}

	.nav-li text {
		position: absolute;
		right: 30upx;
		top: 30upx;
		font-size: 52upx;
		width: 60upx;
		height: 60upx;
		text-align: center;
		line-height: 60upx;
	}

	.text-light {
		font-weight: 300;
	}

	@keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes show {
		0% {
			transform: translateY(-50px);
		}

		60% {
			transform: translateY(40upx);
		}

		100% {
			transform: translateY(0px);
		}
	}


	.title-bg {
		color: #ffffff;

		background-color: #fe0000;


		/* background-color: #eee; */
	}
</style>
