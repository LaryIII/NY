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
      if(that.props.type == "authinfo3"){
        if(this.state.num>this.props.leftnum){
          AlertIOS.alert('提醒','图片数量超出限制，您还可以上传'+this.props.leftnum+'张');
        }else{
          that.props.events.emit('upload_imgs', this.state.images);
          this.props.navigator.pop();
        }
      }else if(that.props.type == "tasking" && that.props.taskId){
        if(this.state.num>this.props.leftnum){
          AlertIOS.alert('提醒','图片数量超出限制，您还可以上传'+this.props.leftnum+'张');
        }else{
          that.props.events.emit('upload_imgs2', {
            images:that.state.images,
            taskId:that.props.taskId
          });
          this.props.navigator.pop();
        }

      }
    }else if(this.state.num == 0){
      AlertIOS.alert('提醒','请先选择图片');
    }else if(this.state.num > 9){
      lertIOS.alert('提醒','上传图片超出数量限制');
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
            <Text style={styles.bold}>{this.props.title}</Text>
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
