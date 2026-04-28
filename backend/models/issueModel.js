import mongoose from "mongoose";
import { Schema } from "mongoose";

const IssueSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  repo: {
    type: Schema.Types.ObjectId,
    ref: "Repo",
    required: true,
  },
});

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;
