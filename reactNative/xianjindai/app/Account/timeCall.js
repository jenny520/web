/**
 * Created by zhoumeiyan on 17/2/16.
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
    TextInput,
    Switch,
    Modal,
    PickerIOS
} from 'react-native';
import Util from '../Util/util';
import icons from '../assets/Icon';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast, {DURATION} from 'react-native-easy-toast';
import Button from 'react-native-button';

const Item = PickerIOS.Item;
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            trueSwitchIsOn: true,
            falseSwitchIsOn: false,
            modalVisible: false,
            tText: '',
            switchOn: false,
            dkDate: '',
            dateVisible: false,
            selected: '',
            warnTime: ''
        }
    }
    _isOn(value){
        this.setState({
            falseSwitchIsOn: value,
            modalVisible: true,
            tText: value ? '您已开启还款提醒功能' : '您已关闭还款提醒功能',
            switchOn: true
        })
        timer && clearTimeout(timer)
        var timer = setTimeout(() => {
            this.setState({
                modalVisible: false
            })
        },20)
    }
    _submit(){
        console.log(4)
    }
    onValueChange = (key, value) => {
        console.log(key,value)
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    }
    _setDate(value){
        this.setState({
            dateVisible: true,
            selected: value
        })
    }
    _cDays(value){
        let j = 0;
        let days = [];
        let mdays = 31;
        if (value == 1 || value == 3 || value == 5 || value == 7 || value == 8 || value == 10 || value == 12) {
            mdays = 31;
        }
        else if (value == 4 || value == 6 || value == 9 || value == 11) {
            mdays = 30;
        } else if (value == 2 ){
            var year = new Date().getFullYear()
            var stryear = parseFloat(year);
            var cond1 = stryear % 4 == 0;  //条件1：年份必须要能被4整除
            var cond2 = stryear % 100 != 0;  //条件2：年份不能是整百数
            var cond3 = stryear % 400 == 0;  //条件3：年份是400的倍数
            //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
            //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
            //所以得出判断闰年的表达式：
            var cond = cond1 && cond2 || cond3;
            if (cond) {
                mdays = 29;
            } else {
                mdays = 28;
            }
        }
        for(let i = 1;i <= mdays;i++){
            days[j] = `每月${i}日`;
            j++;
        }
        return days;
    }
    _onsure(){
        let key = this.state.selected;
        let value = this.state.time;
        let newstate = {};
        newstate[key] = value;
        newstate['dateVisible'] = false
        this.setState(newstate)
    }
    _oncancel(){
        this.setState({
            dateVisible: false
        })
    }
    render(){
        let month = new Date().getMonth() + 1;
        let cdays = this._cDays(month)
        return(
            <View style={styles.container}>
                <View style={styles.tabModule}>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>贷款机构</Text>
                        <Text style={styles.tabName}>福贷-小额速贷</Text>
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>贷款金额</Text>
                        <TextInput
                            placeholder="请输入贷款金额"
                            autoCaptialize={'none'}
                            autoCorrect={false}
                            style={styles.inputField}
                            placeholderTextColor="#555"
                            defaultValue={this.state.name}
                            onChangeText={(text) => {
                                this.setState({
                                    num: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>贷款期限</Text>
                        <TextInput
                            placeholder="请输入贷款期限"
                            autoCaptialize={'none'}
                            autoCorrect={false}
                            style={styles.inputField}
                            placeholderTextColor="#555"
                            defaultValue={this.state.name}
                            onChangeText={(text) => {
                                this.setState({
                                    time: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>每月还款额</Text>
                        <TextInput
                            placeholder="请输入每月还款额"
                            autoCaptialize={'none'}
                            autoCorrect={false}
                            style={styles.inputField}
                            placeholderTextColor="#555"
                            defaultValue={this.state.name}
                            onChangeText={(text) => {
                                this.setState({
                                    time: text
                                })
                            }}
                        />
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>每月还款日</Text>
                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this._setDate.bind(this,'dkDate')}>
                            <View style={styles.select}>
                                <Text>{this.state.dkDate || '请选择月还款日'}</Text>
                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>是否开启提醒功能</Text>
                        <View>
                            <Switch
                                onValueChange={(value) => {this._isOn(value)}}
                                value={this.state.falseSwitchIsOn} />
                        </View>
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.tabLable}>还款提醒日</Text>
                        <TouchableHighlight underlayColor="rgba(0,0,0,0)" onPress={this._setDate.bind(this,'warnTime')}>
                            <View style={styles.select}>
                                <Text>{this.state.warnTime || '请选择还款提醒日'}</Text>
                                <Icon name="ios-arrow-down" style={styles.arrow} size={18}/>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <Button
                        containerStyle={[styles.btn,this.state.switchOn ? styles.active: '']}
                        style={{fontSize: 16,color: '#fff'}}
                        onPress={this._submit.bind(this)}
                    >确认</Button>
                </View>
                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                    transparent={true}
                    onRequestClose={() => {this._setModalVisible(false)}}>
                    <View style={styles.overlay}>
                        <View style={styles.toast}>
                            <Text style={styles.toastText}>{this.state.tText}</Text>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType={'fade'}
                    visible={this.state.dateVisible}
                    transparent={true}
                    onRequestClose={() => {this._setModalVisible(false)}}
                >
                    <View style={styles.overlay}>
                        <View style={styles.pickeBox}>
                            <View style={styles.pickeLable}>
                                <TouchableOpacity onPress={this._oncancel.bind(this)}>
                                    <Text>取消</Text>
                                </TouchableOpacity>
                                <Text style={styles.pickeSet}>请设置还款提醒时间</Text>
                                <TouchableOpacity onPress={this._onsure.bind(this)}>
                                    <Text>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pickeTime}>
                                <PickerIOS
                                    itemStyle={{fontSize: 14}}
                                    selectedValue={this.state.time}
                                    onValueChange={(day) => {this.setState({time: day})}}
                                    mode="dialog">
                                    {
                                        cdays.map((item) => {
                                            return (
                                                <Item label={item} value={item} key={item}/>
                                            )
                                        })
                                    }
                                </PickerIOS>
                            </View>
                        </View>
                    </View>
                </Modal>
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
    tabModule: {
        width: Util.size.width,
        backgroundColor: '#fff'
    },
    tabItem: {
        width: Util.size.width,
        height: 45,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    inputField: {
        height: 45,
        width: 150,
        fontSize: 14,
        color: '#555',
        textAlign: 'right'
    },
    select: {
        height: 45,
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
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#ddd'
    },
    active: {
        backgroundColor: 'rgb(84,136,220)',
        borderColor: 'rgb(84,136,220)'
    },
    overlay: {
        width: Util.size.width,
        height: Util.size.height,
        backgroundColor: 'rgba(0,0,0,.6)',
        alignItems: 'center'
    },
    toast: {
        width: 200,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginTop: Util.size.height * 0.3,
        borderRadius: 5
    },
    toastText: {
        color: '#333'
    },
    pickeBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: Util.size.width,
        height: 200,
        backgroundColor: '#fff'
    },
    pickeLable: {
        width: Util.size.width,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor:'#ddd',
        paddingHorizontal:10
    }
})