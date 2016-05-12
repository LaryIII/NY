
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
  AsyncStorage,
  Dimensions,
} from 'react-native';

var Startny = React.createClass({

  render: function(){
    return (
      <ScrollView >
        <View style={styles.avatar}>
          <Image style={styles.avatarimg} resizeMode={'contain'} source={require('image!paishe')}></Image>
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
              title: '昵称',
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
              title: '性别',
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
            title='昵称'
            placeholder='请输入昵称，最长10个字符'
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
            title='性别'
            placeholder=''
            clearButtonMode='while-editing'
          />
        </GiftedForm>
        </View>
        <View style={styles.warning}>
          <Image resizeMode={'contain'} style={styles.warningimg} source={require('image!log_tip')}></Image>
          <Text style={styles.warningtext}>性别选择之后将无法修改~</Text>
        </View>
        <View style={styles.applybtn}>
          <View style={styles.bluebtn}>
            <Text style={styles.bluebtntext}>完成</Text>
          </View>
        </View>
        <View style={styles.selectsex}>
          <View style={styles.selectsexnan}>
          <Image resizeMode={'contain'} style={styles.selectsexnanimg} source={require('image!log_nan')}></Image>
          <Text style={styles.selectsexnantext}>男</Text>
          </View>
          <View style={styles.selectsexnv}>
          <Image resizeMode={'contain'} style={styles.selectsexnvimg} source={require('image!log_nv')}></Image>
          <Text style={styles.selectsexnvtext}>女</Text>
          </View>
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
    width:87,
    height:86,
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
    flex:1,
    borderRightWidth:0.5,
    borderRightColor:'#dfdfdf',
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
  }
});

module.exports = Startny;
