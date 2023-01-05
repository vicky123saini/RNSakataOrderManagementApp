import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Picker } from 'native-base';
import moment from 'moment';
import { Overlay } from 'react-native-elements';
import * as Api from '../ApiServices';
import * as Auth from '../Auth';

import ValidationComponent from 'react-native-form-validator';
import SearchableDropdown from 'react-native-searchable-dropdown';

export default class CreateOrderScreen extends ValidationComponent  {
  constructor(props) {
    super(props);
    this.state = {
      SaleTypeList:[],
      SaleType:"",
      ReferenceTypeList:[],
      ReferenceType:"",
      SaleReferenceNo:"",
      SalesExecutiveList:[],
      SalesExecutive:"",
      CustomerNameList:[],
      CustomerName:"",
      ContactPersonList:[],
      ContactPerson:"",
      PriorityTypeList:[],
      PriorityType:"",
      DispatchBranchList:[],
      DispatchBranch:"",
      ShipingMethodList:[],
      ShipingMethod:"",
      ShippingCompanyList:[],
      ShippingCompany:"",
      PaymentMethodList:[],
      PaymentMethod:"",
      PaymentDetails:"",
      ShippingDate:moment(new Date()).format('DD-MM-YYYY'),
      isPopupOpen:false,
      loading:false
    };
    
  }

  async componentDidMount(){
    this.setState({loading:true});
    var t1=await this.BindSaleType();
    var t2=await this.ReferenceType();
    var t3=await this.SalesExecutiveBind();
    var t4=await this.PriorityType();
    var t5=await this.DispatchBranch();
    var t6=await this.ShipingMethod();
    var t7=await this.ShippingCompany();
    var t8=await this.PaymentMethod();
    Promise.all([t1,t2,t3,t4,t5,t6,t7,t8]).then(()=> this.setState({loading:false}));
  }

  SaleTypeChange = (itemValue, itemIndex) =>{
    this.clear(1);
    this.setState({SaleType:itemValue},()=>{this.CustomerNameBind(); this.ShippingCompany()});
  }

  SalesExecutiveChange = (itemValue, itemIndex) =>{
    this.clear(2);
    this.setState({SalesExecutive:itemValue}, ()=>this.CustomerNameBind());
  }

  CustomerNameChange = (itemValue, itemIndex) =>{
    this.clear(3);
    this.setState({CustomerName:itemValue}, ()=>{this.ContactPerson(); this.ContactPersonAddres();});
  }

