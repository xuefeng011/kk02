const accounts = [{
		"type": 1,
		"name": "现金",
		"subtitle":"余额",
		"icon": "cuIcon-recharge"
	},
	{
		"type": 2,
		"name": "借记卡",
		"subtitle":"余额",
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
		}
	},
	{
		"type": 3,
		"name": "信用卡",
		"subtitle":"欠款",
		"icon": "cuIcon-vipcard",
		"desc": "信用卡、花呗、京东白条",
		"isfu":true,
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
		}
	},
	{
		"type": 4,
		"name": "虚拟账户",
		"subtitle":"余额",
		"icon": "cuIcon-choiceness",
		"desc": "支付宝、微信",
		"selects": {
			"title": "选择虚拟账户",
			"list": [
				"支付宝",
				"微信",
				"其他虚拟账户"
			]
		}
	},
	{
		"type": 5,
		"name": "投资账户",
		"icon": "cuIcon-refund",
		"subtitle":"金额",
		"desc": "股票、基金、P2P",
		"selects": {
			"title": "",
			"list": [
				"股票",
				"基金",
				"其他投资"
			]
		}
	},
	{
		"type": 6,
		"name": "负债",
		"subtitle":"欠款",
		"icon": "cuIcon-moneybag",
		"isfu":true
	},
	{
		"type": 7,
		"name": "债权",
		"subtitle":"金额",
		"icon": "cuIcon-goods"
	},
	{
		"type": 8,
		"name": "自定义资产",
		"subtitle":"金额",
		"icon": "cuIcon-paint"
	}
]

export default accounts;
