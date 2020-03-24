var datefns = require("date-fns")

const cloud = require('wx-server-sdk')

const env = cloud.DYNAMIC_CURRENT_ENV;

cloud.init({
	env: env
})
const db = cloud.database()

exports.main = async (event, context) => {
	if (event.type == "sub") {
		return subsMessage(event)
	} else  {
		console.log("运行触发器成功");
		return sendMessage(event)
	} 
};


function getDateList(k1, k2) {
	let now = datefns.addHours(new Date(), 0)
	let nowDay = now.getDate(); //当前日
	let nowMonth = now.getMonth(); //当前月
	let nowYear = now.getFullYear(); //当前年
	let nowDayOfWeek = now.getDay(); //今天本周的第几天
	let start = now
	let pushlist = []
	if (k1 == 2) {
		start = new Date(nowYear, nowMonth, k2);
		for (let i = 0; i < 5; i++) {
			pushlist.push(datefns.format(datefns.addMonths(start, i), "yyyy-MM-dd 09:00:00"))
		}

	} else if (k1 == 1) {
		start = new Date(nowYear, nowMonth, nowDay - (nowDayOfWeek - k2));
		for (let i = 0; i < 10; i++) {
			pushlist.push(datefns.format(datefns.addWeeks(start, i), "yyyy-MM-dd 09:00:00"))
		}
	} else if (k1 == 3) {
		start = new Date(nowYear, nowMonth, nowDay, k2);
		for (let i = 0; i < 60; i++) {
			pushlist.push(datefns.format(datefns.addDays(start, i), "yyyy-MM-dd HH:00:00"))
		}
	}


	return pushlist
}

async function subsMessage(event) {
	let now = datefns.addHours(new Date(), 0)
	try {
		const {
			OPENID
		} = cloud.getWXContext();
		let k1 = parseInt(event.data.k1);
		let k2 = parseInt(event.data.k2);
		let days = getDateList(k1, k2);

		await db.collection('subs').where({

			_openid: OPENID

		}).remove();

		const sendPromises = days.map(async (day, index) => {
			try {
				return await db.collection('subs').add({
					data: {
						_openid: OPENID,
						k1: k1,
						k2: k2,
						desc: event.data.desc,
						templateId: event.templateId,
						page: event.page,
						day: day,
						index: index + 1,
						createat: datefns.format(now, "yyyy-MM-dd HH:mm:ss"),
						done: false,
					},
				});
			} catch (e) {
				return e;
			}
		});

		await Promise.all(sendPromises);

		return {
			succ: "succ",
			days: days
		};
	} catch (err) {
		console.log(err);
		return err;
	}
}


async function sendMessage(event) {
	let now = datefns.addHours(new Date(), 0)
	let id = ""
	try {
		// 从云开数据库中查询等待发送的消息列表
		let day = datefns.format(now, "yyyy-MM-dd HH:00:00")
		const messages = await db
			.collection('subs')
			// 查询条件这里做了简化，只查找了状态为未发送的消息
			// 在真正的生产环境，可以根据开课日期等条件筛选应该发送哪些消息
			.where({
				done: false,
				day: day
			})
			.get();
		console.log("day", day)
		if (messages.data.length <= 0) {
			return "没有可推送任务"
		}
		// 循环消息列表
		const sendPromises = messages.data.map(async message => {
			try {
				// 发送订阅消息
				await cloud.openapi.subscribeMessage.send({
					touser: message._openid,
					page: message.page,
					data: {
						"phrase2": {
							"value": "记得记账啦"
						},
						"time1": {
							"value": datefns.format(new Date(), "yyyy-MM-dd")
						}
					},
					templateId: message.templateId,
				});
				
				// 发送成功后将消息的状态改为已发送
				return 1
					
			} catch (e) {
				return e;
			}
		});

		await Promise.all(sendPromises);
		
		
		await db
			.collection('subs')
			.where({
				done: false,
				day: day
			})
			.remove();
			
			
			
		return "推送成功a" + sendPromises.length;
	} catch (err) {
		console.log(err);
		return err;
	}
}
