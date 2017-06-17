import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TabBarIOS,
    Navigator,
    AsyncStorage,
    AlertIOS,
    ActivityIndicator
} from 'react-native';
import Util from './app/utils/util';
import Icon from 'react-native-vector-icons/Ionicons';
import List from './app/creation/index';
import Edit from './app/edit/index';
import Account from './app/account/index';
import Login from './app/account/login';
import Slider from './app/account/slider'

class gougouApp extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 'videoTab',
      logined: false,
      user: '',
      booted: false,
      enter: false
    }
  }
  componentDidMount(){
    this._asyncAppStatus()
  }
  _asyncAppStatus(){
    AsyncStorage.multiGet(['user','entered'])
        .then((data) => {
          let userData = data[0][1];
          let enterData = data[1][1];
          let user,newState = {
            booted: true
          };
          if(userData){
            user = JSON.parse(userData);
          }
          if(user && user.accessToken){
            newState.user = user;
            newState.logined = true;
          }else{
            newState.logined = false;
          }
          if (entered === 'yes') {
            newState.entered = true
          }
          this.setState(newState)
        })
  }
  _afterLogin(user){
    let that = this;
    user = JSON.stringify(user);
    AsyncStorage.setItem('user',user)
        .then((data) => {
          that.setState({
            logined: true,
            user: user
          })
        })
  }
  _logout(){
    AsyncStorage.removeItem('user')
    this.setState({
      logined: false,
      user: null
    })
  }
  enterSlide(){
    this.setState({
      entered: true
    },() => {
      AsyncStorage.setItem('entered', 'yes')
      AlertIOS.alert('进入 App')
    })
  }
  render() {
    if(!this.state.booted){
      return (
          <View style={styles.bootPage}>
            <ActivityIndicator color="#ee735c"/>
          </View>
      )
    }
    if(!this.state.entered){
      return <Slider enterSlide = {this.enterSlide.bind(this)}/>
    }
    if(!this.state.logined){
      return <Login afterLogin={this._afterLogin.bind(this)}/>
    }
    return (
        <TabBarIOS tintColor="#ee735c">
          <Icon.TabBarItem
              title="Home"
              iconName="ios-videocam-outline"
              selectedIconName="ios-videocam"
              selected={this.state.selectedTab === 'videoTab'}
              onPress={() => {
                        this.setState({
                          selectedTab: 'videoTab',
                        });
                    }}>
            <Navigator
                initialRoute={{ name: 'list', component: List }}
                configureScene={(route, routeStack) =>
                            Navigator.SceneConfigs.FloatFromRight
                        }
                renderScene={(route, navigator) => {
                            var Component = route.component;
                            return <Component {...route.params} navigator={navigator}/>
                        }}
            />
          </Icon.TabBarItem>
          <Icon.TabBarItem
              title="Home"
              iconName="ios-recording-outline"
              selectedIconName="ios-recording"
              selected={this.state.selectedTab === 'recordTab'}
              onPress={() => {
                        this.setState({
                          selectedTab: 'recordTab',
                        });
                    }}>
            <Edit user={this.state.user}/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
              title="Home"
              iconName="ios-more-outline"
              selectedIconName="ios-more"
              selected={this.state.selectedTab === 'moreTab'}
              onPress={() => {
                        this.setState({
                          selectedTab: 'moreTab',
                        });
                    }}>
            <Account logout={this._logout.bind(this)} user={this.state.user}/>
          </Icon.TabBarItem>
        </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  bootPage: {
    width: Util.size.width,
    height: Util.size.height,
    backgroundColor: '#fff',
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('gougouApp', () => gougouApp);