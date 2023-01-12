import PubSub from "pubsub-js"
import request from "../../utils/reques.js"
import moment from'moment'
// pages/songDetall/index.js
// 可以获取全局的实例类似仓库  利用这个 在页面退出的时候继续保持音乐的信息 当再次跳转播放音乐的时候判断是不是同一个id
// 如果是就继续不改变  isPaly:false,的状态 如果不是就修改
const appInstance= getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPaly:false,
    song:{},
    musicId:'',
    musicLink:'',
    currentTime:'00:00',
    durationTime:'00:00',
    currentWidth:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options是专门用来接收路由跳转的quer参数 接收过来吧字符串转化对象  但只能传很少的数据
    let musicId=options.musicId
    this.setData({
      musicId
    })
      this.getMusicInfo(options.musicId)

      //如果用户操作系统的控制音乐播放暂停按钮 导致页面不知道音乐是暂停还是播放
      // 控制音频的实例去监视音乐播放和暂停
         // 创建播放音乐的实例
        //  播放
         this.backgroundAudioManager=wx.getBackgroundAudioManager();
         this.backgroundAudioManager.onPlay(()=>{
           this.setData({
            isPaly:true
           })
           appInstance.globalData.isMusicPlay=true
           appInstance.globalData.musicId=musicId
         });
        //  停止
         this.backgroundAudioManager.onPause(()=>{
          this.setData({
            isPaly:false
           })
           appInstance.globalData.isMusicPlay=false
        });
        this.backgroundAudioManager.onStop(()=>{
          this.setData({
            isPaly:false
           })
           appInstance.globalData.isMusicPlay=false
        });
        // 播放結束自動切換下一首
        this.backgroundAudioManager.onEnded(()=>{
          PubSub.publish('switchType','next')
          this.setData({
            currentWidth:0,
            currentTime:'00:00'
          })
        })
      
      
        // 监听音乐播放的进度
        this.backgroundAudioManager.onTimeUpdate(()=>{
          // this.backgroundAudioManager.currentTime这个api是音乐播放时候开始计时毫秒  进行换算
            let currentTime =moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
            this.setData({
              currentTime,
              currentWidth
            })
            
        })
   
  },

  async getMusicInfo(musicId){
   let songData=await request('/song/detail',{ids:musicId})
   let durationTime=moment(songData.songs[0].dt).format('mm:ss')
      this.setData({
        song:songData.songs[0],
        durationTime
      })

      //动态修改标题
      wx.setNavigationBarTitle({
        title: this.data.song.name
       
      });
  },
  // 點擊播放或者暂停的回调
  handleMusicPlay(){
    let isPaly = !this.data.isPaly
    this.setData({
      isPaly:isPaly
    })
    this.musicControl(isPaly,this.data.musicId,this.data.musicLink)
  },
  async musicControl(isPaly,musicId,musicLink){
      if(isPaly){
        if(!musicLink){
        // 音乐播放 
        // 获取音乐的播放链接
        let musicControlLinkData = await request('/song/url',{id:musicId})
     musicLink =musicControlLinkData.data[0].url
     this.setData({
      musicLink
     })
        }

     
        this.backgroundAudioManager.src=musicLink;
        this.backgroundAudioManager.title=this.data.song.name
      }
      else{
        // 暂停播放
        this.backgroundAudioManager.pause()
      }
      
  },
  // 点击切歌的回调
  handSwith(event){
    let type=event.currentTarget.id

    // 关闭上一首的歌曲和请求目的是切歌时候只保留当前的歌曲请求
    this.backgroundAudioManager.stop()

    // 接收点击的下一个或者上一个歌曲的id 再次发请求展示歌曲信息 和播放歌曲
    PubSub.subscribe('musicId',(msg,musicId)=>{
      this.getMusicInfo(musicId)
      this.musicControl(true,musicId)
      PubSub.unsubscribe('musicId')
    })
    // 发布消息给recommendSong实现 点击切换按钮
  PubSub.publish('switchType',type)
  
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