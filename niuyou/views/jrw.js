/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import TaskDetail from './jrw/taskdetail';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import JRWTabBar from './jrw/jrwtabbar';
import Util from './utils';
import Service from './service';
import AllTask from './alltask';
import ReceiveTask from './receivetask';
import Login from './user/login';

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
window.EventEmitter = EventEmitter;
window.Subscribable = Subscribable;
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  AsyncStorage,
} from 'react-native';

var Jrw = React.createClass({
  mixins: [Subscribable.Mixin],
  getInitialState: function(){
    return {
      sessionKey: '',
      refreshReceive:0,
    };
  },
  componentWillMount:function(){
    this.eventEmitter = new EventEmitter();
  },
  componentDidMount:function(){
    var that = this;
    // 登录
    this.addListenerOn(this.eventEmitter, 'login_success',  function(args){
      console.log('login_success');
      // that._checkSessionKey();
      that.refs.receive.refresh();
    });
  },
  _gotoTaskDetail:function(id,type){
    var that = this;
    that.props.navigator.push({
      title: '任务详情',
      component: TaskDetail,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
      passProps: {
        id:id,
        type:type,
        event:that.props.event
      }
    });
  },
  _changeTab:function(item){
    console.log(item);
    if(item.i==1){
      this._checkSessionKey();
    }
  },
  _checkSessionKey:function(){
    var that = this;
    AsyncStorage.getItem('userinfo',function(err,result){
      if(!err){
        sessionKey = result&&JSON.parse(result)?JSON.parse(result).sessionKey:null;
        console.log(sessionKey);
      }else{
        sessionKey = null;
      }
      that.setState({
        sessionKey:sessionKey,
      });
      if(!sessionKey){
        that.props.navigator.push({
          title: '登录',
          component: Login,
          navigationBarHidden:false,
          // backButtonTitle: "返回",
          // backButtonIcon: require('image!back'),
          // leftButtonTitle: "返回",
          leftButtonIcon:require('image!backo'),
          // onLeftButtonPress: ()=>this.props.navigator.pop(),
          barTintColor:'#f9f9f9',
          passProps: {
              events: that.eventEmitter
          }
        });
      }else{

      }
    });
  },
  render: function(){
    return (
      <View style={styles.bigcontainer}>
      <ScrollableTabView style={styles.container} renderTabBar={() =><JRWTabBar />} onChangeTab={(item)=>this._changeTab(item)}>
        <AllTask tabLabel="所有任务" onRowPress={(id)=>{
          this._gotoTaskDetail(id,'all');
        }} />
        <ReceiveTask ref="receive" tabLabel="可接任务" refreshFlag={this.state.refreshReceive} onRowPress={(id)=>{
          this._gotoTaskDetail(id,'receive');
        }} />
      </ScrollableTabView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  bigcontainer:{
    flex:1,
    paddingTop:20,
    backgroundColor:'#f9f9f9',
  },
  container:{
    flex:1,
    backgroundColor:'#fff',
  },
});


module.exports = Jrw;
