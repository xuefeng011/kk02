const cloud = require('wx-server-sdk')

const env = cloud.DYNAMIC_CURRENT_ENV;

cloud.init({
	env: env
})
const db = cloud.database()

exports.main = async (event, context) => {
	if (event.type == "sub") {
		return subsMessage(event)
	} else if (event.type == "send") {
		return sendMessage(event)
	} else {
		return null;
	}
};


function getDateList(){
	let now = new Date();
	let month=now.getMonth() + 1
	let week = now.getDay()
	
	let day=now.getDate() 
	
	
	
}

async function subsMessage(event) {
	try {
		const {
			OPENID
		} = cloud.getWXContext();
			
		const result = await db.collection('subs').add({
			data: {
				//具体的字段可以根据自己的需求使用，但是data的值要注意
				//一定要这样传，和模板消息给的对应起来
				touser: OPENID,
				k1:parseInt(event.k1),
				k2:parseInt(event.k2),
				templateId: event.templateId,
				done: false,
			},
		});
		
		
		
		const sendPromises =Array.from({ length: 20 });.map(async message => {
			try {
				// 发送订阅消息
				await cloud.openapi.subscribeMessage.send({
					touser: message.touser,
					page: message.page,
					data: message.data,
					templateId: message.templateId,
				});
				// 发送成功后将消息的状态改为已发送
				return db
					.collection('subs')
					.doc(message._id)
					.update({
						data: {
							done: true,
						},
					});
			} catch (e) {
				return e;
			}
		});
		
		return Promise.all(sendPromises);
		
		
		
		
		return result;
	} catch (err) {
		console.log(err);
		return err;
	}
}

async function sendMessage(event) {
	try {
		// 从云开数据库中查询等待发送的消息列表
		const messages = await db
			.collection('subs')
			// 查询条件这里做了简化，只查找了状态为未发送的消息
			// 在真正的生产环境，可以根据开课日期等条件筛选应该发送哪些消息
			.where({
				done: false,
			})
			.get();
		// 循环消息列表
		const sendPromises = messages.data.map(async message => {
			try {
				// 发送订阅消息
				await cloud.openapi.subscribeMessage.send({
					touser: message.touser,
					page: message.page,
					data: message.data,
					templateId: message.templateId,
				});
				// 发送成功后将消息的状态改为已发送
				return db
					.collection('subs')
					.doc(message._id)
					.update({
						data: {
							done: true,
						},
					});
			} catch (e) {
				return e;
			}
		});

		return Promise.all(sendPromises);
	} catch (err) {
		console.log(err);
		return err;
	}
}
