import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'

new Main()



import KUKUBannerAd from './js/kuku/kuku-banner-ad'
//定义Banner广告组件对象
//参数一：您的小游戏APPID，后台会根据APPID获取分配的广告素材
//参数二: top,广告显示距离顶部的距离。-1置底显示
//参数三:width，广告组件的尺寸会根据开发者设置的宽度，进行等比缩放，缩放的范围是 300 到 屏幕宽度。屏幕宽度是以逻辑像素为单位的宽度，通过 wx.getSystemInfoSync() 可以获取到
let BannerAd = new KUKUBannerAd('23424sfawsrwdfas234', -1, 0, canvas.getContext('2d'))
//监听广告是否加载完成，加载完成后即可调用show()进行广告显示
BannerAd.onLoad(() => {
  BannerAd.show()
})

//至此，广告已经接入完成了。下面的事件监听，根据实际情况选用
//监听错误事件回调
BannerAd.onError((err) => {
  console.error(err)
})
//监听广告隐藏回调
BannerAd.onHide(() => {
  console.log('Banner Ad on hide')
})
//监听广告显示回调
BannerAd.onShow((sprits) => {
  console.log('Banner Ad on show', JSON.stringify(sprits))
})
//监听广告尺寸变化回调，返回resize后的广告width、height
BannerAd.onResize((obj) => {
  console.log('banner ad resize to', obj.width, obj.height)
})

//以下是测试广告组件的代码，请不要拷贝
//模拟隐藏
setTimeout(() => {
  //BannerAd.hide()
}, 5000)
//模拟显示
setTimeout(() => {
  //BannerAd.show()
}, 10000)

//模拟隐藏改变广告组件的top及宽度值，改变后会触发onResize()
setTimeout(() => {
  //BannerAd.style(1000, 375)
}, 15000)


import KUKUICONAd from './js/kuku/kuku-icon-ad'
//定义ICON广告组件对象
//参数一：您的小游戏APPID，后台会根据APPID获取分配的广告素材
//参数二: left,广告显示距离左边的距离，默认0
//参数三: top,广告显示距离顶部的距离。默认取值-1置底显示
//参数四:width，广告组件的尺寸，最小30*30，最大200*200
//参数五：画布上下文对象
let IconAd = new KUKUICONAd('23424sfawsrwdfas234',10,100, 60, canvas.getContext('2d'))
//监听广告是否加载完成，加载完成后即可调用show()进行广告显示
IconAd.onLoad(() => {
  IconAd.show()
  //无法显示图片ICON时，请游戏方通过下面接口获取当前要显示的ICON数据，实现定时轮询获取不同的ICON广告展示
  console.log('icon getRandom', JSON.stringify(IconAd.getRandom()))
})

//至此，广告已经接入完成了。下面的事件监听，根据实际情况选用
//监听错误事件回调
IconAd.onError((err) => {
  console.error(err)
})
//监听广告隐藏回调
IconAd.onHide(() => {
  console.log('icon Ad on hide')
})
//监听广告显示回调
IconAd.onShow((sprits) => {
  console.log('icon Ad on show', JSON.stringify(sprits))
})
//监听广告尺寸变化回调，返回resize后的广告width、height
IconAd.onResize((obj) => {
  console.log('icon ad resize to', obj.width, obj.height)
})


//以下是测试广告组件的代码，请不要拷贝
//模拟隐藏
setTimeout(() => {
  //IconAd.hide()
}, 5000)
//模拟显示
setTimeout(() => {
  //IconAd.show()
}, 10000)

//模拟隐藏改变广告组件的top及宽度值，改变后会触发onResize()
setTimeout(() => {
  //IconAd.style(1000, 375)
}, 15000)


 