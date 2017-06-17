/**
 * Created by zhoumeiyan on 16/10/23.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image,
    ListView,
    TextInput,
    Modal,
    AlertIOS,
    AsyncStorage
} from 'react-native';
import Video from 'react-native-video';
import Util from '../utils/util';
import Utils from '../common/util';
import Icon from 'react-native-vector-icons/Ionicons';
import Config from '../common/config';
import Request from '../common/request';
import Button from 'react-native-button';
const cacheResults = {
    nextPage: 1,
    items: [],
    total: 0
};
export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            //video参数
            rate: 1,
            muted: false,
            resizeMode: 'contain',
            repeat: false,
            videoReady: false,
            videoProgress: 0.1,
            videoTotal: 0,
            currentTime: 0,
            playing: false,
            paused: false,
            videoOk: true,
            //评论的列表数据
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            data: this.props.data,
            //modal
            animationType: 'none',
            modalVisible: false,
            content: '',
            //评论状态
            isSending: false

        }
    }
    _pop(){
        this.props.navigator.pop()
    }
    _onLoadStart(){
        console.log('onLoadStart');
    }
    _onLoad(){
        console.log('onLoad');
    }
    _onProgress(data){
        if(!this.state.videoReady){
            this.setState({
                videoPlay: true
            })
        }
        let duration = data.playableDuration;
        let currentTime = data.currentTime;
        let percent = Number((currentTime / duration).toFixed(2));
        let newState = {
            videoTotal: duration,
            currentTime: Number(currentTime.toFixed(2)),
            videoProgress: percent
        };
        if(!this.state.videoReady){
            newState.videoReady = true
        }
        if(!this.state.playing){
            newState.playing = true
        }
        this.setState(newState)

    }
    _onEnd(){
        this.setState({
            videoProgress: 1,
            playing: false
        })
        console.log('onEnd');
    }
    _onError(error){
        this.setState({
            videoOk: false
        })
        console.log(error);
    }
    _replay(){
        this.refs.videoPlayer.seek(0);
    }
    _pause(){
        if(!this.state.paused){
            this.setState({
                paused: true
            })
        }else if(this.state.paused){
            this.setState({
                paused: false
            })
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
                        this._fetchData()
                    })
                }
            })
    }
    _fetchData(page){
        this.setState({
            isLoadingTail: true
        });
        return (
            Request.get(Config.api.base + Config.api.comment,
                {
                    accessToken: this.state.user.accessToken,
                    page: page,
                    creation: this.state.data._id
                }
            )
                .then(data => {
                    if(data && data.success){
                        if(data.data.length > 0){
                            var items = cacheResults.items.slice();
                            items = items.concat(data.data);
                            cacheResults.nextPage += 1;
                            cacheResults.items = items;
                            cacheResults.total = data.total;
                            this.setState({
                                isLoadingTail: false,
                                dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
                            })
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({
                        isLoadingTail: false
                    })
                })
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
    _loadPage(data){
        this.props.navigator.push({
            name: 'detail',
            component: Detail,
            params: {
                data
            }
        })
    }
    _renderList(row){
        return (
            <View style={styles.replyBox} key={row._id}>
                <Image style={styles.replyAvatar} source={{uri: Utils.avatar(row.replyBy.avatar)}} />
                <View style={styles.reply}>
                    <Text style={styles.replyNickName}>{row.replyBy.nickname}</Text>
                    <Text style={styles.replyTitle}>{row.content}</Text>
                </View>
            </View>
        )
    }
    _focus(){
        this._setModalVisible(true)
    }
    _blur(){
        console.log(3);
    }
    _closeModal(){
        this._setModalVisible(false)
    }
    _setModalVisible(isVisible){
        this.setState({
            modalVisible: isVisible
        })
    }
    _renderHeader(){
        let data = this.props.data;
        return (
            <View style={styles.listHeader}>
                <View style={styles.infoBox}>
                    <Image style={styles.avatar} source={{uri: Utils.avatar(data.author.avatar)}} />
                    <View style={styles.descBox}>
                        <Text style={styles.nickname}>{data.author.nickname}</Text>
                        <Text style={styles.title}>{data.title}</Text>
                    </View>
                </View>
                <View style={styles.commentBox}>
                    <View style={styles.comment}>
                        <TextInput
                            placeholder="好喜欢这个狗狗啊"
                            style={styles.content}
                            multiline={true}
                            onFocus={this._focus.bind(this)}
                            onBlur={this._blur.bind(this)}
                            defaultValue={this.state.content}
                            onChangeText={(text) => {
                                this.setState({
                                    content: text
                                })
                            }}
                        />
                    </View>
                </View>
                <View style={styles.commentArea}>
                    <Text style={styles.commentTitle}>精彩评论</Text>
                </View>
            </View>
        )
    }
    _submit(){
        if(!this.state.content){
            return (
                AlertIOS.alert('留言不能为空')
            )
        }else if(this.state.isSending){
            return (
                AlertIOS.alert('正在评论中')
            )
        }
        this.setState({
            isSending: true
        },() => {
            var body = {
                accessToken: this.state.user.accessToken,
                comment: {
                    creation: this.state.data._id,
                    content: this.state.content
                }
            }
            var url = Config.api.base + Config.api.comment;
            Request.post(url,body)
                .then((data) => {
                    if(data && data.success){
                        let items = cacheResults.items.slice();
                        let content = this.state.content;
                        items = data.data.concat(items);
                        cacheResults.items = items;
                        cacheResults.total += 1;
                        this.setState({
                            content: '',
                            isSending: false,
                            dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
                        })
                        this._setModalVisible(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    AlertIOS.alert('评论出错,请稍后再试')
                    this.setState({
                        isSending: false,
                        dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
                    })
                    this._setModalVisible(false);
                })
        })
    }
    render(){
        let data = this.props.data;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.popBox} onPress={this._pop.bind(this)}>
                        <Icon name="ios-arrow-back" style={styles.backIcon} size={20} color="#999"/>
                        <Text style={styles.backText}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOflines={1}>详情页面</Text>
                </View>
                <View style={styles.videoBox}>
                    <Video
                        ref="videoPlayer"
                        source={{uri: Utils.video(data.qiniu_video)}}
                        style={styles.video}
                        volume={5}
                        paused={this.state.paused}
                        rate={this.state.rate}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        repeat={this.state.repeat}
                        onLoadStart={this._onLoadStart.bind(this)}
                        onLoad={this._onLoad.bind(this)}
                        onProgress={this._onProgress.bind(this)}
                        onEnd={this._onEnd.bind(this)}
                        onError={this._onError.bind(this)}
                    />
                    {
                        !this.state.videoOk && <Text style={styles.failText}>视频出错啦!请重新再检查</Text>
                    }
                    {
                        !this.state.videoReady && <ActivityIndicator
                            size="small"
                            color="#6435c9"
                            style={styles.loading}
                        />
                    }
                    {
                        (this.state.videoReady && !this.state.playing)?
                            <Icon
                                name="ios-play"
                                style={styles.playIcon}
                                onPress={this._replay.bind(this)}
                                size={48}
                            />:null
                    }
                    {
                        this.state.videoReady && this.state.playing ?
                            <TouchableOpacity onPress={this._pause.bind(this)} style={styles.pauseBtn}>
                                {
                                    this.state.paused ?
                                        <Icon name="ios-play" style={styles.resumeIcon} size={48}/> :
                                        <Text></Text>
                                }
                            </TouchableOpacity>:null
                    }
                    <View style={styles.progressBox}>
                        <View style={[styles.progressBar,{width: Util.size.width*this.state.videoProgress}]}></View>
                    </View>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderList.bind(this)}
                    onEndReached={this._fetchMoreDate.bind(this)}
                    renderFooter={this._renderFooter.bind(this)}
                    renderHeader={this._renderHeader.bind(this)}
                    onEndReachedThreshold={20}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    showsVerticalScrollIndicator={false}
                />
                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this._setModalVisible(false)}}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={this._closeModal.bind(this)}>
                            <Icon name="ios-close-outline"
                                  style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <View style={styles.commentBox}>
                            <View style={styles.comment}>
                                <TextInput
                                    placeholder="好喜欢这个狗狗啊"
                                    style={styles.content}
                                    multiline={true}
                                    defaultValue={this.state.content}
                                    onChangeText={(text) => {
                                        this.setState({
                                            content: text
                                        })
                                }}
                                />
                            </View>
                        </View>
                        <Button style={styles.submitBtn} onPress={this._submit.bind(this)}>评论</Button>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    modalContainer: {
        flex: 1,
        paddingTop: 45,
        backgroundColor: '#fff'
    },
    closeIcon: {
        alignSelf: 'center',
        fontSize: 28,
        color: '#ee735c'
    },
    submitBtn: {
        width: Util.size.width - 20,
        marginVertical: 15,
        padding:10,
        marginHorizontal: 10,
        fontSize: 16,
        color: '#ee735c',
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 4
    },
    header: {
        width: Util.size.width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 64,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,.1)',
        backgroundColor: '#fff'
    },
    popBox: {
        position: 'absolute',
        left: 10,
        top: 30,
        flexDirection: 'row',
        alignItems: 'center',
        width: 50
    },
    backIcon: {
        marginRight: 5
    },
    backText: {
        color: "#999"
    },
    videoBox: {
        width: Util.size.width,
        height: Util.size.width * .56,
        backgroundColor: '#000'
    },
    video: {
        width: Util.size.width,
        height: Util.size.width * .56,
        backgroundColor: '#000'
    },
    loading: {
        position: 'absolute',
        left: 0,
        top: 70,
        width: Util.size.width,
        alignSelf: 'center'
    },
    progressBox: {
        width: Util.size.width,
        height: 2,
        backgroundColor: '#ccc'
    },
    progressBar: {
        width: 1,
        height: 2,
        backgroundColor: '#ff6600'
    },
    playIcon: {
        width: 60,
        height: 60,
        position: 'absolute',
        top: 80,
        left: Util.size.width/2 - 30,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: 'transparent',
        borderRadius: 30,
        color: '#ed7b66',
        paddingTop: 8,
        paddingLeft: 20
    },
    pauseBtn: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Util.size.width,
        height: Util.size.width * .56
    },
    resumeIcon: {
        width: 60,
        height: 60,
        position: 'absolute',
        top: 80,
        left: Util.size.width/2 - 30,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: 'transparent',
        borderRadius: 30,
        color: '#ed7b66',
        paddingTop: 8,
        paddingLeft: 20
    },
    failText: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Util.size.width,
        height: 90,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: 'transparent'
    },
    infoBox: {
        width: Util.size.width,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
        marginLeft: 10
    },
    descBox: {
        flex: 1
    },
    nickname: {
        fontSize: 18
    },
    title: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
        lineHeight: 15
    },
    replyBox: {
        width: Util.size.width,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    replyAvatar: {
        width: 40,
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20
    },
    reply: {
        flex: 1
    },
    replyNickName: {
        color: '#666'
    },
    replyContent: {
        color: '#666',
        marginTop: 4
    },
    loadingMore: {
        marginVertical: 20
    },
    loadingText: {
        color: '#777',
        textAlign: 'center'
    },
    listHeader: {
        marginTop: 10,
        width: Util.size.width
    },
    commentBox: {
        width: Util.size.width,
        marginVertical: 10,
        padding: 8,
    },
    content: {
        padding: 2,
        borderWidth: 1,
        borderColor: "#ddd",
        color: '#333',
        borderRadius: 4,
        fontSize: 14,
        height: 80
    },
    commentArea: {
        width: Util.size.width,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: '#eee',
        paddingBottom: 8
    }
});