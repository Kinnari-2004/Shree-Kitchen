import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    address:"",
    city:"",
    state:"",
    zipcode:"",
    phone:""
  })

  const [shippingCost, setShippingCost] = useState(2)
  const [shippingMessage, setShippingMessage] = useState("Standard delivery")
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      
      try {
        const response = await axios.post(`${url}/api/user/profile`, {}, {
          headers: { token }
        });
        
        if (response.data.success) {
          const user = response.data.user;
          const nameParts = user.name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setData({
            firstName: firstName,
            lastName: lastName,
            email: user.email || '',
            address: user.address?.street || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            zipcode: user.address?.zipCode || '',
            phone: user.phone || ''
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, [token, url]);

  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  // Calculate shipping when address changes
  useEffect(() => {
    const calculateShipping = async () => {
      if (data.city || data.state || data.zipcode) {
        try {
          const response = await axios.post(`${url}/api/order/calculate-shipping`, {
            address: {
              city: data.city,
              state: data.state,
              zipCode: data.zipcode
            },
            orderValue: getTotalCartAmount()
          });
          if (response.data.success) {
            setShippingCost(response.data.shipping.cost);
            setShippingMessage(response.data.shipping.message);
          }
        } catch (error) {
          console.error("Error calculating shipping:", error);
        }
      }
    };
    
    const debounce = setTimeout(() => {
      calculateShipping();
    }, 500);
    
    return () => clearTimeout(debounce);
  }, [data.city, data.state, data.zipcode, getTotalCartAmount()])

  const placeOrder = async (event)=>{
    event.preventDefault();
    let orderItems = [];
    food_list.map((item)=>{
      if(cartItems[item._id]>0){
        let itemInfo = item;
        itemInfo["quantity"]= cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })
    let orderData = {
      address:data,
      items:orderItems,
      amount:getTotalCartAmount()+shippingCost,
    }
    let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}})
    if(response.data.success){
      const {session_url}=response.data;
      window.location.replace(session_url);
    }
    else{
      // console.log(error);
      
      alert("Error")
    }
  }

  const navigate = useNavigate();

  useEffect(()=>{
    if (!token) {
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
      navigate('/cart')
    }
  },[token])
  
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
        <input required name='address' onChange={onChangeHandler} value={data.address} type="text" placeholder='Delivery Address' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zipcode' />
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone'/>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-totaldetails">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-totaldetails">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount()===0?0:shippingCost}</p>
            </div>
            {shippingMessage && (
              <div className="shipping-message">
                <small>{shippingMessage}</small>
              </div>
            )}
            <hr />
            <div className="cart-totaldetails">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+shippingCost}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
