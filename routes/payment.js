const Razorpay = require("razorpay");
const express = require("express");
const paymentrouter = express.Router();
var crypto = require("crypto");
var request = require("request");
var headers = {
  "Content-Type": "application/json",
};

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

paymentrouter.post("/payout", (req, res) => {
  var headers = {
    "Content-Type": "application/json",
  };

  var dataString = {
    account_number: process.env.ACCOUNT_NUMBER,
    fund_account_id: req.fundAccountId,
    amount: req.amount,
    currency: "INR",
    mode: "UPI",
    purpose: "payout",
    queue_if_low_balance: true,
    reference_id: `Winner for ${req.body.quizName}`,
    narration: "Quiz Adda winner payout",    
  };

  var options = {
    url: "https://api.razorpay.com/v1/payouts",
    method: "POST",
    headers: headers,
    body: dataString,
    auth: {
      user: process.env.KEY_ID,
      pass: process.env.KEY_SECRET,
    },
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      res.json(body);
    }
  }

  request(options, callback);
});
module.exports = paymentrouter;