  BindSaleType = async() =>{
    const AccessToken = await Auth.AccessToken(); 
    var req={"ObjCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"BRID":AccessToken.BRID,"SBMCEntityID":"254jdhdfgd8@!kfjf"}};
    Api.SaleTypeService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({SaleTypeList:resp.responseObject});
      }
      else{
        
      }
    })
  }

  ReferenceType = async() =>{
    const AccessToken = await Auth.AccessToken(); 
    var req={"ControlCode":"cm21070ss7","ActionID":1,"objCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":0}};
    Api.ReferenceTypeService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({ReferenceTypeList:resp.responseObject});
      }
      else{
        
      }
    })
  }

  SalesExecutiveBind = async() =>{
    const AccessToken = await Auth.AccessToken(); 
    var req={"ControlCode":"cm999450707","objCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":1051001,"TeamMemberList":AccessToken.TeamMemberList}};
    
    Api.SalesExecutiveService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({SalesExecutiveList:resp.responseObject});
        if(AccessToken.SBRID!=null){
          this.setState({ SalesExecutive: AccessToken.SBRID });
          var tt=this.state.SalesExecutiveList.find(item=>item.ValueField==AccessToken.SBRID);
          if(tt)
            this.setState({ SalesExecutiveName: tt.DisplayField });
        }
      }
      else{
        
      }
    })
  }

  CustomerNameBind = async() =>{
    if(this.state.SaleType=="" || this.state.SalesExecutive=="") return;
    const AccessToken = await Auth.AccessToken(); 
    this.setState({loading:true});
    var req={"SearchKey":"","Type":2,"DocumentID":this.state.SaleType,"EmployeeID":this.state.SalesExecutive,"objCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":0}};
    
    Api.CustomerNameService(req).then(resp=>{
      this.setState({loading:false});
      
      if(resp.responseCode=="1"){
        this.setState({CustomerNameList:resp.responseObject});
      }
      else{
        alert(resp.responseMessage)
      }
    })
  }

  ContactPerson = async() =>{
    if(this.state.CustomerName=="") return;
    const AccessToken = await Auth.AccessToken(); 
    var req={"ContactPerson": {"Action": "GETCONTACTPERSON", "Key":AccessToken.Key,  "SupplierID": this.state.CustomerName, "UserID": AccessToken.AppAccessID}};
    
    Api.ContactPersonService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({ContactPersonList:resp.responseObject});
        if(resp.responseObject.length==1){
          this.setState({ContactPerson:resp.responseObject[0].ContactPersonID})
        }
      }
      else{
        
      }
    })
  }

  ContactPersonAddres = async() =>{
    if(this.state.CustomerName=="") return;
    const AccessToken = await Auth.AccessToken(); 
    var req={"ContactPerson": {"Action": "GETCONTACTPERSONADDRESS", "Key":AccessToken.Key,  "SupplierID": this.state.CustomerName, "UserID": AccessToken.AppAccessID, "SLocationType":0, "AddressID":0}};
    
    Api.ContactPersonAddresService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({ContactPersonAddres:resp.Address[0]});
      }
      else{
        
      }
    })
  }

  PriorityType = async() =>{
    const AccessToken = await Auth.AccessToken(); 
    var req={"CommonMasterCode":"zdg52j3964mrtw","Key":AccessToken.Key,"Flag":2};
    
    Api.PriorityTypeService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({PriorityTypeList:resp.responseObject});
        var tt=resp.responseObject.find(o=>o.CommonMasterValue=="Normal");
        if(tt)
        this.setState({PriorityType:tt.SCommonMasterID});
      }
      else{
        
      }
    })
  }

  DispatchBranch = async() =>{
    const AccessToken = await Auth.AccessToken(); 
    var req={"ControlKey":"cm8964","objCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":0}};
    
    Api.DispatchBranchService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({DispatchBranchList:resp.responseObject});
        if(resp.responseObject!=null && resp.responseObject.length==1){
          this.setState({DispatchBranch:resp.responseObject[0].ValueField})
        }
      }
      else{
        
      }
    })
  }

  ShipingMethod = async() =>{
    const AccessToken = await Auth.AccessToken(); 
    var req={"ControlCode":"inv545457","SItemPropertyID":"QN","objCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":3}}
    
    Api.ShipingMethodService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({ShipingMethodList:resp.responseObject});
      }
      else{
        
      }
    })
  }

  ShippingCompany = async() =>{
    const AccessToken = await Auth.AccessToken(); 
    var req={"SearchKey":"","Type":6,"DocumentID":this.state.SaleType,"objCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":0}};
    
    Api.ShippingCompanyService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({ShippingCompanyList:resp.responseObject});
      }
      else{
        
      }
    })
  }

  PaymentMethod = async() =>{
    const AccessToken = await Auth.AccessToken(); 
    var req={"CommonMasterCode":"usk003gg77nn","Key":AccessToken.Key,"Flag":2}
    
    Api.PaymentMethodService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
        this.setState({PaymentMethodList:resp.responseObject});
      }
      else{
        
      }
    })
  }

  
  ContactPersonAddress = async(SupplierID) =>{
    const AccessToken = await Auth.AccessToken(); 
    this.setState({loading:true});
    var req={"ContactPerson":{"Action":"GETCONTACTPERSONADDRESS","Key":AccessToken.Key,"SupplierID":SupplierID,"UserID":AccessToken.AppAccessID,"SLocationType":0,"AddressID":0}}
    
    Api.GetContactPersonAddressService(req).then(resp=>{
      this.setState({loading:false})
      
      if(resp.responseCode=="1"){
        this.setState({SelectedBilling:resp.Address[0]});
        this.setState({SelectedShipping:resp.Address[0]});
      }
      else{
        alert(resp.responseMessage)
      }
    });
  }
   
  ChangeAddress=async(typ)=>{
    const AccessToken = await Auth.AccessToken(); 
    this.setState({isPopupOpen:true});
    this.setState({AddressSelectionType:typ});
    var req={"Supplier":{"Action":"GETSUPPLIERADDRESS","Key":AccessToken.Key,"SupplierID":this.state.CustomerName,"UserID":AccessToken.AppAccessID}}
    if(typ=="Bill"){
      req.Supplier.SLocationType="cm8991";
    }
    else if(typ=="Ship"){
      req.Supplier.SLocationType="cm8964";
    }
    
    

    Api.GetSupplierAddressService(req).then(resp=>{
       
      if(resp.responseCode=="1"){
        this.setState({SupplierAddressList:resp.responseObject[0].Addresss});
      }
      else{
        
      }
    });
  }

  SelectAnAddress=async(SelectedAddress)=>{
    this.setState({isPopupOpen:false});
    if(this.state.AddressSelectionType=="Bill"){
      this.setState({SelectedBilling:SelectedAddress});
    }
    else if(this.state.AddressSelectionType=="Ship"){
      this.setState({SelectedShipping:SelectedAddress});
    }
  }

  Submit = async()=>{
    var tt=this.state.PaymentMethodList.find(o=>o.SCommonMasterID==this.state.PaymentMethod);
    var IsPaymentDetailsReq = tt && tt.CommonMasterValue!="Credit";

    this.validate({
      SaleType: {required: true},
      SalesExecutive: {required: true},
      CustomerName: {required: true},
      ContactPerson: {required: true},
      DispatchBranch: {required: true},
      ShipingMethod: {required: true},
      ShippingCompany: {required: true},
      PaymentMethod: {required: true},
      SaleReferenceNo: {required:(this.state.ReferenceType!=null && this.state.ReferenceType.trim()!="")},
      PaymentDetails:{required:IsPaymentDetailsReq}
    });

    if(!this.isFormValid()) return;

    if(this.state.SaleType == null || this.state.SaleType==""){
      alert("Sales Type Required");
      return;
    } 
    if(this.state.SalesExecutiveName==null || this.state.SalesExecutiveName==""){
      alert("Sales Executive Required");
      return;
    } 
    if(this.state.CustomerName==null || this.state.CustomerName==""){
      alert("Customer Name Required");
      return;
    } 

    this.setState({loading:true});

    const AccessToken = await Auth.AccessToken(); 
    var req =  {
      "PrmSO": {
          "SaleOrderID": "0",
          "DocumentID":  this.state.SaleType,
          "DocumentName":  this.state.SaleTypeList.find(item=>item.ValueField==this.state.SaleType).DisplayField,
          "SaleReferenceDCode":  this.state.ReferenceType,
          "SaleReferenceNo":  this.state.SaleReferenceNo,
          "SalesExecutiveID":  this.state.SalesExecutive,
          "SalesExecutiveName":  this.state.SalesExecutiveList.find(item=>item.ValueField==this.state.SalesExecutive).DisplayField,
          "CustomerID":  this.state.CustomerName,
          "CustomerName":  this.state.CustomerNameList.find(item=>item.ValueField==this.state.CustomerName).DisplayField,
          "ContactPersonID": this.state.ContactPerson,
          "CustomerAddressID":  this.state.ContactPersonAddres.AddressID,
          "ShipToTP": false,
          "ShipToID":  this.state.SelectedBilling? this.state.SelectedBilling.AddressID : this.state.CustomerName,
          "ShipToAddressID":  this.state.SelectedShipping ? this.state.SelectedShipping.AddressID : this.state.ContactPersonAddres.AddressID,
          "ShipToContactPersonID":  this.state.ContactPerson,
          "BillToTP": false,
          "BillToID": this.state.SelectedBilling? this.state.SelectedBilling.AddressID : this.state.CustomerName,
          "BillToAddressID": this.state.ContactPersonAddres.AddressID,
          "BillToContactPersonID": this.state.ContactPerson,

          "ShippingMethodID": this.state.ShipingMethod,
          "ShippingCompanyID": this.state.ShippingCompany,
          "ExpShippingDate": this.state.ShippingDate.toString(),
          "DispatchBranchID": this.state.DispatchBranch,
          "PaymentMethodID": this.state.PaymentMethod,
          "PaymentDetails": this.state.PaymentDetails,
          "SOCurrencyID": "QJqHs9mzkdmj",
          "FXRate": 500,
          "SOPDF": "",
          "SODate": moment(new Date()).format('DD-MM-YYYY'),
          "SOStatusName": "",
          "SONumber": "",
          "PriorityID": this.state.PriorityType
          
      },
      "ObjCommon": {
        "InsertedUserID":AccessToken.AppAccessID,
        "InsertedSessionID":AccessToken.AppAccessSessionID,
        "CompanyID":AccessToken.CompanyID,
        "Key":AccessToken.Key,
        "SRightID": "",
        "BMCEntityID": 0,
        "DateShort": "dd-MM-yyyy",
        "Source":"MGIS2"
      }
  };

    
    const{BindHomePage} = this.props.route.params;
    Api.CreateOrderService(req).then(resp => {
      this.setState({loading:false});
      
      if(resp.responseCode=="1"){
        alert('Order Created Successfully.');
        BindHomePage();
        this.props.navigation.replace("AddItemScreen", {SaleOrderID: resp.responseObject[0].SaleOrderID, SelectedOrder:resp.responseObject[0]/*{SaleOrderID:resp.responseObject[0].SaleOrderID, DocumentID:resp.responseObject[0].DocumentID}*/, BindHomePage:BindHomePage});
        //this.props.navigation.navigate("OrderListScreen");
      }
      else{
        alert(resp.responseMessage)
      }
    })
  }

  clear = (level) =>{
    switch(level){
      case 1:{//Sales Type
        this.setState({CustomerNameDisplay:null, CustomerNameList:[], SalesExecutiveName:null,  SalesExecutive:null, ShippingCompany:null, ShippingCompanyList:[]});
      }
      case 2:{
        this.setState({CustomerNameList:[], SalesExecutiveName:null,  SalesExecutive:null, ContactPersonList:[], ContactPerson:null, ContactPersonAddres:null, SelectedBilling:null, SelectedShipping:null});
      }
      case 3:{
        this.setState({CustomerNameDisplay:null,CustomerName:null, ContactPerson:null, ContactPersonAddres:null, SelectedBilling:null, SelectedShipping:null});
      }
    }
  }

  render() {
    return (
      <>
      {
          this.state.loading &&
          <View style={{flex:1, position:"absolute", top:0, bottom:0,left:0,right:0, zIndex:9, alignContent:"center", justifyContent:"center", backgroundColor: 'white', opacity: 0.7}}>
            <ActivityIndicator color="#0000ff"/>
          </View>
        }
      <Overlay overlayStyle={{width:"90%"}} isVisible={this.state.isPopupOpen} onBackdropPress={()=>this.setState({isPopupOpen:false})}>
      {
          this.state.loading &&
          <View style={{flex:1, position:"absolute", top:0, bottom:0,left:0,right:0, zIndex:9, alignContent:"center", justifyContent:"center", backgroundColor: 'white', opacity: 0.7}}>
            <ActivityIndicator color="#0000ff"/>
          </View>
        }
          <View style={{width:"100%", borderColor:"#fff", marginTop:1}}>
            <View style={{width:"100%", backgroundColor:"#222222", marginTop:1}}>
              <Text style={{width:"100%", textAlign:"center", color:"#d99f3a", fontSize:22, padding:10}}>Select Address</Text>
            </View>
            <View>
              <View style={{marginTop:10, marginBottom:10}}>
                {
                  this.state.SupplierAddressList && this.state.SupplierAddressList.length==0 &&
                  <Text>NO DATA FOUND</Text>
                }
                {
                  this.state.SupplierAddressList && this.state.SupplierAddressList.map((item, index)=>(
                    <View key={index}>
                      <TouchableOpacity onPress={()=> this.SelectAnAddress(item)}>
                        <View style={{borderWidth:1, borderColor:"#ccc", marginTop:1, marginBottom:1}}>
                          <Text style={[styles.text,{padding:10, fontWeight:"bold"}]}>{item.AddressType}</Text>
                          <Text style={[styles.text,{padding:10, paddingTop:0}]}>{item.AddressTitle }{item.AddressLine1} {item.AddressLine2} {item.CityName}, {item.StateName}-{item.Pincode} {item.CommunicationInfo}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                }
              </View>
              
            </View>
          </View>
        </Overlay>

        <ScrollView keyboardShouldPersistTaps = 'always'>
        <View style={{flex:1, backgroundColor:"#fff", padding:20}}>
             
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Sales Type <Text style={styles.errorStar}>*</Text></Text>
            <View style={[styles.pickerOuter, this.isFieldInError('SaleType')?styles.error:{}]}>
                <Picker selectedValue={this.state.SaleType} onValueChange={this.SaleTypeChange} ref="SaleType">
                <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.SaleTypeList.map(item=>(<Picker.Item label={item.DisplayField} value={item.ValueField} />))
                    }
                </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Reference Type</Text>
            <View style={styles.pickerOuter}>
                <Picker selectedValue={this.state.ReferenceType} onValueChange={(itemValue, itemIndex) => this.setState({ReferenceType:itemValue})}>
                <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.ReferenceTypeList.map(item=>(<Picker.Item label={item.DisplayField} value={item.ValueField} />))
                    }
                </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Reference No</Text>
            <TextInput style={[styles.input, this.isFieldInError('SaleReferenceNo')?styles.error:{}]} value={this.state.SaleReferenceNo} onChangeText={(text)=> this.setState({SaleReferenceNo:text})}/>
          </View>
          {/* <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Sales Executive</Text>
            <View style={[styles.pickerOuter, this.isFieldInError('SalesExecutive')?styles.error:{}]}>
                <Picker selectedValue={this.state.SalesExecutive} onValueChange={this.SalesExecutiveChange} ref="SalesExecutive">
                <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.SalesExecutiveList.map(item=>(<Picker.Item label={item.DisplayField} value={item.ValueField} />))
                    }
                </Picker>
            </View>
          </View> */}
          <View>
          <Text style={[styles.text,styles.label]}>Sales Executive <Text style={styles.errorStar}>*</Text></Text>
          {
            this.state.SalesExecutiveName ?
              <Text onPress={()=>this.setState({SalesExecutiveName:null})} style={[{padding:15, borderWidth:1, borderColor:"#ccc"},this.isFieldInError('SalesExecutive') && styles.error]} >{this.state.SalesExecutiveName}</Text>
            :
          <View>
          <SearchableDropdown
            
            onItemSelect={(item) => {
              //const items = this.state.SalesExecutive;
              //items.push(item)
              this.setState({loading:true});
              this.SalesExecutiveChange(item.id,0);
              this.setState({ SalesExecutive: item.id });
              this.setState({ SalesExecutiveName: item.name });
            }}
            containerStyle={{ padding: 5 }}
            // onRemoveItem={(item, index) => {
            //   //const items = this.state.SalesExecutive.filter((sitem) => sitem.id !== item.id);
            //   this.setState({ SalesExecutive: "" });
            // }}
            itemStyle={{
              padding: 10,
              marginTop: 0,
              backgroundColor: '#fff',
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{ color: '#222' }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={this.state.SalesExecutiveList.map(item=>{return {name:item.DisplayField, id:item.ValueField}})}
            //defaultIndex={2}
            resetValue={false}
            textInputProps={
              {
                placeholder: "Select Sales Executive Person",
                underlineColorAndroid: "transparent",
                style: {
                    padding: 12,
                    borderWidth: 1,
                    borderColor: this.isFieldInError('SalesExecutive') ? '#f00':'#ccc',
                    borderRadius: 5,
                }
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
              }
            }
        />
        </View>
          }
          </View>

          {/* <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Customer Name</Text>
            <View style={[styles.pickerOuter, this.isFieldInError('CustomerName')?styles.error:{}]}>
              <Picker selectedValue={this.state.CustomerName} onValueChange={this.CustomerNameChange} ref="CustomerName">
              <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.CustomerNameList.map(item=>(<Picker.Item label={item.DisplayField} value={item.ValueField} />))
                    }
                </Picker>
            </View>
          </View> */}
           <View>
          <Text style={[styles.text,styles.label]}>Customer Name <Text style={styles.errorStar}>*</Text></Text>
          {
            this.state.CustomerNameDisplay ?
              <Text onPress={()=>{this.setState({CustomerName:null}); this.setState({CustomerNameDisplay:null});}} style={[{padding:15, borderWidth:1, borderColor:"#ccc"}, this.isFieldInError('CustomerName')?styles.error:{}]} ref="CustomerName">{this.state.CustomerNameDisplay}</Text>
            :
          <View>
          <SearchableDropdown
            
            onItemSelect={(item) => {
              //const items = this.state.SalesExecutive;
              //items.push(item)
              this.setState({loading:true});
              this.CustomerNameChange(item.id, 0);
              this.setState({ CustomerNameDisplay: item.name });
              this.ContactPersonAddress(item.id);
            }}
            containerStyle={{ padding: 5 }}
            // onRemoveItem={(item, index) => {
            //   //const items = this.state.SalesExecutive.filter((sitem) => sitem.id !== item.id);
            //   this.setState({ SalesExecutive: "" });
            // }}
            itemStyle={{
              padding: 10,
              marginTop: 0,
              backgroundColor: '#fff',
              borderColor: '#000',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{ color: '#222' }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={this.state.CustomerNameList.map(item=>{return {name:item.DisplayField, id:item.ValueField}})}
            //defaultIndex={2}
            resetValue={false}
            textInputProps={
              {
                placeholder: "Select Customer Name",
                underlineColorAndroid: "transparent",
                style: {
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                }
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
              }
            }
        />
        </View>
          }
          </View>

          <View style={styles.inputGroup}>
            <View style={{flexDirection:"row"}}>
              <Text style={[styles.text,styles.label]}>Bill To</Text>
              <TouchableOpacity onPress={()=>this.ChangeAddress("Bill")}>
                <Image source={require('../assets/images/ico-out.png')} style={{marginLeft:10, marginBottom:10, width:20, height:20, resizeMode:"stretch"}}/>
              </TouchableOpacity>
            </View>
            <View style={{borderWidth:1, borderColor:"#ccc", padding:15}}>
              {
                this.state.SelectedBilling &&
                <Text style={styles.text}>{this.state.SelectedBilling.AddressTitle }{this.state.SelectedBilling.AddressLine1} {this.state.SelectedBilling.AddressLine2} {this.state.SelectedBilling.CityName}, {this.state.SelectedBilling.StateName}-{this.state.SelectedBilling.Pincode} {this.state.SelectedBilling.CommunicationInfo}</Text>
              }
            </View>
          </View>

          <View style={styles.inputGroup}>
          <View style={{flexDirection:"row"}}>
              <Text style={[styles.text,styles.label]}>Ship To</Text>
              <TouchableOpacity onPress={()=>this.ChangeAddress("Ship")}>
                <Image source={require('../assets/images/ico-out.png')} style={{marginLeft:10, marginBottom:10, width:20, height:20, resizeMode:"stretch"}}/>
              </TouchableOpacity>
            </View>
            <View style={{borderWidth:1, borderColor:"#ccc", padding:15}}>
              {
                this.state.SelectedShipping &&
                <Text style={styles.text}>{this.state.SelectedShipping.AddressTitle }{this.state.SelectedShipping.AddressLine1} {this.state.SelectedShipping.AddressLine2} {this.state.SelectedShipping.CityName}, {this.state.SelectedShipping.StateName}-{this.state.SelectedShipping.Pincode} {this.state.SelectedShipping.CommunicationInfo}</Text>
              }
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Contact Person <Text style={styles.errorStar}>*</Text></Text>
            <View style={[styles.pickerOuter, this.isFieldInError('ContactPerson')?styles.error:{}]}>
            <Picker selectedValue={this.state.ContactPerson} onValueChange={(itemValue, itemIndex) => this.setState({ContactPerson:itemValue})} ref="ContactPerson">
                <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.ContactPersonList.map(item=>(<Picker.Item label={item.ContactPersonName} value={item.ContactPersonID} />))
                    }
                </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Priority Type</Text>
            <View style={styles.pickerOuter}>
              <Picker selectedValue={this.state.PriorityType} onValueChange={(itemValue, itemIndex) => this.setState({PriorityType:itemValue})}>
                <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.PriorityTypeList.map(item=>(<Picker.Item label={item.CommonMasterValue} value={item.SCommonMasterID} />))
                    }
                </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Dispatch Branch <Text style={styles.errorStar}>*</Text></Text>
            <View style={[styles.pickerOuter, this.isFieldInError('DispatchBranch')?styles.error:{}]}>
              <Picker selectedValue={this.state.DispatchBranch} onValueChange={(itemValue, itemIndex) => this.setState({DispatchBranch:itemValue})} ref="DispatchBranch">
                <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.DispatchBranchList.map(item=>(<Picker.Item label={item.DisplayField} value={item.ValueField} />))
                    }
                </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Shipping Method <Text style={styles.errorStar}>*</Text></Text>
            <View style={[styles.pickerOuter, this.isFieldInError('ShipingMethod')?styles.error:{}]}>
              <Picker selectedValue={this.state.ShipingMethod} onValueChange={(itemValue, itemIndex) => this.setState({ShipingMethod:itemValue})} ref="ShipingMethod">
                <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.ShipingMethodList.map(item=>(<Picker.Item label={item.DisplayField} value={item.ValueField} />))
                    }
                </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Shipping Company <Text style={styles.errorStar}>*</Text></Text>
            <View style={[styles.pickerOuter, this.isFieldInError('ShippingCompany')?styles.error:{}]}>
              <Picker selectedValue={this.state.ShippingCompany} onValueChange={(itemValue, itemIndex) => this.setState({ShippingCompany:itemValue})} ref="ShippingCompany">
                <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.ShippingCompanyList.map(item=>(<Picker.Item label={item.DisplayField} value={item.ValueField} />))
                    }
                </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Shipping Date</Text>
           
            <DatePicker
              style={{width: "100%"}}
              date={this.state.ShippingDate}
              mode="date"
              placeholder="select date"
              format="DD-MM-YYYY"
              minDate={new Date()} 
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={(date) => {this.setState({ShippingDate: date})}}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Payment Method <Text style={styles.errorStar}>*</Text></Text>
            <View style={[styles.pickerOuter, this.isFieldInError('PaymentMethod')?styles.error:{}]}>
              <Picker selectedValue={this.state.PaymentMethod} onValueChange={(itemValue, itemIndex) => this.setState({PaymentMethod:itemValue})} ref="PaymentMethod">
                <Picker.Item label="--SELECT--" value="" />
                    {
                      this.state.PaymentMethodList.map(item=>(<Picker.Item label={item.CommonMasterValue} value={item.SCommonMasterID} />))
                    }
                </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.text,styles.label]}>Payment Detail</Text>
            <TextInput style={[styles.input, this.isFieldInError('PaymentDetails')?styles.error:{}]} value={this.state.PaymentDetails} onChangeText={(text)=>this.setState({PaymentDetails:text})}/>
          </View>


          <View style={{flex:1, flexDirection:"row", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                <Text style={[styles.text, styles.grayButton,{width:120}]}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.Submit}>
                <Text style={[styles.text, styles.pinkButton,{width:120}]}>PROCEED</Text>
            </TouchableOpacity>
          </View>

          {/* <Text>
            {this.getErrorMessages()}
          </Text> */}
        </View>
        </ScrollView>
    </>
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