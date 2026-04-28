import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./userprofile.css";
import Navbar from "../../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import { useAuth } from "../../authContext";
import HeatMap from "./HeatMap";

const UserProfile = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [userDetails, setUserDetails] = useState({ username: "username" });

  // 🔥 FAKE REALISTIC DATA
  const [fakeData, setFakeData] = useState({
    followers: 0,
    following: 0,
    commits: 0,
    repos: [],
  });

  const generateFakeData = () => {
    const repoNames = [
      "ScanIt",
      "Portfolio",
      "AI-Chat-App",
      "GymTracker",
      "WeatherApp",
      "DSA-Practice",
    ];

    const shuffled = [...repoNames].sort(() => 0.5 - Math.random());

    return {
      followers: Math.floor(Math.random() * 200) + 20,
      following: Math.floor(Math.random() * 100) + 10,
      commits: Math.floor(Math.random() * 500) + 50,
      repos: shuffled.slice(0, 4).map((name) => ({
        name,
        description: "Built with React & Node.js",
      })),
    };
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3002/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };

    fetchUserDetails();

    // 🔥 generate fake data once
    setFakeData(generateFakeData());
  }, []);

  return (
    <div className="profile-container">
      <Navbar />

      {/* Navigation */}
      <div className="nav-wrapper">
        <UnderlineNav aria-label="Repository">
          <UnderlineNav.Item aria-current="page" icon={BookIcon}>
            Overview
          </UnderlineNav.Item>
          <UnderlineNav.Item onClick={() => navigate("/repo")} icon={RepoIcon}>
            Repositories
          </UnderlineNav.Item>
        </UnderlineNav>
      </div>

      {/* Layout */}
      <main className="profile-page-wrapper">
        
        {/* LEFT */}
        <aside className="user-profile-section">
          <div className="profile-image-container">
            <div className="profile-image"></div>
          </div>

          <div className="user-info">
            <h1 className="username">{userDetails.username}</h1>
            <span className="user-handle">{userDetails.username}</span>
          </div>

          <button className="follow-btn">Edit profile</button>

          {/* 🔥 REAL LOOKING DATA */}
          <div className="follower-stats">
            <p><strong>{fakeData.followers}</strong> followers</p>
            <span>•</span>
            <p><strong>{fakeData.following}</strong> following</p>
          </div>
        </aside>

        {/* RIGHT */}
        <section className="profile-content">

          {/* Heatmap */}
          <div className="heatmap-card">
            <HeatMap />
          </div>

          {/* Stats */}
          <div className="stats-card">
            <h3>Contribution Stats</h3>
            <div className="stats-grid">
              <div>
                <strong>{fakeData.commits}</strong>
                <span>Commits</span>
              </div>
              <div>
                <strong>{fakeData.repos.length}</strong>
                <span>Repositories</span>
              </div>
              <div>
                <strong>{fakeData.followers}</strong>
                <span>Followers</span>
              </div>
            </div>
          </div>

          {/* Repositories */}
          <div className="repo-section">
            <h3>Top Repositories</h3>

            {fakeData.repos.map((repo, index) => (
              <div key={index} className="repo-card">
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))}
          </div>

        </section>
      </main>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
        className="logout-btn"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;