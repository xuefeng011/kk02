import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let hasopenid = true;
// #ifdef H5

hasopenid = false;

// #endif


const KKDBHIS = "kkhis"
const KKDB = 'kkmas'
const KKLOG = "kklog"

import defaultdata from '../utils/defaultdata.js'
import accounts from '../utils/index.js'

import {
	getDb
} from '../utils/dbhelper.js'


import {
	calcData,
	formatDate
} from '../utils/common.js'


const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		mainData: {
			"zongzichan": 0,
			"jingzichan": 0,
			"fuzhai": 0,
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

			console.warn("mutation setMainData", state.mainData.fuzhai)
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
			await dispatch("ApiInsertLoginData", data)
			return;
		},
		async ApiGetMainData({
			commit,
			state
		}, data) {

			if (!state.hasLogin) {
				return
			}

			getDb({
				type: "get", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDB, //指定操作的数据表,
				hasopenid: hasopenid,
				// indexKey:"1583457636830_0.08382568433942894_33575134-1583457639546_8_27177",
				condition: {},
				skip: 0,
				limit: 100,
				data: { //指定insert的数据
				}
			}).then(res => {
				if (res.length > 0) {
					commit("setMainData", res[0])
				}
				return true
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
			getDb({
				type: "insert", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDB, //指定操作的数据表,
				hasopenid: hasopenid,
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

			getDb({
				type: "update", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKDB, //指定操作的数据表,
				hasopenid: hasopenid,
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
			Object.assign(data, {
				createAt: formatDate(now),
				createAt2: now
			})
			getDb({
				type: "insert", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db: KKLOG, //指定操作的数据表,
				hasopenid: hasopenid,
				condition: {},
				data: data
			}).then(async res => {
				return true;

			}).catch(error => {
				console.warn("getDb error", error)
				return;
			})

		},
		async ApiSaveAccount({
			commit,
			state,
			dispatch
		}, data) {
			console.error("apiaddaccount", data, state.mainData)
			let account = accounts.filter(p => p.type == data.type)[0]
			if (state.mainData.details && state.mainData.details.length > 0) {
				// 有参与记录
				console.log("有参与记录")
				let typeitem = state.mainData.details.filter(p => p.type == data.type);

				if (typeitem.length > 0 && !!typeitem[0].details && typeitem[0].details.length > 0) {
					// 有过该类型记录
					let q = typeitem[0].details.filter(p => p._id == data._id)
					if (q.length > 0) {
						Object.assign(q[0], data);
					} else {
						typeitem[0].details.push(data);
					}


				} else {
					//未有该类型记录
					console.log("//未有该类型记录")
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
					needrefresh: false,
					data: Object.assign({}, data, {
						rid: data._id,
						createAt: formatDate(now),
						createAt2: now,
						date: formatDate(now, 'yyyy-MM-dd'),
						day: formatDate(now, 'dd'),
						year: formatDate(now, 'yyyy'),
						month: formatDate(now, 'MM')
					})
				})

				return await dispatch("ApiUpdateMainData", {
					condition: {},
					needrefresh: false,
					data: state.mainData
				})



			} else {
				// 没有任何记录
				console.log("//没有任何记录")
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
					fuzhai:0
				})

				console.log("新增数据", state.mainData)

				state.mainData = calcData(state.mainData)


				const now = new Date();
				await dispatch("ApiInsertHisData", {
					condition: {

					},
					needrefresh: false,
					data: Object.assign({}, data, {
						rid: data._id,
						createAt: formatDate(now),
						createAt2: now,
						date: formatDate(now, 'yyyy-MM-dd'),
						day: formatDate(now, 'dd'),
						year: formatDate(now, 'yyyy'),
						month: formatDate(now, 'MM')
					})
				})
				return await dispatch("ApiInsertMainData", {
					condition: {},
					needrefresh: false,
					data: state.mainData
				})


			}

		},
		async ApiGetHisData({
			commit,
			state
		}, data) {
			return new Promise((resolve, reject) => {
				getDb({
					type: "get", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
					db: KKDBHIS, //指定操作的数据表,
					hasopenid: hasopenid,
					// indexKey:"1583457636830_0.08382568433942894_33575134-1583457639546_8_27177",
					condition: data.condition,
					skip: data.skip,
					limit: data.limit,
					data: { //指定insert的数据
					}
				}).then(res => {
					// console.error(res,'get his')
					return resolve(res);
				}).catch(error => {
					console.warn("getDb error", error)
					return reject(error);
				})

			})

		},
		async ApiInsertHisData({
			commit,
			state
		}, data) {
			return new Promise((resolve, reject) => {
				delete data.data._id
				Object.assign(data, {
					createAt: new Date()
				})
				getDb({
					type: "insert", //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
					db: KKDBHIS, //指定操作的数据表,
					hasopenid: hasopenid,
					condition: data.condition,
					data: data.data
				}).then(async res => {
					return true;

				}).catch(error => {
					console.warn("getDb error", error)
					return;
				})
			})
		}
	}
})

export default store
