
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';
import FileDownload from 'react-native-file-download';
import RNFS from 'react-native-fs';
import Modal from 'react-native-simple-modal';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  AsyncStorage,
  Dimensions,
  Clipboard,
  Alert,
  ActivityIndicatorIOS,
  CameraRoll,
  AlertIOS,
} from 'react-native';

var ApplyTask = React.createClass({
  getInitialState: function(){
    return {
      content: this.props.content,
      imgs:this.props.imgs
    };
  },
  componentDidMount:function(){
    this.setState({
      id:this.props.id,
    });
  },
  _copy:function(){
    Clipboard.setString(this.state.content);
    //去微信发朋友圈吧，至少保持2小时候后才能截图哦。
    AlertIOS.alert('复制成功!','去微信发朋友圈吧，至少保持2小时候后才能截图哦。');
  },
  _download:function(){
    var that  = this;
    var count = this.props.imgs.length;
    var c = 0;
    that.setState({
      open2:true,
    });
    for(var i=0;i<this.props.imgs.length;i++){
      var URL = this.props.imgs[i].photoUrl;
      (function(url){
        CameraRoll.saveImageWithTag(url, function(data) {
          console.log(data);
          c++;
          if(c == count){
            that.setState({
              open2:false,
            });
            Alert.alert('下载成功');
          }
        }, function(err) {
          console.log(err);
        });
      })(URL);
    }
  },
  render: function(){
    // 需要增加数量的显示，对照UI
    var imgdom = [];
    var shareimgs = [];
    if(this.state.imgs && this.state.imgs.length>0){
      for(var i=0;i<this.state.imgs.length; i++){
        shareimgs.push(
          <Image resizeMode={'contain'} style={styles.shareimg} source={{uri:this.state.imgs[i].photoUrl+'?imageView2/1/w/170/h/170'}}></Image>
        );
      }
    }else{
      shareimgs.push(<View />);
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}><Text style={styles.emtext}>1</Text>,请下载所有图片至手机相册!</Text>
        </View>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian')}></Image>
              <Text style={styles.box_title_text}>图片</Text>
            </View>
          </View>
          <View style={styles.bz_content3}>
            <View style={styles.shareimgs}>
              {shareimgs}
            </View>
          </View>
          <TouchableOpacity onPress={this._download}>
            <View style={styles.circle}>
              <Image resizeMode={'contain'} style={styles.circleimg} source={require('image!download')}></Image>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}><Text style={styles.emtext}>2</Text>,请复制文字并与图片一起发送至朋友圈</Text>
        </View>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!text')}></Image>
              <Text style={styles.box_title_text}>文字</Text>
            </View>
          </View>
          <View style={styles.bz_content}>
            <Text style={styles.bz_content_text}>
              {'\t'}{this.props.content}
            </Text>
          </View>
          <TouchableOpacity onPress={this._copy}>
            <View style={styles.circle}>
              <Image resizeMode={'contain'} style={styles.circleimg} source={require('image!copy')}></Image>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
           offset={this.state.offset2}
           open={this.state.open2}
           modalDidOpen={() => console.log('modal did open')}
           modalDidClose={() => undefined}
           style={{alignItems: 'center'}}
           closeOnTouchOutside={false}
           overlayOpacity={0.3}>
           <View style={styles.modalbox}>
              <ActivityIndicatorIOS style={styles.modalindicator} color="#999" />
              <Text style={styles.modaltext}>正在下载图片...</Text>
           </View>
        </Modal>
      </ScrollView>
    );
  },

});

var styles = StyleSheet.create({
  container:{
    flex:1,
    marginBottom:40,
  },
  warning:{
    flex:1,
    flexDirection:'row',
    paddingLeft:15,
    paddingRight:15,
    height:44,
    backgroundColor:'#fff',
    borderBottomWidth:Util.pixel,
    borderBottomColor:'#dfdfdf',
  },
  warningimg:{
    width:16,
    height:16,
    marginRight:4,
    marginTop:16,
  },
  warningtext:{
    marginTop:12,
    color:'#51a7ff',
    fontSize:16,
    fontWeight:'bold',
  },
  beizhu:{
    flex:1,
    backgroundColor:'#fff',
    borderBottomWidth:Util.pixel,
    borderBottomColor:'#dfdfdf',
  },
  bz_header:{
    flex:1,
    height:50,
    paddingTop:20,
    paddingLeft:15,
  },
  box_title:{
    flex:1,
    flexDirection:'row',
  },
  box_title_img:{
    width:16,
    height:16,
    marginRight:4,
  },
  box_title_text:{
    color:'#333',
    fontSize:15,
  },
  bz_content:{
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
  },
  bz_content2:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
  },
  bz_content_text:{
    color:'#666',
    fontSize:15,
  },
  bbox:{
    flex:3,
    height:170,
  },
  sbox:{
    flex:1,
    flexDirection:'column',
    justifyContent:'space-around',
    height:170,
  },
  bimg:{
    flex:1,
    width:(Dimensions.get('window').width-40)*3/4,
  },
  simg:{
    flex:1,
    width:(Dimensions.get('window').width-40)*1/4,
  },
  circle:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:20,
  },
  circleimg:{
    width:60,
    height:60,
  },
  shareimgs:{
    flex:1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom:10,
  },
  shareimg:{
    marginRight:1,
    marginBottom:1,
    alignItems:'center',
    justifyContent:'center',
    width:(Dimensions.get('window').width-30)/4,
    height:(Dimensions.get('window').width-30)/4,
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
  },
  emtext:{
    color:'#51a7ff',
    fontSize:21,
    fontWeight:'bold',
  },
});

module.exports = ApplyTask;
