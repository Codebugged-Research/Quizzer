const express = require("express");
const userResponse = express.Router({ mergeParams: true });
const Response = require("../models/response");
const verify = require("./verifyToken");
userResponse.get("/", async (req, res) => {
  await Response.find({ user: { _id: req.params.id } }, (err, allResponses) => {
    if (err) {
      console.log(err);
    } else {
      res.json(allResponses);
    }
  });
});

module.exports = userResponse;
