import mongoose from "mongoose";
const connectdb=async()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL);
        console.log("connected");
        
    }catch(error){
        console.log("Error");
        
    }
}

export default connectdb;