//获取应用实例
var app = getApp()
var postsData = require('../../data/post-data.js')
Page({
    data: {
        imgUrls: [
          '/images/wx.png',
          '/images/vr.png',
          '/images/iqiyi.png'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        vertical: false,
        postList: null
    },
    onLoad: function(){
        this.setData({
            postList: postsData.postList
        })
    },
    onPostTap: function(event){
        var postId = event.currentTarget.dataset.postid;
        wx.navigateTo({
            url: 'post-detail/post-detail?id='+postId
        })
    },
    onSwiperTap: function(event){
        var postId = event.target.dataset.postid;
        console.log(postId)
        wx.navigateTo({
            url: 'post-detail/post-detail?id='+postId
        })
    }
})