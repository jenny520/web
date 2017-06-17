/**
 * Created by zhoumeiyan on 16/12/8.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import Swiper from 'react-native-swiper';
import Util from '../utils/util';
import Button from 'react-native-button';
export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            banners: [
                require('../assets/images/s1.jpg'),
                require('../assets/images/s2.jpg'),
                require('../assets/images/s3.jpg')
            ]
        }
    }
    _enter(){
        this.props.enterSlide()
    }
    render(){
        return (
            <Swiper style={styles.container}
                dot={<View style={styles.dot}/>}
                activeDot={<View style={styles.activeDot}/>}
                paginationStyle={styles.pagination}
                loop={this.state.loop}
            >
                <View style={styles.slide}>
                    <Image style={styles.image} source={this.state.banners[0]} />
                </View>
                <View style={styles.slide}>
                    <Image style={styles.image} source={this.state.banners[1]} />
                </View>
                <View style={styles.slide}>
                    <Image style={styles.image} source={this.state.banners[2]} />
                    <Button
                        style={styles.btn}
                        onPress={this._enter.bind(this)}
                    >退出登录</Button>
                </View>
            </Swiper>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    slide: {
        flex: 1,
        width: Util.size.width
    },
    btn: {
        position: 'absolute',
        left: 10,
        bottom: 60,
        height: 50,
        width: Util.size.width - 20,
        padding: 10,
        color: '#ee735c',
        borderWidth: 2,
        borderColor: '#ee735c',
        borderRadius: 5,
        fontSize: 18,
        backgroundColor: '#ee735c',
        marginHorizontal: 10
    },
    dot: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ff6600',
        borderRadius: 7,
        width: 14,
        height: 14,
        marginLeft: 12,
        marginRight: 12
    },
    activeDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginLeft: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#ee735c',
        backgroundColor: '#ee735c',
    },
    pagination: {
        bottom: 30
    },
})