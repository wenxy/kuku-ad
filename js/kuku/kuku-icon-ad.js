//const _host = 'https://adsdk.kuku168.cn'
const _host = 'http://192.168.0.88:9060'
const _mock = false
const _initAdURL = _host + '/Advert/reportSystemInfo';
const _listAdsURL = _host + '/Advert/listByAppId'
const _reportUserClickURL = _host + '/Advert/reportUserAction'

const ACTION_CLICK = 1
const ACTION_SHOW = 2
const ACTION_HIDE = 3

const ACTION_NAV_MIN_APP = 'NAV_MIN_APP'
const ACTION_PREVIEW_SUNCODE = 'PREVIEW_SUNCODE'

const ACTION_STATUC_SUCCESS = 1
const ACTION_STATUC_FAIL = 2
const ACTION_STATUC_LOWER = 3

const {
  pixelRatio,
  windowWidth,
  windowHeight,
  SDKVersion
} = wx.getSystemInfoSync()



export default class IconAd {

  constructor(appId = '', left = 0, top = -1, width = 30, ctx) {
    this.visable = false
    this.ctx = ctx
    if (!appId) {
      let err = new Error('appId参数不能为空');
      throw err
      if (that.onErrorCallback) {
        that.onErrorCallback(err)
      }
    }
    this.appId = appId

    this.style(left, top, width)

    let that = this
    let initPromise = this._initAd()
    initPromise.then((data) => {
      let listAdResPromise = that._listAdRes()
      listAdResPromise.then((data) => {
        that.adData = data
        that.visable = that.adData.show
        that.interval = that.adData.interval || 5000
        that._calculateSprit()
        that.touchHandler = that._touchEventHandler.bind(that)
        canvas.addEventListener('touchstart', that.touchHandler)
        if (that.onLoadCallback) {
          console.log('Icon onLoad ...', that.currentSprit)
          that.onLoadCallback()
        }
      }).catch((err) => {
        if (that.onErrorCallback) {
          that.onErrorCallback(err)
        }
      })
    }).catch((err) => {
      if (that.onErrorCallback) {
        that.onErrorCallback(err)
      }
    })
  }

  onLoad(callbackFunc) {
    if (typeof(callbackFunc) == 'function') {
      this.onLoadCallback = callbackFunc
    } else {
      console.warn('KUKU ICON广告组件->onLoad parameter must be  function')
    }
  }
  onError(callbackFunc) {
    if (typeof(callbackFunc) == 'function') {
      this.onErrorCallback = callbackFunc
    } else {
      console.warn('KUKU ICON广告组件->onError parameter must be  function')
    }
  }
  onShow(callbackFunc) {
    if (typeof(callbackFunc) == 'function') {
      this.onShowCallback = callbackFunc
    } else {
      console.warn('KUKU ICON广告组件->onShow parameter must be  function')
    }
  }
  onHide(callbackFunc) {
    if (typeof(callbackFunc) == 'function') {
      this.onHideCallback = callbackFunc
    } else {
      console.warn('KUKU ICON广告组件->onHide parameter must be  function')
    }
  }
  onResize(callbackFunc) {
    if (typeof(callbackFunc) == 'function') {
      this.onResizeCallback = callbackFunc
    } else {
      console.warn('KUKU ICON广告组件->onResize parameter must be  function')
    }
  }
  style(left = 10, top = 10, width = 30) {
    this.width = width
    //console.log('style-->', windowWidth,this.width)
    if (this.width < 30 || this.width == 0) {
      this.width = 30
    }
    if (this.width > 200) {
      this.width = 200
    }
    this.height = this.width
    if (this.onResizeCallback) this.onResizeCallback({
      width: this.width,
      height: this.height
    })
    this.left = left
    this.top = top
    if (top == -1 || this.top > windowHeight - this.height) { //设置默认显示在距离底部10px的位置
      console.warn('KUKU ICON广告组件->top过大，自动调整广告位置显示位置,显示最底部')
      this.top = windowHeight - this.height
    }
    this._calculateSprit()
  }

