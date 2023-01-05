import AsyncStorage from '@react-native-async-storage/async-storage';

export const AddItem = async(order, item)=>{
    const tcart=await AsyncStorage.getItem('cart');
    let cart = {items:[]};
    if(tcart){
        cart=JSON.parse(tcart)
        
        if(cart.order.SaleOrderID!=order.SaleOrderID)cart = {items:[]};
    }
    cart.items.push(item);
    cart.order=order;
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
}
export const IncreaseItem = async(index, item, qty)=>{
    
    const tcart=await AsyncStorage.getItem('cart');
    let cart=JSON.parse(tcart);
    cart.items.forEach((element, i) => {
        
        if(element.ItemID==item.ItemID && i==index) {
            let oldQty=parseInt(element.SOQuantity);
            let newQty=oldQty+=qty;
            element.SOQuantity=newQty.toString();
        }
    });
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
}
export const DecreasItem = async(index, item, qty)=>{
    const tcart=await AsyncStorage.getItem('cart');
    let cart=JSON.parse(tcart);
    cart.items.forEach((element, i) => {
        if(element.ItemID==item.ItemID && i==index){
            let oldQty=parseInt(element.SOQuantity);
            let newQty=oldQty-=qty;
            if(newQty>0) element.SOQuantity=newQty.toString();
        }
    });
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
}

export const DeleteItem = async(index, item)=>{
    const tcart=await AsyncStorage.getItem('cart');
    let cart=JSON.parse(tcart);
    let removabelItem=cart.items.find(o=>o.ItemID==item.ItemID)
    var array = [...cart.items]; // make a separate copy of the array
    var index = array.indexOf(removabelItem)
    if (index !== -1) {
        array.splice(index, 1);
        cart.items=array;
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
    }
    
    
}

export const ItemCount = async()=>{
    try{
    const tcart=await AsyncStorage.getItem('cart');
    let cart = {items:[]};
    if(tcart)cart=JSON.parse(tcart);
    return cart.items ? cart.items.length:0;
    }
    catch{
        return 0;
    }
}
 
export const GetCartItem = async()=>{
    try{
    const tcart=await AsyncStorage.getItem('cart');
    let cart = {items:[]};
    if(tcart)cart=JSON.parse(tcart);
    return cart.items;
    }
    catch{
        return {items:[]};
    }
}

export const GetCart = async()=>{
    const tcart=await AsyncStorage.getItem('cart');
    let cart = {items:[]};
    if(tcart)cart=JSON.parse(tcart);
    return cart;
}

export const Clear = async()=>{
    await AsyncStorage.removeItem('cart');
}