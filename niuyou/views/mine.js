/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import Util from './utils';
import Service from './service';
// import Authinfo from './mine/authinfo';
import Tasking from './mine/tasking';
import Tasked from './mine/tasked';
import Datedtask from './mine/datedtask';
import Feedback from './mine/feedback';
import Setting from './mine/setting';
import Login from './user/login';
import SelectCity from './home/selectcity';
import qiniu from 'react-native-qiniu';
qiniu.conf.ACCESS_KEY = '0cWE2Ci38evF_wbXbHSAUt-5vXMZgqN3idgyvvMy';
qiniu.conf.SECRET_KEY = '3kBcjCfTbqEVKWZttKLae_RM0zEbYc3-Q-STnXkw';

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
  TouchableOpacity,
  AsyncStorage,
  Alert,
} from 'react-native';

import CameraPicker from './mine/camerapicker';

var Mine = React.createClass({
  mixins: [Subscribable.Mixin],
  getInitialState: function(){
    return {
      sessionKey:null,
      avatar:require('./../res/mine/pic_wo_moren@3x.png'),
      nickname:'匿名',
      status:1,
      nopassResult:'',
    };
  },
  componentWillMount:function(){
    this.eventEmitter = new EventEmitter();
    this._checkSessionKey();
  },
  componentDidMount:function(){
    var that = this;
    // 登出
    this.addListenerOn(this.eventEmitter, 'logout_success',  function(args){
      console.log('logout_success');
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
    });
    // 登录
    this.addListenerOn(this.eventEmitter, 'login_success',  function(args){
      console.log('login_success');
      that._checkSessionKey();
    });

    // 开启牛友之旅后跳回到这里的处理
    this.props.navigator.navigationContext.addListener('didfocus', (event) => {
      // this.currentRoute will go away
      // event.data.route will be focused
      console.log(event.data.route);
      if(event.data.route.title == 'mine'){
        that._checkSessionKey();
      }

    });

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
        Util.get(Service.host + Service.getInfo, {}, function(data){
          console.log(data);
          // 如果成功，返回原页面，且刷新页面
          if(data.code == 200 && data.data.response.personalInfo){
            that.setState({
              avatar:{uri:data.data.response.personalInfo.photoUrl},
              nickname:data.data.response.personalInfo.name,
              status:data.data.response.personalInfo.status,
              nopassResult:data.data.response.personalInfo.nopassResult,
            });
          }else{
            that.setState({
              avatar:require('./../res/mine/pic_wo_moren@3x.png'),
              nickname:'匿名',
              status:1,
              nopassResult:'',
            });
          }
        });
      }
    });
  },
  _gotoSetting: function(){
    var that  = this;
    this.props.navigator.push({
      title: '设置',
      component: Setting,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
      passProps: {
          events: that.eventEmitter
      }
    });
  },

  _gotoLogin: function(){
    this.props.navigator.push({
      title: '登录',
      component: Login,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
      passProps: {
          events: that.eventEmitter
      }
    });
  },
  _dealRenzheng:function(){
    if(this.state.status == 1){
      this._gotoRZ();
    }else if(this.state.status == 2){
      Alert.alert(
            '提醒',
            '请的申请正在审核中, 请耐心等待',
            [
              {text: '确定', onPress: () => console.log('OK Pressed!')},
            ]
          )
    }else if(this.state.status == 3){
      Alert.alert(
            '您的资料已认证',
            '是否需要重新认证？',
            [
              {text: '取消', onPress: () => console.log('Cancel Pressed!')},
              {text: '确定', onPress: () => this._gotoRZ()},
            ]
          )
    }else if(this.state.status == 4){
      Alert.alert(
            '您的申请已被驳回',
            '驳回原因: '+this.state.noPassReason,
            [
              {text: '我知道了，重新提交', onPress: () => this._gotoRZ()},
            ]
          )
    }
  },
  _gotoRZ:function(){
    var that = this;
    AsyncStorage.getItem('city',function(err,result){
      var cityInfo = '';
      if(!err){
         cityInfo = result?result:'';
      }
      that.props.navigator.push({
        title: '请选择城市',
        component: SelectCity,
        navigationBarHidden:false,
        barTintColor:'#f9f9f9',
        // backButtonTitle: "返回",
        // backButtonIcon: require('image!back'),
        leftButtonTitle: "返回",
        leftButtonIcon:require('image!back1'),
        onLeftButtonPress: ()=>that.props.navigator.pop(),
        passProps:{
          events: that.eventEmitter,
          cityInfo:cityInfo,
          type:"renzheng",// home:首页进去的；renzheng:认证页面第一步
        }
      });
    });
  },
  _gotopicker:function(){
    var that = this;
    that.props.navigator.push({
      title: '选择最多9张生活照片',
      component: CameraPicker,
      navigationBarHidden:true,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      // leftButtonTitle: "返回",
      // leftButtonIcon:require('image!back1'),
      // onLeftButtonPress: ()=>that.props.navigator.pop(),
    });
  },
  render: function(){
    var that = this;
    if(!this.state.sessionKey){
      return <View />;
    }
    var tags = [require('./../res/mine/ico_wo_zlrz@3x.png'), require('./../res/mine/ico_wo_jxz@3x.png'), require('./../res/mine/ico_wo_ywc@3x.png'), require('./../res/mine/ico_wo_sx@3x.png'), require('./../res/mine/ico_wo_fk@3x.png')];
    var items = ['资料认证', '进行中任务', '已完成任务', '失效的任务', '意见反馈'];
    var rzdesc = '';//状态 1 未完成，2 提交审核 3 审核通过 4 审核未通过
    switch (this.state.status) {
      case 1:
        rzdesc = '未认证'; // 点击直接去认证
        break;
      case 2:
        rzdesc = '正在审核'; // 点击无效果
        break;
      case 4:
        rzdesc = '审核未通过'; // 点击提示驳回原因，并提供再次认证:nopassResult
        break;
      case 3:
        rzdesc = '已认证';// 点击重新认证
        break;
      default:
        break;
    }
    var descs = [rzdesc,'查看所有进行中任务','查看所有完成的任务','不通过和过期任务'];
    var components = [SelectCity, Tasking, Tasked, Datedtask,Feedback];
    var JSXDOM = [];
    for(var i in items){
      if(i==0){
        JSXDOM.push(
          <TouchableOpacity key={items[i]} onPress={this._dealRenzheng}>
            <View style={[styles.item, {flexDirection:'row'}]}>
              <Image style={styles.tag} resizeMode={'contain'} source={tags[i]}></Image>
              <Text style={[styles.font,{flex:1}]}>{items[i]}</Text>
              <Text style={styles.desc}>{descs[i]}</Text>
              <Image style={styles.arrow} resizeMode={'contain'} source={require('./../res/mine/ico_wo_next@3x.png')}></Image>
            </View>
          </TouchableOpacity>
        );
      }else{
        JSXDOM.push(
          <TouchableOpacity key={items[i]} onPress={this._loadPage.bind(this, components[i], items[i])}>
            <View style={[styles.item, {flexDirection:'row'}]}>
              <Image style={styles.tag} resizeMode={'contain'} source={tags[i]}></Image>
              <Text style={[styles.font,{flex:1}]}>{items[i]}</Text>
              <Text style={styles.desc}>{descs[i]}</Text>
              <Image style={styles.arrow} resizeMode={'contain'} source={require('./../res/mine/ico_wo_next@3x.png')}></Image>
            </View>
          </TouchableOpacity>
        );
      }

    }

    return (
      <View style={styles.bigcontainer}>
      <View style={styles.navigatorx}>
        <View style={styles.settingbox}>
          <TouchableOpacity onPress={this._gotoSetting} style={styles.settingb}>
            <Image resizeMode={'contain'} style={styles.setting} source={require('./../res/mine/ico_wo_setting@3x.png')}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.infos}>
            <Image resizeMode={'contain'} style={styles.avatar} source={this.state.avatar}></Image>
            <Text style={styles.avatarname}>{this.state.nickname}</Text>
        </View>
        <View style={styles.borderbottom}></View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.wrapper}>
          {JSXDOM}
        </View>
      </ScrollView>
      </View>
    );
  },

  _loadPage: function(component, title){
    this.props.navigator.push({
      title: title,
      component: component,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
    });
  },

  _clear: function(){
    this.props.navigator.pop();
    AsyncStorage.clear();
  }

});

