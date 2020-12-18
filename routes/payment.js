const Razorpay = require("razorpay");
const express = require("express");
const paymentrouter = express.Router();
var crypto = require("crypto");
const axios = require("axios");
const qs = require("qs");
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

//for payouts
paymentrouter.post("/payout", async (req, res) => {
  const token = Buffer.from(
    `${process.env.KEY_ID}:${process.env.KEY_SECRET}`,
    "utf8"
  ).toString("base64");
  var config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  };

  var dataString = {
    account_number: "2323230084370605",
    fund_account_id: req.body.fundAccountId,
    amount: req.body.amount,
    currency: "INR",
    mode: "UPI",
    purpose: "payout",
    queue_if_low_balance: true,
    reference_id: `Winner for quiz ${req.body.quizName}`,
    narration: "Quiz Adda winner payout",
  };
  axios
    .post("https://api.razorpay.com/v1/payouts", dataString, config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      res.status(400).send(error);
      console.log(error);
    });
});

//create razorpay contact
paymentrouter.post("/createContact", async (req, res) => {
  const token = Buffer.from(
    `${process.env.KEY_ID}:${process.env.KEY_SECRET}`,
    "utf8"
  ).toString("base64");
  var config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  };

  var dataString = {
    "name":req.body.name,
    "email":req.body.email,
    "contact":req.body.phone,
    "type":"customer",
  };
  axios
    .post('https://api.razorpay.com/v1/contacts', dataString, config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      res.status(400).send(error);
      console.log(error);
    });
});

//for creating fund account
paymentrouter.post("/createFundAcct", async (req, res) => {
  const token = Buffer.from(
    `${process.env.KEY_ID}:${process.env.KEY_SECRET}`,
    "utf8"
  ).toString("base64");
  var config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
  };

  var dataString = {
    "account_type":"vpa",
    "contact_id":req.body.contactId,
    "vpa":{
      "address":req.body.UpiId
    }
  };
  axios
    .post('https://api.razorpay.com/v1/fund_accounts', dataString, config)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      res.status(400).send(error);
      console.log(error);
    });
});
module.exports = paymentrouter;
