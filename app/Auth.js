import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = async (req) => { 
    await AsyncStorage.setItem('access_token', JSON.stringify(req));
}

export const Logout = async() => {
    // ApiServices.LogOut().then((resp)=>{

         AsyncStorage.clear();
        
         
    // });
}

export const AccessToken = async () => { 
    const access_token = await AsyncStorage.getItem('access_token');

    return await JSON.parse(access_token);
}

export const IsLoogedIn = async() =>{
    const access_token = await AsyncStorage.getItem('access_token');
    return access_token != null;
}