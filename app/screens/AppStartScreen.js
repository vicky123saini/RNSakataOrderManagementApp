import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import * as Auth from '../Auth';

export default class AppStartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  async componentDidMount(){
    let tt=this;
    setTimeout(function(){
      try{
      Auth.IsLoogedIn().then(resp=>{
        if(resp){
          tt.props.navigation.navigate("OrderListScreen");
        }
        else{
          tt.props.navigation.navigate("LoginScreen");
        }
      })
    }
    catch{
      tt.props.navigation.navigate("LoginScreen");
    }
    },5000)
  }

  render() {
    return (
      <View style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center"}}> 
        {/* <Image source={require('../assets/images/welcome.png')} style={styles.backgroundImage} /> */}
        <Image source={require('../assets/images/logosakata.png')} style={{width:300, height:87}} />
        {/* <Text style={{marginTop:-50, width:"100%", textAlign:"center"}}>Powered by Sakata</Text> */}
      </View>
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

var styles=StyleSheet.create({
    backgroundImage: {
        
        resizeMode: 'cover', // or 'stretch'
        width:windowWidth,
        height:windowHeight
      }
})