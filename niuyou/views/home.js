/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

var Home = React.createClass({
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
      <ScrollView>
        <View>
          <Text>hello</Text>
        </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
  },
  itemRow:{
    flexDirection:'row',
    marginBottom:20,
  }
});

module.exports = Home;
