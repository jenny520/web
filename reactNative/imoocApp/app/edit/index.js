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
    ProgressViewIOS,
    Modal,
    AlertIOS,
    TextInput
} from 'react-native';
import Util from '../utils/util';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Request from '../common/request';
import Config from '../common/config';
import _ from 'lodash';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import * as Progress from 'react-native-progress';
import Button from 'react-native-button';
var CountDownText = require('react-native-sk-countdown').CountDownText;
const videoOptions = {
    title: '选择视频',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '录制 10 秒视频',
    chooseFromLibraryButtonTitle: '选择已有视频',
    videoQuality: 'medium',
    mediaType: 'video',
    durationLimit: 20,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
const defaultState = {
    // video player
    rate: 1,
    muted: true,
    resizeMode: 'contain',
    repeat: false,
    // video loads
    videoProgress: 0.01,
    videoTotal: 0,
    currentTime: 0,
    videoReady: false,
    playing: false,
    paused: false,
    videoOk: true,
    previewVideo: null,
    //count down
    counting: false,
    recording: false,
    // video upload
    video: null,
    videoUploaded: false,
    videoUploading: false,
    videoUploadedProgress: 0.01,
    //audio
    audio: null,
    recordDone: false,
    audioUploadedProgress: 0.14,
    audioPath: AudioUtils.DocumentDirectoryPath + '/' + 'gougou.aac',
    audioPlaying: false,
    audioUploading: false,
    audioId: null,
    videoId: null,
    //发布音频
    modalVisible: false,
    title: '',
    publishProgress: 0.2,
    publishing: false,
    willPublish: false,

}
export default class extends Component{
    constructor(props){
        super(props)
        let user = this.props.user || {};
        let state = _.clone(defaultState);
        state.user = user;
        this.state = state;
    }
    prepareRecordingPath(audioPath){
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "High",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }
    _preview(){
        if(this.state.audioPlaying){
            AudioRecorder.stopRecording();
        }
        this.setState({
            videoProgress: 0,
            audioPlaying: true,
        })
        AudioRecorder.playRecording();
        this.refs.videoPlayer.seek(0);
    }
    _uploadAudio(){
        console.log(this.state.audioUploading)
        let folder = 'audio';
        let tags = 'app,audio';
        let timestamp = Date.now()
        this._getToken({
            type: 'audio',
            cloud: 'cloudinary',
            timestamp: timestamp
        })
        .then((data) => {
            if(data && data.success){
                let signature = data.data.token;
                let key = data.data.key;
                let body = new FormData();
                body.append('folder',folder);
                body.append('signature',signature);
                body.append('tags',tags);
                body.append('api_key',Config.cloudinary.api_key);
                body.append('resource_type','video');
                body.append('file',{
                    type: 'video/mp4',
                    uri: this.state.audioPath,
                    name: key
                });
                body.append('timestamp',timestamp);
                this._upload(body,'audio')
            }
        })
        .catch((error) => {
            console.log(error);
        })

    }
    _initAudio(){
        let audioPath = this.state.audioPath;
        this.prepareRecordingPath(audioPath);
        AudioRecorder.onProgress = (data) => {
            this.setState({currentTime: Math.floor(data.currentTime)});
        };
        AudioRecorder.onFinished = (data) => {
            this.setState({finished: data.finished});
        };
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
        this._initAudio()
    }
    _onLoadStart(){
        console.log('onLoadStart');
    }
    _onLoad(){
        console.log('onLoad');
    }
    _onProgress(data){
        if(!this.state.videoReady){
            this.setState({
                videoPlay: true
            })
        }
        let duration = data.playableDuration;
        let currentTime = data.currentTime;
        let percent = Number((currentTime / duration).toFixed(2));
        let newState = {
            videoTotal: duration,
            currentTime: Number(currentTime.toFixed(2)),
            videoProgress: percent
        };
        if(!this.state.videoReady){
            newState.videoReady = true
        }
        if(!this.state.playing){
            newState.playing = true
        }
        this.setState(newState)

    }
    _onEnd(){
        if(this.state.recording){
            AudioRecorder.stopRecording();
            this.setState({
                videoProgress: 1,
                playing: false,
                recording: false,
                recordDone: true
            })
        }
        console.log('onEnd');
    }
    _onError(error){
        this.setState({
            videoOk: false
        })
        console.log(error);
    }
    _replay(){
        this.refs.videoPlayer.seek(0);
    }
    _pause(){
        if(!this.state.paused){
            this.setState({
                paused: true
            })
        }else if(this.state.paused){
            this.setState({
                paused: false
            })
        }
    }
    _getToken(body){
        body.accessToken = this.state.user.accessToken;
        let signatureURL = Config.api.base + Config.api.signature;
        return Request.post(signatureURL,body)
            .catch((error) => {
                console.log(error);
            })
    }
    _pickVideo(){
        let that = this;
        ImagePicker.showImagePicker(videoOptions, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                return;
            }
            let uri = response.uri;
            let state = _.clone(defaultState);
            state.previewVideo = uri;
            state.user = that.state.user;
            that.setState(state)
            that._getToken({
                type: 'video',
                cloud: 'qiniu'
            })
                .then((data) => {
                    let token = data.data.token;
                    let key = data.data.key;
                    let body = new FormData();
                    body.append('token',token);
                    body.append('key',key);
                    body.append('file',{
                        type: 'video/mp4',
                        uri: uri,
                        name: key
                    });
                    that._upload(body,'video')
                })
                .catch((error) => {
                    console.log(error);
                    AlertIOS.alert('上传出错')
                })
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
    _upload(body,type){
        let xhr = new XMLHttpRequest();
        let url = Config.qiniu.upload;
        if(type == 'audio'){
            url = Config.cloudinary.video
        }
        let state = {};
        state[type+'UploadedProgress'] = 0;
        state[type+'Uploading'] = true;
        state[type+'Uploaded'] = false;
        this.setState(state)
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
                let state = {};
                state[type] = response;
                state[type+'Uploading'] = false;
                state[type+'Uploaded'] = true;
                this.setState(state)
                let updateURL = Config.api.base + Config.api[type];
                let accessToken = this.state.user.accessToken;
                let updateBody = {
                    accessToken
                }
                if(type === 'audio'){
                    updateBody.videoId = this.state.videoId
                }
                updateBody[type] = response;
                Request.post(updateURL,updateBody)
                    .catch(err => {
                        console.log(err)
                        if(type == 'video'){
                            AlertIOS.alert('视频同步出错,请重新上传')
                        }else if(type == 'audio'){
                            AlertIOS.alert('录音同步出错,请重新上传')
                        }

                    })
                    .then(data => {
                        if(data && data.success){
                            var mediaState = {};
                            mediaState[type+'Id'] = data.data;
                            if(type === 'audio'){
                                this._showModal()
                                console.log('audio====>')
                                mediaState.willPublish = true
                            }
                            this.setState(mediaState)
                        }else{
                            if(type == 'video'){
                                AlertIOS.alert('视频同步出错,请重新上传')
                            }else if(type == 'audio'){
                                AlertIOS.alert('录音同步出错,请重新上传')
                            }
                        }
                    })


            }
        }
        if(xhr.upload){
            xhr.upload.onprogress = (event) => {
                if(event.lengthComputable){
                    let percent = Number((event.loaded / event.total).toFixed(2));
                    let progressState = {};
                    progressState[type+'UploadedProgress'] = percent;
                    this.setState(progressState)
                }
            }
        }
        xhr.send(body)
    }
    _asyncUser(isAvatar){
        let user = this.state.user;
        if(user && user.accessToken){
            let url = Config.api.base + Config.api.update;
            Request.post(url,user)
                .then((data) => {
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
    _record(){
        this.setState({
            counting: false,
            recording: true,
            videoProgress: 0,
            recordDone: false
        })
        AudioRecorder.startRecording();
        this.refs.videoPlayer.seek(0)
    }
    _counting(){
        if(!this.state.counting && !this.state.recording && !this.state.audioPlaying){
            this.setState({
                counting: true
            })
            this.refs.videoPlayer.seek(this.state.videoTotal - 0.01)
        }
    }
    _closeModal(){
        this.setState({
            modalVisible: false
        })
    }
    _showModal(){
        this.setState({
            modalVisible: true
        })
    }
    _submit(){
        this._closeModal()
        let body = {
            title: this.state.title,
            videoId: this.state.videoId,
            audioId: this.state.audioId
        }
        let that = this;
        let creationURL = Config.api.base + Config.api.creations;
        let user = this.state.user;
        if(user && user.accessToken){
            body.accessToken = user.accessToken
            this.setState({
                publishing: true
            })
            Request.post(creationURL,body)
                .then((data) => {
                    if(data && data.success){
                        that._closeModal()
                        AlertIOS.alert('视频发布成功')
                        let state = _.clone(defaultState)
                        that.setState(state)
                        console.log(that.state)
                    }else{
                        this.setState({
                            publishing: false
                        })
                        AlertIOS.alert('视频发布失败')
                    }
                })
                .catch((err) => {
                    console.log(err)
                    AlertIOS.alert('视频发布失败')
                })
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.toolBar}>
                    <Text style={styles.toolBarTitle}>
                    {
                        this.state.previewVideo ? '开始配音' : '理解狗狗从配音开始'
                    }
                    </Text>
                    {
                        this.state.previewVideo && this.state.videoUploaded ?
                        <TouchableOpacity style={styles.toolBarExtra} onPress={this._pickVideo.bind(this)}>
                            <Text style={styles.toolBarEdit}>更换视频</Text>
                        </TouchableOpacity>:
                        null
                    }

                </View>
                <View style={styles.page}>
                    {
                        this.state.previewVideo ?
                        <View style={styles.videoContainer}>
                            <View style={styles.videoBox}>
                                <Video
                                    ref="videoPlayer"
                                    source={{uri: this.state.previewVideo}}
                                    style={styles.video}
                                    volume={5}
                                    paused={this.state.paused}
                                    rate={this.state.rate}
                                    muted={this.state.muted}
                                    resizeMode={this.state.resizeMode}
                                    repeat={this.state.repeat}
                                    onLoadStart={this._onLoadStart.bind(this)}
                                    onLoad={this._onLoad.bind(this)}
                                    onProgress={this._onProgress.bind(this)}
                                    onEnd={this._onEnd.bind(this)}
                                    onError={this._onError.bind(this)}
                                />
                                {
                                    !this.state.videoUploaded && this.state.videoUploading ?
                                        <View style={styles.progressTipBox}>
                                            <ProgressViewIOS style={styles.progressBar}
                                                 progressTintColor="#ee735c"
                                                 progress={this.state.videoUploadedProgress} />
                                            <Text style={styles.progressTip}>正在生成静音视频,已完成{(this.state.videoUploadedProgress * 100).toFixed(2)}%</Text>
                                        </View>:
                                        null

                                }
                                {
                                    this.state.recording || this.state.audioPlaying?
                                        <View style={styles.progressTipBox}>
                                            <ProgressViewIOS style={styles.progressBar}
                                                             progressTintColor="#ee735c"
                                                             progress={this.state.videoProgress} />
                                            {
                                                this.state.recording ?
                                                    <Text style={styles.progressTip}>
                                                        正在录制声音中
                                                    </Text>:
                                                    null
                                            }

                                        </View>:
                                        null
                                }
                                {
                                    this.state.recordDone ?
                                        <View style={styles.previewBox}>
                                            <Icon name="ios-play" style={styles.previewIcon}/>
                                            <TouchableOpacity onPress={this._preview.bind(this)}>
                                                <Text style={styles.previewText}>预览</Text>
                                            </TouchableOpacity>
                                        </View>:
                                        null
                                }
                            </View>
                        </View>:
                        <TouchableOpacity style={styles.uploadContainer} onPress={this._pickVideo.bind(this)}>
                            <View style={styles.uploadBox}>
                                <Image source={require('../assets/images/record.png')} style={styles.uploadIcon}/>
                                <Text style={styles.uploadTitle}>点我上传视频</Text>
                                <Text style={styles.uploadDesc}>建议时长不超过20秒</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    {
                        this.state.videoUploaded ?
                            <View style={styles.recordBox}>
                                <View style={[styles.recordIconBox,(this.state.recording || this.state.audioPlaying) && styles.recordOn]}>
                                    {
                                        this.state.counting && !this.state.recording?
                                            <CountDownText
                                                style={styles.countBtn}
                                                countType='seconds' // 计时类型：seconds / date
                                                auto={true} // 自动开始
                                                afterEnd={this._record.bind(this)} // 结束回调
                                                timeLeft={3} // 正向计时 时间起点为0秒
                                                step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                                                startText='准备录制' // 开始的文本
                                                endText='Go' // 结束的文本
                                                intervalText={(sec) => {return sec === 0 ? 'Go' : sec}} // 定时的文本回调
                                            />:
                                            <TouchableOpacity onPress={this._counting.bind(this)}>
                                                <Icon name="ios-mic" style={styles.recordIcon}/>
                                            </TouchableOpacity>
                                    }

                                </View>
                            </View>:
                            null
                    }
                    {
                        this.state.videoUploaded && this.state.recordDone ?
                            <View style={styles.uploadAudioBox}>
                                {
                                    !this.state.audioUploaded && !this.state.audioUploading?
                                        <TouchableOpacity onPress={this._uploadAudio.bind(this)}>
                                            <Text style={styles.uploadAudioText}>下一步</Text>
                                        </TouchableOpacity>
                                        : null
                                }
                                {
                                    this.state.audioUploading ?
                                        <Progress.Circle
                                            size={60}
                                            showsText={true}
                                            color="#ee735c"
                                            progress={this.state.audioUploadedProgress}
                                        />:null
                                }
                            </View>: null
                    }
                </View>
                <Modal
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={this._closeModal.bind(this)} style={styles.closeView}>
                            <Icon name="ios-close-outline" size={28} style={styles.closeIcon}/>
                        </TouchableOpacity>
                        {
                            this.state.audioUploaded && !this.state.publishing ?
                                <View style={styles.fieldBox}>
                                    <TextInput
                                        placeholder={'给狗狗一个宣言'}
                                        style={styles.inputField}
                                        autoCapitalize={'none'}
                                        autoCorrect={false}
                                        defaultValue={this.state.title}
                                        onChangeText={(text) => {
                                            this.setState({
                                                title: text
                                            })
                                        }}
                                    />
                                </View>:null

                        }
                        {
                            this.state.publishing ?
                                <View style={styles.loadingBox}>
                                    <Text style={styles.loadingText}>耐心等一下,拼命为您生成专属视频中...</Text>
                                    {
                                        this.state.willPublish ?
                                            <Text style={styles.loadingText}>正在合成视频音频...</Text>:null
                                    }
                                    {
                                        this.state.publishProgress > 0.3 ?
                                            <Text style={styles.loadingText}>开始上传喽...</Text>:null
                                    }
                                    <Progress.Circle
                                        size={60}
                                        showsText={true}
                                        color="#ee735c"
                                        progress={this.state.publishProgress}
                                    />
                                </View>:null
                        }
                        {
                            this.state.audioUploaded && !this.state.publishing ?
                                <Button
                                    style={styles.btn}
                                    onPress={this._submit.bind(this)}
                                >保存资料</Button>:null
                        }
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    page: {
        flex:1,
        alignItems: 'center',
    },
    uploadContainer: {
        marginTop: 90,
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ee735c',
        // justifyContent: 'center',
        borderRadius: 6,
        width: Util.size.width - 40,
        marginHorizontal: 20,
    },
    uploadBox: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadTitle: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
        color: '#000'
    },
    uploadDesc: {
        color: '#999',
        textAlign: 'center',
        fontSize: 12
    },
    uploadIcon: {
        width:110,
        resizeMode: 'contain',
    },
    videoContainer: {
        width: Util.size.width,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    videoBox: {
        width: Util.size.width,
        height: 0.6 * Util.size.width
    },
    video: {
        width: Util.size.width,
        height: 0.6 * Util.size.width,
        backgroundColor: '#333'
    },
    progressTipBox: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: Util.size.width,
        height: 30,
        backgroundColor: 'rgba(244,244,244,0.65)'
    },
    progressTip: {
        color: '#333',
        padding: 5,
        width: Util.size.width - 10
    },
    progressBar: {
        width: Util.size.width
    },
    recordBox: {
        width: Util.size.width,
        height: 60,
        alignItems: 'center',
    },
    recordIconBox: {
        width: 68,
        height: 68,
        marginTop: -30,
        borderRadius: 34,
        borderWidth: 1,
        backgroundColor: '#ee735c',
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    recordIcon: {
        backgroundColor: 'transparent',
        fontSize: 58,
        color: '#fff'
    },
    countBtn: {
        fontSize: 32,
        fontWeight: "600",
        color: '#fff'
    },
    recordOn: {
        backgroundColor: '#ccc'
    },
    previewBox: {
        width: 80,
        height: 30,
        position: 'absolute',
        right: 10,
        bottom: 10,
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    previewIcon: {
        marginRight: 5,
        fontSize: 20,
        color: '#ee735c',
        backgroundColor: 'transparent'
    },
    previewText: {
        fontSize: 20,
        color: "#ee735c",
        backgroundColor: 'transparent',
        marginRight: 5
    },
    uploadAudioBox: {
        width: Util.size.width,
        height:60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    uploadAudioText: {
        width: Util.size.width - 20,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 30,
        color: '#ee735c'
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
    },
    closeIcon: {
        color: '#fff',
        fontSize: 30,
        backgroundColor: 'transparent'
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
    inputField: {
        height: 36,
        textAlign: 'center',
        color: '#666',
        fontSize: 14
    },
    modalContainer: {
        width: Util.size.width,
        height: Util.size.height,
        paddingTop: 50,
        backgroundColor: '#fff'
    },
    loadingBox: {
        width: Util.size.width,
        marginTop: 10,
        padding: 15,
        alignItems: 'center'
    },
    loadingText: {
        marginBottom: 10,
        textAlign: 'center',
        color: '#333'
    },
    fieldBox: {
        width: Util.size.width - 40,
        height: 36,
        marginTop: 30,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    loadingProgress: {
        marginTop: 10
    }
});