/**
 * Created by zhoumeiyan on 16/12/29.
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
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Util from '../Util/util';
import H5Info from '../common/h5Info';

class TabItem extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let items = this.props.dkitem;
        return (
            <View>
                {
                    items.map((item,index,list)=>{
                        return (
                            <TouchableHighlight key={item.bid} underlayColor="rgba(0,0,0,0)" onPress={this.props.onSelect.bind(this,item)}>
                                <View style={styles.dkModule}>
                                    <View style={styles.dkItem}>
                                        <Image source={{uri:Util.thumb(item.plogo)}} style={styles.dkImg}/>
                                        <View style={styles.dkContent}>
                                            <Text style={styles.subTitle}>{item.cname}-{item.pname}</Text>
                                            <Text style={styles.text}>{item.pjianjie}</Text>
                                        </View>
                                        <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                                    </View>
                                    <View style={styles.dkfooter}>
                                        <View style={styles.dkMoney}>
                                            <Text>额度范围</Text>
                                            <Text style={styles.money}>{item.p_loans_range}元</Text>
                                        </View>
                                        <View style={styles.dkMoney}>
                                            <Text>日利率</Text>
                                            <Text style={styles.money}>{item.p_yuefuwufeilv || '0%'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        )
                    })
                }
            </View>
        )
    }
}
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            productItems: []
        }
    }
    componentDidMount(){
        Util.get('http://api.jinrongsudi.com/index.php/Api/Product/get_product_brow_history',{
            mobile: this.props.user.mobile
        })
        .then((data) => {
            if(data && data.list){
                this.setState({
                    productItems: data.list,
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
        let item = data;
        let user = this.props.user;
        if(this.props.up == '1'){
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
    }
    render(){
        let data = this.state.productItems;
        return (
            <View style={styles.container}>
                <ScrollView
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 64}}
                >
                    <View>
                        {
                            this.state.loading ?
                                <ActivityIndicator
                                    size="small"
                                    color="#6435c9"
                                    style={styles.loadingMore}
                                />:
                                data.map((item,index,list) => {
                                    return (
                                        <View key={`${item.date}-${index}`}>
                                            <View style={styles.titleBox}>
                                                <Text style={styles.title}>{Util.formatTime('mm月dd日',item.date)}</Text>
                                            </View>
                                            <TabItem
                                                dkitem={item.products}
                                                onSelect={(product) => {this._loadPage(product)}}
                                            />
                                        </View>
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
        flex:1,
        backgroundColor: 'rgb(237,237,237)'
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
        marginBottom: 5,
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
    money: {
        color: '#d81e06',
        marginLeft: 5
    },
    dkContent: {
        paddingRight: 20
    },
    text: {
        paddingVertical: 3,
        paddingRight: 40,
        color: '#555',
        marginTop: 8,
        fontSize: 13
    },
    dkNum: {
        flexDirection: 'row',
        width: Util.size.width,
        alignItems: 'center'
    },
    num: {
        color:'#d81e06',
        marginRight: 5
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
    dkMoney:{
        flexDirection: 'row'
    },
    loadingMore: {
        marginTop: Util.size.height * 0.3
    }
})