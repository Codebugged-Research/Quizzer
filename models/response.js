let mongoose = require("mongoose");
let responseSchema = mongoose.Schema(
  {
    correct: { type: String },
    wrong: { type: String },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
    },
    reward: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Response", responseSchema);
