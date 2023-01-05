import React, { Component } from 'react';
import { View, Text, Image, Alert } from "react-native";
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppStartScreen from '../app/screens/AppStartScreen';
import LoginScreen from '../app/screens/account/LoginScreen';
import ChangePasswordScreen from '../app/screens/account/ChangePasswordScreen';
import OrderListScreen from '../app/screens/OrderListScreen';
import ProfileScreen from '../app/screens/account/ProfileScreen';
import OrderDetailsScreen from '../app/screens/OrderDetailsScreen';
import AddItemScreen from '../app/screens/AddItemScreen';
import CreateOrderScreen from '../app/screens/CreateOrderScreen';
import WebViewScreen from '../app/screens/WebViewScreen';
import AccountStatementListScreen from '../app/screens/AccountStatementListScreen';
import CartScreen from '../app/screens/CartScreen';
import { Icon } from 'native-base';


import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import * as Auth from './Auth';

export default class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <MenuProvider>
        <NavigationContainer>
          <ContactStackNavigator />
        </NavigationContainer>
      </MenuProvider>
    );
  }
}

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="DrawerOrderListScreen" component={OrderListScreen} options={{ drawerLabel: 'Orders' }}/>
      <Drawer.Screen name="DRAccountStatementListScreen" component={AccountStatementListScreen} options={{ drawerLabel: 'Account Statement', title:"Account Statement" }} />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator();

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AppStartScreen" component={AppStartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: "View Profile" }} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} options={{ title: "Order Details" }} />
      <Stack.Screen name="CreateOrderScreen" component={CreateOrderScreen} options={{ title: "Create Order" }} />
      <Stack.Screen name="AddItemScreen" component={AddItemScreen} options={{ title: "Add Item" }} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{ title: "Details" }} />

      {/* <Stack.Screen name="OrderListScreen" component={OrderListScreen}  options={({ navigation, route }) =>({ 
                                                                          headerTitle: props => ( // App Logo
                                                                          <Image
                                                                              style={{ width: 200, height: 50 }}
                                                                              source={require('./assets/images/logo.png')}
                                                                              resizeMode='contain'
                                                                          />
                                                                          ),
                                                                          headerTitleStyle: { flex: 1, textAlign: 'center' },
                                                                          headerRight: props => <NavigatorMenu {...props} navigation={navigation}/>,
                                                                          headerLeft: null,
                                                                          })}/> */}
      <Stack.Screen name="OrderListScreen" component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="AccountStatementListScreen" component={DrawerNavigator} options={{ title:"Account Statement" }} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ title:"Change Password" }}/>
      <Stack.Screen name="CartScreen" component={CartScreen} options={{title:"Cart"}}/>
    </Stack.Navigator>
  )
}


export function NavigatorMenu({ navigation }) {
  return (
    <View>
      <Menu>
        <MenuTrigger>
          <View>
            <Icon name="ellipsis-vertical"></Icon>
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: { marginTop: 40 } }}>
          <MenuOption onSelect={() => navigation.navigate('ProfileScreen')}>
            <View style={{ flexDirection: "row", flex: 1, alignContent: "flex-start", alignItems: "center" }}>
              <Icon name="md-person"></Icon><Text style={{ padding: 10, fontFamily: "Roboto", fontSize: 14 }}> View Profile</Text>
            </View>
          </MenuOption>

          {/* <MenuOption onSelect={()=>navigation.navigate('CmsScreen',{Page:"About"})}>
          <View style={{flexDirection:"row", flex:1, alignContent:"flex-start", alignItems:"center"}}>
            <Icon name="ios-sync"></Icon><Text style={{padding:10, fontFamily: "Roboto", fontSize: 12}}> Sync</Text>
          </View>
        </MenuOption>

        <MenuOption onSelect={()=>navigation.navigate('Faqs')}>
          <View style={{flexDirection:"row", flex:1, alignContent:"flex-start", alignItems:"center"}}>
            <Icon name="md-settings"></Icon><Text style={{padding:10, fontFamily: "Roboto", fontSize: 12}}> Settings</Text>
          </View>
        </MenuOption> */}

          <MenuOption onSelect={() => alert('My Approval')}>
            <View style={{ flexDirection: "row", flex: 1, alignContent: "flex-start", alignItems: "center" }}>
              <Icon name="md-checkmark-circle-outline"></Icon><Text style={{ padding: 10, fontFamily: "Roboto", fontSize: 14 }}> My Approval</Text>
            </View>
          </MenuOption>

          <MenuOption onSelect={() => navigation.navigate("ChangePasswordScreen")}>
            <View style={{ flexDirection: "row", flex: 1, alignContent: "flex-start", alignItems: "center" }}>
              <Icon name="key"></Icon><Text style={{ padding: 10, fontFamily: "Roboto", fontSize: 14 }}> Change Password</Text>
            </View>
          </MenuOption>

          <MenuOption onSelect={() =>
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel"
                },
                {
                  text: "OK", onPress: () => {
                    navigation.removeListener('beforeRemove');
                    Auth.Logout().then(resp => {
                      navigation.dispatch(StackActions.popToTop());
                      navigation.replace("LoginScreen");
                    });
                  }
                }
              ],
              { cancelable: false }
            )
          }>
            <View style={{ flexDirection: "row", flex: 1, alignContent: "flex-start", alignItems: "center" }}>
              <Icon name="log-out"></Icon><Text style={{ padding: 10, fontFamily: "Roboto", fontSize: 14 }}> Logout</Text>
            </View>

          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
}