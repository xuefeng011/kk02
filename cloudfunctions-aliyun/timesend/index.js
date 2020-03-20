const cloud = require('wx-server-sdk')

const env = cloud.DYNAMIC_CURRENT_ENV;

cloud.init({
	env: env
})
const db = cloud.database()


exports.main = async(event, context) => {
  const execTasks = []; // 待执行任务栈
  // 1.查询是否有定时任务。（timeingTask)集合是否有数据。
  let taskRes = await db.collection('subs').where({
	  done:false
  }).limit(100).get()
  let tasks = taskRes.data;
  // 2.定时任务是否到达触发时间。只触发一次。
  let now = new Date();
  try {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].execTime <= now) { // 时间到
        execTasks.push(tasks[i]); // 存入待执行任务栈
        // 定时任务数据库中删除该任务
        // await db.collection('subs').doc(tasks[i]._id).remove()
      }
    }
  } catch (e) {
    console.error(e)
  }
  // 3.处理待执行任务
  for (let i = 0; i < execTasks.length; i++) {
    let task = execTasks[i];
    if (task.taskType == 1) { // 定时开奖任务
      // const kaiJinag = require('kaiJiang.js')
      try {
        await sendMessage(task._id)
      } catch(e) {
        console.error(e)
      }
    }
  }
}



async function sendMessage(_id) {
	return db
		.collection('subs')
		.doc(_id)
		.update({
			data: {
				done: true,
			},
		});
}
