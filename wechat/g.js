'use strict' // 严格模式
var sha1 = require('sha1') // 加密

module.exports = function (opts) { // 加密认证中间件
	return function *(next) {
		console.log(this.query)
		var token = opts.token
		var signature = this.query.signature // 签名
		var nonce = this.query.nonce // 随机数
		var timestamp = this.query.timestamp
		var echostr = this.query.echostr // 随机字符串
		var str = [token, timestamp, nonce].sort().join('')
		var sha = sha1(str)

		if (sha === signature) {
			this.body = echostr + ''
		} else {
			this.body = 'wrong'
		}
	}
}