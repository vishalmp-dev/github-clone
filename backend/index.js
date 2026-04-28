import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http"
import {Server} from "socket.io";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initRepo } from "./controllers/init.js";
import { addRepo } from "./controllers/add.js";
import {commitRepo} from "./controllers/commit.js"
import {pushRepo} from "./controllers/push.js"
import {pullRepo} from "./controllers/pull.js"
import {revertRepo} from "./controllers/revert.js"

import {mainRouter} from "./routes/main.router.js"

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Starts a new Server", {}, startServer)
  .command("init", "Initialize a new repository", {}, initRepo)
  .command("add <file>", "Add a file to a repository", (yargs)=>{yargs.positional("file",{
    describe: "File to add in the staging area",
    type:"string",
  })}, (argv)=>{
    addRepo(argv.file);
  })
  .command("commit <message>", "commit the staged files to repository",  (yargs)=>{yargs.positional("message",{
    describe: "commit message",
    type:"string",
  })}, (argv)=>{
    commitRepo(argv.message);
  })
  .command("push", "push the change to repository(S3)", {}, pushRepo)
  .command("pull", "pull changes from the repository(S3)", {}, pullRepo)
  .command("revert <commitID", "revert change to a specific commit", (yargs)=>{yargs.positional("commitID",{
    describe: "commit ID to revert to:",
    type:"string",
  })},
   (argv)=>{
    revertRepo(argv.commitID);
  })  

  .demandCommand(1, "you need atleast one command!")
  .help().argv;


  // backend server code

  function startServer(){

    const app = express();
    const port = process.env.PORT || 3000;


    app.use(bodyParser.json());
    app.use(express.json());

    // mongodb connection logic

    const mongoURI = process.env.MONGO_URI;

    mongoose.connect(mongoURI)
    .then(()=>{
      console.log("MongoDB connected Successfully!")
    }).catch((err) =>{
      console.log("Error connecting to MongoDB..",err);
    })

    app.use(cors({origin:"*"}));

    //home route
    app.use("/",mainRouter);
  

 


    let user ="test";

    const httpServer = http.createServer(app);
    const io = new Server(httpServer,{
      cors:{
        origin:"*",
        methods:["GET","POST"]
      }
    }
    );

    io.on("connection", (socket)=>{
      socket.on("joinRoom",(userID)=>{
        user = userID;
        console.log("====");
        console.log(user);
        console.log("====");
        socket.join(userID);        
      })
    })

    const db = mongoose.connection;

    db.once("open",async()=>{
      console.log("CRUD operations called");
      //CRUD operations
    });

    httpServer.listen(port,()=>{
      console.log("server is running on PORT",port);
    });
  }