/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import TaskDetail from './jrw/taskdetail';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

var Jrw = React.createClass({
  getInitialState: function(){
    var items = [];
    return {
      items: items,
    };
  },
  _gotoTaskDetail: function(){
    this.props.navigator.push({
      title: '任务详情',
      component: TaskDetail,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
    });
  },
  render: function(){
    var items = this.state.items;

    return (
      <View style={styles.bigcontainer}>
      <View style={styles.navigatorx}>
        <View style={styles.tabs}>
          <View style={styles.placeholder}></View>
          <View style={styles.btn}>
            <Text>所有任务</Text>
            <View style={styles.btnborder}></View>
          </View>
          <View style={styles.btn}>
            <Text>可接任务</Text>
            <View style={styles.btnborder}></View>
          </View>
          <View style={styles.placeholder}></View>
        </View>
        <View style={styles.borderbottom}></View>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.tasklist}>
          <View>
            <TouchableOpacity onPress={this._gotoTaskDetail}>
              <View style={styles.item}>
                <Image resizeMode={'contain'} style={styles.itemimg} source={require('./../res/home/banner.jpg')}></Image>
                <View style={styles.itemtext}>
                  <Image resizeMode={'contain'} style={styles.avater} source={require('./../res/paihang/ico_ph_nv@3x.png')}></Image>
                  <Text style={styles.avatername}>窦窦</Text>
                  <Text style={styles.statusx}>发布了任务</Text>
                  <Text style={styles.itemtitle}>丽江一米阳光宾馆照片转发朋友圈任务</Text>
                  <Text style={styles.itemprice}>30元/次  性别限制:女</Text>
                  <Text style={styles.itemdesc}>地区限制:南京/上海/北京/深圳</Text>
                  <Text style={styles.itemdesc}>2016-03-15 18:00</Text>
                  <Text style={styles.itemnum}>已接受任务自媒体：<Text style={styles.em}>132人</Text></Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </View>
    );
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
  itemRow:{
    flexDirection:'row',
    marginBottom:20,
  },
  banner:{
    flex:1,
    borderRadius:4,
  },
  wrapper: {
    height:180,
  },
  slide1: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    borderRadius:4,
    marginTop:15,
    marginLeft:15,
    marginRight:15,
    marginBottom:15,
    height:180,
  },
  slide2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
    borderRadius:4,
    marginTop:15,
    marginLeft:15,
    marginRight:15,
    marginBottom:15,
    height:180,
  },
  slide3: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
    borderRadius:4,
    marginTop:15,
    marginLeft:15,
    marginRight:15,
    marginBottom:15,
    height:180,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  tasklist:{
    marginTop:15,
    marginLeft:15,
    marginRight:15,
    marginBottom:15,
  },
  tasktitlebox:{
    flex:1,
  },
  titleline:{
    flex:1,
    color:'#c0c0c0',
    textAlign:'center',
    fontSize:12
  },
  item:{
    flex:1,
    height:180,
    marginTop:15,
    alignItems:'center',
  },
  itemtext:{
    position:'absolute',
    top:0,
    left:0,
    backgroundColor:'rgba(0,0,0,0)',
    width:Dimensions.get('window').width-30,
    height:180,
    alignItems:'center',
  },
  itemimg:{
    flex:1,
    borderRadius:4,
  },
  itemtitle:{
    fontSize:15,
    color:'#fff',
    textAlign:'center',
    marginTop:50,
    fontWeight:'bold',
  },
  itemprice:{
    fontSize:12,
    color:'#fff',
    textAlign:'center',
    marginTop:10,
  },
  itemdesc:{
    fontSize:12,
    color:'#fff',
    textAlign:'center',
    marginTop:5,
  },
  itemnum:{
    fontSize:12,
    color:'#fff',
    textAlign:'center',
    marginTop:25,
  },
  em:{
    color:'#f0e983',
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
  navigatorx:{
    backgroundColor:'#f9f9f9',
    height:64,
    paddingTop:20,
  },
  tabs:{
    flexDirection:'row',
    height:44,
    backgroundColor:'#f9f9f9',
  },
  borderbottom:{
    backgroundColor:'#ececec',
    height:0.5,
  },
  placeholder:{
    flex:1,
  },
  btn:{
    flex:1,
    width:82,
    justifyContent:'center',
    alignItems:'center',
  },
  btnborder:{
    position:'absolute',
    bottom:0,
    left:0,
    width:Dimensions.get('window').width/4,
    height:2,
    backgroundColor:'#51a7ff',
  }
});

module.exports = Jrw;
