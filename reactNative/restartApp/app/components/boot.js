/**
 * Created by zhoumeiyan on 2017/6/3.
 */
'use strict'

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react'

import {
    StyleSheet,
    View,
    Dimensions,
    ActivityIndicator
} from 'react-native'

// 第二点，对于这种不变的变量，我们全部使用 const
//const width = Dimensions.get('window').width;
//const height = Dimensions.get('window').height;
const {width, heigth} = Dimensions.get('window');

const Boot = () => {
    <View style={styles.bootPage}>
        <ActivityIndicator color="#ee735c"/>
    </View>
}
const styles = StyleSheet.create({
    bootPage: {
        width: width,
        height: height,
        backgroundColor: '#fff',
        justifyContent: 'center'
    }
})
export default Boot;
