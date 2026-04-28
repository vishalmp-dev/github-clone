import express from "express"
import * as userController from "../controllers/userController.js";

export const userRouter = express.Router();

  // user routes whihc are linked to user controller where main fucnitonaliy is there , this is just a url endpoint to which will invoke/call the fun in controllers

    userRouter.get("/allUsers",userController.getAllUsers);
    userRouter.get("/userProfile/:id",userController.getUserProfile);
    userRouter.post("/signup",userController.signup);
    userRouter.post("/login",userController.login);
    userRouter.put("/updateProfile/:id",userController.updateUserProfile);
    userRouter.delete("/deleteProfile/:id",userController.deleteUserProfile);