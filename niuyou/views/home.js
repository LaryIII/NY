/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import SelectCity from './home/selectcity';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

var Home = React.createClass({
  getInitialState: function(){
    var items = [];

    return {
      items: items,
    };
  },
  _gotoSelectCity:function(){
    this.props.navigator.push({
      title: '请选择城市',
      component: SelectCity,
      navigationBarHidden:false,
      barTintColor:'#f9f9f9',
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
        <TouchableOpacity onPress={this._gotoSelectCity}>
          <View style={styles.city}>
            <Text style={styles.citytext}>南京</Text>
            <Image resizeMode={'contain'} style={styles.down} source={require('image!home_down')}></Image>
          </View>
        </TouchableOpacity>
        <View style={styles.borderbottom}></View>
      </View>
      <ScrollView style={styles.container}>
        <Swiper style={styles.wrapper} showsButtons={false} height={195}>
          <View style={styles.slide1}>
            <Image resizeMode={'contain'} style={styles.banner} source={require('./../res/home/banner.jpg')}></Image>
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>And simple</Text>
          </View>
        </Swiper>
        <View style={styles.tasklist}>
          <View style={styles.tasktitlebox}>
            <Text style={styles.titleline}>—————  热门任务  —————</Text>
          </View>
          <View>
            <View style={styles.item}>
              <Image resizeMode={'contain'} style={styles.itemimg} source={require('./../res/home/banner.jpg')}></Image>
              <View style={styles.itemtext}>
                <Text style={styles.itemtitle}>丽江一米阳光宾馆照片转发朋友圈任务</Text>
                <Text style={styles.itemprice}>30元/次</Text>
                <Text style={styles.itemnum}>已接受任务自媒体：<Text style={styles.em}>132人</Text></Text>
              </View>
            </View>
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
    marginTop:-5,
  },
  navigatorx:{
    backgroundColor:'#f3ea85',
    height:64,
    paddingTop:20,
  },
  city:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
  },
  citytext:{
    fontSize:17,
    fontWeight:'bold',
    textAlign:'center',
    marginRight:6,
  },
  down:{
    width:4,
    height:5,
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
    marginTop:70,
  },
  itemprice:{
    fontSize:12,
    color:'#fff',
    textAlign:'center',
    marginTop:10,
  },
  itemnum:{
    fontSize:12,
    color:'#fff',
    textAlign:'center',
    marginTop:45,
  },
  em:{
    color:'#f0e983',
  }
});

module.exports = Home;
