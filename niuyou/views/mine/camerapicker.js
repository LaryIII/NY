import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  AlertIOS,
} from 'react-native';

import CameraRollPicker from 'react-native-camera-roll-picker';

const CameraPicker =  React.createClass ({
  getInitialState: function() {
    return {
      num: 0,
    };
  },

  getSelectedImages: function(images) {
    var num = images.length;
    console.log(images);
    this.setState({
      num: num,
      images:images,
    });
  },
  _cancel:function(){
    this.props.navigator.pop();
  },
  _finish:function(){
    var that = this;
    // 发送事件
    if(this.state.num>0){
      that.props.events.emit('upload_imgs', this.state.images);
      this.props.navigator.pop();
    }else{
      AlertIOS.alert('提醒','请先上传图片');
    }

  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={this._cancel}>
            <View style={styles.cancelbtn}>
              <Text style={styles.canceltext}>取消</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.text}>
            <Text style={styles.bold}>请选择最多9张生活照片</Text>
          </View>
          <TouchableOpacity onPress={this._finish}>
            <View style={styles.finishbtn}>
              <Text style={styles.finishtext}>完成</Text>
            </View>
          </TouchableOpacity>
        </View>
        <CameraRollPicker
          groupTypes='SavedPhotos'
          batchSize={25}
          maximum={9}
          assetType='Photos'
          imagesPerRow={3}
          imageMargin={5}
          callback={this.getSelectedImages} />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    marginTop: 15,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width:Dimensions.get('window').width,
  },
  cancelbtn:{
    width:70,
    alignItems: 'center',
  },
  canceltext:{
    color:'#666',
    fontSize:15,
  },
  finishbtn:{
    width:70,
    alignItems: 'center',
  },
  finishtext:{
    color:'#51a7ff',
    fontSize:15,
  },
  text: {
    width:Dimensions.get('window').width-140,
    alignItems: 'center',
    color: '#333',
  },
  bold: {
    fontSize: 16,
  },
  info: {
    fontSize: 12,
  },
});

module.exports = CameraPicker;