  show() {
    var that = this
    that.visable = true
    that._start()
    that._reportUserAction(0, ACTION_SHOW, 0, '')
    if (that.onShowCallback) that.onShowCallback(that.currentSprit)
  }

  hide() {
    this._cancelFrame()
    this.visable = false     
    clearInterval(this.intervalHold)
    if (this.onHideCallback) this.onHideCallback()
    this._reportUserAction(0, ACTION_HIDE, 0, '')
  }
  //随机设置当前绘制的ICON
  getRandom() {
    var that = this
    if (!that.sprits || that.sprits.length == 0) return;
    //随机
    let n = 0
    let m = that.sprits.length
    let w = m - n
    let ridx = parseInt(Math.random() * w + n, 10)
    that.currentSprit = that.sprits[ridx]
    return that.currentSprit
  }

  _start() {
    var that = this
    this.intervalHold = setInterval(function() {
      that._cancelFrame()
      that.aniId = that._requestFrame();
    }.bind(that), 10)
  }

  _loop() {
    this._render()
    this.aniId = this._requestFrame()
  }

  /**
   * 初始化广告ID
   */
  _initAd() {
    var that = this
    let systeminfo = wx.getSystemInfoSync()
    systeminfo.appId = this.appId
    return new Promise((resolve, reject) => {
      console.log('KUKU ICON广告组件->KUKUAD INIT...', systeminfo)
      let uuid = wx.getStorageSync('KUKU_UUID') || ''
      //存在
      if (uuid) {
        that.uuid = uuid
        resolve({
          uuid: uuid
        })
        return
      }

      wx.request({
        url: _initAdURL,
        data: systeminfo,
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'KUKU_UUID='
        },
        method: 'POST',
        complete: function(res) {
          console.log('KUKU ICON广告组件->KUKUAD INIT RESULT', res)
          if (_mock) {
            that.uuid = 'mock-uuid-1234567890'
            wx.setStorageSync('KUKU_UUID', 'mock-uuid-1234567890')
            resolve({
              uuid: 'mock-uuid-1234567890'
            })
          }
          if (res.statusCode == 200 && res.data.code == 1 && res.data.data.uuid) {
            that.uuid = res.data.uuid
            wx.setStorageSync('KUKU_UUID', res.data.data.uuid)
            resolve(res.data)
            console.log('KUKU ICON广告组件->KUKUAD INIT SUCCESSFULL!')
          } else {
            reject('KUKUAD INIT FAIL.')
          }
        }
      })
    })
  }

  /**
   * 加载广告资源
   */
  _listAdRes() {
    var that = this
    return new Promise((resolve, reject) => {
      console.log('KUKU ICON广告组件->KUKUAD LOAD RES...')
      wx.request({
        url: _listAdsURL,
        data: {
          appId: that.appId,
          type: 2
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'KUKU_UUID=' + that.uuid || ''
        },
        method: 'POST',
        complete: function(res) {
          console.log('KUKU ICON广告组件->KUKUAD  RES LOAD RESULT', res)
          if (_mock) {
            resolve({
              show: true,
              type: 1,
              materials: [{
                id: 1,
                appId: 'wx123456790',
                img: 'https://imgweb.kuku168.cn/c8f42f85bee94ffba49962923a54448c',
                suncode: 'https://imgweb.kuku168.cn/974ee250582d499785f2b17aeba5109c',
                path: '',
                extData: ''
              }]
            })
          }
          if (res.statusCode == 200 && res.data.code == 1 && res.data.data.materials) {
            resolve(res.data.data)
            console.log('KUKU ICON广告组件->KUKUAD RES LOAD SUCCESSFULL!')
          } else {
            reject('KUKUAD RES LOAD FAIL.')
          }
        }
      })
    })
  }

  _requestFrame() {
    return window.requestAnimationFrame(this._loop.bind(this), canvas);
  }

  _cancelFrame() {
    window.cancelAnimationFrame(this.aniId);
  }

  _render() {

    if (!this.visable) {
      return
    }

    try {
      let ctx = this.ctx
      if (!this.currentSprit) {
        return
      }

      ctx.save()
      ctx.clearRect(this.left, this.top, this.width, this.height)
      let sprit = this.currentSprit
      ctx.drawImage(
        sprit.img,
        sprit.startX,
        sprit.startY,
        sprit.w,
        sprit.h
      )
      ctx.restore()
    } catch (err) {
      if (this.onErrorCallback) this.onErrorCallback(err)
    }
  }

  _calculateSprit() {
    if (!this.adData) return
    this.sprits = []
    let materials = this.adData.materials
    let w = this.width
    let h = this.height
    for (let i in materials) {
      let sprit = {}
      sprit.data = materials[i]
      sprit.startX = this.left
      sprit.startY = this.top

      sprit.w = w
      sprit.h = h

      sprit.endX = sprit.startX + w
      sprit.endY = sprit.startY + sprit.h

      let img = new Image()
      img.src = sprit.data.img
      sprit.img = img

      this.sprits.push(sprit)
    }
    //
    let that = this
    that.getRandom()
    setInterval(function(){that.getRandom()},that.interval||5000)    
  }

  _touchEventHandler(e) {
    e.preventDefault()
    if (!this.visable || !this.currentSprit) return false

    var that = this
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    //console.log('touch x,y', x, y) 
    let sprit = this.currentSprit
    if (x >= sprit.startX && x <= sprit.endX && y >= sprit.startY && y <= sprit.endY && sprit.data) {
      if (sprit.data.appId) {
        if (!wx.navigateToMiniProgram) {
          console.error('KUKU ICON广告组件->不支持 navigateToMiniProgram 支持版本 >= 2.2.0, 当前SDK版本', SDKVersion)
          that._reportUserAction(sprit.data.id, ACTION_CLICK, ACTION_STATUC_LOWER, ACTION_STATUC_LOWER) 
          return
        }
        wx.navigateToMiniProgram({
          appId: sprit.data.appId,
          path: sprit.data.path || '',
          extraData: sprit.data.extData || {},
          success: function(res) {
            that._reportUserAction(sprit.data.id, ACTION_CLICK, ACTION_STATUC_SUCCESS, ACTION_NAV_MIN_APP)
          },
          fail: function(res) {
            console.warn('KUKU ICON广告组件->跳转小程序失败', res)
            that._reportUserAction(sprit.data.id, ACTION_CLICK, ACTION_STATUC_FAIL, ACTION_NAV_MIN_APP)
          }
        })
        return
      } else if (sprit.data.suncode) {
        if (!wx.previewImage) {
          console.error('KUKU ICON广告组件->不支持 previewImage , 当前SDK版本', SDKVersion)
          that._reportUserAction(sprit.data.id, ACTION_CLICK, ACTION_STATUC_LOWER, ACTION_PREVIEW_SUNCODE)
          return
        }
        wx.previewImage({
          urls: [sprit.data.suncode],
          success: function() {
            that._reportUserAction(sprit.data.id, ACTION_CLICK, ACTION_STATUC_SUCCESS, ACTION_PREVIEW_SUNCODE)
          },
          fail: function(res) {
            console.warn('KUKU ICON广告组件->预览太阳码失败', res)
            that._reportUserAction(sprit.data.id, ACTION_CLICK, ACTION_STATUC_FAIL, ACTION_PREVIEW_SUNCODE)
          }
        })
        return 
      }
    }
  }

  _reportUserAction(adId = 0, action = 0, status = 0, clickAction = '') {
    var that = this
    console.log('KUKU ICON广告组件->KUKU AD REPORT USER ACTION', {
      action: action,
      adId: adId,
      status: status,
      clickAction: clickAction
    })
    wx.request({
      url: _reportUserClickURL,
      data: {
        appId: that.appId,
        adId: adId,
        action: action,
        type: 2,
        status: status,
        clickAction: clickAction
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'KUKU_UUID=' + that.uuid || ''
      },
      method: 'POST',
      complete: function(res) {
        //console.log('KUKUAD REPORT USER COMPLETE.', res)       
      }
    })
  }
}