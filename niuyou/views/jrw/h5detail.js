
import React, { Component } from 'react';
import Util from './../utils';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  WebView,
  Dimensions,
} from 'react-native';

var H5Detail = React.createClass({
  getInitialState: function(){
    return {
      url:this.props.url,
    };
  },
  componentWillMount:function(){

  },
  render: function(){
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollbox}>
          <WebView
          style={styles.webView}
          userAgent="nuu"
          ref="webview"
          javaScriptEnabled={true}
          domStorageEnabled={true}
          source={{uri:this.state.url,headers:{nuu:'nuu'}}}/>
          </ScrollView>
      </View>
    );
  },


});

var styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#f9f9f9',
  },
  scrollbox:{
    flex:1,
    backgroundColor:'#f9f9f9',
  },
  webView:{
    flex:1,
    height:Dimensions.get('window').height-64,
    backgroundColor:'#fff',
  }
});

module.exports = H5Detail;
