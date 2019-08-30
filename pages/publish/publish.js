// 连接云数据库
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    previewImages: [],
    user: {},
    content: "",
    canIUse: wx.canIUse("button.open-type.getUserInfo"), //判断是否已授权
    isLike: false
  },
  /**
   * 表单提交
   */
formsubmit(e) {
    this.data.content = e.detail.value["input-content"];
    if (this.data.canIUse) {
      if (this.data.previewImages.length > 0) {
        for (let i = 0 ; i < this.data.previewImages.length; i ++) {
          // 将图片上传至存储空间
          wx.cloud.uploadFile({
            cloudPath: this.timetostr(new Date()),
            filePath: this.data.previewImages[i],
            success: res => {
              this.data.images.push(res.fileID);
              if (i === this.data.previewImages.length - 1) {
                this.saveDataToServer();
              };
            }
          });
        };
      } else if (this.data.content.trim() != "") {
        this.saveDataToServer();
      } else {
        wx.showToast({
          title: "写点东西吧",
          icon: "none"
        });
      }
    } else {
      this.jugdeUserLogin();
    }
  },
  /**
   * 上传图片
   */
  upImage() {
    // 图片上传
    return new Promise((resolve, reject) => {
      for (let i = 0 ; i < this.data.previewImages.length; i ++) {
        // 将图片上传至存储空间
        wx.cloud.uploadFile({
          cloudPath: this.timetostr(new Date()),
          filePath: this.data.previewImages[i],
          success: res => {
            this.data.images.push(res.fileID);
            if (i === this.data.previewImages.length - 1) {
              resolve();
            };
          }
        });
      };
    });
  },
  /**
   * 保存到服务器(云数据库)
   */
  saveDataToServer() {
    // 在云端创建数据集合topicDemo
    db.collection("topicDemo").add({
      // data 字段表示需要新增的json数据
      data: {
        content: this.data.content,
        date: new Date(),
        images: this.data.images,
        user: this.data.user,
        isLike: this.data.isLike
      },
      success: res => {
        // 保存到发布历史
        this.saveToHistoryServer();
        // 数据清空
        this.data.content = "";
        this.data.images = [];
        this.data.previewImages = [];
        this.setData({
          content: "",
          images: [],
          previewImages: []
        });
        // 用户提示
        this.showTopAndSwitchTab();
      }
    });
  },
  /**
   * 用户提示
   */
  showTopAndSwitchTab() {
    wx.showToast({
      title: "新增记录成功",
      duration: 500
    });
    setTimeout(() => {
      // 跳转
      wx.switchTab({
        url: "../home/home"
      });
    }, 500);
  },
  /**
   * 选择图片
   */
  chooseImage() {
    wx.chooseImage({
      count: 6,
      success: res => {
        // 预览
        this.setData({
          previewImages: res.tempFilePaths
        });
      }
    });
  },
  /**
   * 图片时间的重取名(可自行定义)
   */
  timetostr(time) {
    let random = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    // getMilliseconds返回时间的毫秒数
    let str = random + "_" + time.getMilliseconds() + "png";
    return str;
  },
  /**
   * 用户头像获取权限的操作
   */
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
   * 预览图片
   */
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.previewImages[index],
      urls: this.data.previewImages
    })
  },
  /**
   * 删除图片
   */
  removeImg(e) {
    let position = e.currentTarget.dataset.index;
    this.data.previewImages.splice(position, 1);
    // 重新赋值给data
    this.setData({
      previewImages: this.data.previewImages
    });
  },
  /**
   * 发布历史记录
   */
  saveToHistoryServer() {
    db.collection("historyDemo").add({
      // data字段表示需新增的json数据
      data: {
        content: this.data.content,
        date: new Date(),
        images: this.data.images,
        user: this.data.user,
        isLike: this.data.isLike
      },
      success: res => {
        // console.log(res);
      },
      fail: rej => {
        console.error;
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取权限
    this.jugdeUserLogin();
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
