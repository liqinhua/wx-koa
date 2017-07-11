'use strict' // 严格模式
var sha1 = require('sha1') // 加密
var Promise = require('bluebird')
var require = Promise.promisify(require('request')) // 一个请求库，通过promisify化而已

var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
	accessToken: prefix + 'token/grant_type=client_credential'
}

function Wechat(optns) {
	var that = this
	this.appID = opts.appID
	this.appSecret = opts.appSecret
	this.getAccessToken = opts.getAccessToken // 获取
	this.savaAccessToken = opts.savaAccessToken // 存储

	this.getAccessToken()
		.then(function(data)) {
			try {
				data = JSON.parse(data)
			}
			catch(e) {
				return that.updateAccessToken(data) // 更新票据
			}

			if (that.isValidAccessToken(data)) { // 检测票据
				Promise.resolve(data)
			}
			else {
				return that.updateAccessToken
			}
		})
		.then(function(data) {
			that.access_token = data.access_token
			that.expires_in = data.expires_in

			that.savaAccessToken(data)
		})
	// body...
}

Wechat.prototype.isValidAccessToken = function(data) {
	if (!data || !data.access_token || !data.expires_in) {
		return false
	}

	var access_token = data.access_token
	var expires_in = data.expires_in // 过期时间
	var now = (new Date().getTime())

	if (now < expires_in) {
		return true
	}
	else {
		return false
	}
}

Wechat.prototype.updateAccessToken = function () { // 更新票据
	var appID = this.appID
	var appSecret = this.appSecret
	var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret

	return new Promise(function(resolve, reject) {
		request({url: url, json: true}).then(function(response) {
			var data = response[1]
			var now = (new Date().getTime())
			var expires_in = now + (data.expires_in -20) * 1000

			data.expires_in = expires_in

			resolve(data)
		})
	})
}

module.exports = function (opts) { // 加密认证中间件
	var wechat = new Wechat(opts)

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