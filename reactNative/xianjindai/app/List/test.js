/**
 * Created by zhoumeiyan on 16/12/19.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    NavigatorIOS,
    StyleSheet
} from 'react-native';

import MovieList from './index';
import Icon from 'react-native-vector-icons/Ionicons';

export default class extends Component {
    render() {
        return (
            <NavigatorIOS
                style={styles.container}
                initialRoute={{
                     title: '',
                     component: MovieList,
                     navigationBarHidden: true
                }}
                barTintColor={'rgb(84,136,220)'}
                tintColor={'#fff'}
                titleTextColor={'#fff'}
                translucent={false}
            />
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(237,237,237)'
    },
})