var styles = StyleSheet.create({
  bigcontainer:{
    flex:1,
  },
  container:{
    flex:1,
  },
  navigatorx:{
    backgroundColor:'#f9f9f9',
    height:64+125,
    paddingTop:20,
    alignItems:'center',
    borderBottomWidth:0.5,
    borderBottomColor:'#ececec',
  },
  settingbox:{
    position:'absolute',
    top:0,
    right:0,
  },
  settingb:{
    paddingTop:12+20,
    paddingRight:15,
    paddingBottom:10,
    paddingLeft:10,
  },
  setting:{
    flex:1,
    width:16,
    height:16,
  },
  avatar:{
    marginTop:40,
    width:67,
    height:67,
    borderRadius:34,
  },
  avatarname:{
    marginTop:16,
    fontSize:15,
    color:'#333',
    textAlign:'center',
  },
  avater:{
    position:'absolute',
    top:10,
    left:10,
    width:22,
    height:22,
    borderRadius:11
  },
  avatername:{
    position:'absolute',
    top:15,
    left:40,
    fontSize:12,
    color:'#fff',
  },
  statusx:{
    position:'absolute',
    top:15,
    right:15,
    color:'#f0e983',
    fontSize:12,
  },
  item:{
    height:52,
    justifyContent: 'center',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#ddd',
    backgroundColor:'#fff',
    alignItems:'center',
    marginLeft:25,
  },
  font:{
    fontSize:15,
    marginLeft:15,
    marginRight:10,
  },
  wrapper:{
  },
  tag:{
    marginLeft:10,
    width:30,
    height:30,
  },
  desc:{
    textAlign:'right',
    marginRight:31,
    color:'#c0c0c0',
  },
  arrow:{
    position:'absolute',
    top:20,
    right:15,
    width:6,
    height:11,
  },
  applybtn:{
    width:Dimensions.get('window').width,
    height:68,
    borderTopWidth:0.5,
    borderTopColor:'#dfdfdf',
    backgroundColor:'#fff',
  },
  bluebtn:{
    backgroundColor:'#51a7ff',
    borderRadius:5,
    marginTop:15,
    marginLeft:15,
    marginRight:15,
    height:40,
    justifyContent:'center',
    alignItems:'center',
  },
  bluebtntext:{
    color:'#fff',
    fontSize:17,
  }
});

module.exports = Mine;
