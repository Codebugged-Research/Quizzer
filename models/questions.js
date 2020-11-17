const mongoose = require("mongoose");
const questionsSchema = new mongoose.Schema({
  createdAt: { type: Date, expires: 3600, default: Date.now },
});
