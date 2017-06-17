// pages/movies/more-movie/more-movie.js
var app = getApp()
var util = require('../../../utils/util.js');
Page({
    data:{
        navigateTitle: '',
        requestUrl: '',
        isEmpty: true,
        movies: {},
        totalCount: 0
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
        var category = options.category;
        this.setData({navigateTitle: category})
        switch(category){
            case "正在热映":
                var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                this.setData({requestUrl: inTheatersUrl})
                this.getMovieListData(inTheatersUrl,"正在热映","movies");
                break;
            case "即将上映":
                var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                this.setData({requestUrl: comingSoonUrl})
                this.getMovieListData(comingSoonUrl,"即将上映","movies");
                break;
            case "Top250":
                var top250url = app.globalData.doubanBase + "/v2/movie/top250";
                this.setData({requestUrl: top250url})
                this.getMovieListData(top250url,"Top250","movies");
                break;
        }
    },
    onReady:function(){
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle
        })
        wx.showNavigationBarLoading()
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
    onMovieTap: function(event){
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id='+movieId
        })
    },
    //进行下拉刷新
    onPullDownRefresh: function(){
        wx.showNavigationBarLoading()
        this.setData({
            isEmpty: true
        })
        var nextUrl = this.data.requestUrl + '?start=0' + '&count=20';
        this.getMovieListData(nextUrl,"Top250","movies")
    },
    //加载到页面底部
    onReachBottom: function(event){
        wx.showNavigationBarLoading()
        var nextUrl = this.data.requestUrl + '?start='+this.data.totalCount + '&count=20';
        this.getMovieListData(nextUrl,"Top250","movies")
    },
    getMovieListData: function(url,title,settedKey){
        var that = this;
        wx.request({
            url: url,
            header: {
                'Content-Type': 'application'
            },
            method: 'GET',
            success: function(res){
                that.processDoubanData(res.data,title,settedKey)
            },
            fail: function(res){
                that.processDoubanData(res.data,title,settedKey)
            }
        })
    },
    processDoubanData: function(moviesDouban,columnTitle,settedKey){
        var movies = [];
        for(var subject in moviesDouban.subjects){
            var title = moviesDouban.subjects[subject].title;
            var titleLength = title.length;
            if(titleLength>=6){
                title = title.substring(0,6)+ '...';
            }
            var temp = {
                stars: util.convertToStarsArray(moviesDouban.subjects[subject].rating.stars),
                average: moviesDouban.subjects[subject].rating.average,
                title: title,
                coverageUrl: moviesDouban.subjects[subject].images.large,
                movieId:moviesDouban.subjects[subject].id
            };
            movies.push(temp);
        }
        var tempMovies = {};
        // 加载的新页数据需要同已有的数据合并后再一同绑定到页面
        if(!this.data.isEmpty){
            tempMovies = this.data.movies.movies.concat(movies)
            this.setData({
                totalCount: this.data.totalCount + 20
            })
        }else{
            tempMovies = movies;
            this.setData({
                isEmpty: false
            })
            this.setData({
                totalCount: 20
            })
        }
        var readyData = {
            title: columnTitle,
            movies: tempMovies
        };
        var data = {}
        data[settedKey] = readyData;
        this.setData(data)
        //加载完毕后取消正在加载的图标
        wx.hideNavigationBarLoading()
    }
})