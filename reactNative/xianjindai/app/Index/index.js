/**
 * Created by zhoumeiyan on 16/12/13.
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
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import icons from '../assets/Icon';
import Swiper from 'react-native-swiper';
import Util from '../Util/util';
import Detail from '../common/detail';
import List from './list';
import Custome from './custome_made';
import News from '../Account/myNews';
import Login from '../Account/login';
import CardHandle from './card_handle';
import Report from './report';
import DkPlay from './dkPlay';
import TabItem from '../common/item';
const IconColors = [
    'rgb(216,74,79)',
    'rgb(86,187,127)',
    'rgb(244,159,66)',
    'rgb(84,136,220)',
    'rgb(163,134,231)',
    'rgb(62,178,251)',
    'rgb(89,205,198)',
    'rgb(237,108,83)'
];
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            productItem: [],
            loading: true,
            user: this.props.user || ''
        }
    }
    componentDidMount(){
        Util.get('http://api.jinrongsudi.com/index.php/Api/Product/product_index_list',
            {
                page: 1,
                ios:1,
                v1:1
            })
            .then((data) => {
                if(data){
                    this.setState({
                        productItem: data.list,
                        loading: false
                    })
                }
            })
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
                let user = '';
                if(data){
                    user = JSON.parse(data);
                }
                if(user){
                    this.setState({
                        user: user
                    })
                }else{
                    this.setState({
                        user: user
                    })
                }
            })
    }
    _loadPage(data){
        this.props.navigator.push({
            component: Detail,
            navigationBarHidden: true,
            passProps: {
                data,
                user: this.state.user,
                up: this.state.up
            }
        })
    }
    _push(title,ptype){
        this.props.navigator.push({
            component: List,
            title: title,
            passProps: {
                user: this.state.user,
                ptype,
                up: this.state.up
            }
        })
    }
    _customePush(data){
        this.props.navigator.push({
            component: Custome,
            title: data,
            passProps: {
                data,
                user: this.state.user,
                up: this.state.up
            }
        })
    }
    _pushHandler(){
        let user = this.state.user;
        this.props.navigator.push({
            component: CardHandle,
            title: '信用卡申请',
            passProps: {
                user,
                up: this.state.up
            }
        })
    }
    _newsHandle(){
        let component = News;
        let title = '我的消息'
        if(!this.state.user){
            component = Login;
            title = '登录'
        }
        this.props.navigator.push({
            component,
            title
        });
    }
    _newsPush(){
        this._newsHandle()
    }
    _pushReport(){
        let setting = this.props.setting;
        this.props.navigator.push({
            component: Report,
            title: '征信报告'
            //navigationBarHidden: true,
        })
    }
    _pushTest(){
        this.props.navigator.push({
            component: DkPlay,
            title: '我能贷多少'
        })
    }
    render(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={{ title: '借钱吧', tintColor: '#333'}}
                    tintColor = "#fff"
                />
                <TouchableHighlight style={styles.paixuIcon} underlayColor="rgba(0,0,0,0)" onPress={this._newsPush.bind(this)}>
                    <View>
                        <Image source={{uri: icons.comment}} style={styles.searchIcon}/>
                    </View>
                </TouchableHighlight>
                <ScrollView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 48}}
                >
                    <View>
                        <Swiper style={styles.wrapper} showsPagination={true} height={Util.size.width * 138 / 409}
                                dot={<View style={{backgroundColor: 'rgb(245,245,245)', width: 8, height: 8, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
                                activeDot={<View style={{backgroundColor: 'rgb(78, 187, 200)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7}} />}
                                paginationStyle={{
                                bottom: 10
                            }}
                                autoplay={true}
                        >
                            <View style={styles.slide}>
                                <Image source={require('../assets/images/banner.png')} style={styles.bannerImg}/>
                            </View>
                            <View style={styles.slide}>
                                <Image source={require('../assets/images/banner.png')} style={styles.bannerImg}/>
                            </View>
                        </Swiper>
                    </View>
                    <View style={styles.navContainer}>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={styles.navItem} onPress={() => {this._push('热门极速贷',1)}}>
                            <View style={styles.navItem}>
                                <View style={[styles.navIcon,{backgroundColor:IconColors[0]}]}>
                                    <Image source={{uri: icons.jisu}} style={styles.remen}/>
                                </View>
                                <Text style={styles.navText}>热门极速贷</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={styles.navItem} onPress={() => {this._push('信用卡贷款',14)}}>
                            <View style={styles.navItem}>
                                <View style={[styles.navIcon,{backgroundColor:IconColors[1]}]}>
                                    <Image source={{uri: icons.xindai}} style={styles.remen}/>
                                </View>
                                <Text style={styles.navText}>信用卡贷款</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={styles.navItem} onPress={() => {this._push('大学生贷款',7)}}>
                            <View style={styles.navItem}>
                                <View style={[styles.navIcon,{backgroundColor:IconColors[2]}]}>
                                    <Image source={{uri: icons.student}} style={[styles.remen,{width: 26,height: 26}]}/>
                                </View>
                                <Text style={styles.navText}>大学生贷款</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={styles.navItem} onPress={() => {this._push('个体户贷款',11)}}>
                            <View style={styles.navItem}>
                                <View style={[styles.navIcon,{backgroundColor:IconColors[3]}]}>
                                    <Image source={{uri: icons.userdai}} style={[styles.remen,{width: 22,height: 22}]}/>
                                </View>
                                <Text style={styles.navText}>个体户贷款</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={styles.navItem} onPress={() => {this._pushHandler()}}>
                            <View style={styles.navItem}>
                                <View style={[styles.navIcon,{backgroundColor:IconColors[4]}]}>
                                    <Image source={{uri: icons.bxinka}} style={styles.remen}/>
                                </View>
                                <Text style={styles.navText}>信用卡办理</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={styles.navItem} onPress={() => {this._pushTest()}}>
                            <View style={styles.navItem}>
                                <View style={[styles.navIcon,{backgroundColor:IconColors[5]}]}>
                                    <Image source={{uri: icons.yiwen}} style={styles.remen}/>
                                </View>
                                <Text style={styles.navText}>我能贷多少</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={styles.navItem} onPress={() => {this._pushReport()}}>
                            <View style={styles.navItem}>
                                <View style={[styles.navIcon,{backgroundColor:IconColors[6]}]}>
                                    <Image source={{uri: icons.zhengxin}} style={[styles.remen,{width: 24,height: 24}]}/>
                                </View>
                                <Text style={styles.navText}>征信报告</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={styles.navItem} onPress={() => {this._customePush('为我推荐')}}>
                            <View style={styles.navItem}>
                                <View style={[styles.navIcon,{backgroundColor:IconColors[7]}]}>
                                    <Image source={{uri: icons.tuijian}} style={styles.remen}/>
                                </View>
                                <Text style={styles.navText}>为我推荐</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.dkContainer}>
                        <View style={styles.dkTitle}>
                            <Image source={{uri:icons.hg}} style={styles.titleIcon}/>
                            <Text style={styles.title}>热门极速贷款</Text>
                        </View>
                        {
                            this.state.loading ?
                                <ActivityIndicator
                                    size="small"
                                    color="#6435c9"
                                    style={styles.loadingMore}
                                />:
                                this.state.productItem.map((item) => {
                                    return (
                                        <TabItem
                                            item={item}
                                            onSelect={(item) => {this._loadPage(item)}}
                                            key={item.pid}
                                        />
                                    )
                                })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(237,237,237)'
    },
    paixuIcon: {
        position: 'absolute',
        right: 20,
        top: 32
    },
    searchIcon: {
        width: 20,
        height: 20
    },
    bannerImg: {
        width: Util.size.width,
        height: Util.size.width * 138 / 409
    },
    navContainer: {
        flexDirection:'row',
        flexWrap:"wrap",
        width: Util.size.width,
        backgroundColor: '#fff',
        marginVertical: 10
    },
    navItem: {
        width: Util.size.width * 0.25,
        //paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 94
    },
    remen: {
        width: 30,
        height: 30
    },
    navIcon: {
        width: 40,
        height: 40,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f50'
    },
    navText: {
        paddingVertical: 10
    },
    dkContainer: {
        backgroundColor: '#fff'
    },
    dkTitle: {
        width: Util.size.width,
        height: 40,
        paddingLeft: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    titleIcon: {
        width:20,
        height:20,
        marginRight: 4
    },
    loadingMore: {
        marginVertical: 10
    }
})