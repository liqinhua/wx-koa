'use strict' // 严格模式
var Koa = require('koa')
var path = require('path')
var wechat = require('./wechat/g')
var util = require('./libs/util')
var wechat_file = path.join(__dirname, './config/wechat.txt')

var config = {
	wechat: {
		appId: 'wx5c2a9b83e025980d',
		appSecret: '449ab860430bb727cab849a71d636fc5',
		token: 'imoocisareallyamzingplacetolearn',
		getAccessToken: function () { // 取
			return util.readFileAsync(wechat_file)
		},
		saveAccessToken: function (data) { // 存
			var data = JSON.stringify(data)
			return util.writeFileAsync(wechat_file, data)
		}
	}
}

var app = new Koa()

app.use(function *(next) {
	console.log(this.url)
	if (this.url.indexOf('/movie') > -1) {
		this.body = '<h1>nihao</h1>'
		return next
	}
	yield next
}) 

app.use(wechat(config.wechat))

app.listen(80) // 监听80端口
console.log('listening: 80')