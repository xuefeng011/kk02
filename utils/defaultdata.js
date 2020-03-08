const data = {
	"zongzichan": 0,
	"jingzichan": 0,
	"fuzhai": 0,
	"details": [{
			"type": 1,
			"name": "现金",
			"icon": "cuIcon-recharge",
			"_total": 0,
			"details": [{
				"_id": "a00000000000000001",
				"name": "现金",
				"money": 0,
				"desc": ""
			}]
		},
		{
			"type": 2,
			"name": "借记卡",
			"icon": "cuIcon-vipcard",
			"selects": {
				"title": "所在银行",
				"list": [
					"工商银行",
					"招商银行",
					"农业银行",
					"浦发银行",
					"交通银行"
				]
			},
			"_total": 0,
			"details": [{
					"_id": "a00000000000000001",
					"name": "农业银行",
					"cardno": "1032",
					"money": 0,
					"desc": ""
				},
				{
					"_id": 1,
					"name": "工商银行",
					"cardno": "9983",
					"money": 0,
					"desc": ""
				}
			]
		},
		{
			"type": 3,
			"name": "信用卡",
			"icon": "cuIcon-vipcard",
			"desc": "信用卡、花呗、京东白条",
			"selects": {
				"title": "所在银行",
				"list": [
					"花呗",
					"京东白条",
					"借呗",
					"工商银行",
					"招商银行",
					"农业银行",
					"浦发银行",
					"交通银行"
				]
			},
			"_total": 0,
			"details": [{
					"_id": "a00000000000000001",
					"name": "京东白条",
					"cardno": "5532",
					"money": 0,
					"desc": ""
				},
				{
					"_id": 1,
					"name": "交通银行",
					"cardno": "9982",
					"money": 0,
					"desc": ""
				}
			]
		},
		{
			"type": 4,
			"name": "虚拟账户",
			"icon": "cuIcon-choiceness",
			"desc": "支付宝、微信",
			"selects": {
				"title": "",
				"list": [
					"支付宝",
					"微信",
					"其他虚拟账户"
				]
			},
			"_total": 0,
			"details": [{
					"_id": "a00000000000000001",
					"name": "支付宝",
					"money": 0,
					"desc": ""
				},
				{
					"_id": 1,
					"name": "微信",
					"money": 0,
					"desc": ""
				}
			]
		},
		{
			"type": 5,
			"name": "投资账户",
			"icon": "cuIcon-refund",
			"desc": "股票、基金、P2P",
			"selects": {
				"title": "",
				"list": [
					"股票",
					"基金",
					"其他投资"
				]
			},
			"_total": 0,
			"details": [{
					"_id": "a00000000000000001",
					"name": "股票",
					"money": 0,
					"desc": ""
				},
				{
					"_id": 1,
					"name": "基金",
					"money": 0,
					"desc": ""
				}
			]
		},
		{
			"type": 6,
			"name": "负债",
			"icon": "cuIcon-moneybag",
			"_total": 0,
			"details": [{
				"_id": "a00000000000000001",
				"name": "现金",
				"money": 0,
				"desc": ""
			}]
		},
		{
			"type": 7,
			"name": "债权",
			"icon": "cuIcon-goods",
			"_total": 0,
			"details": [{
				"_id": "a00000000000000001",
				"name": "现金",
				"money": 0,
				"desc": ""
			}]
		},
		{
			"type": 8,
			"name": "自定义资产",
			"icon": "cuIcon-paint",
			"_total": 0,
			"details": [{
				"_id": "a00000000000000001",
				"name": "现金",
				"money": 0,
				"desc": ""
			}]
		}
	]
}

export default  data;