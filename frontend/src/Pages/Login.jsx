import React, { useContext, useState } from "react";
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios"
import { userDataContext } from "../context/UserContext.jsx";

export default function Login(){
    const[show,setShow]=useState(false);
    const[email,setemail]=useState("");
    const[password,setpassword]=useState("");
    const[loading,setloading]=useState(false);
    const[err,seterr]=useState("");
    const {userData,setUserData}=useContext(userDataContext);
    let {serverurl}=useContext(authDataContext);
    const navigate=useNavigate();
    const handlesignin=async(e)=>{
        setloading(true);
        e.preventDefault();
        try {
            console.log(serverurl);
            console.log(serverurl + "/api/auth/login");
            console.log(JSON.stringify(serverurl));
            let result=await axios.post(serverurl+"/api/auth/login",{
               
                email,
                password
            },{withCredentials:true})
            console.log(result);
            setUserData(result.data);
            console.log("Before Navigate");
navigate("/");
console.log("After Navigate");
            setloading(false) ;            
            setemail("");
            setpassword("");
            seterr("");
        } catch (error) {
            seterr(error.response.data.message) 
            setloading(false);
        }
    }
    return(
        <div className="w-full h-screen  bg-[white] flex flex-col items-center justify-start gap-[10px] ">
            <div className="p-[30px] w-full lg:p-[35px] items center">
                <img src={logo} alt=""/>
            </div>
            <form className="w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]" onSubmit={handlesignin}>
            <h1 className="text-gray-800 text-[30px] font-semibold mb-[30px] ">Sign in </h1>
             
            <input type="email" placeholder="email" required className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md" value={email} onChange={(e)=>setemail(e.target.value)}/>
            <div className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] relative rounded-md">
                <input type={show?"text":"password"} placeholder="password" required className="w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md" value={password} onChange={(e)=>setpassword(e.target.value)}/>
                <span className="absolute right-[20px] top-[10px] text-[#24b2ff] font-semibold cursor-pointer" onClick={()=>setShow(prev=>!prev)}>{show?"show":"hide"}</span>
            </div>
            {err && <p className="text-[red] text-sm text-center ">{err}</p>}
            <button className="w-[100%] h-[50px] rounded-full bg-[#24b2ff] text-[white]
            mt-[40px]" disabled={loading} >{loading?"loading...":"Sign in"}</button>
            <p className="text-center ">Dont have an account ? <span className="text-[#24b2ff] font-semibold cursor-pointer" onClick={()=>navigate("/signup")}>Sign Up</span></p>
            </form> 

        </div>
    )
}