const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    validity : {
      type: String,
      default: "0",
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Subscription", subscriptionSchema);
