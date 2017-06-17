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
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import icons from '../assets/Icon';
import Util from '../Util/util';
export default class extends Component{
    render(){
        let item = this.props.item;
        return (
            <TouchableHighlight underlayColor="rgba(34, 26, 38, 0.1)" onPress={this.props.onSelect.bind(this,item)}>
                <View style={styles.newsItem} >
                    <View style={styles.newsTitle}>
                        <Text style={styles.title}>
                            {item.hname}
                        </Text>
                        <Text style={styles.subTitle}>
                            {item.hintro}
                        </Text>
                        <Icon style={styles.arrow} name="ios-arrow-forward" size={20} />
                    </View>
                    <View style={styles.addTimeBox}>
                        <Text style={styles.addTime}>
                            {Util.formatTime('yy-mm-dd hh:mm:ss',item.h_add_time)}
                        </Text>
                        {
                            item.hpic?
                                <Image source={{uri:Util.thumb(item.hpic)}} style={styles.img}/>:
                                null
                        }
                        <Text style={styles.time}>
                            {Util.formatTime('yy-mm-dd hh:mm',item.h_start_time)}至{Util.formatTime('yy-mm-dd hh:mm',item.h_end_time)}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}
const styles = StyleSheet.create({
    newsItem: {
        width: Util.size.width,
        paddingHorizontal: 10
    },
    title: {
        fontSize: 14,
        lineHeight: 30
    },
    subTitle: {
        fontSize: 13,
        color: '#666'
    },
    img: {
        width: Util.size.width - 20,
        height: 200
    },
    addTime: {
        paddingVertical: 5
    },
    time: {
        paddingVertical: 5
    },
    arrow: {
        position:'absolute',
        top: 5,
        right: 0
    }
})