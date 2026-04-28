import mongoose, { Schema } from "mongoose";

const RepoSchema = new Schema(
  {
    reponame: {
      type: String,
      required: true,
      unique: true,
      trim: true,              
    },

    desc: {
      type: String,
      default: "",             
      trim: true,
    },

    content: [
      {
        type: String,
      },
    ],

    visibility: {
      type: Boolean,
      default: true,           
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
  },
  {
    timestamps: true,          
  }
);

const Repo = mongoose.model("Repo", RepoSchema);

export default Repo;