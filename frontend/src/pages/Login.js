import React from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import makeToast from "../Toaster";

const Login = (props) => {
  const emailRef = React.createRef();
  const passwordRef = React.createRef();

  const loginUser = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    axios
      .post("http://localhost:8000/user/login", {
        email,
        password,
      })
      .then((response) => {
        makeToast("success", response.data.message);
        localStorage.setItem("CC_Token", response.data.token);
        props.history.push("/dashboard");
        props.setupSocket();
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  return (
    <div className="login">
      <div className="container">
        <div className="container-login container__form">
          <div className="form">
            <div className="form__title">Login</div>
            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="abc@example.com"
                ref={emailRef}
              />
            </div>

            <div className="form-input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Your Password"
                ref={passwordRef}
              />
            </div>
            <button className="btn" onClick={loginUser}>Login</button>
          </div>
        </div>
        <div className="container__overlay">
          <div className="overlay">
            <div className="overlay__panel">
              <Link to="/register">
                <button className="btn" id="signIn">Register</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
