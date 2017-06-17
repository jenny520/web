/**
 * Created by zhoumeiyan on 16/9/29.
 */
import React,{Component} from 'react';
import {
    AlertIOS,
    Animated,
    Image,
    NavigatorIOS,
    StyleSheet,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Util from './util';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Task from './task';
import Report from './report';
import Setting from './setting';
import Network from './network';
import Module from './module';

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
        return (
            <TouchableOpacity key={name} onPress={() => this.props.goToPage(page)} style={styles.tab}>
                <Icon name={name} size={27} color="#8bc34a" style={styles.icon}
                      ref={(icon) => { this.selectedTabIcons[page] = icon }}/>
                <Icon name={name} size={27} color='#888' style={styles.icon}
                      ref={(icon) => { this.unselectedTabIcons[page] = icon }}/>
            </TouchableOpacity>
        );
    },
    componentDidMount(){
        this.setAnimationValue({value: this.props.activeTab});
        this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
    },
    setAnimationValue({value}) {
        var currentPage = this.props.activeTab;
        this.unselectedTabIcons.forEach((icon, i) => {
            var iconRef = icon;

            if (!icon.setNativeProps && icon !== null) {
                iconRef = icon.refs.icon_image
            }

            if (value - i >= 0 && value - i <= 1) {
                iconRef.setNativeProps({ style: {opacity: value - i} });
            }
            if (i - value >= 0 &&  i - value <= 1) {
                iconRef.setNativeProps({ style: {opacity: i - value} });
            }
        });
    },
    render(){
        var containerWidth = this.props.containerWidth;
        var numberOfTabs = this.props.tabs.length;
        var tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 2,
            backgroundColor: '#8bc34a',
            bottom: 0
        };
        var left = this.props.scrollValue.interpolate({
            inputRange: [0, 1], outputRange: [0, containerWidth / numberOfTabs]
        });
        return (
            <View>
                <View style={[styles.tabs, this.props.style]}>
                    {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                </View>
                <Animated.View style={[tabUnderlineStyle, {left}]} />
            </View>
        );
    }
});
export default class extends Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <ScrollableTabView
                    renderTabBar={() => <TabBar />}
                    tabBarPosition={'bottom'}
                    scrollWithoutAnimation={true}
                >
                    <Module tabLabel="ios-albums-outline"/>
                    <Task tabLabel="ios-list-box-outline"/>
                    <Report tabLabel="ios-contact-outline"/>
                    <Network tabLabel="ios-people-outline"/>
                    <Setting tabLabel="ios-settings-outline" navigator={this.props.navigator}/>
                </ScrollableTabView>
            </View>
        )
    }
}
var styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#f5f5f5',
        width: Util.size.width,
        height: Util.size.height
    },
    tab: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingBottom: 10
    },
    tabs: {
        height: 45,
        flexDirection: 'row',
        paddingTop: 7,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        backgroundColor:"#f5f5f5"
    },
    icon: {
        position: 'absolute',
        top: 0,
        left: 27
    },
    iconContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:60
    }
});