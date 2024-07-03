import React, { useContext, useEffect, useState } from 'react';
import "./mystyles.css";
import { FaRegUserCircle } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegMoon } from "react-icons/fa";
import { MdLightMode } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import ConversationsItem from "./Conversationitem"; // Make sure the import statement is correct
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../Features/themeSlice';
import { myContext } from "./MainContainer";
import axios from 'axios';

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lighttheme = useSelector((state) => state.themeKey);
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  
  if (!userData) {
    console.log("User Not Authenticated")
    navigate('/');
  }

  const user = userData.data;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    axios
      .get("http://localhost:5000/chat/", config)
      .then((response) => {
        console.log("Data refresh in sidebar",response.data);
        setConversations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [refresh, userData.token]);

  return (
    <div className="sidebar-container">
      <div className={"sb-header" + (lighttheme ? "" : " dark")}>
        <div>
          <IconButton
            onClick={()=>{
              navigate("/app/welcome");
            }}>
            <FaRegUserCircle className={lighttheme ? "" : " dark"} />

          </IconButton>
        </div>
        <div>
          <IconButton onClick={() => navigate('users')}>
            <AiOutlineUserAdd className={lighttheme ? "" : " dark"} />
          </IconButton>
          <IconButton onClick={() => navigate('creategroups')}>
            <AiOutlineUsergroupAdd className={lighttheme ? "" : " dark"} />
          </IconButton>
          <IconButton>
            <IoMdAddCircleOutline className={lighttheme ? "" : " dark"} />
          </IconButton>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {lighttheme ? (
              <FaRegMoon className={lighttheme ? "" : " dark"} />
            ) : (
              <MdLightMode className={lighttheme ? "" : " dark"} />
            )}
          </IconButton>
        </div>
      </div>
      <div className={"sb-search" + (lighttheme ? "" : " dark")}>
        <IconButton>
          <IoSearchSharp />
        </IconButton>
        <input
          placeholder="search"
          className={"search-box" + (lighttheme ? "" : " dark")}
        />
      </div>
      <div className={"sb-conversations" + (lighttheme ? "" : " dark")}>
        {conversations.map((conversation, index) => (
          <div
            key={index}
            className="conversation-container"
            onClick={() =>
              navigate(`chat/${conversation._id}&${conversation.users[1].name}`)
            }
          >
            <p className={"con-icon" + (lighttheme ? "" : " dark")}>
              {conversation.users[1].name[0]}
            </p>
            <p className={"con-title" + (lighttheme ? "" : " dark")}>
              {conversation.users[1].name}
            </p>
            <p className="con-lastMessage">
              {conversation.latestMessage
                ? conversation.latestMessage.content
                : 'No previous Messages, click here to start a new chat'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
