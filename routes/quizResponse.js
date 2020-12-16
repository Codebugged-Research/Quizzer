const express = require("express");
const quizResponse = express.Router({ mergeParams: true });
const Response = require("../models/response");
const verify = require("./verifyToken");
quizResponse.get("/", async (req, res) => {
  await Response.find({ quiz: { _id: req.params.id } }, (err, allResponses) => {
    if (err) {
      console.log(err);
    } else {
      res.json(allResponses);
    }
  });
});

module.exports = quizResponse;
