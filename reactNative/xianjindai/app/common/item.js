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
export default class TabItem extends Component{
    constructor(props){
        super(props)
    }
    render(){
        let item = this.props.item;
        return (
            <View>
                <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={this.props.onSelect.bind(this,item)}>
                    <View style={styles.dkModule}>
                        <View style={styles.dkItem}>
                            <Image source={{uri:Util.thumb(item.plogo)}} style={styles.dkImg}/>
                            <View style={styles.dkContent}>
                                <Text style={styles.title}>{item.cname}-{item.pname}</Text>
                                <Text style={styles.text}>{item.pjianjie}</Text>
                                <View style={styles.dkNum}>
                                    <Text style={styles.num}>{item.p_appliy_num}人已申请</Text>
                                </View>
                            </View>
                            <Icon style={styles.dkArrow} name="ios-arrow-forward" size={20} />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    dkItem: {
        width: Util.size.width,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 40,
        backgroundColor: '#fff'
    },
    dkImg: {
        width: 30,
        height: 30,
        borderRadius: 10,
        marginHorizontal:10
    },
    title: {
        color: '#d81e06'
    },
    dkContent: {
        paddingRight: 20
    },
    text: {
        paddingVertical: 3,
        paddingRight: 40,
        color: '#555'
    },
    dkNum: {
        flexDirection: 'row',
        width: Util.size.width,
        alignItems: 'center'
    },
    num: {
        color:'#d81e06',
        marginRight: 5
    },
    dkArrow: {
        position: 'absolute',
        right: 10,
        top: 30,
        color: '#ccc'
    }
})