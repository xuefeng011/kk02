<template>
    <view class="main">
        <view class="swiper">
            <swiper class="swiper-list" indicator-dots indicator-color="#eee" indicator-active-color="#fa436a" interval="5000" :autoplay="autoplay" :duration="duration" @change="swiperChange">
                <swiper-item v-for="(item, index) in swiperList" :key="index">
                    <view class="swiper-item">
                        <view class="swiper-item-img">
                            <image :src="item.imgUrl"></image>
                        </view>
                    </view>
                </swiper-item>
            </swiper>
            
            <view class="jumpover" @tap="launchFlag()" v-if="swiperCurrent+1 < swiperLength">{{ jumpover }}</view>
            <view class="experience" @tap="launchFlag()" v-if="swiperCurrent+1 == swiperLength">{{ experience }}</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            titleNViewBackground: '',
            swiperCurrent: 0,
            swiperLength: 0,
            swiperList: [
                {
                    imgUrl: '../../static/guide/img1.jpg',
                    bgColor: ''
                },
				{
				    imgUrl: '../../static/guide/img2.jpg',
				    bgColor: ''
				}
            ],
            autoplay: false,
            duration: 500,
            jumpover: '跳过',
            experience: '立即体验'
        };
    },
    onLoad() {
        this.swiperLength = this.swiperList.length;
        // this.titleNViewBackground = this.swiperList[0].bgColor;
    },
    methods: {
        //轮播图切换修改背景色
        swiperChange(e) {
            const index = e.detail.current;
            this.swiperCurrent = index;
            this.swiperLength = this.swiperList.length;
            // this.titleNViewBackground = this.swiperList[index].bgColor;
        },
        launchFlag: function() {
            /**
             * 向本地存储中设置launchFlag的值，即启动标识；
             */
            uni.setStorage({
                key: 'launchFlag',
                data: true
            });
            uni.switchTab({
                url: '/pages/index/index'
            });
        }
    }
};
</script>
<style>
page,
.main {
    width: 100%;
    height: 100%;
    padding: 0;
    background-size: 100% auto;
}

.swiper{
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #fff;
}

.swiper-list {
    width: 100%;
    height: 100%;
}

.swiper-item {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;
}

.swiper-item-img {
    justify-content: center;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

.swiper-item-img image {
    width: 100%;
    height: 100%;
}

.jumpover,
.experience {
    position: absolute;
    z-index: 999;
    height: 60rpx;
    line-height: 60rpx;
    padding: 0 40rpx;
    font-size: 32rpx;
    color: #fff;
    border: 2rpx solid #fff;
    border-radius: 30rpx;
}

.jumpover {
    right: 30rpx;
    top: 90rpx;
}

.experience {
    right: 50%;
    bottom: 140rpx;
    margin-right: -116rpx;
}
</style>
