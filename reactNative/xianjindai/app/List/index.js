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
    ActivityIndicator,
    RefreshControl,
    Image,
    Modal,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import icons from '../assets/Icon';
import Util from '../Util/util';
import Detail from '../common/detail'
import TabItem from '../common/item';
let cacheResults = {
    nextPage: 1,
    items: [],
    total: 0
};
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: this.props.user || '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            isLoading: false,
            refreshing: false,
            selected: 6,
            modalVisible:false,
            sortType: 'default',
            pickeVisible: false,
            money: 5000,
            month: '12个月',
            showtype: ''
        }
    }
    componentDidMount(){
        this._fetchData(1)
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
    _fetchData(page){
        console.log(page)
        if(page !== 0){
            this.setState({
                isLoading: true
            });
        }else{
            this.setState({
                refreshing: true
            })
        }
        Util.get('http://api.jinrongsudi.com/index.php/Api/Product/product_list',
            {
                page: page,
                ptype: this.state.selected
            })
            .then((data) => {
                if(data){
                    if(data.list){
                        let size = data.list.length;
                        data.total = size;
                    }else{
                        data.total = 0
                    }
                    if(page === 1){
                        cacheResults = {
                            nextPage: 1,
                            items: [],
                            total: 0
                        }
                    }
                    var items = cacheResults.items.slice();
                    if(page === 0){
                        items = data.list.concat(items);
                    }else{
                        items = items.concat(data.list);
                        cacheResults.nextPage += 1;
                    }
                    cacheResults.items = items;
                    cacheResults.total = data.total || 1;
                    console.log(cacheResults.items,cacheResults.total)
                    if(page === 0){
                        this.setState({
                            refreshing: false,
                            dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
                        })
                    }else{
                        this.setState({
                            isLoading: false,
                            dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
                        })
                    }
                }
            })
            .catch((error) => {
                console.error(error);
                if(page === 0){
                    this.setState({
                        refreshing: false
                    })
                }else{
                    this.setState({
                        isLoadingTail: false
                    })
                }
            })
    }
    _renderList(row){
        return (
            row ?
            <TabItem
                key={row.pid}
                onSelect={() => {this._loadPage(row)}}
                item={row}
            />:null
        )
    }
    _hasMoreDate(){
        return (
            cacheResults.items.length !== cacheResults.total
        )
    }
    _fetchMoreDate(){
        if(!this._hasMoreDate() || this.state.isLoading){
            return ;
        }
        let page = cacheResults.nextPage;
        this._fetchData(page)
    }
    _renderFooter(){
        if(!this._hasMoreDate() && cacheResults.total !=0){
            return (
                <View style={styles.loadingMore}>
                    <Text style={styles.loadingText}>没有更多了!</Text>
                </View>
            )
        }
        if(!this.state.isLoading){
            return (
                <View style={styles.loadingMore}/>
            )
        }
        return (
            <ActivityIndicator
                size="small"
                color="#6435c9"
                style={styles.loadingMore}
            />
        )
    }
    _onRefresh(){
        if(!this._hasMoreDate() || this.state.refreshing){
            return ;
        }
        this._fetchData(0)
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
    _selectIdentity(type){
        console.log(type)
        this.setState({
            selected: type
        },() => {
            this._fetchData(1)
        })
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <NavigationBar
                        title={{ title: '贷款搜索', tintColor: '#333'}}
                        tintColor = "#fff"
                    />
                    <View style={styles.dType}>
                        <View style={styles.dIdentity}>
                            <Text style={styles.dTitle}>职业身份</Text>
                            <View style={styles.Item}>
                                <View style={[styles.dText,this.state.selected === 6 ? styles.actived : '']}>
                                    <Text style={[styles.dT,this.state.selected === 6 ? styles.dtActived : '']} onPress={this._selectIdentity.bind(this,6)}>上班族</Text>
                                </View>
                                <View style={[styles.dText,this.state.selected === 7 ? styles.actived : '']} >
                                    <Text style={[styles.dT,this.state.selected === 7 ? styles.dtActived : '']} onPress={this._selectIdentity.bind(this,7)}>学生</Text>
                                </View>
                                <View style={[styles.dText,this.state.selected === 11 ? styles.actived : '']}>
                                    <Text style={[styles.dT,this.state.selected === 11 ? styles.dtActived : '']} onPress={this._selectIdentity.bind(this,11)}>个体户</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderList.bind(this)}
                        onEndReached={this._fetchMoreDate.bind(this)}
                        renderFooter={this._renderFooter.bind(this)}
                        contentContainerStyle={{paddingBottom: 48}}
                        refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#ff6600"
                            title="拼命加载..."
                        />
                    }
                        onEndReachedThreshold={20}
                        enableEmptySections={true}
                        automaticallyAdjustContentInsets={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                    transparent={true}
                    onRequestClose={() => {this._setModalVisible(false)}}>
                    <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" onPress={() => {this._setModalVisible(false)}} style={styles.overlay}>
                        <View style={styles.sortBox}>
                            <View style={styles.sortArrow}></View>
                            <View style={styles.sortItem}>
                                <Image source={{uri: icons.sort}} style={styles.sortIcon}/>
                                <Text style={[styles.sortText,this.state.sortType === 'default' ? styles.sortActive : '']} onPress={() => {this._selectSort('default')}}>默认排序</Text>
                            </View>
                            <View style={styles.sortItem}>
                                <Image source={{uri: icons.lilvh}} style={styles.sortIcon}/>
                                <Text style={[styles.sortText,this.state.sortType === 'success' ? styles.sortActive : '']} onPress={() => {this._selectSort('success')}}>成功率最高</Text>
                            </View>
                            <View style={styles.sortItem}>
                                <Image source={{uri: icons.lilvd}} style={styles.sortIcon}/>
                                <Text style={[styles.sortText,this.state.sortType === 'low' ? styles.sortActive : '']} onPress={() => {this._selectSort('low')}}>贷款利率低</Text>
                            </View>
                            <View style={styles.sortItem}>
                                <Image source={{uri: icons.suduk}} style={styles.sortIcon}/>
                                <Text style={[styles.sortText,this.state.sortType === 'fast' ? styles.sortActive : '']} onPress={() => {this._selectSort('fast')}}>放款速度快</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'rgb(237,237,237)'
    },
    header: {
        width: Util.size.width
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
    dType: {
        width: Util.size.width,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd'
    },
    dIdentity: {
        width: Util.size.width - 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    Item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    dText: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
        marginHorizontal: 5,
        width: 80,
        alignItems: 'center'
    },
    dT: {
        fontSize: 14,
        color: '#555'
    },
    dtActived: {
        color: 'rgb(81,137,221)'
    },
    Num: {
        marginTop: 10
    },
    dPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
    },
    moneyT: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    money: {
        width: 50,
        textAlign: 'center'
    },
    arrow: {
        paddingTop:2,
        marginLeft: 3
    },
    dDate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    dtime: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,
        height: 30,
        paddingHorizontal: 8,
        marginLeft: 5
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
    dkItem: {
        width: Util.size.width,
        paddingVertical: 10,
        borderTopWidth: 1,
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
    title: {
        color: '#d81e06'
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
        marginVertical: 20
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
    },
    picker: {
        width: 100,
        height: 40
    },
    actived: {
        borderColor: 'rgb(81,137,221)'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: -49,
        width: Util.size.width,
        backgroundColor: 'rgba(0,0,0,.5)',
        zIndex: 1,
        opacity: 1
    },
    sortBox: {
        position: 'absolute',
        top: 70,
        right: 10,
        backgroundColor: '#fff',
        zIndex:5,
        opacity: 1,
        paddingTop: 10,
        paddingHorizontal: 10,
        borderRadius: 4
    },
    sortItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        padding: 10
    },
    sortIcon: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    sortArrow: {
        position:'absolute',
        top: -10,
        right: 10,
        width: 0,
        height: 0,
        borderWidth: 8,
        borderTopWidth: 0,
        borderBottomWidth: 10,
        borderColor: 'transparent',
        borderBottomColor: '#fff'
    },
    sortActive: {
        color: 'rgb(81,137,221)'
    },
    pickOverlay: {
        position: 'absolute',
        top: 60,
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
        bottom: 48,
        height: 160,
        backgroundColor: '#fff'
    },
    pickItem: {
        height: 40,
        width: Util.size.width,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center'
    }
})