function getDb({
	type,
	db,
	hasopenid,
	openid,
	condition,
	skip,
	limit,
	data
}, cloudfunctionname = "dbhelper") {
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({
			name: cloudfunctionname,
			data: {
				type, //指定操作是insert/update:indexKey/get:condition,skip,limit/delete:condition
				db, //指定操作的数据表,
				hasopenid,
				openid,
				// indexKey:"1583457636830_0.08382568433942894_33575134-1583457639546_8_27177",
				condition,
				skip,
				limit,
				data
			},
			success: res => {

				// if (res.errMsg == "cloud.callFunction:ok" && res.result != null && res.result.errMsg.indexOf("ok") > -1) {

				// 	return resolve(res.result.data)

				// } else {
				// 	return reject('[云函数] [dbhelper] 调用失败 ' + JSON.stringify(res))
				// }
				// console.error('[云函数] [dbhelper] 调用成功',res)
				if(res.success){
						return resolve(res.result.data)
				}else{
					return reject("error")
				}
			},
			fail: err => {
				// console.error('[云函数] [dbhelper] 调用失败',err)
				return reject('[云函数] [dbhelper] 调用失败 ' + JSON.stringify(err))
			}
		})

	})
}

export {
	getDb
}
