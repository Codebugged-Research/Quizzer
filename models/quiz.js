const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
  createdAt: { type: Date, expires: 3600, default: Date.now },
  content: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});
module.exports = mongoose.model("Questions", quizSchema);
