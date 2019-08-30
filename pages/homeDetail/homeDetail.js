const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    id: '',
    openid: '',
    isLike: false,
    replays: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.data.openid = options.openid;
    // 获取话题信息
    db.collection('topicDemo').doc(this.data.id).get({
      success: res => {
        res.data.date = String(res.data.date);
        this.topic = res.data;
        this.setData({
          topic: this.topic
        });
      }
    });
    // 获取收藏喜欢的状态
    db.collection('collectDemo').where({
      _openid: this.data.openid,
      _id: this.data.id
    }).get({
      success: res => {
        if (res.data.length > 0) {
          this.refreshLikeIcon(true);
        } else {
          this.refreshLikeIcon(false);
        }
      },
      fail: console.error
    });
  },
  /**
   * 预览图片
   */
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.topic.images[index],
      urls: this.data.topic.images
    })
  },
  onReplayClick() {
    // 跳转
    wx.navigateTo({
      url: '../reply/reply?id=' + this.data.id + "&openid=" + this.data.openid
    })
  },
  /**
   * 是否喜欢
   */
  onLikeClick(e) {
    if (this.data.isLike) {
      this.removeFormCollectServer();
    } else {
      this.saveToCollectionServer();
    }
  },
  /**
   * 取消喜欢
   */
  removeFormCollectServer() {
    db.collection('collectDemo').doc(this.data.id).remove({
      success: res => {
        this.refreshLikeIcon(false);
      }
    });
  },
  /**
   * 添加喜欢
   */
  saveToCollectionServer() {
    db.collection('collectDemo').add({
      data: {
        _id: this.data.id,
        date: new Date()
      },
      success: res =>{
        // 刷新切换喜欢图标
        this.refreshLikeIcon(true);
      }
    });
  },
  /**
   * 切换图标
   */
  refreshLikeIcon(isLike) {
    this.data.isLike = isLike;
    this.setData({
      isLike: isLike
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
    // 获取回复列表
    this.getReply();
  },
  getReply() {
    db.collection('replayDemo').where({
      t_id: this.data.id
    }).get({
      success: res => {
        this.setData({
          replays: res.data
        });
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