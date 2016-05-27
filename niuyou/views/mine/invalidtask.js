'use strict'

import React, { Component } from 'react';
import Util from './../utils';
import Service from './../service';
import TaskDetail from './../jrw/taskdetail';
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
} from 'react-native';

var InvalidTask = React.createClass({
  getInitialState: function(){
    var items = [];
    return {
      items: items,
    };
  },
  _onFetch(page = 1, callback, options) {
    Util.get(Service.host + Service.invalidOrderList, {}, function(data){
      console.log(data);
      if(data.code == 200){
        var rows = data.data.response.list;
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
      <TouchableOpacity onPress={()=>this.props.onRowPress(rowData.taskId)}>
        <View style={styles.item}>
          <Image resizeMode={'contain'} style={styles.itemimg} source={require('./../../res/home/banner.jpg')}></Image>
          <View style={styles.itemtext}>
            <Image resizeMode={'contain'} style={styles.avater} source={genderimg}></Image>
            <Text style={styles.avatername}>{rowData.merchantName}</Text>
            <Text style={styles.statusx}>截止日期: {moment(rowData.showEndTime).format('YYYY-MM-DD HH:mm')}</Text>
            <Text style={styles.itemtitle}>{rowData.taskName}</Text>
            <Text style={styles.itemprice}>{rowData.price}元/次</Text>
            <View style={styles.statusbtn}>
              <Text style={styles.statustext}>{rowData.noPassReason}</Text>
            </View>
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
    left:15,
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
var customStyles = {
  separator: {
    height: 1,
    // backgroundColor: '#efefef',
  },
  spinner:{
    // backgroundColor:'#efefef',
  },
  refreshableView: {
    height: 50,
    // backgroundColor: '#efefef',
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
    // backgroundColor: '#efefef',
  },
  defaultView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor:'#efefef',
  },
  defaultViewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    padding: 10,
    height: 44,
    // backgroundColor:'#efefef',
  },
  header: {
    backgroundColor: '#50a4ff',
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
  },
};

module.exports = InvalidTask;
