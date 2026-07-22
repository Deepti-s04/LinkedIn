import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav.jsx";
import logo3 from "../assets/logo3.jpg";
import { FaPlus } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import { userDataContext } from "../context/UserContext.jsx";
import { HiPencil } from "react-icons/hi";
import EditProfile from "../components/EditProfile.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import Post from "../components/Post.jsx";
function Home() {
  const { userData, setUserData, edit, setEdit, postData, setpostData, handleGetProfile } =
    useContext(userDataContext);
  let [frontendImage, setfrontendImage] = useState("");
  let [backendImage, setbackendImage] = useState("");
  let [description, setDescription] = useState("");
  let image = useRef();
  let [uploadPost, setuploadPost] = useState(false);
  let { serverurl } = useContext(authDataContext);
  let [posting, setPosting] = useState(false);
  let [suggestedUser, setsuggestedUser] = useState([]);
  function handleImage(e) {
    let file = e.target.files[0];
    setbackendImage(file);
    setfrontendImage(URL.createObjectURL(file));
  }
  async function handleuploadPost() {
    setPosting(true);
    try {
      let formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) {
        formdata.append("image", backendImage);
      }
      let result = await axios.post(serverurl + "/api/post/create", formdata, {
        withCredentials: true,
      });
      setPosting(false);
      setuploadPost(false);
    } catch (error) {
      setPosting(false);
      console.log(error);
    }
  }
  const handleSuggestedUser = async (req, res) => {
    try {
      let result = await axios.get(`${serverurl}/api/user/suggestedusers`, {
        withCredentials: true,
      });
      setsuggestedUser(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleSuggestedUser();
  }, []);
  return (
    <div className="w-full min-h-[100vh] relative bg-[#f0efe7]   pt-[100px] flex items-center lg:items-start       justify-center gap-[20px] px-[20px] flex-col lg:flex-row ">
      {edit && <EditProfile />}
      <Nav></Nav>
      <div className=" w-full lg:w-[25%]  min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative">
        <div
          className="w-full  h-[100px] bg-gray-200 rounded flex items-center overflow-hidden relative justify-center"
          onClick={() => setEdit(true)}
        >
          <img
            src={userData.coverImage || null}
            className="w-full h-full object-cover object-center"
          />
          <FiCamera className="absolute cursor-pointer  right-[20px] top-[20px] w-[25px] h-[25px] text-gray-800 " />
        </div>
        <div
          className="w-[70px] h-[70px] rounded-full items-center justify-center overflow-hidden absolute top-[65px] left-[20px] cursor-pointer"
          onClick={() => setEdit(true)}
        >
          <img
            src={userData.profileImage || logo3}
            alt=""
            className="h-full w-full"
          />
        </div>
        <div className="w-[20px] h-[20px] bg-[#17c1ff] top-[105px] left-[73px] absolute rounded-full flex justify-center items-center ">
          <FaPlus className=" cursor-pointer text-white" />
        </div>
        <div className="mt-[30px]  font-semibold text-gray-700 pl-[20px]">
          <div className="text-[22px]">{`${userData.firstname} ${userData.lastname}`}</div>
          <div className="text-[16px] font-semibold text-gray-600">
            {userData.headline || ""}
          </div>
          <div className="text-[16px] text-gray-500">{userData.location}</div>
        </div>
        <button
          className="w-[100%]  h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] my-[20px] flex items-center justify-center gap-[10px]"
          onClick={() => setEdit(true)}
        >
          Edit Profile
          <HiPencil />
        </button>
      </div>

      {uploadPost && (
        <div className="w-full h-full top-0 opacity-[0.5] left-0  bg-black fixed z-[100]"></div>
      )}
      {uploadPost && (
        <div className="w-[90%] top-[100px] max-w-[500px] p-[20px]  h-[600px] gap-[20px] flex justify-start items-start flex-col  bg-white shadow-lg rounded-lg fixed z-[200]">
          <div className="absolute top-[20px] right-[20px] w-[25px] h-[25px] text-gray-800 cursor-pointer font-semibold ">
            <RxCross1
              className="w-[20px] h-[20px] text-gray-800 cursor-pointer font-semibold"
              onClick={() => setuploadPost(false)}
            />
          </div>
          <div className="flex justify-start items-center gap-[10px] ">
            <div className="w-[70px] h-[70px] rounded-full items-center justify-center overflow-hidden cursor-pointer">
              <img
                src={userData.profileImage || logo3}
                alt=""
                className="h-full w-full"
              />
            </div>
            <div className="text-[19px]">{`${userData.firstname} ${userData.lastname}`}</div>
          </div>
          <textarea
            className={`w-full ${frontendImage ? "h-[200px]" : "h-[550px]"} text-[18px] outline-none border-none p-[10px] resize-none `}
            placeholder="what do you want to talk about...?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input type="file" ref={image} hidden onChange={handleImage} />
          <div className="w-full h-[300px] flex justify-center items-center rounded-lg overflow-hidden">
            <img
              src={frontendImage || null}
              alt=""
              className=" rounded-lg h-full"
            />
          </div>
          <div className="w-full h-[200px] flex flex-col">
            <div className="p-[20px] flex items-center justify-start border-b-2 border-gray-500">
              <BsImage
                className="w-[24px] h-[24px] text-gray-500 cursor-pointer"
                onClick={() => image.current.click()}
              />
            </div>

            <div className="flex justify-end items-center">
              <button
                className="w-[100px] h-[50px] rounded-full bg-[#24b2ff] text-white mt-[40px]
             shadow-md hover:bg-[#169de6]
             active:scale-95 active:translate-y-[2px] active:shadow-none 
             transition-all duration-100"
                onClick={handleuploadPost}
                disabled={posting}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full lg:w-[50%] min-h-[200px] flex flex-col gap-[20px] bg-[#f0efe7] ">
        <div className="w-full h-[120px] bg-white shadow-lg rounded-lg p-[20px] flex items-center justify-center gap-[10px] ">
          <div className="w-[70px] h-[70px] rounded-full items-center justify-center overflow-hidden cursor-pointer">
            <img
              src={userData.profileImage || logo3}
              alt=""
              className="h-full w-full"
            />
          </div>
          <button
            className="w-[80%] h-[60px] border-2 border-gray-500 rounded-full flex items-start justify-start
        px-[20px] pt-[15px] hover:bg-gray-100 "
            onClick={() => setuploadPost(true)}
          >
            Start a post{" "}
          </button>
        </div>
        {postData.map((post, index) => {
          return (
            <Post
              key={index}
              id={post._id}
              description={post.description}
              author={post.author}
              image={post.image}
              like={post.like}
              comment={post.comment}
              createdAt={post.createdAt}
            />
          );
        })}
      </div>
      <div className="w-full lg:w-[25%] min-h-[150px] rounded-lg bg-[white] shadow-lg hidden lg:flex flex-col p-[20px]">
        <h1 className="text-[20px] text-gray-600 font-semibold">
          Suggested Users
        </h1>
        {suggestedUser.length > 0 && (
          <div className="flex flex-col gap-[10px]">
            {suggestedUser.map((su , index) => (
              <div key={index} className="flex items-center gap-[10px] mt-[10px] cursor-pointer hover:bg-gray-100 rounded-lg p-[5px]" onClick={()=>handleGetProfile(su.username)}>
                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                  <img
                    src={su.profileImage || logo3}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <div className="text-[19px] font-semibold text-gray-700">{`${su.firstname} ${su.lastname}`}</div>
                  <div className="text-[13px] font-semibold text-gray-700">{`${su.headline}`}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {suggestedUser.length == 0 && <div>No Suggested User</div>}
      </div>
    </div>
  );
}
export default Home;
