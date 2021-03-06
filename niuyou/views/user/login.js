
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';
import Register from './register';
import Findback from './findback';
import Service from './../service';
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  AsyncStorage,
  AlertIOS,
} from 'react-native';

var Login = React.createClass({
  getInitialState: function(){
    return {
      isLoading:false,
    };
  },
  _gotoRegister: function(){
    this.props.navigator.push({
      title: '注册新用户',
      component: Register,
      navigationBarHidden:false,
      // backButtonTitle: "返回",
      // backButtonIcon: require('image!back'),
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
    });
  },
  _gotoFindback: function(){
    this.props.navigator.push({
      title: '找回密码',
      component: Findback,
      navigationBarHidden:false,
      leftButtonTitle: "返回",
      leftButtonIcon:require('image!back1'),
      onLeftButtonPress: ()=>this.props.navigator.pop(),
    });
  },
  _login:function(mobile,password){
    var that = this;
    Util.get(Service.host + Service.login, {
      mobile:mobile,
      password:password,
      // account:'',// 非必填
      // loginType:'',//登录类型：1手机号2用户名
      // devKey:'', 设备码
      // appVersion:'',//版本信息
      // p:'',// 渠道号
    }, function(data){
      console.log(data);
      // 如果成功，返回原页面，且刷新页面
      if(data.code == 200){
        AsyncStorage.setItem('userinfo',JSON.stringify(data.data.response),function(err){
          if(!err){
              that.props.events.emit('login_success', {});
              if(that.props.type=='taskdetail'){
                that.props.navigator.pop();
              }else{
                that.props.navigator.popToTop();
              }

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
  render: function(){
    var that = this;
    return (
      <ScrollView >
        <View style={styles.logo}>
          <Image style={styles.logoimg} resizeMode={'contain'} source={require('image!logo')}></Image>
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
            password: {
              title: '密码',
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
            placeholder='请输入您的手机号'
            clearButtonMode='while-editing'
            onTextInputFocus={(currentText = '') => {
              if (!currentText) {
                let fullName = GiftedFormManager.getValue('signupForm', 'fullName');
                if (fullName) {
                  return fullName.replace(/[^a-zA-Z0-9-_]/g, '');
                }
              }
              return currentText;
            }}
          />

          <GiftedForm.TextInputWidget
            name='password' // mandatory
            title='密码'
            placeholder='请输入您的密码'
            clearButtonMode='while-editing'
            secureTextEntry={true}
          />
          <GiftedForm.SubmitWidget
            title='登录'
            isLoading={this.state.isLoading}
            widgetStyles={{
              submitButton: {
                backgroundColor: '#51a7ff',
              }
            }}
            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
              if (isValid === true) {
                // prepare object
                // 登录
                this._login(values.username,values.password);
              }
            }}
          />
        </GiftedForm>
        </View>
        <View style={styles.btns}>
          <TouchableOpacity onPress={this._gotoFindback}>
            <Text style={styles.register}>找回密码</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._gotoRegister}>
            <Text style={styles.findback}>注册新用户</Text>
          </TouchableOpacity>
        </View>
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
  btns:{
    marginTop:5,
    marginLeft:15,
    marginRight:15,
  },
  register:{
    position:'absolute',
    top:0,
    left:0,
    color:'#51a7ff',
    fontSize:14,
    textAlign:'left',
  },
  findback:{
    position:'absolute',
    top:0,
    right:0,
    color:'#51a7ff',
    fontSize:14,
    textAlign:'right',
  },
  logo:{
    alignItems:'center',
    justifyContent:'center',
  },
  logoimg:{
    marginTop:35,
    width:80,
    height:80,
    marginBottom:25,
  },
});

module.exports = Login;
