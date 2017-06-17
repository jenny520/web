/**
 * Created by zhoumeiyan on 16/10/22.
 */
'use strict';
const Config = {
    header: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    },
    backup: {
        avatar: 'http://res.cloudinary.com/gougou/image/upload/gougou.png'
    },
    qiniu: {
        upload: 'http://upload.qiniu.com',
        thumb: 'http://ohedd0s4b.bkt.clouddn.com/',
        video: 'http://ohedd0s4b.bkt.clouddn.com/',
        avatar: 'http://ogmarwah3.bkt.clouddn.com/'
    },
    cloudinary:{
        cloud_name: 'dbbkrk44p',
        api_key: '975754163281953',
        api_secret: '_0OW6IdaRTrMrZHZUKQHdIv8KxQ',
        base: 'http://res.cloudinary.com/dbbkrk44p',
        image: 'https://api.cloudinary.com/v1_1/dbbkrk44p/image/upload',
        video: 'https://api.cloudinary.com/v1_1/dbbkrk44p/video/upload',
        audio: 'https://api.cloudinary.com/v1_1/dbbkrk44p/raw/upload'
    },
    api: {
         base: 'http://localhost:12345/',
        //base: 'http://rap.taobao.org/mockjs/8727/',
        creations: 'api/creations',
        up: 'api/up',
        comment: 'api/comments',
        signup: 'api/user/signup',
        verify: 'api/user/verify',
        signature: 'api/signature',
        update: 'api/user/update',
        video: 'api/creations/video',
        audio: 'api/creations/audio'
    }
}

export default Config;
