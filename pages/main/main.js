const app = getApp()
const Sea = require('../../packages/bigsea.js')
Page({
  data: {
  },
  onLoad() {
  },
  onShow() {
  },
  bindRedirection1:function() {
      Sea.path('pages/plant/plant')
    },

  bindRedirection2: function () {
    Sea.path('pages/express/express')
  },
  bindRedirection3: function () {
    Sea.path('pages/sell/sell')
  }
})