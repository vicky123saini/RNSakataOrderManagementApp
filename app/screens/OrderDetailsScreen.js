import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, ActivityIndicator  } from 'react-native';
import { Icon } from 'native-base';
import { Overlay } from 'react-native-elements';
import * as Api from '../ApiServices';
import * as Auth from '../Auth';
import moment from 'moment';

export default class OrderDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data:{objSaleOrderDetails:[]},
        isCreateNotePopupOpen:false,
        isViewNotePopupOpen:false,
        Remark:"",
        NotesList:[],
        LoadngMsg:"Loading...",
        loading:false
    };
  } 

  async componentDidMount(){
    const AccessToken = await Auth.AccessToken();
    this.setState({AccessToken:AccessToken});
    await this.bindDetails();
  }

  bindDetails = async()=>{
    const {SelectedItem} = this.props.route.params;
    
    const AccessToken = await Auth.AccessToken();
    this.setState({loading:true}); 
    var req={"SOID":SelectedItem.SaleOrderID,"ObjCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":0}}
    
    Api.OrderDetailsService(req).then(resp=>{
      this.setState({loading:false});
      if(resp.responseCode=="1"){
        this.setState({data:resp.responseObject[0]});
      }
      else{
        alert(resp.responseMessage)
      }
    })
  }

  addNote = async() =>{
    if(this.state.data.objSaleOrderDetails == null || this.state.data.objSaleOrderDetails.length==0){
      alert('Item list is empty.');
      return;
    }

    if(this.state.Remark==null || this.state.Remark=="" || this.state.Remark.trim()==""){
      alert('Remark Required!');
      return;
    }
    this.setState({loading:true});
    
    
    const AccessToken = await Auth.AccessToken(); 
    const{BindHomePage} = this.props.route.params;
    
    var req={"Approval":{"InsertedSessionID":AccessToken.AppAccessSessionID,"UserID":AccessToken.AppAccessID,"Key":AccessToken.Key,"DocumentRecordID":this.state.data.objSaleOrderDetails[0].SaleOrderID,"DocumentID":this.state.data.objSaleOrderDetails[0].DocumentID,"NoteType":2,"HasFile":0,"Remark":this.state.Remark}}
    
    Api.AddNoteService(req).then(resp=>{
      this.setState({loading:false});
      
      if(resp.responseCode=="1"){
        alert('Successfully Done.');
        this.setState({isCreateNotePopupOpen:false, Remark:null})
        BindHomePage();
      }
      else{
        alert(resp.responseMessage)
      }
    })
  }

  Delete = async(item)=>{
    const AccessToken = await Auth.AccessToken(); 
    const{BindHomePage} = this.props.route.params;
    
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => {
           
          
       
    this.setState({loading:true});
    var req={"SODetailsID":item.SODetailsID,"ObjCommon":{"InsertedUserID":AccessToken.AppAccessID,"InsertedSessionID":AccessToken.AppAccessSessionID,"CompanyID":AccessToken.CompanyID,"Key":AccessToken.Key,"SRightID":"","BMCEntityID":0}};
    
    Api.DeleteItemService(req).then(resp=>{
      this.setState({loading:false});
      
      if(resp.responseCode=="1"){
          alert("Selected item successfully deleted.");
          this.bindDetails();
          BindHomePage();
      }
      else{
        
        alert(resp.responseMessage)
      }
    })
  }
}],
{ cancelable: false })

  }

  viewNotes = async()=>{
    if(this.state.data.objSaleOrderDetails == null || this.state.data.objSaleOrderDetails.length==0){
      alert('Item list is empty.');
      return;
    }
    const AccessToken = await Auth.AccessToken(); 
    this.setState({isViewNotePopupOpen:true});
    this.setState({loading:true});
    var req={"Approval":{"SDocumentRecordID":this.state.data.objSaleOrderDetails[0].SaleOrderID,"DocumentID":this.state.data.objSaleOrderDetails[0].DocumentID,"Key":AccessToken.Key}};
    
    Api.ViewNoteService(req).then(resp=>{
      this.setState({loading:false});
      
      if(resp.responseCode=="1"){
         this.setState({NotesList:resp.responseObject});
         if(resp.responseObject.length==0){
           this.setState({LoadngMsg:"No notes are available"})
         }   
         else{
          this.setState({LoadngMsg:null})
         }      
      }
      else{
        alert(resp.responseMessage)
      }
    })
  }

  finalise=async()=>{
    if(this.state.data.objSaleOrderDetails == null || this.state.data.objSaleOrderDetails.length==0){
      alert('There is no Items, Please add at-least one item.');
      return;
    }

    const AccessToken = await Auth.AccessToken(); 
    const{BindHomePage} = this.props.route.params;
    Alert.alert(
      "Confirm",
      "Are you sure you want to finalise.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          this.setState({loading:true});
          var req={"Approval":{"Key":AccessToken.Key,"DocumentRecordID":this.state.data.objSaleOrderDetails[0].SaleOrderID,"DocumentID":this.state.data.objSaleOrderDetails[0].DocumentID,"UserID":AccessToken.AppAccessID}};
          
          Api.FinalizeModifyDocumentService(req)
          .then(resp=>{
            this.setState({loading:false});
            
            if(resp.responseCode=="1"){
              BindHomePage();
              alert('Successfully Done.')
            }
            else{
              alert(resp.responseMessage)
            }
          })
        }
      
        }
      ],
      { cancelable: false }
    )
  }

  render() {
    const {SelectedItem, BindHomePage} = this.props.route.params;
    return (
      <>
      {
          this.state.loading &&
          <View style={{flex:1, position:"absolute", top:0, bottom:0,left:0,right:0, zIndex:9, alignContent:"center", justifyContent:"center", backgroundColor: 'white', opacity: 0.7}}>
            <ActivityIndicator color="#0000ff"/>
          </View>
        }
      <ScrollView style={{flex:1}}>
      <View>
        <Overlay overlayStyle={{width:"90%"}} isVisible={this.state.isCreateNotePopupOpen} onBackdropPress={()=>this.setState({isCreateNotePopupOpen:false, Remark:null})}>
          <View style={{width:"100%", borderColor:"#fff", marginTop:1}}>
            <View style={{width:"100%", backgroundColor:"#222222", marginTop:1}}>
              <Text style={{width:"100%", textAlign:"center", color:"#d99f3a", fontSize:22, padding:10}}>Add Note</Text>
            </View>
            <View>
              <View style={{borderWidth:1, borderColor:"#ccc", marginTop:10, marginBottom:10}}>
              <TextInput multiline = {true} numberOfLines = {4} value={this.state.Remark} onChangeText={(text)=>this.setState({Remark:text})}></TextInput>
              </View>
              <View style={{flexDirection:"row", justifyContent:"center"}}>
                    <TouchableOpacity onPress={()=>this.setState({isCreateNotePopupOpen:false, Remark:null})}>
                        <Text style={[styles.text, styles.yelloButton, {backgroundColor:"#ccc", minWidth:100}]}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={!this.state.loading && this.addNote}>
                        <Text  style={[styles.text, styles.yelloButton, {minWidth:100}]}>SAVE</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        </Overlay>

        <Overlay overlayStyle={{width:"90%"}} isVisible={this.state.isViewNotePopupOpen} onBackdropPress={()=>this.setState({isViewNotePopupOpen:false})}>
          <View style={{width:"100%", borderColor:"#fff", marginTop:1}}>
            <View style={{width:"100%", backgroundColor:"#222222", marginTop:1}}>
              <Text style={{width:"100%", textAlign:"center", color:"#d99f3a", fontSize:22, padding:10}}>Notes {SelectedItem.SONumber}</Text>
            </View>
            <ScrollView>
              {
                this.state.LoadngMsg &&
                <View>
                <Text style={[styles.text,{textAlign:"center", fontSize:16, fontWeight:"bold"}]}>{this.state.LoadngMsg}</Text>
              </View>
              }
              
              <View style={{borderWidth:1, borderColor:"#ccc", marginTop:10, marginBottom:10, paddingBottom:40}}>
                {
                  this.state.NotesList.length>0 &&
                
             
                      <View style={[styles.listItem,{backgroundColor:"#99da74"}]}>
                        {/* <View style={[styles.listCell,{flex:1, borderRightColor:"#767676", backgroundColor:"#99da74", paddingRight:0}]}><Text style={[styles.text,{}]}>Document Name</Text></View>
                        <View style={[styles.listCell,{flex:1, borderRightColor:"#767676", backgroundColor:"#99da74"}]}><Text style={[styles.text,{}]}>Reference</Text></View> */}
                        <View style={[styles.listCell,{flex:1, borderRightColor:"#767676", backgroundColor:"#99da74"}]}><Text style={[styles.text,{}]}>Status</Text></View>
                        <View style={[styles.listCell,{flex:1, borderRightColor:"#767676", backgroundColor:"#99da74"}]}><Text style={[styles.text,{}]}>Remark</Text></View>
                        <View style={[styles.listCell,{flex:1, borderRightColor:"#767676", backgroundColor:"#99da74"}]}><Text style={[styles.text,{}]}>Updated By</Text></View>
                        <View style={[styles.listCell,{flex:1, borderRightColor:"#767676", backgroundColor:"#99da74"}]}><Text style={[styles.text,{}]}>Update Time</Text></View>
                        <View style={[styles.listCell,{flex:1, backgroundColor:"#99da74", borderRightWidth:0}]}><Text style={[styles.text,{}]}>File</Text></View>
                      </View>
                  
                    }
              {
            this.state.NotesList.map((item, index)=>{
                return(
                    <View key={index} style={{backgroundColor:"#fff", paddingVertical:8, borderBottomColor:"#ccc", borderBottomWidth:1}}>
                      <View style={styles.listItem}>
                        {/* <View style={[styles.listCell,{flex:1, paddingRight:0}]}><Text style={[styles.text,{}]}>{item.DocumentName}</Text></View>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{}]}>{item.ReferenceMasterName}</Text></View> */}
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{}]}>{item.ApprovalStatusName}</Text></View>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{}]}>{item.Remark}</Text></View>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{}]}>{item.StatusUpdatedBy}</Text></View>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{}]}>{item.StatusUpdateDateTime}</Text></View>
                        <View style={[styles.listCell,{flex:1, borderRightWidth:0}]}>
                        {
                          item.FilePath!=null && item.FilePath.length>0 &&
                          <TouchableOpacity onPress={ ()=>{ Linking.openURL(item.FilePath)}}>
                            <Text style={[styles.text,{}]}>Download</Text>
                          </TouchableOpacity>
                        }
                        </View>
                      </View>
                    </View>
                )
            })
        }
              </View>
            </ScrollView>
          </View>
        </Overlay>
        
        <View style={{backgroundColor:"#fff"}}>
              <View style={{flexDirection:"row", alignContent:"center", alignItems:"center", marginTop:5, borderBottomWidth:1, borderBottomColor:"#ccc"}}>
                <View style={{flex:1, paddingLeft:10}}>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('WebViewScreen',{url:`${this.state.AccessToken.ApplicationHostRoot}Sales/SOSummary?IDS=${SelectedItem.SaleOrderID}&|V|=QF`})}>
                    <Icon style={{color:"#fbab00"}} name="eye"/>
                  </TouchableOpacity>
                </View>
                <View style={{flex:SelectedItem.BtnText!=null && SelectedItem.BtnText.toLowerCase() == 'finalise'? 7:2, flexDirection:"row"}}>
                  {
                    SelectedItem.BtnText!=null && SelectedItem.BtnText.toLowerCase() == 'finalise' &&
                    <TouchableOpacity onPress={this.finalise}>
                        <Text style={[styles.text, styles.yelloButton]}>FINALISE</Text>
                    </TouchableOpacity>
                  }
                    
                    <TouchableOpacity onPress={this.viewNotes}>
                        <Text style={[styles.text, styles.yelloButton]}>VIEW NOTES</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.setState({isCreateNotePopupOpen:true, Remark:null})}>
                        <Text  style={[styles.text, styles.yelloButton]}>ADD NOTES</Text>
                    </TouchableOpacity>
                    {
                      SelectedItem.SOStatusName=="In-Creation" &&
                   
                      <TouchableOpacity onPress={()=>this.props.navigation.navigate("AddItemScreen", {SaleOrderID: SelectedItem.SaleOrderID, SelectedOrder:SelectedItem, BindHomePage:BindHomePage})}>
                        <Text style={[styles.text, styles.yelloButton]}>Add Items</Text>
                      </TouchableOpacity>
                     }
                </View>
              </View>

              <View style={{flexWrap:"wrap", flexDirection:"row", width:"100%"}}> 
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>SO Type</Text>
                <Text style={[styles.text,styles.field]}>{SelectedItem.DocumentName}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>SO Date</Text>
                <Text style={[styles.text,styles.field]}>{moment(SelectedItem.SODate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>SO No</Text>
                <Text style={[styles.text,styles.field]}>{SelectedItem.SONumber}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Customer</Text>
                <Text style={[styles.text,styles.field]}>{SelectedItem.CustomerName}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Executive</Text>
                <Text style={[styles.text,styles.field]}>{SelectedItem.SalesExecutiveName}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Shipng Date</Text>
                <Text style={[styles.text,styles.field]}>{moment(SelectedItem.ExpShippingDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Status</Text>
                <Text style={[styles.text,styles.field]}>{SelectedItem.SOStatusName}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>No Of Items</Text>
                <Text style={[styles.text,styles.field]}>{SelectedItem.NoOfItems}</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Currency</Text>
                <Text style={[styles.text,styles.field]}>INR</Text>
              </View>
              <View style={styles.detItem}>
                <Text style={[styles.text,styles.label]}>Total Price</Text>
                <Text style={[styles.text,styles.field]}>{SelectedItem.TotalPrice}</Text>
              </View>
            </View>
      </View>
      <View style={{backgroundColor:"#fff"}}>
          <Text style={{textAlign:"center", padding:20, backgroundColor:"#dfdfdf"}}>Item Added in this Sale</Text>
      </View>
      <View>
        <View style={{backgroundColor:"#a7a5b4", padding:8, borderBottomColor:"#ccc", borderBottomWidth:1, marginTop:5}}>
          <View style={[styles.listItem,{backgroundColor:"#a7a5b4"}]}>
            <View style={[styles.listHeading,{flex:1}]}><Text style={[styles.text, styles.textWhite,{}]}>Item Group</Text></View>
            <View style={[styles.listHeading,{flex:1}]}><Text style={[styles.text, styles.textWhite,{}]}>Item Name</Text></View>
            <View style={[styles.listHeading,{flex:1}]}><Text style={[styles.text, styles.textWhite,{}]}>Packing Unit</Text></View>
            <View style={[styles.listHeading,{flex:1}]}><Text style={[styles.text, styles.textWhite,{}]}>Packing Type</Text></View>
            <View style={[styles.listHeading,{flex:1}]}><Text style={[styles.text, styles.textWhite,{}]}>Quantity</Text></View>
            <View style={[styles.listHeading,{flex:1}]}><Text style={[styles.text, styles.textWhite,{}]}>Rate</Text></View>
            <View style={[styles.listHeading,{flex:1,borderRightWidth:0}]}><Text style={[styles.text, styles.textWhite,{}]}>Action</Text></View>
          </View>
        </View>
        {
            this.state.data.objSaleOrderDetails.map((item, index)=>{
                return(
                    <View key={index} style={{backgroundColor:"#fff", padding:8, borderBottomColor:"#ccc", borderBottomWidth:1}}>
                      <View style={styles.listItem}>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{fontWeight:"700", fontSize:12}]}>{item.ItemGroupName}</Text></View>
                        <View style={[styles.listCell,{flex:1, paddingRight:0}]}><Text style={[styles.text,{}]}>{item.ItemName}</Text></View>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{}]}>{item.PackingUnitName}</Text></View>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{}]}>{item.PackingTypeName}</Text></View>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{fontWeight:"700"}]}>{item.SOQuantity}</Text></View>
                        <View style={[styles.listCell,{flex:1}]}><Text style={[styles.text,{}]}>{item.SORate}</Text></View>
                        <View style={[styles.listCell,{flex:1,borderRightWidth:0}]}>
                          {
                            this.state.data.AllowAddEditID && 
                            <TouchableOpacity onPress={()=>this.Delete(item)}>
                              {/* <Text style={[styles.yelloButton,{padding:3, fontSize:10, borderRadius:5, textAlign:"center"}]}>Delete</Text> */}
                              <Icon style={[styles.cartIcon,{color:"#ff0000"}]} name="trash"></Icon>
                            </TouchableOpacity>
                          }
                        </View>
                      </View>
                    </View>
                )
            })
        }
      </View>
      </View>
      </ScrollView>
      </>
    );
  }
}

var styles=StyleSheet.create({
    listItem:{
      flexDirection:"row"
    },
    listHeading:{
      paddingTop:10,
      paddingBottom:10,
      paddingLeft:5,
      paddingRight:5,
      borderRightColor:"#fff",
      borderRightWidth:1,
      backgroundColor:"#a7a5b4"
    },
    listCell:{
      paddingTop:10,
      paddingBottom:10,
      paddingLeft:5,
      paddingRight:5,
      borderRightColor:"#767676",
      borderRightWidth:1,
      backgroundColor:"#fff"
    },
    text:{
      fontSize:10,
      textAlign:"center",
      fontFamily:"Roboto"
    },
    textWhite:{
      color:"#fff"
    },
    label: { fontSize:12,textAlign:"left", width:"50%" },
    field: { fontSize:12,fontWeight:"700", textAlign:"left", width:"50%" },
    detItem: { width:"50%", padding:10, flexDirection:"row" },
    yelloButton:{
        backgroundColor:"#fbab00", 
        paddingVertical:10,
        paddingHorizontal:7, 
        margin:1,
        fontSize:11,
        fontWeight:"700"
    }
  })