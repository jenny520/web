/**
 * Created by zhoumeiyan on 16/12/26.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ActionSheetIOS,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Util from '../Util/util';
import CardH5Info from '../common/cardh5Info';

const datas = [
    {
        imgSrc: 'https://www.rong360.com/static/img/credit/bank/16.png',
        text: '中信银行申请进度查询',
        url: 'https://creditcard.ecitic.com/citiccard/wap/cardappquery/app_inq.jsp?main=1&left=1'
    },
    {
        imgSrc: 'https://www.rong360.com/static/img/credit/bank/11.png',
        url: 'https://weixin.spdbccc.com.cn/spdbcccWeChatPage/applyProgressPath.do?path=applyProgress&page=index&noCheck=1',
        text: '浦发银行申请进度查询'
    },
    {
        imgSrc: 'https://www.rong360.com/static/img/credit/bank/3.png',
        url: 'https://xyk.cebbank.com/cebmms/apply/fz/wy-apply-index.htm',
        text: '光大银行申请进度查询'
    },
    {
        imgSrc: 'https://www.rong360.com/static/img/credit/bank/7.png',
        url: 'https://creditcardapp.bankcomm.com/member/apply/status/preinquiry.html?_channel=WC',
        text: '交通银行申请进度查询'
    },
    {
        imgSrc: 'https://www.rong360.com/static/img/credit/bank/10.png',
        url: 'https://wap-ebank.pingan.com/weixin/modules/queryApp/index.html#queryf',
        text: '平安银行申请进度查询'
    },
    {
        imgSrc: 'https://www.rong360.com/static/img/credit/bank/4.png',
        url: 'https://wap.cgbchina.com.cn/queryApply.do?sid=0.7710854143363747',
        text: '广发银行申请进度查询'
    },
    {
        imgSrc: 'https://www.rong360.com/static/img/credit/bank/14.png',
        url: 'https://ccclub.cmbchina.com/mca/MQuery.aspx?WT.mc_id=Z1O00WXA055B412100CC',
        text: '招商银行申请进度查询'
    },
    {
        imgSrc: 'https://www.rong360.com/static/img/credit/bank/13.png',
        url: 'https://3g.cib.com.cn/app/00282.html',
        text: '兴业银行申请进度查询'
    },
    {
        imgSrc: 'http://static.51credit.com/images/logo-gzcb.png',
        url: 'https://onlinepay.cupdata.com/weixin/webApply.do?action=applyProgressInit&bankNum=6413&userId=o',
        text: '广州银行申请进度查询'
    },
    {
        url: 'https://onlinepay.cupdata.com/weixin/apply.do?action=applyProgressInit&bankNum=6403&userId=o6y9OuHuXRLwUIW8VN0UlDwtfUMM',
        imgSrc: 'http://m.51credit.com/images/71.png',
        text: '北京银行申请进度查询'
    }
]
export default class extends Component{
    _push(url,title){
        this.props.navigator.push({
            component: CardH5Info,
            navigationBarHidden: true,
            passProps: {
                url,
                title
            }
        })
    }
    render(){
        return (
            <ScrollView
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                style={styles.container}
                contentContainerStyle={{paddingBottom: 60}}
            >
                <View style={styles.itemModule}>
                    {
                        datas.map((item,index) => {
                            return (
                                <TouchableHighlight underlayColor="#f1f1f1" key={index} onPress={this._push.bind(this,item.url,item.text)}>
                                    <View style={styles.Item}>
                                        <Image source={{uri: item.imgSrc}} style={styles.itemImg}/>
                                        <Text style={styles.name}>{item.text}</Text>
                                        <Icon style={styles.itemIcon} name="ios-arrow-forward" size={20}/>
                                    </View>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(232,232,232)'
    },
    itemModule: {
        marginTop: 10,
        backgroundColor: '#fff',
        width: Util.size.width
    },
    Item: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        height: 60
    },
    itemImg: {
        width: 30,
        height: 30
    },
    name: {
        fontSize: 15,
        marginLeft: 10
    },
    itemIcon: {
        position: 'absolute',
        right: 15,
        top: 20
    }
})