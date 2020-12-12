const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema(
  {
    description: { type: String },
    options: [{ type: String }],
    answer: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Question", questionSchema);
