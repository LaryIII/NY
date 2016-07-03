
import React, { Component } from 'react';
import Util from './../utils';
import ApplyTask from './applytask';

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

var TaskDetails = React.createClass({
  getInitialState: function(){
    var items = [];
    return {
      items: items,
    };
  },
  render: function(){
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollbox}>
          <View style={styles.header}>
            <Image resizeMode={'contain'} style={styles.faces} source={require('./../../res/mine/pic_wo_moren@3x.png')}></Image>
            <Text style={styles.facesname}>窦窦</Text>
            <View style={styles.stars}>
              <View style={styles.starscontainer}>
                <Image resizeMode={'contain'} style={styles.star} source={require('image!star_active')}></Image>
                <Image resizeMode={'contain'} style={styles.star} source={require('image!star_active')}></Image>
                <Image resizeMode={'contain'} style={styles.star} source={require('image!star_active')}></Image>
                <Image resizeMode={'contain'} style={styles.star} source={require('image!star_active')}></Image>
                <Image resizeMode={'contain'} style={styles.star} source={require('image!star_gray')}></Image>
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
                  <Text style={styles.fourtext}><Text style={styles.em1}>0.6元</Text><Text style={styles.spiritor}>/</Text>好友<Text style={styles.spiritor}>/</Text>次</Text>
                </View>
              </View>
              <View style={styles.col2}>
                <View style={styles.pictext}>
                  <Image resizeMode={'contain'} style={styles.pic} source={require('image!time_ok')}></Image>
                  <Text style={{color:'#333'}}>有效时间</Text>
                </View>
                <View style={styles.pictext}>
                  <Text style={styles.fourtext}><Text style={styles.em2}>2016/1/8--2016/1/11</Text></Text>
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
                <Text style={styles.fourtext}>女</Text>
              </View>
              </View>
              <View style={styles.col2}>
              <View style={styles.pictext}>
                <Image resizeMode={'contain'} style={styles.pic} source={require('image!time_task')}></Image>
                <Text style={{color:'#333'}}>任务时间</Text>
              </View>
              <View style={styles.pictext}>
                <Text style={styles.fourtext}><Text style={styles.em3}>7天</Text></Text>
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
                {'\t'}此次任务要求发送指定的文字 和图片至朋友圈，时间不少于2小时，此次任务要求发送指定的文字和图片至朋友圈，时间不少于2小时。
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
            <View style={styles.bz_content2}>
              <View style={styles.bbox}>
                <Image resizeMode={'contain'} style={styles.bimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
              </View>
              <View style={styles.sbox}>
                <Image resizeMode={'contain'} style={styles.simg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
                <Image resizeMode={'contain'} style={styles.simg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
              </View>
            </View>
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
                {'\t'}此次任务要求发送指定的文字 和图片至朋友圈，时间不少于2小时，此次任务要求发送指定的文字和图片至朋友圈，时间不少于2小时。
              </Text>
            </View>
          </View>
          <View style={styles.applynum}>
            <Image resizeMode={'contain'} style={styles.faces} source={require('image!apply_num')}></Image>
            <Text style={styles.facesname}>申请量</Text>
            <Text style={styles.applynum_text}>25</Text>
          </View>
          <View style={styles.beizhu}>
            <View style={styles.bz_header}>
              <View style={styles.box_title}>
                <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian1')}></Image>
                <Text style={styles.box_title_text}>图片证明</Text>
              </View>
            </View>
            <View style={styles.bz_content3}>
              <View style={styles.zmimgs}>
                <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
                <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
                <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
                <Image resizeMode={'contain'} style={styles.zmimg} source={require('./../../res/mine/pic_wo_sl1@2x.png')}></Image>
              </View>
            </View>
          </View>
        </ScrollView>
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
  header:{
    flex:1,
    height:50,
    backgroundColor:'#fff',
    // justifyContent:'center',
    borderBottomWidth:Util.pixel,
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
    borderBottomWidth:Util.pixel,
    borderBottomColor:'#dfdfdf',
    paddingTop:15,
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:15,
  },
  col1:{
    flex:1,
    borderRightWidth:Util.pixel,
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
    fontSize:15,
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
  bz_content2:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
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
    flex:1,
    height:50,
    backgroundColor:'#fff',
    // justifyContent:'center',
    borderBottomWidth:Util.pixel,
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
  zmimgs:{
    flex:1,
    flexDirection:'row',
  },
  zmimg:{
    flex:1,
    marginRight:1,
  }

});

module.exports = TaskDetails;
