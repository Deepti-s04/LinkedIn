import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
export const getCurrentUser=async(req,res)=>{
    try {
        const id=req.userId;
        const user=await User.findById(id).select("-password");
        if(!user){
            return res.status(400).json({message:"user doesnt exist"});
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"user doesnt exist",error:error.message});
        
        
    }
}
export const search=async(req,res)=>{
    try {
        let {query}=req.query
        if(!query){
            return res.status(400).json({message:"query isnt available"})
        }
        let users=await User.find({
            $or:[
                {firstname:{$regex:query,$options:"i"}},
                {lastname:{$regex:query,$options:"i"}},
                {username:{$regex:query,$options:"i"}},
                {skills:{$in:[query]}}
            ]           
        })
        return res.status(200).json(users)
    } catch (error) {
        return res.status(400).json({message:error.message})
        
    }
}
export const updateProfile=async(req,res)=>{
    try {
        let {firstname,lastname,username,headline,location,gender}=req.body;
        let skills=req.body.skills?JSON.parse(req.body.skills):[]
        let education=req.body.education?JSON.parse(req.body.education):[]
        let experience=req.body.experience?JSON.parse(req.body.experience):[]

        let profileImage;   
        let coverImage;
        if(req.files.profileImage){
            profileImage =await uploadOnCloudinary(req.files.profileImage[0].path);
        }
        if(req.files.coverImage){
            coverImage =await uploadOnCloudinary(req.files.coverImage[0].path);
        }
        console.log({
  firstname,
  lastname,
  username,
  headline,
  location,
  gender,
  skills,
  education,
  experience,
  profileImage,
  coverImage,
});
        let user=await User.findByIdAndUpdate(req.userId,{
            firstname,lastname,username,headline,location,gender,skills,education,experience,profileImage,coverImage
        },{new:true}).select("-password");
        
        return res.status(200).json(user)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
        
    }
}


export const getprofile=async(req,res)=>{
    try {
        let {username}=req.params
        let user=await User.findOne({username}).select("-password")
        if(!user){
            return res.status(400).json({message:"user doesnt exist"})
        }
        return res.status(200).json(user);
    } catch (error) {
            return res.status(400).json({message:error.message})
        
    }
}

export const getSuggestedUser=async(req,res)=>{
    try {
        let currentUser=await User.findById(req.userId).select("connection")
        let suggestedUser=await User.find({
            _id:{
            $ne:currentUser, $nin:currentUser.connection
            }
        }).select("-password")
        return res.status(200).json(suggestedUser)
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}