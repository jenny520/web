/**
 * Created by zhoumeiyan on 16/12/13.
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
    Alert,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import Util from '../Util/util';
import Icon from 'react-native-vector-icons/Ionicons';
import icons from '../assets/Icon';
import Setting from './setting';
import Login from './login';
import Resource from './resource';
import Submit from './mySubmit';
import Brower from './brower'
import News from './myNews'
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            logined: false,
            user: this.props.user || ''
        }
    }
    componentWillMount(){
        if(this.props.user){
            this.setState({
                logined: true
            })
        }
    }
    componentDidMount(){
        AsyncStorage.multiGet(['user','up'])
            .then((data) => {
                let user,newState = '';
                let userData = data[0][1];
                let upData = data[1][1];
                if(userData){
                    user = JSON.parse(userData);
                }
                if(user){
                    this.setState({
                        user: user
                    })
                }else{
                    this.setState({
                        user: ''
                    })
                }
                if(upData){
                    this.setState({
                        up: upData
                    })
                }
            })
        this.subscription = DeviceEventEmitter.addListener('changeUser',() => {
            this._modifyUser()
        })
    }
    _modifyUser(){
        AsyncStorage.getItem('user')
            .then((data) => {
                let user;
                if(data){
                    user = JSON.parse(data);
                }
                if(user){
                    this.setState({
                        user: user,
                        logined: true
                    })
                }else{
                    this.setState({
                        user: user,
                        logined: false
                    })
                }
            })
    }
    _onLogin(){
        this.props.navigator.push({
            component: Login,
            title: '登录'
        })
    }
    //_onSharePress() {
    //    ActionSheetIOS.showActionSheetWithOptions({
    //            options: BUTTONS,
    //            cancelButtonIndex: CANCEL_INDEX,
    //            destructiveButtonIndex: DESTRUCTIVE_INDEX,
    //            tintColor: 'green'
    //        },
    //        (buttonIndex) => {
    //            this.setState({ clicked: BUTTONS[buttonIndex] });
    //        });
    //}
    _useHandle(name,value,params){
        let component = name;
        let title = value
        if(!this.state.logined){
            component = Login;
            title = '登录'
            this.props.navigator.push({
                component,
                title
            })
        }else{
            if(params){
                this.props.navigator.push({
                    component,
                    title,
                    passProps: {
                        user: params,
                        up: this.state.up
                    }
                })
            }else{
                this.props.navigator.push({
                    component,
                    title
                })
            }
        }
    }
    _onAboutPress() {
        this._useHandle(Setting,'设置',this.state.user)
    }
    _onSubmitPress(){
        this._useHandle(Submit,'我的申请',this.state.user)
    }
    _onReplyPress(){
        this._useHandle(Brower,'我的浏览',this.state.user)
    }
    _onResourcePress(){
        this._useHandle(Resource,'我的资料',this.state.user)
    }
    _onNewsPress(){
        this._useHandle(News,'我的消息',this.state.user)
    }
    render(){
        return (
            <View style={styles.container}>
                <TouchableHighlight style={styles.avatarContainer} underlayColor="rgba(0,0,0,0)" onPress={!this.state.user ? () => this._onLogin() : null}>
                    <Image source={require('../assets/images/peron_bg.png')} style={styles.avatarContainer}>
                        <View style={styles.avatarBox}>
                            <Image source={require('../assets/images/login_avator.png')} style={styles.avatar}/>
                            {
                                this.state.logined ?
                                    <View>
                                        {
                                            this.state.user.name ?
                                                <Text style={styles.avatarTip}>{this.state.user.name}</Text>:null
                                        }
                                        <Text style={styles.avatarTip}>{this.state.user.mobile}</Text>
                                    </View> :
                                    <Text style={styles.avatarTip}>未登录</Text>
                            }
                        </View>
                    </Image>
                </TouchableHighlight>
                <View style={styles.settingContainer}>
                    <View style={styles.setting}>
                        <TouchableHighlight  underlayColor="#f1f1f1" style={styles.userMenuContainer} onPress={() => this._onSubmitPress()}>
                            <View style={styles.userMenu}>
                                <View style={styles.itemNavIcon}>
                                    <Image source={{uri: icons.shenqing}} style={styles.icon}/>
                                </View>
                                <Text>我的申请</Text>
                                <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight  underlayColor="#f1f1f1" style={styles.userMenuContainer} onPress={() => this._onReplyPress()}>
                            <View style={styles.userMenu}>
                                <View style={[styles.itemNavIcon,{backgroundColor: 'rgb(106,205,98)'}]}>
                                    <Image source={{uri: icons.liulanTime}} style={[styles.icon,{width: 14,height: 14}]}/>
                                </View>
                                <Text>浏览记录</Text>
                                <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight  underlayColor="#f1f1f1" style={styles.userMenuContainer} onPress={() => this._onResourcePress()}>
                            <View style={styles.userMenu}>
                                <View style={[styles.itemNavIcon,{backgroundColor: 'rgb(60,170,238)'}]}>
                                    <Image source={{uri: icons.my}} style={styles.icon}/>
                                </View>
                                <Text>我的资料</Text>
                                <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight  underlayColor="#f1f1f1" style={styles.userMenuContainer} onPress={() => this._onNewsPress()}>
                            <View style={styles.userMenu}>
                                <View style={[styles.itemNavIcon,{backgroundColor: 'rgb(242,135,48)'}]}>
                                    <Image source={{uri: icons.news}} style={styles.icon}/>
                                </View>
                                <Text>我的消息</Text>
                                <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20}/>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight  underlayColor="#f1f1f1" style={styles.userMenuContainer} onPress={() => this._onAboutPress()}>
                            <View style={styles.userMenu}>
                                <View style={[styles.itemNavIcon,{backgroundColor: 'rgb(113,113,113)'}]}>
                                    <Image source={{uri: icons.setting}} style={styles.icon}/>
                                </View>
                                <Text>设置</Text>
                                <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'rgb(237,237,237)'
    },
    settingContainer:{
        width: Util.size.width
    },
    setting:{
        marginTop:10,
        paddingBottom:70
    },
    userMenuContainer:{
        height:45,
        borderBottomWidth: Util.pixel,
        borderBottomColor:"#bbb",
        backgroundColor:"#fff",
        flex:1
    },
    userMenu:{
        paddingLeft:50,
        height:45,
        justifyContent:'center',
    },
    itemNavIcon:{
        position:"absolute",
        top:10,
        left:20,
        width:24,
        height: 24,
        //color: "#454545",
        backgroundColor:"rgb(238,81,84)",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: 16,
        height: 17
    },
    itemNavMenu:{
        position:"absolute",
        top:12,
        right:20,
        color: "#bbb",
        backgroundColor:"transparent"
    },
    avatarContainer: {
        width: Util.size.width,
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#666'
    },
    avatarBox: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        marginBottom: 15,
        width: Util.size.width * 0.2,
        height: Util.size.width * 0.2,
        resizeMode: 'cover',
        borderRadius: Util.size.width * 0.1,
        borderColor: '#ccc',
        borderWidth: 1
    },
    avatarTip: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'transparent'
    }
})