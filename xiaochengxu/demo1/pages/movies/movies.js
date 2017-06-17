var app = getApp();
var util = require('../../utils/util.js')
Page({
	data: {
		inTheaters:{},
		comingSoon:{},
		top250:{},
		containerShow: true,
		searchPannelShow: false,
		searchResult: {}
	},
	onLoad: function(){
		var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters?count=3&start=0',
			comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon?count=3&start=0',
			top250url = app.globalData.doubanBase + '/v2/movie/top250?count=3&start=0';
			this.getMovieListData(inTheatersUrl,'正在热映',"inTheaters");
			this.getMovieListData(comingSoonUrl,"即将上映", "comingSoon");
			this.getMovieListData(top250url,"Top250", "top250");
	},
	onBindFocus: function(){
		this.setData({
			containerShow: false,
			searchPannelShow: true
		})
	},
	onBindConfirm: function(event){
		var text = event.detail.value;
		var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
		this.getMovieListData(searchUrl,'',"searchResult")
	},
	onCancleImgTap: function(){
		this.setData({
			containerShow: true,
			searchPannelShow: false
		})
	},
	onMovieTap: function(event){
		var movieId = event.currentTarget.dataset.movieid;
		wx.navigateTo({
			url: 'movie-detail/movie-detail?id='+movieId
		})
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
			if(titleLength >= 6){
				title = title.substring(0,6) + '...';
			}
			var temp = {
				stars: util.convertToStarsArray(moviesDouban.subjects[subject].rating.stars),
				average: moviesDouban.subjects[subject].rating.average,
				title: title,
				coverageUrl: moviesDouban.subjects[subject].images.large,
				movieId: moviesDouban.subjects[subject].id
			}
			movies.push(temp)
		}
		var readyData = {
		  	title: columnTitle,
		  	movies:movies
		}
		var data = {};
		data[settedKey] = readyData;
		this.setData(data)
	},
	onMoreTap: function(event){
		var category = event.currentTarget.dataset.category;
		wx.navigateTo({
			url: 'more-movie/more-movie?category='+category
		})
	}
})