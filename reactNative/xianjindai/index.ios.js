/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TabBarIOS,
    Navigator,
    NavigatorIOS,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';
import icons from './app/assets/Icon';
import Index from './app/Index/test';
import List from './app/List/test';
import Account from './app/Account/test';
import Util from './app/Util/util';
export default class xianjindai extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedTab: 'videoTab',
            user: ''
        }
    }
    componentDidMount(){
        AsyncStorage.getItem('user')
            .then((data) => {
                let user,newState = '';
                if(data){
                    user = JSON.parse(data);
                }
                if(user){
                    this.setState({
                        user: user
                    })
                }
            })
        Util.get('http://api.jinrongsudi.com/index.php/Api/System/get_system',{
                appid: 2
            })
            .then((data) => {
                AsyncStorage.setItem('up',data.list.app_is_up)
            })
    }
    render() {
        return (
            <TabBarIOS tintColor="rgb(81,137,221)">
                <TabBarIOS.Item
                    icon={{uri: icons.home, scale: 2.6}}
                    title="首页"
                    selected={this.state.selectedTab === 'videoTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'videoTab',
                        });
                    }}
                >

                    <Index user={this.state.user} setting={this.state.setting}/>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    icon={{uri: icons.list, scale: 2.4}}
                    title="贷款"
                    selected={this.state.selectedTab === 'recordTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'recordTab',
                        });
                    }}
                >
                    <List user={this.state.user}/>
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    icon={{uri: icons.account, scale: 2.6}}
                    title="我的"
                    selected={this.state.selectedTab === 'moreTab'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'moreTab',
                        });
                    }}
                >
                    <Account user={this.state.user} setting={this.state.setting}/>
                </TabBarIOS.Item>
            </TabBarIOS>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    loadingMore: {
        height: Util.size.height,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

AppRegistry.registerComponent('xianjindai', () => xianjindai);
