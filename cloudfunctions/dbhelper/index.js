// runDB云函数入口文件
const cloud = require('wx-server-sdk')

const env = cloud.DYNAMIC_CURRENT_ENV;

cloud.init({
	env: env
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

	const wxContext = cloud.getWXContext()

	let _openid = wxContext.OPENID;
	let hasopenid = event.hasopenid;
	console.error("db start", event, _openid)

	const targetDB = db.collection(event.db)
	try {
		if (event.type == "insert") {
			if (hasopenid) {
				Object.assign(event.data, {
					_openid
				})
			}
			return await targetDB.add({
				data: event.data
			})
		}

		if (event.type == "update" && event.indexKey) {
			return await targetDB.doc(event.indexKey).update({
				data: event.data
			})
		}

		if (event.type == "update" && !event.indexKey) {
			if (hasopenid) {
				Object.assign(event.condition, {
					_openid
				})
			}
			return await targetDB.where(event.condition).update({
				data: event.data
			})
		}

		if (event.type == "delete") {
			if (hasopenid) {
				Object.assign(event.condition, {
					_openid
				})
			}
			return await targetDB.where(event.condition).remove()
		}

		if (event.type == "get") {
			if (hasopenid) {
				Object.assign(event.condition, {
					_openid
				})
			}
			return await targetDB.where(event.condition)
				.skip(20 * event.skip)
				.limit(event.limit)
				.get()
		}
	} catch (e) {
		console.error(e, event)
		return {
			"errMsg": "error",
			"details": JSON.stringify(e),
			"result": "参数错误"
		}
	}
}
