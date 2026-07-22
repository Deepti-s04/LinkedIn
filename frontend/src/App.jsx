import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home.jsx"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup.jsx"
import { userDataContext } from "./context/UserContext.jsx";
import { Navigate } from "react-router-dom";
import Network from "./components/Network.jsx";
import axios from "axios";
import Profile from "./Pages/Profile.jsx";
import Notification from "./Pages/Notification.jsx";

function App(){
  let {userData}=useContext(userDataContext);
    return(
      <Routes>
        <Route path="/" element={userData?<Home/>:<Navigate to="/login"/>}></Route>
        <Route path="/login" element={userData?<Navigate to="/"/>:<Login/>}></Route>
        <Route path="/signup" element={userData?<Navigate to="/"/>:<Signup/>}></Route>
        <Route path="/network" element={userData?<Network/>:<Navigate to="/login"/>}></Route>
        <Route path="/profile" element={userData?<Profile/>:<Navigate to="/login"/>}></Route>
        <Route path="/notification" element={userData?<Notification/>:<Navigate to="/login"/>}></Route>

 

      </Routes>
    )
}

export default App;