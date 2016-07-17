
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';
import Service from './../service';
import CameraPicker from './camerapicker';
import qiniu from 'react-native-qiniu';
import Modal from 'react-native-simple-modal';
import ImageResizer from 'react-native-image-resizer';

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

var UpdateImg = React.createClass({
  mixins: [Subscribable.Mixin],
  getInitialState: function(){
    return {
      open: false,
      offset:150,
      // hasimgs:[], // 已存在图片
      // displayhasimgs:[], // 要显示的已存在图片
      taskOrderPhotoList:[],
      lifeimgs:[],
      zmimgs:[],
      shouldbeupload:0,
      imguploaded:0,
      imgs:[],
      displayimgs:[],
      uploaded:0,
    };
  },
  componentWillMount:function(){
    var that = this;
    this.eventEmitter = new EventEmitter();
    this.setState({
      id:this.props.taskId
    });
    this.getDetail();
  },
  getDetail:function(){
    var that = this;
    Util.get(Service.host + Service.getTaskDetail, {taskId:this.props.taskId}, function(data){
      console.log(data);
      if(data.code == 200){
        var temp = [];
        var disptemp = [];
        if(data.data.response.taskOrderPhotoList && data.data.response.taskOrderPhotoList.length>0){
          for(var i=0;i<data.data.response.taskOrderPhotoList.length;i++){
            temp.push({uri:data.data.response.taskOrderPhotoList[i].photoUrl});
            disptemp.push(data.data.response.taskOrderPhotoList[i].photoUrl+'?imageView2/1/w/170/h/170');
          }
        }
        that.setState({
          merchantInfoDto:data.data.response.merchantInfoDto,
          task:data.data.response.task,
          taskPhotoList:data.data.response.taskPhotoList,
          status:data.data.response.status,
          zmimgs:temp,
          taskOrderPhotoList:disptemp,
          imgs:data.data.response.taskPhotoList,
          content:data.data.response.task.taskText,
          uploaded:temp.length,
        });
      }else{
        AlertIOS.alert('提醒',data.messages[0].message);
      }
    });
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
          console.log(img);
          ImageResizer.createResizedImage(img, 800, 600, 'JPEG', 60)
          .then((resizedImageUri) => {
            Util.get(Service.host + Service.getToken, {bucketName:'ny-task-photo'}, function(data){
              console.log(data);
              if(data.code == 200){
                var token = data.data.response.token;
                var url = data.data.response.url;
                var key = data.data.response.key;
                qiniu.rpc.uploadImage(resizedImageUri, key, token, function (resp) {
                   console.log(resp);
                   console.log(url);
                   if(resp.status == 200 && resp.ok == true){
                     that.state.zmimgs.push({uri:url});
                     that.state.taskOrderPhotoList.push(url+'?imageView2/1/w/170/h/170');
                     that.setState({
                       zmimgs: that.state.zmimgs,
                       taskOrderPhotoList:that.state.taskOrderPhotoList
                     });
                     // 保存图片地址到服务器
                     Util.get(Service.host + Service.uploadOrderPhoto, {
                       taskId:taskId,
                       photoUrl:url,
                     }, function(data){
                       console.log(data);
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
                          //  Util.get(Service.host + Service.sureOrder, {
                          //    taskId:taskId
                          //  }, function(data){
                          //    console.log(data);
                          //    if(data.code == 200){
                          //      AlertIOS.alert('提醒',
                          //      '任务提交成功, 请耐心等待审核',
                          //      [
                          //        {text: '确认', onPress: () => that.getDetail()},
                          //      ]
                          //    );
                          //    }else{
                          //      AlertIOS.alert('提醒',data.messages[0].message);
                          //    }
                          //  });
                         }
                       }else{

                       }
                     });
                   }
                });
              }else{

              }
            });
          }).catch((err) => {
            console.log(err);
          });

        })(args.images[i],args.taskId)
      }
    });

    //从applytask回来的时候，刷新页面
    this.props.navigator.navigationContext.addListener('didfocus', (event) => {
      // this.currentRoute will go away
      // event.data.route will be focused
      console.log(event.data.route);
      if(event.data.route.title == '任务详情'){
        that.getDetail();
      }

    });
  },
  _uploadImgs:function(){
    var that = this;
    var title = '';
    if(that.state.lifeimgs.length==9){
      AlertIOS.alert('提醒','您已有9张证明图片,无法再上传');
      return false;
    }else if(that.state.lifeimgs.length==0){
      title = '选择最多9张证明图片';
    }else if(that.state.lifeimgs.length<9 && that.state.lifeimgs.length>0){
      title = '您还可以上传'+(9-that.state.lifeimgs.length)+'张证明图片';
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
  _uploadZM:function(taskId){
    var that = this;
    var title = '';
    if(that.state.zmimgs.length==9){
      AlertIOS.alert('提醒','您已有9张证明照片,无法再上传');
      return false;
    }else if(that.state.zmimgs.length==0){
      title = '选择最多9张证明照片';
    }else if(that.state.zmimgs.length<9 && that.state.zmimgs.length>0){
      title = '您还可以上传'+(9-that.state.zmimgs.length)+'张证明照片';
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
          type:'tasking',
          taskId:taskId,
          leftnum:9-that.state.zmimgs.length,
          title:title
      }
    });
  },
  _delimg:function(n){
    var temp = [];
    var displaytemp = [];
    for(var i=0;i<this.state.zmimgs.length;i++){
      if(i!=n){
        temp.push(this.state.zmimgs[i]);
      }else{
        // 向服务端删除图片
        Util.get(Service.host + Service.deleteOrderPhoto, {
          photoUrl:this.state.zmimgs[i].uri
        }, function(data){
          console.log(data);
          if(data.code == 200){
          }
        });
      }
    }
    for(var i=0;i<this.state.taskOrderPhotoList.length;i++){
      if(i!=n){
        displaytemp.push(this.state.taskOrderPhotoList[i]);
      }
    }
    this.setState({
      zmimgs:temp,
      taskOrderPhotoList:displaytemp,
    });
  },
  _submitRZ: function(){
    var that = this;
    //submitVerify
    if(this.state.zmimgs.length>0){
      Util.get(Service.host + Service.sureOrder, {
        taskId:this.state.id,
      }, function(data){
        console.log(data);
        if(data.code == 200){
          AlertIOS.alert('提醒',
          '任务提交成功, 请耐心等待审核',
          [
            {text: '确认', onPress: () => that.props.navigator.pop()},
          ]
        );
        }else{
          AlertIOS.alert('提醒',data.messages[0].message);
        }
      });
    }else{
      AlertIOS.alert('提醒','请先上传你的证明照片!');
    }

  },
  _delimg:function(n){
    var that = this;
    var temp = [];
    var displaytemp = [];
    for(var i=0;i<this.state.zmimgs.length;i++){
      if(i!=n){
        temp.push(this.state.zmimgs[i]);
      }else{
        // 向服务端删除图片
        Util.get(Service.host + Service.deleteOrderPhoto, {
          photoUrl:this.state.zmimgs[i].uri
        }, function(data){
          console.log(data);
          if(data.code == 200){
            var up = that.state.uploaded-1;
            that.setState({
              uploaded:up,
            })
          }
        });
      }
    }
    for(var i=0;i<this.state.taskOrderPhotoList.length;i++){
      if(i!=n){
        displaytemp.push(this.state.taskOrderPhotoList[i]);
      }
    }
    this.setState({
      zmimgs:temp,
      taskOrderPhotoList:displaytemp,
    });
  },
  render: function(){
    var that = this;
    var zmimgs = [];
    var imgs = [];
    if(this.state.taskOrderPhotoList && this.state.taskOrderPhotoList.length>0){
      console.log(this.state.taskOrderPhotoList);
      for(var i=0; i< this.state.taskOrderPhotoList.length;i++){
        // TODO:做四行，用justifyContent: 'space-around',
        (function(n){
          imgs.push(
            <View style={styles.uploadimg}>
            <Image resizeMode={'contain'} style={styles.zmimg2} source={{uri:that.state.taskOrderPhotoList[n]}}></Image>
              <TouchableOpacity onPress={()=>that._delimg(n)}>
                <Text style={styles.delimg}>删除</Text>
              </TouchableOpacity>
            </View>
          );
        })(i)
      }
      zmimgs.push(
        <View style={[styles.beizhu,{marginBottom:60}]}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian1')}></Image>
              <Text style={styles.box_title_text}>图片证明</Text>
            </View>
          </View>
          <View style={styles.bz_content3}>
            <View style={styles.zmimgs}>
              {imgs}
            </View>
          </View>
        </View>
      );
    }else{
      <View />
    }
    return (
      <View style={styles.container}>
      <ScrollView style={styles.scrollbox}>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}>请上传任务证明图片9张</Text>
        </View>
        <TouchableOpacity onPress={()=>this._uploadZM(this.props.taskId)}>
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
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/zmtp1.jpg')}></Image>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/zmtp2.png')}></Image>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/zmtp3.jpg')}></Image>
              <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/zmtp4.jpg')}></Image>
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
          {zmimgs}
        </View>
      </ScrollView>
      <View style={styles.applybtn}>
        <TouchableOpacity onPress={this._submitRZ}>
          <View style={styles.bluebtn}>
            <Text style={styles.bluebtntext}>完成任务证明图片上传</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal
         offset={this.state.offset}
         open={this.state.open}
         modalDidOpen={() => console.log('modal did open')}
         modalDidClose={() => undefined}
         style={{alignItems: 'center'}}
         closeOnTouchOutside={false}
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
  },
  zmimgs:{
    flex:1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom:10,
  },
  uploadimg:{
    marginRight:1,
    marginBottom:8,
    width:(Dimensions.get('window').width-30-4)/4,
  },
  zmimg2:{
    alignItems:'center',
    justifyContent:'center',
    width:(Dimensions.get('window').width-30-4)/4,
    height:(Dimensions.get('window').width-30-4)/4,
  },
});

module.exports = UpdateImg;
