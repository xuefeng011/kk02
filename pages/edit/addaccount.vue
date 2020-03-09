<template>
<view>
    <cu-custom bgColor="light bg-blue" :isBack="true">
        <block slot="backText">返回</block>
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
            <view class="cu-list menu text-left">
                <view class="cu-item">
                    <view class="text-grey">{{title}}</view>
                </view>
                <view class="cu-item arrow" v-for="(item,index) in selects" :key="index">
                    <view class="content" @click="handleAddNewAccountModal(item)">
                        <view>{{item}}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</view>
</template>

<script>
import accounts from "../../utils/index.js";
import {uuid} from '../../utils/common.js'
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
					name:account.name,
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
			
			item._id=uuid()
            uni.navigateTo({
                url: `../edit/editaccount?item=${encodeURIComponent(JSON.stringify(item))}`
            });
        }
    }
};
</script>

<style>
</style>
