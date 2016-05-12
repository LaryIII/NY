
import React, { Component } from 'react';
import {GiftedForm, GiftedFormManager} from 'react-native-gifted-form';
import Util from './../utils';

import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  AsyncStorage
} from 'react-native';

var Register = React.createClass({

  render: function(){
    return (
      <ScrollView >
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
                validator: 'isLength',
                arguments: [3, 16],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
              },{
                validator: 'matches',
                arguments: /^[a-zA-Z0-9]*$/,
                message: '{TITLE} can contains only alphanumeric characters'
              }]
            },
            password: {
              title: '密码',
              validate: [{
                validator: 'isLength',
                arguments: [6, 16],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
              }]
            },
          }}
        >
          <GiftedForm.TextInputWidget
            name='username'
            title='账号'
            placeholder='请输入手机号码'
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
            name='verifycode' // mandatory
            title='验证码'
            placeholder='请输入验证码'
            clearButtonMode='while-editing'
            secureTextEntry={true}
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
            widgetStyles={{
              submitButton: {
                backgroundColor: '#51a7ff',
              }
            }}
            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
              if (isValid === true) {
                // prepare object
                values.gender = values.gender[0];
                values.birthday = moment(values.birthday).format('YYYY-MM-DD');
              }
            }}
          />
          <GiftedForm.HiddenWidget name='tos' value={true} />
        </GiftedForm>
        </View>
        <View style={styles.yanzheng}>
          <Text style={styles.yanzhengbtn}>验证</Text>
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

  _postMessage: function(){
    var that = this;
    // AsyncStorage.getItem('token', function(err, token){
    //   if(err){
    //     alert('权限失效，请退出APP，重新登录');
    //   }else{
    //     Util.post(Service.host + Service.addMessage, {
    //       token: token,
    //       message: that.state.message
    //     }, function(data){
    //       if(data.status){
    //         alert('添加成功！');
    //       }else{
    //         alert('添加失败！');
    //       }
    //     });
    //   }
    //
    // });
  }

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
  }
});

module.exports = Register;
