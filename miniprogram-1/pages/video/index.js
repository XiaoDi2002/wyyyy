// pages/video/index.js
import request from "../../utils/reques.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navid:'',
    videoListData:[],
    videoId:'',
    videoUpdateTime:[],   // 存储视频播放的时间
    isTriggered:false
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData()
   

  
  },
  async getVideoGroupListData(){
    let videoGroupListData = await request('/video/group/list')


    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,14),
      navid:videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navid)
  },

  // 发请求获取数据 调用在getVideoGroupListData下能拿到this.data.navid 因为是异步操作 放在onLoad拿不到数据
 async getVideoList(navid){
  
     let videoListData =await request('/video/group',{id:navid})
console.log(videoListData);
      let index=0;
      let videoList=videoListData.datas.map(item=>{
        item.id=index++
        return item
      })
      let videoUrlList=[];
      for(let i=0;i<videoListData.datas.length;i++){
         let videoUrlItem= await request('/video/url',{id:videoListData.datas[i].data.vid})
     
         videoUrlList.push(videoUrlItem.urls[0].url)
       
      }
   
        for(let i=0;i<videoUrlList.length;i++){
          videoListData.datas[i].data.urlInfo=videoUrlList[i]
        
        }
        
     this.setData({
       
      videoListData:videoListData
     })
     // 关闭微信提示框
  wx.hideLoading();

  },

  // 点击那个  就变红
  changeNav(event){
   
    let navId= event.currentTarget.id
    this.setData({
      // 获取过来的值默认转化成字符串需要x1
      navid:navId,
      videoListData:[]
    })
    // 点击之后请求数据会白屏 
    wx.showLoading({
      title: '正在加载中',
    })
    this.getVideoList(this.data.navid)
  },
// 点击视频触发回调其他视频停止播放 
  handlePlay(event){
    let vid=event.currentTarget.id
    // &&前面的值为true直接返回后面的值  ||与之相反 前面的值为flase直接返回后面的值
    // 创建控制video标签的实例对象 需要视频对象的id值
    // 刚开始 this.videoContext没有值  点击播放后有值 再次点击时会触发this.videoContext.stop()停止上一个视频
    // 判断两次点击播放是不是同一个视频  第一次点击this.vid没有值 vid已经赋值所以执行下面代码停止操作
    // 第二次点击  this.vid = vid所以不执行停止视频操作 继续播放
  // this.vid!== vid&& this.videoContext && this.videoContext.stop()

  // this.vid = vid
  this.setData({
    videoId:vid
  })
    this.videoContext=wx.createVideoContext(vid);
    // 自动播放不用点击播放按钮
   this.videoContext.play()
  },
// 监听播放进度的回调
  handleTime(event){
 
    let videoTimeObj={vid:event.currentTarget.id,currentTime:event.detail.currentTime}
  // 存储视频播放的时间
    let{videoUpdateTime}=this.data
    let videoItem=videoUpdateTime.find(item=>item.vid===videoTimeObj.vid)
    if(videoItem){
      videoUpdateTime.currentTime = event.detail.currentTime
    }else{
      videoUpdateTime.push(videoTimeObj)
    }
   this. setData({
      videoUpdateTime
    })
  },
  // 自定义下拉刷新的回调
  handleRefresher(){
  
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