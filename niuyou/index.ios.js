// /**
//  * niuyou React Native App
//  * https://github.com/facebook/react-native
//  * @flow
//  */
//
// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';
//
// class niuyou extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit index.ios.js
//         </Text>
//         <Text style={styles.instructions}>
//           Press Cmd+R to reload,{'\n'}
//           Cmd+D or shake for dev menu
//         </Text>
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });
//
// AppRegistry.registerComponent('niuyou', () => niuyou);
'use strict';

import React, { Component } from 'react';
import Home from './views/home';
import Jrw from './views/jrw';
import Phb from './views/phb';
import Mine from './views/mine';
import {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Image,
  NavigatorIOS,
} from 'react-native';

var niuyou = React.createClass({
  statics: {
    title: '<TabBarIOS>',
    description: 'Tab-based navigation.',
  },

  displayName: 'TabBarExample',

  getInitialState: function() {
    return {
      selectedTab: 0,
      notifCount: 0,
      presses: 0,
      data:{

      }
    };
  },

  _renderContent: function(color: string, pageText: string, num?: number) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
      </View>
    );
  },

  _addNavigator: function(component, title){
    var data = null;
    var display = false;
    var barTintColor = '#f9f9f9';
    if(title === '主页'){
      data = this.state.data;
      barTintColor = '#f3ea85';
    }
    if(title === '接任务'){
      display = true;
      title = '';
      barTintColor = '#f9f9f9';
    }
    if(title === '排行榜'){
      barTintColor = '#fff';
    }
    if(title === '我的'){
      display = true;
      title = '';
      barTintColor = '#f9f9f9';
    }
    return <NavigatorIOS
      ref='nav'
      style={{flex:1}}
      barTintColor={barTintColor}
      titleTextColor="#333"
      tintColor="#333"
      translucent={false}
      navigationBarHidden={display}
      initialRoute={{
          component: component,
          title: title,
          passProps:{
            data: data
          },
          // backButtonTitle: "返回",
          // backButtonIcon: require('image!back'),
          leftButtonTitle: "返回",
          leftButtonIcon:require('image!back'),
          onLeftButtonPress: ()=>this.refs.nav.pop(),
        }}
      />;
  },

  render: function() {
    return (
      <TabBarIOS
        tintColor="#51a7ff"
        barTintColor="white">
        <TabBarIOS.Item
          icon={require('image!home_nor')}
          title="主页"
          selected={this.state.selectedTab === 0}
          style={styles.tabbarItem}
          onPress={() => {
            this.setState({
              selectedTab: 0,
            });
          }}>
          {this._addNavigator(Home, '主页')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('image!jrw_nor')}
          title="接任务"
          selected={this.state.selectedTab === 1}
          onPress={() => {
            this.setState({
              selectedTab: 1,
            });
          }}>
          {this._addNavigator(Jrw, '接任务')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('image!phb_nor')}
          title="排行榜"
          selected={this.state.selectedTab === 2}
          onPress={() => {
            this.setState({
              selectedTab: 2,
            });
          }}>
          {this._addNavigator(Phb, '排行榜')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('image!wo_nor')}
          title="我的"
          selected={this.state.selectedTab === 3}
          onPress={() => {
            this.setState({
              selectedTab: 3,
            });
          }}>
          {this._addNavigator(Mine, '我的')}
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  },

});

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
  tabbarItem:{
    marginTop:-2
  }
});

AppRegistry.registerComponent('niuyou', () => niuyou);
