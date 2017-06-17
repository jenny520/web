/**
 * Created by zhoumeiyan on 17/2/15.
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
    ActivityIndicator,
    Linking,
    TextInput
} from 'react-native';
import Util from '../Util/util';
import icons from '../assets/Icon';
import Icon from 'react-native-vector-icons/Ionicons';
import List from './minList';
import TimeCall from './timeCall';
import CardH5Info from '../common/cardh5Info';
import Button from 'react-native-button';

class NOPass extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <View style={styles.dkApply}>
                <View style={styles.dkStatus}>
                    <Text style={styles.dkStatusText}>本次申请审核失败,请换个产品再试</Text>
                    <View style={styles.dkStatusModule}>
                        <Text style={styles.dkStatusTitle}>未通过</Text>
                    </View>
                </View>
                <View style={styles.applyContent}>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onApply.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>请申请其他极速贷款产品</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.topline}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onZixun.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>客户咨询热线</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onEnter.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>快速进入{this.props.items.cname}</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onHelp.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>帮助中心</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}
class Pass extends Component{
    render(){
        return (
            <View style={styles.dkApply}>
                <View style={styles.dkStatus}>
                    <Text style={styles.dkStatusText}>恭喜您贷款成功,要记得按时还款哦</Text>
                    <View style={styles.dkStatusModule}>
                        <Text style={styles.dkStatusTitle}>贷款</Text>
                        <Text style={styles.dkStatusTitle}>成功</Text>
                    </View>
                </View>
                <View style={styles.applyContent}>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onZixun.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>客服咨询热线</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.topline}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onEnter.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>快速进入{this.props.items.cname}</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onApply.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>申请其他产品,获取更高额度</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onHelp.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>帮助中心</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}
class Passing extends Component{
    render(){
        return (
            <View style={styles.dkApply}>
                <View style={styles.dkStatus}>
                    <Text style={styles.dkStatusText}>请耐心等待,可登录网页查询结果</Text>
                    <View style={styles.dkStatusModule}>
                        <Text style={styles.dkStatusTitle}>审核中</Text>
                    </View>
                </View>
                <View style={styles.applyContent}>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onZixun.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>申请进度电话</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.topline}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onEnter.bind(this)}>
                        <View style={[styles.applyProduct,{borderColor:'#ddd'}]}>
                            <Text style={[styles.applyText,{color: '#999'}]}>已加急</Text>
                            <Icon style={[styles.dkArrow,{color:'#ddd'}]} name="ios-arrow-forward" size={20}/>
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onApply.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>申请其他产品,获取更高额度</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onEnter.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>快速进入{this.props.items.cname}</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.applyItem} onPress={this.props.onHelp.bind(this)}>
                        <View style={styles.applyProduct}>
                            <Text style={styles.applyText}>帮助中心</Text>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                            <View style={styles.line}></View>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            status: this.props.data.a_apply_status
        }
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
            '',
            this.props.data.pcallback,
            [
                {text: '呼叫', onPress: () => this.handleClick(`tel:${this.props.data.pcallback}`)},
                {text: '取消', onPress: () => console.log('cancel Pressed!')}
            ]
        )
    }
    _help(){
        this.props.navigator.push({
            component: CardH5Info,
            navigationBarHidden: true,
            passProps: {
                url: 'http://ask.jinrongsudi.com/index.php/Home/DwTwo/wenti?show=0',
                title: '帮助中心'
            }
        })
    }
    _enter(){
        this.props.navigator.push({
            component: CardH5Info,
            navigationBarHidden: true,
            passProps: {
                url: this.props.data.ph5addres,
                title: `${this.props.data.cname}-${this.props.data.pname}`
            }
        })
    }
    _applyOther(){
        this.props.navigator.push({
            component: List,
            title: '小额极速贷'
        })
    }
    _failed(){
        let data = this.props.data;
        Alert.alert(
            '请确定你的贷款是否未通过审核',
            '根据你的选择改变当前申请状态且无法再次更改',
            [
                {text: '确定', onPress: () => {
                    this.setState({
                        status: '2'
                    })
                    Util.get('http://api.jinrongsudi.com/index.php/Api/Product/update_user_apply_product_atatus',{
                        aid: data.aid,
                        a_apply_status: 2
                    })
                }},
                {text: '取消', onPress: () => console.log('cancel Pressed!')}
            ]
        )
    }
    _success(){
        let data = this.props.data;
        Alert.alert(
            '请确定您是否成功收到贷款',
            '根据你的选择改变当前申请状态且无法再次更改',
            [
                {text: '确定', onPress: () => {
                    this.setState({
                        status: '1'
                    })
                    Util.get('http://api.jinrongsudi.com/index.php/Api/Product/update_user_apply_product_atatus',{
                        aid: data.aid,
                        a_apply_status: 1
                    })
                }},
                {text: '取消', onPress: () => console.log('cancel Pressed!')}
            ]
        )
    }
    render(){
        let component = '';
        let data = this.props.data;
        let status = this.state.status;
        if(status === '0'){
            component = <Passing
                onApply={() => {this._applyOther()}}
                onZixun={() => {this._zixun()}}
                onHelp={() => {this._help()}}
                onEnter={() => {this._enter()}}
                navigator={this.props.navigator}
                items = {this.props.data}
            />
        }else if(status == '1'){
            component = <Pass
                onApply={() => {this._applyOther()}}
                onZixun={() => {this._zixun()}}
                onHelp={() => {this._help()}}
                onEnter={() => {this._enter()}}
                navigator={this.props.navigator}
                items = {this.props.data}
            />
        }else{
            component = <NOPass
                onApply={() => {this._applyOther()}}
                onZixun={() => {this._zixun()}}
                onHelp={() => {this._help()}}
                onEnter={() => {this._enter()}}
                navigator={this.props.navigator}
                items = {this.props.data}
            />
        }
        return (
            <View style={styles.container}>
                <View style={styles.dkModule}>
                    <View style={styles.dkItem}>
                        <Image source={{uri:Util.thumb(data.plogo)}} style={styles.dkImg}/>
                        <View style={styles.dkContent}>
                            <Text style={styles.subTitle}>{data.cname}-{data.pname}</Text>
                            <Text style={styles.dktext}>{Util.formatTime('mm-dd hh:mm',data.a_apply_time)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.hr}></View>
                {component}
                {
                    this.state.status == '0' ?
                        <View style={styles.footerBox}>
                            <Text style={styles.isTitle}>请确仁是否收到贷款,开启还款功能</Text>
                            <View style={styles.statusBtns}>
                                <Button
                                    containerStyle={styles.btn}
                                    style={{fontSize: 14,color: 'rgb(136,136,136)'}}
                                    onPress={this._failed.bind(this)}
                                >未通过审核</Button>
                                <Button
                                    containerStyle={[styles.btn,{backgroundColor:'rgb(237,73,92)'}]}
                                    style={{fontSize: 14,color: '#fff'}}
                                    onPress={this._success.bind(this)}
                                >已收到贷款</Button>
                            </View>
                        </View>:null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    hr: {
        width: Util.size.width,
        height: 8,
        backgroundColor: 'rgb(237,237,237)'
    },
    dkModule: {
        backgroundColor: '#fff'
    },
    dkItem: {
        width: Util.size.width,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 40
    },
    dkImg: {
        width: 30,
        height: 30,
        borderRadius: 10,
        marginHorizontal:10
    },
    dkContent: {
        paddingRight: 20
    },
    dktext: {
        paddingVertical: 3,
        paddingRight: 40,
        color: '#555',
        fontSize: 13
    },
    dkApply:{
        padding: 10,
        paddingTop: 40,
        flexDirection:'column',
        alignItems: 'center'
    },
    dkStatus: {
        width: Util.size.width * 0.9,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgb(84,136,220)'
    },
    dkStatusText: {
        color: '#fff'
    },
    dkStatusModule: {
        position: 'absolute',
        left: -10,
        top: -10,
        width: 60,
        height: 60,
        borderRadius: 60,
        backgroundColor: 'rgb(84,136,220)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff'
    },
    dkStatusTitle: {
        color: '#fff'
    },
    applyContent: {
        alignItems: 'center'
    },
    applyItem: {
        width: Util.size.width * 0.8,
        marginTop: 16,
        alignItems: 'flex-end'
    },
    applyProduct: {
        width: Util.size.width * 0.7,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgb(84,136,220)'
    },
    inputField: {
        width: Util.size.width * 0.7,
        height: 40,
        color: 'rgb(84,136,220)',
        fontSize: 14,
        textAlign: 'center',
        paddingLeft: 5
    },
    applyText: {
        color: 'rgb(84,136,220)'
    },
    dkArrow: {
        position: 'absolute',
        top: 10,
        right: 10,
        color: 'rgb(84,136,220)'
    },
    topline: {
        width: 40,
        height: 28,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#666',
        position: 'absolute',
        left: -40,
        top: -8
    },
    line: {
        width: 40,
        height: 56,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#666',
        position: 'absolute',
        left: -40,
        top: -36
    },
    footerBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingVertical: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        width: Util.size.width,
        height: 150
    },
    statusBtns: {
        marginTop: 10,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btn: {
        width: 100,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(229,229,229)',
        marginHorizontal: 10
    }
})