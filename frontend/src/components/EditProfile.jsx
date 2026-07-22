import React, { useContext, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import UserContext, { userDataContext } from "../context/UserContext.jsx";
import logo3 from "../assets/logo3.jpg";
import { FaPlus } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import { useRef } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";

function EditProfile() {
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);
  const { serverurl } = useContext(authDataContext);
  const [firstName, setfirstName] = useState(userData.firstname || "");
  const [lastName, setlastName] = useState(userData.lastname || "");
  const [userName, setuserName] = useState(userData.username || "");
  const [gender, setgender] = useState(userData.gender || "");
  const [location, setlocation] = useState(userData.location || "");
  const [headline, setheadline] = useState(userData.headline || "");
  const [skills, setSkills] = useState(userData.skills || []);
  const [newskills, setNewskills] = useState("");
  const [saving, setSaving] = useState(false);
  const [ed, setEd] = useState(userData.education || []);
  const [newed, setNewed] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  });
  const [exp, setExp] = useState(userData.experience || "");
  const [newexp, setNewexp] = useState({
    title: "",
    company: "",
    description: "",
  });

  const profileImage = useRef();
  const coverImage = useRef();

  const [frontendProfileImage, setFrontendProfileImage] = useState(
    userData.profileImage || logo3,
  );
  const [backendProfileImage, setBackendProfileImage] = useState(null);

  const [frontendCoverImage, setFrontendCoverImage] = useState(
    userData.coverImage || null,
  );
  const [backendCoverImage, setBackendCoverImage] = useState(null);

  function addSkill(e) {
    e.preventDefault();
    if (newskills && !skills.includes(newskills)) {
      setSkills([...skills, newskills]);
    }
    setNewskills("");
  }

  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }

  function addEd(e) {
    e.preventDefault();
    if (newed.college && newed.degree && newed.fieldOfStudy) {
      setEd([...ed, newed]);
    }
    setNewed({
      college: "",
      degree: "",
      fieldOfStudy: "",
    });
  }

  function removeEd(e) {
    if (ed.includes(e)) {
      setEd(ed.filter((ed) => ed !== e));
    }
  }

  function addExp(e) {
    e.preventDefault();
    if (newexp.title && newexp.company && newexp.description) {
      setExp([...exp, newexp]);
    }
    setNewexp({
      title: "",
      company: "",
      description: "",
    });
  }
  function removeExp(e) {
    if (exp.includes(e)) {
      setExp(exp.filter((exp) => exp !== e));
    }
  }

  function handleProfileImage(e) {
    let file = e.target.files[0];
    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
  }
  function handleCoverImage(e) {
    let file = e.target.files[0];
    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  }

  const handlesaveProfile = async () => {
    setSaving(true);
    try {
      let formData = new FormData();
      formData.append("firstname", firstName);
      formData.append("lastname", lastName);
      formData.append("username", userName);
      formData.append("headline", headline);
      formData.append("location", location);
      formData.append("gender", gender);
      formData.append("skills", JSON.stringify(skills));
      formData.append("education", JSON.stringify(ed));
      formData.append("experience", JSON.stringify(exp));

      if (backendProfileImage) {
        formData.append("profileImage", backendProfileImage);
      }
      if (backendCoverImage) {
        formData.append("coverImage", backendCoverImage);
      }
      let result = await axios.put(
        serverurl + "/api/user/updateProfile",
        formData,
        { withCredentials: true },
      );
      setUserData(result.data);
      setSaving(false);
      setEdit(false)
    } catch (error) {
      console.log(error);
      setSaving(false);

    }
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center">
      <input
        type="file"
        placeholder=""
        accept="image/*"
        hidden
        ref={profileImage}
        onChange={handleProfileImage}
      />
      <input
        type="file"
        placeholder=""
        accept="image/*"
        hidden
        ref={coverImage}
        onChange={handleCoverImage}
      />

      <div className="w-full  h-full bg-black opacity-[0.5] absolute"></div>

      <div className="w-[90%] p-[10px] max-w-[500px] h-[600px] overflow-auto top-0 left-0  bg-white relative z-[200] shadow-lg rounded-lg">
        <div className="absolute top-[20px] right-[20px] w-[25px] h-[25px] text-gray-800 cursor-pointer font-semibold ">
          <RxCross1
            className="w-[20px] h-[20px] text-gray-800 cursor-pointer font-semibold"
            onClick={() => setEdit(false)}
          />
        </div>

        <div
          className="w-full h-[150px] bg-gray-400 rounded-lg mt-[40px] overflow-hidden"
          onClick={() => coverImage.current.click()}
        >
          <img src={frontendCoverImage} className="w-full h-full object-cover object-center" />
          <FiCamera className="absolute cursor-pointer  right-[20px] top-[60px] w-[25px] h-[25px] text-gray-200 " />
        </div>

        <div
          className="w-[80px] ml-[20px] absolute top-[150px] h-[80px] rounded-full overflow-hidden"
          onClick={() => profileImage.current.click()}
        >
          <img src={frontendProfileImage} alt="" className="w-full h-full" />
        </div>

        <div
          className="w-[20px] h-[20px] bg-[#17c1ff] top-[200px] left-[90px] absolute rounded-full flex justify-center items-center "
          onClick={() => profileImage.current.click()}
        >
          <FaPlus className=" cursor-pointer text-white" />
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-[20px] mt-[50px] ">
          <input
            type="text"
            placeholder="firstname"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg "
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="lastname"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg "
            value={lastName}
            onChange={(e) => setlastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="username"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg "
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="headline"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            value={headline}
            onChange={(e) => setheadline(e.target.value)}
          />
          <input
            type="text"
            placeholder="location"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg "
            value={location}
            onChange={(e) => setlocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="gender(male/female/other)"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg "
            value={gender}
            onChange={(e) => setgender(e.target.value)}
          />
          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]">
            <h1 className="text-[19px] font-semibold ">Skills</h1>
            {skills && (
              <div className="flex flex-col gap-[10px]">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="w-full h-[40px] border-[1px] flex justify-between items-center rounded-lg p-[10px] border-gray-600 bg-gray-200 "
                  >
                    <span>{skill}</span>
                    <RxCross1
                      className="w-[10px] cursor-pointer h-[10px] text-gray-800 font-semibold"
                      onClick={() => removeSkill(skill)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-start">
              <input
                type="text"
                placeholder="Add Skill"
                value={newskills}
                onChange={(e) => setNewskills(e.target.value)}
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg "
              />
              <button
                className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
                onClick={addSkill}
              >
                Add
              </button>
            </div>
          </div>

          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]">
            <h1 className="text-[19px] font-semibold ">Education</h1>
            {ed && (
              <div className="flex flex-col gap-[10px]">
                {ed.map((edd, index) => (
                  <div
                    key={index}
                    className="w-full border-[1px] flex justify-between items-center rounded-lg p-[10px] border-gray-600 bg-gray-200 "
                  >
                    <div>
                      <div>college : {edd.college}</div>
                      <div>degree : {edd.degree}</div>
                      <div>filed of study : {edd.fieldOfStudy}</div>
                    </div>
                    <RxCross1
                      className="w-[10px] h-[10px] text-gray-800 cursor-pointer font-semibold"
                      onClick={() => removeEd(edd)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-start">
              <input
                type="text"
                placeholder="College"
                value={newed.college}
                onChange={(e) =>
                  setNewed({ ...newed, college: e.target.value })
                }
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg "
              />
              <input
                type="text"
                placeholder="Degree"
                value={newed.degree}
                onChange={(e) => setNewed({ ...newed, degree: e.target.value })}
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg "
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={newed.fieldOfStudy}
                onChange={(e) =>
                  setNewed({ ...newed, fieldOfStudy: e.target.value })
                }
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg "
              />
              <button
                className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
                onClick={addEd}
              >
                Add
              </button>
            </div>
          </div>

          <div className="w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px]">
            <h1 className="text-[19px] font-semibold ">Experience</h1>
            {exp && (
              <div className="flex flex-col gap-[10px]">
                {exp.map((ex, index) => (
                  <div
                    key={index}
                    className="w-full border-[1px] flex justify-between items-center rounded-lg p-[10px] border-gray-600 bg-gray-200 "
                  >
                    <div>
                      <div>title : {ex.title}</div>
                      <div>company : {ex.company}</div>
                      <div>description : {ex.description}</div>
                    </div>
                    <RxCross1
                      className="w-[10px] h-[10px] text-gray-800 cursor-pointer font-semibold"
                      onClick={() => removeExp(ex)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-[10px] items-start">
              <input
                type="text"
                placeholder="Title"
                value={newexp.title}
                onChange={(e) =>
                  setNewexp({ ...newexp, title: e.target.value })
                }
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg "
              />
              <input
                type="text"
                placeholder="Company"
                value={newexp.company}
                onChange={(e) =>
                  setNewexp({ ...newexp, company: e.target.value })
                }
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg "
              />
              <input
                type="text"
                placeholder="description"
                value={newexp.description}
                onChange={(e) =>
                  setNewexp({ ...newexp, description: e.target.value })
                }
                className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[15px] border-2 rounded-lg "
              />
              <button
                className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
                onClick={addExp}
              >
                Add
              </button>
            </div>
          </div>

          <button
            className="w-full h-[50px] rounded-full bg-[#24b2ff] text-white mt-[40px]
             shadow-md hover:bg-[#169de6]
             active:scale-95 active:translate-y-[2px] active:shadow-none
             transition-all duration-100"
            disabled={saving}
            onClick={handlesaveProfile}
          >
            {saving ? "Loading..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
