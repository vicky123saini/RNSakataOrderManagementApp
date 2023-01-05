import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, BackHandler, Alert } from 'react-native';
 
import { Overlay } from 'react-native-elements';
import { Container, Header, Item, Input, Icon, Button, Fab } from 'native-base';
import DatePicker from 'react-native-datepicker'
import { Picker } from 'native-base';
import moment from 'moment';

import * as Api from '../ApiServices';
import * as Auth from '../Auth';
import {NavigatorMenu} from '../Navigation'
export default class OrderListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        visibleDetails:false,
        visibleFilte:false,
        selectedItem:{},
        PageIndex:1,
        data:[],
        FullData:[],
        CRVList:[],
        CRVValue:"",
        FDateFrom:"",
        FDateTo:"",
        isCancelOrderPopupOpen:false,
        IsProcessing:false,
        IsSearchBoxShow:false,
        IsLoadMore:false
    };
  }

  async componentDidMount(){
    const AccessToken = await Auth.AccessToken();
    this.setState({AccessToken:AccessToken});
    

    await this.bindData();
    await this.CRVBind();
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.props.navigation.addListener('beforeRemove', (e) => { 
      // Prevent default behavior of leaving the screen
      e.preventDefault();

      // Prompt the user before leaving the screen
      Alert.alert(
        'Quit Confirmation',
        'Do you want to quit from application.',
        [
          { text: "cancel", style: 'cancel', onPress: () => {} },
          {
            text: 'OK',
            style: 'destructive',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => BackHandler.exitApp(),
          },
        ]
      );
    })
  }
  
  // componentWillUnmount(){
  //   this.props.navigation.removeListener('beforeRemove');
  // }


  bindData=async()=>{ 
    this.setState({data:[]
    },async()=>{
      await this.loadProducts();
    });
  }

  filterDataStart=async()=>{
    this.setState({data:[],
      PageIndex:1,
      FDateFrom:(this.state.FDateFrom==""?moment(new Date()).add(-1, 'month').format('DD-MM-YYYY'):this.state.FDateFrom),
      FDateTo:(this.state.FDateTo==""?moment(new Date()).format('DD-MM-YYYY'):this.state.FDateTo)
    },async()=>{
      await this.loadProducts();
    });
  }

  CRVBind = async()=>{
    const AccessToken = await Auth.AccessToken(); 
    var req={  "RelationId": "100", "FirstTableFieldID": "yydf89j3014mj0","Key":AccessToken.Key};

    
  
    Api.CRVService(req).then(resp => {
      
      if(resp.responseCode=="1"){
        this.setState({CRVList:resp.responseObject});
      }
      else{
        alert(resp.responseMessage)
      }
    })
  }

  clearFilter(){
    this.setState({CRVValue:"", FDateFrom:"", FDateTo:"", PageIndex:1});
    this.bindData();
  }

  nextPage = () =>{
    this.setState({PageIndex:this.state.PageIndex+1});
    this.loadProducts();
  }

  loadProducts = async () =>{
    const AccessToken = await Auth.AccessToken(); 
  var req={  	
    "SearchText":this.SearchText??"",
    "FromDate":this.state.FDateFrom, 
    "ToDate":this.state.FDateTo,
    "Status":[this.state.CRVValue],
    "DocType":"0",
    "FilterType":"0",
    "DispatchBranch":0,
    "Employee":0,
    "Customer":0,
    "Country":0,
    "State":0,   
    "ObjCommon": 
    {
      "InsertedUserID":AccessToken.AppAccessID,
      "InsertedSessionID":AccessToken.AppAccessSessionID,
      "CompanyID":AccessToken.CompanyID,
      "Key":AccessToken.Key,
      "SRightID":"",
      "BMCEntityID":0,
      "PageIndex":this.state.PageIndex,
      "PageSize":"10",
      "DateShort":"dd-MM-yyyy",
      "TeamMemberList":AccessToken.TeamMemberList,
      "FinancialYearID":AccessToken.FinancialYearID
    }
  }


this.setState({IsProcessing:true});
Api.OrderListingService(req).then(resp=>{

  this.setState({IsProcessing:false});
  if(resp.responseCode=="1"){
    const interest = [...this.state.data, ...resp.responseObject];
    this.setState({IsLoadMore:resp.responseObject.length==10})
    this.setState({data:interest});
    this.setState({FullData:interest});
  }
  else{
    alert(resp.responseMessage)
  }
})
  }

  moreDetails = (item) =>{
    this.setState({visibleDetails:false});
    
    this.props.navigation.navigate('OrderDetailsScreen',{SelectedItem: item, BindHomePage:this.bindData.bind()});
  }

  addItem = (item) =>{
    this.setState({visibleDetails:false});
    this.props.navigation.navigate("AddItemScreen", {SaleOrderID: item.SaleOrderID, SelectedOrder:item, BindHomePage:this.bindData.bind()});
  }
  
  searchItem=async(text)=>{
    this.setState({SearchText:text})
    if(text==null || text==""){
      this.setState({data:this.state.FullData});
    }
    else{
      this.setState({data:
      this.state.FullData.filter(item=> item.SONumber.toLowerCase().indexOf(text.toLowerCase())>-1 || item.CustomerName.toLowerCase().indexOf(text.toLowerCase())>-1 || item.SalesExecutiveName.toLowerCase().indexOf(text.toLowerCase())>-1 || item.DocumentName.toLowerCase().indexOf(text.toLowerCase())>-1)
    });
    }
  }

  cancelOrder = async(item) =>{ 
    if(this.state.Remark==null || this.state.Remark=="" || this.state.Remark.trim()==""){
      alert('Remark Required!');
      return;
  }

    const AccessToken = await Auth.AccessToken(); 
    var req={"Approval":{"Key":AccessToken.Key,"DocumentRecordID":item.SaleOrderID,"DocumentID":"QR","UserID":AccessToken.AppAccessID,"Remark":this.state.Remark,"CancelReasonID":"0", CancelReason:"0"}}
    
    Api.CancelOrderService(req).then(resp=>{
      
      if(resp.responseCode=="1"){
         alert('Successfully Done.')
         this.setState({Remark:""});
         this.setState({isCancelOrderPopupOpen:false, visibleDetails:false});
         this.bindData();
      }
      else{
        alert(resp.responseMessage)
      }
    })
  }

  

  render() {
    return (
      <View style={{flex:1}}>
        {
          this.state.IsSearchBoxShow
          ?
          <View>
              <Header searchBar rounded>
                <Item>
                  <Icon name="ios-search" />
                  <Input placeholder="Search" value={this.state.SearchText} onChangeText={(text)=>this.searchItem(text)} />
                  <Icon onPress={()=> {this.setState({IsSearchBoxShow:false}); this.setState({SearchText:""}); this.searchItem(null);}} name="ios-close" />
                </Item>
                {/* <TouchableOpacity style={{marginTop:12, marginLeft:5}}  onPress={()=>this.bindData()}>
                  <Text style={{textAlign:"center", alignContent:"center", backgroundColor:"#fff", padding:5}}>Search</Text>
                </TouchableOpacity> */}
              </Header>
            
          </View>
          :
          <View style={{width:"100%", flexDirection:"row", alignContent:"space-around", alignItems:"center"}}>
            <View style={{flex:1}}>
              <TouchableOpacity onPress={()=> this.props.navigation.openDrawer()}>
                <Icon name="menu"></Icon>
              </TouchableOpacity>
            </View>
            <View style={{flex:10}}>
            <Image
                  style={{ width: 140, height: 40 }}
                  source={require('../assets/images/logo.png')}
                  resizeMode='contain'
              />
            </View>
            {
              this.state.AccessToken && this.state.AccessToken.AppAccessDisplayName &&
              <View style={{flex:4}}>
                <Text style={{fontSize:10, overflow:"hidden"}}>{this.state.AccessToken.AppAccessDisplayName}</Text>
              </View>
            }
            <View style={{flex:1}}>
              <TouchableOpacity onPress={()=> this.setState({IsSearchBoxShow:true})}>
              <Icon name="ios-search" /></TouchableOpacity>
            </View>
            <View style={{flex:1}}>
              <NavigatorMenu {...this.props} navigation={this.props.navigation}/>
            </View>
          </View>
        }
        

        <Overlay overlayStyle={{padding:0, bottom:0, position:"absolute"}} isVisible={this.state.visibleDetails} onBackdropPress={()=>this.setState({visibleDetails:false})}>
          {
            this.state.selectedItem &&
            <View>
              <View style={{width:"100%", borderColor:"#ccc", borderWidth:1,marginTop:1}}>
                <Text style={{width:"100%", textAlign:"center", fontSize:22, padding:10}}>Sale Details</Text>
              </View>
              <View style={{flexWrap:"wrap", flexDirection:"row", width:"100%"}}> 
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>SO Type</Text>
                <Text style={[styles.text,styles.field]}>{this.state.selectedItem.DocumentName}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>SO Date</Text>
                <Text style={[styles.text,styles.field]}>{moment(this.state.selectedItem.SODate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>SO No</Text>
                <Text style={[styles.text,styles.field]}>{this.state.selectedItem.SONumber}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Customer</Text>
                <Text style={[styles.text,styles.field]}>{this.state.selectedItem.CustomerName}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Executive</Text>
                <Text style={[styles.text,styles.field]}>{this.state.selectedItem.SalesExecutiveName}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Shipng Date</Text>
                <Text style={[styles.text,styles.field]}>{moment(this.state.selectedItem.ExpShippingDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Status</Text>
                <Text style={[styles.text,styles.field]}>{this.state.selectedItem.SOStatusName}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>No Of Items</Text>
                <Text style={[styles.text,styles.field]}>{this.state.selectedItem.NoOfItems}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Currency</Text>
                <Text style={[styles.text,styles.field]}>INR</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Total Price</Text>
                <Text style={[styles.text,styles.field]}>{this.state.selectedItem.TotalPrice}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row", alignContent:"center",alignItems:"center", padding:20}}>
              <View style={{flex:1, alignContent:"center", alignItems:"center"}}>
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('WebViewScreen',{url:`${this.state.AccessToken.ApplicationHostRoot}sales/SaleOrderPreview?IDS=${this.state.selectedItem.SaleOrderID}&|V|=QF`}); this.setState({visibleDetails:false});}}>
                  {/* <Image source={require('../assets/images/invoice.png')} style={{width:37, height:48, resizeMode:"stretch"}}/> */}
                  <Text style={{color:"#4a89dc", textDecorationLine:"underline", fontSize:16, fontWeight:"700"}}>Order preview</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center", height:48}}>
                <TouchableOpacity onPress={()=>this.moreDetails(this.state.selectedItem)}>
                  <Text style={{color:"#4a89dc", textDecorationLine:"underline", fontSize:16, fontWeight:"700"}}>Click for More Details</Text>
                </TouchableOpacity>
              </View> 
            </View>
            {
              this.state.selectedItem.SOStatusName=="In-Creation" &&
              <View style={{flexDirection:"row", alignContent:"center", alignItems:"center", padding:20}}>
              <View style={{flex:1, alignContent:"center", alignItems:"center"}}>
                <TouchableOpacity onPress={()=>this.addItem(this.state.selectedItem)}>
                  <Text style={{color:"#4a89dc", textDecorationLine:"underline", fontSize:16, fontWeight:"700"}}>+ Add Items</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, alignContent:"center", alignItems:"center"}}>
                <TouchableOpacity onPress={()=>{this.setState({isCancelOrderPopupOpen:true}); this.setState({Remark:""});}}>
                  <Text style={{color:"#4a89dc", textDecorationLine:"underline", fontSize:16, fontWeight:"700"}}>Cancel Order</Text>
                </TouchableOpacity>
              </View>
            </View>
            }
            

            </View>
            
          }
          
        </Overlay>
        <Overlay  overlayStyle={{padding:0, bottom:0, position:"absolute", width:"100%"}} isVisible={this.state.visibleFilte} onBackdropPress={()=>this.setState({visibleFilte:false})}>
          <View style={{flex:1}}>
            <View style={{flex:1, borderColor:"#ccc", borderWidth:1,marginTop:1}}>
              <Text style={{flex:1, textAlign:"center", fontSize:14, padding:5}}>Filter</Text>
            </View>
            
              <View style={{flexDirection:"row", padding:10, alignContent:"space-around", alignItems:"center"}}>
              <TouchableOpacity onPress={()=>this.filterDataStart()}><Icon style={{width: 50}} name="sync"></Icon></TouchableOpacity>
                
                <View style={[styles.pickerOuter,{minWidth:200}]}>

                <Picker selectedValue={this.state.CRVValue} onValueChange={(itemValue, itemIndex) => {this.setState({CRVValue:itemValue});}}>
                  <Picker.Item label="--ALL--" value="" />
                  {
                    this.state.CRVList.map(item=>(<Picker.Item label={item.DisplayField} value={item.ValueField} />))
                  }
                </Picker>
                  
                </View> 
                <TouchableOpacity onPress={()=>this.clearFilter()}><Text style={{marginLeft:20, width: 200}}>Reset All</Text></TouchableOpacity>
               
              </View>
               
              {
                /*
                FDateFrom:moment(new Date()).add(-1, 'month').format('DD-MM-YYYY'),
        FDateTo:moment(new Date()).format('DD-MM-YYYY'), */
              }
              <Text style={{padding:10}}>Search For Order Date:</Text>
              <View style={{flexDirection:"row", padding:10, alignContent:"space-around", alignItems:"center"}}>
                <DatePicker
                  style={{flex:1, paddingRight:10}}
                  date={this.state.FDateFrom==""?moment(new Date()).add(-1, 'month'):this.state.FDateFrom}
                  mode="date"
                  placeholder="select date"
                  format="DD-MM-YYYY" 
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={(date) => {this.setState({FDateFrom: date});}}
                />
                 <DatePicker
                  style={{flex:1}}
                  date={this.state.FDateTo==""?moment(new Date()):this.state.FDateTo}
                  mode="date"
                  placeholder="select date"
                  format="DD-MM-YYYY" 
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={(date) => {this.setState({FDateTo: date});}}
                />
              </View>
              <TouchableOpacity onPress={()=>this.filterDataStart()}>
                <Text style={[styles.yelloButton,{width:100, textAlign:"center", fontSize:12,marginBottom:10, alignSelf:"center"}]}>FILTER</Text>
              </TouchableOpacity>
          </View>
        </Overlay>
        <Overlay overlayStyle={{width:"90%"}} isVisible={this.state.isCancelOrderPopupOpen} onBackdropPress={()=>this.setState({isCancelOrderPopupOpen:false})}>
          <View style={{width:"100%", borderColor:"#fff", marginTop:1}}>
            <View style={{width:"100%", backgroundColor:"#222222", marginTop:1}}>
              <Text style={{width:"100%", textAlign:"center", color:"#d99f3a", fontSize:22, padding:10}}>Sale Order ID:- {this.state.selectedItem.SONumber}</Text>
            </View>

            <View>
              <View><Text  style={{width:"100%", fontSize:18, padding:5, fontWeight:"bold"}}>Are you sure that you want to cancel this order?</Text></View>
              <View style={{borderWidth:1, borderColor:"#ccc", marginTop:10, marginBottom:10}}>
              <TextInput value={this.state.Remark} onChangeText={(text)=>this.setState({Remark:text})} placeholder="Enter remarks"></TextInput>
              </View>
              <View style={{flexDirection:"row", justifyContent:"center"}}>
                    <TouchableOpacity onPress={()=>this.setState({isCancelOrderPopupOpen:false})}>
                        <Text style={[styles.text, styles.yelloButton, {backgroundColor:"#ccc", minWidth:100}]}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.cancelOrder(this.state.selectedItem)}>
                        <Text style={[styles.text, styles.yelloButton, {minWidth:100, backgroundColor:"#d81c59"}]}>PROCEED</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        </Overlay>
       
        
        <View style={{backgroundColor:"#99da74", padding:8, borderBottomColor:"#63a196", borderBottomWidth:2}}>
            <View style={[styles.listItem, {backgroundColor:"#99da74"}]}>
              <View style={[styles.listCell,{flex:1, borderRightColor:"#767676", backgroundColor:"#99da74", paddingRight:0}]}><Text style={styles.listCellText}>Status</Text></View>
              <View style={[styles.listCell,{flex:2, borderRightColor:"#767676", backgroundColor:"#99da74"}]}><Text style={styles.listCellText}>Cust/Exec Name</Text></View>
              <View style={[styles.listCell,{flex:1, borderRightColor:"#767676", backgroundColor:"#99da74"}]}><Text style={styles.listCellText}>SONO/Date</Text></View>
              <View style={[styles.listCell,{flex:.5, borderRightColor:"#767676", backgroundColor:"#99da74"}]}><Text style={styles.listCellText}>Items</Text></View>
              <View style={[styles.listCell,{flex:1, backgroundColor:"#99da74", borderRightWidth:0}]}><Text style={styles.listCellText}>Amount</Text></View>
            </View>
          </View>
        <ScrollView> 
          <View>
          
          
        {
            this.state.data.map((item, index)=>{
                return(
                  <TouchableOpacity key={index} onPress={()=>{ this.setState({selectedItem:item}); this.setState({visibleDetails:true}); }}>
                    <View style={{backgroundColor:"#fff", padding:8, borderBottomColor:"#ccc", borderBottomWidth:1}}>
                      <View style={styles.listItem}>
                        <View style={[styles.listCell,{flex:1, paddingRight:0}]}>
                          <View style={{
                            backgroundColor:(item.SOStatusName=="In-Creation"?"#8e65c1":
                            item.SOStatusName=="In-Review"?"#b2b2b2":
                            item.SOStatusName=="Approved"?"#56b442":"#0b0095"), 
                            minHeight:40, 
                            padding:5, borderTopLeftRadius:5, borderBottomLeftRadius:5}}>
                            <Text style={[styles.text,{textAlign:"left", fontSize:12, fontWeight:"700", color:"#fff"}]}>{item.SOStatusName}</Text>
                          </View>
                          {/* <Text style={[styles.text,{}]}>{moment(item.ExpShippingDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</Text> */}
                          <Text style={[styles.text,{}]}>{item.DispatchStatusName}</Text>
                        </View>
                        <View style={[styles.listCell,{flex:2}]}><Text style={[styles.text,{fontWeight:"700", fontSize:12}]}>{item.CustomerName}</Text><Text style={[styles.text,{}]}>{item.SalesExecutiveName}</Text></View>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{fontWeight:"700", fontSize:12}]}>{item.SONumber}</Text><Text style={[styles.text,{}]}>{moment(item.SODate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</Text></View>
                        <View style={[styles.listCell,{flex:.5}]}><Text style={[styles.text,{fontWeight:"700"}]}>{item.NoOfItems}</Text></View>
                        <View style={[styles.listCell,{flex:1, borderRightWidth:0}]}><Text style={[styles.text,{fontWeight:"700", fontSize:12}]}>{item.TotalPrice}</Text></View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
            })
        }
        
        </View>
        {
          !this.state.IsProcessing && this.state.IsLoadMore &&
          <View>
          <TouchableOpacity onPress={()=>this.nextPage()}><Text style={{backgroundColor:"#ccc", 
            padding:15, 
            margin:1,
            fontSize:15,
            fontWeight:"700", textAlign:"center"}}>LOAD MORE</Text></TouchableOpacity>
                </View>
        }
        
        {
          this.state.IsProcessing && 
          <ActivityIndicator
            animating={true}
            style={styles.indicator}
            size="large"
            color="#0000ff"
          />
        }
        </ScrollView>
        {
          !this.state.IsProcessing && this.state.data.length==0 &&
          <View style={{flex:1, alignContent:"center", alignItems:"center"}}>
            <Text>No Sales Order Found</Text>
            </View>
        }
        <Fab
            active={this.state.active} 
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="arrow-up" />
            <Button style={{ backgroundColor: '#3B5998' }} onPress={() => this.props.navigation.navigate('CreateOrderScreen', {BindHomePage:this.bindData.bind()}) }>
              <Icon name="add" />
            </Button>
            <Button style={{ backgroundColor: '#34A34F' }} onPress={() => this.setState({visibleFilte:true})}>
              <Icon name="filter" />
            </Button>
          </Fab>
      </View>
    );
  }
}

var styles=StyleSheet.create({
  listItem:{
    flexDirection:"row"
  },
  listCell:{
    alignContent:"center",
    alignItems:"center",
    justifyContent:"center",
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:5,
    paddingRight:5,
    borderRightColor:"#767676",
    borderRightWidth:1,
    backgroundColor:"#fff"
  },
  listCellText:{
    fontSize:10,
    fontFamily:"Roboto",
    fontWeight:"bold"
  },
  text:{
    fontSize:10,
    textAlign:"center",
    fontFamily:"Roboto"
  },
  label: { fontSize:12,textAlign:"left", width:"50%" },
  field: { fontSize:12,fontWeight:"700", textAlign:"left", width:"50%" },
  detItem: { width:"50%", padding:10, flexDirection:"row" },
  pickerOuter:{flex:1, borderWidth:1, borderColor:"#ccc"},
  yelloButton:{
    backgroundColor:"#fbab00", 
    padding:15, 
    margin:1,
    fontSize:15,
    fontWeight:"700"
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
})