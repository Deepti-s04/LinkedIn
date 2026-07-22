import Notification from "../models/notification.model.js"
export const getNotifications=async(req,res)=>{
    try {
        let notification=await Notification.find({receiver:req.userId}).populate("relatedUser","firstname lastname profileImage").populate("relatedPost","image description")
        return res.status(200).json(notification)

    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}
export const deleteNotification=async(req,res)=>{
    try {
        let {id}=req.params
        let notification=await Notification.findOneAndDelete({_id:id,receiver:req.userId})
        return res.status(200).json({message:"deleted"})

    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}
export const clearAllNotification=async(req,res)=>{
    try {
        let {id}=req.params
        let notification=await Notification.deleteMany({receiver:req.userId})
        return res.status(200).json({message:"deleted"})

    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }
}