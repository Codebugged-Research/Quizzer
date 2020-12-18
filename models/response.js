let mongoose = require("mongoose");
let responseSchema = mongoose.Schema(
  {
    correct: { type: String },
    wrong: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    reward: { type: String },
    score: { type: String },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Response", responseSchema);
