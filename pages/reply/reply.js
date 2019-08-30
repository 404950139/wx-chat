const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    openid: "",
    content: ""
  },
  bindKeyInput(e) {
    this.data.content = e.detail.value;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.data.openid = options.openid;
  },
  saveReplay() {
    db.collection('replayDemo').add({
      data: {
        content: this.data.content,
        date: new Date(),
        r_id: this.data.id,
        u_id: this.data.openid,
        t_id: this.data.id
      },
      success: res => {
        wx.showToast({
          title: "发表成功"
        });
        setTimeout(() => {
          wx.navigateTo({
            url: '../homeDetail/homeDetail?id=' + this.data.id + "&openid=" +this.data.openid
          })
        }, 1500);
      }
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