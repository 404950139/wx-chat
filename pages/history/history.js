const app = getApp();
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 5,
    totalCount: 0,
    topics: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData(this.data.page);
  },
  getData() {
    db.collection("topicDemo").count({
      success: res => {
        this.data.totalCount = res.total;
      }
    });
    try {
      db.collection("topicDemo")
        .where({
          _openid: app.globalData.openid
        })
        .limit(this.data.pageSize)
        .orderBy("date", "desc")
        .get({
          success: res => {
            res.data.map((value, index, array) => {
              value.date = String(value.date);
            });
            this.data.topics = res.data;
            this.setData({
              topics: this.data.topics
            });
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
          },
          fail: res => {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
          }
        });
    } catch (e) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      console.log(e);
    }
  },
  onItemClick(e) {
    let id = e.currentTarget.dataset.topicid;
    let openid = e.currentTarget.dataset.openid;
    // 跳转
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id + "&openid=" + openid
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // 加载标题栏loading动作
    wx.showNavigationBarLoading();
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var temp = [];

    if (this.data.topics.length < this.data.totalCount) {
      try {
        db.collection("topicDemo")
          .where({
            _openid: app.globalData.openid
          })
          .skip(5)
          .limit(this.data.pageSize)
          .orderBy("date", "desc")
          .get({
            success: res => {
              if (res.data.length > 0) {
                for (let i = 0; i < res.data.length; i++) {
                  let tempTopic = res.data[i];
                  temp.push(tempTopic);
                }

                let totalTopic = {};
                totalTopic = this.data.topics.concat(temp);

                this.setData({
                  topics: totalTopic
                });
              } else {
                wx.showToast({
                  title: "没有更多数据了"
                });
              }
            }
          });
      } catch (e) {
        console.error(e);
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
