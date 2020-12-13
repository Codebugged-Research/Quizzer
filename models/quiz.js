const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    name: { type: String },
    date: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    slot: { type: String },
    correct_score: { type: String, default: 1 },
    incorrect_score: { type: String, default: -1 },
    reward: { type: String },
    responses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Response" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Quiz", quizSchema);
