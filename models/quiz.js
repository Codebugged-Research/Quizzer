const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
  name: { type: String },
  createdAt: { type: Date, expires: 3600, default: Date.now },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  slot: { type: String },
  correct_score: { type: String, default: 1 },
  incorrect_score: { type: String, default: -1 },
  reward: { type: String },
});
module.exports = mongoose.model("Quiz", quizSchema);
