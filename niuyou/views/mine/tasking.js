'use strict'

import React, { Component } from 'react';
import Util from './../utils';
import Service from './../service';
import TaskDetail from './../jrw/taskdetail';
import GiftedListView from 'react-native-gifted-listview';
import GiftedSpinner from 'react-native-gifted-spinner';
import CameraPicker from './camerapicker';
import qiniu from 'react-native-qiniu';
import moment from 'moment';
import Modal from 'react-native-simple-modal';

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
window.EventEmitter = EventEmitter;
window.Subscribable = Subscribable;

import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ListView,
  ActivityIndicatorIOS,
} from 'react-native';
// 任务状态:0接单；1待确认；2通过；3驳回；4失效
var Tasking = React.createClass({
  mixins: [Subscribable.Mixin],
  getInitialState: function(){
    return {
      open: false,
      offset:150,
      zmimgs:[],
      uploaded:0,
    };
  },
  componentWillMount:function(){
    this.eventEmitter = new EventEmitter();
  },
  componentDidMount:function(){
    var that = this;
    this.addListenerOn(this.eventEmitter, 'upload_imgs2',  function(args){
      console.log('upload_imgs2');
      //upload file to Qiniu
      that.setState({
        open:true,
      });
      for(var i=0;i<args.images.length;i++){
        (function(img,taskId){
          Util.get(Service.host + Service.getToken, {bucketName:'ny-task-photo'}, function(data){
            console.log(data);
            if(data.code == 200){
              var token = data.data.response.token;
              var url = data.data.response.url;
              var key = data.data.response.key;
              qiniu.rpc.uploadImage(img, key, token, function (resp) {
                 console.log(resp);
                 console.log(url);
                 if(resp.status == 200 && resp.ok == true){
                   that.state.lifeimgs.push({uri:url});
                   that.setState({
                     zmimgs: that.state.lifeimgs
                   });
                   // 保存图片地址到服务器
                   Util.get(Service.host + Service.uploadOrderPhoto, {
                     taskId:taskId,
                     photoUrl:url,
                   }, function(data){
                     console.log('上传成功:'+url);
                     if(data.code == 200){
                       var num = that.state.uploaded;
                       num = num+1;
                       console.log(num);
                       that.setState({
                         uploaded:num,
                       });
                       if(that.state.uploaded == that.state.zmimgs.length){
                         // 保存完毕之后提交认证
                         that.setState({
                           open:false,
                         })
                         Util.get(Service.host + Service.sureOrder, {
                           taskId:taskId
                         }, function(data){
                           console.log(data);
                           if(data.code == 200){
                             AlertIOS.alert('提醒',
                             '任务提交成功, 请耐心等待审核',
                             [
                               {text: '确认', onPress: () => that.render()},
                             ]
                           );
                           }else{
                             AlertIOS.alert('提醒',data.messages[0].message);
                           }
                         });
                       }
                     }else{

                     }
                   });
                 }
              });
            }else{

            }
          });
        })(args.images[i],args.taskId)
      }
    });
  },
  _onFetch(page = 1, callback, options) {
    Util.get(Service.host + Service.ongoingOrderList, {}, function(data){
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
  _uploadZM:function(taskId){
    var that = this;
    that.props.navigator.push({
      title: '选择最多9张生活照片',
      component: CameraPicker,
      navigationBarHidden:true,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      // leftButtonTitle: "返回",
      // leftButtonIcon:require('image!back1'),
      // onLeftButtonPress: ()=>that.props.navigator.pop(),
      passProps: {
          events: that.eventEmitter,
          type:'tasking',
          taskId:taskId,
      }
    });
  },
  _gotoTaskDetail:function(taskId){
    var that = this;
    that.props.navigator.push({
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
  _renderRowView(rowData) {
    var genderimg = rowData.gender==1?require('image!ph_nan'):require('image!ph_nv');
    var btndom = [];
    if(rowData.status == 0){
      btndom.push(
        <TouchableOpacity style={styles.tbtn} onPress={()=>this._uploadZM(rowData.taskId)}>
          <View style={styles.statusbtn}>
            <Text style={styles.statustext}>上传图片证明</Text>
          </View>
        </TouchableOpacity>
      );
    }else{
      btndom.push(
        <View style={styles.tbtn}>
          <View style={styles.statusbtn2}>
            <Text style={styles.statustext2}>待确认</Text>
          </View>
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={()=>this._gotoTaskDetail(rowData.taskId)}>
        <View style={styles.item}>
          <Image resizeMode={'contain'} style={styles.itemimg} source={require('./../../res/home/banner.jpg')}></Image>
          <View style={styles.itemtext}>
            <Image resizeMode={'contain'} style={styles.avater} source={genderimg}></Image>
            <Text style={styles.avatername}>{rowData.merchantName}</Text>
            <Text style={styles.statusx}>{moment(rowData.taskEndTime).format('YYYY-MM-DD HH:mm')}</Text>
            <Text style={styles.itemtitle}>{rowData.taskName}</Text>
            <Text style={styles.itemprice}>{rowData.price}元/次</Text>
            {btndom}
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
      <View style={styles.container}>
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
      />
      <Modal
         offset={this.state.offset}
         open={this.state.open}
         modalDidOpen={() => console.log('modal did open')}
         modalDidClose={() => undefined}
         style={{alignItems: 'center'}}
         overlayOpacity={0.3}>
         <View style={styles.modalbox}>
            <ActivityIndicatorIOS style={styles.modalindicator} color="#999" />
            <Text style={styles.modaltext}>正在上传图片...</Text>
         </View>
      </Modal>
      </View>
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
  },
  tbtn:{
    position:'absolute',
    bottom:0,
    left:0,
    width:Dimensions.get('window').width - 30,
    height:40,
  },
  statusbtn:{
    height:40,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#eedd1b',
  },
  statustext:{
    color:'#333',
    fontSize:15,
  },
  statusbtn2:{
    height:40,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(238,221,27,0.3)',
  },
  statustext2:{
    color:'#fff',
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
  modalbox:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width:Dimensions.get('window').width-70,
  },
  modalindicator:{
    marginRight:15,
  },
  modaltext:{
    color:'#666',
    fontSize:15,
  }
};


module.exports = Tasking;
