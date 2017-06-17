/**
 * Created by zhoumeiyan on 16/9/29.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import Util from './util';
export default class extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>report</Text>
            </View>
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
});