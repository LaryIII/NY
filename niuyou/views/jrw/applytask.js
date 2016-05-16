
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';

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

var ApplyTask = React.createClass({
  getInitialState: function(){
    var items = [];
    return {
      items: items,
    };
  },
  _copy:function(){

  },
  _download:function(){

  },
  render: function(){
    return (
      <ScrollView style={styles.container}>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}>1,请下载所有图片至手机相册!</Text>
        </View>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian')}></Image>
              <Text style={styles.box_title_text}>图片</Text>
            </View>
          </View>
          <View style={styles.bz_content2}>
            <View style={styles.bbox}>
              <Image resizeMode={'contain'} style={styles.bimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
            </View>
            <View style={styles.sbox}>
              <Image resizeMode={'contain'} style={styles.simg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
              <Image resizeMode={'contain'} style={styles.simg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
            </View>
          </View>
          <TouchableOpacity onPress={this._download}>
            <View style={styles.circle}>
              <Image resizeMode={'contain'} style={styles.circleimg} source={require('image!download')}></Image>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}>2,请复制文字并与图片一起发送至朋友圈</Text>
        </View>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!text')}></Image>
              <Text style={styles.box_title_text}>文字</Text>
            </View>
          </View>
          <View style={styles.bz_content}>
            <Text style={styles.bz_content_text}>
              {'\t'}此次任务要求发送指定的文字 和图片至朋友圈，时间不少于2小时，此次任务要求发送指定的文字和图片至朋友圈，时间不少于2小时。
            </Text>
          </View>
          <TouchableOpacity onPress={this._copy}>
            <View style={styles.circle}>
              <Image resizeMode={'contain'} style={styles.circleimg} source={require('image!copy')}></Image>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  },

});

var styles = StyleSheet.create({
  container:{
    flex:1,
    marginBottom:40,
  },
  warning:{
    flex:1,
    flexDirection:'row',
    paddingLeft:15,
    paddingRight:15,
    height:44,
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
  bz_content2:{
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
    flex:3,
    height:170,
  },
  sbox:{
    flex:1,
    flexDirection:'column',
    justifyContent:'space-around',
    height:170,
  },
  bimg:{
    flex:1,
    width:(Dimensions.get('window').width-40)*3/4,
  },
  simg:{
    flex:1,
    width:(Dimensions.get('window').width-40)*1/4,
  },
  circle:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:20,
  },
  circleimg:{
    width:60,
    height:60,
  }
});

module.exports = ApplyTask;
