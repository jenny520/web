/**
 * Created by zhoumeiyan on 16/12/7.
 */
import Config from './config'
'use strict';
const Utils = {
    thumb(key){
        console.log(key)
        if(key.indexOf('http') > -1){
            return key
        }
        return Config.qiniu.thumb + key
    },
    avatar(key){
        if(!key){
            return Config.backup.avatar
        }
        if(key.indexOf('http') > -1){
            return key
        }else if(key.indexOf('data:image') > -1){
            return key
        }else if(key.indexOf('avatar/') > -1){
            return Config.cloudinary.base + '/image/upload' + key
        }
        return Config.qiniu.avatar + key
    },
    video(key){
        if(key.indexOf('http') > -1){
            return key
        }else if(key.indexOf('video/') > -1){
            return Config.cloudinary.base + '/video/upload' + key
        }
        return Config.qiniu.video + key
    }
}
export default Utils;