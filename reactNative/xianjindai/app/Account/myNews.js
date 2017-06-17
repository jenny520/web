/**
 * Created by zhoumeiyan on 16/12/30.
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
    TouchableOpacity,
    Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Util from '../Util/util';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Activity from './activity';
import News from './news';
import TabBar from '../common/tabBar';
export default React.createClass({
    render() {
        return <ScrollableTabView
            renderTabBar={() => <TabBar />
            }
            style={styles.container}
        >
            <Activity tabLabel="活动" navigator={this.props.navigator} user={this.props.user}/>
            <News tabLabel="消息" navigator={this.props.navigator} user={this.props.user}/>
        </ScrollableTabView>;
    },
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(232,232,232)',
    }
});