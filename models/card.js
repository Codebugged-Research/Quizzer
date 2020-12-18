const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema(
  {
    imageURL: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Card", cardSchema);
