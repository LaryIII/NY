/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import Util from './../utils';
import Service from './../service';
import City from './city';
import AuthInfo from './../mine/authinfo';
import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
// SQLite.enablePromise(true);
SQLite.enablePromise(false);
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  ListView,
  AsyncStorage,
} from 'react-native';

var SelectCity = React.createClass({
  getInitialState: function(){
    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };
    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[rowID];
    };

    var dataSource = new ListView.DataSource({
      getRowData: getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    var dataBlob = {};
    var sectionIDs = [];
    var rowIDs = [];


    // for (var ii = 0; ii < NUM_SECTIONS; ii++) {
    //   var sectionName = 'Section ' + ii;
    //   sectionIDs.push(sectionName);
    //   dataBlob[sectionName] = sectionName;
    //   rowIDs[ii] = [];
    //
    //   for (var jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
    //     var rowName = 'S' + ii + ', R' + jj;
    //     rowIDs[ii].push(rowName);
    //     dataBlob[rowName] = rowName;
    //   }
    // }

    sectionIDs = City.letter;
    for(var ii = 0; ii < sectionIDs.length; ii++){
      dataBlob[sectionIDs[ii]] = sectionIDs[ii];
    }
    var cities = City.cities;
    for(var m in cities){
      var temp = [];
      for(var jj = 0;jj < cities[m].length; jj++){
        dataBlob[cities[m][jj]['name']] = cities[m][jj]['name'];
        temp.push(cities[m][jj]['name']);
      }
      rowIDs.push(temp);
    }
    console.log(dataBlob);
    console.log(sectionIDs);
    console.log(rowIDs);
    return {
      dataSource:dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
      headerPressCount: 0,
      letters:[],
      cities:[]
    };
  },
  componentWillMount:function(){

  },
  componentDidMount:function(){
    var that = this;
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
      tx.executeSql('SELECT * FROM sys_city ORDER BY word', [], (tx, results) => {
          console.log("Query completed");
          var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
          };
          var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[rowID];
          };

          var dataSource = new ListView.DataSource({
            getRowData: getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
          });

          var dataBlob = {};
          var sectionIDs = [];
          var rowIDs = [];

          var len = results.rows.length;
          console.log(len);
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            var letter = `${row.word}`.toUpperCase();
            if(!sectionIDs.includes(letter)){
              sectionIDs.push(letter);
              dataBlob[letter] = letter;
              rowIDs.push([]);
            }
            rowIDs[rowIDs.length-1].push(`${row.city_id};${row.city};${row.father};${row.py}`);
            dataBlob[`${row.city_id}`] = `${row.city_id};${row.city};${row.father};${row.py}`;
          }
          console.log(rowIDs);
          that.setState({
            dataSource:dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            letters:sectionIDs,
            cities:rowIDs,
          });

          db.close(closeCB,errorCB);

        });
    },
    this.errorCB,function() {
        console.log("Transaction is now finished");
    });
  },

  _renderHotCities:function(){
    var that = this;
    var hotcities = [
      [
        {cityId:110100,name:'北京',provinceId:110000},
        {cityId:310100,name:'上海',provinceId:310000},
        {cityId:440100,name:'广州',provinceId:440000}
      ],
      [
        {cityId:440300,name:'深圳',provinceId:440000},
        {cityId:320100,name:'南京',provinceId:320000},
        {cityId:330100,name:'杭州',provinceId:330000}
      ]
    ];
    var citydoms = [];
    for(var i in hotcities){
      (function(n){
        var args0 = hotcities[n][0].cityId+';'+hotcities[n][0].name+';'+hotcities[n][0].provinceId;
        var args1 = hotcities[n][1].cityId+';'+hotcities[n][1].name+';'+hotcities[n][1].provinceId;
        var args2 = hotcities[n][2].cityId+';'+hotcities[n][2].name+';'+hotcities[n][2].provinceId;
        citydoms.push(
          <View style={styles.onelinehotcity}>
            <TouchableOpacity onPress={()=>that._selectCity(args0)}>
              <View style={styles.citybtn}>
                <Text style={styles.citybtntext}>{hotcities[n][0].name}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>that._selectCity(args1)}>
              <View style={styles.citybtn}>
                <Text style={styles.citybtntext}>{hotcities[n][1].name}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>that._selectCity(args2)}>
              <View style={styles.citybtn}>
                <Text style={styles.citybtntext}>{hotcities[n][2].name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      })(i);
    }
    return citydoms;
  },


  renderRow: function(rowData:string, sectionID: string, rowID: string): ReactElement {
    return (
      <TouchableOpacity onPress={()=>this._selectCity(rowID)}>
        <View style={styles.row}>
          <Text style={styles.rowtext}>{rowID.split(';')[1]}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  renderSectionHeader: function(sectionData: string, sectionID: string) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectiontext}>
          {sectionData}
        </Text>
      </View>
    );
  },

  _renderSidebar:function(){
    var letters = this.state.letters;
    var cities = this.state.cities;
    var letterdom = [];
    var top = 230;
    for(var i = 0; i<letters.length; i++){
      if(i>=1){
        top += cities[i-1].length*44+28;
      }
      console.log(top);
      (function(top,that){
        var t = top;
        var that = that;
        letterdom.push(
          <TouchableOpacity onPress={()=>{
            console.log(t);
            that.refs.scrollView.getScrollResponder().scrollTo({y:t});
          }}>
            <View style={styles.letter}>
              <Text style={styles.lettertext}>{letters[i]}</Text>
            </View>
          </TouchableOpacity>
        );
      })(top, this)
    }
    return letterdom;
  },
  _scrollToLetter:function(){

  },

  _selectCity:function(rowID){
    var that = this;
    var cityId = rowID.split(';')[0];
    var cityName = rowID.split(';')[1];
    var provinceId = rowID.split(';')[2];
    AsyncStorage.setItem('city',rowID,function(err){
      if(!err){
        if(that.props.type == 'renzheng'){
          // 先保存城市，然后去认证的下一步AuthInfo
          Util.get(Service.host + Service.saveCity, {
            cityId:cityId,
            provinceId:provinceId
          }, function(data){
            console.log(data);
            // 如果成功，返回原页面，且刷新页面
            if(data.code == 200){
              that.props.navigator.push({
                title: '第二步: 举牌照片',
                component: AuthInfo,
                navigationBarHidden:false,
                // backButtonTitle: "返回",
                // backButtonIcon: require('image!back'),
                // leftButtonTitle: "返回",
                leftButtonIcon:require('image!back1'),
                onLeftButtonPress: ()=>that.props.navigator.pop(),
              });
            }else{
              AlertIOS.alert('提醒',data.messages[0].message);
            }
          });

        }else{
          that.props.events.emit('locate_success', {cityId:cityId,city:cityName});
          that.props.navigator.pop();
        }

      }
    })
  },

  render: function(){
    var locatecitydom = [];
    if(this.props.cityInfo){
      var cityName = this.props.cityInfo.split(';')[1];
      locatecitydom.push(
        <TouchableOpacity onPress={()=>this._selectCity(this.props.cityInfo)}>
          <View style={styles.citybtn}>
            <Text style={styles.citybtntext}>{cityName}</Text>
          </View>
        </TouchableOpacity>
      );
    }else{
      locatecitydom.push(
        <View style={styles.nocitybtn}>
          <Text style={styles.nocitybtntext}>定位失败,请选择您所在的城市</Text>
        </View>
      );
    }
    return (
      <View style={styles.bigcontainer}>
        <ScrollView style={styles.container} ref="scrollView">
          <View style={styles.locate}>
            <View style={styles.boxheader}>
              <Text style={styles.headertext}>定位城市</Text>
            </View>
            {locatecitydom}
          </View>
          <View style={styles.hotcity}>
            <View style={styles.boxheader}>
              <Text style={styles.headertext}>热门城市</Text>
            </View>
            {this._renderHotCities()}
          </View>
          <View style={styles.citylist}>
            <ListView
              ref = 'list'
              style={styles.listview}
              dataSource={this.state.dataSource}
              onChangeVisibleRows={(visibleRows, changedRows) => console.log('onChangeVisibleRows')}
              renderSectionHeader={this.renderSectionHeader}
              renderRow={this.renderRow}
              initialListSize={10}
              pageSize={4}
              scrollRenderAheadDistance={500}
            />
          </View>
        </ScrollView>
        <View style={styles.sidebar}>
          {this._renderSidebar()}
        </View>
      </View>
    );
  },

  _onPressHeader: function() {
    var config = layoutAnimationConfigs[Math.floor(this.state.headerPressCount / 2) % layoutAnimationConfigs.length];
    LayoutAnimation.configureNext(config);
    this.setState({headerPressCount: this.state.headerPressCount + 1});
  },

  _loadPage: function(component, title){
    this.props.navigator.push({
      title: title,
      component: component,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
    });
  },

  _clear: function(){
    this.props.navigator.pop();
    AsyncStorage.clear();
  }

});

