/**
 * Created by zhoumeiyan on 17/2/15.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ListView,
    ActivityIndicator,
    RefreshControl,
    Image,
    Modal,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import icons from '../assets/Icon';
import Util from '../Util/util';
import CardH5Info from '../common/cardh5Info';
let cacheResults = {
    items: []
};
class Item extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let item = this.props.item;
        return (
            <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" onPress={this.props.onSelect}>
                <View style={styles.dkModule}>
                    <View style={styles.dkItem}>
                        <Image source={{uri:Util.thumb(item.plogo)}} style={styles.dkImg}/>
                        <View style={styles.dkContent}>
                            <Text style={styles.subTitle}>{item.cname}-{item.pname}</Text>
                            <Text style={styles.text}>{item.pjianjie}</Text>
                        </View>
                        <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                    </View>
                    <View style={styles.dkMoney}>
                        <Text>额度范围</Text>
                        <Text style={styles.money}>{item.p_loans_range}元</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: this.props.user || '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            isLoading: true
        }
    }
    componentDidMount(){
        this._fetchData(1)
    }
    _fetchData(page){
        let url = this.props.url || 'http://api.jinrongsudi.com/index.php/Api/Product/product_list';
        let body = {};
        body = {
            page: page,
            ios:1,
            v1:1,
            ptype: 14
        };
        Util.get(url,body)
            .then((data) => {
                if(data){
                    if(page === 1){
                        cacheResults = {
                            items: []
                        }
                    }
                    var items = cacheResults.items.slice();
                    items = items.concat(data.list);
                    cacheResults.items = items;
                    this.setState({
                        isLoading: false,
                        dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }
    _renderList(row){
        return (
            row ?
                <Item
                    key={row.pid}
                    onSelect={() => {this._loadPage(row)}}
                    item={row}
                />:null
        )
    }
    _loadPage(data){
        this.props.navigator.push({
            component: CardH5Info,
            navigationBarHidden: true,
            passProps: {
                url: data.ph5addres,
                title: `${data.cname}-${data.pname}`
            }
        })
    }
    render(){
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <View style={styles.loading}>
                        <ActivityIndicator
                            size="small"
                            color="#6435c9"
                        />
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderList.bind(this)}
                        contentContainerStyle={{paddingBottom: 60}}
                        onEndReachedThreshold={20}
                        enableEmptySections={true}
                        automaticallyAdjustContentInsets={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'rgb(237,237,237)'
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
        paddingRight: 40,
        color: '#555',
        fontSize: 13,
        marginTop: 8
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
    dkMoney:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 40
    },
    loading: {
        marginTop: Util.size.height * 0.3
    },
})