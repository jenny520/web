// pages/movies/movie-detail/movie-detail.js
var util = require('../../../utils/util.js')
var app = getApp();
Page({
    data:{
        movie: {}
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        var movieId = options.id
        this.getMovieDetail(movieId)
    },
    getMovieDetail: function(movieId){
        var movieUrl = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
        var that = this;
        wx.request({
            url: movieUrl,
            header: {
                'Content-Type': 'application'
            },
            method: 'GET',
            success: function(res){
                var data = res.data;
                var director = {
                    avatar: '',
                    name: '',
                    id: ''
                }
                if(data.directors[0] != null){
                    if(data.directors[0].avatars != null){
                        director.avatar = data.directors[0].avatars.large
                    }
                    director.name = data.directors[0].name;
                    director.id = data.directors[0].id;
                }
                var movie = {
                    movieImg: data.images ? data.images.large : '',
                    country: data.countries[0],
                    title: data.title,
                    originalTitle: data.original_title,
                    wishCount: data.wish_count,
                    commentCount: data.comments_count,
                    year:data.year,
                    generes: data.genres.join("、"),
                    stars: util.convertToStarsArray(data.rating.stars),
                    score: data.rating.average,
                    director:director,
                    casts:util.convertToCastString(data.casts),
                    castsInfo: util.convertToCastInfos(data.casts),
                    summary:data.summary.substring(0,100)+"..."
                }
                that.setData({
                    movie: movie
                })
            }
        })
    },
    onReady:function(){
        wx.setNavigationBarTitle({
            title: "电影详情页"
        })
    },
    onShow:function(){
    // 页面显示
    },
    onHide:function(){
    // 页面隐藏
    },
    onUnload:function(){
    // 页面关闭
    },
    viewMoviePostImg: function(event){
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: [src] // 需要预览的图片http链接列表
        })
    }
})