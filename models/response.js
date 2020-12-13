let mongoose = require("mongoose");
let responseSchema = mongoose.Schema(
  {
    responses: [{ type: String }],
    correct: String,
    wrong: String,
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
    },
    quiz: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
      questionDescription: { type: String },
    },
    reward: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Response", responseSchema);
