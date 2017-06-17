/**
 * Created by zhoumeiyan on 16/9/29.
 */
import React,{Component} from 'react';
import {
    ActionSheetIOS,
    NavigatorIOS,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    WebView,
    Image
} from 'react-native';
import Util from './util';
import Icon from 'react-native-vector-icons/Ionicons';
class Reset extends Component{
    render(){
        return (
            <View>
                <Text>Reset</Text>
            </View>
        )
    }
}
class About extends Component{
    render() {
        return(
            <View style={styles.aboutContainer}>
                <Text style={styles.aboutText}>Gene is ...</Text>
            </View>
        )
    }
}
class Help extends Component{
    render() {
        return(
            <WebView
                automaticallyAdjustContentInsets={false}
                source={{uri: 'https://github.com/facebook/react-native'}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                startInLoadingState={true}
                style={{marginTop:60}}
            />
        )
    }
}
export default class extends Component{
    _onResetPress(){
        this.props.navigator.push({
            title:"Change Password",
            tintColor:'#f5f5f5',
            barTintColor:'#8bc34a',
            titleTextColor:'#fff',
            component: Reset
        });
    }
    _onHelpPress() {
        this.props.navigator.push({
            title:"Help Center",
            tintColor:'#f5f5f5',
            barTintColor:'#8bc34a',
            titleTextColor:'#fff',
            component: Help,
        });
    }
    _onSharePress() {
        ActionSheetIOS.showShareActionSheetWithOptions({
                url: "http://gene.city.edu.hk",
                message: "Gene Sequencing Analysis"
            },
            (error) => console.log(error),
            (success, method) => {
            }
        );
    }
    _onAboutPress() {
        this.props.navigator.push({
            title:"About Gene",
            tintColor:'#f5f5f5',
            barTintColor:'#8bc34a',
            titleTextColor:'#fff',
            component: About
        });
    }
    render(){
        return (
            <View style={styles.container}>
                <View>
                    <Image source={require('../img/login.png')} style={styles.cardImg}/>
                </View>
                <ScrollView style={styles.settingContainer}>
                    <View style={styles.setting}>
                        <TouchableHighlight  underlayColor="#f1f1f1" style={styles.userMenuContainer} onPress={() => this._onResetPress()}>
                            <View style={styles.userMenu}>
                                <Icon style={styles.itemNavIcon} name="ios-lock-outline" size={20}></Icon>
                                <Text>Change password</Text>
                                <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20}></Icon>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight  underlayColor="#f1f1f1" style={styles.userMenuContainer} onPress={() => this._onHelpPress()}>
                            <View style={styles.userMenu}>
                                <Icon style={styles.itemNavIcon} name="ios-help-circle-outline" size={20}></Icon>
                                <Text>Help center</Text>
                                <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20}></Icon>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight  underlayColor="#f1f1f1" style={styles.userMenuContainer} onPress={() => this._onSharePress()}>
                            <View style={styles.userMenu}>
                                <Icon style={styles.itemNavIcon} name="ios-share-outline" size={20}></Icon>
                                <Text>Share this app</Text>
                                <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20}></Icon>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight  underlayColor="#f1f1f1" style={styles.userMenuContainer} onPress={() => this._onAboutPress()}>
                            <View style={styles.userMenu}>
                                <Icon style={styles.itemNavIcon} name="ios-information-circle-outline" size={20}></Icon>
                                <Text>About Gene</Text>
                                <Icon style={styles.itemNavMenu} name="ios-arrow-forward" size={20}></Icon>
                            </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f5f5f5',
        width: Util.size.width,
        height: Util.size.height
    },
    cardImg: {
        width: Util.size.width,
        height: 100
    },
    settingContainer:{
        width: Util.size.width,
        height: Util.size.height - 145,
        backgroundColor:'#fff'
    },
    setting:{
        paddingTop:10,
        paddingBottom:70
    },
    tabTitle:{
        paddingLeft:10,
        marginBottom:10
    },
    itemNavMenu:{
        position:"absolute",
        top:12,
        right:20,
        color: "#bbb",
        backgroundColor:"transparent"
    },
    userMenuContainer:{
        height:45,
        borderTopWidth: Util.pixel,
        borderTopColor:"#bbb",
        borderBottomWidth: Util.pixel,
        borderBottomColor:"#bbb",
        backgroundColor:"#fff",
        flex:1,
        marginBottom:20,
    },
    userMenu:{
        paddingLeft:50,
        paddingRight:50,
        height:45,
        justifyContent:'center'
    },
    itemNavIcon:{
        position:"absolute",
        top:12,
        left:20,
        color: "#454545",
        backgroundColor:"transparent"
    }
});