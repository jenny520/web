/**
 * Created by zhoumeiyan on 16/10/22.
 */
'use strict';

import queryString from 'query-string';
import _ from 'lodash';
import Mock from 'mockjs';
import Config from './config';

const Request = {
    get(url,params){
        if(params){
            console.log(params)
            url += '?' + queryString.stringify(params);
        }
        return (
            fetch(url)
                .then((response) => response.json())
                .then((responseJson) => Mock.mock(responseJson))
        )
    },
    post(url,body){
        let options = _.extend(Config.header,{
            body: JSON.stringify(body)
        });
        return (
            fetch(url,options)
                .then((response) => response.json())
                .then((responseJson) => Mock.mock(responseJson))
                .catch((error) => {
                    console.error(error);
                })
        )
    }
}
export default Request;

