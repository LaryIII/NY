'use strict'

import React, { Component } from 'react';
import Util from './utils';
import Service from './service';
import GiftedListView from 'react-native-gifted-listview';
import GiftedSpinner from 'react-native-gifted-spinner';

import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ListView,
} from 'react-native';

var AllTask = React.createClass({
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
  _onFetch(page = 1, callback, options) {
    Util.get(Service.host + Service.rankingList, {}, function(data){
      console.log(data);
      if(data.code == 200){
        var rows = data.data.response.list;
        if(rows.length==10){
          callback([1,2,3]);
        }else if(rows.length<10){
          callback([1,2,3], {
            allLoaded: true, // the end of the list is reached
          });
        }

      }else{

      }
    });
  },

  _onPress(rowData) {
    console.log(rowData+' pressed');
  },

  _renderRowView(rowData) {
    return (
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
    );
  },
  /**
 * Render the refreshable view when waiting for refresh
 * On Android, the view should be touchable to trigger the refreshCallback
 * @param {function} refreshCallback The function to call to refresh the listview
 */
_renderRefreshableWaitingView(refreshCallback) {
  if (Platform.OS !== 'android') {
    return (
      <View style={customStyles.refreshableView}>
        <Text style={customStyles.actionsLabel}>
          ↓
        </Text>
      </View>
    );
  } else {
    return (
      <TouchableHighlight
        underlayColor='#c8c7cc'
        onPress={refreshCallback}
        style={customStyles.refreshableView}
      >
        <Text style={customStyles.actionsLabel}>
          ↻
        </Text>
      </TouchableHighlight>
    );
  }
},

/**
 * Render the refreshable view when the pull to refresh has been activated
 * @platform ios
 */
_renderRefreshableWillRefreshView() {
  return (
    <View style={customStyles.refreshableView}>
      <Text style={customStyles.actionsLabel}>
        ↻
      </Text>
    </View>
  );
},

/**
 * Render the refreshable view when fetching
 */
_renderRefreshableFetchingView() {
  return (
    <View style={customStyles.refreshableView}>
      <GiftedSpinner style={customStyles.spinner} />
    </View>
  );
},

/**
 * Render the pagination view when waiting for touch
 * @param {function} paginateCallback The function to call to load more rows
 */
_renderPaginationWaitingView(paginateCallback) {
  return (
    <TouchableHighlight
      underlayColor='#c8c7cc'
      onPress={paginateCallback}
      style={customStyles.paginationView}
    >
      <Text style={[customStyles.actionsLabel, {fontSize: 13}]}>
        Load more
      </Text>
    </TouchableHighlight>
  );
},

/**
 * Render the pagination view when fetching
 */
_renderPaginationFetchigView() {
  return (
    <View style={customStyles.paginationView}>
      <GiftedSpinner style={customStyles.spinner} />
    </View>
  );
},

/**
 * Render the pagination view when end of list is reached
 */
_renderPaginationAllLoadedView() {
  return (
    <View style={customStyles.paginationView}>
      <Text style={customStyles.actionsLabel}>

      </Text>
    </View>
  );
},

/**
 * Render a view when there is no row to display at the first fetch
 * @param {function} refreshCallback The function to call to refresh the listview
 */
_renderEmptyView(refreshCallback) {
  return (
    <View style={customStyles.defaultView}>
      <Text style={customStyles.defaultViewTitle}>
        Sorry, there is no content to display
      </Text>

      <TouchableHighlight
        underlayColor='#c8c7cc'
        onPress={refreshCallback}
      >
        <Text>
          ↻
        </Text>
      </TouchableHighlight>
    </View>
  );
},

/**
 * Render a separator between rows
 */
_renderSeparatorView() {
  return (
    <View style={customStyles.separator} />
  );
},
  render() {
    return (
      // <View>
      //   {this._getSpinner()}
      // </View>
      <GiftedListView
        contentContainerStyle = {styles.innercontainer}
        rowView={this._renderRowView}
        onFetch={this._onFetch}
        firstLoader={true} // display a loader for the first fetching
        pagination={false} // enable infinite scrolling using touch to load more
        refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
        withSections={false} // enable sections
        customStyles={{
          paginationView: {
            //backgroundColor: '#f9f9f9',
          },
        }}

        refreshableTintColor="blue"
        pagination={true} // enable infinite scrolling using touch to load more
        paginationFetchigView={this._renderPaginationFetchigView}
        paginationAllLoadedView={this._renderPaginationAllLoadedView}
        paginationWaitingView={this._renderPaginationWaitingView}

        refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
        refreshableViewHeight={50} // correct height is mandatory
        refreshableDistance={40} // the distance to trigger the pull-to-refresh - better to have it lower than refreshableViewHeight
        refreshableFetchingView={this._renderRefreshableFetchingView}
        refreshableWillRefreshView={this._renderRefreshableWillRefreshView}
        refreshableWaitingView={this._renderRefreshableWaitingView}

        emptyView={this._renderEmptyView}

        renderSeparator={this._renderSeparatorView}
        PullToRefreshViewAndroidProps={{
          colors: ['#efefef'],
          progressBackgroundColor: '#003e82',
        }}
        {...this.props}
      />
    );
  },

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
  innercontainer:{
    flex:1,
  },
  itemRow:{
    flexDirection:'row',
    marginBottom:20,
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
var customStyles = {
  separator: {
    height: 1,
    backgroundColor: '#efefef',
  },
  spinner:{
    backgroundColor:'#efefef',
  },
  refreshableView: {
    height: 50,
    backgroundColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsLabel: {
    fontSize: 20,
    color: '#007aff',
  },
  paginationView: {
    width:(Dimensions.get('window').width-30)/2,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
  },
  defaultView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#efefef',
  },
  defaultViewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    padding: 10,
    height: 44,
    backgroundColor:'#efefef',
  },
  header: {
    backgroundColor: '#50a4ff',
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
  },
};


module.exports = AllTask;
