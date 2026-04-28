import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import {ObjectId} from "mongodb";

dotenv.config();

const uri = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET_KEY;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
  }
  await client.connect();
}

// user sign up
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await connectClient();
    const db = client.db();
    const userCollection = db.collection("users");

    const existingUser = await userCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json("User already exists..");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await userCollection.insertOne(newUser);

    const token = jwt.sign({ id: result.insertedId }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token,userId:result.insertedId  });
  } catch (e) {
    console.error("Signup Failed:", e.message);
    res.status(500).send("OOPS! Server Error");
  }
};

// user login

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("github-Clone");
    const userCollection = db.collection("users");

    const existingUser = await userCollection.findOne({ email });
    if (!existingUser) {
      return res.status(400).json("Invalid Credentials..");
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json("Invalid Credentials..");
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: existingUser._id });
  } catch (e) {
    console.error("Login Failed:", e.message);
    res.status(500).send("OOPS! Server Error");
  }
};

//fetch all the users 

export const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("github-Clone");
    const userCollection = db.collection("users");

    const users = await userCollection.find({}).toArray();
    res.send(users);
  } catch (e) {
    console.log("error during fetching..", e);
    res.status(500).send("OOPS! Server Error");
  }
};

//fetch a single user

export const getUserProfile = async (req, res) => {
  const currID = req.params.id;

  try {
    await connectClient();
    const db = client.db("github-Clone");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({
      _id: new ObjectId(currID)
     
    });
     if (!user) {
      return res.status(404).json("User not found..");
    }
  res.json(user);


  } catch (e) {
    console.error("error during fetching..", e);
    if (!res.headersSent){
    res.status(500).send("OOPS! Server Error");
    }
  }

};


// update a single user
export const updateUserProfile = async (req, res) => {
  const currID = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("github-Clone");
    const userCollection = db.collection("users");
    
    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      updateFields.password = hashedPass;
    }

    const updatedUser = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(currID) },
      { $set: updateFields },
      { returnDocument: "after" } 
    );

   
    if (!updatedUser) {
      return res.status(404).json("User not found..");
    }

    res.json(updatedUser); 
  } catch (e) {
    console.error("error during updating..", e);
    res.status(500).send("OOPS! Server Error");
  }
};



// delete a single user

export const deleteUserProfile = async (req, res) => {
  const currID = req.params.id;

  try{
      await connectClient();
    const db = client.db("github-Clone");
    const userCollection = db.collection("users");

    const result = await userCollection.deleteOne({
       _id: new ObjectId(currID),
    });

     if(result.deleteCount == 0){
      return res.status(404).json("User not found..");
    }
    res.json({message:"User Profile Deleted"})
  }catch (e) {
    console.error("error during deleting..", e);
    res.status(500).send("OOPS! Server Error");
  }
};
