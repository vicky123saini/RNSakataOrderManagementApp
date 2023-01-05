import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import ValidationComponent from 'react-native-form-validator';
import * as Api from '../../ApiServices';
import * as Auth from '../../Auth';

export default class ChangePasswordScreen extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
        OldPassword: "",
        Password: "",
        ConfirmPassword: ""
    };
  }

  _Submit = async() =>{
    this.validate({
        OldPassword: {required: true},
        Password: {required: true},
        ConfirmPassword: {required: true}
      });
    if(!this.isFormValid()) return;

    if(this.state.Password!=this.state.ConfirmPassword){
      this._addError("ConfirmPassword", "required", "required" );
      return;
    }

    const AccessToken = await Auth.AccessToken(); 
    var req =  {"AppAccessID":AccessToken.AppAccessID,"OldPassword":this.state.OldPassword,"NewPassword":this.state.Password,"ConfirmNewPassword":this.state.ConfirmPassword}

    
    
    Api.ChangePasswordService(req).then(resp => {
      
      if(resp.responseCode=="1"){
        alert('Password Changed Successfully.');
        this.props.navigation.navigate("OrderListScreen");
      }
      else{
        alert(resp.responseMessage);
        
      }
    })
  }

  render() {
    return (
        <View style={{flex:1, justifyContent:"center"}}>
        <View style={{backgroundColor:"#fff", padding:20}}>
            
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Old Password</Text>
            <TextInput secureTextEntry={true} style={[styles.input, this.isFieldInError('OldPassword')?styles.error:{}]} value={this.state.OldPassword} onChangeText={(text)=> this.setState({OldPassword:text})}/>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Password</Text>
            <TextInput secureTextEntry={true} style={[styles.input, this.isFieldInError('Password')?styles.error:{}]} value={this.state.Password} onChangeText={(text)=> this.setState({Password:text})}/>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Confirm Password</Text>
            <TextInput secureTextEntry={true} style={[styles.input, this.isFieldInError('ConfirmPassword')? styles.error:{}]} value={this.state.ConfirmPassword} onChangeText={(text)=> this.setState({ConfirmPassword:text})}/>
          </View>

           
          <View style={{flexDirection:"row", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                <Text style={[styles.text, styles.grayButton,{width:120}]}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this._Submit()}>
                <Text style={[styles.text, styles.pinkButton,{width:120}]}>PROCEED</Text>
            </TouchableOpacity>
          </View>

          {/* <Text>
            {this.getErrorMessages()}
          </Text> */}
         
        </View>
        </View>
    );
  }
}


var styles=StyleSheet.create({
    inputGroup:{
        marginTop:10,
        marginBottom:10,
    },
    input:{
        borderWidth:1,
        borderColor:"#ccc",
        padding:10
    },
    label:{
        fontSize:16,
        fontWeight:"700"
    },
    text:{
        fontFamily:"Roboto"
    },
    grayButton:{
        backgroundColor:"#a7a5b4", 
        padding:15, 
        margin:1,
        fontSize:15,
        fontWeight:"700",
        color:"#fff"
    },
    pinkButton:{
        backgroundColor:"#d81c59", 
        padding:15, 
        margin:1,
        fontSize:15,
        fontWeight:"700",
        color:"#fff"
    },
    pickerOuter:{flex:1, borderWidth:1, borderColor:"#ccc"},
    error:{
      borderColor:"#ff0000",
      borderWidth:2,
    },
    errorStar:{
      color:"#ff0000",
      fontWeight:"bold"
    },
  yelloButton:{
      backgroundColor:"#fbab00", 
      padding:15, 
      margin:1,
      fontSize:15,
      fontWeight:"700"
  }
})