
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';
import Authinfo3 from './authinfo3';
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

var Authinfo2 = React.createClass({
  getInitialState: function(){
    var items = [];
    return {
      items: items,
    };
  },
  _gotoAuthinfo3: function(){
    this.props.navigator.push({
      title: '图片认证',
      component: Authinfo3,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
    });
  },
  render: function(){
    return (
      <View style={styles.container}>
      <ScrollView style={styles.scrollbox}>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}>请上传联系人数量照片</Text>
        </View>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian')}></Image>
              <Text style={styles.box_title_text}>示例图片</Text>
            </View>
          </View>
          <View style={styles.bz_content2}>
            <View style={styles.bbox}>
              <Image resizeMode={'contain'} style={styles.bimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
            </View>
          </View>
          <TouchableOpacity onPress={this._download}>
            <View style={styles.circle}>
              <Image resizeMode={'contain'} style={styles.circleimg} source={require('image!upload')}></Image>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.applybtn}>
        <TouchableOpacity onPress={this._gotoAuthinfo3}>
          <View style={styles.bluebtn}>
            <Text style={styles.bluebtntext}>下一步</Text>
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
  }
});

module.exports = Authinfo2;
