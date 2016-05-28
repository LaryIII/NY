/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import Swiper from 'react-native-swiper';
import SelectCity from './home/selectcity';
import Util from './utils';
import RNGeocoder from 'react-native-geocoder';
import Service from './service';
import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
// SQLite.enablePromise(true);
SQLite.enablePromise(false);

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
window.EventEmitter = EventEmitter;
window.Subscribable = Subscribable;
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ListView,
  ActivityIndicatorIOS,
  AsyncStorage,
} from 'react-native';

var Home = React.createClass({
  mixins: [Subscribable.Mixin],
  getInitialState: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    AsyncStorage.setItem('city','320100;南京;320000',function(err){})
    return {
      dataSource: ds.cloneWithRows([]),
      initialPosition: 'unknown',
      city:'南京',
      city_id:'320100',
      isLoading:true,
    };
  },
  componentWillMount:function(){
    this.eventEmitter = new EventEmitter();
  },
  componentDidMount: function() {
    var that = this;
    this.addListenerOn(this.eventEmitter, 'locate_success',  function(args){
      console.log('locate_success');
      that.setState({
        city_id:args.cityId,
        city:args.city.split('市')[0],
      });
      that.getIndexData();
    });
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {
        console.log(initialPosition);
        this.setState({initialPosition});
        var loc = {
          latitude:initialPosition.coords.latitude,
          longitude:initialPosition.coords.initialPosition
        }
        // TODO:模拟器测试的时候先用这个，真机测试的时候要删掉
        var NJ = {
          latitude: 32.031231,
          longitude: 118.461231
        };
        RNGeocoder.reverseGeocodeLocation(NJ, (err, data) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(data);
          //获取城市
           var city = data[0].locality;
           if (!city) {
             //四大直辖市的城市信息无法通过locality获得，只能通过获取省份的方法来获得（如果city为空，则可知为直辖市）
             city = data[0].administrativeArea;
           }
           that.setState({
             city:city.split('市')[0]
           });

           // 查找city_id
           function errorCB(err) {
             console.log("SQL Error: " + err);
           };

           function successCB() {
             console.log("SQL executed fine");
           };

           function openCB() {
             console.log("Database OPENED");
           };
           var db = SQLite.openDatabase("resource.db", "1.0", "resource", 200000, openCB, errorCB);
           db.transaction((tx) => {
               console.log(tx);
             tx.executeSql("SELECT * FROM sys_city WHERE city=?", [city], (tx, results) => {
                 console.log("Query completed");

                 var len = results.rows.length;
                 var city_id = '';
                 var city_name = '';
                 var province_id = '';
                 for (let i = 0; i < len; i++) {
                   let row = results.rows.item(i);
                   city_id += `${row.city_id}`;
                   city_name += `${row.city}`;
                   province_id += `${row.father}`;
                 }
                 console.log(city_id);
                 that.setState({
                   city_id:city_id,
                 });
                 // 把city存到全局
                 var city = city_id+';'+city_name+';'+province_id;
                 AsyncStorage.setItem('city',city,function(err){})
                 // 请求首页数据
                 that.getIndexData();

                 db.close(closeCB,errorCB);
               });
           },
           this.errorCB,function() {
               console.log("Transaction is now finished");
           });
        });
      },
      (error) => {
        console.log(error.message);
        // alert(error.message)},
        that.getIndexData()},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },
  getIndexData:function(){
    var that  = this;
    Util.get(Service.host + Service.index, {cityId:this.state.city_id}, function(data){
      console.log(data);
      if(data.code == 200){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        that.setState({
          dataSource:ds.cloneWithRows(data.data.response.suggestTaskList),
          adList:data.data.response.adList,
          suggestTaskList:data.data.response.suggestTaskList,
          isLoading:false,
        })

      }else{

      }
    });
  },
  _gotoSelectCity:function(){
    var that = this;
    AsyncStorage.getItem('city',function(err,result){
      var cityInfo = '';
      if(!err){
         cityInfo = result?result:'';
      }
      that.props.navigator.push({
        title: '请选择城市',
        component: SelectCity,
        navigationBarHidden:false,
        barTintColor:'#f9f9f9',
        // backButtonTitle: "返回",
        // backButtonIcon: require('image!back'),
        leftButtonTitle: "返回",
        leftButtonIcon:require('image!back1'),
        onLeftButtonPress: ()=>that.props.navigator.pop(),
        passProps:{
          events: that.eventEmitter,
          cityInfo:cityInfo,
        }
      });
    });
  },

  render: function(){
    var slides = [];
    if(this.state.adList && this.state.adList.length>0){
      for(var i=0;i<this.state.adList.length;i++){
        var url = this.state.adList[i].imgUrl;
        slides.push(
          <View style={styles.slide1}>
            <Image resizeMode={'contain'} style={styles.banner} source={require('./../res/home/banner.jpg')}></Image>
          </View>
        );
      }
    }
    var spinner = this.state.isLoading ?
      ( <ActivityIndicatorIOS
        hidden='true'
        style={{marginTop:40,}}
        size='small'/> ) :
      ( <View/>);
    var title = this.state.isLoading ?
    ( <View/>):(<View style={styles.tasktitlebox}>
      <Text style={styles.titleline}>—————  热门任务  —————</Text>
    </View>);

    return (
      <View style={styles.bigcontainer}>
      <View style={styles.navigatorx}>
        <TouchableOpacity onPress={this._gotoSelectCity}>
          <View style={styles.city}>
            <Text style={styles.citytext}>{this.state.city}</Text>
            <Image resizeMode={'contain'} style={styles.down} source={require('image!home_down')}></Image>
          </View>
        </TouchableOpacity>
        <View style={styles.borderbottom}></View>
      </View>
      <ScrollView style={styles.container}>
        {spinner}
        <Swiper style={styles.wrapper} showsButtons={false} height={195}>
          {slides}
        </Swiper>
        <View style={styles.tasklist}>
          {title}
          <ListView
            contentContainerStyle={styles.list}
            dataSource={this.state.dataSource}
            initialListSize={21}
            pageSize={3} // should be a multiple of the no. of visible cells per row
            scrollRenderAheadDistance={500}
            renderRow={this._renderRow}
          />
        </View>
      </ScrollView>
      </View>
    );
  },
  _renderRow: function(rowData: string, sectionID: number, rowID: number) {
    return (
      <TouchableOpacity underlayColor="transparent">
          <View style={styles.item}>
            <Image resizeMode={'contain'} style={styles.itemimg} source={require('./../res/home/banner.jpg')}></Image>
            <View style={styles.itemtext}>
              <Text style={styles.itemtitle}>丽江一米阳光宾馆照片转发朋友圈任务</Text>
              <Text style={styles.itemprice}>30元/次</Text>
              <Text style={styles.itemnum}>已接受任务自媒体：<Text style={styles.em}>132人</Text></Text>
            </View>
          </View>
      </TouchableOpacity>
    );
  },

  _genRows: function(pressData: {[key: number]: boolean}): Array<string> {
    var dataBlob = [];
    for (var ii = 0; ii < 100; ii++) {
      var pressedText = pressData[ii] ? ' (X)' : '';
      dataBlob.push('Cell ' + ii + pressedText);
    }
    return dataBlob;
  },

  _pressRow: function(rowID: number) {
    // this._pressData[rowID] = !this._pressData[rowID];
    // this.setState({dataSource: this.state.dataSource.cloneWithRows(
    //   this._genRows(this._pressData)
    // )});
  },
});

var styles = StyleSheet.create({
  bigcontainer:{
    flex:1,
  },
  container:{
    flex:1,
    marginTop:-5,
  },
  navigatorx:{
    backgroundColor:'#f3ea85',
    height:64,
    paddingTop:20,
  },
  city:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
  },
  citytext:{
    fontSize:17,
    fontWeight:'bold',
    textAlign:'center',
    marginRight:6,
  },
  down:{
    width:4,
    height:5,
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
    marginBottom:60,
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

module.exports = Home;
