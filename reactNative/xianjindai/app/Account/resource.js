/**
 * Created by zhoumeiyan on 16/12/21.
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
    DeviceEventEmitter,
    AsyncStorage,
    Animated
} from 'react-native';
import Button from 'react-native-button';
import Util from '../Util/util';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast, {DURATION} from 'react-native-easy-toast'
import City from '../common/city';
let Params = {
    marray: [
        '未婚','已婚'
    ],
    degree: [
        ' 高中','大专','本科','硕士','博士'
    ],
    profession: [
        '上班族','个体户','企业主','自由职业','学生'
    ],
    benefit: [
        '银行代发','转账工资','现金发放'
    ],
    company: [
        '普通企业','事业单位','大型垄断国企','世界500强企业','上市企业','其他'
    ],
    workTime: [
        '不足3个月','3-6个月','6-12个月','1-3年','4-7年','7年以上'
    ],
    security: [
        '否','是'
    ],
    card: [
        '否','是'
    ],
    house: [
        '无房产','商品住宅','商铺','办公楼','厂房','宅基地/自建房'
    ],
    car: [
        '无车产','名下有车','有车但已经被抵押'
    ],
    credit: [
        '无信用记录','信用记录良好','少量流期','征信较差'
    ],
    funds: [
        '否','是'
    ],
    success: [
        '否','是'
    ]
}
export default class extends Component{
    constructor(props){
        super(props);
        let user = this.props.user || ''
        this.state = {
            selectedIndex: 0,
            modalVisible: false,
            pickData: [],
            city: user.incity || '请选择',
            selected: '',
            marray: user.marital_status || '请选择',
            degree: user.education_Level || '请选择',
            profession: user.profession || '请选择',
            benefit: user.benefit || '请选择',
            company: user.company_type || '请选择',
            workTime: user.now_working_time || '请选择',
            security: user.gongjijin || '请选择',
            funds: user.shebao || '请选择',
            card: user.is_credit_card || '请选择',
            house: user.house || '请选择',
            car: user.car || '请选择',
            success: user.success_loan_records || '请选择',
            credit: user.credit_status || '请选择',
            user: user,
            name: user.name,
            mobile: user.mobile,
            idcard: user.idcard,
            income: user.income,
            fadeAnim: new Animated.Value(0)
        }
    }
    _submit(){
        let mobile = this.state.mobile,
            name = this.state.name,
            idcard = this.state.idcard;
        let reg =/^1[3|5|8][0-9]{9}$/;
        let sfreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!mobile || !reg.test(mobile)){
            AlertIOS.alert('请输入正确手机号')
        }else if(!name){
            AlertIOS.alert('请输入姓名')
        }else if(!idcard || !sfreg.test(idcard)){
            AlertIOS.alert('请输入正确的身份证')
        }else{
            let body = new FormData();
            body.append('mobile',this.state.mobile);
            body.append('name',this.state.name);
            body.append('idcard',this.state.idcard);
            body.append('incity',this.state.city);
            body.append('marital_status',this.state.marray === '请选择'?'':this.state.marray);
            body.append('education_Level',this.state.degree === '请选择'?'':this.state.degree);
            body.append('profession',this.state.profession === '请选择'?'':this.state.profession);
            body.append('benefit',this.state.benefit === '请选择'?'':this.state.benefit);
            body.append('income',this.state.income);
            body.append('company_type',this.state.company === '请选择'?'':this.state.company);
            body.append('now_working_time',this.state.workTime === '请选择'?'':this.state.workTime);
            body.append('gongjijin',this.state.security === '请选择'?'':this.state.security);
            body.append('shebao',this.state.funds === '请选择'?'':this.state.funds);
            body.append('is_credit_card',this.state.card === '请选择'?'':this.state.card);
            body.append('house',this.state.house === '请选择'?'':this.state.house);
            body.append('car',this.state.car === '请选择'?'':this.state.car);
            body.append('success_loan_records',this.state.success === '请选择'?'':this.state.success);
            body.append('credit_status',this.state.credit === '请选择'?'':this.state.credit);

            this._upload(body)
        }
    }
    _upload(body){
        let xhr = new XMLHttpRequest();
        let url = 'http://api.jinrongsudi.com/index.php/Api/User/update_user_information';
        xhr.open('POST',url)
        xhr.onload = () => {
            if(xhr.status !== 200){
                AlertIOS.alert('请求失败')
                console.log(xhr.responseText);
                return ;
            }
            if(!xhr.responseText){
                AlertIOS.alert('请求失败')
                return ;
            }
            let response;
            try {
                response = JSON.parse(xhr.responseText);
            }catch(e){
                console.log(e);
                console.log('parse fail')
            }
            if(response){
                if(response.flag){
                    this.refs.toast.show('修改成功');
                    Util.get('http://api.jinrongsudi.com/index.php/Api/User/get_user',{mobile:this.state.mobile})
                    .then((data) => {
                        if(data && data.flag){
                            let user = JSON.stringify(data.list);
                            AsyncStorage.setItem('user',user)
                                .then((data) => {
                                    this.setState({
                                        user: user
                                    },function(){
                                        console.log(this.refs.toast)
                                        DeviceEventEmitter.emit('changeUser')
                                    })
                                })
                        }
                    })
                }
            }
        }
        xhr.send(body)
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
        return (
            <View style={styles.container}>
                <View style={styles.tabBox}>
                    <View style={styles.tabBar}>
                        <SegmentedControlIOS
                            values={['个人信息', '身份信息','资产信息']}
                            tintColor={'rgb(84,136,220)'}
                            selectedIndex={this.state.selectedIndex}
                            style={{width: Util.size.width*0.6,marginLeft: Util.size.width*0.2}}
                            onChange={(event) => {
                                this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
                            }}
                        />
                    </View>
                    {
                        this.state.selectedIndex === 0 ?
                            <View style={styles.tabContent}>
                                <View style={styles.tabModule}>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>姓名</Text>
                                        <TextInput
                                            placeholder="请输入姓名"
                                            autoCaptialize={'none'}
                                            autoCorrect={false}
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
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>手机号</Text>
                                        <TextInput
                                            placeholder="请输入手机号码"
                                            autoCaptialize={'none'}
                                            autoCorrect={false}
                                            keyboardType={'number-pad'}
                                            style={styles.inputField}
                                            placeholderTextColor="#555"
                                            defaultValue={this.state.mobile}
                                            onChangeText={(text) => {
                                                this.setState({
                                                    mobile: text
                                                })
                                            }}
                                        />
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>身份证</Text>
                                        <TextInput
                                            placeholder="请输入身份证号"
                                            autoCaptialize={'none'}
                                            autoCorrect={false}
                                            style={[styles.inputField,{width: 200}]}
                                            placeholderTextColor="#555"
                                            defaultValue={this.state.idcard}
                                            onChangeText={(text) => {
                                                this.setState({
                                                    idcard: text
                                                })
                                            }}
                                        />
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>所在城市</Text>
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
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>婚姻状况</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('marray',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.marray}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>文化程度</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('degree',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.degree}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                            : null
                    }
                    {
                        this.state.selectedIndex === 1 ?
                            <View style={styles.tabContent}>
                                <View style={styles.tabModule}>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>职业身份</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('profession',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.profession}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>收入形式</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('benefit',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.benefit}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>月收入</Text>
                                        <View style={styles.select}>
                                            <TextInput
                                                placeholder="请输入月收入"
                                                autoCaptialize={'none'}
                                                autoCorrect={false}
                                                style={styles.inputField}
                                                placeholderTextColor="#555"
                                                defaultValue={this.state.income}
                                                onChangeText={(text) => {
                                                    this.setState({
                                                        income: text
                                                    })
                                                }}
                                            />
                                            <Text>元</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>公司类型</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('company',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.company}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>当前公司工作时间</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('workTime',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.workTime}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>连续6个月以上缴纳公积金</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('security',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.security}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>连续6个月以上缴纳社保</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('funds',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.funds}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>:
                            null
                    }
                    {
                        this.state.selectedIndex === 2 ?
                            <View style={styles.tabContent}>
                                <View style={styles.tabModule}>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>是否有信用卡</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('card',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.card}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>名下房产</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('house',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.house}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>名下车产</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('car',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.car}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>是否有成功贷款记录</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('success',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.success}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.tabItem}>
                                        <Text style={styles.tabLable}>信用情况</Text>
                                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={() => {this._setMode('credit',true)}}>
                                            <View style={styles.select}>
                                                <Text>{this.state.credit}</Text>
                                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>:
                            null
                    }
                    <Button
                        containerStyle={styles.btn}
                        style={{fontSize: 16,color: '#fff'}}
                        onPress={this._submit.bind(this)}
                    >保存</Button>
                </View>
                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                    transparent={true}
                    onRequestClose={() => {this._setModalVisible(false)}}>
                    <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" onPress={() => {this._setModalVisible(false)}} style={styles.overlay}>
                        <View></View>
                    </TouchableHighlight>
                    <View style={[styles.pickBox]}>
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
                <Toast
                    ref="toast"
                    position='top'
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    tabBar: {
        paddingVertical: 10,
        justifyContent: 'center',
    },
    tabModule: {
        width: Util.size.width,
        backgroundColor: '#fff'
    },
    tabItem: {
        width: Util.size.width,
        height: 40,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    inputField: {
        height: 40,
        width: 150,
        fontSize: 14,
        color: '#555',
        textAlign: 'right'
    },
    select: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        width: Util.size.width * 0.4,
        justifyContent: 'flex-end'
    },
    arrow: {
        marginTop: 5,
        marginLeft: 5,
        color: '#555'
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
    content: {
        backgroundColor: 'deepskyblue',
        borderWidth: 1,
        borderColor: 'dodgerblue',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
})