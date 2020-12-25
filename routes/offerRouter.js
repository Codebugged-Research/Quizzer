const express = require("express");
const offerRouter = express.Router();
const verify = require("./verifyToken");
const Offer = require("../models/offer");
offerRouter.get("/", async (req, res) => {
  await Offer.find().exec((err, allOffers) => {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/allOffers", { allOffers: allOffers });
    }
  });
});
offerRouter.get("/add", async (req, res) => {
  res.render("adminUI/createOffer");
});
offerRouter.post("/", async (req, res) => {
  const newOffer = {
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    amount: req.body.amount,
    percentage: req.body.percentage,
    start: req.body.start,
    end: req.body.end,
  };
  await Offer.create(newOffer, async (err, offer) => {
    if (err) {
      console.log(err);
    } else {
      await offer.save();
      res.redirect("/offer");
    }
  });
});
module.exports = offerRouter;
