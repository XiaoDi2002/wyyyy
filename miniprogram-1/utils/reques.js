// 发送ajax请求 封装功能函数 和组件
// 函数内部保留固定的代码  将动态的部分抽离出来 由使用者自身情况动态传入实参

// 封装功能组件
// url,data={},method='GET'形参设置默认值 在发请求时拿不到数据不会报错
// 通过外部组件给形参赋值 把请求封装成一个函数 调用就更方便了
import host from './config.js'
export default (url,data={},method='GET')=>{
return new Promise((resolve,reject)=>{

wx.request({
    url:host.host+url,
    data:data,
    method:method,
    header:{
        // 再让请求头带上参数模拟用户登录时的状态
            cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U') !== -1) :''
            // .find(item=>item.indexOf('MUSIC_U'))遍历cookies中有MUSIC_U字段的保存在header中 没找到的话会返回-1 要提前生明继续遍历下去
    },
    success: (res)=> {
        // 判断是不是登录的请求如果是把cookies保存在本地存储里
       if(data.isLogin){
          wx.setStorage({
               key: 'cookies',
               data: res.cookies
           })
       }
        resolve(res.data)
    },
    fail: (err)=>  {
     
        reject(err)
    }
})

})


}