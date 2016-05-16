
import React, { Component } from 'react';
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

var Feedback = React.createClass({

  render: function(){
    return (
      <ScrollView >
        <View>
          <TextInput multiline={true}
                     onChangeText={this._onChange}
                     style={styles.textinput}
                     placeholder="感谢你的宝贵意见, 收到反馈后我们会尽快与你联系。"/>
        </View>
        <View style={styles.inputs}>
          <TextInput multiline={true}
                     onChangeText={this._onChange2}
                     style={styles.textinput2}
                     placeholder="你的手机号码或邮箱(选填)"/>
        </View>
        <View style={{marginTop:20}}>
          <TouchableOpacity onPress={this._postMessage}>
            <View style={styles.btn}>
              <Text style={{color:'#fff'}}>提交</Text>
            </View>
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

    // });
  }

});

var styles = StyleSheet.create({
  textinput:{
    flex:1,
    height:180,
    borderBottomWidth:0.5,
    borderBottomColor:'#dfdfdf',
    paddingTop:10,
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:10,
    fontSize:15,
  },
  inputs:{
    marginTop:15,
    flex:1,
  },
  textinput2:{
    flex:1,
    height:44,
    borderBottomWidth:0.5,
    borderBottomColor:'#dfdfdf',
    borderTopWidth:0.5,
    borderTopColor:'#dfdfdf',
    paddingLeft:15,
    paddingRight:15,
    paddingTop:8,
    fontSize:15,
  },
  btn:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#399bff',
    height:44,
    marginLeft:15,
    marginRight:15,
    borderRadius:4,
  }
});

module.exports = Feedback;
