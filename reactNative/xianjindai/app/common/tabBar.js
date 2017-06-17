/**
 * Created by zhoumeiyan on 17/2/22.
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
//import ScrollableTabView from 'react-native-scrollable-tab-view';

const TabBar = React.createClass({
    selectedTabIcons: [],
    unselectedTabIcons: [],
    propTypes:{
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array
    },
    renderTabOption(name, page){
        var isTabActive = this.props.activeTab === page;
        const color = isTabActive ? 'rgb(84,136,220)' : '#666'
        return (
            <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)} style={styles.tab}>
                <Text style={[styles.text,{color: color}]}>{name}</Text>
            </TouchableOpacity>
        );
    },
    componentDidMount(){
        //this.setAnimationValue({value: this.props.activeTab});
        this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
    },
    setAnimationValue({value}) {
        //var currentPage = this.props.activeTab;
        //this.unselectedTabIcons.forEach((icon, i) => {
        //    var iconRef = icon;
        //
        //    if (!icon.setNativeProps && icon !== null) {
        //        iconRef = icon.refs.icon_image
        //    }
        //
        //    if (value - i >= 0 && value - i <= 1) {
        //        iconRef.setNativeProps({ style: {opacity: value - i} });
        //    }
        //    if (i - value >= 0 &&  i - value <= 1) {
        //        iconRef.setNativeProps({ style: {opacity: i - value} });
        //    }
        //});
    },
    render(){
        var containerWidth = this.props.containerWidth;
        var numberOfTabs = this.props.tabs.length;
        var tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs / 2,
            height: 2,
            backgroundColor: 'rgb(84,136,220)',
            bottom: 0
        };
        var left = this.props.scrollValue.interpolate({
            inputRange: [0, 1], outputRange: [containerWidth / numberOfTabs / 4, containerWidth / numberOfTabs * 5 /4]
        });
        return (
            <View>
                <View style={[styles.tabs, this.props.style]}>
                    {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                    <View style={styles.line}></View>
                </View>
                <Animated.View style={[tabUnderlineStyle, {left}]} />
            </View>
        );
    }
});
const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        backgroundColor: '#fff'
    },
    tabs: {
        height: 45,
        flexDirection: 'row',
        //paddingTop: 5,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    text: {
        fontSize: 14
    },
    line: {
        width: 0.5,
        height: 25,
        position: 'absolute',
        left: Util.size.width * 0.5,
        top: 10,
        backgroundColor: '#666'
    }
})

export default TabBar;