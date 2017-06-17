/**
 * Created by zhoumeiyan on 16/12/13.
 */
import React,{Component} from 'react';
import {PixelRatio,Dimensions,AlertIOS} from 'react-native';
import queryString from 'query-string';
import Config from './config'

const Util = {
    ratio: PixelRatio.get(),
    pixel: 1 / PixelRatio.get(),
    size: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    get(url,params){
        if(params){
            url += '?' + queryString.stringify(params);
        }
        return (
            fetch(url)
                .then((response) => response.json())
                .catch((err) => {
                    console.log(err)
                })
        )
    },
    post(url, data){
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(url, fetchOptions)
            .then((response) => response.json())
            .catch((error) => {
                console.error(error);
                //if (resData.error !== true) {} else {AlertIOS.alert('服务器无响应', '请稍后再试');}
                //consistant with server error msg
                //callback({
                //    error: true
                //});
            });
    },
    upload(body,url,callback){
        let xhr = new XMLHttpRequest();
        xhr.open('POST',url)
        xhr.onload = () => {
            if(xhr.status !== 200){
                AlertIOS.alert('请求失败')
                console.log(xhr.responseText);
                return ;
            }
            if(!xhr.responseText){
                console.log(xhr)
                AlertIOS.alert('请求失败')
                return ;
            }
            let response;
            try {
                response = JSON.parse(xhr.responseText);
            }catch(e){
                console.log(e);
                console.log('parse fail')
            }
            if(response){
                callback(response)
            }
        }
        xhr.send(body)
    },
    thumb(key){
        if(key.indexOf('http') > -1){
            return key
        }
        return  Config.IndexProductURL + key
    },
    formatTime(type,time){
        time = time * 1000;
        let year = new Date(time).getFullYear();
        let month = new Date(time).getMonth() + 1;
        let day = new Date(time).getDate();
        let hours = new Date(time).getHours();
        let minutes = new Date(time).getMinutes();
        let seconds = new Date(time).getSeconds();
        let mmdd;
        month = parseInt(month) < 10 ? '0'+month : month;
        day = parseInt(day) < 10 ? '0'+day : day;
        hours = parseInt(hours) < 10 ? '0'+hours : hours;
        minutes = parseInt(minutes) < 10 ? '0'+minutes : minutes;
        switch(type){
            case 'yy-mm-dd hh:mm:ss':
                mmdd = `${year}-${month} ${hours}:${minutes}:${seconds}`;
                break;
            case 'yy-mm-dd hh:mm':
                mmdd = `${year}-${month} ${hours}:${minutes}`;
                break;
            case 'mm月dd日':
                mmdd = `${month}月${day}日`;
                break;
            case 'mm-dd hh:mm':
                mmdd = `${month}-${day} ${hours}:${minutes}`;
                break;
            case 'yy-mm-dd hh:mm:ss':
                mmdd = `${year}-${month} ${hours}:${minutes}:${seconds}`;
                break;
        }
        return mmdd;
    }
}
export default Util;