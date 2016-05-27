
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';
import Startny from './startny';
import Service from './../service';
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
} from 'react-native';

var Register = React.createClass({
  getInitialState: function(){
    return {
      open: false,
      offset:150,
      verifycodeimg:'',
      mobile:'',
      token:'',
      veritext:'验证',
      verinum:60,
      veribgcolor:'#eedd1b',
      isLoading:false,
    };
  },
  _gotoStartny:function(){
    this.props.navigator.push({
      title: '开启牛友之旅',
      component: Startny,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
    });
  },
  _register:function(mobile,verifycode,password,confirmpassword){
    var that = this;
    Util.get(Service.host + Service.regMobile, {
      mobile:mobile,
      password:password,
      password1:confirmpassword,
      mobileCode:verifycode,
      // inviteCode:'',//邀请码
      // account:'',// 非必填
      // loginType:'',//登录类型：1手机号2用户名
      // devKey:'', 设备码
      // appVersion:'',//版本信息
      // p:'',// 渠道号
      // devUKey:''，//Umeng串
    }, function(data){
      console.log(data);
      // 如果成功，跳转到开启牛友之旅页面
      if(data.code == 200){
        // 保存sessionKey
        AsyncStorage.setItem('userinfo',JSON.stringify(data.data.response),function(err){
          if(!err){
            that._gotoStartny();
          }
        })

      }else{
        AlertIOS.alert('提醒',data.messages[0].message);
      }
      that.setState({
        isLoading:false
      });

    });
  },
  _checkMobile:function(){
    if(this.state.veribgcolor == '#666'){
      return false;
    }
    var that  = this;
    // 1.检查手机号是否可注册
    var mobile = GiftedFormManager.getValue('signupForm', 'username');
    Util.get(Service.host + Service.checkMobile, {
      mobile:mobile,
    }, function(data){
      console.log(data);
      if(data.code == 200 && data.data.response){
        // 2.获取token，来显示图形验证码
        Util.get(Service.host + Service.verifyCode, {}, function(data){
          console.log(data);
          if(data.code == 200){
            var token = data.data.response.token;
            // 弹出图形验证码让用户填写
            var verifyCodeImg = Service.host+Service.verifyCode+'?token='+token;
            console.log(verifyCodeImg);
            //
            that.setState({open: true,offset:150,verifycodeimg:verifyCodeImg,mobile:mobile,token:token});
          }
        });
      }else if(data.code == 200 && !data.data.response){
        AlertIOS.alert('提醒','该手机号已注册');
      }else{
        AlertIOS.alert('提醒',data.messages[0].message);
      }

    });
  },
  _sendverifycode:function(){
    var that = this;
    // 先校验图形验证码是否填写
    if(this.state.verifyCode == ''){
      AlertIOS.alert('提醒','请填写图形验证码!');
      return;
    }
    // 发送手机验证码
    Util.get(Service.host + Service.sendVerifyCode, {
      mobile:this.state.mobile,
      token:this.state.token,
      verifyCode:this.state.verifyCode,
    }, function(data){
      console.log(data);
      if(data.code == 200){
        that.setState({open: false});
        that._countdown();
      }else{
        AlertIOS.alert('提醒',data.messages[0].message);
      }

    });
  },
  _countdown:function(){
    var that = this;
    var interval = setInterval(function(){
      var num = that.state.verinum;
      num--;
      if(num<0){
        that.setState({
          veritext:'验证',
          veribgcolor:'#eedd1b',
          verinum:60,
        })
        clearInterval(interval);
      }else{
        that.setState({
          veritext:num+'S',
          veribgcolor:'#666',
          verinum:num,
        })
      }
    },1000);
  },
  _onChange: function(val){
    console.log(val);
    if(val){
      this.setState({
        verifyCode: val
      });
    }
  },
  _onChangeMobile: function(val){
    console.log(val);
    if(val){
      this.setState({
        mobile: val
      });
    }
  },
  render: function(){
    return (
      <ScrollView style={styles.container}>
        <View style={styles.form}>
        <GiftedForm
          formName='signupForm' // GiftedForm instances that use the same name will also share the same states
          openModal={(route) => {
            this.props.navigator.push(route); // The ModalWidget will be opened using this method. Tested with ExNavigator
          }}
          clearOnClose={false} // delete the values of the form when unmounted
          defaults={{
            /*
            username: 'Farid',
            'gender{M}': true,
            password: 'abcdefg',
            country: 'FR',
            birthday: new Date(((new Date()).getFullYear() - 18)+''),
            */
          }}
          validators={{
            username: {
              title: '账号',
              validate: [{
                validator: 'matches',
                arguments: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
                message: '请填写正确的手机号码'
              }]
            },
            verifycode: {
              title: '验证码',
              validate: [{
                validator: 'isLength',
                arguments: [6,6],
                message: '{TITLE} 必须是6个字符'
              }]
            },
            password: {
              title: '密码',
              validate: [{
                validator: 'isLength',
                arguments: [6, 16],
                message: '{TITLE} 必须是 {ARGS[0]} 到 {ARGS[1]} 个字符'
              }]
            },
            confirmpassword: {
              title: '确认密码',
              validate: [{
                validator: 'isLength',
                arguments: [6, 16],
                message: '{TITLE} 必须是 {ARGS[0]} 到 {ARGS[1]} 个字符'
              }]
            },
          }}
        >
          <GiftedForm.TextInputWidget
            name='username'
            title='账号'
            placeholder='请输入手机号码'
            clearButtonMode='while-editing'
            onChangeText = {this._onChangeMobile}
            onTextInputFocus={(currentText = '') => {
              if (!currentText) {
                let fullName = GiftedFormManager.getValue('signupForm', 'username');
                if (fullName) {
                  return fullName.replace(/[^a-zA-Z0-9-_]/g, '');
                }
              }
              return currentText;
            }}
          />
          <GiftedForm.TextInputWidget
            name='verifycode' // mandatory
            title='验证码'
            placeholder='请输入验证码'
            clearButtonMode='while-editing'
            secureTextEntry={false}
          />

          <GiftedForm.TextInputWidget
            name='password' // mandatory
            title='密码'
            placeholder='请输入密码'
            clearButtonMode='while-editing'
            secureTextEntry={true}
          />
          <GiftedForm.TextInputWidget
            name='confirmpassword' // mandatory
            title='确认密码'
            placeholder='请再次输入密码'
            clearButtonMode='while-editing'
            secureTextEntry={true}
          />
          <GiftedForm.SubmitWidget
            title='注册'
            isLoading = {this.state.isLoading}
            widgetStyles={{
              submitButton: {
                backgroundColor: '#51a7ff',
              }
            }}
            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
              // if (isValid === true) {
              //   // prepare object
              //   values.gender = values.gender[0];
              //   values.birthday = moment(values.birthday).format('YYYY-MM-DD');
              // }
              if(isValid === true){
                this._register(values.username, values.verifycode, values.password, values.confirmpassword);
              }

            }}
          />
          <GiftedForm.HiddenWidget name='tos' value={true} />
        </GiftedForm>
        </View>

        <View style={[styles.yanzheng,{backgroundColor:this.state.veribgcolor}]}>
          <TouchableOpacity onPress={this._checkMobile}>
            <Text style={styles.yanzhengbtn}>{this.state.veritext}</Text>
          </TouchableOpacity>
        </View>

        <Modal
           offset={this.state.offset}
           open={this.state.open}
           modalDidOpen={() => console.log('modal did open')}
           modalDidClose={() => this.setState({open: false})}
           style={{alignItems: 'center'}}
           overlayOpacity={0.3}>
           <View style={styles.modalbox}>
              <View style={styles.modaltitlebox}><Text style={styles.modaltitle}>请输入四位数字验证码</Text></View>
              <View style={styles.modalcontent}>
                <TextInput ref="verifycodeinput" style={styles.modalinput} placeholder="输入右侧数字" onChangeText={this._onChange} />
                <Image resizeMode="contain" style={styles.modalimg} source={{uri:this.state.verifycodeimg}}></Image>
              </View>
              <TouchableOpacity onPress={this._sendverifycode}>
                <View style={styles.modalbtn}>
                  <Text style={styles.modalbtntext}>确认</Text>
                </View>
              </TouchableOpacity>
           </View>
        </Modal>
      </ScrollView>
    );
  },

});

var styles = StyleSheet.create({
  container:{
    flex:1,
  },
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
  yanzheng:{
    position:'absolute',
    top:9,
    right:15,
    backgroundColor:'#eedd1b',
    borderRadius:15,
    paddingTop:5,
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:5,
  },
  yanzhengbtn:{
    color:'#fff',
    fontSize:15
  },
  modalbox:{
    flex:1,
    width:Dimensions.get('window').width-70,
  },
  modaltitlebox:{
    flex:1,
    alignItems:'center',
  },
  modaltitle:{
    fontSize:16,
    color:'#333',
  },
  modalcontent:{
    marginTop:25,
    height:44,
  },
  modalinput:{
    borderBottomColor:'#dfdfdf',
    borderBottomWidth:0.5,
    height:50,
    fontSize:16,
  },
  modalimg:{
    position:'absolute',
    top:6,
    right:0,
    width:50,
    height:30,
  },
  modalbtn:{
    height:44,
    borderRadius:4,
    backgroundColor:'#51a7ff',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  modalbtntext:{
    color:'#fff',
    fontSize:17,
  }
});

module.exports = Register;
