const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content: "",
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    uers: {}
  },
  formSubmit(e) {
    this.data.content = e.detail.value['input-content'];
    this.data.title = e.detail.value["title"];
    if (this.data.canIUse) {
      if (this.data.title.trim() != "") {
        this.saveDataToServer();
      } else if (this.data.content.trim() != "") {
        this.saveDataToServer();
      } else {
        wx.showToast({
          title: "给我们点意见吧"
        });
      }
    } else {
      this.jugdeUserLogin();
    }
  },
  saveDataToServer() {
    this.showTopAndSwitchTab();
  },
  showTopAndSwitchTab() {
    db.collection("advanceDemo").add({
      data: {
        title: this.data.title,
        content: this.data.content
      },
      success: res => {
        wx.showToast({
          title: "反馈成功",
          duration: 500
        });
        setTimeout( () => {
          wx.navigateBack();
        }, 500)
      },
      fail: console.error
    })
  },
  jugdeUserLogin() {
    wx.getSetting({
      success: res => {
        // 判断是否已经授权
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: res => {
              this.data.user = res.userInfo;
            }
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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