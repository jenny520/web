/**
 * Created by zhoumeiyan on 16/12/15.
 */
import React, { Component } from 'react';
import {
    WebView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ActionSheetIOS,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import Util from '../Util/util'

export default class extends Component{
    render() {
        return(
            <View style={styles.reportContainer}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    source={{uri: this.props.url}}
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