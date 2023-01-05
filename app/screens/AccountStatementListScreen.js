import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, BackHandler, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { Container, Header, Item, Input, Icon, Button, Fab } from 'native-base';
import { Picker } from 'native-base';
import moment from 'moment';
import * as Api from '../ApiServices';
import * as Auth from '../Auth';
import SearchableDropdown from 'react-native-searchable-dropdown';

export default class AccountStatementListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            CustomerList: [],
            FromDate: moment(new Date()).add(-1, 'year').format('DD-MM-YYYY'),
            ToDate: moment(new Date()).format('DD-MM-YYYY'),
        };
    } 

    async componentDidMount() {
        const AccessToken = await Auth.AccessToken();
        var req = { "ObjCommon": { "InsertedUserID": AccessToken.AppAccessID, "InsertedSessionID": AccessToken.AppAccessSessionID, "CompanyID": AccessToken.CompanyID, "Key": AccessToken.Key, "SRightID": "", "BMCEntityID": 0, "FinancialYearID": AccessToken.FinancialYearID, "TeamMemberList": AccessToken.TeamMemberList } }

        
        this.setState({ IsProcessing: true });
        Api.GetDealerListService(req).then(resp => {
            
            this.setState({ IsProcessing: false });
            if (resp.responseCode == "1") {
                this.setState({ CustomerList: resp.responseObject });
            }
            else {
                
            }
        })



    }

    bindData = async () => {
        this.setState({
            data: []
        }, async () => {
            await this.loadProducts();
        });
    }

    filterDataStart = async () => {
        this.setState({
            data: []
        }, async () => {
            await this.loadProducts();
        });
    }

    nextPage = () => {
        this.setState({ PageIndex: this.state.PageIndex + 1 });
        this.loadProducts();
    }

    loadProducts = async () => {
        if (this.state.LedgerID == null || this.state.LedgerID == "") {
            alert("Please select customer");
            return;
        }
        const AccessToken = await Auth.AccessToken();
        var req = { "LedgerID": this.state.LedgerID, "FromDate": this.state.FromDate, "ToDate": this.state.ToDate, "ObjCommon": { "CompanyID": AccessToken.CompanyID, "Key": AccessToken.Key, "FinancialYearID": AccessToken.FinancialYearID } }

        
        this.setState({ IsProcessing: true });
        Api.GetAccountStatementService(req).then(resp => {
            
            this.setState({ IsProcessing: false });
            const interest = [...this.state.data, ...JSON.parse(resp)];
            this.setState({ data: interest });

        })
    }

    _ViewVoucher = async (item) => {
        const AccessToken = await Auth.AccessToken();
        
        var url = `${AccessToken.ApplicationHostRoot}Sales/StatementOfAccountVoucherType?ReferenceID=${item.ReferenceID}&VoucherDate=${item.VoucherDate}&ReferenceNo=${item.ReferenceNo}&VoucherID=${item.VoucherID}&VoucherTypeID=${item.VoucherTypeID}`;
        
        this.props.navigation.navigate('WebViewScreen', { url: url });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                
                     
                        <View style={{ flexDirection: "row", padding: 10, alignContent: "space-around", alignItems: "center" }}>
                            <DatePicker
                                style={{ flex: 1, paddingRight: 10 }}
                                date={this.state.FromDate}
                                mode="date"
                                placeholder="select date"
                                format="DD-MM-YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => { this.setState({ FromDate: date }); }}
                            />
                            <DatePicker
                                style={{ flex: 1 }}
                                date={this.state.ToDate}
                                mode="date"
                                placeholder="select date"
                                format="DD-MM-YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => { this.setState({ ToDate: date }); }}
                            />
                        </View>

                        <View style={{ flexDirection: "row", padding: 10, alignContent: "space-around", alignItems: "center" }}>


                            <View style={[styles.pickerOuter, { minWidth: 200 }]}>

                                {/* <Picker selectedValue={this.state.LedgerID} onValueChange={(itemValue, itemIndex) => {this.setState({LedgerID:itemValue});}}>
                  <Picker.Item label="--SELECT--" value="" />
                  {
                    this.state.CustomerList.map(item=>(<Picker.Item label={item.BusinessRelationName} value={item.SBRID} />))
                  }
                </Picker> */}
                                {
                                    this.state.LedgerName ?
                                        <Text onPress={() => this.setState({ LedgerName: null })} style={{ padding: 15, borderWidth: 1, borderColor: "#ccc" }}>{this.state.LedgerName}</Text>
                                        :
                                        <View style={{ zIndex: 999 }}>
                                            <SearchableDropdown

                                                onItemSelect={(item) => {
                                                    this.setState({ LedgerID: item.id });
                                                    this.setState({ LedgerName: item.name });
                                                    
                                                }}
                                                containerStyle={{ padding: 0 }}

                                                itemStyle={{
                                                    padding: 10,
                                                    marginTop: 0,
                                                    backgroundColor: '#fff',
                                                    borderColor: '#000',
                                                    borderWidth: 1,
                                                    borderRadius: 5
                                                }}
                                                itemTextStyle={{ color: '#222' }}
                                                //itemsContainerStyle={{ maxHeight: 140 }}
                                                items={this.state.CustomerList.map(item => { return { name: item.DisplayField, id: item.SValueField } })}
                                                defaultIndex={0}
                                                resetValue={false}
                                                textInputProps={{
                                                    placeholder: "--SELECT--",
                                                    underlineColorAndroid: "transparent",
                                                     //style: {
                                                         //padding: 5,
                                                    //     borderWidth: 1,
                                                    //     borderColor: '#ccc',
                                                    //     borderRadius: 5,
                                                     //}
                                                }}
                                                listProps={{
                                                    nestedScrollEnabled: true,
                                                }}
                                            />
                                        </View>
                                }
                            </View>

                            <TouchableOpacity onPress={() => this.filterDataStart()}>
                                <Text style={[styles.yelloButton, { width: 100, textAlign: "center", fontSize: 12, marginBottom: 10, alignSelf: "center" }]}>SEARCH</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            /*
                            FDateFrom:moment(new Date()).add(-1, 'month').format('DD-MM-YYYY'),
                    FDateTo:moment(new Date()).format('DD-MM-YYYY'), */
                        }
                    
                        <View style={{ backgroundColor: "#ccc", padding: 8, borderBottomColor: "#63a196", borderBottomWidth: 2 }}>
                            <View style={[styles.listItem, { backgroundColor: "#ccc" }]}>
                                <View style={[styles.listCell, { flex: 1, borderRightColor: "#767676", backgroundColor: "#ccc", paddingRight: 0 }]}><Text style={styles.listCellText}>Voucher ID</Text></View>
                                <View style={[styles.listCell, { flex: 2, borderRightColor: "#767676", backgroundColor: "#ccc", paddingRight: 0 }]}><Text style={styles.listCellText}>Voucher{'\n'}Date</Text></View>
                                <View style={[styles.listCell, { flex: 1, borderRightColor: "#767676", backgroundColor: "#ccc", paddingRight: 0 }]}><Text style={styles.listCellText}>Voucher{'\n'}Type</Text></View>
                                <View style={[styles.listCell, { flex: 1, borderRightColor: "#767676", backgroundColor: "#ccc", paddingRight: 0 }]}><Text style={styles.listCellText}>Debit</Text></View>
                                <View style={[styles.listCell, { flex: 1, borderRightColor: "#767676", backgroundColor: "#ccc", paddingRight: 0 }]}><Text style={styles.listCellText}>Credit</Text></View>
                                <View style={[styles.listCell, { flex: 1, borderRightColor: "#767676", backgroundColor: "#ccc", paddingRight: 0 }]}><Text style={styles.listCellText}>Balance</Text></View>
                                <View style={[styles.listCell, { flex: 1, borderRightWidth: 0, backgroundColor: "#ccc", paddingRight: 0 }]}><Text style={styles.listCellText}>Sign</Text></View>
                            </View>
                        </View>
                    <ScrollView>
                        <View>
                            {
                                this.state.data.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => { this.setState({ selectedItem: item }); this.setState({ visibleDetails: true }); }}>
                                            <View style={{ backgroundColor: "#fff", paddingVertical: 0, marginBottom: 10, borderColor: "#ccc", borderWidth: 1 }}>
                                                <View style={[styles.listItem,{flex:1}]}>
                                                    <View style={[styles.listCell, { flex: 1 }]}><Text style={[styles.text, { fontWeight: "700", fontSize: 10 }]}>{item.VoucherID}</Text></View>
                                                    <View style={[styles.listCell, { flex: 2 }]}><Text style={[styles.text, { fontWeight: "700", fontSize: 10 }]}>{item.VoucherDate}</Text></View>
                                                    <View style={[styles.listCell, { flex: 1 }]}>
                                                        {
                                                            item.VoucherTypeName != null &&
                                                            <TouchableOpacity onPress={() => this._ViewVoucher(item)}>
                                                                <Text style={[styles.text, { fontWeight: "700", fontSize: 10, color: "#0000FF" }]}>{item.VoucherTypeName}</Text>
                                                            </TouchableOpacity>
                                                        }
                                                    </View>
                                                    <View style={[styles.listCell, { flex: 1 }]}><Text style={[styles.text, { fontWeight: "700", fontSize: 10 }]}>{item.DebitAmount.toFixed(2)}</Text></View>
                                                    <View style={[styles.listCell, { flex: 1 }]}><Text style={[styles.text, { fontWeight: "700", fontSize: 10 }]}>{item.CreditAmount.toFixed(2)}</Text></View>
                                                    <View style={[styles.listCell, { flex: 1 }]}><Text style={[styles.text, { fontWeight: "700", fontSize: 10 }]}>{item.Balance.toFixed(2)}</Text></View>
                                                    <View style={[styles.listCell, { flex: 1, borderRightWidth: 0, paddingLeft:0, paddingRight:0 }]}><Text style={[styles.text, {width:"100%", fontWeight: "700", fontSize: 10, backgroundColor: "#ff9b9b", padding: 10 }]}>{item.BalanceSign}</Text></View>
                                                </View>
                                                <View style={{ padding: 10, borderWidth: 1, borderColor: "#767676" }}>
                                                    <Text style={[styles.text, { fontWeight: "700", fontSize: 10, textAlign: "left" }]}>{item.Narration}</Text>
                                                </View>
                                            </View>

                                        </TouchableOpacity>
                                    )
                                })
                            }

                        </View>
                        {/* {
                        !this.state.IsProcessing && this.state.data.length > 0 &&
                        <View>
                            <TouchableOpacity onPress={() => this.nextPage()}><Text style={{
                                backgroundColor: "#ccc",
                                padding: 15,
                                margin: 1,
                                fontSize: 15,
                                fontWeight: "700", textAlign: "center"
                            }}>LOAD MORE</Text></TouchableOpacity>
                        </View>
                    } */}

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
                        !this.state.IsProcessing && this.state.data.length == 0 &&
                        <View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
                            <Text>No record found</Text>
                        </View>
                    }
                


            </View>
        );
    }
}

var styles = StyleSheet.create({
    listItem: {
        flexDirection: "row"
    },
    listCell: {
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        borderRightColor: "#767676",
        borderRightWidth: 1,
        backgroundColor: "#fff"
    },
    listCellText: {
        fontSize: 8,
        fontFamily: "Roboto",
        fontWeight: "bold"
    },
    text: {
        fontSize: 10,
        textAlign: "center",
        fontFamily: "Roboto"
    },
    label: { fontSize: 12, textAlign: "left", width: "50%" },
    field: { fontSize: 12, fontWeight: "700", textAlign: "left", width: "50%" },
    detItem: { width: "50%", padding: 10, flexDirection: "row" },
    pickerOuter: { flex: 1, borderWidth: 1, borderColor: "#ccc" },
    yelloButton: {
        backgroundColor: "#CCC",
        padding: 10,
        margin: 5,
        fontSize: 15,
        fontWeight: "700",
        borderRadius: 5
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    }
})