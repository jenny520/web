/**
 * Created by zhoumeiyan on 16/12/26.
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
    ActivityIndicator
} from 'react-native';
import Util from '../Util/util';
import icons from '../assets/Icon';
import Icon from 'react-native-vector-icons/Ionicons';
import SubmitDetail from './mySubmitDetail';
class TabItem extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let item = this.props.dkitem;
        return (
            <View>
                <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={this.props.onSelect.bind(this,item)}>
                    <View style={styles.dkModule}>
                        <View style={styles.dkItem}>
                            <Image source={{uri:Util.thumb(item.plogo)}} style={styles.dkImg}/>
                            <View style={styles.dkContent}>
                                <Text style={styles.subTitle}>{item.cname}-{item.pname}</Text>
                                <Text style={styles.dktext}>{Util.formatTime('mm-dd hh:mm',item.a_apply_time)}</Text>
                            </View>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                        </View>
                        <View style={styles.dkfooter}>
                            <View style={styles.dkTelIcon}>
                                <Image source={{uri:icons.tel}} style={styles.contactIcon}/>
                                <Text style={styles.Text}>客服电话咨询</Text>
                            </View>
                            <Text style={styles.tel}>{item.pcallback}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            submitItems: [],
            loading: true
        }
    }
    componentDidMount(){
        let user = this.props.user;
        Util.get('http://api.jinrongsudi.com/index.php/Api/Product/get_product_apply',{
                mobile: user.mobile
            })
            .then((data) => {
                console.log(data)
                if(data && data.list){
                    this.setState({
                        submitItems: data.list,
                        loading: false
                    })
                }else{
                    this.setState({
                        loading: false
                    })
                }
            })
    }
    _loadPage(data){
        this.props.navigator.push({
            component: SubmitDetail,
            title: '我的申请',
            passProps: {
                data
            }
        })
    }
    render(){
        let items = this.state.submitItems;
        return (
            <View style={styles.container}>
                <ScrollView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 64}}
                >
                    {
                        this.state.loading ?
                            <ActivityIndicator
                                size="small"
                                color="#6435c9"
                                style={styles.loadingMore}
                            />:
                            <View>
                                {
                                    items.length > 0 ?
                                        <View style={styles.submitProduct}>
                                            {
                                                items.map((item) => {
                                                    return (
                                                        <TabItem
                                                            dkitem={item}
                                                            onSelect={(item) => {this._loadPage(item)}}
                                                            key={item.aid}
                                                        />
                                                    )
                                                })
                                            }
                                        </View>:
                                        <View style={styles.noDKModule}>
                                            <View style={styles.iconBox}>
                                                <Image source={{uri: icons.zhengxin}} style={styles.icon}/>
                                            </View>
                                            <View style={styles.textBox}>
                                                <Text style={styles.text}>您还没有贷款申请记录</Text>
                                            </View>
                                            <TouchableOpacity style={styles.submitBox}>
                                                <View>
                                                    <Text style={styles.submitText}>赶紧去申请贷款吧>></Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                }
                            </View>
                    }
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(232,232,232)'
    },
    loadingMore: {
        marginTop: Util.size.height * 0.3
    },
    noDKModule: {
        paddingTop: Util.size.height * 0.2,
        alignItems: 'center'
    },
    iconBox: {
        width: 80,
        height: 80,
        borderRadius: 80,
        backgroundColor: 'rgb(247,185,118)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: 40,
        height: 40,
    },
    textBox: {
        marginTop: 15,
        marginBottom: 10
    },
    text: {
        fontSize: 15
    },
    submitText: {
        color: 'rgb(247,185,118)'
    },
    dkTitle: {
        width: Util.size.width,
        height: 40,
        paddingLeft: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    titleBox: {
        width: Util.size.width,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 15
    },
    titleIcon: {
        width:20,
        height:20,
        marginRight: 4
    },
    dkModule: {
        marginTop: 8,
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
    dkArrow: {
        position: 'absolute',
        right: 10,
        top: 30,
        color: '#ccc'
    },
    dkfooter: {
        paddingHorizontal: 10,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dkTelIcon: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    contactIcon: {
        width: 20,
        height: 20,
        marginRight: 5
    }
})