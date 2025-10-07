import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"
import dotenv from "dotenv";
import { calculateShipping } from "../utils/shippingCalculator.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req,res) => {

    const frontend_url = "http://localhost:5173"


    try {
        // Calculate shipping cost based on address
        const addressData = {
            city: req.body.address.city,
            state: req.body.address.state,
            zipCode: req.body.address.zipcode
        };
        
        const itemsTotal = req.body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingInfo = calculateShipping(addressData, itemsTotal);
        const shippingCost = shippingInfo.cost;
        
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        // Add dynamic shipping cost
        if (shippingCost > 0) {
            line_items.push({
                price_data:{
                    currency:"inr",
                    product_data:{
                        name:`Delivery Charges (${shippingInfo.estimatedDays})`
                    },
                    unit_amount:shippingCost*100
                },
                quantity:1
            })
        } else {
            // Free shipping
            line_items.push({
                price_data:{
                    currency:"inr",
                    product_data:{
                        name:"Delivery Charges (FREE)"
                    },
                    unit_amount:0
                },
                quantity:1
            })
        }

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({success:true,session_url:session.url})
        console.log("Incoming order body:", req.body);

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

const verifyOrder = async(req,res) => {
    const {orderId,success} = req.body;
    try {
        if (success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Failed"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//user order for frontend
// const userOrders = async (req,res)=>{
//     try {
//         const orders = await orderModel.find({userId:req.body.userId})
//         res.json({success:true,data:orders})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Fetch Error"})
        
//     }
// }

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId:req.body.userId });  // ✅
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Fetch Error" });
  }
}

const listOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"})
        
    }
}

const updateStatus = async (req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

// Calculate shipping cost
const calculateShippingCost = async (req, res) => {
    try {
        const { address, orderValue } = req.body;
        
        if (!address) {
            return res.json({ success: false, message: "Address is required" });
        }
        
        const shipping = calculateShipping(address, orderValue || 0);
        
        res.json({
            success: true,
            shipping
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error calculating shipping" });
    }
};

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus, calculateShippingCost}
