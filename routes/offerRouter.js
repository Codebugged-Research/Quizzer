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
  var bdate1 = req.body.start.split("-");
  var date1 = bdate1[2] + "/" + bdate1[1] + "/" + bdate1[0];
  var bdate2 = req.body.end.split("-");
  var date2 = bdate2[2] + "/" + bdate2[1] + "/" + bdate2[0];
  const newOffer = {
    name: req.body.name,
    type: "flat",
    description: req.body.description,
    amount: req.body.amount,
    start: date1,
    end: date2,
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
//App routes
offerRouter.get("/app", async (req, res) => {
  await Offer.find().exec((err, allOffers) => {
    if (err) {
      console.log(err);
    } else {
      res.json(allOffers);
    }
  });
});
module.exports = offerRouter;
