import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Overlay } from 'react-native-elements';
import { Button, Icon, Fab, Radio } from 'native-base';
import {Picker} from '@react-native-community/picker';
import * as Api from '../ApiServices';
import * as Auth from '../Auth';
import * as Cart from '../Cart';
import ValidationComponent from 'react-native-form-validator';

export default class AddItemScreen extends Component {
  constructor(props) {
    super(props);
    //../assets/images/imagenotfound.png
    this.state = {
        visibleDetails:false,
        CropsList:[],
        ItemVariantGroupList:[],
        data:[],
        filteredData:[],
        filteredItemVariantGroupList:[],
        ItemGroupName:null,
        ItemGroupId:null,
        Keywords:null,
        SelectedItem:{},
        ItemOrderType:1,
        QtyOrUnit:"",
        UOMList:[],
        IPTList:[],
        IPUList:[],
        SelectionType:"",
        cartCount:0,
        loading:false
    };
  }

  async componentDidMount(){
   await this.CropsBind();
   
   await this.UpdateCount();

   this.props.navigation.addListener('beforeRemove', async(e) => {
    // Prevent default behavior of leaving the screen
    e.preventDefault();
    const cartCount1=await Cart.ItemCount();
    if(cartCount1>0){
    // Prompt the user before leaving the screen
    Alert.alert(
      'Order Discard Confirmation',
      'You have items in your cart, do you want to discard?',
      [
        { text: "cancel", style: 'cancel', onPress: () => {} },
        {
          text: 'Discard',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: async() => {
            await Cart.Clear();
            this.props.navigation.dispatch(e.data.action);
          },
        },
      ]
    );
   }
   else{
    this.props.navigation.dispatch(e.data.action);
   }
  });
  }

  UpdateCount = async() => {
    
    const cartCount=await Cart.ItemCount();
    this.setState({cartCount:cartCount});
  }

  // async componentWillUnmount(){
  //     // Prompt the user before leaving the screen
  //     Alert.alert(
  //       'Order Discard Confirmation',
  //       'You have items in your cart, do you want to discard?',
  //       [
  //         { text: "cancel", style: 'cancel', onPress: () => {} },
  //         {
  //           text: 'OK',
  //           style: 'destructive',
  //           // If the user confirmed, then we dispatch the action we blocked earlier
  //           // This will continue the action that had triggered the removal of the screen
  //           onPress: async() => {
  //              await Cart.Clear(); 
  //              //this.props.navigation.navigate("OrderListScreen");
  //           },
  //         },
  //       ]
  //     );
  
  // }

  CropeChange=async(itemValue)=>{
    
    var item=this.state.CropsList.find(item=>item.SItemGroupID==itemValue);
    
     
    this.setState({ItemGroupId:itemValue,ItemGroupName:item.ItemGroupName},()=>{
      this.ItemBind();
    });
  }

  Search = async()=>{
    if(this.state.ItemGroupName==null || this.state.ItemGroupName==""){
      alert('Please select any item group first.');
    }

    //await this.ItemBind();
    

    var tt=this.state.data
    .filter(item=>this.state.ItemGroupName==null || this.state.ItemGroupName=="" || item.ItemGroupName==this.state.ItemGroupName)
    .filter(item=>this.state.Keywords==null || this.state.Keywords=="" || item.ItemName.toLowerCase().indexOf(this.state.Keywords.toLowerCase()) > -1 || this.state.Keywords.toLowerCase().indexOf(item.ItemName.toLowerCase()) > -1);
    this.setState({filteredData:tt.slice(0,20)});
    
    //Property
    var tt2=this.state.ItemVariantGroupList
    .filter(item=>this.state.Keywords==null || this.state.Keywords=="" || JSON.stringify(item.Property).toLowerCase().indexOf(this.state.Keywords.toLowerCase()) > -1);
    this.setState({filteredItemVariantGroupList:tt2});
  }

  CropsBind = async()=>{
    const AccessToken = await Auth.AccessToken(); 
    const {SelectedOrder, BindHomePage} = this.props.route.params;
    this.setState({loading:true});
    var req={"CompanyID":"2","DocumentID":SelectedOrder.DocumentID,"ObjCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":0}};
    
