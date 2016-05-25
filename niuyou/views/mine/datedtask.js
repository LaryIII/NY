/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import TaskDetail from './../jrw/taskdetail';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import JRWTabBar from './../jrw/jrwtabbar';
import NotSettledTask from './notsettledtask';
import SettledTask from './settledtask';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

var Tasked = React.createClass({
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
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
      passProps: {
        id:taskId,
      }
    });
  },
  render: function(){
    var items = this.state.items;

    return (
      <View style={styles.bigcontainer}>
        <ScrollableTabView style={styles.container} renderTabBar={() =><JRWTabBar />}>
          <NotSettledTask tabLabel="审核不通过" onRowPress={(id)=>{
            this._gotoTaskDetail(id);
          }} />
          <SettledTask ref="receive" tabLabel="失效的任务" refreshFlag={this.state.refreshReceive} onRowPress={(id)=>{
            this._gotoTaskDetail(id);
          }} />
        </ScrollableTabView>
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
  },
  itemRow:{
    flexDirection:'row',
    marginBottom:20,
  },
  banner:{
    flex:1,
    borderRadius:4,
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
    backgroundColor:'#fff',
    height:50,
    borderWidth:0.5,
    borderColor:'#dfdfdf',
  },
  tabs:{
    flexDirection:'row',
  },
  tabitem:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  btn:{
    width:82,
    height:50,
    justifyContent:'center',
    alignItems:'center',
  },
  statusbtn:{
    position:'absolute',
    bottom:0,
    left:0,
    width:Dimensions.get('window').width - 30,
    height:40,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#eedd1b',
  },
  statustext:{
    color:'#333',
    fontSize:15,
  }
});

module.exports = Tasked;
