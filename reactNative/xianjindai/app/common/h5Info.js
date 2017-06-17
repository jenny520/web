/**
 * Created by zhoumeiyan on 17/1/13.
 */
import React, { Component } from 'react';
import {
    WebView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    Alert
} from 'react-native';
import Util from '../Util/util';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
export default class extends Component{
    constructor(props){
        super(props)
    }
    addSubmit(){
        Alert.alert(
            '是否完成了申请',
            null,
            [
                {text: '只是看看', onPress: () => this.props.navigator.pop()},
                {text: '已申请', onPress: () => {
                    let item = this.props.item;
                    let user = this.props.user;
                    let body = new FormData();
                    let pid = item.pid;
                    let mobile = user.mobile;
                    let a_apply_period = item.a_apply_period;
                    let a_apply_amount = item.a_apply_amount;
                    let a_apply_time = item.a_apply_time;
                    body.append('pid',pid);
                    body.append('mobile',mobile);
                    body.append('a_apply_period',a_apply_period);
                    body.append('a_apply_amount',a_apply_amount);
                    body.append('a_apply_time',a_apply_time);
                    Util.upload(body,'http://api.jinrongsudi.com/index.php/Api/Product/add_product_apply',(response) => {
                        if(response && response.flag){
                            this.props.navigator.pop()
                        }
                    })
                }}
            ]
        )
    }
    render() {
        let item = this.props.item;
        return(
            <View style={styles.reportContainer}>
                <NavigationBar
                    title={{ title: this.props.title, tintColor: '#fff'}}
                    tintColor = "rgb(84,136,220)"
                />
                <TouchableHighlight style={styles.paixuIcon} underlayColor="rgba(0,0,0,0)" onPress={this.addSubmit.bind(this)}>
                    <View style={styles.backModule}>
                        <Icon name="ios-arrow-back" size={30} color={'#fff'} style={styles.leftArrow} />
                        <Text style={styles.backText}>返回 关闭</Text>
                    </View>
                </TouchableHighlight>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    source={{uri: this.props.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    startInLoadingState={true}
                    scalesPageToFit={false}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    reportContainer:{
        width: Util.size.width,
        backgroundColor:'#f5f5f5',
        height: Util.size.height
    },
    backModule: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    backText: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 5,
    },
    paixuIcon: {
        position: 'absolute',
        left: 10,
        top: 28
    },
})