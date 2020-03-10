function loginMp() {
	// uni.showLoading({
	// 	title: '登录中...'
	// })
	return new Promise((resolve, reject) => {
		let _openid = uni.getStorageSync('openid')
		console.log("_openid", _openid)
		if (_openid && _openid.length > 0) {
			console.log("_openid has in storage", _openid)
			return resolve(_openid);
		}

		getCode().then((code) => {
			console.log('code', code);
			return uniCloud.callFunction({
				name: 'loginwx',
				data: {
					code
				}
			})
		}).then((res) => {
			// uni.hideLoading()
			console.log("loginwx", res);

			if (res.result.status !== 0) {
				return reject(new Error(res.result.msg))
			}
			uni.setStorageSync('openid', res.result.openid)
			console.log("openid storage succ", res.result.openid);
			return resolve(res.result.openid)
			// uni.showModal({
			// 	content: '登录成功，token已存储',
			// 	showCancel: false
			// })
		}).catch((err) => {
			console.log(err);
			reject("error")
			// uni.hideLoading()
			uni.showModal({
				content: '出现错误，请稍后再试.' + err.message,
				showCancel: false
			})
		})
	})
}

function getCode() {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success(e) {
				if (e.code) {
					resolve(e.code)
				} else {
					reject(new Error('微信登录失败'))
				}
			},
			fail(e) {
				reject(new Error('微信登录失败'))
			}
		})
	})
}

function loginAlipay() {
	return new Promise((resolve, reject) => {
		let _openid = uni.getStorageSync('openid')
		console.log("_openid", _openid)
		if (_openid && _openid.length > 0) {
			console.log("_openid has in storage", _openid)
			return resolve(_openid);
		}
		my.getAuthCode({
			scopes: 'auth_base',
			success: async (authinfo) => {
				console.error("auth_base authCode", authinfo.authCode)
				uni.setStorageSync('openid', authinfo.authCode)
				console.log("openid storage succ", authinfo.authCode);
				return resolve(authinfo.authCode)

			},
			fail() {
				return reject("")
			}
		});

	});
}

export {
	loginMp,
	loginAlipay
}
