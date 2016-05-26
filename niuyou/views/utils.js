

var React = require('react-native');
var Dimensions = require('Dimensions');

var {
  PixelRatio,
  AsyncStorage
} = React;

var Util = {

  //单位像素
  pixel: 1 / PixelRatio.get(),
  //屏幕尺寸
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },

  //post请求
  post: function (url, data, callback) {
    AsyncStorage.getItem('userinfo',function(err,result){
      if(!err){
        sessionKey = JSON.parse(result).sessionKey;
      }
      data.sessionKey = sessionKey;
      AsyncStorage.getItem('city',function(err,result){
        if(!err){
          cityId = result.split(';')[0];
        }
        data.cityId = cityId;
        var fetchOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        };

        fetch(url, fetchOptions)
        .then((response) => response.text())
        .then((responseText) => {
          callback(JSON.parse(responseText));
        });
      });
    });
  },
  //get请求
  get: function (url, data, callback) {
    var fetchOptions = {
      method: 'GET',
      body: ''
    };
    var temp = url;
    var sessionKey = '';
    var cityId = '320100';// 默认南京
    AsyncStorage.getItem('userinfo',function(err,result){
      if(!err){
        sessionKey = result?JSON.parse(result).sessionKey:'';
      }
      data.sessionKey = sessionKey;
      AsyncStorage.getItem('city',function(err,result){
        if(!err){
          cityId = result?result.split(';')[0]:'320100';
        }
        data.cityId = cityId;
        if(data){
          var querystring = Object.keys(data)
            .map(key => key + '=' + encodeURIComponent(data[key]))
            .join('&');
          temp+='?'+querystring;
        }
        console.log(temp);
        fetch(temp, fetchOptions)
        .then((response) => response.text())
        .then((responseText) => {
          callback(JSON.parse(responseText));
        })
        .catch(function(e) {
            console.log('error');
        });
      });
    });
  },
  //Key
  key: 'HSHHSGSGGSTWSYWSYUSUWSHWBS-REACT-NATIVE'

};

module.exports = Util;
