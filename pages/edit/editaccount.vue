<template>
<view>
    <cu-custom bgColor="bg-white" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">编辑资产</block>
    </cu-custom>
    <view class=" margin-top">
        <view class="cu-form-group" v-show="hasselect">
            <view class="title">{{selecttitle}}：</view>
            <input :placeholder="selecttitle" name="input" disabled v-model="formData.name" />
        </view>
        <view class="cu-form-group" v-show="!hasselect">
            <view class="title">名称：</view>
            <input placeholder="名称" name="input" v-model="formData.name" />
        </view>
        <!-- <view class="cu-form-group" v-show="type==2||type==3">
            <view class="title">银行卡：</view>
            <picker @change="PickerBank" v-model="formData.bank" :range="banks">
                <view class="picker">
                    {{formData.bank}}
                </view>
            </picker>
        </view> -->
        <view class="cu-form-group" v-show="type==2||type==3">
            <view class="title">标识/卡号：</view>
            <input placeholder="标识/卡号" v-model="formData.cardno" name="input" />
        </view>
        <view class="cu-form-group">
            <view class="title">备注：</view>
            <input placeholder="备注" name="input" v-model="formData.desc" />
        </view>
        <view class="cu-form-group">
            <view class="title">{{account.subtitle}}：</view>
            <input :placeholder="`请输入当前${account.subtitle}`" name="input" type="digit" v-model.number="formData.money" />
        </view>
        <view class="padding flex flex-direction">
            <button class="cu-btn bg-grey lg" @tap="submit">提交</button>
        </view>

    </view>
</view>
</template>

<script>
import accounts from '../../utils/index.js'

import {
		mapActions
	} from 'vuex';


export default {

    data() {
        return {
			account:{},
            formData: {
                type: 0,
                bank: '请选择',
                cardno: "",
                desc: "",
                name: "",
				money:0
            }
        };
    },
    onLoad(option) {
        const item = JSON.parse(decodeURIComponent(option.item));

        console.warn("item", item)
        let {
			_id,
            hasselect,
            type,
            selecttitle,
            name
        } = item;

        Object.assign(this.formData, item)
		
        this.selecttitle = selecttitle;
        this.hasselect = hasselect
		this.account=accounts.filter(p=>p.type==type)[0]
    },
    computed: {

    },
    methods: {
		...mapActions(["ApiSaveAccount"]),
        async submit() {
			
			uni.showLoading({
				mask:true
				
			})
			console.log("提交", this.formData)
			if(isNaN(Number(this.formData.money))){
				this.formData.money=0;
			}
			let res=await this.ApiSaveAccount(this.formData)
			
			uni.showToast({
				title:"保存成功",
				icon:"none",
				success(){
					uni.hideLoading()
					console.log("xxxxxxxxx")
					uni.switchTab({
						url:"../index/index"
					})
				}
			})
        }
        // PickerBank(e) {
        //     this.formData.bank = this.banks[e.detail.value]
        // }
    }
}
</script>

<style scoped>
.cu-form-group .title {
    min-width: calc(4em + 35px);
    text-align: right;
}
</style>
