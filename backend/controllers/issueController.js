import mongoose from "mongoose";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";
import Repo from "../models/repoModel.js";


//create an issue

async function createIssue(req, res) {
  const { title, desc } = req.body;
  const { id } = req.params;

  try {
    const issue = new Issue({
      title,
      description,
      repo: id,
    });

    await issue.save();

    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during issue creation : ", err.message);
    res.status(500).send("Server error");
  }
}

//update an issue by its id

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, desc, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    issue.title = title;
    issue.desc = desc;
    issue.status = status;

    await issue.save();

    res.json(issue, { message: "Issue updated" });

  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

//delete an issue by its id


async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).send("Server error");
  }
}

//fetch all the issues


async function getAllIssues(req, res) {
  const { id } = req.params;

  try {
    const issues = Issue.find({ repo: id });

    if (!issues) {
      return res.status(404).json({ error: "Issues not found!" });
    }
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

//fetch an issue by its id


async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
    
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

export {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
