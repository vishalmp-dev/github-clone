import mongoose from "mongoose";
import Repo from "../models/repoModel.js";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";

// create new repository

export const createRepo = async (req, res) => {
  const { owner, reponame, issues, content, desc, visibility } = req.body;

  try {
    if (!reponame) {
      return res.status(400).json({ error: "Repository name is required!" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res
        .status(400)
        .json({ error: "Invalid User Id, User not found..." });
    }

    const newRepo = new Repo({
      reponame,
      desc,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepo.save();

    res.status(201).json({
      message: "Repository created successfully!",
      repoID: result._id,
    });
  } catch (e) {
    console.error("error during repository creation..", e);
    res.status(500).send("OOPS! Server Error");
  }
};

// fetch all repositories

export const getAllRepo = async (req, res) => {
  try {
    const repos = await Repo.find({}).populate("owner").populate("issues");
    res.json(repos);
  } catch (e) {
    console.error("error during fetching repositories..", e);
    res.status(500).send("OOPS! Server Error");
  }
};

// fetch a single repo by id

export const getRepoById = async (req, res) => {
  const repoID = req.params.id;
  try {
    const repo = await Repo.find({ _id: repoID })
      .populate("owner")
      .populate("issues");
    res.json(repo);
  } catch (e) {
    console.error("error during fetching repository of xyz id..", e);
    res.status(500).send("OOPS! Server Error");
  }
};

export const getRepoByName = async (req, res) => {
  const { reponame } = req.params;

  try {
    const repo = await Repo.findOne({ reponame })
      .populate("owner")
      .populate("issues");

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json(repo);
  } catch (e) {
    console.error("error during fetching:", e);
    res.status(500).json({ error: "Server Error" });
  }
};

// fetch user specific repositories

export const getRepoOfCurrUser = async (req, res) => {
  const { userId } = req.params; // ✅ FIXED

  try {
    const repos = await Repo.find({ owner: userId });

    if (!repos || repos.length === 0) {
      return res.status(404).json({ message: "User Repository is not found" });
    }

    res.json(repos); // ✅ FIXED (return array)
  } catch (e) {
    console.error("error during fetching user repositories:", e);
    res.status(500).json({ error: "Server Error" });
  }
};

export const updateRepoById = async (req, res) => {
  const { id } = req.params;
  const { content, desc } = req.body;

  try {
    const repo = await Repo.findById(id); // ✅ FIXED

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (content) repo.content.push(content);
    if (desc) repo.desc = desc;

    const updatedRepo = await repo.save(); // ✅ FIXED

    res.json({
      message: "Repository updated successfully",
      repo: updatedRepo, // ✅ FIXED
    });
  } catch (e) {
    console.error("error during updating repository:", e);
    res.status(500).json({ error: "Server Error" });
  }
};

export const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;

  try {
    const repo = await Repo.findById(id); // ✅ FIXED

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repo.visibility = !repo.visibility;

    const updatedRepo = await repo.save(); // ✅ FIXED

    res.json({
      message: "Repository Visibility toggled successfully!",
      repo: updatedRepo, // ✅ FIXED
    });
  } catch (e) {
    console.error("error during toggling repository:", e);
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteRepoById = async (req, res) => {
  const { id } = req.params;

  try {
    const repo = await Repo.findByIdAndDelete(id); // ✅ FIXED

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json({
      message: "Repository deleted successfully",
    });
  } catch (e) {
    console.error("error during deleting repository:", e);
    res.status(500).json({ error: "Server Error" });
  }
};