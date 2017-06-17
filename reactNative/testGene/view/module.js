/**
 * Created by zhoumeiyan on 16/9/29.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    PixelRatio,
    TouchableHighlight
} from 'react-native';
import Util from './util';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Swiper from 'react-native-swiper';
const Colors = [
    {bg: 'rgb(224,245,199)',iconBg: 'rgb(115,201,95)'},
    {bg: 'rgb(186,237,247)',iconBg: 'rgb(59,164,222)'},
    {bg: 'rgb(249,222,191)',iconBg: 'rgb(248,189,105)'},
    {bg: 'rgb(250,221,216)',iconBg: 'rgb(241,131,115)'}
];
export default class extends Component{
    render(){
        return(
            <View style={styles.container}>
                <NavigationBar
                    title={{ title: '贷课圈', tintColor: '#fff'}}
                    rightButton={<Icon name="ios-search-outline" size={20} color={'#fff'} style={styles.searchIcon}></Icon>}
                    tintColor = "rgb(90,194,124)"
                />
                <View>
                    <Swiper style={styles.wrapper} showsPagination={true} height={Util.size.width * 138 / 409}
                        dot={<View style={{backgroundColor: 'rgb(245,245,245)', width: 8, height: 8, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
                        activeDot={<View style={{backgroundColor: 'rgb(78, 187, 200)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7}} />}
                        paginationStyle={{
                            bottom: 10
                        }}
                    >
                        <View style={styles.slide}>
                            <Image source={require('../img/banner.png')} style={styles.bannerImg}/>
                        </View>
                        <View style={styles.slide}>
                            <Image source={require('../img/banner.png')} style={styles.bannerImg}/>
                        </View>
                        <View style={styles.slide}>
                            <Image source={require('../img/banner.png')} style={styles.bannerImg}/>
                        </View>
                    </Swiper>
                </View>
                <View style={styles.content}>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.moduleContainer}>
                        <View style={[styles.module,{backgroundColor: Colors[0].bg}]}>
                            <View style={[styles.moduleIcon,{backgroundColor: Colors[0].iconBg}]}>
                                <Icon style={styles.icon} name="ios-people" size={40} color="#fff"></Icon>
                            </View>
                            <View style={styles.newContainer}>
                                <Text style={styles.moduleTitle}>贷款经理</Text>
                                <Text style={styles.moduleText}>结交同城小伙伴</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.moduleContainer}>
                        <View style={[styles.module,{backgroundColor: Colors[1].bg}]}>
                            <View style={[styles.moduleIcon,{backgroundColor: Colors[1].iconBg}]}>
                                <Icon style={styles.icon} name="ios-people" size={40} color="#fff"></Icon>
                            </View>
                            <View style={styles.newContainer}>
                                <Text style={styles.moduleTitle}>快速贷款</Text>
                                <Text style={styles.moduleText}>已有1080人申请</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.moduleContainer}>
                        <View style={[styles.module,{backgroundColor: Colors[2].bg}]}>
                            <View style={[styles.moduleIcon,{backgroundColor: Colors[2].iconBg}]}>
                                <Icon style={styles.icon} name="ios-people" size={40} color="#fff"></Icon>
                            </View>
                            <View style={styles.newContainer}>
                                <Text style={styles.moduleTitle}>行业动态</Text>
                                <Text style={styles.moduleText}>最新最热行业动态</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="rgba(0,0,0,0)" style={styles.moduleContainer}>
                        <View style={[styles.module,{backgroundColor: Colors[3].bg}]}>
                            <View style={[styles.moduleIcon,{backgroundColor: Colors[3].iconBg}]}>
                                <Icon style={styles.icon} name="ios-people" size={40} color="#fff"></Icon>
                            </View>
                            <View style={styles.newContainer}>
                                <Text style={styles.moduleTitle}>明星榜</Text>
                                <Text style={styles.moduleText}>同行明星零距离接触</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        width: Util.size.width,
        height: Util.size.height
    },
    searchIcon: {
        position: 'absolute',
        right: 10,
        top: 12
    },
    header:{
        width:Util.size.width,
        paddingTop:15,
        height: 45,
        backgroundColor: 'rgb(78, 187, 200)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold'
    },
    locationIcon: {
        position: 'absolute',
        right:15,
        top:20,
        color: '#fff'
    },
    bannerImg: {
        width: Util.size.width,
        height: Util.size.width * 138 / 409
    },
    content: {
        flexDirection:'row',
        flexWrap:"wrap",
        width: Util.size.width,
        paddingLeft:5,
        paddingTop:10,
        paddingBottom: 10
    },
    moduleContainer:{
        width: 0.5*Util.size.width-5,
        height: (Util.size.height - Util.size.width * 138 / 409 - 116-10)/2,
        alignItems: 'center'
    },
    module:{
        height: (Util.size.height - Util.size.width * 138 / 409 - 116-10)/2-10,
        width: 0.5*Util.size.width-15,
        marginBottom: 10,
        backgroundColor:'rgb(224,245,199)',
        alignItems:'center',
        justifyContent: 'center'
    },
    moduleIcon: {
        width: PixelRatio.getPixelSizeForLayoutSize(30),
        height: PixelRatio.getPixelSizeForLayoutSize(30),
        borderRadius: PixelRatio.getPixelSizeForLayoutSize(30)/2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgb(115,201,95)'
    },
    newContainer: {
        alignItems: 'center'
    },
    moduleTitle: {
        padding: 10,
        fontSize: 17
    },
    moduleText: {
        color: '#878787',
        fontSize: 15
    }
});