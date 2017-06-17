/**
 * Created by zhoumeiyan on 16/10/29.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    AlertIOS
} from 'react-native';
import Button from 'react-native-button';
import Request from '../common/request';
import Config from '../common/config';
var CountDownText = require('react-native-sk-countdown').CountDownText;
export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            codeSend: false,
            phoneNumber: '',
            verifyCode: '',
            showVerifyCode: false,
            countingDone: false
        }
    }
    _sendVerifyCode(){
        let reg =/^1[3|5|8][0-9]{9}$/;
        let phoneNumber = this.state.phoneNumber;
        if(!phoneNumber || !reg.test(phoneNumber)){
            return AlertIOS.alert('手机号码格式不正确')
        }
        let body = {
            phoneNumber
        };
        let signupUrl = Config.api.base + Config.api.signup;
        Request.post(signupUrl,body)
            .then((data) => {
                if(data && data.success){
                    this.setState({
                        showVerifyCode: true,
                        codeSend: true
                    })
                }else{
                    AlertIOS.alert('获取验证码失败')
                }
            })
            .catch((error) => {
                AlertIOS.alert('获取验证码失败,请检查手机号是否输入正确')
            })

    }
    _submit(){
        let phoneNumber = this.state.phoneNumber;
        let verifyCode = this.state.verifyCode;
        if(!phoneNumber || !verifyCode){
            return AlertIOS.alert('手机号码或者验证码不能为空')
        }
        let body = {
            phoneNumber,
            verifyCode
        };
        let signupUrl = Config.api.base + Config.api.verify;
        Request.post(signupUrl,body)
            .then((data) => {
                if(data && data.success){
                    this.props.afterLogin(data.data)
                }else{
                    AlertIOS.alert('登录失败')
                }
            })
            .catch((error) => {
                AlertIOS.alert('登录失败')
            })

    }
    _countingDone(){
        this.setState({
            countingDone: true
        })
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.signupBox}>
                    <Text style={styles.title}>快速登录</Text>
                    <TextInput
                        placeholder="输入手机号"
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
                    {
                        this.state.showVerifyCode ?
                            <View style={styles.verifyCodeBox}>
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
                                    this.state.countingDone ?
                                        <Button
                                            style={styles.countBtn}
                                            onPress={this._sendVerifyCode.bind(this)}
                                        >
                                            重新获取验证码
                                        </Button>:
                                        <CountDownText
                                            style={styles.countBtn}
                                            countType='seconds' // 计时类型：seconds / date
                                            auto={true} // 自动开始
                                            afterEnd={this._countingDone.bind(this)} // 结束回调
                                            timeLeft={60} // 正向计时 时间起点为0秒
                                            step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                            startText='获取验证码' // 开始的文本
                                            endText='获取验证码' // 结束的文本
                                            intervalText={(sec) => sec + '秒重新获取'} // 定时的文本回调
                                        />
                                }
                            </View>:null
                    }
                    {
                        this.state.codeSend ?
                            <Button
                                style={styles.btn}
                                onPress={this._submit.bind(this)}
                            >登录</Button> :
                            <Button style={styles.btn}
                                    onPress={this._sendVerifyCode.bind(this)}
                            >发送验证码</Button>
                    }
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    signupBox: {
        marginTop: 30,
    },
    title: {
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
        fontSize: 20
    },
    inputField: {
        flex: 1,
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 15,
        backgroundColor: '#fff',
        borderRadius: 4
    },
    btn: {
        marginTop: 10,
        padding: 10,
        color: '#ee735c',
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    verifyCodeBox: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    countBtn: {
        width: 130,
        height: 40,
        padding: 10,
        marginLeft: 8,
        color: '#fff',
        borderWidth: 1,
        backgroundColor: '#ee735c',
        borderColor: '#ee735c',
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 15
    }
});