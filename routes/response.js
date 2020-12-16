//send response from app

const express = require("express");
const responseRouter = express.Router({ mergeParams: true });
const Response = require("../models/response");
const verify = require("./verifyToken");

responseRouter.post("/submit", async (req, res) => {
  var response = new Response(req.body);
  try {
    await response.save();
    res.json({ message: "Succesfully Submitted" });
  } catch (error) {
    res.status(400).send(error);
  }
});
userResponse.get("/getByUser/:id", async (req, res) => {
  await Response.find({ user: req.params.id }, (err, allResponses) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(allResponses);
    }
  });
});
userResponse.get("/getByQuiz/:id", async (req, res) => {
  await Response.find({ quiz: req.params.id }, (err, allResponses) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(allResponses);
    }
  });
});
module.exports = responseRouter;