    Api.CropsService(req).then(resp=>{
      this.setState({loading:false});
    
      if(resp.responseCode=="1"){
        this.setState({CropsList:resp.responseObject});
      }
      else{
        alert(resp.responseMessage)
      }
    })
  }

  ItemBind = async()=>{
    const AccessToken = await Auth.AccessToken(); 
    const {SelectedOrder, BindHomePage} = this.props.route.params;
    
    this.setState({loading:true});
    var treq={"LineType":"QJqLsVmzkdmj","SItemGroupID":this.state.ItemGroupId,"SearchFiled":"0","SearchKey":"","ISPS":2,"DocumentID":SelectedOrder.DocumentID,
    "objCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":0}}
    
    Api.ItemVariantGroupListService(treq).then(resp=>{
       
      
        this.setState({ItemVariantGroupList:resp});
        this.setState({filteredItemVariantGroupList:resp});


        var req={"SItemGroupID":"QB","SItemID":"0","SItemCodeID":"QN","DocumentID":SelectedOrder.DocumentID,"ObjCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":0}}
        
        
    
        Api.ItemVariantListService(req).then(resp=>{
          this.setState({loading:false});
          if(resp.responseCode=="1"){
            this.setState({data:resp.responseObject});
            //this.setState({filteredData:resp.responseObject.slice(0,20)});
            this.Search();
          }
          else{
            alert(resp.responseMessage)
          }
        })
    })
    
    
    
  }

  SelectItem = async(item)=>{
    this.setState({SelectionType:"ITEM"});
    this.clearSelectrion();
    /*
    as discussed with bhim SUOMID=='QJqLs1mzkdmj' then ItemOrderType:"Quantity"
    */
   item.SUOMID=='QJqLs1mzkdmj' ? this.setState({ItemOrderType:1}):this.setState({ItemOrderType:2});

    this.setState({visibleDetails:true}); 
    this.setState({SelectedItem:item});
    this.setState({SelectedItemGroup:{}})
    this.setState({QtyOrUnit:""});
    
  }

  SelectItemGroup=async(item)=>{
    const AccessToken = await Auth.AccessToken();
    this.setState({SelectionType:"GROUP"});
    
    const SItemID=item.Property.find(o=>o.Key=="ItemID").Value;
    const SelectedItem={SItemID:SItemID};
    this.clearSelectrion();
    this.setState({SelectedItem:SelectedItem});
    this.setState({SelectedItemGroup:item});
    this.setState({QtyOrUnit:""});
    this.setState({loading:true});
    //UOMList
    var req={"SItemID":SItemID,"ObjCommonBO":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":3}}
    //Note :  { "Key": "ItemID","Value": "QVqXsh" };
    
    Api.GetIUOMService(req).then(resp => {
      this.setState({loading:false});
      
      if(resp.responseCode=="1"){
        this.setState({UOMList:resp.responseObject});
        if(resp.responseObject.length==1){
          this.setState({SelectedUOM:resp.responseObject[0].SItemUnitID},()=>this.ChangeIPT(resp.responseObject[0].SItemUnitID))
        }
      }
      else{
        alert(resp.responseMessage)
      }
    });

    // var req1={"SItemID":SItemID,"objCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":3}};

    // Api.GetItemMNUService(req1).then(resp=>{

    //   if(resp.responseCode=="1"){
    //     this.setState({MNUList:resp.responseObject});
    //   }
    //   else{

    //   }
    // });
    this.setState({loading:true});
    var req2={"SItemID":SItemID,"ObjCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":3}};

    Api.GetIPTService(req2).then(resp=>{
      this.setState({loading:false});
      
      if(resp.responseCode=="1"){
        this.setState({IPTList:resp.responseObject});
        // if(resp.responseObject.length==1){
        //   this.setState({SelectedIPT:resp.responseObject[0].SPackingTypeID})
        // }
      }
      else{
        alert(resp.responseMessage)
      }
    });

    

    this.setState({visibleDetails:true});
  }

  clearSelectrion(){
    this.setState({UOMList:[], IPTList:[], IPUList:[]});
    this.setState({SelectedUOM:""});
    this.setState({SelectedIPT:""});
    this.setState({SelectedIPU:""});
  }

  ChangeIPT=async(selectedValue)=>{
    const AccessToken = await Auth.AccessToken();
    this.setState({loading:true});
    this.setState({SelectedUOM:selectedValue},()=>{
    var req3={"SItemID":this.state.SelectedItem.SItemID, "SUOM": selectedValue,  "ObjCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":3}};

    Api.GetIPUService(req3).then(resp=>{
      this.setState({loading:false});
      
      if(resp.responseCode=="1"){
        this.setState({IPUList:resp.responseObject});
        if(resp.responseObject.length==1){
          this.setState({SelectedIPU:resp.responseObject[0].SPackingUnitID})
        }
      }
      else{
        alert(resp.responseMessage)
      }
    });
  });
  }

  _QtyOrUnitChange = (text) =>{

    let newText = '';
    let numbers = '0123456789.';

    if(this.state.ItemOrderType==2){
      numbers = '0123456789';
    }
    for (var i=0; i < text.length; i++) {
      if(numbers.indexOf(text[i]) > -1 ) {
          newText = newText + text[i];
      }
    }
  
    this.setState({QtyOrUnit:newText})
  }
  
  AddItem = async()=>{
    const SelectedUOM = this.state.SelectionType=="ITEM"?this.state.SelectedItem.SUOMID:this.state.SelectedUOM;
    const SelectedIPT = this.state.SelectionType=="ITEM"?this.state.SelectedItem.SPackingTypeCode:this.state.SelectedIPT;
    const SelectedIPU = this.state.SelectionType=="ITEM"?this.state.SelectedItem.SPackingUnitID:this.state.SelectedIPU;
    const SelectedMakeID=this.state.SelectionType=="ITEM"?this.state.SelectedItem.SMakeID:"QN";
   
    if(SelectedUOM==null || SelectedUOM=="" || SelectedUOM.trim()=="" || SelectedUOM=="QN"|| SelectedUOM=="0"){
      alert('Please select UOM');
      return; 
    }
    if(!((SelectedIPU==null || SelectedIPU=="" || SelectedIPU.trim()=="" || SelectedIPU=="QN"|| SelectedIPU=="0")) && (SelectedIPT==null || SelectedIPT=="" || SelectedIPT.trim()=="" || SelectedIPT=="QN"|| SelectedIPT=="0")){
      alert('Please select packing type');
      return; 
    }
    if(!(SelectedIPT==null || SelectedIPT=="" || SelectedIPT.trim()=="" || SelectedIPT=="QN"|| SelectedIPT=="0") && (SelectedIPU==null || SelectedIPU=="" || SelectedIPU.trim()=="" || SelectedIPU=="QN"|| SelectedIPU=="0")){
      alert('Please select packing unit');
      return; 
    }
 
    

    if(this.state.QtyOrUnit==null || this.state.QtyOrUnit=="" || this.state.QtyOrUnit.trim()==""){
      alert('Please enter Quantity');
      return; 
    }

    

  const AccessToken = await Auth.AccessToken();
  const {SelectedOrder, BindHomePage} = this.props.route.params;

  
  
  

  const ItemID = this.state.SelectionType=="ITEM" ? this.state.SelectedItem.SItemID : this.state.SelectedItemGroup.Property.find(o=>o.Key=="ItemID").Value;

 
  

  var CommonBO = {
    "InsertedUserID": AccessToken.AppAccessID,"InsertedSessionID": AccessToken.AppAccessSessionID,
    "CompanyID": AccessToken.CompanyID,"Key": AccessToken.Key,"SRightID": '',"BMCEntityID": 0,
}
  var GETIPServicereq={
    "PrmItemsPrice": {"DocumentID": 0,"ItemID": ItemID ,"ItemCodeID": 0,"UOMID": SelectedUOM,"PackingUnitID": SelectedIPU,"PackingTypeID": SelectedIPT,
                   "MakeID": SelectedMakeID,"PriorityID": 1,"PriceBy": this.state.ItemOrderType,"BRID": 1,"PriceType": (this.state.SelectionType=="ITEM" ? 3:1),"ItemCodeVarientID": 0,"Quantity": this.state.QtyOrUnit,"ID": SelectedOrder.SaleOrderID
    },
    "ObjCommon": CommonBO
};
this.setState({loading:true});

  Api.GETIPService(GETIPServicereq).then(async(resp)=>{
    this.setState({loading:false});
    
    
    if(resp.responseCode == 1 && resp.responseObject.length > 0 && resp.responseObject[0]!=null && resp.responseObject[0] != "" && resp.responseObject[0] != "0"){
      
      
      //await Cart.RemoveCart(); 
    
      
      const AccessToken = await Auth.AccessToken(); 
      var req={}; 
      if(this.state.SelectionType=="ITEM"){
       req={"SelectedItem":this.state.SelectedItem, "ID":await Cart.ItemCount(),"ItemID":this.state.SelectedItem.SItemID??"","ItemCodeID":"QN","SODetailsID":0,"SaleOrderID":SelectedOrder.SaleOrderID,"PackingUnitID":this.state.SelectedItem.SPackingUnitID??"","PackingType":this.state.SelectedItem.SPackingTypeCode??"","MakeID":this.state.SelectedItem.SMakeID??"","SOQuantity":this.state.QtyOrUnit,"SORate":resp.responseObject[0],"ItemTypeID":"QJqLsVmzkdmj","UOMID":this.state.SelectedItem.SUOMID??"","Configuration":"","ItemCodeDetails":"","Remark":"","TaxGroupID":null,"TaxID":null,"PriceBy":this.state.ItemOrderType,"PriceType":"3","DiscountType":"QN","DiscountPercentage":"0","DiscountFlat":"0","ObjSOPropertyList":[],"SKUID":"0","ISFGO":false,"FGOTaken":0};
      }
      else{
        req={"SelectedItemGroup":this.state.SelectedItemGroup, "ID":await Cart.ItemCount(),"ItemID":this.state.SelectedItem.SItemID??"","ItemCodeID":"QN","SODetailsID":0,"SaleOrderID":SelectedOrder.SaleOrderID,"PackingUnitID":this.state.SelectedIPU,"PackingType":this.state.SelectedIPT,"MakeID":"QN","SOQuantity":this.state.QtyOrUnit,"SORate":resp.responseObject[0],"ItemTypeID":"QJqLsVmzkdmj","UOMID":this.state.SelectedUOM??"","Configuration":"","ItemCodeDetails":"","Remark":"","TaxGroupID":null,"TaxID":null,"PriceBy":this.state.ItemOrderType,"PriceType":"3","DiscountType":"QN","DiscountPercentage":"0","DiscountFlat":"0","ObjSOPropertyList":[],"SKUID":"0","ISFGO":false,"FGOTaken":0};
      }
    
      await Cart.AddItem(SelectedOrder, req);
    
      this.setState({visibleDetails:false}); 
      this.setState({SelectedItem:{}});
      this.setState({SelectedItemGroup:{}})
      this.setState({QtyOrUnit:""});
    
      const cartCount=await Cart.ItemCount();
      this.setState({cartCount:cartCount});
    
      alert("Item Added Successfully");
    }
    else{
      alert("Rate is not defined");
    }
  });

  
  }

  render() {
    const {SelectedOrder, BindHomePage} = this.props.route.params;
    
    return (
    <>
        {
          this.state.loading &&
          <View style={{flex:1, position:"absolute", top:0, bottom:0,left:0,right:0, zIndex:9, alignContent:"center", justifyContent:"center", backgroundColor: 'white', opacity: 0.7}}>
            <ActivityIndicator color="#0000ff"/>
          </View>
        }
        <Overlay overlayStyle={{width:"100%", padding:0, bottom:0, position:"absolute"}} isVisible={this.state.visibleDetails} onBackdropPress={()=>this.setState({visibleDetails:false})}>
       <>
       {
          this.state.loading &&
          <View style={{flex:1, position:"absolute", top:0, bottom:0,left:0,right:0, zIndex:9, alignContent:"center", justifyContent:"center", backgroundColor: 'white', opacity: 0.7}}>
            <ActivityIndicator color="#0000ff"/>
          </View>
        }
        <View  style={{width:"100%", backgroundColor:"#fff", padding:20}}>
             <View style={styles.inputGroup}>
               <Text style={[styles.text,styles.label,{flex:2}]}>UOM</Text>
               <View  style={[styles.picker,{flex:3}]}>
                  <Picker selectedValue={this.state.SelectedUOM} onValueChange={(selectedValue, index)=>this.ChangeIPT(selectedValue)}>
                      {
                        this.state.SelectionType=="ITEM" ? <Picker.Item label={this.state.SelectedItem.UOMName} value={this.state.SelectedItem.UOMName} /> :
                        <Picker.Item label="Select" value="0" />
                      }
                        
                      {
                        this.state.UOMList.map(item=>(<Picker.Item label={item.ItemUnitName} value={item.SItemUnitID} />))
                      }
                  </Picker>
                </View>
             </View>
             {/* <View style={styles.inputGroup}>
               <Text style={[styles.text,styles.label,{flex:2}]}>Manufacture</Text>
               <View  style={[styles.picker,{flex:3}]}>
                  <Picker selectedValue={this.state.SelectedMNU} onValueChange={(selectedValue, index)=> this.setState({SelectedMNU:selectedValue})}>
                      {
                        this.state.MNUList.length==0 ? <Picker.Item label={this.state.SelectedItem.Manufacture} value={this.state.SelectedItem.Manufacture} />  :
                        <Picker.Item label="" value="QN" />
                      }
                      
                      {
                        this.state.MNUList.map(item=>(<Picker.Item label={item.DisplayField} value={item.ValueField} />))
                      }
                  </Picker>
                </View>
             </View> */}
             <View style={styles.inputGroup}>
               <Text style={[styles.text,styles.label,{flex:2}]}>Packing Type</Text>
               <View  style={[styles.picker,{flex:3}]}>
                  <Picker selectedValue={this.state.SelectedIPT} onValueChange={(selectedValue, index)=> this.setState({SelectedIPT:selectedValue})}>
                      {
                        this.state.SelectionType=="ITEM" ? <Picker.Item label={this.state.SelectedItem.PackingType} value={this.state.SelectedItem.PackingType} />  :
                        <Picker.Item label="Select" value="0" />
                      }
                      
                      {
                        this.state.IPTList.map(item=>(<Picker.Item label={item.PackingTypeName} value={item.SPackingTypeID} />))
                      }
                  </Picker>
                </View>
             </View>
             <View style={styles.inputGroup}>
               <Text style={[styles.text,styles.label,{flex:2}]}>Packing Unit</Text>
               <View  style={[styles.picker,{flex:3}]}>
                  <Picker selectedValue={this.state.SelectedIPU} onValueChange={(selectedValue, index)=> this.setState({SelectedIPU:selectedValue})}>
                      {
                        this.state.SelectionType=="ITEM" ? <Picker.Item label={this.state.SelectedItem.PackingUnit} value={this.state.SelectedItem.PackingUnit} />   :
                        <Picker.Item label="Select" value="QN" />
                      }
                      
                      {
                        this.state.IPUList.map(item=>(<Picker.Item label={item.PackingUnitName} value={item.SPackingUnitID} />))
                      }
                  </Picker>
                </View>
             </View>
             <View style={styles.inputGroup}>
               <Text style={[styles.text,styles.label,{flex:2}]}></Text>
               <View style={{flex:3, flexDirection:"row"}}>
                   <Radio disabled={true} selected={this.state.ItemOrderType==1} onPress={()=> this.setState({ItemOrderType:1})}></Radio><Text>Quantity</Text>
                   <Radio disabled={true} selected={this.state.ItemOrderType==2} onPress={()=> this.setState({ItemOrderType:2})}></Radio><Text>Unit</Text>
               </View>
             </View>

             <View style={styles.inputGroup}>
               <Text style={[styles.text,styles.label,{flex:2}]}>{this.state.ItemOrderType==1?"Quantity":"Unit"} <Text style={styles.errorStar}>*</Text></Text>
               <TextInput keyboardType={"number-pad"} style={[styles.input,{flex:3}]} value={this.state.QtyOrUnit} onChangeText={(text)=>this._QtyOrUnitChange(text)}/>
             </View>
             
             <View style={{alignContent:"center", alignItems:"center"}}>
                <TouchableOpacity onPress={()=>!this.state.loading && this.AddItem()}>
                    <Text style={[styles.text, styles.yelloButton,{width:120}]}>ADD TO LIST</Text>
                </TouchableOpacity>
            </View>
           </View>
      </>
        </Overlay>
        
      <View style={{flex:1,backgroundColor:"#fff"}}> 
       
        <View style={styles.header}>
          <View style={styles.pickerOuter,{backgroundColor:"#fff", flex:5, marginRight:5}}>
              <Picker style={{maxHeight:30}} selectedValue={this.state.ItemGroupId} onValueChange={(itemValue, itemIndex) => this.CropeChange(itemValue)}>
              <Picker.Item label="--SELECT--" value="" />
                  {
                  this.state.CropsList.map(item=>(<Picker.Item label={item.ItemGroupName} value={item.SItemGroupID} />))
                  }
              </Picker>
          </View>
          <TextInput style={[styles.textinput,{flex:3, padding:0}]} value={this.state.Keywords} onChangeText={(text)=>this.setState({Keywords:text})}/>
          <TouchableOpacity style={{flex:2}} onPress={this.Search}>
              <Text style={styles.searchbutton}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.state.cartCount > 0 && this.props.navigation.navigate('CartScreen',{SelectedItem: SelectedOrder, BindHomePage:BindHomePage, updateCount:this.UpdateCount.bind()})/*this.props.navigation.navigate('OrderDetailsScreen',{SelectedItem: SelectedOrder})*/}>
              
              <View style={{flex:1, alignItems: 'center',  justifyContent:'center'}}>
              <Icon style={styles.cartIcon} name="cart"></Icon>
               
                {this.state.cartCount > 0 ? (
                  <View
                    style={{     
                      position: 'absolute',
                      backgroundColor: 'red',
                      width: 16,
                      height: 16,
                      borderRadius: 15 / 2,
                      right: 15,
                      top: +1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: "#FFFFFF",
                        fontSize: 8,
                      }}>
                      {this.state.cartCount}
                    </Text>
                  </View>
                ) : null}
                <View>
              
                </View>
              </View>

          </TouchableOpacity>
          {/* <TouchableOpacity style={{flex:1}}>
              <View style={styles.cart}>
                <TouchableOpacity onPress={()=> Cart.Clear()}>
                  <Icon style={styles.cartIcon} name="cart"></Icon>
                </TouchableOpacity>
              </View>
          </TouchableOpacity> */}
        </View>
 
 {
   this.state.ItemGroupName==null || this.state.ItemGroupName=="" ?
    <View style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center", padding:20}}>
      <Text style={{textAlign:"center"}}>Select any item group and click on search button for getting items</Text>
    </View>
   :
   <View style={{flex:1}}>
     {
        
       this.state.filteredItemVariantGroupList && this.state.filteredItemVariantGroupList.length>0 &&
       this.state.filteredItemVariantGroupList.filter(item=> item.Property.find(o=>o.Key=="ISAddToCart_H").Value=="1").length>0 &&
    
      <View style={{flex:1}}>
   <ScrollView style={{flex:1}}>
   <View style={styles.listPanal}>
       {
           this.state.filteredItemVariantGroupList
           .map((item, index)=>
           {
             const ImageNameAppObj=item.Property.find(o=>o.Key=="ImageNameApp");
             const ImageNameApp=null;
             if(ImageNameAppObj)ImageNameApp=ImageNameAppObj.Value;
             const ItemName=item.Property.find(o=>o.Key=="ItemName").Value;
             const ItemGroupName=item.Property.find(o=>o.Key=="ItemGroupName").Value;
             const ISAddToCart_H=item.Property.find(o=>o.Key=="ISAddToCart_H").Value;

           return(
            ISAddToCart_H=="1"?
               <View key={index} style={[styles.listItem,{borderWidth:1, borderColor:"#ccc"}, this.state.SelectionType=="GROUP" && this.state.SelectedItemGroup==item ? styles.SelectedItem:{}]}>
                   <TouchableOpacity onPress={()=> this.SelectItemGroup(item)}> 
                       {/* <Image source={ImageNameApp !=null && ImageNameApp!="" ? {uri:ImageNameApp}: require('../assets/images/imagenotfound.png')} style={{width:"100%", height:150, resizeMode:"stretch"}}/> */}
                       <View style={{backgroundColor:"#519aad", margin:5, borderColor:"#fff", borderWidth:1, borderRadius:5, padding:5/*, position:"absolute", top:10*/}}>
                           <Text style={{fontSize:15, fontWeight:"700", color:"#fff"}}>{ItemName}/{ItemGroupName}</Text>
                       </View>
                   </TouchableOpacity>
               </View>
               :
               <></>
           )})
       }
   </View>
</ScrollView>
</View>
      }
     <View style={{flex:1}}>
       <View style={{padding:10, backgroundColor:"#CCC", alignContent:"center", alignItems:"center"}}>
       <Text>Item variants</Text>
       </View>
   <ScrollView style={{flex:1}}>
   <View style={styles.listPanal}>
       {
           this.state.filteredData
           .map((item, index)=>(
               <View key={index} style={[styles.listItem,{borderWidth:1, borderColor:"#ccc"}, this.state.SelectionType=="ITEM" && this.state.SelectedItem==item ? styles.SelectedItem:{}]}>
                   <TouchableOpacity onPress={()=> this.SelectItem(item)}> 
                       {/* <Image source={item.ImageNameApp !=null && item.ImageNameApp!="" ? {uri:item.ImageNameApp}: require('../assets/images/imagenotfound.png')} style={{width:"100%", height:150, resizeMode:"stretch"}}/> */}
                       <View style={{backgroundColor:"#519aad", margin:5, borderColor:"#fff", borderWidth:1, borderRadius:5, padding:5/*, position:"absolute", top:10*/}}>
                           <Text style={{fontSize:15, fontWeight:"700", color:"#fff"}}>{item.ItemName}/{item.ItemGroupName}/{item.PackingUnit}/{item.PackingType}</Text>
                       </View>
                   </TouchableOpacity>
               </View>
           ))
       }
   </View>
</ScrollView>
</View>
</View>
 }
       
      </View>
      </>
    );
  }
}

