import React, { Component } from 'react';
import {SafeAreaView, ScrollView, View, Text, Dimensions   } from 'react-native';
//import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';

export default class WebViewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
     
    return (
       
      
      <ScrollView style={{ flex: 1, backgroundColor:"#fff"}}>
        
          {/* <HTML uri={this.props.route.params.url} contentWidth={Dimensions.get('window').width}/>  */}
          <WebView
        source={{
          uri: this.props.route.params.url
        }}
        style={{ width:Dimensions.get('window').width, height:Dimensions.get('window').height }}
      />
        
      </ScrollView>
    
    );
  }
}
