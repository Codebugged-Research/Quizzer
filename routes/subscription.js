const express = require("express");
const subscriptionRouter = express.Router();
const Subscription = require("../models/subscription");
const redeem = require("./redeemOffer");
const User = require("../models/user");

//Create Subscription
subscriptionRouter.post("/create", redeem, async (req, res) => {
  const subscription = new Subscription(req.body);
  await subscription.save((err, subscription) => {
    if (err) {
      res.status(400).json({
        error: "Not able to create Subscription in DB",
      });
    } else {
      return res.json(subscription);
    }
  });
});

//Get Subscription by User id
subscriptionRouter.post("/user", async (req, res) => {
  await Subscription.find({ user: req.body.userId })
    .populate("user")
    .exec((err, subscription) => {
      if (err) {
        res.status(400).json({
          error: "Unable to GET User Subscription from DB",
        });
      }
      res.json(subscription);
    });
});

//Get Subscription by id
subscriptionRouter.get("/:id", async (req, res) => {
  await Subscription.findById(req.params.id).exec((err, subscription) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.json(subscription);
    }
  });
});

//Update Subscription
subscriptionRouter.put("/:id", async (req, res) => {
  await Subscription.findByIdAndUpdate(
    req.params.subscriptionId,
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, updatedSubs) => {
      if (err) {
        res.status(400).json({
          error: "Unable to UPDATE subscription from DB",
        });
      }
      res.json(updatedSubs);
    }
  );
});
module.exports = subscriptionRouter;
