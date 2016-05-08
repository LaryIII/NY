/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

var Jrw = React.createClass({
  getInitialState: function(){
    var items = [
      {
        id:1,
        title: '研发',
        partment: '框架研发',
        color: '#126AFF',
      },
      {
        id:2,
        title: '研发',
        partment: 'BU研发',
        color: '#FFD600',
      },
      {
        id:3,
        title: '产品',
        partment: '公共产品',
        color: '#F80728',
      },
      {
        id:4,
        title: '产品',
        partment: 'BU产品',
        color: '#05C147',
      },
      {
        id:5,
        title: '产品',
        partment: '启明星',
        color: '#FF4EB9',
      },
      {
        id:6,
        title: '项目',
        partment: '项目管理',
        color: '#EE810D',
      }
    ];

    return {
      items: items,
    };
  },

  render: function(){
    var items = this.state.items;

    return (
      <ScrollView style={styles.container}>
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
    );
  }
});

var styles = StyleSheet.create({
  container:{
    flex:1,
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

module.exports = Jrw;
