
import React, { Component } from 'react';
import Util from './../utils';
import ApplyTask from './applytask';
import Service from './../service';
import Login from './../user/login';
import FileDownload from 'react-native-file-download';
import RNFS from 'react-native-fs';
import moment from 'moment';
import qiniu from 'react-native-qiniu';
import Modal from 'react-native-simple-modal';
import CameraPicker from './../mine/camerapicker';
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
  Clipboard,
  Alert,
  ActivityIndicatorIOS,
} from 'react-native';

var TaskDetail = React.createClass({
  mixins: [Subscribable.Mixin],
  getInitialState: function(){
    return {
      merchantInfoDto:{
        id:0,
        merchantLevel:0,
        merchantLogo:'',
        merchantName:''
      },
      task:{
        createTime:'',
        gender:1,
        id:0,
        isSettle:0,
        mainPhotoUrl:'',
        merchantId:0,
        noPassReason:'',
        orderPeopleNum:'',
        passTime:'',
        peopleNum:'',
        price:'',
        showBeginTime:'',
        showEndTime:'',
        status:'',
        taskDes:'',
        taskEndTime:'',
        taskName:'',
        taskText:'',
        updateTime:'',
      },
      taskPhotoList:[
        {
          createTime:'',
          id:0,
          num:1,
          photoUrl:'',
          taskId:0,
          updateTime:''
        }
      ],
      taskOrderPhotoList:[],
      status:1,
      content: '',
      imgs:[],
      displayimgs:[],
      scrollbottom:60,

      open: false,
      offset:150,
      lifeimgs:[],
      zmimgs:[],
      uploaded:0,
    };
  },
  componentWillMount:function(){
    this.eventEmitter = new EventEmitter();
    this.setState({
      id:this.props.id
    });
    var that = this;
    Util.get(Service.host + Service.getTaskDetail, {taskId:this.props.id}, function(data){
      console.log(data);
      if(data.code == 200){
        var temp = [];
        var disptemp = [];
        for(var i=0;i<data.data.response.taskOrderPhotoList.length;i++){
          temp.push({uri:data.data.response.taskOrderPhotoList[i].photoUrl});
          disptemp.push(data.data.response.taskOrderPhotoList[i].photoUrl+'?imageView2/1/w/170/h/170');
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
  _gotoApplyTask: function(){
    var that = this;
    // 先调用接口申请任务，然后跳转到接任务的详细步骤页面
    // 需要先登录
    Util.get(Service.host + Service.receiveOrder, {taskId:this.props.id}, function(data){
      console.log(data);
      if(data.code == 200){
        // 去接任务界面
        that.props.navigator.push({
          title: '接任务',
          component: ApplyTask,
          navigationBarHidden:false,
          // backButtonTitle: "返回",
          // backButtonIcon: require('image!back'),
          leftButtonTitle: "返回",
          leftButtonIcon:require('image!back1'),
          onLeftButtonPress: ()=>that.props.navigator.pop(),
          passProps: {
            id:that.props.id,
            content:that.state.task.taskText,
            imgs:that.state.taskPhotoList,
          }
        });
      }else if(data.code == 600){
        // 跳转登录，登录后回来
        that.props.navigator.push({
          title: '登录',
          component: Login,
          navigationBarHidden:false,
          // backButtonTitle: "返回",
          // backButtonIcon: require('image!back'),
          leftButtonTitle: "返回",
          leftButtonIcon:require('image!back1'),
          onLeftButtonPress: ()=>that.props.navigator.pop(),
        });
      }else{
        // 500 提示错误信息
        AlertIOS.alert('提醒',data.messages[0].message);
      }
    });
  },
  _copy:function(){
    Clipboard.setString(this.state.content);
    Alert.alert("复制成功!");
    // try {
    //   var content = Clipboard.getString();
    //   this.setState({content:content});
    // } catch (e) {
    //   this.setState({content:e.message});
    // }
  },
  _download:function(){
    for(var i=0;i<this.state.imgs.length;i++){
      var URL = this.state.imgs[i].photoUrl;
      var DEST = RNFS.DocumentDirectoryPath;
      var arrs = URL.split('.');
      var fileName = new Date().getTime()+i*10000+'.'+arrs[arrs.length-1];
      console.log(fileName);
      var headers = {
        'Accept-Language':'zh-CN'
      };
      (function(URL,DEST,fileName,headers,n,length){
        var flag = false;
        console.log(n,length);
        if(n==length-1){
          flag = true;
        }
        FileDownload.download(URL, DEST, fileName, headers)
        .then((response) => {
          if(flag){
            Alert.alert('下载成功');
          }
          console.log(`downloaded! file saved to: ${response}`)
        })
        .catch((error) => {
          console.log(error)
        })
      })(URL,DEST,fileName,headers,i,this.state.imgs.length)
    }

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
  render: function(){
    var that = this;
    var zmimgs = [];
    var imgs = [];
    var applybtn = [];
    var shareimgs = [];
    var stars = [];
    var scrollbottom = 0;
    var paddingBottom = 0;
    // 这边搞错了，taskPhotoList是用户需要分享的图片，而不是证明图片
    if(this.state.taskOrderPhotoList && this.state.taskOrderPhotoList.length>0){
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
    if(this.state.status == 1){
      // status:1领取任务 2上传图片 2不展示
      applybtn.push(
        <View style={styles.applybtn}>
          <TouchableOpacity onPress={this._gotoApplyTask}>
            <View style={styles.bluebtn}>
              <Text style={styles.bluebtntext}>申请任务</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
      scrollbottom=135;
    }else if(this.state.status == 2){
      applybtn.push(
        <View style={styles.applybtn}>
          <TouchableOpacity onPress={()=>this._uploadZM(this.props.id)}>
            <View style={styles.bluebtn}>
              <Text style={styles.bluebtntext}>上传证明图片</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
      scrollbottom=135;
    }else{
      applybtn.push(<View />);
      paddingBottom = 135;
    }

    if(this.state.taskPhotoList && this.state.taskPhotoList.length>0){
      for(var i=0;i<this.state.taskPhotoList.length; i++){
        shareimgs.push(
          <Image resizeMode={'contain'} style={styles.shareimg} source={{uri:this.state.taskPhotoList[i].photoUrl+'?imageView2/1/w/170/h/170'}}></Image>
        );
      }
    }else{
      shareimgs.push(<View />);
    }

    if(this.state.merchantInfoDto.merchantLevel){
      for(var i=0;i<5;i++){
        if(i<this.state.merchantInfoDto.merchantLevel){
          stars.push(
            <Image resizeMode={'contain'} style={styles.star} source={require('image!star_active')}></Image>
          );
        }else{
          stars.push(
            <Image resizeMode={'contain'} style={styles.star} source={require('image!star_gray')}></Image>
          );
        }
      }
    }
    return (
      <View style={[styles.container,{paddingBottom:paddingBottom}]}>
        <ScrollView style={[styles.scrollbox,{paddingBottom:scrollbottom}]}>
          <View style={styles.header}>
            <Image resizeMode={'contain'} style={styles.faces} source={{uri:this.state.merchantInfoDto.merchantLogo+'?imageView2/1/w/120/h/120'}}></Image>
            <Text style={styles.facesname}>{this.state.merchantInfoDto.merchantName}</Text>
            <View style={styles.stars}>
              <View style={styles.starscontainer}>
                {stars}
              </View>
            </View>
          </View>
          <View style={styles.fourbtns}>
            <View style={styles.row}>
              <View style={styles.col1}>
                <View style={styles.pictext}>
                  <Image resizeMode={'contain'} style={styles.pic} source={require('image!choujin')}></Image>
                  <Text style={{color:'#333'}}>酬金</Text>
                </View>
                <View style={styles.pictext}>
                  <Text style={styles.fourtext}><Text style={styles.em1}>{this.state.task.price}元</Text><Text style={styles.spiritor}>/</Text>好友<Text style={styles.spiritor}>/</Text>次</Text>
                </View>
              </View>
              <View style={styles.col2}>
                <View style={styles.pictext}>
                  <Image resizeMode={'contain'} style={styles.pic} source={require('image!time_ok')}></Image>
                  <Text style={{color:'#333'}}>有效时间</Text>
                </View>
                <View style={styles.pictext}>
                  <Text style={styles.fourtext}><Text style={styles.em2}>{moment(this.state.task.showBeginTime).format('YYYY/MM/DD')}--{moment(this.state.task.showEndTime).format('YYYY/MM/DD')}</Text></Text>
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col1}>
              <View style={styles.pictext}>
                <Image resizeMode={'contain'} style={styles.pic} source={require('image!nv')}></Image>
                <Text style={{color:'#333'}}>性别要求</Text>
              </View>
              <View style={styles.pictext}>
                <Text style={styles.fourtext}>{this.state.task.gender==1?'男':'女'}</Text>
              </View>
              </View>
              <View style={styles.col2}>
              <View style={styles.pictext}>
                <Image resizeMode={'contain'} style={styles.pic} source={require('image!time_task')}></Image>
                <Text style={{color:'#333'}}>任务结束时间</Text>
              </View>
              <View style={styles.pictext}>
                <Text style={styles.fourtext}><Text style={styles.em3}>{moment(this.state.task.taskEndTime).format('YYYY/MM/DD')}</Text></Text>
              </View>
              </View>
            </View>
          </View>
          <View style={styles.beizhu}>
            <View style={styles.bz_header}>
              <View style={styles.box_title}>
                <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!beizhu')}></Image>
                <Text style={styles.box_title_text}>备注</Text>
              </View>
            </View>
            <View style={styles.bz_content}>
              <Text style={styles.bz_content_text}>
                {'\t'}{this.state.task.taskDes}
              </Text>
            </View>
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
          <View style={styles.beizhu}>
            <View style={styles.bz_header}>
              <View style={styles.box_title}>
                <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!text')}></Image>
                <Text style={styles.box_title_text}>文字</Text>
              </View>
            </View>
            <View style={styles.bz_content}>
              <Text style={styles.bz_content_text}>
                {'\t'}{this.state.task.taskText}
              </Text>
            </View>
            <TouchableOpacity onPress={this._copy}>
              <View style={styles.circle}>
                <Image resizeMode={'contain'} style={styles.circleimg} source={require('image!copy')}></Image>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.applynum}>
            <Image resizeMode={'contain'} style={styles.faces} source={require('image!apply_num')}></Image>
            <Text style={styles.facesname}>申请量</Text>
            <Text style={styles.applynum_text}>{this.state.task.orderPeopleNum}</Text>
          </View>
          {zmimgs}
        </ScrollView>
        {applybtn}
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
    backgroundColor:'#f9f9f9',
  },
  scrollbox:{
    flex:1,
    backgroundColor:'#f9f9f9',
    paddingBottom:135,
  },
  header:{
    flex:1,
    height:50,
    backgroundColor:'#fff',
    // justifyContent:'center',
    borderBottomWidth:0.5,
    borderBottomColor:'#dfdfdf',
  },
  faces:{
    position:'absolute',
    top:8,
    left:15,
    width:35,
    height:35,
    borderRadius:16,
  },
  facesname:{
    position:'absolute',
    top:18,
    left:15+35+10,
    fontSize:15,
    color:'#333',
  },
  stars:{
    position:'absolute',
    top:17,
    right:15,
    width:80+2*6,
    height:16,
  },
  starscontainer:{
    flex:1,
    flexDirection:'row',
  },
  star:{
    flex:1,
    width:16,
    height:16,
  },
  fourbtns:{
    flex:1,
    backgroundColor:'#fff',
    height:150,
  },
  row:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:0.5,
    borderBottomColor:'#dfdfdf',
    paddingTop:15,
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
  },
  col1:{
    flex:1,
    borderRightWidth:0.5,
    borderRightColor:'#dfdfdf',
    justifyContent:'center',
    alignItems:'center',
  },
  col2:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  pictext:{
    flex:1,
    flexDirection:'row',
  },
  pic:{
    flex:1,
    width:16,
    height:16,
    marginRight:4,
  },
  fourtext:{
    color:'#333',
    fontSize:13,
  },
  em1:{
    color:'#ffc039',
  },
  em2:{
    color:'#ff64a2',
  },
  em3:{
    color:'#399bff',
  },
  spiritor:{
    color:'#c0c0c0',
  },
  beizhu:{
    flex:1,
    backgroundColor:'#fff',
    borderBottomWidth:0.5,
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
  applynum:{
    // flex:1,
    height:50,
    backgroundColor:'#fff',
    // justifyContent:'center',
    borderBottomWidth:0.5,
    borderBottomColor:'#dfdfdf',
    marginBottom:15,
  },
  applynum_text:{
    color:'#399bff',
    fontSize:15,
    position:'absolute',
    top:17,
    right:15,
  },
  applybtn:{
    position:'absolute',
    left:0,
    bottom:68,
    width:Dimensions.get('window').width,
    height:68,
    borderTopWidth:0.5,
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
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom:10,
  },
  zmimg:{
    marginRight:1,
    marginBottom:1,
    alignItems:'center',
    justifyContent:'center',
    width:(Dimensions.get('window').width-30)/4,
    height:(Dimensions.get('window').width-30)/4,
  },
  bz_content3:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
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
  uploadimg:{
    flex:1,
    marginRight:2,
  },
  zmimg2:{
    flex:1,
    width:(Dimensions.get('window').width-36)/4,
    height:(Dimensions.get('window').width-36)/4,
  },
  delimg:{
    color:'#f02626',
    fontSize:15,
  },
});

module.exports = TaskDetail;
