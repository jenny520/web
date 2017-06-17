/**
 * Created by zhoumeiyan on 16/10/15.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
    Image,
    ActivityIndicator,
    RefreshControl,
    AlertIOS,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import Util from '../utils/util';
import Utils from '../common/util';
import Icon from 'react-native-vector-icons/Ionicons';
import Request from '../common/request';
import Config from '../common/config';
import Detail from './detail'

let cacheResults = {
    nextPage: 1,
    items: [],
    total: 0
};
class Item extends Component{
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
            up: this.props.item.voted
        }
    }
    _up(){
        let up = !this.state.up;
        let item = this.state.item;
        let url = Config.api.base + Config.api.up;
        let body = {
            id: item._id,
            up: up ? 'yes' : 'no',
            accessToken: this.props.user.accessToken
        }
        Request.post(url,body)
            .then((data) => {
                if(data && data.success){
                    this.setState({
                        up: up
                    })
                }else{
                    AlertIOS.alert('点赞失败,稍后再试')
                }
            })
            .catch(error => {
                console.log(error);
                AlertIOS.alert('点赞失败,稍后再试')
            })
    }
    render(){
        let item = this.state.item;
        return (
            <TouchableHighlight onPress={this.props.onSelect} style={styles.item} underlayColor="rgba(34, 26, 38, 0.1)">
                <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Image source={{uri:Utils.thumb(item.qiniu_thumb)}} style={styles.thumb}>
                        <Icon name="ios-play" size={28} style={styles.play}/>
                    </Image>
                    <View style={styles.itemFooter}>
                        <TouchableOpacity onPress={this._up.bind(this)} style={styles.handleBox}>
                            <Icon name={this.state.up ? 'ios-heart' : 'ios-heart-outline'} size={28} style={[styles.up,this.state.up ? '' : styles.down]}/>
                            <Text style={styles.handleText}>喜欢</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.handleBox}>
                            <Icon name="ios-chatboxes-outline" size={28} style={styles.commentIcon}/>
                            <Text style={styles.handleText}>评论</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}
export default class extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            isLoadingTail: false,
            refreshing: false,
            user: this.props.user || {}
        }
    }
    componentDidMount(){
        AsyncStorage.getItem('user')
            .then((data) => {
                let user,newState = {};
                if(data){
                    user = JSON.parse(data);
                }
                if(user && user.accessToken){
                    this.setState({
                        user: user
                    },function(){
                        this._fetchData(1)
                    })
                }
            })
    }
    _fetchData(page){
        if(page !== 0){
            this.setState({
                isLoadingTail: true
            });
        }else{
            this.setState({
                refreshing: true
            })
        }
        let user = this.state.user;
        return (
            Request.get(Config.api.base+Config.api.creations,
                {
                    accessToken: this.state.user.accessToken,
                    page: page
                }
            )
                .then(data => {
                    if(data && data.success){
                        console.log(data.data)
                        if(data.data.length > 0){
                            data.data.map(function(item){
                                let votes = item.votes || []
                                if(votes.indexOf(user._id) > -1){
                                    item.voted = true
                                }else{
                                    item.voted = false
                                }
                                return item
                            })
                            var items = cacheResults.items.slice();
                            if(page === 0){
                                items = data.data.concat(items);
                            }else{
                                items = items.concat(data.data);
                                cacheResults.nextPage += 1;
                            }
                            cacheResults.items = items;
                            cacheResults.total = data.total;
                            if(page === 0){
                                this.setState({
                                    refreshing: false,
                                    dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
                                })
                            }else{
                                this.setState({
                                    isLoadingTail: false,
                                    dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
                                })
                            }
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
        )
    }
    _renderList(row){
        console.log(row)
        return (
            <Item
                key={row._id}
                onSelect={() => {this._loadPage(row)}}
                item={row}
                user={this.state.user}
            />
        )
    }
    _hasMoreDate(){
        return (
            cacheResults.items.length !== cacheResults.total
        )
    }
    _fetchMoreDate(){
        if(!this._hasMoreDate() || this.state.isLoadingTail){
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
        if(!this.state.isLoadingTail){
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
            name: 'detail',
            component: Detail,
            params: {
                data
            }
        })
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>列表页面</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderList.bind(this)}
                    onEndReached={this._fetchMoreDate.bind(this)}
                    renderFooter={this._renderFooter.bind(this)}
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
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    header: {
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#ee735c'
    },
    headerText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600'
    },
    item: {
        width: Util.size.width,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    thumb: {
        width: Util.size.width,
        height: Util.size.width*0.56,
        resizeMode: 'cover'
    },
    title: {
        padding: 10,
        fontSize: 18,
        color: '#333'
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee'
    },
    handleBox: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        width: 0.5 * Util.size.width - 0.5,
        backgroundColor: '#fff'
    },
    handleText: {
        paddingLeft: 10,
        color: '#333',
        fontSize: 18
    },
    dow: {
        fontSize: 22,
        color: '#333'
    },
    up: {
        fontSize: 22,
        color: '#ee735c'
    },
    commentIcon: {
        fontSize: 22,
        color: '#333'
    },
    play: {
        width: 46,
        height: 46,
        position: 'absolute',
        bottom: 14,
        right: 14,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: 'transparent',
        borderRadius: 23,
        color: '#ed7b66',
        paddingTop: 9,
        paddingLeft: 18
    },
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
    }
});