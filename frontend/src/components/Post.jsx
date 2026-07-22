import React, { useState } from "react";
import logo3 from "../assets/logo3.jpg";
import moment from "moment";
import { AiOutlineLike } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import axios from "axios";
import { FaRegCommentDots } from "react-icons/fa";
import { authDataContext } from "../context/AuthContext.jsx";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import { useEffect } from "react";
import { io } from "socket.io-client";
import ConnectionButton from "./ConnectionButton.jsx";

let socket = io("http://localhost:8000");
export default function Post({
  id,
  author,
  like,
  comment,
  description,
  image,
  createdAt,
}) {
  let [more, setMore] = useState(false);
  let { serverurl } = useContext(authDataContext);
  let [likes, setLikes] = useState(like || []);
  let [commentContent, setcommentContent] = useState("");
  let { userData, setuserData, getPost, handleGetProfile } =
    useContext(userDataContext);
  let [comments, setComments] = useState(comment || []);
  let [showComment, setshowComment] = useState(false);

  const likee = async () => {
    try {
      let result = await axios.get(serverurl + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      setLikes(result.data.like);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(
        serverurl + `/api/post/comment/${id}`,
        { content: commentContent },
        { withCredentials: true },
      );

      setComments(result.data.comment);
      setcommentContent("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == id) {
        setLikes(likes);
      }
    });
    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId == id) {
        setComments(comm);
      }
    });
    return () => {
      socket.off("commentAdded");
    };
  }, [id]);

  useEffect(() => {
    getPost();
  }, [likes, setLikes, comments]);

  return (
    <div className="w-full min-h-[200px] gap-[10px]  flex flex-col bg-white rounded-lg shadow-lg p-[20px] ">
      <div className="flex justify-between items-center ">
        <div
          className="flex justify-center items-start gap-[10px]"
          
  onClick={() => {
    handleGetProfile(author.username);
  }}
        >
          <div className="w-[70px] h-[70px] rounded-full items-center justify-center overflow-hidden cursor-pointer">
            <img
              src={author.profileImage || logo3}
              alt=""
              className="h-full w-full"
            />
          </div>
          <div>
            <div className="text-[22px] font-semibold">{`${author.firstname} ${author.lastname}`}</div>
            <div className="text-[16px]">{`${author.headline}`}</div>
            <div className="text-[12px]">{moment(createdAt).fromNow()}</div>
          </div>
        </div>

        <div>
          {userData._id != author._id && (
            <ConnectionButton userId={author._id} />
          )}
        </div>
      </div>
      <div
        className={`w-full ${!more ? "max-h-[100px] overflow-hidden" : ""} pl-[50px] `}
      >
        {description}
      </div>
      <div
        className="pl-[50px] text-[#2ee1db]  font-semibold text-[17px] cursor-pointer "
        onClick={() => setMore((prev) => !prev)}
      >
        {more ? "read less" : "read more"}
      </div>
      {image && (
        <div className="w-full h-[300px] overflow-hidden flex justify-center rounded-lg ">
          <img src={image} alt="" className="rounded-lg h-full" />
        </div>
      )}
      <div>
        <div className="w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500 ">
          <div className="flex items-center justify-center gap-[5px] text-[18px] ">
            <AiOutlineLike className="text-[#1ebbff] w-[20px] h-[20px] " />
            <span>{likes.length}</span>
          </div>
          <div
            className="flex items-center justify-center gap-[5px] text-[18px] cursor-pointer "
            onClick={() => setshowComment((prev) => !prev)}
          >
            <span>{comment.length}</span>
            <span>comments</span>
          </div>
        </div>

        <div className="flex justify-start items-center w-full p-[20px] gap-[24px] ">
          {!likes.includes(userData._id) && (
            <div
              className="flex items-center justify-center gap-[5px] cursor-pointer"
              onClick={likee}
            >
              <AiOutlineLike className="w-[24px] h-[24px]" />
              <span>Like</span>
            </div>
          )}
          {likes.includes(userData._id) && (
            <div
              className="flex items-center justify-center gap-[5px] cursor-pointer"
              onClick={likee}
            >
              <BiSolidLike className="w-[24px] h-[24px] text-[#07a4ff]" />
              <span className="text-[#07a4ff] font-semibold">Liked</span>
            </div>
          )}

          <div
            className="flex items-center justify-center gap-[5px] cursor-pointer"
            onClick={() => setshowComment((prev) => !prev)}
          >
            <FaRegCommentDots className="w-[24px] h-[24px] " />
            <span>Comment</span>
          </div>
        </div>
        {showComment && (
          <div>
            <form
              className="  w-full flex justify-between items-center border-b-2 p-[10px] border-b-gray-300"
              onSubmit={handleComment}
            >
              <input
                type="text"
                placeholder={"leave a comment"}
                value={commentContent}
                className="outline-none border-none"
                onChange={(e) => setcommentContent(e.target.value)}
              />
              <button className="text-[#07a4ff] h-[22px] w-[22px] ">
                <LuSendHorizontal />
              </button>
            </form>
            <div className="flex flex-col gap-[10px] ">
              {comments.map((com) => {
                return (
                  <div className="flex flex-col gap-[20px] border-b-2 p-[20px]  border-b-gray-300">
                    <div className="w-full flex justify-start items-center gap-[10px]">
                      <div className="w-[40px] h-[40px] rounded-full items-center justify-center overflow-hidden cursor-pointer">
                        <img
                          src={com.user.profileImage || logo3}
                          alt=""
                          className="h-full"
                        />
                      </div>
                      <div>
                        <div className="text-[16px] font-semibold">{`${com.user.firstname} ${com.user.lastname}`}</div>
                        <div>{moment(com.createdAt).fromNow()}</div>
                      </div>
                    </div>
                    <div className="pl-[50px] ">{com.content}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
