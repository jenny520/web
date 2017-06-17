/**
 * Created by zhoumeiyan on 2017/5/30.
 */
'use strict'

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import Login from '../pages/account/login'
import Slider from '../pages/slider/index'
import Boot from '../components/boot'
import Tabs from './tabs'
import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as appActions from '../actions/app'
class restartApp extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount() {
        this.props.appBooted()
    }
    render() {
        if (!this.props.booted) {
            return <Boot {...this.props}/>
        }
        if (!this.props.entered) {
            return <Slider {...this.props}/>
        }
        if (!this.props.logined) {
            return <Login {...this.props}/>
        }
        return <Tabs {...this.props}/>
    }
}

function mapStateToProps(state) {
    return {
        booted: state.get('app').booted,
        logined: state.get('app').logined,
        entered: state.get('app').entered,
        banners: state.get('app').banners
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(restartApp)