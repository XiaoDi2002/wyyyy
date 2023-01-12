import request from "../../utils/reques.js"
let startY=0;
let moveY=0;
let moveDistance=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:"translateY(0rpx)",
    userInfo:{},
    recentPlayList:[]
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 // 把登录存储里的东西拿出来get
 let userInfo =wx.getStorageSync("userInfo")
 if(userInfo){
   this.setData({
    userInfo
   })
  this. getUserRecentPlayList(this.data.userInfo.userId)
 }
  },
  // 获取用户播放记录的功能函数
 async getUserRecentPlayList(userId){
  // 这里派发请求传入两个参数 参数从形参拿到 形参在上面调用时候 把上个接口存入本地存储里的值传入过来给这个接口用就能成功请求到数据
 let recentPlayListData = await request('/user/record',{uid:userId,type:1})

// 沒有id值没办法传入key 用map给每个参数遍历加入id值
 let index =0;
 let recentPlayList=recentPlayListData.weekData.splice(0,3).map(item=>{
   item.id=index++
   return  item
 })
//  给把准备好的数据传入给data
 this.setData({
  recentPlayList:recentPlayList
 })
  },
  bindtouchStart(event){
    // 得到手指點擊的位置赋值
    startY=event.touches[0].clientY
  
  }, 
  bindtouchsMove(event) {
    // 得到手指移动的距离赋值
    moveY=event.touches[0].clientY
    //用移动的距离减去开始的位置 得到手指从点击到移动了多少 
    moveDistance=moveY-startY
    

    if(moveDistance <= 0){
    this.bindtouchsEnd()
    }
    if(moveDistance > 80){
      this.setData({
        coverTransform:`translateY(${moveDistance=80}rpx)`
        
      })
    }
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
      
    })
    
   
   
  }, 
  bindtouchsEnd() {
    this.setData({
      coverTransform:`translateY(${moveDistance=0}rpx)`,
      
      
    })
  },
  // 跳转到login登录的回调
  toLogin(){
    // 路由跳转
    // navigateTo不能跳到tabbar页面
if(!this.data.userInfo)
  wx.navigateTo({
    url: '../../pages/login/index'
  });
  },
  
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})