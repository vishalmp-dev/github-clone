import express from "express"
import * as repoController from "../controllers/repoController.js";

export const repoRouter = express.Router();

 

    repoRouter.post("/repo/create",repoController.createRepo);
    repoRouter.get("/repo/all",repoController.getAllRepo);
    repoRouter.get("/repo/:id",repoController.getRepoById);
    repoRouter.get("/repo/name/:reponame",repoController.getRepoByName);
    repoRouter.get("/repo/user/:userId",repoController.getRepoOfCurrUser);
    repoRouter.put("/repo/update/:id",repoController.updateRepoById);
    repoRouter.patch("/repo/toggle/:id",repoController.toggleVisibilityById);
    repoRouter.delete("/repo/delete/:id",repoController.deleteRepoById);
