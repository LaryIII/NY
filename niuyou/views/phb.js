/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import UserHome from './phb/userhome';
import Service from './service';
import Util from './utils';
import GiftedListView from 'react-native-gifted-listview';
import GiftedSpinner from 'react-native-gifted-spinner';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
} from 'react-native';


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}) // assumes immutable objects
var Phb = React.createClass({
  getInitialState: function(){
    var items = [];
    return {
      items: items,
    };
  },
  _gotoUserHome: function(idx){
    this.props.navigator.push({
      title: '个人主页',
      component: UserHome,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
      passProps: {
        idx:idx,
      }
    });
  },

  _onFetch(page = 1, callback, options) {
    Util.get(Service.host + Service.rankingList, {}, function(data){
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
    return (
      <TouchableOpacity onPress={()=>{this._gotoUserHome(rowData.idx)}}>
        <View style={styles.inneritem} data-id={rowData.id} data-userid={rowData.userId}>
          <View style={styles.itemimgbox}>
            <Image resizeMode="contain" style={styles.itemimg} source={{uri: rowData.photoUrl}}></Image>
          </View>
          <View style={styles.itemtext}>
            <Text style={styles.avatername}>{rowData.name}</Text>
            <Text style={styles.statusx}>￥{rowData.price}</Text>
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

  render: function(){
    var items = this.state.items;
    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
        hidden='true'
        style={{backgroundColor:'#efefef',}}
        size='large'/> ) :
      ( <View/>);
    return (
        <View style={styles.userlist}>
          <GiftedListView
            contentContainerStyle = {styles.list}
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
              colors: ['#efefef'],
              progressBackgroundColor: '#003e82',
            }}
          />
        </View>
    );
  }
});

var styles = StyleSheet.create({
  userlist:{
    flex:1,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:'#efefef',
  },
  list:{
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    width:(Dimensions.get('window').width-30)/2,
    height:(Dimensions.get('window').width-30)/2+37,
    borderRadius:4,
    // backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
  },
  itemimgbox:{
    flex:1,
    width:(Dimensions.get('window').width-30)/2,
    height:(Dimensions.get('window').width-30)/2,
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
    backgroundColor:'#fff',
  },
  itemimg:{
    flex:1,
    width:(Dimensions.get('window').width-30)/2,
    height:(Dimensions.get('window').width-30)/2,
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
  },
  itemtext:{
    height:37,
    backgroundColor:'#fff',
    width:(Dimensions.get('window').width-30)/2,
    borderBottomLeftRadius:4,
    borderBottomRightRadius:4,
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

module.exports = Phb;
