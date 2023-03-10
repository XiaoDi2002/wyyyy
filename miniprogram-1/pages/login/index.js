// pages/login/index.js
import request from "../../utils/reques.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone :'',
    password:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
   
  },
    // 绑定保存用户传入的账号
  handleInput(event) {
   
    let type =event.target.id
      if(type="text"){
      this.setData({
        phone:event.detail.value
      })
      }
    
  },
  // 绑定保存用户传入的密码
  handleInput2(event){
    let type =event.target.id
    if(type="password"){
      this.setData({
        password:event.detail.value
      })
      }
  },
  async login(){
    // 收集表单数据
   let{phone,password}=this.data
  //  如果手机号为空
   if(!phone){
    // 小程序的弹窗 
     wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
   }
  //  定义输入手机号的正则表达式
   let poneReg=/^1(3|4|5|6|7|8|9)\d{9}$/;
  //  做判断 如果手机号格式不符合phone弹窗
   if(!poneReg.test(phone)){
    wx.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    })
    return
   }
   if(!password){
    wx.showToast({
      title: '密码不能为空',
      icon: 'none'
    })
    return
   }
  //  isLogin是判断登录的请求如果有isLogin就判断是登录的请求 把cookie保存在本地存储里
   let result= await request('/login/cellphone',{phone,password,isLogin:true})
   if(result.code==200){
    wx.showToast({
      title:'登录成功',
      
    })
    // 将用户信息存储到本地 存储两个参数 第一个是名称 第二个是内容 方便其他组件拿到数据
    wx.setStorageSync("userInfo",result.profile)
    // switchTab是可以跳转到tabbar页面的 但还会保存不会销毁页面
    // reLaunch也是可以跳转 abbar页面的 会销毁页面
    wx.reLaunch({
      url: '../../pages/personal/index'
    });
   }else if(result.code==400){
    wx.showToast({
      title:'手机号错误',
      icon: 'none'
    })
   }else if(result.code==502){
    wx.showToast({
      title:'密码错误',
      icon: 'none'
    })
   }else{
    wx.showToast({
      title:'登录失败,请重新登录',
      icon: 'none'
    })
   }
   
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