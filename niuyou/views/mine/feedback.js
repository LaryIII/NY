
import React, { Component } from 'react';
import Util from './../utils';
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
    console.log(val);
    if(val){
      this.setState({
        message: val
      });
    }
  },
  _onChange2: function(val){
    console.log(val);
    if(val){
      this.setState({
        mobile: val
      });
    }
  },

  _postMessage: function(){
    var that = this;
    // AsyncStorage.getItem('token', function(err, token){
    //   if(err){
    //     alert('权限失效，请退出APP，重新登录');
    //   }else{
        Util.get(Service.host + Service.feedback, {
          content: that.state.message,
          mobile:that.state.mobile
        }, function(data){
          if(data.code == 200){
            console.log(data);
            AlertIOS.alert('提醒','感谢您的建议，我们会认真处理',[
              {text:'确定',onPress:()=>that.props.navigator.pop();}
            ]);
          }else{
            AlertIOS.alert('提醒',data.messages[0].message);
          }
        });
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
