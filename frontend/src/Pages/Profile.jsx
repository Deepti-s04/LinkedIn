import React, { useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import logo3 from "../assets/logo3.jpg";
import { FaPlus } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import { userDataContext } from "../context/UserContext.jsx";
import { HiPencil } from "react-icons/hi";
import EditProfile from "../components/EditProfile.jsx";
import { useContext } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import Post from "../components/Post.jsx";
import axios from "axios";
import ConnectionButton from "../components/ConnectionButton.jsx";
export default function Profile() {
  let {
    userData,
    setuserData,
    edit,
    setEdit,
    postData,
    setpostData,
    profileData,
    setprofileData,
  } = useContext(userDataContext);
  let { serverurl } = useContext(authDataContext);
  let [userConnection, setuserConnection] = useState([]);
  let [profilePost, setprofilePost] = useState([]);
  const handleGetUser = async () => {
    try {
      let result = await axios.get(`${serverurl}/api/connection`, {
        withCredentials: true,
      });
      setuserConnection(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetUser();
  }, []);
  useEffect(() => {
    setprofilePost(
      postData.filter((post) => post.author._id == profileData._id),
    );
  },[profileData]);
  return (
    <div className="w-full  pt-[100px] min-h-[100vh] pb-[40px]   bg-[#f0efe7] flex flex-col items-center">
      <Nav />
      {edit && <EditProfile />}
      <div className="w-full max-w-[900px] min-h-[100vh] gap-[20px] flex flex-col ">
        <div className="relative bg-[white] pb-[40px] rounded shadow-lg  ">
          <div
            className="w-full  h-[100px] bg-gray-200 rounded flex items-center overflow-hidden relative justify-center"
            onClick={() => setEdit(true)}
          >
            <img
              src={profileData.coverImage || null}
              className="w-full h-full object-cover object-center"
            />

            {profileData._id == userData._id && (
              <FiCamera className="absolute cursor-pointer  right-[20px] top-[20px] w-[25px] h-[25px] text-gray-800 " />
            )}
          </div>
          <div



            className="w-[70px] h-[70px] rounded-full items-center justify-center overflow-hidden absolute top-[65px] left-[20px] cursor-pointer"
            onClick={() => setEdit(true)}
          >
            <img
              src={profileData.profileImage || logo3}
              alt=""
              className="h-full w-full"
            />
          </div>
          {profileData._id == userData._id && (
            <div className="w-[20px] h-[20px] bg-[#17c1ff] top-[105px] left-[73px] absolute rounded-full flex justify-center items-center ">
              <FaPlus className=" cursor-pointer text-white" />
            </div>
          )}
          <div className="mt-[40px] font-semibold text-gray-700 pl-[20px]">
            <div className="text-[22px] ">{`${profileData.firstname} ${profileData.lastname}`}</div>
            <div className="text-[16px] mt-[10px]  font-semibold text-gray-600">
              {profileData.headline || ""}
            </div>
            <div className="text-[16px] mt-[3px]  text-gray-500">
              {profileData.location}
            </div>
          </div>
          <div className="text-[16px] ml-[20px] mt-[3px] gap-[10px] text-gray-500">{`${profileData.connection?.length || 0} connections`}</div>
          {profileData._id == userData._id && (
            <button
              className="min-w-[150px] ml-[10px] mt-[15px]  h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center"
              onClick={() => setEdit(true)}
            >
              Edit Profile
              <HiPencil />
            </button>
          )}
          {profileData._id != userData._id && (
            <div className="ml-[15px] mt-[10px]">
              <ConnectionButton userId={profileData._id} />
            </div>
          )}
        </div>
        <div className="w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg">
          {`Post (${profilePost.length})`}
        </div>
        {profilePost.map((post, index) => (
          <Post
            key={index}
            id={post._id}
            description={post.description}
            author={post.author}
            image={post.image}
            like={post.like}
            comment={post.comment}
            createdAt={post.createdAt}
            className="w-screen"
          />
        ))}
        {profileData.skills?.length > 0 && (
          <div className="w-full  min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-white shadow-lg rounded-lg">
            {" "}
            <div className="text-[22px] text-gray-600 ">Skills</div>
            <div className="flex justify-start flex-wrap  text-gray-600 items-center p-[15px] gap-[20px]">
              {profileData.skills.map((skill, index) => (
                <div className="text-[18px]" key={index}>
                  {skill}
                </div>
              ))}
              {profileData._id == userData._id && (
                <button
                  className="min-w-[150px] ml-[10px]  h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center"
                  onClick={() => setEdit(true)}
                >
                  Add Skills
                </button>
              )}
            </div>
          </div>
        )}
        {profileData.education?.length > 0 && (
          <div className="w-full  min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-white shadow-lg rounded-lg">
            {" "}
            <div className="text-[22px] text-gray-600 ">Education</div>
            <div className="flex justify-start flex-col  text-gray-600 items-start p-[15px] gap-[20px]">
              {profileData.education.map((edu) => (
                <div key={edu._id} className="text-[18px]">
                  <div>College : {edu.college}</div>
                  <div>Degree: {edu.degree}</div>
                  <div>Field Of Study: {edu.fieldOfStudy}</div>
                </div>
              ))}
              {profileData._id == userData._id && (
                <button
                  className="min-w-[150px]  h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center"
                  onClick={() => {
                    if (profileData._id === userData._id) {
                      setEdit(true);
                    }
                  }}
                >
                  Add Education
                </button>
              )}
            </div>
          </div>
        )}
        {profileData.experience?.length > 0 && (
          <div className="w-full  min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-white shadow-lg rounded-lg">
            {" "}
            <div className="text-[22px] text-gray-600 ">Experience</div>
            <div className="flex justify-start flex-col  text-gray-600 items-start p-[15px] gap-[20px]">
              {profileData.experience.map((exp) => (
                <div key={exp._id} className="text-[18px]">
                  <div>Title : {exp.title}</div>
                  <div>Company: {exp.company}</div>
                  <div>Description : {exp.description}</div>
                </div>
              ))}
              <button
                className="min-w-[150px]  h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center"
                onClick={() => {
                  if (profileData._id === userData._id) {
                    setEdit(true);
                  }
                }}
              >
                Add Experience
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
