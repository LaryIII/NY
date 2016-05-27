
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';
import Service from './../service';
import Modal from 'react-native-simple-modal';
var ImagePickerManager = require('NativeModules').ImagePickerManager;
// import ImagePickerManager from 'react-native-image-picker';
import qiniu from 'react-native-qiniu';
// qiniu.conf.ACCESS_KEY = '0cWE2Ci38evF_wbXbHSAUt-5vXMZgqN3idgyvvMy';
// qiniu.conf.SECRET_KEY = '3kBcjCfTbqEVKWZttKLae_RM0zEbYc3-Q-STnXkw';
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

var Startny = React.createClass({
  getInitialState: function(){
    return {
      open: false,
      offset:150,
      avatarurl:require('image!paishe'),
      nanstatus:'#333',
      nvstatus:'#999',
      nickname:'',
      gender:1, // 1是男，2是女
      isLoading:false,
    };
  },
  _uploadAvatar:function(){
    var that = this;
    console.log('准备上传文件');
    var options = {
      title: '选择头像', // specify null or empty string to remove the title
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '从相册选取...', // specify null or empty string to remove this button
      customButtons: {},
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 240, // photos only
      maxHeight: 240, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.6, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: true, // Built in functionality to resize/reposition the image after selection
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
                 // 存到全局变量，因为没有接口获取
                 AsyncStorage.setItem('avatarurl', url,function(err){})
                 that.setState({
                   avatarurl: {uri:url},
                   open:false,
                 });
               }
            });
          }else{
            AlertIOS.alert('提醒',data.messages[0].message);
          }
        });
        // var key = new Date().getTime()+1*10000+'.'+arrs[arrs.length-1];
        // var putPolicy = new qiniu.auth.PutPolicy2(
        //     {scope: "aijia-ext:"+key}
        // );
        // var uptoken = putPolicy.token();


      }
    });
  },
  _selectNan:function(){
    this.setState({
      nanstatus:'#333',
      nvstatus:'#999',
      gender:1,
    });
  },
  _selectNv:function(){
    this.setState({
      nanstatus:'#999',
      nvstatus:'#333',
      gender:2,
    });
  },
  _saveBasicInfo:function(nickname,gender){
    var that = this;
    Util.get(Service.host + Service.saveBasicInfo, {
      photoUrl:this.state.avatarurl.uri,
      name:nickname,
      gender:this.state.gender,
    }, function(data){
      console.log(data);
      if(data.code == 200){
        // 回到顶级路由
        that.props.navigator.popToTop();
      }else{
        AlertIOS.alert('提醒',data.messages[0].message);
      }
      that.setState({
        isLoading:false
      });
    });
  },
  _onChange: function(val){
    console.log(val);
    if(val){
      this.setState({
        nickname: val
      });
    }
  },
  render: function(){
    return (
      <ScrollView >
        <View style={styles.avatar}>
          <TouchableOpacity onPress={this._uploadAvatar}>
            <Image style={styles.avatarimg} resizeMode={'contain'} source={this.state.avatarurl}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
        <GiftedForm
          formName='signupForm' // GiftedForm instances that use the same name will also share the same states
          openModal={(route) => {
            this.props.navigator.push(route); // The ModalWidget will be opened using this method. Tested with ExNavigator
          }}
          clearOnClose={false} // delete the values of the form when unmounted
          defaults={{
            /*
            nickname: 'Farid',
            'gender{M}': true,
            gender: 'abcdefg',
            country: 'FR',
            birthday: new Date(((new Date()).getFullYear() - 18)+''),
            */
          }}
          validators={{
            nickname: {
              title: '昵称',
              validate: [{
                validator: 'isLength',
                arguments: [2, 10],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
              },{
                validator: 'matches',
                arguments: /^[a-zA-Z0-9]*$/,
                message: '{TITLE} can contains only alphanumeric characters'
              }]
            },
          }}
        >
          <GiftedForm.TextInputWidget
            name='nickname'
            title='昵称'
            placeholder='请输入昵称，最长10个字符'
            clearButtonMode='while-editing'
            onChangeText={this._onChange}
          />
          <GiftedForm.TextInputWidget
            name='gender' // mandatory
            title='性别'
            placeholder=''
          />
          <View style={styles.warning}>
            <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
            <Text style={styles.warningtext}>性别选择之后将无法修改~</Text>
          </View>
          <GiftedForm.SubmitWidget
            title='完成'
            isLoading = {this.state.isLoading}
            widgetStyles={{
              submitButton: {
                backgroundColor: '#51a7ff',
              }
            }}
            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
              if (isValid === true) {
                // prepare object
                // 登录
                this._saveBasicInfo(values.nickname,values.gender);
              }
            }}
          />
        </GiftedForm>
        </View>
        <View style={styles.selectsex}>
          <TouchableOpacity onPress={this._selectNan}>
            <View style={styles.selectsexnan}>
                <Image resizeMode={'contain'} style={styles.selectsexnanimg} source={require('image!log_nan')}></Image>
                <Text style={styles.selectsexnantext,{color:this.state.nanstatus}}>男</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._selectNv}>
              <View style={styles.selectsexnv}>
                <Image resizeMode={'contain'} style={styles.selectsexnvimg} source={require('image!log_nv')}></Image>
                <Text style={styles.selectsexnvtext,{color:this.state.nvstatus}}>女</Text>
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
      </ScrollView>
    );
  },

  _onChange: function(val){
    if(val){
      this.setState({
        message: val
      });
    }
  },
});

var styles = StyleSheet.create({
  textinput:{
    flex:1,
    height:100,
    borderWidth:1,
    borderColor:'#ddd',
    marginTop:30,
    marginLeft:20,
    marginRight:20,
    paddingLeft:8,
    fontSize:13,
    borderRadius:4
  },
  btn:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#1DB8FF',
    height:38,
    marginLeft:20,
    marginRight:20,
    borderRadius:4,
  },
  avatar:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    borderBottomWidth:0.5,
    borderBottomColor:'#dfdfdf',
  },
  avatarimg:{
    marginTop:24,
    marginBottom:24,
    width:86,
    height:86,
    borderRadius:43,
  },
  applybtn:{
    width:Dimensions.get('window').width,
    height:68,
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
  warning:{
    flex:1,
    flexDirection:'row',
    paddingLeft:15,
    paddingRight:15,
    height:44,
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
  selectsex:{
    position:'absolute',
    top:180,
    left:110,
    width:Dimensions.get('window').width-110,
    height:44,
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  selectsexnan:{
    width:(Dimensions.get('window').width-110)/2,
    borderRightWidth:0.5,
    borderRightColor:'#dfdfdf',
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  selectsexnanimg:{
    width:16,
    height:16,
    marginRight:4,
  },
  selectsexnantext:{
    color:'#333',
    fontSize:15,
  },
  selectsexnv:{
    width:(Dimensions.get('window').width-110)/2,
    flex:1,
    borderRightWidth:0.5,
    borderRightColor:'#dfdfdf',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  selectsexnvimg:{
    width:16,
    height:16,
    marginRight:4,
  },
  selectsexnvtext:{
    color:'#333',
    fontSize:15,
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

module.exports = Startny;
