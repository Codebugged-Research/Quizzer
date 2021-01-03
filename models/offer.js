const mongoose = require("mongoose");
const offerSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    type: { type: String },
    percentage: { type: String },
    amount: { type: String },
    start: { type: String },
    end: { type: String },
    redeems: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Offer", offerSchema);
