
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';
import Service from './../service';
import CameraPicker from './camerapicker';
import qiniu from 'react-native-qiniu';

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
window.EventEmitter = EventEmitter;
window.Subscribable = Subscribable;

import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  AsyncStorage,
  Dimensions,
} from 'react-native';

var Authinfo3 = React.createClass({
  mixins: [Subscribable.Mixin],
  getInitialState: function(){
    return {
      lifeimgs:[]
    };
  },
  componentWillMount:function(){
    this.eventEmitter = new EventEmitter();
  },
  componentDidMount:function(){
    var that = this;
    this.addListenerOn(this.eventEmitter, 'upload_imgs',  function(imgs){
      console.log('upload_imgs');
      //upload file to Qiniu
      for(var i=0;i<imgs.length;i++){
        (function(img){
          Util.get(Service.host + Service.getToken, {bucketName:'ny-personal-photo'}, function(data){
            console.log(data);
            if(data.code == 200){
              var token = data.data.response.token;
              var url = data.data.response.url;
              var key = data.data.response.key;
              qiniu.rpc.uploadImage(img, key, token, function (resp) {
                 console.log(resp);
                 console.log(url);
                 if(resp.status == 200 && resp.ok == true){
                   that.state.lifeimgs.push({uri:url});
                   that.setState({
                     lifeimgs: that.state.lifeimgs
                   });
                 }
              });
            }else{

            }
          });
        })(imgs[i])
      }
    });
  },
  _uploadImgs:function(){
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
      passProps: {
          events: that.eventEmitter
      }
    });
  },
  _submitRZ: function(){

  },
  render: function(){
    return (
      <View style={styles.container}>
      <ScrollView style={styles.scrollbox}>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}>请上传个人生活照片9张</Text>
        </View>
        <TouchableOpacity onPress={this._uploadImgs}>
          <View style={styles.circle}>
            <Image resizeMode={'contain'} style={styles.circleimg} source={require('image!upload')}></Image>
          </View>
        </TouchableOpacity>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian')}></Image>
              <Text style={styles.box_title_text}>示例证明</Text>
            </View>
          </View>
          <View style={styles.bz_content3}>
            <View style={styles.zmimgs}>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
            </View>
          </View>
        </View>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian')}></Image>
              <Text style={styles.box_title_text}>上传图片</Text>
            </View>
          </View>
          <View style={styles.bz_content3}>
            <View style={styles.uploadimgs}>
              <View style={styles.uploadimg}>
                <Image resizeMode={'contain'} style={styles.upimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
                <TouchableOpacity>
                  <Text style={styles.delimg}>删除</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.uploadimg}>
                <Image resizeMode={'contain'} style={styles.upimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
                <Text style={styles.delimg}>删除</Text>
              </View>
              <View style={styles.uploadimg}>
                <Image resizeMode={'contain'} style={styles.upimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
                <Text style={styles.delimg}>删除</Text>
              </View>
              <View style={styles.uploadimg}>
                <Image resizeMode={'contain'} style={styles.upimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
                <Text style={styles.delimg}>删除</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.applybtn}>
        <TouchableOpacity onPress={this._submitRZ}>
          <View style={styles.bluebtn}>
            <Text style={styles.bluebtntext}>提交认证</Text>
          </View>
        </TouchableOpacity>
      </View>
      </View>
    );
  },

});

var styles = StyleSheet.create({
  container:{
    flex:1,
  },
  scrollbox:{
    flex:1,
    backgroundColor:'#f9f9f9',
    marginBottom:135,
  },
  warning:{
    flex:1,
    flexDirection:'row',
    paddingLeft:15,
    paddingRight:15,
    height:44,
    backgroundColor:'#fff',
    borderBottomWidth:0.5,
    borderBottomColor:'#dfdfdf',
  },
  warningimg:{
    width:16,
    height:16,
    marginRight:4,
    marginTop:12,
  },
  warningtext:{
    marginTop:12,
    color:'#333',
    fontSize:15,
  },
  beizhu:{
    flex:1,
    backgroundColor:'#fff',
    borderBottomWidth:0.5,
    borderBottomColor:'#dfdfdf',
    marginBottom:15,
  },
  bz_header:{
    flex:1,
    height:50,
    paddingTop:20,
    paddingLeft:15,
  },
  box_title:{
    flex:1,
    flexDirection:'row',
  },
  box_title_img:{
    width:16,
    height:16,
    marginRight:4,
  },
  box_title_text:{
    color:'#333',
    fontSize:15,
  },
  bz_content:{
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
  },
  bz_content3:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
  },
  bz_content_text:{
    color:'#666',
    fontSize:15,
  },
  bbox:{
    flex:1,
    height:170,
  },
  bimg:{
    flex:1,
  },
  circle:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
    marginBottom:20,
  },
  circleimg:{
    width:60,
    height:60,
  },
  applybtn:{
    position:'absolute',
    left:0,
    bottom:68,
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
  },
  zmimgs:{
    flex:1,
    flexDirection:'row',
  },
  zmimg:{
    flex:1,
    marginRight:1,
    width:(Dimensions.get('window').width-36)/4,
    height:(Dimensions.get('window').width-36)/4,
  },
  uploadimgs:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  uploadimg:{
    flex:1,
    marginRight:2,
  },
  upimg:{
    flex:1,
    width:(Dimensions.get('window').width-36)/4,
    height:(Dimensions.get('window').width-36)/4,
  },
  delimg:{
    color:'#f02626',
    fontSize:15,
  }
});

module.exports = Authinfo3;
