import Axios from "axios";
import React from "react";
import { withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ChatRoom = ({ match, socket, history, handleCall }) => {
  const chatroomId = match.params.id;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");

  const makeVideoCall = () => handleCall(true);

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };

  const handleLogout = () => {
    history.push("/dashboard");
  }

  React.useEffect(() => {
    Axios.get(`http://localhost:8000/message/${chatroomId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
      },
    }).then((res) => setMessages(res.data));
  }, [chatroomId]);

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  React.useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
    //eslint-disable-next-line
  }, []);

  const decoded = jwt_decode(localStorage.getItem("CC_Token"));
  console.log("decoded", decoded.id)

  return (
    <div className="chatroom">
      <div className="chatroom-container">
        <div className="menu-bar">
          <button className="btn-call">
            <ion-icon name="call"></ion-icon>
          </button>
          <button className="btn-videocam" onClick={makeVideoCall}>
            <ion-icon name="videocam"></ion-icon>
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <ion-icon name="log-out-outline"></ion-icon>
          </button>
        </div>
        <div className="conversation">
          {messages.map((message, i) => (
            <div key={i} className={`message-block ${userId === message.user ? 'message-block--sent' : 'message-block--received'}`}>
              <div className="user-name">
                <img src={`/images/${message.userAvatar}`} alt="" />
              </div>
              <div className="message" >
                {message.message}
              </div>
            </div>
          ))}
        </div>
        <div className="text-bar">
          <div className="text-bar__field">
            <input
              type="text"
              name="message"
              placeholder="Message..."
              ref={messageRef}
            />
          </div>
          <div className="text-bar__thumb">
            <button className="thumb" onClick={sendMessage}>
              <ion-icon name="send"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChatRoom);
