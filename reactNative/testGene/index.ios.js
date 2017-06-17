/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    NavigatorIOS
} from 'react-native';
import Util from './view/util';
import MainView from './view/main';
class testGene extends Component{
    render(){
        return(
            <NavigatorIOS
                ref="nav"
                style={styles.container}
                initialRoute={{
                    title: 'main',
                    component: MainView,
                    navigationBarHidden: true,
                    backButtonTitle: 'back',
                    shadowHidden: true,
                    tintColor:'#f5f5f5',
                    barTintColor:'#8bc34a',
                    titleTextColor:'#fff'
                }}
            />
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        width: Util.size.width,
        height: Util.size.height
    }
})
AppRegistry.registerComponent('testGene', () => testGene);
