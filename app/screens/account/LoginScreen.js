import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import {Overlay} from 'react-native-elements';
import * as Api from "../../ApiServices";
import * as Auth from '../../Auth';
import ValidationComponent from 'react-native-form-validator';

export default class LoginScreen extends ValidationComponent {
  constructor(props) {
    super(props);
    // this.state = {
    //     SID:"SID",
    //     UserId:"admin",
    //     Password:"1",
    //     IsProcessing:false
    // };
    this.state = {
      SID:"",
      UserId:"",
      Password:"",
      IsProcessing:false,
      visible:false
  };
  }
  
  forgotPassword = () =>{
    if(!this.state.Email){
      alert("Email Required");
      return;
    }
    var req={EmailIDS:this.state.Email.split(",")}
    
    Api.ForgotPasswordService(req).then(resp=>{
      
      alert(resp.responseMessage);
      this.setState({Email:null, visible:false});
    });
  }

  login = () => {
    this.validate({
        SID: {required: true},
        UserId: {required: true},
        Password: {required: true},
      });
 if(!this.isFormValid()) return;

 this.setState({IsProcessing:true});
    var req={
                               "PrmAppAccessSession":
     			{
    				"AppAccessUID":this.state.UserId, "AppAccessPWD":this.state.Password,
     				"AppAccessTypeID":"0", "CompanyCode":this.state.SID
     			}} 
                 
                 
    Api.LoginService(req).then(resp=>{
        this.setState({IsProcessing:false});
        
        if(resp.responseCode=="1"){
            var obj=JSON.parse(JSON.stringify( resp.responseObject[0]));
            //obj.Key="QF";//Fisxe for the time bean
            if(obj.AppAccessTypeID==503)// fix by bheem on 23/Feb/2021 check skype
            {
              var tbody={"AppAccessID":obj.AppAccessID,"Key":obj.Key,"RoleID":obj.DefaultRole}//"RoleID":obj.TeamRole[0].ValueField}
              
              Api.GetEmployeeRolefunctionService(tbody).then(tresp=>{
                
                obj.TeamMemberList=tresp;
                Auth.Login(obj);
                this.props.navigation.replace("OrderListScreen");
              });
            }
            else{
              Auth.Login(obj);
              this.props.navigation.replace("OrderListScreen");
            }
            
          }
          else{
            alert(resp.responseMessage)
          }
        
        
    });

  }

  render() {
    return (
        <ScrollView>
          <Overlay overlayStyle={{width:"100%", backgroundColor:"transparent"}} visible={this.state.visible} onBackdropPress={()=>this.setState({visible:false})}>
            <View style={[styles.cart, {}]}>
              <View style={styles.inputgroup}>
                  <Image source={require('../../assets/images/user-group-512.png')} style={{width:15, height:15, resizeMode:"stretch", marginRight:10}}/>
                  <TextInput style={[styles.inputtext]} value={this.state.Email} onChangeText={(text)=>this.setState({Email:text})} placeholder="Email"></TextInput>
                  <Text style={{color:"#ccc"}}>(Required)</Text>
              </View>
              <TouchableOpacity style={[styles.button,{marginTop:20}]} onPress={this.forgotPassword}>
                <Text style={[styles.text,{color:"#fff", fontWeight:"700", fontSize:16}]}>Submit</Text>
              </TouchableOpacity> 
            </View>
          </Overlay>
      <View>
        <View elevation={5} style={{backgroundColor:"#fff", marginBottom:5, height:75, paddingLeft:20, justifyContent:"center"}}>
            <Image source={require('../../assets/images/logo.png')} style={{width:"50%", height:38, resizeMode:"stretch"}}/>
        </View>
        <View style={styles.cart}>
            <Text style={{marginTop:10, color:"#4a89dc", fontSize:17}}>Let's start</Text>
            <Text style={[styles.text,{width:"100%", marginBottom:10, fontSize:35, fontWeight:"700"}]}>Sign In</Text>
            <Text style={styles.text}>Enter your credentials below to sign into your account.</Text>
            <View style={styles.inputgroup}>
                <Image source={require('../../assets/images/user-group-512.png')} style={{width:15, height:15, resizeMode:"stretch", marginRight:10}}/>
                <TextInput style={[styles.inputtext,this.isFieldInError('SID')?styles.error:{}]} value={this.state.SID} onChangeText={(text)=>this.setState({SID:text})} placeholder="SID" ref="SID"></TextInput>
                <Text style={{color:"#ccc"}}>(Required)</Text>
            </View>
            <View style={styles.inputgroup}>
                <Image source={require('../../assets/images/user-alt-512.png')} style={{width:15, height:15, resizeMode:"stretch", marginRight:10}}/>
                <TextInput style={[styles.inputtext,this.isFieldInError('UserId')?styles.error:{}]} value={this.state.UserId} onChangeText={(text)=>this.setState({UserId:text})} placeholder="User ID" ref="UserId"></TextInput>
                <Text style={{color:"#ccc"}}>(Required)</Text>
            </View>
            <View style={styles.inputgroup}>
                <Image source={require('../../assets/images/key.png')} style={{width:15, height:15, resizeMode:"stretch", marginRight:10}}/>
                <TextInput secureTextEntry={true} style={[styles.inputtext,this.isFieldInError('Password')?styles.error:{}]} value={this.state.Password} onChangeText={(text)=>this.setState({Password:text})} placeholder="Password" ref="Password"></TextInput>
                <Text style={{color:"#ccc"}}>(Required)</Text>
            </View>
            
            {
                this.state.IsProcessing?
                <ActivityIndicator
          animating={true}
          style={styles.indicator}
          size="large"
          color="#0000ff"
        />
        :
            <TouchableOpacity style={[styles.button,{marginTop:20}]} onPress={this.login}>
              <Text style={[styles.text,{color:"#fff", fontWeight:"700", fontSize:16}]}>Login</Text>
            </TouchableOpacity> 
            }
            
            <View style={{marginTop:20}}>
              <TouchableOpacity onPress={()=> this.setState({visible:true})}>
                <Text style={{color:"#4a89dc"}}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
      </ScrollView>
    );
  }
}

var styles=StyleSheet.create({
    cart:{
        margin:15,
        padding:15,
        borderWidth:1,
        borderColor:"#ccc",
        borderRadius:15,
        backgroundColor:"#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    button:{
        backgroundColor:"#48bc7d",
        padding:20,
        borderRadius:10,
        alignContent:"center",
        alignItems:"center",
    },
    text:{
        fontFamily:"Roboto"
    },
    inputgroup:{
        flexDirection:"row",
        alignContent:"center",
        alignItems:"center",
        borderBottomWidth:1,
        borderBottomColor:"#CCC",
        marginBottom:5,
        padding:10,
    },
    inputtext:{ 
        width:"70%"
    },
    error:{
        borderColor:"#ff0000",
        borderWidth:2,
    }
})