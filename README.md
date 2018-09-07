# KUKU广告组件(Banner)使用说明文档

## KUKU广告组件(Banner)功能介绍

1. KUKU广告组件是娱乐娱乐专门针对**微信小游戏**的个性化定制的**Banner广告组件**
1. KUKU广告组件支持广告区域设定，同时支持**1~8**个广告小游戏**跳转**或小游戏二维码**预览**
1. KUKU广告组件本着程序员最烦耦合他人代码的原则，本组件开发以接入简单为目标，**请耐心看完文档**

## 获取广告组件JS代码
请联系我获取最新的kuku-ad.min.js文件

## 如何接入KUKU广告组件

打开小游戏工程，找到小游戏入口js文件**game.js**

```

import KUKUBannerAd from './js/kukuad/banner-ad.min'//注意你自己放的位置

//创建一个Banner广告组件new KUKUBannerAd(appid,top,width)
//参数一：appid,必填，您的小游戏APPID，会根据APPID获取分配的广告素材
//参数二: top,可选，广告显示距离顶部的距离，-1或者设置的top加上广告组件高度超过屏幕高度则置底显示。
//参数三:width，可选，广告组件的尺寸会根据开发者设置的宽度，进行等比缩放，缩放的范围是 300 到 屏幕宽度。屏幕宽度是以逻辑像素为单位的宽度，通过 wx.getSystemInfoSync() 可以获取到
//参数四：ctx，可选，画布渲染RenderingContext不传默认是微信对象canvas.getContext('2d')
let BannerAd = new KUKUBannerAd('wx1234abcde')
//监听广告是否加载完成，加载完成后即可调用show()进行广告显示
BannerAd.onLoad(()=>{
  BannerAd.show()
})

//至此，广告已经接入完成了。下面的事件监听，根据实际情况选用
//监听错误事件回调
BannerAd.onError((err) => {
  console.error(err)
})
//监听广告隐藏回调
BannerAd.onHide(()=>{
  console.log('Banner Ad on hide')
})
//监听广告显示回调
BannerAd.onShow(() => {
  console.log('Banner Ad on show')
})
//监听广告尺寸变化回调，返回resize后的广告width、height
BannerAd.onResize((obj)=>{
  console.log('banner ad resize to',obj.width,obj.height)
})

//以下是测试广告组件API的代码，**请不要拷贝**根据您的游戏场景使用
//模拟隐藏广告组件
setTimeout(()=>{
  BannerAd.hide()//隐藏广告组件
},5000)

//模拟显示广告组件
setTimeout(() => {
  BannerAd.show()//显示广告组件
}, 10000)

//模拟隐藏改变广告组件的top及宽度值，改变后会触发onResize()
setTimeout(() => {
  BannerAd.style(1000,375)//改变广告组件的style
}, 15000)
```




## 注意： 第三方引擎问题

由于第三方引擎，针对画布canvas的处理方式不同，无法一一兼容。若出现没有显示广告的情况，请按照如下处理。

1. 监听onShow，获取广告精灵数据
```
//监听广告显示回调
BannerAd.onShow((adSprits) => {
  console.log('Banner Ad on show',adSprits)
})
```
2. 根据精灵数据，游戏开发方**自行将广告绘制展示**；
3. 精灵数据为一个数组，格式及说明如下 ：

```
[{
	"startX": 10,//此精灵的开始X坐标
	"startY": 468,//此精灵的开始Y坐标
	"w": 75,//此精灵的宽度
	"h": 50,//此精灵的高度
	"endX": 85,//此精灵的结束X坐标
	"endY": 518,//此精灵的结束Y坐标
	"img": {}//此精灵的图片对象，微信的new Image()对象
}, {
	"startX": 85,
	"startY": 468,
	"w": 75,
	"h": 50,
	"endX": 160,
	"endY": 518,
	"img": {}
}, {
	"startX": 160,
	"startY": 468,
	"w": 75,
	"h": 50,
	"endX": 235,
	"endY": 518,
	"img": {}
}, {
	"startX": 235,
	"startY": 468,
	"w": 75,
	"h": 50,
	"endX": 310,
	"endY": 518,
	"img": {}
}, {
	"startX": 10,
	"startY": 518,
	"w": 75,
	"h": 50,
	"endX": 85,
	"endY": 568,
	"img": {}
}, {
	"startX": 85,
	"startY": 518,
	"w": 75,
	"h": 50,
	"endX": 160,
	"endY": 568,
	"img": {}
}, {
	"startX": 160,
	"startY": 518,
	"w": 75,
	"h": 50,
	"endX": 235,
	"endY": 568,
	"img": {}
}, {
	"startX": 235,
	"startY": 518,
	"w": 75,
	"h": 50,
	"endX": 310,
	"endY": 568,
	"img": {}
}]
```
4. 绘制精灵的示例代码；
```
      for (let i in adSprits) {
        let sprit = adSprits[i]
        ctx.drawImage(
          sprit.img,
          sprit.startX,
          sprit.startY,
          sprit.w,
          sprit.h
        ) 
      }
```
5. 精灵事件已经监听，游戏开发方不需要再次监听广告位置点击事件；
# 联系方式

QQ：157085863 
Email：wenxy@aiyinli.cn）

