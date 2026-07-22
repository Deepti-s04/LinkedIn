import React, { useContext, useState } from "react";
import logo2 from "../assets/logo2.png";
import { IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { IoIosGitNetwork } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import logo3 from "../assets/logo3.jpg";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Nav() {
  const [activeSearch, setactiveSearch] = useState(false);
  const {
    userData,
    setUserData,
    handleGetProfile,
    profileData,
    setprofileData,
  } = useContext(userDataContext);
  const { serverurl } = useContext(authDataContext);
  const navigate = useNavigate();
  const [showPopup, setshowPopup] = useState(false);
  const [searchInput, setsearchInput] = useState("");
  const [searchData, setsearchData] = useState([]);

  const handlesignout = async () => {
    try {
      let result = await axios.get(serverurl + "/api/auth/logout", {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      setsearchData([])
      console.log(error);
    }
  };
  const handlesearch = async () => {
    try {
      let result = await axios.get(
        serverurl+`/api/user/search?query=${searchInput}`,
        { withCredentials: true },
      );
      setsearchData(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
  if (!searchInput.trim()) {
    setsearchData([]);
    return;
  }

  handlesearch();
}, [searchInput]);
  return (
    <div className="w-full h-[80px] bg-[white] fixed  top-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]">
      <div className="flex justify-center items-center cursor-pointer gap-[10px] ">
        <div onClick={() => navigate("/")}>
          <img src={logo2} alt="" className="w-[50px]"></img>
        </div>
        {!activeSearch && (
          <IoSearchSharp
            className="w-[23px] h-[23px] text-gray-600 lg:hidden"
            onClick={() => setactiveSearch(true)}
          />
        )}
        {searchData.length>0 && <div className="absolute top-[90px] shadow-lg left-[0px] lg:left-[20px] w-[100%] lg:w-[700px] max-w-[500px] bg-[white] flex flex-col gap-[20px] min-h-[100px] p-[20px] ">
          {searchData.map((sea) => (
            <div className="flex gap-[20px] items-center  hover:bg-gray-100 cursor-pointer rounded-lg border-b-2 border-b-gray-300 p-[10px]" onClick={()=>handleGetProfile(sea.username)}>
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
                <img
                  src={sea.profileImage || logo3}
                  alt=""
                  className="w-full h-full"
                />
              </div>
              <div>
              <div className="text-[19px] font-semibold text-gray-700">{`${sea.firstname} ${sea .lastname}`}</div>
              <div className="text-[15px] font-semibold text-gray-700">{`${sea.headline}`}</div>

              </div>
            </div>
          ))}
        </div>}
        <form
          className={` w-[200px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!activeSearch ? "hidden" : "flex"} `}
        >
          <div>
            <IoSearchSharp className="w-[23px] h-[23px] text-gray-600 " />
          </div>
          <input
            type="text"
            className="w[80%] h-full bg-transparent outline-none border-0"
            placeholder="search users..."
            value={searchInput}
            onChange={(e) => setsearchInput(e.target.value)}
          ></input>
        </form>
      </div>
      <div className="flex justify-center items-center gap-[20px] ">
        {showPopup && (
          <div className="w-[300px] min-h-[300px] h-[300px] right-[20px] lg:right-[100px] flex flex-col items-center rounded-lg bg-white shadow-lg absolute top-[75px] p-[20px] gap-[20px]">
            <div className="w-[50px] h-[70px] rounded-full overflow-hidden">
              <img
                src={userData.profileImage || logo3}
                alt=""
                className="w-full h-full"
              />
            </div>
            <div className="text-[19px] font-semibold text-gray-700">{`${userData.firstname} ${userData.lastname}`}</div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
              onClick={() => {
                setprofileData(userData);
                navigate("/profile");
              }}
            >
              View Profile
            </button>
            <div className="w-full h-[1px] bg-gray-400"></div>
            <div
              className="flex w-full gap-[10px] items-center justify-start text-gray-600 "
              onClick={() => handleGetProfile(userData.username)}
            >
              <IoIosGitNetwork className="w-[23px] h-[23px] text-gray-600 " />
              <div>My Networks</div>
            </div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]"
              onClick={handlesignout}
            >
              Sign out
            </button>
          </div>
        )}
        <div
          className="lg:flex flex-col items-center justify-center cursor-pointer text-gray-600 hidden"
          onClick={() => navigate("/")}
        >
          <TiHome className="w-[23px] h-[23px] text-gray-600 " />
          <div>Home</div>
        </div>
        <div
          className="md:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer"
          onClick={() => navigate("/network")}
        >
          <IoIosGitNetwork className="w-[23px] h-[23px] text-gray-600 " />
          <div>Network</div>
        </div>
        <div className="flex flex-col items-center justify-center cursor-pointer text-gray-600 " onClick={()=>navigate("/notification")}>
          <IoMdNotifications className="w-[23px] h-[23px] text-gray-600 " />
          <div className="hidden md:block" >Notifications</div>
        </div>
        <div
          className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer"
          onClick={() => setshowPopup((prev) => !prev)}
        >
          <img
            src={userData.profileImage || logo3}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
