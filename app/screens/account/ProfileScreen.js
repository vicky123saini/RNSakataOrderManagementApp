import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import * as Api from '../../ApiServices';
import * as Auth from '../../Auth';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{}
    };
  }

  async componentDidMount(){
    const AccessToken = await Auth.AccessToken(); 
    var req={"EmployeeID": AccessToken.BRID, "Key":AccessToken.Key};
    
    Api.ViewProfileService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
         this.setState({data:resp.responseObject[0]});
      }
      else{
        
      }
    })
  }

  render() {
    return (
        <View style={{flex:1, backgroundColor:"#fff", padding:20}}>
             
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label,{flex:2}]}> First Name </Text>
            <Text style={[styles.input,{flex:3}]}>{this.state.data.FirstName}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label,{flex:2}]}> Last Name </Text>
            <Text style={[styles.input,{flex:3}]}>{this.state.data.LastName}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label,{flex:2}]}> Employee Code </Text>
            <Text style={[styles.input,{flex:3}]}>{this.state.data.EmployeeCode}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label,{flex:2}]}> Gender </Text>
            <Text style={[styles.input,{flex:3}]}>{this.state.data.GenderName}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label,{flex:2}]}> Department </Text>
            <Text style={[styles.input,{flex:3}]}>{this.state.data.DepartmentName}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label,{flex:2}]}> Designation </Text>
            <Text style={[styles.input,{flex:3}]}>{this.state.data.DesignationName}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label,{flex:2}]}> Date of Joining </Text>
            <Text style={[styles.input,{flex:3}]}>{this.state.data.DOJ}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label,{flex:2}]}> Reporting </Text>
            <Text style={[styles.input,{flex:3}]}>{this.state.data.ReportingName}</Text>
          </View>
        </View>
    );
  }
}

var styles=StyleSheet.create({
    inputGroup:{
        flexDirection:"row", 
        alignContent:"space-between", 
        alignItems:"center",
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
    }
})