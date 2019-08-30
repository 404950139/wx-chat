const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 5,
    totalCount: 0,
    collects: {},
    topics: []
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
    this.getData(this.data.page);
  },
  /**
   * 获取数据
   */
  getData(page) {
    db.collection('collectDemo').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.data.collects = res.data;
        this.getTopicFromCollects();
      }
    });
  },
  /**
   * 根据id获取话题
   */
  getTopicFromCollects() {
    let tempTopics = {};
    for (let i in this.data.collects) {
      let topicId = this.data.collects[i]._id;
      db.collection('topicDemo').doc(topicId).get({
        success: res => {
          res.data.date = String(res.data.date);
          this.data.topics.push(res.data);
          this.setData({
            topics: this.data.topics
          });
        },
        fail: console.error
      })
    }
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