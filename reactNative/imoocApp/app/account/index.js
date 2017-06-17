/**
 * Created by zhoumeiyan on 16/10/15.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage,
    AlertIOS,
    Modal,
    TextInput
} from 'react-native';

import Util from '../utils/util';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import Request from '../common/request';
import Config from '../common/config';
import sha1 from 'sha1';
import * as Progress from 'react-native-progress';
import Button from 'react-native-button';

const photoOptions = {
    title: '选择头像',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    quality: 0.75,
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: this.props.user || {},
            avatarProgress: 0,
            avatarUploading: false,
            modalVisible: false
        }
    }
    componentDidMount(){
        AsyncStorage.getItem('user')
            .then((data) => {
                let user,newState = {};
                if(data){
                    user = JSON.parse(data);
                }
                if(user && user.accessToken){
                    this.setState({
                        user: user
                    })
                }
            })
    }
    _getQiniuToken(){
        let accessToken = this.state.user.accessToken;
        let signatureURL = Config.api.base + Config.api.signature;
        return Request.post(signatureURL,{
                accessToken,
                cloud: 'qiniu',
                type: 'avatar'
            })
            .catch((error) => {
                console.log(error);
            })
    }
    _pickPhoto(){
        let that = this;
        ImagePicker.showImagePicker(photoOptions, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                return;
            }
            let avatarData = 'data:image/jpeg;base64,' + response.data;
            //let user = that.state.user;
            //user.avatar = avatarData;
            //that.setState({
            //    user
            //});

            let uri = response.uri;
            that._getQiniuToken()
                .then((data) => {
                    let token = data.data.token;
                    let key = data.data.key;
                    let body = new FormData();
                    body.append('token',token);
                    body.append('key',key);
                    body.append('file',{
                        type: 'image/jpeg',
                        uri: uri,
                        name: key
                    });
                    that._upload(body)
                })
                .catch((error) => {
                    console.log(error);
                })
            //Request.post(signatureURL,{
            //    accessToken,
            //    timestamp,
            //    type: 'avatar',
            //    key
            //})
            //.then((data) => {
            //    if(data && data.success){
            //        signature = data.data
            //        let body = new FormData();
            //        body.append('folder',folder);
            //        body.append('signature',signature);
            //        body.append('tags',tags);
            //        body.append('api_key',Config.cloudinary.api_key);
            //        body.append('resource_type','image');
            //        body.append('file',avatarData);
            //        body.append('timestamp',timestamp);
            //        that._upload(body)
            //    }
            //})
            //.catch((error) => {
            //    console.log(error);
            //})
            //else if (response.error) {
            //    console.log('ImagePicker Error: ', response.error);
            //}
            //else if (response.customButton) {
            //    console.log('User tapped custom button: ', response.customButton);
            //}
            //else {
            //    // You can display the image using either data...
            //    const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
            //
            //    // or a reference to the platform specific asset location
            //    if (Platform.OS === 'ios') {
            //        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
            //    } else {
            //        const source = {uri: response.uri, isStatic: true};
            //    }
            //    let user = this.state.user;
            //    user.avatar = source.uri;
            //    this.setState({
            //        user: user
            //    });
            //}
        });
    }
    avatar(id,type){
        if(id.indexOf('http') > -1){
            return id;
        }else if(id.indexOf('data:image') > -1){
            return id;
        }
        else if(id.indexOf('avatar/') > -1){
            return Config.cloudinary.base + '/' + type + '/upload/' + id;
        }
        return 'http://ogmarwah3.bkt.clouddn.com/'+id;
    }
    _upload(body){
        let xhr = new XMLHttpRequest();
        let url = Config.qiniu.upload;
        this.setState({
            avatarUploading: true,
            avatarProgress: 0
        })
        xhr.open('POST',url)
        xhr.onload = () => {
            if(xhr.status !== 200){
                AlertIOS.alert('请求失败')
                console.log(xhr.responseText);
                return ;
            }
            if(!xhr.responseText){
                AlertIOS.alert('请求失败')
                return ;
            }
            let response;
            try {
                response = JSON.parse(xhr.responseText);
            }catch(e){
                console.log(e);
                console.log('parse fail')
            }
            if(response){
                let user = this.state.user;
                if(response.public_id){
                    user.avatar = response.public_id;
                }else if(response.key){
                    user.avatar = response.key;
                }
                this.setState({
                    user:user,
                    avatarProgress: 0,
                    avatarUploading: false
                })
                this._asyncUser(true)
            }
        }
        if(xhr.upload){
            xhr.upload.onprogress = (event) => {
                if(event.lengthComputable){
                    let percent = Number((event.loaded / event.total).toFixed(2));
                    this.setState({
                        avatarProgress: percent
                    })
                }
            }
        }
        xhr.send(body)
    }
    _asyncUser(isAvatar){
        let user = this.state.user;
        if(user && user.accessToken){
            let url = Config.api.base + Config.api.update;
            console.log(url,user);
            Request.post(url,user)
            .then((data) => {
                console.log(data);
                if(data && data.success){
                    let user = data.data;
                    if(isAvatar){
                        AlertIOS.alert('更新成功');
                    }
                    this.setState({
                        user:user
                    },function(){
                        this._closeModal()
                        AsyncStorage.setItem('user',JSON.stringify(user))
                    })
                }
            })
        }
    }
    _edit(){
        this.setState({
            modalVisible: true
        })
    }
    _closeModal(){
        this.setState({
            modalVisible: false
        })
    }
    _changeUserState(key,value){
        let user = this.state.user;
        user[key] = value;
        this.setState({
            user:user
        })
    }
    _save(){
        this._asyncUser()
    }
    _logout(){
        this.props.logout()
    }
    render(){
        let user = this.state.user;
        return (
            <View style={styles.container}>
                <View style={styles.toolBar}>
                    <Text style={styles.toolBarTitle}>我的帐户</Text>
                    <TouchableOpacity style={styles.toolBarExtra} onPress={this._edit.bind(this)}>
                        <Text style={styles.toolBarEdit}>编辑</Text>
                    </TouchableOpacity>
                </View>
                {
                    user.avatar ?
                        <TouchableOpacity style={styles.avatarContainer} onPress={this._pickPhoto.bind(this)}>
                            <Image source={{uri: this.avatar(user.avatar,'image')}} style={styles.avatarContainer}>
                                <View style={styles.avatarBox}>
                                    {
                                        this.state.avatarUploading ?
                                            <Progress.Circle
                                                size={75}
                                                showsText={true}
                                                color="#ee735c"
                                                indeterminate={true}
                                                progress={this.state.avatarProgress}
                                            /> :
                                            <Image source={{uri: this.avatar(user.avatar,'image')}} style={styles.avatar}/>
                                    }
                                    <Text style={styles.avatarTip}>点击切换头像</Text>
                                </View>
                            </Image>
                        </TouchableOpacity> :
                        <TouchableOpacity style={styles.avatarContainer}>
                            <Text style={styles.avatarTip}>添加头像</Text>
                            <View style={styles.avatarBox}>
                                {
                                    this.state.avatarUploading ?
                                        <Progress.Circle
                                            size={75}
                                            showsText={true}
                                            color="#ee735c"
                                            indeterminate={true}
                                            progress={this.state.avatarProgress}
                                        /> :
                                        <Icon name="ios-cloud-upload-outline" style={styles.plusIcon}/>
                                }
                            </View>
                        </TouchableOpacity>
                }
                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={this._closeModal.bind(this)} style={styles.closeView}>
                            <Icon name="ios-close-outline" size={28} style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>昵称</Text>
                            <TextInput
                                placeholder={'输入你的昵称'}
                                style={styles.inputField}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                defaultValue={user.nickname}
                                onChangeText={(text) => {
                                    this._changeUserState('nickname',text)
                                }}
                            />
                        </View>
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>品种</Text>
                            <TextInput
                                placeholder={'狗狗的品种'}
                                style={styles.inputField}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                defaultValue={user.breed}
                                onChangeText={(text) => {
                                    this._changeUserState('breed',text)
                                }}
                            />
                        </View>
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>年龄</Text>
                            <TextInput
                                placeholder={'狗狗的年龄'}
                                style={styles.inputField}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                defaultValue={user.age}
                                onChangeText={(text) => {
                                    this._changeUserState('age',text)
                                }}
                            />
                        </View>
                        <View style={styles.fieldItem}>
                            <Text style={styles.label}>性别</Text>
                            <Icon.Button  name="ios-paw-outline" style={[styles.gender,user.gender === 'male' && styles.genderChecked]} onPress={() => {
                                this._changeUserState('gender','male')
                            }}>男
                            </Icon.Button>
                            <Icon.Button  name="ios-paw" style={[styles.gender,user.gender === 'female' && styles.genderChecked]} onPress={() => {
                                this._changeUserState('gender','female')
                            }}>女
                            </Icon.Button>
                        </View>
                        <Button
                            style={styles.btn}
                            onPress={this._save.bind(this)}
                        >保存资料</Button>
                    </View>
                </Modal>
                <Button
                    style={styles.btn}
                    onPress={this._logout.bind(this)}
                >退出登录</Button>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    toolBar: {
        flexDirection: 'row',
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#ee735c'
    },
    toolBarTitle: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: "600"
    },
    toolBarExtra: {
        position: 'absolute',
        top: 28,
        right: 10,
    },
    toolBarEdit: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    avatarContainer: {
        width: Util.size.width,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#666'
    },
    avatarBox: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    plusIcon: {
        padding: 20,
        paddingLeft: 25,
        paddingRight: 25,
        color: '#999',
        fontSize: 24,
        backgroundColor: '#fff',
        borderRadius: 8
    },
    avatarTip: {
        color: '#fff',
        backgroundColor: 'transparent',
        fontSize: 14
    },
    avatar: {
        marginBottom: 15,
        width: Util.size.width * 0.2,
        height: Util.size.width * 0.2,
        resizeMode: 'cover',
        borderRadius: Util.size.width * 0.1,
        borderColor: '#ccc',
        borderWidth: 1
    },
    modalContainer: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff'
    },
    fieldItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#eee',
        borderBottomWidth: 1,
        height: 50,
        paddingLeft: 15,
        paddingRight: 15
    },
    label: {
        color: '#ccc',
        marginRight: 10
    },
    inputField: {
        height: 50,
        flex: 1,
        color: '#666',
        fontSize: 14
    },
    closeView: {
        position: 'absolute',
        width: 30,
        height: 30,
        top: 30,
        right: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ee735c'
    },
    closeIcon: {
        color: '#fff',
        fontSize: 30,
        backgroundColor: 'transparent'
    },
    gender: {
        backgroundColor: '#ccc'
    },
    genderChecked: {
        backgroundColor: '#ee735c'
    },
    btn: {
        marginTop: 10,
        padding: 10,
        color: '#ee735c',
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 5,
        backgroundColor: 'transparent',
        marginHorizontal: 10
    }
});