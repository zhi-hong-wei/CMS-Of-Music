const Router = require('koa-router')
const router = new Router()

// 调用云函数的方法封装成js文件
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB = require('../utils/callCloudDB.js')


//get,post区别联系,路由获取歌单
router.get('/list', async (ctx, next) => {
    const query = ctx.request.query  /*动态获取start和count值*/
    const res = await callCloudFn(ctx, 'music', {
        $url: 'playlist',
        start: parseInt(query.start),
        count:parseInt(query.count)
    })
    // console.log(res)
    let data = [];
    if (res.resp_data) {
        data = JSON.parse(res.resp_data).data
    }
    ctx.body = {
        data,
        code: 20000,  /*这个前端模板规定*/
    }
})

router.get('/getById', async(ctx, next)=>{
    // get在请求头里面，ctx.request.query接收
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    ctx.body = {
        code: 20000,
        data: JSON.parse(res.data)
    }
})

router.post('/updatePlaylist', async(ctx, next)=>{
    // post接收在请求体里面，用ctx.request.body接收
    const params = ctx.request.body
    const query = `
        db.collection('playlist').doc('${params._id}').update({
            data: {
                name: '${params.name}',
                copywriter: '${params.copywriter}'
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    ctx.body = {
        code: 20000,
        data: res
    }
})

router.get('/del', async(ctx, next)=>{
    const params = ctx.request.query
    const query = `db.collection('playlist').doc('${params.id}').remove()`
    const res = await callCloudDB(ctx, 'databasedelete', query)
    ctx.body = {
        code: 20000,
        data: res
    }
})

//导出router,在app.js导入
module.exports = router