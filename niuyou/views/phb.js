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

var Phb = React.createClass({
  getInitialState: function(){
    var items = [];

    return {
      items: items,
    };
  },

  render: function(){
    var items = this.state.items;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.userlist}>
          <View>
            <View style={styles.item}>
              <View style={styles.inneritem}>
                <Image style={styles.itemimg} source={require('./../res/paihang/face.jpg')}></Image>
                <View style={styles.itemtext}>
                  <Text style={styles.avatername}>萌萌</Text>
                  <Text style={styles.statusx}>￥25870</Text>
                </View>
              </View>
              <View style={styles.inneritem}>
                <Image style={styles.itemimg} source={require('./../res/paihang/face.jpg')}></Image>
                <View style={styles.itemtext}>
                  <Text style={styles.avatername}>萌萌</Text>
                  <Text style={styles.statusx}>￥25870</Text>
                </View>
              </View>
            </View>
            <View style={styles.item}>
              <View style={styles.inneritem}>
                <Image style={styles.itemimg} source={require('./../res/paihang/face.jpg')}></Image>
                <View style={styles.itemtext}>
                  <Text style={styles.avatername}>萌萌</Text>
                  <Text style={styles.statusx}>￥25870</Text>
                </View>
              </View>
              <View style={styles.inneritem}>
                <Image style={styles.itemimg} source={require('./../res/paihang/face.jpg')}></Image>
                <View style={styles.itemtext}>
                  <Text style={styles.avatername}>萌萌</Text>
                  <Text style={styles.statusx}>￥25870</Text>
                </View>
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
    backgroundColor:'#efefef',
  },
  userlist:{
    marginTop:10,
    marginBottom:10,
  },
  item:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:10,
    height:(Dimensions.get('window').width-30)/2+37,
    marginLeft:5,
    marginRight:5,
  },
  inneritem:{
    flex:1,
    width:(Dimensions.get('window').width-30)/2,
    height:(Dimensions.get('window').width-30)/2+37,
    borderRadius:4,
    // backgroundColor:'#fff',
    alignItems:'center',
  },
  itemimg:{
    flex:1,
    width:(Dimensions.get('window').width-30)/2,
    height:(Dimensions.get('window').width-30)/2,
  },
  itemtext:{
    height:37,
    backgroundColor:'#fff',
    width:(Dimensions.get('window').width-30)/2,
  },
  avatername:{
    position:'absolute',
    bottom:12,
    left:12,
    fontSize:15,
    color:'#333',
  },
  statusx:{
    position:'absolute',
    bottom:12,
    right:12,
    color:'#f0e983',
    fontSize:15,
  },
});

module.exports = Phb;
