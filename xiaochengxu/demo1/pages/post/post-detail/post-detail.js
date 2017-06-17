/**
 * Created by zhoumeiyan on 17/1/4.
 */
var app = getApp()    //获取应用实例
var postsData = require('../../../data/post-data.js')   //获取本地数据
Page({
    data: {
        postData: null,
        isPlayingMusic: false,
        collected: false,
        currentPostId: -1
    },
    onLoad: function(option){
        this.setData({
            postData: postsData.postList[option.id],
            currentPostId: option.id
        })
        var postsCollected = wx.getStorageSync("posts_collected");
        if(postsCollected){
            if(postsCollected[option.id]){
                this.setData({
                    collected: postsCollected[option.id]
                })
            }
        }else{
            postsCollected = {};
            postsCollected[option.id] = false;
            wx.setStorageSync("posts_collected",postsCollected)
        }
        if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.currentPostId){
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setMusicMonitor()

    },
    onCollectionTap: function(event){
        this.getPostsCollectedSync()
    },
    getPostsCollectedSync: function(){
        var postsCollected = wx.getStorageSync("posts_collected");
        if(postsCollected){
            postsCollected[this.data.currentPostId] = !postsCollected[this.data.currentPostId];
        }else{
            postsCollected[this.data.currentPostId] = true;
        }
        this.setData({
            collected: postsCollected[this.data.currentPostId]
        })
        wx.setStorageSync("posts_collected",postsCollected)
        wx.showToast({
            title: this.data.collected ? "收藏成功" : "取消成功",
            icon: "success",
            duration: 1000
        })
    },
    onShareTap: function(){
        var itemList = [
            '微信好友',
            '朋友圈',
            'QQ',
            '微博'
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: '#1F4BA5',
            success: function(res){
                wx.showModal({
                    title: '分享到' + itemList[res.tapIndex] + "号",
                    content: "小程序做不到分享，微信什么时候给这个接口？"
                })
            }
        })
    },
    setMusicMonitor: function(event){
        var that = this;
        wx.onBackgroundAudioPlay(function(event){
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true
            app.globalData.g_currentMusicPostId = this.data.currentPostId
        })
        wx.onBackgroundAudioPause(function(event){
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false
            app.globalData.g_currentMusicPostId = null
        })
        wx.onBackgroundAudioStop(function(event){
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false
            app.globalData.g_currentMusicPostId = null
        })
    },
    onMusicTap: function(event){
        var that = this;
        if(that.data.isPlayingMusic){
            wx.pauseBackgroundAudio()
            that.setData({
                isPlayingMusic: false
            })
        }else{
            var currentPostId = this.data.currentPostId;
            var posts = postsData.postList;
            wx.playBackgroundAudio({
                dataUrl: posts[currentPostId].music.url,
                title: posts[currentPostId].music.title,
                coverImgUrl: posts[currentPostId].music.coverImg,
                success: function(){
                    that.setData({
                        isPlayingMusic: true
                    })
                },
                complete: function(){
                    wx.onBackgroundAudioPlay(function(event){
                        that.setData({
                            isPlayingMusic: true
                        })
                    })
                    wx.onBackgroundAudioPause(function(event){
                        that.setData({
                            isPlayingMusic: false
                        })
                    })
                }
            })

        }
    }
})