import axios from "axios";
import React from "react";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import { useState } from "react";
import { useEffect } from "react";
import Nav from "./Nav";
import logo3 from "../assets/logo3.jpg"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
export default function Network() {
  let { serverurl } = useContext(authDataContext);
  let [connection, setConnection] = useState([]);
  const handleGetRequests = async () => {
    try {
      let result = await axios.get(`${serverurl}/api/connection/requests`, {
        withCredentials: true,
      });
      setConnection(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcceptConnection=async(requestId)=>{
    try {
        let result=await axios.put(`${serverurl}/api/connection/accept/${requestId}`,{},{
        withCredentials: true,
      })
      setConnection(connection.filter((con)=>con._id!==requestId))
    } catch (error) {
        console.log(error);
        
    }
  }
    const handleRejectConnection=async(requestId)=>{
    try {
        let result= await axios.delete(`${serverurl}/api/connection/reject/${requestId}`,{
        withCredentials: true,
      })
    setConnection(connection.filter((con)=>con._id!==requestId))
        
    } catch (error) {
        console.log(error);
        
    }
  }
  useEffect(() => {
    handleGetRequests();
  }, []);
  return (
    <div className="w-screen flex flex-col items-center gap-[40px]  h-[100vh] bg-[#f0efe7] px-[20px] pt-[100px] ">
      <Nav />
      <div className="w-full h-[100px] bg-[white] shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600">
        Invitations {connection.length}
      </div>

      {connection.length>0 &&  <div className="w-[100%] max-w-[900px]  shadow-lg rounded-lg min-h-[100px] bg-[white]  flex flex-col gap-[20px] ">
        {connection.map((connection, index) => (
          <div className="w-[full] flex justify-between items-center min-h-[100px] p-[20px]" key={index}>
            <div className="flex justify-center items-center gap-[10px] ">
              <div
                className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer"
              >
                <img
                  src={connection.sender.profileImage || logo3}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
               <div className="text-[19px] font-semibold text-gray-700">{`${connection.sender.firstname} ${connection.sender.lastname}`}</div>
            </div>
            <div className="flex justify-center items-center gap-[10px] ">
                <button className="text-[#18c5ff]" onClick={()=>handleAcceptConnection(connection._id)}>
                    <IoIosCheckmarkCircleOutline className="w-[40px] h-[40px] "/>
                </button>
                <button className="text-[#ff4218]"  onClick={()=>handleRejectConnection(connection._id)} >
                    <RxCrossCircled className="w-[38px] h-[38px] " />
                </button>
            </div>
          </div>
        ))}
      </div> }
     
    </div>
  );
}
