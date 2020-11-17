const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    phone: {
      type: String,
      type: String,
      required: true,
      min: 10,
      max: 10,
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
