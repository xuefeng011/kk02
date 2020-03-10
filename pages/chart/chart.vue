<template>
	<view>
		<cu-custom bgColor="title-bg" :isBack="false" :isHome="true">
			<block slot="backText"></block>
			<block slot="homeText"></block>
			<block slot="content">报表</block>
		</cu-custom>
		<view class="solids-bottom flex align-center" v-if="!hasLogin || !hasdata">
			
			<view class="flex-sub text-center">
				<view class="solid-bottom text-xsl padding">
					<text class="cuIcon-roundclose text-red"></text>
				</view>
				<view class="padding text-gray">暂无数据</view>
			</view>
		</view>


		<view class="linecharts">
			<!--#ifdef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
			 :style="{'width':cWidth+'px','height':cHeight+'px'}" disable-scroll=true @touchstart="touchLineA" @touchmove="moveLineA"
			 @touchend="touchEndLineA"></canvas>
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" disable-scroll=true @touchstart="touchLineA"
			 @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			<!--#endif-->
		</view>

		<view class="detailbox">
			<view class="piecharts">
				<!--#ifdef MP-ALIPAY -->
				<canvas canvas-id="canvasRing" id="canvasRing" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth2*(pixelRatio-1)/2+'px','margin-top':-cHeight2*(pixelRatio-1)/2+'px'}"
				 @touchstart="touchRing"></canvas>
				<!--#endif-->
				<!--#ifndef MP-ALIPAY -->
				<canvas canvas-id="canvasRing" id="canvasRing" class="charts" @touchstart="touchRing"></canvas>
				<!--#endif-->
			</view>
		</view>

	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapMutations
	} from 'vuex';
	import accounts from '../../utils/index.js'

	import {
		delay,
		orderBy
	} from '../../utils/common.js'

	import uCharts from '@/components/u-charts/u-charts.min.js';

	var _self;
	var canvaLineA = null;
	var canvaRing = null;


	export default {
		computed: {
			...mapState(['hasLogin', 'userInfo', 'mainData'])
		},
		components: {},
		onLaunch: function() {},
		onShow: function() {
			this.checkLogin()
			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});

		},
		onLoad() {
			_self = this;
			console.error("chart onload")
			
			// #ifdef MP-ALIPAY
	
			uni.setNavigationBar({
				reset: true,
				backgroundColor: '#fe0000',
				frontColor:"#ffffff",
				title: "报表"
			});
			uni.setNavigationBarColor({
				backgroundColor: '#fe0000',
				frontColor:"#ffffff"
			})
			// #endif
			
			
			let _this = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function(res) {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio = 2;
					}
				}
			});
			//#endif
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);

			this.cWidth2 = uni.upx2px(750);
			this.cHeight2 = uni.upx2px(500);

			console.error("chart onload 2")

			_this.getData()

		},
		data() {
			return {
				cWidth: '',
				cWidth2: '',
				cHeight: '',
				cHeight2: '',
				pixelRatio: 1,
				chartlist: [],
				hasdata:false
			};
		},
		methods: {
			...mapActions(['ApiGetChartData']),
			checkLogin() {
				if (this.hasLogin) {
					console.log('tapHome haslogin');
					return true;
				} else {
					console.log('tapHome notlogin');
					uni.showToast({
						icon: 'none',
						title: '请登录'
					});
					uni.switchTab({
						url: '/pages/login/login'
					});
					return false;
				}
			},
			async getData() {
				console.error("getData")

				if (!this.hasLogin) {
					return;
				}
				let _this = this;
				let list = await this.ApiGetChartData({
					condition: {

					},
					skip: 0,
					limit: 100
				});

				if (list.length <= 0) {
					this.hasdata=false;
					return
				}
				this.hasdata=true;
				list = orderBy(list, 'date', 'asc')
				// console.error("xx", list)
				let result = {}
				let categories = []
				let series = [{
						name: "总资产",
						data: []
					},
					{
						name: "负债",
						data: []
					}, {
						name: "净资产",
						data: []
					}
				]

				list.map((item, index) => {
					categories.push(item.date)
					series[0]['data'].push(item.zongzichan)
					series[1]['data'].push(-item.fuzhai)
					series[2]['data'].push(item.jingzichan)
				})



				Object.assign(result, {
					categories,
					series
				})

				_this.chartlist = list;
				console.error("result", result);

				_this.showLineA("canvasLineA", result);
				_this.showDetails(list[list.length - 1]["date"])

			},
			showLineA(canvasId, chartData) {

				canvaLineA = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'line',
					fontSize: 11,
					padding: [15, 15, 0, 15],
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 5,
					},
					dataLabel: true,
					dataPointShape: true,
					dataPointShapeType: 'hollow',
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					enableScroll: false, //开启图表拖拽功能
					xAxis: {
						disableGrid: false,
						type: 'grid',
						gridType: 'dash',
						itemCount: 3,
						scrollShow: false,
						scrollAlign: 'left',
						labelCount: 3
					},
					yAxis: {
						gridType: 'dash',
						format: (val) => {
							return val == 0 ? "0" : ""
						}
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						line: {
							type: 'straight'
						},
						markLine: {
							type: 'solid',
							dashLength: 5,
							data: [{
								value: 0,
								lineColor: '#f04864',
								showLabel: true
							}]
						}
					},

				});

			},
			touchLineA(e) {
				canvaLineA.scrollStart(e);
			},
			moveLineA(e) {
				canvaLineA.scroll(e);
			},
			touchEndLineA(e) {
				canvaLineA.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				canvaLineA.touchLegend(e);
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});

				var dateindex = canvaLineA.getCurrentDataIndex(e);
				// console.log("touch",xx,canvaLineA.opts.categories[xx]);
				if (dateindex >= 0) {
					this.showDetails(canvaLineA.opts.categories[dateindex])
				}
			},
			showDetails(date) {
				console.log(this.chartlist)
				if (this.chartlist) {
					let dateitem = this.chartlist.filter(p => p.date == date)
					// console.error(date, dateitem)

					let chartdata = {
						series: []
					}

					if (dateitem.length > 0) {
						dateitem[0]["details"].map(item => {
							chartdata.series.push({
								name: item.name,
								data: item.total
							})
						})
					}

					this.showRing("canvasRing", chartdata, date)


				}
			},
			// changeData() {

			// 	let newdata = {}
			// 	canvaLineA.updateData({
			// 		series: newdata.series,
			// 		categories: newdata.categories,
			// 		scrollPosition: 'right',
			// 		animation: false
			// 	});

			// },
			async onPullDownRefresh() {
				console.log('onPullDownRefresh');
				await this.getData();
				uni.stopPullDownRefresh();

			},
			showRing(canvasId, chartData, date) {
				canvaRing = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'ring',
					fontSize: 11,
					padding: [5, 5, 5, 5],
					legend: {
						show: true,
						position: 'right',
						float: 'center',
						itemGap: 10,
						padding: 5,
						lineHeight: 26,
						margin: 5,
						//backgroundColor:'rgba(41,198,90,0.2)',
						//borderColor :'rgba(41,198,90,0.5)',
						borderWidth: 1
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: false,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
					// subtitle: {
					// 	name: '70%',
					// 	color: '#7cb5ec',
					// 	fontSize: 25*_self.pixelRatio,
					// },
					title: {
						name: date.substr(5, 5),
						color: '#666666',
						fontSize: 10 * _self.pixelRatio,
					},
					extra: {
						pie: {
							offsetAngle: 0,
							ringWidth: 30 * _self.pixelRatio,
							labelWidth: 15
						}
					},
				});
			},
			touchRing(e) {
				canvaRing.touchLegend(e, {
					animation: false
				});
				canvaRing.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			}
		},

	}
</script>

<style scoped>
	.linecharts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.piecharts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
</style>
