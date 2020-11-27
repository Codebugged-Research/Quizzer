const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({
  purchasedAt: { type: Date },
  validUpto: { type: Date },
  buyer: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});
