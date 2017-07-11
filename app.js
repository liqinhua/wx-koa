'use strict' // 严格模式
var Koa = require('koa')
var sha1 = require('sha1') // 加密

var config = {
	wechat: {
		appId: 'wx5c2a9b83e025980d',
		appSecret: '449ab860430bb727cab849a71d636fc5',
		token: 'imoocisareallyamzingplacetolearn'
	}
}
var app = new Koa()
app.use(function *(next) {
	// yield next;
	console.log(this.query)
	var token = config.wechat.token
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
})	

app.listen(80) // 监听80端口
console.log('listening: 80')


