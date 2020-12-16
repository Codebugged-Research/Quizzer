const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    validTill: {
      type: Date,
    },
    validFrom: {
      type: Date,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Subscription", subscriptionSchema);
