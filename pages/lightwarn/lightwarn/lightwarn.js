var myCharts = require("../../../utils/wxcharts.js")//引入一个绘图的插件
var lineChart_hum = null
var lineChart_light = null
var lineChart_warning = null
var app = getApp()

Page({
  data: {
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh', new Date())
  },


  //把拿到的数据转换成绘图插件需要的输入格式
  convert: function () {
    var categories = [];
    var humanhot = [];
    var light = [];
    var warning = [];

    var length = app.globalData.warning.datapoints.length
    for (var i = 0; i < length; i++) {
      categories.push(app.globalData.humanhot.datapoints[i].at.slice(0,1));
      humamhot.push(app.globalData.humanhot.datapoints[i].value);
      light.push(app.globalData.light.datapoints[i].value);
      warning.push(app.globalData.warning.datapoints[i].value);
    }
    return {
      categories: categories,
      humanhot: humanhot,
      light: light,
      warning: warning
    }
  },

  onLoad: function () {
    var warningData = this.convert();
    
    //得到屏幕宽度
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var warningData = this.convert();

    //新建人体红外图表
    lineChart_hum = new myCharts({
      canvasId: 'humanhot',
      type: 'line',
      categories: warningData.categories,
      animation: true,
      background: '#f5f5f5',
      series: [{
        name: 'humanhot',
        data: warningData.humanhot,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: 'humanhot (1/0)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 55
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });

  //新建光照强度图表
    lineChart_light = new myCharts({
      canvasId: 'light',
      type: 'line',
      categories: warningData.categories,
      animation: true,
      background: '#f5f5f5',
      series: [{
        name: 'light',
        data: warningData.light,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: 'light (lux)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 190
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });

    //新建警示图表
    lineChart_warning = new myCharts({
      canvasId: 'warning',
      type: 'line',
      categories: warningData.categories,
      animation: true,
      background: '#f5f5f5',
      series: [{
        name: 'warning',
        data: warningData.warning,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: 'warning ',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 24
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },

  
})
