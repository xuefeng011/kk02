<template>
	<view>
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText"><text class="">返回</text></block>
			<block slot="content">{{item.name}}</block>
		</cu-custom>

		<view class="cu-item bg-white flex row padding">
			<view :class="account.icon" class=" acion text-orange round text-xsl" style="font-size:80upx;"></view>
			<view class="flex flex-direction flex-sub margin-left-sm self-center" style="align-self:center;">
				<view class="action text-lg">{{ item.name }}</view>
				<view class="action text-gray text-lg" v-if="item.desc">{{ item.desc }}</view>
			</view>
			<view class="">
				<view class="cu-tag line-orange radius self-center">{{ account.name }}</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-top dashed-bottom">
			<view class="action">
				<text class="text-l">当前{{account.subtitle}}</text>
				<text class="text-price text-xl padding-left-sm">{{ item.money }}</text>
			</view>
			<view class="acion"><button class="cu-btn margin-right-sm bg-yellow text-white" @click="handleShowUpdatePrice">更新余额</button></view>
		</view>

		<view class="cu-modal" :class="showModal ? 'show' : ''">
			<view class="cu-dialog">
				<!-- <view class="cu-bar bg-white justify-end">
					<view class="content">Modal标题</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view> -->
				<view class="padding-xl bg-white">
					<view class="cu-form-group text-xxl">
						<view class="title">输入{{account.subtitle}}：</view>
						<input class="text-xxl text-price" name="input" type="digit" v-model.number="editmoney" :placeholder="`请输入当前${account.subtitle}`" />
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="handleUpdatePrice">确定</button>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-orange"></text>
				更新记录
			</view>
		</view>
		<view class="cu-list menu" >
			<view class="cu-item" v-for="item in hisList" :key="item._id">
				<view class="content">
					<text class="text-gray">更新{{account.subtitle}}为：</text>
					<text class="text-grey text-price">{{item.money}}</text></view>
				<view class="action"><text class="text-grey text-sm">{{item.date}}</text></view>
			</view>
			
		</view>
		
		<view class="cu-bar foot flex text-center row bg-white" >
			<view class="action flex-sub" style="border-right:2px solid #eee;" @click="handleEditAccount">
				<text class="text-grey">编辑</text>
			</view>
			<view class="action flex-sub">
				<text class="text-grey">删除资产</text>
			</view>
		</view>
		
	</view>
</template>

<script>
import accounts from '../../utils/index.js';

import { mapActions } from 'vuex';

export default {
	data() {
		return {
			showModal: false,
			account: {},
			item: {
				bank: '请选择',
				cardno: '',
				money: 0,
				name: '',
				remark: '',
				type: 0,
				_id: ''
			},
			editmoney: 0,
			hisList:[]
		};
	},
	async onLoad(option) {
		const item = JSON.parse(decodeURIComponent(option.item));

		console.warn('item', item);

		if (item.type > 0) {
			this.account = accounts.filter(p => p.type == item.type)[0];
			this.item = Object.assign({}, item);
			await this.getHistoryList()
		} else {
			uni.showModal({
				title: '类型不正确',
				success() {
					uni.navigateBack();
				}
			});
		}
	},
	methods: {
		...mapActions(['ApiSaveAccount','ApiGetHisData','ApiInsertHisData']),
		handleShowUpdatePrice() {
			this.showModal = true;
		},
		async handleUpdatePrice() {
			console.log('提交', this.editmoney);
			if (isNaN(Number(this.editmoney))) {
				uni.showModal({
					title: '金额不正确',
					success() {}
				});
			} else {
				this.item.money = this.editmoney;
			}
			uni.showLoading({
				mask: true
			});
			await this.ApiSaveAccount(this.item);
			await this.getHistoryList()
			uni.hideLoading();

			this.editmoney = 0;
			this.showModal = false;
		},
		hideModal() {
			this.showModal = false;
		},
		async getHistoryList(){
		  let res=	await this.ApiGetHisData({
			  
			  	condition:{
			  		rid:this.item._id
			  	},
			  	skip:0,
			  	limit: 99
			  
		  })
		  console.error("his11",res)
		  this.hisList=res;
		},
		handleEditAccount(){
			this.gotoEdit(this.item)
		},
		gotoEdit(item) {
			
			
		    uni.navigateTo({
		        url: `../edit/editaccount?item=${encodeURIComponent(JSON.stringify(item))}`
		    });
		}
	}
};
</script>

<style></style>
