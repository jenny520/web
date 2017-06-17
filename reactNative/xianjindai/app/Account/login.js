/**
 * Created by zhoumeiyan on 16/12/15.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    AlertIOS,
    Image,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import Button from 'react-native-button';
var CountDownText = require('react-native-sk-countdown').CountDownText;
import NavigationBar from 'react-native-navbar';
import Util from '../Util/util';
import Icon from 'react-native-vector-icons/Ionicons';
import Account from './index'

export default class extends Component{
    constructor(props){
        super(props);

        this.state = {
            phoneNumber: '',
            verifyCode: '',
            countingDone: false,
            countingStart: false,
            getCode: '',
            user: {}
        }
    }
    _sendVerifyCode(){
        let reg =/^1[3|5|8][0-9]{9}$/;
        let phoneNumber = this.state.phoneNumber;
        if(!phoneNumber || !reg.test(phoneNumber)){
            return AlertIOS.alert('手机号码格式不正确')
        }
        let body = {
            mobile:phoneNumber,
            appname: '随时花'
        };
        Util.get('http://api.jinrongsudi.com/index.php/Api/User/send_sms',body)
            .then((data) => {
                if(data){
                    this.setState({
                        getCode: data.smscode
                    })
                }
            })
    }

    _submit(){
        let phoneNumber = this.state.phoneNumber;
        let verifyCode = this.state.verifyCode;
        if(!phoneNumber || !verifyCode){
            return AlertIOS.alert('手机号码或者验证码不能为空')
        }else if(verifyCode != this.state.getCode){
            return AlertIOS.alert('验证码输入不正确')
        }
        Util.get('http://api.jinrongsudi.com/index.php/Api/User/user_login',{mobile: phoneNumber})
            .then((data) => {
                if(data && data.flag){
                    let user = JSON.stringify(data.list);
                    AsyncStorage.setItem('user',user)
                        .then((data) => {
                            this.setState({
                                user: user
                            },function(){
                                DeviceEventEmitter.emit('changeUser')
                                this.props.navigator.pop()
                            })
                        })
                }
            })
    }
    _countingDone(){
        this.setState({
            countingDone: true
        })
    }
    _startCounting(){
        this.setState({
            countingStart: true
        },function(){
            this._sendVerifyCode()
        })
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.signupBox}>
                    <View style={styles.phoneBox}>
                        <Icon name="ios-person-outline" size={24} style={styles.icon} color="#aaa"/>
                        <TextInput
                            placeholder="请输入手机号"
                            autoCaptialize={'none'}
                            autoCorrect={false}
                            keyboardType={'number-pad'}
                            style={styles.inputField}
                            onChangeText={(text) => {
                                this.setState({
                                    phoneNumber: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.verifyCodeBox}>
                        <Icon name="ios-filing-outline" size={24} style={styles.icon} color="#aaa"/>
                        <TextInput
                            placeholder="输入验证码"
                            autoCaptialize={'none'}
                            autoCorrect={false}
                            keyboardType={'number-pad'}
                            style={styles.inputField}
                            onChangeText={(text) => {
                                this.setState({
                                    verifyCode: text
                                })
                            }}
                        />
                        {
                            this.state.countingStart ?
                                <View>
                                    {
                                        this.state.countingDone ?
                                            <Button
                                                containerStyle={styles.countBtn}
                                                style={{color: '#fff',fontSize: 15}}
                                                onPress={this._sendVerifyCode.bind(this)}
                                            >
                                                重新获取验证码
                                            </Button>:
                                            <View style={styles.countBtn}>
                                                <CountDownText
                                                    style={{color: '#fff',fontSize: 15}}
                                                    countType='seconds' // 计时类型：seconds / date
                                                    auto={false} // 自动开始
                                                    afterEnd={this._countingDone.bind(this)} // 结束回调
                                                    timeLeft={60} // 正向计时 时间起点为0秒
                                                    step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                                    startText='获取验证码' // 开始的文本
                                                    endText='获取验证码' // 结束的文本
                                                    intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                                                />
                                            </View>
                                    }
                                </View>:
                                <Button
                                    containerStyle={styles.countBtn}
                                    style={{color: '#fff',fontSize: 15}}
                                    onPress={this._startCounting.bind(this)}
                                >获取验证码</Button>
                        }
                    </View>
                    <Button
                        containerStyle={styles.btn}
                        style={{fontSize: 16,color: '#fff'}}
                        onPress={this._submit.bind(this)}
                    >登录</Button>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    leftArrow:{
        position: 'absolute',
        left: 10,
        top: 12
    },
    signupBox: {
        marginTop: 10,
    },
    title: {
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
        fontSize: 20
    },
    phoneBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingLeft: 10
    },
    inputField: {
        flex: 1,
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 15,
    },
    btn: {
        width: Util.size.width - 20,
        marginVertical: 15,
        padding:8,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgb(84,136,220)',
        borderRadius: 5,
        backgroundColor: 'rgb(84,136,220)'
    },
    verifyCodeBox: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    countBtn: {
        width: 130,
        height: 30,
        marginLeft: 8,
        borderWidth: 1,
        backgroundColor: 'rgb(84,136,220)',
        borderColor: 'rgb(84,136,220)',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        width: 80,
        height: 30
    }
});