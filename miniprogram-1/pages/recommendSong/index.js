import PubSub from "pubsub-js"
import request from "../../utils/reques.js"
// pages/recommendSong/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
let userInfo=wx.getStorageSync('cookies')
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success:()=>{
          wx.reLaunch({
            rul:"../../pages/login/index"
          })
        }
      })
    }
this.setData({
  day: new Date().getDate(),
  month: new Date().getMonth() +1,
})
this.getRecommendList()

// 然后发请求改变歌曲

// 第一个参数是传递名称第二个是传递的数据 第二个数据的data是数据 msg是站位 传递点击的到底是那个切换按钮
  PubSub.subscribe('switchType',(msg,type)=>{
    let {recommendList,index}=this.data
   if( type=='pre'){
    // 上一首  如果点击的是第一首歌那么index上一曲边最后一首 因为识别不了这个语法所以加小括号代表整体
    (index == 0) && (index=recommendList.length-1)
    index=index-1
   }else{
    //  下一首
    (index == recommendList.length-1) && (index=-1)
    index=index+1
   }
   this.setData({
    index
   })
  //  点击之后会切换歌曲的下表拿到对应歌曲的id 之后在传回songDetall进行歌曲的切换
let musicId=recommendList[index].id
PubSub.publish('musicId',musicId)

  })
  },

  // 获取用户每日推荐的数据
 async  getRecommendList(){
    let recommendListData= await  request('/recommend/songs') 
  
    this.setData({
      recommendList:recommendListData.data.dailySongs
    })
    
  },
  toSongDetail(event){
    // 把获取过来的信息传给播放歌曲页面
    let song=event.currentTarget.dataset.song.id
    // 给点击事件附上id 保存到data里 用来拿到点击的到底是那首歌
    let index=event.currentTarget.dataset.index
//    url:'../../pages/songDetall/index?song='+song路由传参传值识别不了对象转化成字符串
    wx.navigateTo({
      url:'../../pages/songDetall/index?musicId='+song
    })
    this.setData({
      index
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