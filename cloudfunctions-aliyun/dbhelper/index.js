// runDB云函数入口文件

	console.log("db start uniCloud init")
	
	
// const cloud = require('wx-server-sdk')

// const env = uniCloud.DYNAMIC_CURRENT_ENV;

// cloud.init({
// 	env: env
// })
const db = uniCloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

	// const wxContext = uniCloud.getWXContext()

	let hasopenid = event.hasopenid;
	let _openid = event.openid;
	console.log("db start uniCloud 2", event,context, _openid)

	const targetDB = db.collection(event.db)
	try {
		if (event.type == "insert") {
			if (hasopenid) {
				Object.assign(event.data, {
					_openid
				})
			}
			return await targetDB.add(event.data)
		}

		if (event.type == "update" && event.indexKey) {
			return await targetDB.doc(event.indexKey).update( event.data)
		}

		if (event.type == "update" && !event.indexKey) {
			if (hasopenid) {
				Object.assign(event.condition, {
					_openid
				})
			}
			return await targetDB.where(event.condition).update( event.data)
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
			return  await targetDB.where(event.condition)
			  .orderBy(event.sortfield||'_id', event.sorttype||'desc')
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
