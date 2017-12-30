// start.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    opacity: 0.4,
    disabled: true,
    threshold: 0,
    rule: 'up',
    items: [
      { name: 'up', value: '灯亮无人时提醒' ,checked:'ture'},
      { name: 'down', value: '给出建议' },
    ]
  },

  radioChange: function (e) {
    //保存报警规则到当前页面的数据
    if (e.detail.value != "") {
      this.setData({
        rule: e.detail.value
      })
    }
    console.log(this.data.rule)
  },
  
  send: function(){
    var that = this
     //取得门限数据和报警规则
     var thres = this.data.threshold
     var Rule = this.data.rule
    const requestTask = wx.request({
      url: 'https://api.heclouds.com/devices/23368337/datapoints?datastream_id=Light,Humanhot,warning&limit=15', 
      header: {
        'content-type': 'application/json',
        'api-key': 'hOLSXll3NjDSg6SJFIhjIxfYsfg='
      },

      success: function (res) {
        // 利用正则字符串从onenet的返回数据中截出今天的数据
        var str = res.data.data.datastreams[2];
        var warning = str;


	//门钥已给出
        if (warning == that.data.threshold) {
          if (that.data.rule == "up") { 
	    //规则为等于门限报警，于是报警
            wx.showModal({
              title: '提醒',
              content: '没人但灯亮着',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
	   //规则为等于门钥给出建议，于是给出建议
          else if (that.data.rule == "down") {
            wx.showModal({
              title: '注意',
              content: '需要找人关灯。',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
	//警报值不等于门钥
        else if (warning != that.data.threshold) {
	 //规则为不等于门钥给出建议，于是给出建议
          if (that.data.rule == "up") {
            wx.showModal({
              title: '放心',
              content: '现在一切安好',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
           //规则为不等于门钥报警，于是报警
          else if (that.data.rule == "down"){
            wx.showModal({
              title: '放心',
              content: '现在一切安好',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      },

      fail: function (res) {
        console.log("fail!!!")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },
  getDataFromOneNet: function () {
    //从oneNET请求我们的小程序的数据
    const requestTask = wx.request({
      url: 'https://api.heclouds.com/devices/23368337/datapoints?datastream_id=Light,Humanhot,warning&limit=15',
      header: {
        'content-type': 'application/json',
        'api-key': 'hOLSXll3NjDSg6SJFIhjIxfYsfg='
      },
      success: function (res) {
        //console.log(res.data)
        //拿到数据后保存到全局数据
        var app = getApp()
        app.globalData.humanhot = res.data.data.datastreams[0]
        app.globalData.light = res.data.data.datastreams[1]
        app.globalData.warning = res.data.data.datastreams[2]
        console.log(app.globalData.warning)
        //跳转到warning页面，根据拿到的数据绘图
        wx.navigateTo({
          url: '../lightwarn/lightwarn/lightwarn',
        })
      },

      fail: function (res) {
        console.log("fail!!!")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },

  change: function (e) {
    //当有输入时激活发送按钮，无输入则禁用按钮
    if (e.detail.value != "") {
      this.setData({
        threshold: e.detail.value,
        opacity: 1,
        disabled: false,
      })
    } else {
      this.setData({
        threshold: 0,
        opacity: 0.4,
        disabled: true,
      })
    }
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
