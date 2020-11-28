let mongoose = require("mongoose");
let responseSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  quizRef: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    quizDescription: { type: String },
  },
  amount: {
    type: String,
  },
  status: {
    type: String,
  },
});
module.exports = mongoose.model("Reward", responseSchema);
