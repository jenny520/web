/**
 * Created by zhoumeiyan on 16/12/30.
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
import H5Info from '../common/h5Info';
import ActiveItem from '../common/activeItem';

export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            news: [],
            loading: true
        }
    }
    componentDidMount(){
        Util.get('http://api.jinrongsudi.com/index.php/Api/Message/get_activity')
            .then((data) => {
                console.log(data)
                if(data && data.list){
                    this.setState({
                        news: data.list,
                        loading: false
                    })
                }else{
                    this.setState({
                        loading: false
                    })
                }
            })
    }
    _loadPush(item){
        let user = this.props.user;
        this.props.navigator.push({
            component: H5Info,
            title: item.hname,
            navigationBarHidden: true,
            passProps: {
                url: item.h5href,
                item,
                user,
                title:item.hname
            }
        })
    }
    render(){
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
                                this.state.news.length > 0 ?
                                    <View style={styles.newsBox}>
                                        {
                                            this.state.news.map((item) => {
                                                return (
                                                    <ActiveItem
                                                        item={item}
                                                        onSelect={(item) => {this._loadPush(item)}}
                                                        key={item.hid}
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
                                            <Text style={styles.text}>您还没有消息</Text>
                                        </View>
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
        backgroundColor: 'rgb(232,232,232)',
        alignItems: 'center',
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
    newsBox: {
        marginTop: 8,
        backgroundColor: '#fff'
    }
})