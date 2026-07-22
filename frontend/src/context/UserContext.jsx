import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const userDataContext = createContext();

function UserContext({ children }) {
  let [userData, setUserData] = useState("");
  let { serverurl } = useContext(authDataContext);
  const [edit, setEdit] = useState(false);
  let [postData, setpostData] = useState([]);
  let [profileData, setprofileData] = useState({});
  const navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      let result = await axios.get(serverurl + "/api/user/currentuser", {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getPost = async () => {
    try {
      let result = await axios.get(serverurl + "/api/post/get", {
        withCredentials: true,
      });
      setpostData(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetProfile = async (username) => {
    try {
      let result = await axios.get(
        serverurl + `/api/user/profile/${username}`,
        { withCredentials: true },
      );
      setprofileData(result.data);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCurrentUser();
    getPost();
  }, []);


  const value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setpostData,
    getPost,
    handleGetProfile,
    profileData,
    setprofileData,
  };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}
export default UserContext;
