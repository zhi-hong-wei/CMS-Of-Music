const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')

const ENV = 'dazhi-ukbsv'

// 解决跨域问题
app.use(cors({
    // origin允许前端地址向我发送请求
    //http://192.168.0.103:9528
    origin: ['http://localhost:9528'],
    credentials: true
}))

//首先进入*全局中间件，app.use是koa“调用中间件的方法”,中间件就是处理HTTP请求的函数，用来完成各种特定的任务。
// 发送请求时就会触发app.use里函数
app.use(async (ctx, next)=>{
    console.log('全局中间件')
    // ctx.body = 'Hello Wolrd'
    ctx.state.env = ENV
    // 再进入其他中间件next()
    await next()
})

// 解析post传递来的参数
app.use(koaBody({
    multipart: true,
}))

//引入controller获取歌单的js文件
const playlist=require('./controller/playlist')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')

// 后一项声明router下routes
router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())
router.use('/blog', blog.routes())

// 声明router下routes
app.use(router.routes())
// 允许get，post等方法使用
app.use(router.allowedMethods())

// 定义端口号
app.listen(3000,()=>{

})