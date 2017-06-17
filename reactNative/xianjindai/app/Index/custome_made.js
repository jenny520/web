/**
 * Created by zhoumeiyan on 16/12/16.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ListView,
    Image,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Modal,
    TouchableOpacity,
    AlertIOS,
    DeviceEventEmitter,
    AsyncStorage
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import icons from '../assets/Icon';
import Util from '../Util/util';
import Button from 'react-native-button';
import City from '../common/city';
import List from '../Index/list';
let Params = {
    profession: [
        '上班族','个体户','企业主','自由职业','学生'
    ],
    card: [
        '否','是'
    ],
    mobileTime: [
        '1-5个月','6个月以上'
    ],
    money: [
        '500元','1000元','2000元','3000元','4000元','5000元','6000元','7000元',
        '8000元','9000元','10000元', '15000元','20000元','25000元','30000元','40000元','50000元'
    ],
    dateTime: [
        '1个月内','3个月','6个月','12个月','18个月','24个月','30个月','36个月','48个月','60个月'
    ]
}
export default class extends Component{
    constructor(props){
        super(props)
        let user = this.props.user;
        this.state = {
            name: user.name || '',
            idcard: user.idcard || '',
            city: this.props.user.incity,
            profession: user.profession || '上班族',
            card: user.is_credit_card || '是',
            mobileTime: user.mobileTime || '6个月以上',
            selected: '',
            pickData: [],
            modalVisible: false,
            money: '5000元',
            dateTime: '12个月',
            mobile: user.mobile || '请输入手机号码',
            verifyCode: '',
            getCode: ''
        }
    }
    _sendVerifyCode(){
        let reg =/^1[3|5|8][0-9]{9}$/;
        let phoneNumber = this.state.mobile;
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
        let user = this.props.user,
            name = this.state.name,
            idcard = this.state.idcard,
            incity = this.state.city,
            mobile = this.state.mobile,
            is_credit_card = this.state.card,
            profession = this.state.profession,
            t_apply_period = this.state.dateTime,
            t_apply_amount = this.state.money,
            verifyCode = this.state.verifyCode;
        let reg =/^1[3|5|8][0-9]{9}$/;
        let sfreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!name){
            return AlertIOS.alert('请输入真实姓名')
        }else if(!idcard || !sfreg.test(idcard)){
            return AlertIOS.alert('请输入正确的身份证号码')
        }else if(!incity){
            return AlertIOS.alert('请选择所在城市')
        }
        if(!user){
            if(!mobile || !verifyCode){
                return AlertIOS.alert('手机号码或者验证码不能为空')
            }else if(verifyCode != this.state.getCode){
                return AlertIOS.alert('验证码输入不正确')
            }
        }
        let body = new FormData();
        body.append('mobile',mobile);
        body.append('name',name);
        body.append('idcard',idcard);
        body.append('profession',profession);
        body.append('incity',incity);
        body.append('is_credit_card',is_credit_card);
        body.append('t_apply_period',t_apply_period);
        body.append('t_apply_amount',t_apply_amount);
        Util.upload(body,'http://api.jinrongsudi.com/index.php/Api/Product/add_product_recommend_person_information',(response) => {
            if(response && response.flag){
                let user = JSON.stringify(response.list);
                AsyncStorage.setItem('user',user)
                    .then((data) => {
                        this.props.navigator.push({
                            component: List,
                            title: '为我推荐',
                            //leftButtonTitle: '返回,关闭',
                            leftButtonIcon: {uri:icons.back,scale: 5},
                            onLeftButtonPress: () => {
                                this.props.navigator.pop()
                            },
                            passProps: {
                                url: 'http://api.jinrongsudi.com/index.php/Api/Product/get_product_recommend',
                                user: JSON.parse(user),
                                up: this.props.up
                            }
                        })
                        DeviceEventEmitter.emit('changeUser')
                    })
            }
        })
    }
    _selectCity(){
        this.props.navigator.push({
            component: City,
            title:"城市列表",
            passProps:({
                changeCity:(city)=>{this.setState({
                    city:city
                })}
            })
        });
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
        this._setModalVisible(false)
        this.setState(
            select
        )
    }
    render(){
        let money = this.state.money.split('元')[0]
        return (
            <View style={styles.container}>
                <View style={styles.customeModule}>
                    <View style={styles.customePrice}>
                        <Text style={styles.title}>请填写您的贷款需求</Text>
                        <View style={styles.product}>
                            <View style={styles.productType}>
                                <View style={styles.Img}>
                                    <Image source={{uri: icons.money}} style={styles.productImg}/>
                                </View>
                                <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('money',true)}}>
                                    <View style={styles.money}>
                                        <Text style={styles.moneyNum}>{money}</Text>
                                        <Text style={styles.moneyIcon}>元</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.productDate}>
                                <View style={styles.date}>
                                    <Text style={styles.dateText}>期限</Text>
                                    <Icon style={styles.dateIcon} name="ios-arrow-down" size={14}/>
                                </View>
                                <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('dateTime',true)}}>
                                    <View style={styles.mouth}>
                                        <Text style={styles.mouthNum}>{this.state.dateTime}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                    <View style={styles.customeForm}>
                        <View style={styles.customeName}>
                            <View style={styles.customeText}>
                                <Image source={{uri: icons.person}} style={styles.icon}/>
                                <Text style={styles.text}>真实姓名</Text>
                            </View>
                            <TextInput
                                placeholder="请输入真实姓名"
                                style={styles.inputField}
                                placeholderTextColor="#555"
                                defaultValue={this.state.name}
                                onChangeText={(text) => {
                                    this.setState({
                                        name: text
                                    })
                                }}
                            />
                        </View>
                        <View style={styles.customeName}>
                            <View style={styles.customeText}>
                                <Image source={{uri: icons.card}} style={[styles.icon,{width: 24,height:18}]}/>
                                <Text style={styles.text}>身份证号</Text>
                            </View>
                            <TextInput
                                placeholder="请输入身份证号"
                                placeholderTextColor="#555"
                                style={styles.inputField}
                                defaultValue={this.state.idcard}
                                onChangeText={(text) => {
                                        this.setState({
                                            idcard: text
                                        })
                                    }}
                            />
                        </View>
                        <View style={styles.customeName}>
                            <View style={styles.customeText}>
                                <Image source={{uri: icons.user}} style={styles.icon}/>
                                <Text style={styles.text}>职业身份</Text>
                            </View>
                            <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('profession',true)}}>
                                <View style={styles.select}>
                                    <Text>{this.state.profession}</Text>
                                    <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.customeName}>
                            <View style={styles.customeText}>
                                <Image source={{uri: icons.city}} style={styles.icon}/>
                                <Text style={styles.text}>所在城市</Text>
                            </View>
                            <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this._selectCity.bind(this)}>
                                <View style={styles.select}>
                                    <Text>
                                        {
                                            this.state.city ?
                                                this.state.city: '请选择'
                                        }
                                    </Text>
                                    <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.customeName}>
                            <View style={styles.customeText}>
                                <Image source={{uri: icons.xinyong}} style={styles.icon}/>
                                <Text style={styles.text}>是否有信用卡</Text>
                            </View>
                            <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('card',true)}}>
                                <View style={styles.select}>
                                    <Text>{this.state.card}</Text>
                                    <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.customeName}>
                            <View style={styles.customeText}>
                                <Image source={{uri: icons.time}} style={styles.icon}/>
                                <Text style={styles.text}>手机号使用时间</Text>
                            </View>
                            <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('mobileTime',true)}}>
                                <View style={styles.select}>
                                    <Text style={styles.selectText}>{this.state.mobileTime}</Text>
                                    <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    {
                        this.props.user?
                            null:
                            <View>
                                <View style={styles.phoneBox}>
                                    <Icon name="ios-person-outline" size={24} style={styles.icon} color="#aaa"/>
                                    <TextInput
                                        placeholder="请输入手机号"
                                        autoCaptialize={'none'}
                                        autoCorrect={false}
                                        keyboardType={'number-pad'}
                                        style={styles.LogininputField}
                                        onChangeText={(text) => {
                                            this.setState({
                                                mobile: text
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
                                        style={styles.LogininputField}
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
                            </View>
                    }
                    <Button
                        containerStyle={styles.btn}
                        style={{fontSize: 16,color: '#fff'}}
                        onPress={this._submit.bind(this)}
                    >去贷款</Button>
                </View>
                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                    transparent={true}
                    onRequestClose={() => {this._setModalVisible(false)}}>
                    <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" onPress={() => {this._setModalVisible(false)}} style={styles.overlay}>
                        <View></View>
                    </TouchableHighlight>
                    <ScrollView
                        enableEmptySections={true}
                        automaticallyAdjustContentInsets={false}
                        showsVerticalScrollIndicator={false}
                        style={styles.pickBox}
                    >
                        <View>
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
                    </ScrollView>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(237,237,237)'
    },
    leftArrow: {
        position: 'absolute',
        left: 10,
        top: 12
    },
    customePrice: {
        padding: 10,
        backgroundColor: '#fff'
    },
    title: {
        color: '#555',
        marginBottom: 10
    },
    product: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    productType: {
        flexDirection: 'row',
        height: 50
    },
    Img:{
        height: 50,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d81e06'
    },
    productImg: {
        width: 25,
        height: 25
    },
    money: {
        flexDirection: 'row',
        height: 50,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 120
    },
    moneyNum: {
        color: '#d81e06',
        fontSize: 16
    },
    moneyIcon: {
        position: 'absolute',
        right: 5,
        top: 17
    },
    productDate: {
        height: 50,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 10
    },
    date: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    dateText: {
        marginRight: 5
    },
    mouthNum: {
        color: '#d81e06'
    },
    customeForm: {
        marginTop: 5,
        backgroundColor: '#fff'
    },
    customeName: {
        width: Util.size.width,
        height: 40,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    customeText: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputField: {
        height: 40,
        width: Util.size.width * 0.6,
        fontSize: 14,
        color: '#555',
        textAlign: 'right'
    },
    select: {
        width: Util.size.width * 0.6,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    arrow: {
        marginTop: 5,
        marginLeft: 5,
        color: '#555'
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 5
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
        zIndex: 1,
        maxHeight: 160,
    },
    pickItem: {
        height: 40,
        width: Util.size.width,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
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
    LogininputField: {
        flex: 1,
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 15,
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
    }
})