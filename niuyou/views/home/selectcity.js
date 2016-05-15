/**
 * Created by vczero on 15/7/12.
 */

import React, { Component } from 'react';
import Util from './../utils';
import City from './city';
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
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
      headerPressCount: 0,
    };
  },
  _renderHotCities:function(){
    var hotcities = [['上海','北京','苏州'],['杭州','郑州','广州'],['深圳','重庆','成都']];
    var citydoms = [];
    for(var i in hotcities){
      citydoms.push(
        <View style={styles.onelinehotcity}>
          <TouchableOpacity>
            <View style={styles.citybtn}>
              <Text style={styles.citybtntext}>{hotcities[i][0]}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.citybtn}>
              <Text style={styles.citybtntext}>{hotcities[i][1]}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.citybtn}>
              <Text style={styles.citybtntext}>{hotcities[i][2]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return citydoms;
  },


  renderRow: function(rowData: string, sectionID: string, rowID: string): ReactElement {
    return (
      <View style={styles.row}>
        <Text style={styles.rowtext}>{rowData}</Text>
      </View>
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
    var letters = City.letter;
    var cities = City.cities;
    var letterdom = [];
    var top = 286;
    for(var i = 0; i<letters.length; i++){
      if(i>=1){
        top += cities[letters[i-1]].length*44+28;
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

  render: function(){
    var items = this.state.items;
    return (
      <View style={styles.bigcontainer}>
        <ScrollView style={styles.container} ref="scrollView">
          <View style={styles.locate}>
            <View style={styles.boxheader}>
              <Text style={styles.headertext}>定位城市</Text>
            </View>
            <TouchableOpacity>
              <View style={styles.citybtn}>
                <Text style={styles.citybtntext}>南京</Text>
              </View>
            </TouchableOpacity>
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
              onChangeVisibleRows={(visibleRows, changedRows) => console.log({visibleRows, changedRows})}
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
      leftButtonIcon:require('image!back'),
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
