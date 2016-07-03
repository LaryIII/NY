
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';
import Service from './../service';
import CameraPicker from './camerapicker';
import qiniu from 'react-native-qiniu';
import Modal from 'react-native-simple-modal';

var EventEmitter = require('EventEmitter');
var Subscribable = require('Subscribable');
window.EventEmitter = EventEmitter;
window.Subscribable = Subscribable;

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
  AlertIOS,
  ActivityIndicatorIOS,
} from 'react-native';

var Authinfo3 = React.createClass({
  mixins: [Subscribable.Mixin],
  getInitialState: function(){
    return {
      open: false,
      offset:150,
      // hasimgs:[], // 已存在图片
      // displayhasimgs:[], // 要显示的已存在图片
      lifeimgs:[],
      displaylifeimgs:[],
      shouldbeupload:0,
      imguploaded:0,
    };
  },
  componentWillMount:function(){
    var that = this;
    this.eventEmitter = new EventEmitter();
    // 获得已经上传的图片
    Util.get(Service.host + Service.getPersonalPhoto, {
    }, function(data){
      console.log(data);
      if(data.code == 200){
        var imgs = data.data.response.list;
        var displayimgs = [];
        for(var i=0;i<imgs.length;i++){
          if(imgs[i].photoUrl == "[object Object]"){
            // 如果是之前的错误假数据，则删掉
            Util.get(Service.host + Service.deletePersonalPhoto, {
              photoUrl:imgs[i].photoUrl
            }, function(data){
              console.log(data);
              if(data.code == 200){
              }
            });
          }else{
            displayimgs.push(imgs[i].photoUrl+'?imageView2/1/w/170/h/170');
          }

        }
        that.setState({
          lifeimgs:imgs,
          displaylifeimgs:displayimgs,
        });
      }
    });
  },
  componentDidMount:function(){
    var that = this;
    this.addListenerOn(this.eventEmitter, 'upload_imgs',  function(imgs){
      console.log('upload_imgs');
      //upload file to Qiniu
      that.setState({
        open:true,
      });
      that.setState({
        shouldbeupload:imgs.length,
      });
      for(var i=0;i<imgs.length;i++){
        (function(img){
          Util.get(Service.host + Service.getToken, {bucketName:'ny-personal-photo'}, function(data){
            console.log(data);
            if(data.code == 200){
              var token = data.data.response.token;
              var url = data.data.response.url;
              var key = data.data.response.key;
              qiniu.rpc.uploadImage(img, key, token, function (resp) {
                 console.log(resp);
                 console.log(url);
                 if(resp.status == 200 && resp.ok == true){
                   that.state.lifeimgs.push(url);
                   that.state.displaylifeimgs.push(url+'?imageView2/1/w/170/h/170');
                   that.setState({
                     lifeimgs: that.state.lifeimgs,
                     displaylifeimgs:that.state.displaylifeimgs,
                   });

                   // 保存到服务器
                   Util.get(Service.host + Service.uploadPersonalPhoto, {
                     photoUrl:url
                   }, function(data){
                     console.log(data);
                     if(data.code == 200){
                       var num = that.state.imguploaded;
                       num = num+1;
                       console.log(num);
                       that.setState({
                         imguploaded:num,
                       });
                       if(that.state.imguploaded == that.state.shouldbeupload){
                         that.setState({
                           open:false,
                         });
                       }
                     }
                   });
                 }
              });
            }else{

            }
          });
        })(imgs[i])
      }
    });
  },
  _uploadImgs:function(){
    var that = this;
    var title = '';
    if(that.state.lifeimgs.length==9){
      AlertIOS.alert('提醒','您已有9张生活照,无法再上传');
      return false;
    }else if(that.state.lifeimgs.length==0){
      title = '选择最多9张生活照片';
    }else if(that.state.lifeimgs.length<9 && that.state.lifeimgs.length>0){
      title = '您还可以上传'+(9-that.state.lifeimgs.length)+'张生活照';
    }
    that.props.navigator.push({
      title: title,
      component: CameraPicker,
      navigationBarHidden:true,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      // leftButtonTitle: "返回",
      // leftButtonIcon:require('image!back1'),
      // onLeftButtonPress: ()=>that.props.navigator.pop(),
      passProps: {
          events: that.eventEmitter,
          type:'authinfo3',
          leftnum:9-that.state.lifeimgs.length,
          title:title
      }
    });
  },
  _submitRZ: function(){
    var that = this;
    //submitVerify
    if(this.state.lifeimgs.length>0){
      Util.get(Service.host + Service.submitVerify, {

      }, function(data){
        console.log(data);
        if(data.code == 200){
          AlertIOS.alert('提醒',
          '认证提交成功，请耐心等待审核',
          [
            {text: '确认', onPress: () => that.props.navigator.popToTop()},
          ]
        );
        }else{
          AlertIOS.alert('提醒',data.messages[0].message);
        }
      });
    }else{
      AlertIOS.alert('提醒','请先上传你的生活照片!');
    }

  },
  _delimg:function(n){
    var temp = [];
    var displaytemp = [];
    for(var i=0;i<this.state.lifeimgs.length;i++){
      if(i!=n){
        temp.push(this.state.lifeimgs[i]);
      }else{
        // 向服务端删除图片
        Util.get(Service.host + Service.deletePersonalPhoto, {
          photoUrl:this.state.lifeimgs[i]
        }, function(data){
          console.log(data);
          if(data.code == 200){
          }
        });
      }
    }
    for(var i=0;i<this.state.displaylifeimgs.length;i++){
      if(i!=n){
        displaytemp.push(this.state.displaylifeimgs[i]);
      }
    }
    this.setState({
      lifeimgs:temp,
      displaylifeimgs:displaytemp,
    });
  },
  render: function(){
    var that = this;
    var mylifeimgdom = [];
    if(this.state.displaylifeimgs.length>0){
      for(var i=0;i<this.state.displaylifeimgs.length;i++){
        (function(n){
          mylifeimgdom.push(
            <View style={styles.uploadimg}>
              <Image resizeMode={'contain'} style={styles.upimg} source={{uri:that.state.displaylifeimgs[i]}}></Image>
              <TouchableOpacity onPress={()=>that._delimg(n)}>
                <Text style={styles.delimg}>删除</Text>
              </TouchableOpacity>
            </View>
          );
        })(i)
      }

    }else{
      mylifeimgdom.push(<View />);
    }
    return (
      <View style={styles.container}>
      <ScrollView style={styles.scrollbox}>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}>请上传个人生活照片9张</Text>
        </View>
        <TouchableOpacity onPress={this._uploadImgs}>
          <View style={styles.circle}>
            <Image resizeMode={'contain'} style={styles.circleimg} source={require('image!upload')}></Image>
          </View>
        </TouchableOpacity>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian')}></Image>
              <Text style={styles.box_title_text}>示例证明</Text>
            </View>
          </View>
          <View style={styles.bz_content3}>
            <View style={styles.zmimgs}>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/lifeimg1.jpg')}></Image>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/lifeimg2.jpg')}></Image>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/lifeimg3.jpg')}></Image>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/lifeimg4.jpg')}></Image>
            </View>
          </View>
        </View>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian')}></Image>
              <Text style={styles.box_title_text}>上传图片</Text>
            </View>
          </View>
          <View style={styles.bz_content3}>
            <View style={styles.uploadimgs}>
              {mylifeimgdom}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.applybtn}>
        <TouchableOpacity onPress={this._submitRZ}>
          <View style={styles.bluebtn}>
            <Text style={styles.bluebtntext}>提交认证</Text>
          </View>
        </TouchableOpacity>
      </View>
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
  container:{
    flex:1,
  },
  scrollbox:{
    flex:1,
    backgroundColor:'#f9f9f9',
    marginBottom:135,
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
    marginTop:12,
  },
  warningtext:{
    marginTop:12,
    color:'#333',
    fontSize:15,
  },
  beizhu:{
    flex:1,
    backgroundColor:'#fff',
    borderBottomWidth:Util.pixel,
    borderBottomColor:'#dfdfdf',
    marginBottom:15,
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
  bz_content3:{
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
    flex:1,
    height:170,
  },
  bimg:{
    flex:1,
  },
  circle:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
    marginBottom:20,
  },
  circleimg:{
    width:60,
    height:60,
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
  zmimgs:{
    flex:1,
    flexDirection:'row',
  },
  zmimg:{
    width:(Dimensions.get('window').width-34)/4,
    height:(Dimensions.get('window').width-34)/4,
  },
  uploadimgs:{
    flex:1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  uploadimg:{
    marginRight:1,
    marginBottom:8,
    width:(Dimensions.get('window').width-30-4)/4,
  },
  upimg:{
    alignItems:'center',
    justifyContent:'center',
    width:(Dimensions.get('window').width-30-4)/4,
    height:(Dimensions.get('window').width-30-4)/4,
  },
  delimg:{
    color:'#f02626',
    fontSize:15,
    marginTop:4,
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
});

module.exports = Authinfo3;
