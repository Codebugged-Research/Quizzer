const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema(
  {
    buyer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: { type: String },
    },
  },
  { timestamps: true }
);
