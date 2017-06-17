/**
 * Created by zhoumeiyan on 16/12/15.
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
    DeviceEventEmitter,
    ActivityIndicator,
    Linking
} from 'react-native';
import Util from '../Util/util';
import Icon from 'react-native-vector-icons/Ionicons';
import icons from '../assets/Icon';
import NavigationBar from 'react-native-navbar';
import About from './about';
import Faceback from './faceback'
import Button from 'react-native-button';
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: this.props.user || '',
            settingItem: ''
        }
    }
    componentDidMount(){
        Util.get('http://api.jinrongsudi.com/index.php/Api/System/get_system',{
                appid: 1
            })
            .then((data) => {
                console.log(data)
                if(data && data.list){
                    this.setState({
                        settingItem: data.list
                    })
                }
            })
    }
    handleClick(tel){
        Linking.canOpenURL(tel).then(supported => {
            if (supported) {
                Linking.openURL(tel);
            } else {
                console.log('Don\'t know how to open URI: ' + tel);
            }
        });
    }
    _zixun(){
        let setItem = this.state.settingItem;
        Alert.alert(
            `${setItem.app_cn_name}热线服务`,
            `${setItem.app_call}`,
            [
                {text: '呼叫', onPress: () => this.handleClick(`tel:${setItem.app_call}`)},
                {text: '取消', onPress: () => console.log('cancel Pressed!')}
            ]
        )
    }
    _hezuo(){
        let setItem = this.state.settingItem;
        Alert.alert(
            `${setItem.app_cn_name}客服咨询`,
            `${setItem.app_business_cooperation}`,
            [
                {text: '确定', onPress: () => console.log('OK Pressed!')}
            ]
        )
    }
    _share(){
        ActionSheetIOS.showShareActionSheetWithOptions({
                url: "http://gene.city.edu.hk",
                message: "Gene Sequencing Analysis"
            },
            (error) => console.log(error),
            (success, method) => {
            }
        );
    }
    _onAboutPress() {
        let setItem = this.state.settingItem;
        this.props.navigator.push({
            component: About,
            title: '关于我们',
            passProps: {
                url: setItem.app_about_address
            }
        });
    }
    _onFacePress() {
        this.props.navigator.push({
            component: Faceback,
            title: '意见反馈',
            passProps: {
                user: this.state.user
            }
        })
    }
    _unlogin(){
        this.props.navigator.pop()
        AsyncStorage.removeItem('user')
        this.setState({
            user: ''
        },function(){
            DeviceEventEmitter.emit('changeUser')
        })
    }
    render(){
        let setItem = this.state.settingItem;
        return (
            <View style={styles.container}>
                {
                    setItem ?
                        <View>
                            <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" style={styles.module} onPress={() => this._onAboutPress()}>
                                <View style={styles.moduleItem}>
                                    <Text style={styles.moduleText}>关于我们</Text>
                                    <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20} color="#bbb"/>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" style={styles.module} onPress={() => this._onFacePress()}>
                                <View style={styles.moduleItem}>
                                    <Text style={styles.moduleText}>意见反馈</Text>
                                    <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20} color="#bbb"/>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" style={styles.module} onPress={this._zixun.bind(this)}>
                                <View style={styles.moduleItem}>
                                    <Text style={styles.moduleText}>客服热线</Text>
                                    <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20} color="#bbb"/>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" style={styles.module} onPress={this._hezuo.bind(this)}>
                                <View style={styles.moduleItem}>
                                    <Text style={styles.moduleText}>商务合作</Text>
                                    <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20} color="#bbb"/>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" style={styles.module}>
                                <View style={styles.moduleItem}>
                                    <Text style={styles.moduleText}>给个好评把</Text>
                                    <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20} color="#bbb"/>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" style={styles.module} onPress={this._share.bind(this)}>
                                <View style={styles.moduleItem}>
                                    <Text style={styles.moduleText}>分享给好友</Text>
                                    <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20} color="#bbb"/>
                                </View>
                            </TouchableHighlight>
                            {
                                this.state.user ?
                                    <Button
                                        containerStyle={styles.btn}
                                        style={{fontSize: 16,color: '#fff'}}
                                        onPress={this._unlogin.bind(this)}
                                    >退出登录</Button>:null
                            }
                        </View>:
                        <ActivityIndicator
                            size="small"
                            color="#6435c9"
                            style={styles.loadingMore}
                        />
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(237,237,237)'
    },
    leftArrow:{
        position: 'absolute',
        left: 10,
        top: 12
    },
    module: {
        paddingLeft: 10,
        backgroundColor: '#fff'
    },
    moduleItem: {
        borderBottomWidth: 1,
        paddingRight: 10,
        borderColor: '#ddd',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
    loadingMore: {
        height: Util.size.height,
        justifyContent: 'center',
        alignItems: 'center'
    }
})