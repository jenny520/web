/**
 * Created by zhoumeiyan on 17/1/23.
 */
import React, { Component } from 'react';
import {
    WebView,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    ActivityIndicator
} from 'react-native';
import Util from '../Util/util';
export default class extends Component{
    constructor(props){
        super(props)
    }
    render() {
        return(
            <View style={styles.reportContainer}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    source={{uri: 'http://ask.jinrongsudi.com/index.php/Home/Huodong/testGiveMeMoney'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    startInLoadingState={true}
                    scalesPageToFit={false}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    reportContainer:{
        width: Util.size.width,
        backgroundColor:'#f5f5f5',
        height: Util.size.height
    }
})