import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://kinnarivaghela2004:kinnarivaghela2004@cluster0.qqje8x7.mongodb.net/shree-kitchen').then(()=>console.log("DB connected"));
}