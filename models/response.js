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
  questionRef: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    questionDescription: { type: String },
  },
  reward: { type: String },
});
module.exports = mongoose.model("Response", responseSchema);
