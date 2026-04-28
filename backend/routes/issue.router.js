import express from "express"
import * as issueController from "../controllers/issueController.js";

export const issueRouter = express.Router();


 issueRouter.post("/issue/create",issueController.createIssue);
    issueRouter.put("/issue/update/:id",issueController.updateIssueById);
    issueRouter.delete("/issue/delete/:id",issueController.deleteIssueById);
    issueRouter.get("/issue/all",issueController.getAllIssues);
    issueRouter.delete("/issue/:id",issueController.getIssueById);

