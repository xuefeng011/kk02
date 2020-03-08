<template>
	<view>
		<cu-custom bgColor="bg-white" :isBack="false">
			<block slot="backText">返回</block>
			<block slot="content">我的</block>
		</cu-custom>

		<view class="cu-card case">
			<view class="cu-item shadow">
				<view class="cu-list menu-avatar" v-if="hasLogin">
					<view class="cu-item">
						<view class="cu-avatar round lg" :style="{ 'background-image': `url(${userInfo.avatarUrl})` }"></view>
						<view class="content flex-sub">
							<view class="text-grey">{{ userInfo.nickName }}</view>
						</view>
					</view>
				</view>

				<view class="cu-list menu-avatar" v-else>
					<view class="cu-item">
						<view class="cu-avatar round lg"></view>
						<view class="content flex-sub"><view class="text-grey">未登录</view></view>
					</view>
				</view>
			</view>
		</view>
		<view class="wxlogin padding" v-if="!hasLogin">
			<view class="flex flex-direction">
				<button class="cu-btn bg-green text-lg" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">微信一键登录</button>
			</view>
		</view>
	</view>
</template>

<script>
import defaultdata from '../../utils/defaultdata.js';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
export default {
	computed: { ...mapState(['hasLogin', 'userInfo']) },

	data() {
		return {
			openid: ''
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
