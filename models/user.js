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
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    username: {
      type: String,
    },
    dob: {
      type: Date,
    },
    interests: [{ type: String }],
    role: {
      type: Number,
      default: 1,
    },
    sub: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
