const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 6,
      max: 255,
    },
    phone: {
      type: String,
      min: 10,
      max: 10,
    },
    email: {
      type: String,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      max: 1024,
      min: 6,
    },
    username: {
      type: String,
    },
    dob: {
      type: Date,
    },
    interests: { type: Array },
    exams: { type: Array },
    role: {
      type: String,
      default: "1",
    },
    photoUrl: {
      type: String,
      default: "https://quizaddabox.ams3.digitaloceanspaces.com/dummy.png",
    },
    upiId: {
      type: String,
    },
    contactId: {
      type: String,
    },    
    deviceToken: {
      type: String,
    },
    fundAccount: {
      type: String,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    reward: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