var styles=StyleSheet.create({
    header:{
        height:40,
        backgroundColor:"#000",
        flexDirection:"row",
        padding:5,
        alignContent:"space-between",
        alignItems:"center"
    },
    picker:{
        flex:1,
        borderWidth:1,
        borderColor:"#ccc",
        backgroundColor:"#fff",
        marginRight:5
    },
    textinput:{
        borderWidth:1,
        borderColor:"#ccc",
        backgroundColor:"#fff",
        marginRight:5
    },
    searchbutton:{
        flex:1,
        borderWidth:1,
        borderColor:"#ccc",
        backgroundColor:"#ccc",
        marginRight:5,
        alignSelf:"center",
        padding:7,
        fontSize:10,
        fontWeight:"700"
    },
    cart:{
        flex:1,
    },
    cartIcon:{
        color:"#fbab00",
        padding:3
    },
    listPanal:{
        flexDirection: 'row',
        flexWrap:"wrap",
        padding:5,
        marginTop:5        
    },
    listItem:{
        width:"50%",
        padding:5,
         
    },
    inputGroup:{
        flex:1,
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
    pickerOuter:{flex:1, borderWidth:1, borderColor:"#ccc"},
    label:{
        fontSize:16,
        fontWeight:"700"
    },
    text:{
        fontFamily:"Roboto"
    },
    yelloButton:{
        backgroundColor:"#fbab00", 
        padding:15, 
        margin:1,
        fontSize:15,
        fontWeight:"700"
    },
    SelectedItem:{
      borderWidth:2,
      borderColor:"#ff0000"
    },
    errorStar:{
      color:"#ff0000",
      fontWeight:"bold"
    },
})