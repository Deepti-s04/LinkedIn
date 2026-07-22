import React from "react";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
const socket=io("https://linkedin-backend-8xls.onrender.com")
function ConnectionButton({userId}){
    let {serverurl}=useContext(authDataContext)
    let navigate=useNavigate()
    let {userData,setuserData}=useContext(userDataContext)
    let [status,setStatus]=useState("")
    const handleSendConnection=async()=>{
        try {
            let result=await axios.post(serverurl+`/api/connection/send/${userId}`,{},{withCredentials:true})
            
        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            
        }
    }
    const handleRemoveConnection=async()=>{
        try {
            let result=await axios.delete(serverurl+`/api/connection/remove/${userId}`,{withCredentials:true})
            
        } catch (error) {
            console.log(error);
            
        }
    }
    const handleGetStatus=async()=>{
        
        try {
            let result=await axios.get(serverurl+`/api/connection/getstatus/${userId}`,{withCredentials:true})
            setStatus(result.data.status);
            
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{

        socket.emit("register",userData._id)
        handleGetStatus()
        socket.on("statusUpdate",({updatedUserId,newStatus})=>{
            if(updatedUserId==userId){
                setStatus(newStatus)
            }
        })
    },[])

    const handleClick=async()=>{
        if(status=="disconnect"){
            await handleRemoveConnection();            
        }else if(status=="received"){
            navigate("/network")
        }else{
            await handleSendConnection();
        }
    }

    return(
        <button className="min-w-[100px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]" onClick={handleClick} disabled={status==="pending"}>
            {status}
          </button>
    )
}

export default ConnectionButton
