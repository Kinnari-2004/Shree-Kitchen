import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import validator from "validator"

const loginUser = async (req,res) => {
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User does not exist"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res.json({success:false,message:"Invalid credentials"})
        }
        const token=createToken(user._id);
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}


const registeredUser = async (req,res) => {
    const {name,password,email} = req.body;
    try {
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message:"User already exists"})
        }
        if (!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter valid email"})
        }
        if (password.length < 8){
            return res.json({success:false, message:"Please enter a strong password"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token});


    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching profile" });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { name, email, phone, address } = req.body;
        
        // Validate email if changed
        if (email && !validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid email" });
        }
        
        // Check if email already exists for another user
        if (email) {
            const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.json({ success: false, message: "Email already in use" });
            }
        }
        
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (address) updateData.address = address;
        
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating profile" });
    }
};

export {loginUser, registeredUser, getUserProfile, updateUserProfile}