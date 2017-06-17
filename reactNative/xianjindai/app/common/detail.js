/**
 * Created by zhoumeiyan on 16/12/15.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    ScrollView,
    ActivityIndicator,
    TextInput,
    Modal,
    TouchableOpacity,
    StatusBar
} from 'react-native';

import Util from '../Util/util';
import Icon from 'react-native-vector-icons/Ionicons';
import icons from '../assets/Icon'
import Button from 'react-native-button';
import Info from './perfectInfo'
import H5Info from './h5Info'

let forDate=(min,max,month)=>{
    let days = [];
    let j = 0;
    for(let i = min; i <= max; i+=2){
        days[j]=i + month;
        j++
    }
    days[j] = max + month;
    return days;
}
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            price: 600,
            pickeVisible: false,
            day: '',
            choosed: false,
            user: this.props.user || ''
        }
    }
    componentDidMount(){
        Util.get('http://api.jinrongsudi.com/index.php/Api/Product/add_product_brow_history',{
            pid: this.props.data.pid,
            mobile: this.props.user.mobile
        })
    }
    _submit(){
        console.log(this.state.user)
        let user = this.state.user;
        let mobile = user.mobile;
        let name = user.name;
        let idcard = user.idcard;
        let credit_status = user.credit_status;
        console.log(mobile,name,idcard,credit_status)
        let item = this.props.data;
        if(mobile && name && idcard && credit_status){
            this.props.navigator.push({
                component: H5Info,
                title: `${item.cname}-${item.pname}`,
                navigationBarHidden: true,
                passProps: {
                    url: item.ph5addres,
                    item,
                    user,
                    title: `${item.cname}-${item.pname}`
                }
            })
        }
        this.props.navigator.push({
            component: Info,
            title: '极速贷款',
            passProps: {
                user,
                item
            }
        })
    }
    _pop(){
        this.props.navigator.pop()
    }
    _setPickeModal(isVisible){
        this.setState({
            pickeVisible: isVisible
        })
    }
    _showPick(){
        this._setPickeModal(true)
    }
    _pickDay(day){
        this.setState({
            day,
            choosed: true
        },function(){
            this._setPickeModal(false)
        })
    }
    render(){
        let item = this.props.data;
        let p_qixian_range = item.p_qixian_range;
        let pDays = [];
        if(p_qixian_range === '可选'){
            pDays = forDate(1,30,'年')
        }else if(p_qixian_range.substr(p_qixian_range.length - 1,1) === '天'){
            let reg = /\d+/g;
            let minNum = parseInt(p_qixian_range.match(reg)[0]);
            let maxNum = parseInt(p_qixian_range.match(reg)[1]);
            pDays = forDate(minNum,maxNum,'天')
        }else if(p_qixian_range.substr(p_qixian_range.length - 1,1) === '月'){
            let reg = /\d+/g;
            let minNum = parseInt(p_qixian_range.match(reg)[0]);
            let maxNum = parseInt(p_qixian_range.match(reg)[1]);
            pDays = forDate(minNum,maxNum,'个月')
        }
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#fff"
                    barStyle="light-content"
                />
                <TouchableHighlight onPress={this._pop.bind(this)}  style={styles.back} underlayColor="rgba(34, 26, 38, 0.1)">
                    <View>
                        <Icon name="ios-arrow-back" size={28} color={'#fff'} style={styles.leftArrow} />
                    </View>
                </TouchableHighlight>
                <ScrollView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 54}}
                >
                    <View style={styles.topHeader}>
                        <View style={styles.topBox}>
                            <Image source={require('../assets/images/topBg.png')} style={styles.topImg}/>
                            <View style={styles.topTime}>
                                <Text style={styles.topText}>{item.p_zk_fk_time}</Text>
                                <Text style={styles.topText}>放款</Text>
                            </View>
                            <View style={styles.topMoney}>
                                <Text style={styles.topText}>
                                    {
                                        item.p_loans_range ?
                                            item.p_loans_range.split('-')[0] + item.p_loans_range.substr(item.p_loans_range.length-1,1):
                                            '不限'
                                    }
                                </Text>
                                <Text style={styles.topText}>贷款金额</Text>
                            </View>
                            <View style={styles.topLixi}>
                                <Text style={styles.topText}>
                                    {
                                        item.p_yuefeiyong ?
                                            item.p_yuefeiyong:'0元'
                                    }
                                </Text>
                                <Text style={styles.topText}>月费用</Text>
                            </View>
                            <View style={styles.topLimit}>
                                <Text style={styles.topText}>
                                    {
                                        item.p_qixian_range ?
                                            pDays[pDays.length - 1]:
                                            '不限'

                                    }
                                </Text>
                                <Text style={styles.topText}>贷款期限</Text>
                            </View>
                            <View style={styles.topDi}>
                                <Text style={styles.topText}>
                                    {
                                        item.p_yuefuwufeilv ?
                                            item.p_yuefuwufeilv : '0%'
                                    }
                                </Text>
                                <Text style={styles.topText}>日利率</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.productModule}>
                        <View style={styles.dkItem}>
                            <Image source={{uri:Util.thumb(item.plogo)}} style={styles.dkImg}/>
                            <View style={styles.dkContent}>
                                <Text style={styles.title}>{item.cname}-{item.pname}</Text>
                                <Text style={styles.text}>放款人数:{item.p_appliy_num}人</Text>
                            </View>
                        </View>
                        <View style={styles.productText}>
                            <View style={styles.productPriceBox}>
                                <View style={styles.pPrice}>
                                    <Text style={styles.pText}>金额:</Text>
                                    <View style={styles.pNum}>
                                        <TextInput
                                            placeholder="500"
                                            placeholderTextColor="#000"
                                            autoCaptialize={'none'}
                                            autoCorrect={false}
                                            keyboardType={'number-pad'}
                                            style={styles.inputField}
                                            defaultValue={this.state.price}
                                            onChangeText={(text) => {
                                                this.setState({
                                                    price: text
                                                })
                                            }}
                                        />
                                        <Text style={styles.pType}>元</Text>
                                    </View>
                                </View>
                                <View style={styles.pMax}>
                                    <Text style={styles.subText}>贷款范围:{item.p_loans_range}元</Text>
                                </View>
                            </View>
                            <View style={styles.productTimeBox}>
                                <View style={styles.pPrice}>
                                    <Text style={styles.pText}>期限:</Text>
                                    <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" onPress={this._showPick.bind(this)}>
                                        <View  style={styles.dtime}>
                                            <Text style={styles.timeField}>
                                                {
                                                    this.state.choosed ?
                                                        this.state.day:pDays[Math.floor(pDays.length/2)]
                                                }
                                            </Text>
                                            <Icon name="ios-arrow-down" size={18} color={'#888'} style={styles.arrow} />
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.pMax}>
                                    <Text style={styles.subText}>期限范围:{item.p_qixian_range}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.sqModule}>
                        <Text style={styles.sqTitle}>申请条件</Text>
                        <View style={styles.sqContent}>
                            <Text style={styles.sqText}>{item.p_apply_condition}</Text>
                        </View>
                    </View>
                    <View style={styles.sqModule}>
                        <Text style={styles.sqTitle}>审核说明</Text>
                        <View style={styles.sqContent}>
                            <Text style={styles.sqText}>审核周期: {item.p_review_way}</Text>
                            <Text style={styles.sqText}>放贷时间: {item.p_zk_fk_time}</Text>
                            <Text style={styles.sqText}>还款方式: {item.p_repay_mode}</Text>
                        </View>
                    </View>
                    <View style={styles.sqModule}>
                        <Text style={styles.sqTitle}>产品介绍</Text>
                        <View style={styles.sqContent}>
                            <Text style={styles.ptText}>
                                {item.pintro}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                {
                    this.props.up === '1'?
                        <View style={styles.btBox}>
                            <Button containerStyle={styles.submitBtn}
                                    style={{fontSize: 16,color: '#fff'}} onPress={this._submit.bind(this)}>立即申请</Button>
                        </View>:null
                }
                <Modal
                    animationType={'fade'}
                    visible={this.state.pickeVisible}
                    transparent={true}
                    onRequestClose={() => {this._setPickeModal(false)}}>
                    <TouchableHighlight onPress={() => {this._setPickeModal(false)}} style={styles.pickOverlay}>
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
                                pDays.map((item) => {
                                    return(
                                        <TouchableOpacity key={item} style={styles.pickItem} onPress={this._pickDay.bind(this,item)}>
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
    back: {
        position: 'absolute',
        top: 30,
        left: 20,
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: 'rgb(75,122,198)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex:  2
    },
    leftArrow: {
        backgroundColor: 'transparent',
        marginRight: 3
    },
    btBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 54,
        borderTopWidth: 1,
        borderColor: '#ddd',
        justifyContent:'center',
        backgroundColor: '#fff'
    },
    submitBtn: {
        width: Util.size.width - 20,
        padding:6,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgb(84,136,220)',
        borderRadius: 5,
        backgroundColor: 'rgb(84,136,220)'
    },
    topHeader: {
        width: Util.size.width,
        padding: 10,
        height: 200,
        backgroundColor:'rgb(84,136,220)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dkItem: {
        width: Util.size.width,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 40,
        backgroundColor: '#fff'
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
    text: {
        paddingVertical: 3,
        paddingRight: 40,
        color: '#555'
    },
    productText: {
        width: Util.size.width,
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#fff"
    },
    subText: {
        color: '#555',
        fontSize: 12
    },
    pPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    pText: {
        fontSize: 12
    },
    pNum: {
        height: 28,
        width: 100,
        paddingHorizontal: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ddd',
        marginLeft: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputField: {
        width: 60,
        fontSize: 12,
        color: '#000'
    },
    pType: {
        fontSize: 12
    },
    sqModule: {
        width: Util.size.width,
        marginTop: 5,
        backgroundColor: '#fff'
    },
    sqTitle: {
        paddingVertical: 8,
        paddingHorizontal: 15
    },
    sqContent: {
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingTop: 8,
        paddingHorizontal: 15
    },
    sqText: {
        paddingBottom: 8,
        fontSize: 12,
        color: '#666'
    },
    ptText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        paddingBottom: 8
    },
    pickOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 48,
        backgroundColor: 'rgba(0,0,0,.6)',
        zIndex: -1
    },
    pickBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        maxHeight: 160,
        backgroundColor: '#fff'
    },
    pickItem: {
        height: 40,
        width: Util.size.width,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dtime: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 14,
        height: 28,
        paddingHorizontal: 8,
        marginLeft: 5
    },
    timeField: {
        width: 50,
        fontSize: 12,
        color: '#000',
        textAlign: 'center'
    },
    topBox: {
        width: Util.size.width * 0.8,
        height: Util.size.width * 0.8 * 138 / 462
    },
    topImg: {
        width: Util.size.width * 0.8,
        height: Util.size.width * 0.8 * 138 / 462
    },
    topTime: {
        position: 'absolute',
        bottom: -26,
        left: 0,
        alignItems: 'flex-end',
        zIndex: 1
    },
    topText: {
        color: '#fff',
        fontSize: 12
    },
    topMoney: {
        position: 'absolute',
        top: -26,
        left: Util.size.width * 0.8 * 0.16,
        alignItems: 'flex-end',
        zIndex: 1
    },
    topLixi: {
        position: 'absolute',
        top: Util.size.width * 0.8 * 138 / 462 * 0.65,
        left: Util.size.width * 0.8 * 0.45,
        alignItems: 'center',
        zIndex: 1
    },
    topLimit: {
        position: 'absolute',
        top: -26,
        right: Util.size.width * 0.8 * 0.15,
        alignItems: 'center',
        zIndex: 1
    },
    topDi: {
        position: 'absolute',
        bottom: -26,
        right: -10,
        alignItems: 'center',
        zIndex: 1
    },
    arrow: {
        marginTop: 2
    }
})