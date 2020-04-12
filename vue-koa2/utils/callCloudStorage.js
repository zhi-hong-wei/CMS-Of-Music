const getAccessToken = require('./getAccessToken.js')
const rp = require('request-promise')
const fs = require('fs')

const cloudStorage = {
    async download(ctx, fileList) {
        const ACCESS_TOKEN = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
            body: {
                env: ctx.state.env,
                file_list: fileList
            },
            json: true
        }

        return await rp(options)
            .then((res) => {
                return res
            })
            .catch(function (err) {
                console.log(err);
            })

    },

    async upload(ctx) {
        // 1、请求地址
        const ACCESS_TOKEN = await getAccessToken()
        // 取到当前文件信息
        const file = ctx.request.files.file
        // 路径自己定义，尽量不重复
        const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
            body: {
                path,
                env: ctx.state.env,
            },
            json: true // Automatically stringifies the body to JSON
        };
        //  请求参数的
        const info = await rp(options)
            .then(function (res) {
                return res
            })
            .catch(function (err) {
            })
        console.log(info)
        // 2、上传图片
        const params = {
            method: 'POST',
            headers: {
                'content-type': 'multipart/form-data'
            },
            uri: info.url,
            formData: {
                key: path,
                Signature: info.authorization,
                // 有-，看作字符串处理
                'x-cos-security-token': info.token,
                'x-cos-meta-fileid': info.cos_file_id,
                file: fs.createReadStream(file.path)  /*通过路径将文件读取成二进制内容*/
            },
            json: true
        }
        await rp(params)
        return info.file_id
    },

    async delete(ctx, fileid_list) {
        const ACCESS_TOKEN = await getAccessToken()
        const options = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
            body: {
                env: ctx.state.env,
                fileid_list: fileid_list
            },
            json: true
        }

        return await rp(options)
            .then((res) => {
                return res
            })
            .catch(function (err) {
                console.log(err);
            })
    }
}

module.exports = cloudStorage