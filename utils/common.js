import accounts from './index.js'

function uuid() {


	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;

}

function diffday(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式  
	var dateSpan,
		tempDate,
		iDays;
	sDate1 = Date.parse(paseDate(sDate1));
	sDate2 = Date.parse(paseDate(sDate2));
	dateSpan = sDate2 - sDate1;
	dateSpan = Math.abs(dateSpan);
	iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
	return iDays
};

function paseDate(str) {
	return str.replace(/-/gi, '/')
}

function delay(timer) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve()
		}, timer)
	})
}

function sum(arr, field) {
	if (isArray(arr) && arr.length > 0) {
		// if (arr[0].hasOwnProperty(field)) {
		// return arr.length == 1 ? arr[0][field] : arr.reduce(function(prev, curr, idx, arr) {
		// 	return prev[field] + curr[field];
		// });
		let sum = 0;
		arr.map(p => {
			if (p.hasOwnProperty(field)) {

				sum += isNaN(parseFloat(p[field])) ? 0 : (p[field])
			}
		})
		return sum;
		// } else {
		// 	console.error("common/sum array has  no field", arr, field)

	} else {

	}
	return 0
}

function isArray(arr) {
	return Array.isArray(arr)
}

function orderBy(arr, key, type) {
	let tp1 = (type == "desc" ? -1 : 1)
	let tp2 = (type == "desc" ? 1 : -1)
	if (isArray(arr) && arr.length > 0) {
		let _arr = [].concat(arr)
		_arr.sort((a, b) => {
			if (a.hasOwnProperty(key) && b.hasOwnProperty(key)) {
				return a[key] > b[key] ? tp1 : tp2
			} else {
				return 0
			}
		})
		return _arr

	} else {
		return arr;
	}
}

function calcData(_data) {
	let data = Object.assign({}, _data)


	if (isArray(data.details)) {
		data.details.map(detail => {
			detail._total = toDecimal(sum(detail.details, 'money'))
		})
		const _fuzhai = sum(data.details.filter(p => p.isfu == true), '_total')
		const _zongzichan = sum(data.details.filter(p => !p.isfu), '_total')

		Object.assign(data, {
			zongzichan: toDecimal(_zongzichan),
			fuzhai: toDecimal(_fuzhai),
			jingzichan: toDecimal(_zongzichan - _fuzhai)
		})

		data.details = orderBy(data.details, 'type', 'asc')

	}


	return data;


}

function formatDate(date, fmt = "yyyy-MM-dd hh:mm:ss") {
	var o = {
		"M+": date.getMonth() + 1, // 月份
		"d+": date.getDate(), // 日
		"h+": date.getHours(), // 小时
		"m+": date.getMinutes(), // 分
		"s+": date.getSeconds(), // 秒
		"q+": Math.floor((date.getMonth() + 3) / 3), // 季度
		"S": date.getMilliseconds()
		// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
			.substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) :
				(("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}


function toDecimal(x) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return 0;
	}
	f = Math.round(x * 100) / 100;
	return f;
}

const templateId="LVZtYVpD-jHHLbSI8M3_fG3a3cwlWF2F5Axg_Y02B-Q"

export {
	uuid,
	sum,
	formatDate,
	calcData,
	delay,
	orderBy,
	diffday,
	toDecimal,
	templateId
}
