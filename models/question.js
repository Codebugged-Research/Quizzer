const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
  description: { type: String },
  options: [{ type: String }],
  answer: { type: String },
});
module.exports = mongoose.model("Question", questionSchema);
