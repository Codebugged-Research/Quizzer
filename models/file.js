const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema(
  { name: { type: String }, fileURL: { type: String } },
  { timestamps: true }
);
module.exports = mongoose.model("File", fileSchema);
