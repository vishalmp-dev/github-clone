import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../../Navbar"; // adjust path
const Dashboard = () => {
  
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        const data = await response.json();

        const safeData = Array.isArray(data) ? data : [];
        setRepositories(safeData);
        setSearchResults(safeData);
      } catch (err) {
        console.error("Error fetching repos:", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();

        const safeData = Array.isArray(data) ? data : [];
        setSuggestedRepositories(safeData);
      } catch (err) {
        console.error("Error fetching suggested repos:", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(Array.isArray(repositories) ? repositories : []);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.reponame?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
    < Navbar />
    <section id="dashboard">

      <aside>
        <h3>Suggested Repositories</h3>
        {Array.isArray(suggestedRepositories) &&
          suggestedRepositories.map((repo) => (
            <div key={repo._id}>
              <h4>{repo.reponame}</h4>
              <p>{repo.desc}</p>
            </div>
          ))}
      </aside>

      <main>
        <h2>Your Repositories</h2>

        <div id="search">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {Array.isArray(searchResults) &&
          searchResults.map((repo) => (
            <div key={repo._id}>
              <h4>{repo.reponame}</h4>
              <p>{repo.desc}</p>
            </div>
          ))}
      </main>

      <aside>
        <h3>Upcoming Events</h3>
        <ul>
          <li><p>Tech Conference - Dec 15</p></li>
          <li><p>Developer Meetup - Dec 25</p></li>
          <li><p>React Summit - Jan 5</p></li>
        </ul>
      </aside>

    </section>
    
    </>
  );
};

export default Dashboard;