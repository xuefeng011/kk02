<template>
	<view>
		<cu-custom bgColor="title-bg" :isBack="true" :isHome="false">
			<block slot="backText"></block>
			<block slot="homeText"></block>
			<block slot="content">添加资产</block>
		</cu-custom>

		<view class="cu-list menu sm-border">
			<view class="cu-item arrow" v-for="account in accounts" :key="account.type">
				<view class="content flex row" hover-class="none" @click="handleAddNewAccount(account)">
					<text class="text-orange" :class="account.icon"></text>

					<view class="text-grey flex text-l">
						<view class="text-grey">{{account.name}}</view>
						<view v-if="account.desc" class="text-gray text-sm justify-between padding-left-sm">{{account.desc}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-modal drawer-modal justify-end" :class="modalName=='DrawerModalR'?'show':''" @tap="hideModal">
			<view class="cu-dialog basis-lg" @tap.stop :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
				<scroll-view scroll-y class="DrawerWindow" :style="[{height:'calc(100vh - ' + CustomBar + 'px)'}]">
					<view class="cu-list menu text-left">
						<view class="cu-item">
							<view class="text-grey">{{title}}</view>
						</view>
						<view class="cu-item arrow" v-for="(item,index) in selects" :key="index">
							<view class="content" @click="handleAddNewAccountModal(item)">
								<view class="">{{item}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import accounts from "../../utils/index.js";
	import {
		uuid
	} from '../../utils/common.js'
	export default {
		components: {},
		data() {
			return {
				accounts,
				showDrawer: false,
				CustomBar: this.CustomBar,
				modalName: null,
				title: "xxx",
				selects: [],
				selectItem: {

				}
			};
		},
		onLoad() {
			// #ifdef MP-ALIPAY

			uni.setNavigationBar({
				reset: true,
				backgroundColor: '#fe0000',
				frontColor:"#ffffff",
				
				title: "添加资产"
			});
			
			uni.setNavigationBarColor({
				backgroundColor: '#fe0000',
				frontColor:"#ffffff"
			})
			// #endif
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal(e) {
				this.modalName = null;
			},
			handleAddNewAccount(account) {
				console.warn("handleAddNewAccount", account);

				if (account.selects && account.selects.list) {
					this.selects = account.selects.list;
					this.title = account.selects.title;
					this.modalName = "DrawerModalR";
					this.selectItem = {
						type: account.type,
						hasselect: true,
						selecttitle: this.title
					}
				} else {
					this.selectItem = {
						name: account.name,
						type: account.type,
						hasselect: false,
						selecttitle: ""
					}
					this.gotoEdit(this.selectItem)
				}

			},
			handleAddNewAccountModal(item) {
				console.warn("handleAddNewAccountModal", item);

				this.selectItem.name = item;

				this.gotoEdit(this.selectItem)

			},
			gotoEdit(item) {

				item._id = uuid()
				uni.navigateTo({
					url: `../edit/editaccount?item=${encodeURIComponent(JSON.stringify(item))}`
				});
			}
		}
	};
</script>

<style scoped>
	.DrawerWindow {
		position: absolute;
		width: 85vw;
		height: 100vh;
		left: 0;
		top: 0;

		transition: all 0.4s;

		transform: scale(0.9, 0.9);
		box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}
</style>
