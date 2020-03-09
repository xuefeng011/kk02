<template>
	<view>
		<cu-custom bgColor="light bg-blue" :isBack="false">
			<block slot="backText">返回</block>
			<block slot="content">我的</block>
		</cu-custom>

		<view class="cu-card padding-top-sm">
			<view class="cu-item" style="margin:0;">
				<view class="cu-list menu-avatar" v-if="hasLogin">
					<view class="cu-item">
						<view class="cu-avatar round lg" :style="{ 'background-image': `url(${userInfo.avatarUrl})` }"></view>
						<view class="content flex-sub">
							<view class="text-grey" >{{ userInfo.nickName }}</view>
						</view>
					</view>
				</view>

				<view class="cu-list menu-avatar" v-else>
					<view class="cu-item">
						<view class="cu-avatar round lg"></view>
						<view class="content flex-sub">
							<button class="cu-btn text-grey" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">未登录,请登录</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="wxlogin padding" v-if="!hasLogin">
			<view class="flex flex-direction">
				<button class="cu-btn bg-green text-lg" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">微信一键登录</button>
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
					<text class="text-grey" >查看日志</text>
				</button>
			</view>
			<view class="cu-item">
				<button class="cu-btn content" >
					<text class="text-grey">当前版本 1.0.1</text>
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
		methods: {
			...mapActions(['ApiLogin']),
			async getuserinfo(e) {
				if (e.detail.userInfo) {
					this.$store.commit('login', e.detail.userInfo);
					console.log('Login 用户授权登录', e.detail.userInfo);
					await this.ApiLogin(e.detail.userInfo);
				}
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
