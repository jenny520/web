/**
 * Created by zhoumeiyan on 16/9/29.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import Util from './util';
import Swiper from 'react-native-swiper';
const singSource = [
    {
        title: '复活',
        author: '乔任梁 · Pin.K拼',
        imgSrc: '../img/cavatars.png'
    },
    {
        title: '冻结',
        author: '林俊杰 · 乐行者',
        imgSrc: '../img/javatars.png'
    },
    {
        title: '丑八怪 + 给我一个吻(kiss)',
        author: '薛之谦/万妮达 · 中国新歌声第一季总决赛',
        imgSrc: '../img/xavatars.png'
    },
    {
        title: '(眼,鼻,嘴)',
        author: '王振振 · 周美美',
        imgSrc: '../img/yavatars.png'
    },
    {
        title: '第一课',
        author: 'Tfboys · 2016年开学第一课',
        imgSrc: '../img/davatars.png'
    }

];
const hotSource = [
    {
        title: '编辑推荐 | Billboard榜登顶的嘻哈热单盘',
        num: '200.7万'
    },
    {
        title: '话语 | 重温经典 聆听逝去的时光',
        num: '301.2万'
    },
    {
        title: '欧美 | 一听就沉沦的氛围男声',
        num: '203.9万'
    },
    {
        title: '韩语 | 收获民谣中的小确幸',
        num: '180.6万'
    },
    {
        title: '走心旋律,寂寞的时候还有音乐相伴',
        num: '186.6万'
    },
    {
        title: '把梦扯开,就是林夕',
        num: '320.3万'
    }
]
export default class extends Component{
    constructor(){
        super();
    }
    render(){
        return(
            <View style={styles.container}>
                <NavigationBar
                    title={{ title: '音乐馆', tintColor: '#fff'}}
                    leftButton= {<Icon name="ios-menu-outline" size={20} color={'#fff'} style={styles.menuIcon}></Icon>}
                    rightButton={<Icon name="ios-search-outline" size={20} color={'#fff'} style={styles.searchIcon}></Icon>}
                    tintColor = "rgb(90,194,124)"
                />
                <ScrollView style={styles.scrollContent}>
                    <View style={styles.container}>
                        <Swiper style={styles.wrapper} autoplay={true} showsPagination={true} height={Util.size.width * 138 / 409}
                                dot={<View style={{backgroundColor: 'rgba(245,245,245,.8)', width: 8, height: 8, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
                                activeDot={<View style={{backgroundColor: 'rgb(255,255,255)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7}} />}
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
                    <View style={styles.nav}>
                        <View style={styles.navItem}>
                            <Icon name="ios-people" size={40} color={'rgb(119,202,252)'} style={styles.navIcon}></Icon>
                            <Text style={styles.navText}>歌手</Text>
                        </View>
                        <View style={styles.navItem}>
                            <Icon name="ios-keypad" size={30} color={'rgb(119,202,252)'} style={styles.navIcon}></Icon>
                            <Text style={styles.navText}>分类</Text>
                        </View>
                        <View style={styles.navItem}>
                            <Icon name="ios-basketball" size={32} color={'rgb(119,202,252)'} style={styles.navIcon}></Icon>
                            <Text style={styles.navText}>专辑</Text>
                        </View>
                    </View>
                    <TouchableHighlight  underlayColor="#f1f1f1">
                        <View style={styles.commend}>
                            <Image source={require('../img/avatars.png')} style={styles.avatarsImg}/>
                            <View style={styles.commentText}>
                                <Text style={styles.commentTitle}>揪心!  听完这首歌就去唱给前任</Text>
                                <Text style={styles.commentDes}>喜欢这首歌的,都是有故事的人</Text>
                            </View>
                            <Icon name="ios-arrow-forward" size={20} style={styles.arrow} color="#888"></Icon>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.newSing}>
                        <TouchableHighlight  underlayColor="#f1f1f1">
                            <View style={styles.newTitle}>
                                <Text style={styles.titleText}>新歌速递</Text>
                                <View style={styles.newIcon}>
                                    <Icon name="ios-arrow-forward" size={20} style={styles.rightArrow} color="#888"></Icon>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <View style={styles.newContainer}>
                            <TouchableHighlight underlayColor="#f1f1f1" style={styles.newContent}>
                                <View style={styles.newItem}>
                                    <Image source={require('../img/desImg.png')} style={styles.newImg}/>
                                    <Text style={styles.newText}>听吉他暖男唱诉温柔情歌</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="#f1f1f1" style={styles.newContent}>
                                <View style={styles.newItem}>
                                    <Image source={require('../img/desImg.png')} style={styles.newImg}/>
                                    <Text style={styles.newText}>香港创作才女惊艳来袭</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="#f1f1f1" style={styles.newContent}>
                                <View style={styles.newItem}>
                                    <Image source={require('../img/desImg.png')} style={styles.newImg}/>
                                    <Text style={styles.newText}>《你的名字。》动画电影原声热播</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.newComment}>
                        <TouchableHighlight  underlayColor="#f1f1f1">
                            <View style={styles.newTitle}>
                                <Text style={styles.titleText}>每日为你推荐(30首)</Text>
                                <View style={styles.newIcon}>
                                    <Icon name="ios-arrow-forward" size={20} style={styles.rightArrow} color="#888"></Icon>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <View>
                            {
                                singSource.map((source,index) => {
                                    if(index < 2){
                                        return (
                                            <View style={styles.commend} key={source.title}>
                                                <Image source={require('../img/cavatars.png')} style={styles.avatarsImg}/>
                                                <View style={styles.commentText}>
                                                    <Text style={styles.commentTitle}>{source.title}</Text>
                                                    <Text style={styles.commentDes}>{source.author}</Text>
                                                </View>
                                                <Icon name="ios-arrow-forward" size={20} style={styles.arrow} color="#888"></Icon>
                                            </View>
                                        )
                                    }else {
                                        return (
                                            <View style={[styles.commend,{backgroundColor: '#fff'}]} key={source.title}>
                                                <Image source={require('../img/javatars.png')} style={styles.avatarsImg}/>
                                                <View style={styles.commentText}>
                                                    <Text style={styles.commentTitle}>{source.title}</Text>
                                                    <Text style={styles.commentDes}>{source.author}</Text>
                                                </View>
                                                <Icon name="ios-arrow-forward" size={20} style={styles.arrow} color="#888"></Icon>
                                            </View>
                                        )
                                    }
                                })
                            }
                        </View>
                    </View>
                    <View style={styles.newSing}>
                        <TouchableHighlight  underlayColor="#f1f1f1">
                            <View style={styles.newTitle}>
                                <Text style={styles.titleText}>热门歌单</Text>
                                <View style={styles.newIcon}>
                                    <Icon name="ios-arrow-forward" size={20} style={styles.rightArrow} color="#888"></Icon>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <View style={[styles.newContainer,{backgroundColor:'rgb(244,244,244)'}]}>
                            {
                                hotSource.map((source,index) => {
                                    return(
                                        <TouchableHighlight underlayColor="#f1f1f1" style={styles.newContent} key={"hot"+index}>
                                            <View style={styles.newItem}>
                                                <Image source={require('../img/desImg.png')} style={styles.newImg}>
                                                    <View style={styles.singQuantity}>
                                                        <View style={styles.playNum}>
                                                            <Icon name="ios-musical-notes" size={18} color="#eee" style={styles.playIcon}></Icon>
                                                            <Text style={styles.numText}>{source.num}</Text>
                                                        </View>
                                                        <View style={styles.btnPlay}>
                                                            <Icon name="ios-play" size={15} color="#333"></Icon>
                                                        </View>
                                                    </View>
                                                </Image>
                                                <Text style={styles.newText}>{source.title}</Text>
                                            </View>
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <View style={styles.columnContainer}>
                        <TouchableHighlight  underlayColor="#f1f1f1">
                            <View style={styles.newTitle}>
                                <Text style={styles.titleText}>专栏</Text>
                                <View style={styles.newIcon}>
                                    <Icon name="ios-arrow-forward" size={20} style={styles.rightArrow} color="#888"></Icon>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <View style={styles.newContainer}>
                            <TouchableHighlight underlayColor="#f1f1f1" style={[styles.columnContent,{alignItems: 'flex-start'}]}>
                                <View style={styles.columnItem}>
                                    <Image source={require('../img/columnImg.png')} style={styles.columnImg}/>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="#f1f1f1" style={styles.columnContent}>
                                <View style={styles.columnItem}>
                                    <Image source={require('../img/columnImg1.png')} style={styles.columnImg}/>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor="#f1f1f1" style={[styles.columnContent,styles.columnBContent]}>
                                <View style={[styles.columnItem,styles.columnBItem]}>
                                    <Image source={require('../img/columnImg2.png')} style={styles.columnBImg}/>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.newSing}>
                        <TouchableHighlight  underlayColor="#f1f1f1">
                            <View style={styles.newTitle}>
                                <Text style={styles.titleText}>热门歌单</Text>
                                <View style={styles.newIcon}>
                                    <Icon name="ios-arrow-forward" size={20} style={styles.rightArrow} color="#888"></Icon>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <View style={[styles.newContainer,{backgroundColor:'rgb(244,244,244)'}]}>
                            {
                                hotSource.map((source,index) => {
                                    return(
                                        <TouchableHighlight underlayColor="#f1f1f1" style={styles.newContent} key={"hot"+index}>
                                            <View style={styles.newItem}>
                                                <Image source={require('../img/desImg.png')} style={styles.newImg}>
                                                    <View style={styles.singQuantity}>
                                                        <View style={styles.playNum}>
                                                            <Icon name="ios-musical-notes" size={18} color="#eee" style={styles.playIcon}></Icon>
                                                            <Text style={styles.numText}>{source.num}</Text>
                                                        </View>
                                                        <View style={styles.btnPlay}>
                                                            <Icon name="ios-play" size={15} color="#333"></Icon>
                                                        </View>
                                                    </View>
                                                </Image>
                                                <Text style={styles.newText}>{source.title}</Text>
                                            </View>
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContent: {
        width: Util.size.width,
        height: Util.size.height - 145,
        backgroundColor:'#fff'
    },
    menuIcon: {
        position: 'absolute',
        left: 10,
        top: 11
    },
    searchIcon: {
        position: 'absolute',
        right: 10,
        top: 11
    },
    bannerImg: {
        width: Util.size.width,
        height: Util.size.width * 138 / 409
    },
    nav: {
        backgroundColor: 'rgb(241,250,252)',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 15,
        paddingBottom: 15
    },
    navItem: {
        width: Util.size.width / 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navText: {
        fontSize: 20,
        marginLeft: 10
    },
    commend: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    commentText: {
        marginLeft: 10
    },
    commentTitle: {
        lineHeight: 24,
        fontSize: 16
    },
    commentDes: {
        color: '#888'
    },
    arrow: {
        position: 'absolute',
        right: 10,
        top: 25,
    },
    newSing: {
        backgroundColor: 'rgb(246,251,254)'
    },
    newTitle: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 16
    },
    newIcon: {
        position: 'absolute',
        right: 10,
        top:18,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#888',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightArrow: {
        marginTop:2,
    },
    newContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 5,
        paddingRight: 5
    },
    newContent: {
        width: (Util.size.width-10) / 3,
        height: 164
    },
    newItem: {
        width: (Util.size.width-10) / 3,
        alignItems:'center',
        justifyContent: 'center'
    },
    newImg: {
        width: (Util.size.width-10) / 3-6
    },
    newText: {
        lineHeight: 18,
        marginTop: 3,
        marginBottom: 3,
        fontSize: 12
    },
    newComment: {
        backgroundColor: 'rgb(254,251,250)'
    },
    singQuantity: {
        backgroundColor: 'rgba(0,0,0,.2)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 28,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
    playNum: {
        paddingLeft: 14
    },
    playIcon: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    numText: {
        color: '#fff',
        marginTop:1
    },
    btnPlay: {
        width: 20,
        height: 20,
        borderRadius: 20,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#fff'
    },
    columnContainer: {
        backgroundColor: 'rgb(245,250,253)'
    },
    columnContent: {
        width: 0.5*Util.size.width - 5,
        alignItems: 'flex-end',
        height: (0.5*Util.size.width-7.5)*73/188+7.5
    },
    columnItem: {
        width: 0.5*Util.size.width-7.5,
        alignItems: 'center',
    },
    columnBItem: {
        width: Util.size.width - 10
    },
    columnImg: {
        width: 0.5*Util.size.width-7.5,
    },
    columnBContent: {
        width: Util.size.width - 10,
        height: (Util.size.width - 10)*154/386+10
    },
    columnBImg: {
        width: Util.size.width - 10
    }
});