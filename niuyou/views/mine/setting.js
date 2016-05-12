/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import Util from './../utils';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

var Setting = React.createClass({
  getInitialState: function(){
    var items = [];
    return {
      items: items,
    };
  },
  _gotoSM: function(){
    // this.props.navigator.push({
    //   title: '设置',
    //   component: Setting,
    //   navigationBarHidden:false,
    //   // backButtonTitle: "返回",
    //   // backButtonIcon: require('image!back'),
    //   leftButtonTitle: "返回",
    //   leftButtonIcon:require('image!back'),
    //   onLeftButtonPress: ()=>this.props.navigator.pop(),
    // });
  },

  render: function(){
    var items = this.state.items;

    return (
      <View style={styles.bigcontainer}>
        <ScrollView style={styles.container}>
          <View style={styles.wrapper}>
            <TouchableOpacity onPress={this._gotoSM}>
              <View style={[styles.item, {flexDirection:'row',marginTop:15,}]}>
                <Text style={[styles.font,{flex:1}]}>版本声明</Text>
                <Image style={styles.arrow} resizeMode={'contain'} source={require('./../../res/mine/ico_wo_next@3x.png')}></Image>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.item, {flexDirection:'row'}]}>
                <Text style={[styles.font,{flex:1}]}>新版本检测</Text>
                <Text style={styles.desc}>V1.1</Text>
                <Image style={styles.arrow} resizeMode={'contain'} source={require('./../../res/mine/ico_wo_next@3x.png')}></Image>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.item, {flexDirection:'row',marginTop:15,}]}>
                <Text style={[styles.font,{flex:1}]}>客服热线</Text>
                <Text style={styles.desc,{marginRight:15,color:'#399bff',}}>400-828-8686</Text>
              </View>
            </TouchableOpacity>
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
      leftButtonIcon:require('image!back'),
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
    backgroundColor:'#f9f9f9',
  },
  item:{
    height:52,
    justifyContent: 'center',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#ddd',
    backgroundColor:'#fff',
    alignItems:'center',
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
    fontSize:15,
  },
  arrow:{
    position:'absolute',
    top:20,
    right:15,
    width:6,
    height:11,
  }
});

module.exports = Setting;
