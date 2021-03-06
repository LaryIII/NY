'use strict'

import React, { Component } from 'react';
import Util from './utils';
import Service from './service';
import GiftedListView from 'react-native-gifted-listview';
import GiftedSpinner from 'react-native-gifted-spinner';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ListView,
  TouchableHighlight,
} from 'react-native';

var AllTask = React.createClass({
  getInitialState: function(){
    var items = [];
    return {
      items: items,
    };
  },
  refresh:function(){
    this.refs.listview._refresh();
  },
  _onFetch(page = 1, callback, options) {
    Util.get(Service.host + Service.taskList, {
      pageNo:page-1,
      pageSize:10,
    }, function(data){
      console.log(data);
      if(data.code == 200){
        var rows = data.data.response.taskList;
        if(rows.length==10){
          callback(rows);
        }else if(rows.length<10){
          callback(rows, {
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
    var genderimg = rowData.gender==1?require('image!ph_nan'):require('image!ph_nv');
    return (
      <TouchableOpacity onPress={()=>this.props.onRowPress(rowData.id)}>
        <View style={styles.item}>
          <Image resizeMode={'cover'} style={styles.itemimg} source={{uri:rowData.mainPhotoUrl+'?imageView2/1/w/690/h/360'}}></Image>
          <View style={styles.itemtext}>
            <Image resizeMode={'contain'} style={styles.avater} source={genderimg}></Image>
            <Text style={styles.avatername}>{rowData.merchantName}</Text>
            <Text style={styles.statusx}>发布了任务</Text>
            <Text style={styles.itemtitle} numberOfLines={1}>{rowData.taskName}</Text>
            <Text style={styles.itemprice}>{rowData.price}元/次  性别限制:{rowData.gender==1?'男':'女'}</Text>
            <Text style={styles.itemdesc}>地区限制:{rowData.publicCity}</Text>
            <Text style={styles.itemdesc}>{moment(rowData.showEndTime).format('YYYY-MM-DD HH:mm')}</Text>
            <Text style={styles.itemnum}>已接受任务自媒体：<Text style={styles.em}>{rowData.orderPeopleNum}人</Text></Text>
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
        underlayColor='#fff'
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
      underlayColor='#fff'
      onPress={paginateCallback}
      style={customStyles.paginationView}
    >
      <Text style={[customStyles.actionsLabel, {fontSize: 13}]}>
        加载更多
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
        underlayColor='#fff'
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
        ref="listview"
        contentContainerStyle = {styles.innercontainer}
        rowView={this._renderRowView}
        onFetch={this._onFetch}
        firstLoader={true} // display a loader for the first fetching
        pagination={true} // enable infinite scrolling using touch to load more
        refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
        withSections={false} // enable sections
        customStyles={{
          paginationView: {
            //backgroundColor: '#f9f9f9',
          },
        }}

        refreshableTintColor="gray"
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
          colors: ['#fff'],
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
    // flex:1,
    paddingBottom:60,
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
    backgroundColor:'#eee',
    borderRadius:4,
    marginLeft:15,
    marginRight:15,
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
    width:Dimensions.get('window').width - 30,
    height:180,
  },
  itemtitle:{
    fontSize:15,
    color:'#fff',
    textAlign:'center',
    marginTop:50,
    fontWeight:'bold',
    paddingLeft:10,
    paddingRight:10,
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
    height:Util.pixel,
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
    // height: 1,
    // backgroundColor: '#efefef',
  },
  spinner:{
    backgroundColor:'#fff',
    color:'#666',
  },
  refreshableView: {
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsLabel: {
    fontSize: 13,
    color: '#007aff',
  },
  paginationView: {
    width:(Dimensions.get('window').width-30),
    marginLeft:15,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  defaultView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#fff',
  },
  defaultViewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    padding: 10,
    height: 44,
    backgroundColor:'#fff',
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
