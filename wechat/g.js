'use strict' // 严格模式

var sha1 = require('sha1') // 加密
var getRawBody = require('raw-body')
var Wechat = require('./Wechat')
var util = require('./util')

module.exports = function (opts) { // 加密认证中间件
	// 为了检验，屏蔽看，如果关注能收到推送过来，就表明成功了
	// var wechat = new Wechat(opts) // 实例化构造函数

	return function *(next) {
		var that = this
		// console.log(this.query)
		var token = opts.token
		var signature = this.query.signature // 签名
		var nonce = this.query.nonce // 随机数
		var timestamp = this.query.timestamp
		var echostr = this.query.echostr // 随机字符串
		var str = [token, timestamp, nonce].sort().join('')
		var sha = sha1(str)

		// console.log(this.method)
		if (this.method === 'GET') {
			if (sha === signature) {
				this.body = echostr + ''
			} else {
				this.body = 'wrong'
			}
		}
		else if (this.method === 'POST') {
			if (sha !== signature) {
				this.body = 'wrong789'
				return false
			}

			var data = yield getRawBody(this.req, {
				length: this.length,
				limit: '1mb',
				encoding: this.charset
			})

			var content = yield util.parseXMLAsync(data)
			console.log('789')
			console.log(content)

			var message = util.formatMessage(content.xml)

			console.log('haha')
			console.log(message)

			if (message.MsgType === 'event') {
				if (message.Event === 'subscribe') {
					var now = new Date().getTime()

					that.status = 200
					that.type = 'application/xml'
					var reply = '<xml>' + 
						'<ToUserName><![CDATA[' + message.FromUserName +']]></ToUserName>' + 
						'<FromUserName><![CDATA[' + message.ToUserName + ']]></FromUserName>' + 
						'<CreateTime>' + now + '</CreateTime>' + 
						'<MsgType><![CDATA[text]]></MsgType>' + 
						'<Content><![CDATA[' + '小华测试公众号关注回调事件' + ']]></Content>' + 
						'</xml>'
					console.log(reply)
					this.body = reply

					return
				}
			}
		}
	}
}