import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IndexPage from "./pages/IndexPage";
import ChatRoom from "./pages/ChatRoom";
import io from "socket.io-client";
import makeToast from "./Toaster";
import Login from "./pages/Login";
import VideoCall from "./components/VideoCall";

function App() {
  const [socket, setSocket] = React.useState(null);
  const [isCall, setCall] = React.useState(false);

  const handleCall = (makeCall) => {
    setCall(makeCall);
  }

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected!");
      });

      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
    //eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <VideoCall isCall={isCall} />
      <Switch>
        <Route path="/" component={IndexPage} exact />
        <Route
          path="/login"
          render={() => <Login setupSocket={setupSocket} />}
          exact
        />
        <Route path="/register" component={Register} exact />
        <Route
          path="/dashboard"
          render={() => <Dashboard socket={socket} />}
          exact
        />
        <Route
          path="/chatroom/:id"
          render={() => <ChatRoom socket={socket} handleCall={handleCall} />}
          exact
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
