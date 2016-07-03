
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
  Dimensions,
} from 'react-native';

var UserHome = React.createClass({
  getInitialState: function(){
    return {
      idx:null,
      detail:{
        cityName:'',
        gender:1,
        name:'',
        num:0,
        photoUrl:'',
        totalPrice:''
      },
      personalPhotoList:[],
    };
  },
  // 接受由上个页面传来的idx
  componentDidMount() {
    var that = this;
    this.setState({
      idx:this.props.idx,
    });
    Util.get(Service.host + Service.rankingDetail, {idx:this.props.idx}, function(data){
      console.log(data);
      if(data.code == 200){
        that.setState({
          detail:data.data.response.detail,
          personalPhotoList:data.data.response.personalPhotoList,
        });
      }else{

      }
    });
  },
  render: function(){
    var avatar = this.state.detail.photoUrl?{uri:this.state.detail.photoUrl}:require('./../../res/mine/pic_wo_moren@3x.png');
    var genderimg = this.state.detail.gender==1?require('image!ph_nan'):require('image!ph_nv');
    var photos = [];
    for(var i=0;i<this.state.personalPhotoList.length;i++){
      if(i%2 == 0){
        if(i==this.state.personalPhotoList.length-1){
          photos.push(
            <View style={styles.item}>
              <TouchableOpacity>
                <View style={styles.inneritem}>
                  <Image style={styles.itemimg} source={{uri:this.state.personalPhotoList[i].photoUrl+'?imageView2/1/w/347/h/342'}}></Image>
                </View>
              </TouchableOpacity>
            </View>
          );
        }else{
          photos.push(
            <View style={styles.item}>
              <TouchableOpacity>
                <View style={styles.inneritem}>
                  <Image style={styles.itemimg} source={{uri:this.state.personalPhotoList[i].photoUrl+'?imageView2/1/w/347/h/342'}}></Image>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.inneritem}>
                  <Image style={styles.itemimg} source={{uri:this.state.personalPhotoList[i+1].photoUrl+'?imageView2/1/w/347/h/342'}}></Image>
                </View>
              </TouchableOpacity>
            </View>
          );
        }

      }

    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollbox}>
          <View style={styles.header}>
            <View style={styles.settingbox}>
              <Image resizeMode={'contain'} style={styles.setting} source={require('image!ph_mark')}></Image>
              <Text style={styles.mark}>{this.state.detail.cityName.split('市')[0]}</Text>
            </View>
            <View style={styles.infos}>
              <Image resizeMode={'contain'} style={styles.avatar} source={avatar}></Image>
              <Image resizeMode={'contain'} style={styles.sex} source={genderimg}></Image>
              <Text style={styles.avatarname}>{this.state.detail.name}</Text>
            </View>
            <View style={styles.borderbottom}></View>
          </View>
          <View style={styles.fourbtns}>
            <View style={styles.row}>
              <View style={styles.col1}>
                <View style={styles.pictext}>
                  <Image resizeMode={'contain'} style={styles.pic} source={require('image!choujin')}></Image>
                  <Text style={{color:'#333'}}>酬金</Text>
                </View>
                <View style={styles.pictext}>
                  <Text style={styles.fourtext}><Text style={styles.em1}>{this.state.detail.totalPrice}元</Text><Text style={styles.spiritor}>/</Text>好友<Text style={styles.spiritor}>/</Text>次</Text>
                </View>
              </View>
              <View style={styles.col2}>
                <View style={styles.pictext}>
                  <Image resizeMode={'contain'} style={styles.pic} source={require('image!ph_rwgs')}></Image>
                  <Text style={{color:'#333'}}>任务个数</Text>
                </View>
                <View style={styles.pictext}>
                  <Text style={styles.fourtext}><Text style={styles.em2}>{this.state.detail.num}次</Text></Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.beizhu}>
            <View style={styles.bz_header}>
              <View style={styles.box_title}>
                <Image resizeMode={'contain'} style={styles.box_title_img} source={require('image!tupian1')}></Image>
                <Text style={styles.box_title_text}>照片资料</Text>
              </View>
            </View>
            <View style={styles.bz_content2}>
              {photos}
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
    marginBottom:50,
  },
  header:{
    flex:1,
    height:130,
    backgroundColor:'#fff',
    alignItems:'center',
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
    height:75,
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
    // justifyContent:'space-between',
    paddingLeft:10,
    paddingRight:10,
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
  applybtn:{
    position:'absolute',
    left:0,
    bottom:68,
    width:Dimensions.get('window').width,
    height:68,
    borderTopWidth:Util.pixel,
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
  settingbox:{
    position:'absolute',
    top:12,
    right:15,
    flex:1,
    flexDirection:'row',
  },
  setting:{
    flex:1,
    width:16,
    height:16,
    marginRight:4,
  },
  mark:{
    fontSize:14,
    color:'#999',
  },
  avatar:{
    marginTop:20,
    width:55,
    height:55,
    borderRadius:28,
  },
  avatarname:{
    marginTop:16,
    fontSize:15,
    color:'#333',
    textAlign:'center',
  },
  avater:{
    position:'absolute',
    top:10,
    left:10,
    width:22,
    height:22,
    borderRadius:11
  },
  avatername:{
    position:'absolute',
    top:15,
    left:40,
    fontSize:12,
    color:'#fff',
  },
  sex:{
    position:'relative',
    top:-16,
    left:40,
    width:14,
    height:14,
  },
  item:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:10,
    width:(Dimensions.get('window').width-20),
    height:(Dimensions.get('window').width-30)/2+37,
    marginLeft:0,
    marginRight:0,
  },
  inneritem:{
    flex:1,
    width:(Dimensions.get('window').width-30)/2,
    height:(Dimensions.get('window').width-30)/2+37,
    borderRadius:4,
    // backgroundColor:'#fff',
    alignItems:'center',
  },
  itemimg:{
    flex:1,
    width:(Dimensions.get('window').width-30)/2,
    height:(Dimensions.get('window').width-30)/2,
    borderRadius:4,
  },
});

module.exports = UserHome;
