const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
  name: { type: String },
  createdAt: { type: Date, expires: 3600, default: Date.now },
  content: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  slot: { type: String },
});
module.exports = mongoose.model("Questions", quizSchema);
