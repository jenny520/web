/**
 * Created by zhoumeiyan on 16/12/21.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    AlertIOS,
    TouchableHighlight,
    Modal,
    TouchableOpacity,
    Animated,
    ScrollView
} from 'react-native';
import Button from 'react-native-button';
import Util from '../Util/util';
import Icon from 'react-native-vector-icons/Ionicons';

//import FacebookTabBar from './FacebookTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Credit from './credit';
import Card from './card';
import TabBar from '../common/tabBar';
export default class extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <ScrollableTabView
            renderTabBar={() => <TabBar />}
        >
            <Card tabLabel="贷款" navigator={this.props.navigator} user={this.props.user}/>
            <Credit tabLabel="信用卡" navigator={this.props.navigator}/>
        </ScrollableTabView>;
    }
}
