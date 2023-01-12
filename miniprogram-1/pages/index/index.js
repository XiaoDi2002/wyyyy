// pages/index/index.js
import  request from '../../utils/reques.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recpmmendList:[],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
 onLoad: async function (options) {
  // 因为是异步请求打印是找不到的 去utils里吧请求函数封装成promise对象
  // 返回结果是一个promise 用async接收异步函数 就可以在这个组件里打印异步请求的函数了
 let bannerListData= await request('/banner',{type:2})
//  类似computed 把数据挂载到组件上this.setData
    this.setData({
      bannerList:bannerListData.banners
    })
    // 推荐歌单的数据
    let recpmmendListData =await request('/personalized?limit=10',{limit:10})
    this.setData({
      recpmmendList:recpmmendListData.result
    })
    // 因为接口请求的数据太多了 只需要拿到用的数据就可以
   let index = 24381616
    // 请求五次接口
    let resultArr=[]
   while (index < 24381621) {
     let topListData = await request('/playlist/detail',{id:index++})
      // 获取五次请求的名字 还有数组每五次请求的数组前三项数据
      let topListItem = {name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)}
      // 每次获取到的数据都push进空数组里
     resultArr.push(topListItem)
      this.setData({
        topList:resultArr
      })
    
    }
  
 

   
  },
  torecommendSong(){
    wx.navigateTo({
      url: '../../pages/recommendSong/index'
    })
    
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