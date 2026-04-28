import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Link } from "react-router-dom";

import "./auth.css";
import logo from "../../../public/assets/logo.svg";

const Signup = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/signup", {
        email,
        password,
        username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser("loggedIn");

      window.location.href = "/";
    } catch (err) {
      console.log(err.response?.data);
alert(err.response?.data || "Signup Failed!");
      setLoading(false);
    }
  };

  return (

    <div className="gh-container">

      <img src={logo} alt="logo" className="gh-logo" />

      <h2 className="gh-title">Create your account</h2>

      <form className="gh-box" onSubmit={handleSignup}>

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="gh-btn">
          {loading ? "Creating..." : "Sign up"}
        </button>

      </form>

      <div className="gh-footer">
        Already have an account? <Link to="/auth">Login</Link>
      </div>

    </div>
  );
};

export default Signup;