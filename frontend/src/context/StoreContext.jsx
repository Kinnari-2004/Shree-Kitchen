import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems,setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token,setToken] = useState(""); // FIXED: Changed from {} to ""
    const [food_list,setFoodList] = useState([])
    const [user, setUser] = useState(null); // Store user data for personalization


    const addToCart = async (itemId) =>{
        if (!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if (token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
        }
    }

    const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0){
                let itemInfo=food_list.find((product)=>product._id===item)
                if(itemInfo) { // Added safety check
                    totalAmount += itemInfo.price*cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
            setCartItems(response.data.cartData);
        } catch (error) {
            console.log("Error loading cart:", error);
            // If token is invalid, clear it
            if(error.response?.data?.message === "Not Authorized, Login Again.") {
                logout();
            }
        }
    }

    // FIXED: Proper logout function
    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
        setUser(null);
    }

    // Get user order history for AI recommendations
    const getUserOrderHistory = async (token) => {
        try {
            const response = await axios.post(url+"/api/order/userorders", {}, {headers: {token}});
            return response.data.data || [];
        } catch (error) {
            console.log("Error fetching order history:", error);
            return [];
        }
    }

    useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }    
        }
        loadData();
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        user,
        setUser,
        logout,
        getUserOrderHistory
    }
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;