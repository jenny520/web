/**
 * Created by zhoumeiyan on 16/12/30.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    AlertIOS,
    SegmentedControlIOS,
    TouchableHighlight,
    Modal,
    TouchableOpacity,
    ScrollView,
    Image,
    DeviceEventEmitter,
    AsyncStorage
} from 'react-native';

import Button from 'react-native-button';
import Util from '../Util/util';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import H5Info from './h5Info'
let CountDownText = require('react-native-sk-countdown').CountDownText;
let Params = {
    credit: [
        '是','否'
    ],
    profession: [
        '上班族','个体户','企业主','自由职业','学生'
    ]
}
export default class extends Component{
    constructor(props){
        super(props);
        let user = this.props.user;
        this.state = {
            codeSend: false,
            phoneNumber: user.mobile || '',
            verifyCode: '',
            getCode: '',
            countingDone: false,
            name: user.name || '',
            idCard: user.idcard || '',
            modalVisible: false,
            pickData: [],
            selected: '',
            credit: user.is_credit_card || '请选择',
            profession: user.profession || '请选择',
            countingStart: false
        }
    }
    _sendVerifyCode(){
        let reg =/^1[3|5|8][0-9]{9}$/;
        let phoneNumber = this.state.phoneNumber;
        if(!phoneNumber || !reg.test(phoneNumber)){
            return AlertIOS.alert('手机号码格式不正确')
        }
        let body = {
            mobile:phoneNumber
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
        let mobile = this.state.phoneNumber,
            verifyCode = this.state.verifyCode,
            name = this.state.name,
            idcard = this.state.idCard,
            profession = this.state.profession,
            is_credit_card = this.state.credit,
            item = this.props.item,
            sfreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!mobile || !verifyCode){
            return AlertIOS.alert('验证码不能为空')
        }else if(verifyCode != this.state.getCode){
            return AlertIOS.alert('验证码输入不正确')
        }else if(!idcard || !sfreg.test(idcard)){
            return AlertIOS.alert('请输入正确的身份证')
        }else if(!name){
            return AlertIOS.alert('请输入真实姓名')
        }else{
            let body = new FormData();
            body.append('mobile',mobile);
            body.append('name',name);
            body.append('idcard',idcard);
            body.append('profession',profession);
            body.append('is_credit_card',is_credit_card);
            Util.upload(body,'http://api.jinrongsudi.com/index.php/Api/User/user_register',(response) => {
                if(response && response.flag){
                    let user = JSON.stringify(response.list);
                    AsyncStorage.setItem('user',user)
                        .then((data) => {
                            this.props.navigator.replace({
                                component: H5Info,
                                title: `${item.cname}-${item.pname}`,
                                navigationBarHidden: true,
                                passProps: {
                                    url: item.ph5addres,
                                    item,
                                    user
                                }
                            })
                            DeviceEventEmitter.emit('changeUser')
                        })
                }
            })
        }
    }
    _countingDone(){
        this.setState({
            countingDone: true
        })
    }
    _setModalVisible(isVisible){
        this.setState({
            modalVisible: isVisible
        })
    }
    _setMode(data,isVisible){
        this.setState({
            modalVisible: isVisible,
            pickData: Params[data],
            selected: data
        })
    }
    _setSelected(data){
        let select = {};
        select[this.state.selected] = data
        console.log(this.state.selected,data)
        this._setModalVisible(false)
        this.setState(
            select
        )
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
                <View style={styles.titleModule}>
                    <Text style={styles.title}>请填写真实资料,完善您的个人信息</Text>
                </View>
                <View style={styles.Identity}>
                    <Image source={require('../assets/images/register.png')} style={styles.img}/>
                </View>
                <View style={styles.tabBox}>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>手机号</Text>
                        <TextInput
                            placeholder="请输入手机号"
                            autoCaptialize={'none'}
                            autoCorrect={false}
                            keyboardType={'number-pad'}
                            placeholderTextColor="#aaa"
                            style={styles.inputField}
                            onChangeText={(text) => {
                                this.setState({
                                    phoneNumber: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.verifyCodeBox}>
                        <Text style={styles.tabLable}>验证码</Text>
                        <TextInput
                            placeholder="输入手机验证码"
                            autoCaptialize={'none'}
                            autoCorrect={false}
                            keyboardType={'number-pad'}
                            style={styles.inputField}
                            placeholderTextColor="#aaa"
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
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>真实姓名</Text>
                        <TextInput
                            placeholder="请输入姓名"
                            autoCaptialize={'none'}
                            autoCorrect={false}
                            style={styles.inputField}
                            placeholderTextColor="#aaa"
                            onChangeText={(text) => {
                                this.setState({
                                    name: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>身份证</Text>
                        <TextInput
                            placeholder="请输入身份证"
                            autoCaptialize={'none'}
                            autoCorrect={false}
                            keyboardType={'number-pad'}
                            placeholderTextColor="#aaa"
                            style={styles.inputField}
                            onChangeText={(text) => {
                                this.setState({
                                    idCard: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>职业</Text>
                        <TouchableHighlight underlayColor="#f1f1f1" onPress={() => {this._setMode('profession',true)}}>
                            <View style={styles.selectInfo}>
                                <Text style={styles.selectText}>{this.state.profession}</Text>
                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>信用卡情况</Text>
                        <TouchableHighlight underlayColor="#f1f1f1" onPress={() => {this._setMode('credit',true)}}>
                            <View style={styles.selectInfo}>
                                <Text style={styles.selectText}>{this.state.credit}</Text>
                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <Button
                    containerStyle={styles.btn}
                    style={{fontSize: 16,color: '#fff'}}
                    onPress={this._submit.bind(this)}
                >立即申请</Button>
                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                    transparent={true}
                    onRequestClose={() => {this._setModalVisible(false)}}>
                    <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" onPress={() => {this._setModalVisible(false)}} style={styles.overlay}>
                        <View></View>
                    </TouchableHighlight>
                    <View style={styles.pickBox}>
                        {
                            this.state.pickData.map((item) => {
                                return(
                                    <TouchableOpacity key={item} style={styles.pickItem} onPress={() => {this._setSelected(item)}}>
                                        <View>
                                            <Text>{item}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
    Identity: {
        height: 120,
    },
    img: {
        width: Util.size.width,
        height: Util.size.width * 240 / 658
    },
    titleModule: {
        width: Util.size.width,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    identityItem: {
        width: Util.size.width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    idBox: {
        padding: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    idImg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10
    },
    tabBox: {
        width: Util.size.width,
        backgroundColor: '#fff'
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingLeft: 10
    },
    tabLable: {
        width: 100
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    inputField: {
        flex: 1,
        height: 40,
        color: '#666',
        fontSize: 15,
    },
    selectField: {
        width: Util.size.width - 120,
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 15,
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
    selectInfo: {
        width: Util.size.width - 120,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
    },
    arrow: {
        marginLeft: 5
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.6)'
    },
    pickBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        zIndex: 1
    },
    pickItem: {
        height: 40,
        width: Util.size.width,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
})