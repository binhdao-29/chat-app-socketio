import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import makeToast from "../Toaster";

const Dashboard = (props) => {
  const [rooms, setRooms] = React.useState([]);
  const [chatroomName, setChatroomName] = React.useState("");

  const getRooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setRooms(response.data);
      })
      .catch((err) => {
        setTimeout(getRooms, 3000);
      });
  };

  const addNewChatroom = () => {
    axios
      .post(
        "http://localhost:8000/chatroom",
        { name: chatroomName },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        }
      )
      .then((res) => {
        setChatroomName("");
        getRooms();
      })
      .catch((err) => {
        makeToast("error", err.response);
      });
  };

  React.useEffect(() => {
    getRooms();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-wrap">
        <div className="form__title">Chat room</div>
        <div className="form-input">
          <label htmlFor="chatroomName">Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            value={chatroomName}
            placeholder="Your Chatroom name"
            onChange={(e) => setChatroomName(e.target.value)}
          />
        </div>

        <button className="btn" onClick={addNewChatroom}>Create Chatroom</button>
        <div className="room-list">
          {rooms.map((chatroom) => (
            <div key={chatroom._id} className="room">
              <div className="room-name"># {chatroom.name}</div>
              <Link to={"/chatroom/" + chatroom._id}>
                <div className="join-room">
                  <span>Join</span>
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
