/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import Util from './utils';
import Authinfo from './mine/authinfo';
import Tasking from './mine/tasking';
import Tasked from './mine/tasked';
import Datedtask from './mine/datedtask';
import Feedback from './mine/feedback';
import Setting from './mine/setting';
import Login from './user/login';
var ImagePickerManager = require('NativeModules').ImagePickerManager;
// import ImagePickerManager from 'react-native-image-picker';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

var Mine = React.createClass({
  getInitialState: function(){
    return {
    };
  },
  _gotoSetting: function(){
    this.props.navigator.push({
      title: '设置',
      component: Setting,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
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
    });
  },

  _uploadAvatar:function(){
    console.log('准备上传文件');
    var options = {
      title: 'Select Avatar', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      customButtons: {
        'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection]
      },
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 100, // photos only
      maxHeight: 100, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.2, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: true, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };

    /**
    * The first arg will be the options object for customization, the second is
    * your callback which sends object: response.
    *
    * See the README for info about the response
    */

    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // uri (on iOS)
        // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        // uri (on android)
        // const source = {uri: response.uri, isStatic: true};

        this.setState({
          avatarSource: source
        });
      }
    });
  },

  render: function(){
    var tags = [require('./../res/mine/ico_wo_zlrz@3x.png'), require('./../res/mine/ico_wo_jxz@3x.png'), require('./../res/mine/ico_wo_ywc@3x.png'), require('./../res/mine/ico_wo_sx@3x.png'), require('./../res/mine/ico_wo_fk@3x.png')];
    var items = ['资料认证', '进行中任务', '已完成任务', '失效的任务', '意见反馈'];
    var descs = ['未认证','查看所有进行中任务','查看所有完成的任务','不通过和过期任务'];
    var components = [Authinfo, Tasking, Tasked, Datedtask,Feedback];
    var JSXDOM = [];
    for(var i in items){
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

    return (
      <View style={styles.bigcontainer}>
      <View style={styles.navigatorx}>
        <View style={styles.settingbox}>
          <TouchableOpacity onPress={this._gotoSetting}>
            <Image resizeMode={'contain'} style={styles.setting} source={require('./../res/mine/ico_wo_setting@3x.png')}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.infos}>
          <TouchableOpacity onPress={this._uploadAvatar}>
            <Image resizeMode={'contain'} style={styles.avatar} source={require('./../res/mine/pic_wo_moren@3x.png')}></Image>
            <Text style={styles.avatarname}>林晓萌</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.borderbottom}></View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.wrapper}>
          {JSXDOM}
        </View>
        <TouchableOpacity onPress={this._gotoLogin}>
          <View style={styles.applybtn}>
            <View style={styles.bluebtn}>
              <Text style={styles.bluebtntext}>登录</Text>
            </View>
          </View>
        </TouchableOpacity>
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
    marginTop:-20,
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
    top:12+20,
    right:15,
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
