/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import TaskDetail from './jrw/taskdetail';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import JRWTabBar from './jrw/jrwtabbar';
import Util from './utils';
import Service from './service';
import AllTask from './alltask';
import ReceiveTask from './receivetask';
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
    var items = [];
    return {
      items: items,
    };
  },
  render: function(){
    var items = this.state.items;
    return (
      <View style={styles.bigcontainer}>
      <ScrollableTabView style={styles.container} renderTabBar={() =><JRWTabBar />}>
        <AllTask tabLabel="所有任务" />
        <ReceiveTask tabLabel="可接任务" />
      </ScrollableTabView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  bigcontainer:{
    flex:1,
    paddingTop:20,
    backgroundColor:'#f9f9f9',
  },
  container:{
    flex:1,
    backgroundColor:'#fff',
  },
});


module.exports = Jrw;
