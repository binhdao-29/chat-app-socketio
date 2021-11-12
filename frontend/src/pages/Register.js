import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import makeToast from "../Toaster";
const FormData = require('form-data');

const Register = (props) => {
  const nameRef = React.createRef();
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const imageRef = React.createRef();

  const registerUser = (props) => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const image = imageRef.current.files[0];

    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', image);

    axios
      .post("http://localhost:8000/user/register", formData, config)
      .then((response) => {
        makeToast("success", response.data.message);
        props.history.push("/login");
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
    <div className="register">
      <div className="container">
        <div className="container__overlay">
          <div className="overlay">
            <div className="overlay__panel">
              <Link to="/login">
                <button className='btn'>Login</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="container-register container__form">
          <div className="form">
            <div className="form__title">Register</div>
            <div className="form-input">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                ref={nameRef}
              />
            </div>

            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Your email"
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
            <div className="form-input">
              <label htmlFor="image">Upload avatar</label>
              <input
                type="file"
                name="image"
                id="image"
                ref={imageRef}
              />
            </div>
            <button className="btn" onClick={registerUser}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
