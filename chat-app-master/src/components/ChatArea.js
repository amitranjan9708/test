import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./Message_Others";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
const socket = io(ENDPOINT);

function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);

  // Function to send a message
  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    axios
      .post(
        "http://localhost:5000/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ data }) => {
        console.log(`Message sent by ${userData.name}: ${data.content}`);
        socket.emit("new message", data); // Emit the new message to the socket server
        setMessageContent(""); // Clear input field after sending
        setAllMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Connect to socket.io
  useEffect(() => {
    socket.emit("setup", userData);
    socket.on("connected", () => {
      console.log("Socket connected");
    });

    socket.emit("join chat", chat_id);

    socket.on("message received", (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    });

    return () => {
      socket.off("connected");
      socket.off("message received");
    };
  }, [chat_id, userData]);

  // Fetch messages on initial load and when refresh or chat_id changes
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    axios
      .get(`http://localhost:5000/message/${chat_id}`, config)
      .then(({ data }) => {
        console.log("Fetched messages: ", data);
        setAllMessages(data);
        setLoaded(true);
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [refresh, chat_id, userData.token]);

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  }

  return (
    <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
      <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
        <p className={"con-icon" + (lightTheme ? "" : " dark")}>
          {chat_user[0]}
        </p>
        <div className={"header-text" + (lightTheme ? "" : " dark")}>
          <p className={"con-title" + (lightTheme ? "" : " dark")}>{chat_user}</p>
        </div>
        <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
          <DeleteIcon />
        </IconButton>
      </div>
      <div className={"messages-container" + (lightTheme ? "" : " dark")}>
        {allMessages.map((message, index) => {
          const sender = message.sender;
          const self_id = userData._id;
          if (sender._id === self_id) {
            return <MessageSelf key={index} props={message} />;
          } else {
            return <MessageOthers key={index} props={message} />;
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
        <input
          placeholder="Type a Message"
          className={"search-box" + (lightTheme ? "" : " dark")}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              sendMessage();
            }
          }}
        />
        <IconButton
          className={"icon" + (lightTheme ? "" : " dark")}
          onClick={sendMessage}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatArea;
