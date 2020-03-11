'use strict';



Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var aliplayApi = _interopDefault(require('./lib/app.js'));



exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ' + event)

	console.log("start 1 ========>");

	try {
		aliplayApi.accToken({code:event.code}).then(res=>{
		    console.log("succ",res)
			
			return {
				msg: "accToken succ erro",
				data: res
			}
			
		}).catch(e=>{
		    console.log("error",e)
			return {
				msg: "accToken error erro",
				data: e
			}
		})


	} catch (e) {
		console.log("init error ========>", e);
		return {
			msg: "init erro",
			data: e
		}
	}

};
