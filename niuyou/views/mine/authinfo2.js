
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';
import Authinfo3 from './authinfo3';
import Service from './../service';
var ImagePickerManager = require('NativeModules').ImagePickerManager;
// import ImagePickerManager from 'react-native-image-picker';
import qiniu from 'react-native-qiniu';
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
  AlertIOS,
  ActivityIndicatorIOS,
} from 'react-native';

var Authinfo2 = React.createClass({
  getInitialState: function(){
    return {
      open: false,
      offset:150,
      numberphoto: require('image!backo'),
    };
  },
  _gotoAuthinfo3: function(){
    var that = this;
    // 保存持证照片成功后跳到下一步
    if(this.state.numberphoto && this.state.numberphoto.uri != 'backo'){
      Util.get(Service.host + Service.savePeopleNumPhotoUrl, {
        peopleNumPhotoUrl:this.state.numberphoto.uri,
      }, function(data){
        console.log(data);
        // 如果成功，返回原页面，且刷新页面
        if(data.code == 200){
          that.props.navigator.push({
            title: '生活照认证',
            component: Authinfo3,
            navigationBarHidden:false,
            // backButtonTitle: "返回",
            // backButtonIcon: require('image!back'),
            leftButtonTitle: "返回",
            leftButtonIcon:require('image!back1'),
            onLeftButtonPress: ()=>that.props.navigator.pop(),
          });
        }else{
          AlertIOS.alert('提醒',data.messages[0].message);
        }
      });
    }else{
      AlertIOS.alert('提醒','请先上传你的联系人数量照片!');
    }
  },
  _uploadImg:function(){
    var that = this;
    console.log('准备上传文件');
    var options = {
      title: '选择图片', // specify null or empty string to remove the title
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '从相册选取...', // specify null or empty string to remove this button
      customButtons: {},
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 1280, // photos only
      maxHeight: 720, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.6, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };

    /**
    * The first arg will be the options object for customization, the second is
    * your callback which sends object: response.
    *
    * See the README for info about the response
    */

    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data:
        // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // uri (on iOS)
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        var arrs = response.uri.split('.');

        // uri (on android)
        // const source = {uri: response.uri, isStatic: true};

        //upload file to Qiniu
        that.setState({
          open:true,
        });
        Util.get(Service.host + Service.getToken, {bucketName:'ny-personal-photo'}, function(data){
          console.log(data);
          if(data.code == 200){
            var token = data.data.response.token;
            var url = data.data.response.url;
            var key = data.data.response.key;
            console.log(11111111);
            console.log(qiniu);
            qiniu.rpc.uploadImage(response.uri, key, token, function (resp) {
               console.log(resp);
               if(resp.status == 200 && resp.ok == true){
                 that.setState({
                   numberphoto: {uri:url},
                   open:false,
                 });
               }
            });
          }else{

          }
        });
      }
    });
  },
  render: function(){
    return (
      <View style={styles.container}>
      <ScrollView style={styles.scrollbox}>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}>请上传联系人数量照片</Text>
        </View>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian')}></Image>
              <Text style={styles.box_title_text}>示例图片</Text>
            </View>
          </View>
          <View style={styles.bz_content2}>
            <View style={styles.bbox}>
              <Image resizeMode={'contain'} style={styles.bimg} source={require('./../../res/mine/contactnum_min.png')}></Image>
            </View>
          </View>
          <TouchableOpacity onPress={this._uploadImg}>
            <View style={styles.circle}>
              <Image resizeMode={'contain'} style={styles.circleimg} source={require('image!upload')}></Image>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.beizhu}>
          <View style={styles.bz_header}>
            <View style={styles.box_title}>
              <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian')}></Image>
              <Text style={styles.box_title_text}>我的联系人数量照片</Text>
            </View>
          </View>
          <View style={styles.bz_content2}>
            <View style={styles.bbox}>
              <Image resizeMode={'contain'} style={styles.bimg} source={this.state.numberphoto}></Image>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.applybtn}>
        <TouchableOpacity onPress={this._gotoAuthinfo3}>
          <View style={styles.bluebtn}>
            <Text style={styles.bluebtntext}>下一步</Text>
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
    borderBottomWidth:0.5,
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
    flex:1,
    height:170,
  },
  bimg:{
    flex:1,
    width:345,
    height:170,
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

module.exports = Authinfo2;
