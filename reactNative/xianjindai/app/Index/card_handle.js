/**
 * Created by zhoumeiyan on 17/1/16.
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
    TextInput
} from 'react-native';
import Util from '../Util/util';
import Icon from 'react-native-vector-icons/Ionicons';
import CardH5Info from '../common/cardh5Info';

class TabItem extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let items = this.props.item;
        return (
            <View>
                {
                    items.map((item) => {
                        let mark = item.tag.split(',');
                        return (
                            <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={this.props.onSelect.bind(this,item)} key={item.cid}>
                                <View style={styles.dkModule}>
                                    <View style={styles.dkItem}>
                                        <Image source={{uri:Util.thumb(item.card_pic)}} style={styles.dkImg}/>
                                        <View style={styles.dkContent}>
                                            <Text style={styles.title}>{item.pname}</Text>
                                            <View style={styles.markBox}>
                                                {
                                                    mark.map((mitem,index) => {
                                                        return (
                                                            <View style={styles.markItem} key={index}>
                                                                <Text style={styles.markText}>{mitem}</Text>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                            <View style={styles.dkNum}>
                                                <Text style={styles.num}>{item.apply_number}人申请成功</Text>
                                            </View>
                                        </View>
                                        <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
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
            productItem: []
        }
    }
    componentDidMount(){
        Util.get('http://api.jinrongsudi.com/index.php/Api/Credit/get_credit',
            {
                page: 1,
                ios:1
            })
            .then((data) => {
                if(data){
                    console.log(data)
                    this.setState({
                        productItem: data.list,
                        loading: false
                    })
                }
            })
    }
    _loadPage(item,ptype){
        let title = item.pname
        if(ptype == 1){
            title = item.cname;
        }
        if(this.props.up == '1'){
            this.props.navigator.push({
                component: CardH5Info,
                navigationBarHidden: true,
                passProps: {
                    url: item.card_address,
                    title
                }
            })
        }
    }
    render(){
        return (
            <ScrollView
                style={styles.container}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 48}}
            >
                <TouchableHighlight>
                    <Image source={require('../assets/images/xyk_top.png')} style={styles.bannerImg}/>
                </TouchableHighlight>
                {
                    this.state.loading ?
                        <ActivityIndicator
                            size="small"
                            color="#6435c9"
                            style={styles.loadingMore}
                        />:
                        <View>
                            <View style={styles.navContainer}>
                                {
                                    this.state.productItem.map((item) => {
                                        return (
                                            <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" style={styles.navItem} key={item.cid} onPress={this._loadPage.bind(this,item,1)}>
                                                <View style={styles.navItem}>
                                                    <View style={styles.navIcon}>
                                                        <Image source={{uri: Util.thumb(item.logo)}} style={styles.productIcon}/>
                                                    </View>
                                                    <Text style={styles.navText}>{item.cname}</Text>
                                                </View>
                                            </TouchableHighlight>
                                        )
                                    })
                                }
                            </View>
                            <View style={styles.dkContainer}>
                                <View style={styles.dkTitle}>
                                    <Text style={styles.title}>信用卡简介</Text>
                                    <Text>可申请多张信用卡</Text>
                                </View>
                                <TabItem
                                    item={this.state.productItem}
                                    onSelect={(item) => {this._loadPage(item)}}
                                />
                            </View>
                        </View>
                }
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(237,237,237)'
    },
    navContainer: {
        flexDirection:'row',
        flexWrap:"wrap",
        width: Util.size.width,
        backgroundColor: '#fff',
        marginVertical: 10
    },
    bannerImg: {
        width: Util.size.width,
        height: 416 * Util.size.width / 1242
    },
    navItem: {
        width: Util.size.width * 0.25,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    navIcon: {
        width: 40,
        height: 40,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navText: {
        paddingVertical: 10
    },
    productIcon: {
        width: 30,
        height: 30
    },
    dkContainer: {
        backgroundColor: '#fff'
    },
    dkTitle: {
        width: Util.size.width,
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    titleIcon: {
        width:20,
        height:20,
        marginRight: 4
    },
    dkItem: {
        width: Util.size.width,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 40
    },
    dkImg: {
        width: 80,
        height: 50,
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
    loadingMore: {
        marginVertical: 10
    },
    markBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6
    },
    markItem: {
        borderWidth: 1,
        borderColor: 'rgb(81,137,221)',
        borderRadius: 8,
        marginRight: 5,
        width: 80,
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 4
    },
    markText: {
        fontSize: 14,
        color: 'rgb(81,137,221)'
    }
})