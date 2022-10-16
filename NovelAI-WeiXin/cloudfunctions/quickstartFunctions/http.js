/*// 云函数入口文件
const cloud = require('wx-server-sdk')
var request = require('request')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    request({
      url: event.url,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
        "token":event.token
      },
      body: event.body
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        try {
          resolve(body)
        } catch (e) {
          reject()
        }
      }
    })
  })
}*/
// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let url = 'https://www.baidu.com';
  return await rp(url)
    .then(function (res) {
      return '成功'
    })
    .catch(function (err) {
      return '失败'
    });
}