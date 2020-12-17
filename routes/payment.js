const Razorpay = require("razorpay");
const express = require("express");
const paymentrouter = express.Router();
var crypto = require("crypto");
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
paymentrouter.post("/orderIdGen", (req, res) => {
  var options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: "quizaddsubscription",
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.json(order);
  });
});
paymentrouter.post("/check", (req, res) => {
  body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  var expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  var response = { status: "failure" };
  if (expectedSignature === req.body.razorpay_signature)
    response = { status: "success" };
  res.send(response);
});
module.exports = paymentrouter;
