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
import Detail from '../common/detail';
import TabItem from '../common/item';
let cacheResults = {
    items: []
};
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: this.props.user || '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            isLoading: true,
        }
    }
    componentDidMount(){
        this._fetchData(1)
    }
    _fetchData(page){
        let url = this.props.url || 'http://api.jinrongsudi.com/index.php/Api/Product/product_list';
        let body = {};
        if(this.props.ptype){
            body = {
                page: page,
                ios:1,
                v1:1,
                ptype: this.props.ptype
            };
        }
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
                <TabItem
                    key={row.pid}
                    onSelect={() => {this._loadPage(row)}}
                    item={row}
                />:null
        )
    }
    _loadPage(data){
        console.log(this.props.up)
        this.props.navigator.push({
            component: Detail,
            navigationBarHidden: true,
            passProps: {
                data,
                user: this.state.user,
                up: this.props.up
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
    header: {
        width: Util.size.width
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
    loading: {
        marginTop: Util.size.height * 0.3
    }
})