/**
 * Created by zhoumeiyan on 17/1/22.
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
        this.state = {
            setting: ''
        }
    }
    componentDidMount(){
        Util.get('http://api.jinrongsudi.com/index.php/Api/System/get_system',{
                appid: 1
            })
            .then((data) => {
                console.log(data)
                if(data && data.list){
                    this.setState({
                        setting: data.list
                    })
                }
            })
    }
    render() {
        let setting = this.state.setting;
        return(
            <View style={styles.reportContainer}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    source={{uri: setting.app_zhengxin_address}}
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
        height: Util.size.height,
        marginTop: -64
    },
    loadingMore: {
        height: Util.size.height,
        justifyContent: 'center',
        alignItems: 'center'
    }
})