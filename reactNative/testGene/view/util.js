/**
 * Created by zhoumeiyan on 16/9/29.
 */
import React,{Component} from 'react';
import {
    PixelRatio,Dimensions
} from 'react-native';

const Util = {
    ratio: PixelRatio.get(),
    pixel: 1 / PixelRatio.get(),
    size: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    post(url, data, callback){
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(url, fetchOptions)
            .then((response) => {
                return response.json()
            })
            .then((responseData) => {
                callback(responseData);
            })
            .catch((error) => {
                //if (resData.error !== true) {} else {AlertIOS.alert('服务器无响应', '请稍后再试');}
                //consistant with server error msg
                callback({
                    error: true
                });
            });
    },
    key: 'LFDHSFHSFJKHJFHS-REACT-NATIVE'
}
export default Util;