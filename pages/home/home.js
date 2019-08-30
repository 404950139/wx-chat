const db = wx.cloud.database();
// 通过getApp()可以获得app.js里面的对象
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalCount: 0,
    topics: [],
    currentPage: 1,
    pageNum: 3
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 单信息的查看
   */
  onItemClick(e) {
    let id = e.currentTarget.dataset.topicid;
    let openid = e.currentTarget.dataset.openid;
    // 跳转
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id + "&openid=" + openid
    });
  },
  /**
   * 获取记录总数
   */
  getDataCount() {
    db.collection('topicDemo').where({
      _openid: app.globalData.openid
    }).count({
      success: res => {
        this.data.totalCount = res.total;
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
    this.getData();
    this.getDataCount();
  },
  /**
   * 获取数据
   */
  getData() {
    db.collection('topicDemo').orderBy('data', 'desc').limit(this.data.pageNum).get({
      success: res => {
        // 利用es6转换日期格式，否者无法显示日期
        res.data.map((value, index, array) => {
          value.date = String(value.date);
        });
        this.data.topics = res.data;
        this.setData({
          topics: this.data.topics
        });
        // 隐藏标题栏loading动作
        wx.hideNavigationBarLoading();
        // 停止下拉刷新动作
        wx.stopPullDownRefresh();
      },
      fail: res => {
        // 隐藏标题栏loading动作
        wx.hideNavigationBarLoading();
        // 停止下拉刷新动作
        wx.stopPullDownRefresh();
      }
    });
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
    // 加载标题栏loading动作
    wx.showNavigationBarLoading()
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let temp = [];
    // 获取后面10条记录
    if (this.data.topics.length < this.data.totalCount) {
      // 还可以拿
      db.collection('topicDemo').skip(this.data.pageNum * this.data.currentPage).get({
        success: res=> {
          if (res.data.length > 0) {
            for (let i = 0; i < res.data.length; i ++) {
              let temptopic = res.data[i];
              temp.push(temptopic);
            };
            let totalTopic = {};
            totalTopic = this.data.topics.concat(temp);
            this.setData({
              topics: totalTopic
            });
          };
          // 当前页加一
          this.data.currentPage += this.data.currentPage;
        }
      });
    } else {
      wx.showToast({
        title: "没有更多数据了"
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})