var styles = StyleSheet.create({
  bigcontainer:{
    flex:1,
  },
  container:{
    flex:1,
    backgroundColor:'#f9f9f9',
    backgroundColor:'#fff',
  },
  locate:{

  },
  hotcity:{
  },
  boxheader:{
    flex:1,
    height:40,
    paddingLeft:15,
    paddingRight:15,
    justifyContent:'center',
  },
  headertext:{
    fontSize:11,
    color:'#666',
  },
  onelinehotcity:{
    flex:1,
    flexDirection:'row',
    marginBottom:15,
  },
  citybtn:{
    flex:1,
    width:(Dimensions.get('window').width-60)/3,
    height:40,
    borderWidth:1,
    borderColor:'#e5e5e5',
    borderRadius:4,
    backgroundColor:'#f8f9fa',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:15,
  },
  citybtntext:{
    color:'#333',
    fontSize:15,
  },
  section:{
    flex:1,
    justifyContent:'center',
    backgroundColor:'#f7f7f7',
    height:28,
    paddingLeft:15,
  },
  sectiontext:{
    fontSize:15,
    fontWeight:'bold',
    color:'#333',
  },
  row:{
    flex:1,
    justifyContent:'center',
    backgroundColor:'#fff',
    height:44,
    paddingLeft:15,
  },
  rowtext:{
    fontSize:15,
    color:'#333',
  },
  sidebar:{
    flex:1,
    flexDirection:'column',
    position:'absolute',
    top:(Dimensions.get('window').height-450)/2,
    right:5,
  },
  letter:{
    flex:1,
    paddingTop:1,
    paddingLeft:2,
    paddingRight:2,
    paddingBottom:1,
    backgroundColor:'rgba(0,0,0,0)',
  },
  lettertext:{
    color:'#007aff',
    fontSize:12,
    fontWeight:'bold'
  },
  applybtn:{
    position:'absolute',
    left:0,
    bottom:68,
    width:Dimensions.get('window').width,
    height:68,
    borderTopWidth:Util.pixel,
    borderTopColor:'#dfdfdf',
    backgroundColor:'#fff',
  },
  bluebtn:{
    backgroundColor:'#51a7ff',
    borderRadius:5,
    marginTop:15,
    marginLeft:15,
    marginRight:15,
    height:40,
    justifyContent:'center',
    alignItems:'center',
  },
  bluebtntext:{
    color:'#fff',
    fontSize:17,
  },
  nocitybtn:{
    flex:1,
    width:(Dimensions.get('window').width-30),
    height:40,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:15,
    borderRadius:4,
    borderWidth:1,
    borderColor:'#ff7651',
  },
  nocitybtntext:{
    color:'#ffaa93',
    fontSize:15,
  }
});

var animations = {
  layout: {
    spring: {
      duration: 750,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.4,
      },
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    },
  },
};

var layoutAnimationConfigs = [
  animations.layout.spring,
  animations.layout.easeInEaseOut,
];

module.exports = SelectCity;
