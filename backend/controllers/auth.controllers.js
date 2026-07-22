import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup=async(req,res)=>{
    try {
        let{firstname, lastname , username , email , password}=req.body;
        let checkuser=await User.findOne({email})
        let user1=await User.findOne({username})
        if(checkuser){
            return res.status(400).json({message:"email already exists!"})
        } 
        if(user1){
            return res.status(400).json({message:"username already exists!"})
        } 
        if(password.length<8){
            return res.status(400).json({message:"Password must be atleast 8 letters"})
        }

        let hashpassword=await bcrypt.hash(password,10);
        const user=await User.create({
            firstname,
            lastname ,
            username , 
            email , 
            password:hashpassword
        })
        let token=genToken(user._id);
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production" 
        });
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"signup error occured",error:error.message})
        
    }
}
export const login=async(req,res)=>{
    console.log("login consoler hit ");
    
    try {
        let {email,password}=req.body;
        let existedemail=await User.findOne({email});
        if(!existedemail){
            return res.status(400).json({message:"user doesnt exist"});
        }
        const isMatch=await bcrypt.compare(password,existedemail.password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"});
        }
        let token=genToken(existedemail._id);
        console.log(token);
        console.log(typeof token);
        console.log("TOKEN =", token);
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*24*60*60*1000,            
            secure:process.env.NODE_ENV=="production"
        })
        console.log("sennnnttttttttttttt");
        
        return res.status(200).json(existedemail);
    } catch (error) {
        return res.send(400).json({message:"login error occured",error:error.message})
    }
}

export const logout=async(req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"logged out..."})
    } catch (error) {
        return res.status(400).json({message:"logout error occured",error:error.message})   
    }
}