const { envList } = require('../envList.js');

Page({
  onShow() {
  },
  data: {
    prompt: '',
    negativePrompt: '',
    seed: -1,
    sampleStep: 35,
    scale: 11,
    multiArray: [['512', '768'], ['512', '768', '1024']],
    multiIndex: [0, 0],
    imgPath: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
    theme: 'light',
    envList,
    selectedEnv: envList[0],
  },
  bindClickImg: function () {
    wx.previewImage({
      urls: [this.data.imgPath],
    })
  },
  bindPromptInput: function (e) {
    this.data.prompt = e.detail.value;
    console.log('输入prompt:', this.data.prompt)
  },
  bindNPromptInput: function (e) {
    this.data.negativePrompt = e.detail.value;
    console.log('输入negativePrompt:', this.data.negativePrompt)
  },
  bindSeedInput: function (e) {
    this.data.seed = e.detail.value
    console.log('输入seed:', this.data.seed)
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    console.log(data.multiIndex);
    this.setData(data);
  },
  slider1change: function (e) {
    console.log('采样步数改变，携带值为', e.detail.value)
    this.setData({
      sampleStep: e.detail.value
    })
  },
  slider2change: function (e) {
    console.log('采样规模改变，携带值为', e.detail.value)
    this.setData({
      scale: e.detail.value
    })
  },
  bindGenerate: function () {
    console.log('生成', this.data.prompt, this.data.negativePrompt, this.data.seed, this.data.sampleStep, this.data.scale)
    var url = 'https://lightbox-ideal-situations-gem.trycloudflare.com/generate-stream'//'http://127.0.0.1:6969/generate-stream'
    var params = {
      height: this.data.multiArray[1][this.data.multiIndex[1]],
      width: this.data.multiArray[0][this.data.multiIndex[0]],
      scale: this.data.scale ?? 12,
      steps: this.data.sampleStep ?? 28,
      noise: 0.2,
      strength: 0.7,
    } 
    wx.showLoading({
      title: '正在努力画画中',
    });
    var that = this;
    /*wx.request({
      url: url,    
      method: 'POST',    
      header: { 'content-type': 'application/json'},    
      data: JSON.stringify({...params, prompt:this.data.prompt}),    
      success: function(resp) {            
        console.log(resp.data)   
        var tmp = JSON.parse(JSON.stringify(resp.data))
        var ss = JSON.stringify(resp.data).split('\\n')[2]
        //that.data.imgPath = that.getBase64ImageUrl(ss.split(':')[1])
        that.setData({
          //openId: resp.result.openid
          //resp.data.slice(27)
          imgPath: that.getBase64ImageUrl(ss.split(':')[1])
        });  
        wx.hideLoading();
      },
      fail: function(e) {
        wx.hideLoading();
        console.error(e)
      }  
    })*/

    

    var that = this;
    wx.cloud.callFunction({
      name: 'httpFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'http',
        url: url,
        body: {...params, prompt:this.data.prompt}
      },
      success: function(resp) {
        console.log(resp)
        if (resp.result==null) {
          return
        }
        var ss = JSON.stringify(resp.result).split('\\n')[2]
        that.setData({
          imgPath: that.getBase64ImageUrl(ss.split(':')[1])
        });  
        wx.hideLoading();
      },
      fail: function(e) {
        wx.hideLoading();
        console.error(e)
      } 
    });
  },
  //把base64转换成图片
  getBase64ImageUrl: function(data) {
      //console.log(data) 
      /// 获取到base64Data
      var base64Data = data;
      /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
      base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
      /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
      const base64ImgUrl = "data:image/png;base64," + base64Data;
      /// 刷新数据
      return base64ImgUrl;
  },
  bindReset: function () {
    console.log('重置', )
    this.setData({
      prompt: '',
      negativePrompt: '',
      seed: -1,
      sampleStep: 35,
      scale: 11,
      imgPath: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg'
    })
  },

  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
  },
})


