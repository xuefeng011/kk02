import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let hasopenid = true;
// #ifdef H5

hasopenid = false;

// #endif


const KKDBHIS = "kkhis"
const KKDB = 'kkmas'
const KKDBLOG = "kklog"
const KKDBCHART = "kkchart"

import accounts from '../utils/index.js'

// #ifdef MP-WEIXIN
import {
	getDb
} from '../utils/dbhelperwx.js'

// #endif

// #ifndef MP-WEIXIN
import {
	getDb
} from '../utils/dbhelper.js'

// #endif

import {
	calcData,
	formatDate,
	toDecimal
} from '../utils/common.js'


const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {
			openid: ""
		},
		mainData: {
			"zongzichan": 0,
			"jingzichan": 0,
			"fuzhai": 0,
			"isadmin": false,
			"issub":false,
			"subdesc":"",
			"details": []
		}
	},
	getters: {

	},
	mutations: {
		setMainData(state, data) {
			// console.log("mutation setMainData", data)
			Object.assign(state.mainData, data, {
				hasdb: true
			})

			// console.warn("mutation setMainData", state.mainData.fuzhai)
		},
		login(state, provider) {
			console.log("mutation login", provider)

			if (provider.nickName) {
				state.hasLogin = true;
				state.userInfo = provider;
				uni.setStorage({ //缓存用户登陆状态
					key: 'userInfo',
					data: provider
				})
				console.log(state.userInfo);
			}
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
		}
	},
	actions: {
		async ApiLogin({
			commit,

			state,
			dispatch
		}, data) {
			commit("login", data)
			await dispatch("ApiGetMainData");
			await dispatch("ApiInsertLoginData", Object.assign(data, {
				logtype: "login"
			}))
			return;
		},
		async ApiGetMainData({
			commit,
			state
		}, data) {

			if (!state.hasLogin) {
				return
			}

			return getDb({
				type: "get", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDB, //指定操作的数据表,
				hasopenid: hasopenid,
				openid: state.userInfo.openid,
				// indexKey:"1583457636830_0.08382568433942894_33575134-1583457639546_8_27177",
				condition: {},
				skip: 0,
				limit: 100,
				data: { //指定insert的数据
				}
			}).then(res => {
				// console.error("ApiGetMainData",res)
				if (res.length > 0) {
					commit("setMainData", res[0])
				} else {
					return true
				}
			}).catch(error => {
				console.warn("getDb error", error)
				return;
			})

		},
		async ApiInsertMainData({
			commit,
			state,
			dispatch
		}, data) {
			return getDb({
				type: "insert", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDB, //指定操作的数据表,
				hasopenid: hasopenid,
				openid: state.userInfo.openid,
				condition: data.condition,
				data: data.data
			}).then(async res => {
				return data.needrefresh ? await dispatch("ApiGetMainData") : true;

			}).catch(error => {
				console.warn("getDb error", error)
				return;
			})


		},
		async ApiUpdateMainData({
			commit,
			state,
			dispatch
		}, data) {
			delete data.data._id

			return getDb({
				type: "update", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDB, //指定操作的数据表,
				hasopenid: hasopenid,
				openid: state.userInfo.openid,
				condition: data.condition,
				data: data.data
			}).then(async res => {
				return data.needrefresh ? await dispatch("ApiGetMainData") : true;

			}).catch(error => {
				console.warn("getDb error", error)
				return;
			})


		},
		async ApiInsertLoginData({
			commit,
			state
		}, data) {
			const now = new Date();

			let env = "none"
			// #ifdef MP-ALIPAY
			env = "alipay"
			// #endif

			// #ifdef MP-WEIXIN
			env = "weixin"
			// #endif

			Object.assign(data, {
				createAt: formatDate(now),
				createAt2: now,
				env
			})
			return getDb({
				type: "insert", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDBLOG, //指定操作的数据表,
				hasopenid: hasopenid,
				openid: state.userInfo.openid,
				condition: {},
				data: data
			}).then(async res => {
				return true;

			}).catch(error => {
				console.warn("getDb error", error)
				return;
			})

		},
		async ApiSaveSubs({
			commit,
			state,
			dispatch
		}, data) {
			let now = new Date();
			Object.assign(state.mainData, {
				updateAt: formatDate(now),
				updateAt2: now
			},data)
			return await dispatch("ApiUpdateMainData", {
				condition: {},
				needrefresh: false,
				data: state.mainData
			})
		},
		async ApiSaveAccount({
			commit,
			state,
			dispatch
		}, data) {
			console.error("apiaddaccount", data, state.mainData)
			let oramoney = 0;
			const money = data.money;
			const oraMainData = state.mainData;
			let account = accounts.filter(p => p.type == data.type)[0]
			if (state.mainData.details && state.mainData.details.length > 0) {
				// 有参与记录
				console.log("有参与记录")
				let typeitem = state.mainData.details.filter(p => p.type == data.type);

				if (typeitem.length > 0) {
					// 有过该类型记录
					console.log("有过该类型记录")
					if (typeitem[0].details == undefined || typeitem[0].details == null) {
						typeitem[0].details = []
					}
					let q = typeitem[0].details.filter(p => p._id == data._id)
					if (q.length > 0) {
						oramoney = q[0].money;
						data.change = toDecimal(money - oramoney)
						Object.assign(q[0], data);
					} else {
						data.change = toDecimal(money - oramoney)
						typeitem[0].details.push(data);
					}


				} else {
					//未有该类型记录
					console.log("//未有该类型记录")
					data.change = toDecimal(money - oramoney)
					let tempitem = Object.assign({}, account, {
						_total: 0,
						details: [
							data
						]
					})
					state.mainData.details.push(tempitem);
				}
				console.log("更新数据", state.mainData)

				state.mainData = calcData(state.mainData)

				const now = new Date();
				await dispatch("ApiInsertHisData", {
					condition: {

					},
					data: Object.assign({}, data, {
						isdel: false,
						rid: data._id,
						createAt: formatDate(now),
						createAt2: now,
						date: formatDate(now, 'yyyy-MM-dd'),
						day: formatDate(now, 'dd'),
						year: formatDate(now, 'yyyy'),
						month: formatDate(now, 'MM')
					})
				})


				await dispatch("ApiSaveChartData", {
					condition: {
						date: formatDate(now, 'yyyy-MM-dd')
					},
					skip: 0,
					limit: 100,
					data: Object.assign({}, {
						jingzichan: state.mainData.jingzichan,
						fuzhai: state.mainData.fuzhai,
						zongzichan: state.mainData.zongzichan,
						chgjingzichan: toDecimal(state.mainData.jingzichan - oraMainData.jingzichan),
						chgfuzhai: toDecimal(state.mainData.fuzhai - oraMainData.fuzhai),
						chgzongzichan: toDecimal(state.mainData.zongzichan - oraMainData.zongzichan),
						details: state.mainData.details.map(p => {
							return {
								type: p.type,
								name: p.name,
								total: p._total,
								cnt: !p.details ? 0 : p.details.length
							}
						}),
						createAt: formatDate(now),
						createAt2: now,
						date: formatDate(now, 'yyyy-MM-dd'),
						day: formatDate(now, 'dd'),
						year: formatDate(now, 'yyyy'),
						month: formatDate(now, 'MM')
					})
				})

				await dispatch("ApiInsertLoginData", Object.assign({}, {
					logtype: "update",
					nickName: state.userInfo.nickName
				}))
				Object.assign(state.mainData, {
					updateAt: formatDate(now),
					updateAt2: now
				})
				return await dispatch("ApiUpdateMainData", {
					condition: {},
					needrefresh: false,
					data: state.mainData
				})



			} else {
				// 没有任何记录
				console.log("//没有任何记录")
				data.change = money - oramoney
				let tempitem = Object.assign({}, account, {
					_total: 0,
					details: [
						data
					]
				})

				Object.assign(state.mainData, {
					details: [tempitem]
				}, {
					jingzichan: 0,
					zongzichan: 0,
					fuzhai: 0
				})

				console.log("新增数据", state.mainData)

				state.mainData = calcData(state.mainData)


				const now = new Date();
				await dispatch("ApiInsertHisData", {
					condition: {

					},
					data: Object.assign({}, data, {
						isdel: false,
						rid: data._id,
						createAt: formatDate(now),
						createAt2: now,
						date: formatDate(now, 'yyyy-MM-dd'),
						day: formatDate(now, 'dd'),
						year: formatDate(now, 'yyyy'),
						month: formatDate(now, 'MM')
					})
				})

				await dispatch("ApiSaveChartData", {
					condition: {
						date: formatDate(now, 'yyyy-MM-dd')
					},
					skip: 0,
					limit: 100,
					data: Object.assign({}, {
						jingzichan: state.mainData.jingzichan,
						fuzhai: state.mainData.fuzhai,
						zongzichan: state.mainData.zongzichan,
						chgjingzichan: toDecimal(state.mainData.jingzichan - oraMainData.jingzichan),
						chgfuzhai: toDecimal(state.mainData.fuzhai - oraMainData.fuzhai),
						chgzongzichan: toDecimal(state.mainData.zongzichan - oraMainData.zongzichan),
						details: state.mainData.details.map(p => {
							return {
								type: p.type,
								name: p.name,
								total: p._total,
								cnt: !p.details ? 0 : p.details.length
							}
						}),
						createAt: formatDate(now),
						createAt2: now,
						date: formatDate(now, 'yyyy-MM-dd'),
						day: formatDate(now, 'dd'),
						year: formatDate(now, 'yyyy'),
						month: formatDate(now, 'MM')
					})
				})
				await dispatch("ApiInsertLoginData", Object.assign({}, {
					logtype: "create",
					nickName: state.userInfo.nickName
				}))
				Object.assign(state.mainData, {
					createAt: formatDate(now),
					createAt2: now,
					updateAt: formatDate(now),
					updateAt2: now
				})
				return await dispatch("ApiInsertMainData", {
					condition: {},
					needrefresh: false,
					data: state.mainData
				})


			}

		},
		async ApiDelAccount({
			commit,
			state,
			dispatch
		}, data) {
			console.error("apidelaccount", data, state.mainData)
			const oraMainData = state.mainData;
			let account = accounts.filter(p => p.type == data.type)[0]
			if (state.mainData.details && state.mainData.details.length > 0) {
				// 有参与记录
				console.log("有参与记录")
				let typeitem = state.mainData.details.filter(p => p.type == data.type);

				if (typeitem.length > 0 && !!typeitem[0].details && typeitem[0].details.length > 0) {
					// 有过该类型记录
					let q = typeitem[0].details.findIndex(p => p._id == data._id)
					if (q > -1) {

						typeitem[0].details.splice(q, 1)

					} else {
						return
					}


				} else {
					return
				}
				console.log("更新数据", state.mainData)

				state.mainData = calcData(state.mainData)

				const now = new Date();
				await dispatch("ApiInsertHisData", {
					condition: {

					},
					needrefresh: false,
					data: Object.assign({}, data, {
						isdel: true,
						money: 0,
						rid: data._id,
						createAt: formatDate(now),
						createAt2: now,
						date: formatDate(now, 'yyyy-MM-dd'),
						day: formatDate(now, 'dd'),
						year: formatDate(now, 'yyyy'),
						month: formatDate(now, 'MM')
					})
				})

				await dispatch("ApiSaveChartData", {
					condition: {
						date: formatDate(now, 'yyyy-MM-dd')
					},
					skip: 0,
					limit: 100,
					data: Object.assign({}, {
						jingzichan: state.mainData.jingzichan,
						fuzhai: state.mainData.fuzhai,
						zongzichan: state.mainData.zongzichan,
						chgjingzichan: toDecimal(state.mainData.jingzichan - oraMainData.jingzichan),
						chgfuzhai: toDecimal(state.mainData.fuzhai - oraMainData.fuzhai),
						chgzongzichan: toDecimal(state.mainData.zongzichan - oraMainData.zongzichan),
						details: state.mainData.details.map(p => {
							return {
								type: p.type,
								name: p.name,
								total: p._total,
								cnt: !p.details ? 0 : p.details.length
							}
						}),
						createAt: formatDate(now),
						createAt2: now,
						date: formatDate(now, 'yyyy-MM-dd'),
						day: formatDate(now, 'dd'),
						year: formatDate(now, 'yyyy'),
						month: formatDate(now, 'MM')
					})
				})
				Object.assign(state.mainData, {
					updateAt: formatDate(now),
					updateAt2: now
				})

				return await dispatch("ApiUpdateMainData", {
					condition: {},
					needrefresh: false,
					data: state.mainData
				})



			} else {
				return
			}
		},
		async ApiGetHisData({
			commit,
			state
		}, data) {

			return getDb({
				type: "get", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDBHIS, //指定操作的数据表,
				hasopenid: hasopenid,
				openid: state.userInfo.openid,
				// indexKey:"1583457636830_0.08382568433942894_33575134-1583457639546_8_27177",
				condition: data.condition,
				skip: data.skip,
				limit: data.limit,
				data: { //指定insert的数据
				}
			}).then(res => {
				return res;
			}).catch(error => {
				console.warn("getDb error", error)
				return [];
			})
		},
		async ApiInsertHisData({
			commit,
			state
		}, data) {
			const now = new Date();
			delete data.data._id
			Object.assign(data, {
				createAt: formatDate(now),
				createAt2: now
			})
			return getDb({
				type: "insert", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDBHIS, //指定操作的数据表,
				hasopenid: hasopenid,
				openid: state.userInfo.openid,
				condition: data.condition,
				data: data.data
			}).then(async res => {
				return true;

			}).catch(error => {
				console.warn("getDb error", error)
				return;
			})
		},
		async ApiGetChartData({
			commit,
			state
		}, data) {

			return getDb({
				type: "get", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDBCHART, //指定操作的数据表,
				hasopenid: hasopenid,
				openid: state.userInfo.openid,
				// indexKey:"1583457636830_0.08382568433942894_33575134-1583457639546_8_27177",
				condition: data.condition,
				skip: data.skip,
				limit: data.limit,
				data: { //指定insert的数据
				}
			}).then(res => {
				return res;
			}).catch(error => {
				console.warn("getDb error", error)
				return [];
			})
		},
		async ApiSaveChartData({
			commit,
			state
		}, data) {
			const now = new Date();
			Object.assign(data, {
				updateAt: formatDate(now),
				updateAt2: now
			})

			return getDb({
				type: "get", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDBCHART, //指定操作的数据表,
				hasopenid: hasopenid,
				openid: state.userInfo.openid,
				openid: state.userInfo.openid,
				// indexKey:"1583457636830_0.08382568433942894_33575134-1583457639546_8_27177",
				condition: data.condition,
				skip: data.skip,
				limit: data.limit,
				data: { //指定insert的数据
				}
			}).then(async res => {

				if (res.length <= 0) {

					return getDb({
						type: "insert", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
						db: KKDBCHART, //指定操作的数据表,
						hasopenid: hasopenid,
						openid: state.userInfo.openid,
						condition: data.condition,
						data: data.data
					}).then(async res => {

						return true;

					}).catch(error => {
						console.warn("getDb error", error)
						return;
					})
				} else {

					return getDb({
						type: "update", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
						db: KKDBCHART, //指定操作的数据表,
						hasopenid: hasopenid,
						openid: state.userInfo.openid,
						condition: data.condition,
						data: data.data
					}).then(async res => {

						return true;

					}).catch(error => {
						console.warn("getDb error", error)
						return;
					})
				}

			}).catch(error => {
				console.warn("getDb error", error)
				return false
			})

		},
		async ApiGetLogData({
			commit,
			state
		}, data) {

			return getDb({
				type: "get", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDBLOG, //指定操作的数据表,
				hasopenid: false,
				openid: state.userInfo.openid,
				// indexKey:"1583457636830_0.08382568433942894_33575134-1583457639546_8_27177",
				condition: data.condition,
				skip: data.skip,
				limit: data.limit,
				data: { //指定insert的数据
				}
			}).then(res => {
				return res;
			}).catch(error => {
				console.warn("getDb error", error)
				return [];
			})
		}

	}


});
export default store
