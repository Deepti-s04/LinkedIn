import React from "react";
import Nav from "../components/Nav.jsx";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import logo3 from "../assets/logo3.jpg"
export default function Notification() {
  let { serverurl } = useContext(authDataContext);
  let [notificationData, setnotificationData] = useState([]);

  const handleGetNotification = async () => {
    try {
      let result = await axios.get(serverurl + "/api/notification/get", {
        withCredentials: true,
      });
      setnotificationData(result.data);
    } catch (error) {
      console.log(error.message);
    }
  };

   const handleDeleteNotification = async (id) => {
    try {
      let result = await axios.delete(serverurl + `/api/notification/deleteOne/${id}`, {
        withCredentials: true,
      });
      await handleGetNotification();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClearAllNotification = async () => {
    try {
      let result = await axios.delete(serverurl + "/api/notification/", {
        withCredentials: true,
      });
      await handleGetNotification();
    } catch (error) {
      console.log(error.message);
    }
  };


  function handleMessage(type) {
    if (type == "like") {
      return "liked your post";
    } else if (type == "comment") {
      return "commented on your post";
    } else {
      return "accepted your request";
    }
  }
  useEffect(() => {
    handleGetNotification();
  }, []);
  return (
    <div className="w-screen flex flex-col items-center gap-[40px]  h-[100vh] bg-[#f0efe7] px-[20px] pt-[100px] ">
      <Nav />
      <div className="w-full h-[100px] bg-[white] shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600 justify-between">
        <div>
            Notifications ({notificationData.length})
        </div>
        {notificationData.length>0  && <button className="min-w-[80px] h-[40px] text-sm rounded-full border-2 border-[#ec4545] text-[#ec4545]" onClick={handleClearAllNotification}>
            Clear All
        </button>}
        
      </div>      
      {notificationData.length > 0 && (
        <div className="w-[100%] max-w-[900px]  shadow-lg rounded-lg h-[100vh] overflow-auto bg-[white]  flex flex-col gap-[20px] p-[20px] ">
          {notificationData.map((noti, index) => (
            <div
              className="w-[full] flex justify-between items-center min-h-[50px] p-[20px] border-b-2 border-b-gray-200"
              key={index}
            >
              <div>
                <div className="flex justify-center items-center gap-[10px] ">
                  <div className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer">
                    <img
                      src={noti.relatedUser.profileImage || logo3}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[19px] font-semibold text-gray-700">{`${noti.relatedUser.firstname} ${noti.relatedUser.lastname} ${handleMessage(noti.type)}`}</div>
                </div>
                {noti.relatedPost && (
                  <div className="flex items-center gap-[10px] ml-[80px] h-[70px] overflow-hidden ">
                    <div className="w-[80px] h-[50px] ">
                      <img
                        src={noti.relatedPost.image}
                        alt=""
                        className="h-full overflow-hidden"
                      />
                    </div>
                    <div>{noti.relatedPost.description}</div>
                  </div>
                )}
              </div>
              <div className="flex justify-center items-center gap-[10px] ">
                <RxCross1
                  className="w-[20px] h-[20px] text-gray-800 cursor-pointer font-semibold"
                  onClick={() => handleDeleteNotification(noti._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
