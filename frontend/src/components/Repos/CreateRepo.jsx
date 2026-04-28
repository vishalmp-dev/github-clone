import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateRepo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reponame: "",
    desc: "",
    visibility: true,
    content: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const owner = localStorage.getItem("userId");

    try {
      await axios.post("http://localhost:3000/repo/create", {
        owner,
        reponame: formData.reponame,
        desc: formData.desc,
        visibility: formData.visibility,
        content: formData.content ? [formData.content] : [],
        issues: [],
      });

      navigate("/repo");
    } catch (err) {
      console.error("Error creating repo:", err);
    }
  };

  return (
    <div style={{ padding: "24px", color: "white", background: "#0d1117", minHeight: "100vh" }}>
      <h2>Create Repository</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px", maxWidth: "500px", marginTop: "20px" }}>
        <input
          type="text"
          name="reponame"
          placeholder="Repository name"
          value={formData.reponame}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "6px" }}
        />

        <textarea
          name="desc"
          placeholder="Description"
          value={formData.desc}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "6px", minHeight: "100px" }}
        />

        <textarea
          name="content"
          placeholder="Initial content"
          value={formData.content}
          onChange={handleChange}
          style={{ padding: "10px", borderRadius: "6px", minHeight: "120px" }}
        />

        <label>
          <input
            type="checkbox"
            name="visibility"
            checked={formData.visibility}
            onChange={handleChange}
          />
          {" "}Public repository
        </label>

        <button type="submit" style={{ padding: "10px", borderRadius: "6px" }}>
          Create Repo
        </button>
      </form>
    </div>
  );
};

export default CreateRepo;