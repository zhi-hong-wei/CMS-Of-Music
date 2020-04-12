const rp = require('request-promise')
const APPID = 'wx02d80239683375cb'
const APPSECRET = '65fe5db2fa62013b0194d703604c7d7d'
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fs = require('fs')  /*写文件用，node自带*/

// 引入path，便于使用绝对路径找./access_token.json
const path = require('path')
// fileName包含路径和文件名
const fileName = path.resolve(__dirname, './access_token.json')

// 获取Token，此方法updateAccessToken是异步的，所以要处理
const updateAccessToken = async () => {
    // 请求URL返回是字符串
    const resStr = await rp(URL)
    const res = JSON.parse(resStr)
    console.log(res)
    // 写文件，就是将access_token保存json文件中
    if (res.access_token) {
        // JSON.stringify将对象转为字符串
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    } else {
        await updateAccessToken()
    }
}

// 取出access_token
const getAccessToken = async () => {
    // 读取文件，try catch异常捕获，Json文件不存在时
    try {
        // utf8可以整理返回内容格式
        const readRes = fs.readFileSync(fileName, 'utf8')
        const readObj = JSON.parse(readRes)
        // new Date(str)可以将字符串转成日期，getTime是获取毫秒数
        const createTime = new Date(readObj.createTime).getTime()
        const nowTime = new Date().getTime()
        if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
            await updateAccessToken()
            await getAccessToken()
        }
        return readObj.access_token
    } catch (error) {
        await updateAccessToken()
        await getAccessToken()
    }
}

// 开启定时器，与setTimeout区别，与setTimeout区别开启一次，这个可以开启多次
// 规定两小时失效，我们提前5分钟,定时刷新
setInterval(async () => {
    await updateAccessToken()
}, (7200 - 300) * 1000)  /* 转化毫秒*/

module.exports = getAccessToken