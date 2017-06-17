var util = {
    formatTime: function(date){
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()

        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    },
    formatNumber: function(n){
        n = n.toString()
        return n[1] ? n : '0' + n
    },
    convertToStarsArray: function(stars){
        var num = stars.toString().substring(0,1);
        var array = [];
        for(var i = 1;i <= 5;i++){
            if(i <= num){
                array.push(1)
            }else{
                array.push(0)
            }
        }
        return array;
    },
    convertToCastString: function(casts){
        var castsjoin = "";
        for(var idx in casts){
            castsjoin += casts[idx].name + ' / ';
        }
        return castsjoin.substring(0,castsjoin.length - 2);
    },
    convertToCastInfos: function(casts){
        var castsArray = []
        for (var idx in casts){
            var cast = {
                img: casts[idx].avatars?casts[idx].avatars.large:"",
                name: casts[idx].name
            }
            castsArray.push(cast);
        }
       return castsArray;
    }
}
module.exports = util;
