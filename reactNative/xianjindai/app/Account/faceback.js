/**
 * Created by zhoumeiyan on 16/12/15.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Image,
    TextInput,
    StatusBar
} from 'react-native';
import Util from '../Util/util';
import Icon from 'react-native-vector-icons/Ionicons';
import icons from '../assets/Icon'
import NavigationBar from 'react-native-navbar';
import Button from 'react-native-button';
import Toast, {DURATION} from 'react-native-easy-toast'

export default class extends Component{
    constructor(props){
        super(props)
        this.state = {
            content: ''
        }
    }
    _submit(){
        let mobile = this.props.user.mobile;
        let name = this.props.user.name;
        let content = this.state.content;
        let body = new FormData();
        body.append('mobile',mobile);
        body.append('name',name);
        body.append('content',content);
        Util.upload(body,'http://api.jinrongsudi.com/index.php/Api/Message/add_callBack',(response) => {
            if(response && response.flag){
                this.refs.toast.show('修改成功');
            }
        })
    }
    render(){
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#fff"
                    barStyle="light-content"
                />
                <View style={styles.comment}>
                    <TextInput
                        placeholder="问题描述的越详细,我们就越快解决哦"
                        style={styles.content}
                        multiline={true}
                        defaultValue={this.state.content}
                        onChangeText={(text) => {
                            this.setState({
                                content: text
                            })
                        }}
                    />
                    <Button containerStyle={styles.submitBtn}
                            style={{fontSize: 16,color: '#fff'}} onPress={this._submit.bind(this)}>提交</Button>
                </View>
                <Toast
                    ref="toast"
                    position='top'
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(237,237,237)',
    },
    leftArrow: {
        position: 'absolute',
        left: 10,
        top: 12
    },
    content: {
        padding: 5,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        color: '#333',
        borderRadius: 4,
        fontSize: 14,
        height: 100,
        backgroundColor: '#fff'
    },
    submitBtn: {
        width: Util.size.width - 20,
        marginVertical: 15,
        padding:8,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: 'rgb(84,136,220)',
        borderRadius: 5,
        backgroundColor: 'rgb(84,136,220)'
    }
})