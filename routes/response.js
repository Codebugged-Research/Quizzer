//send response from app
const express = require("express");
const responseRouter = express.Router();
const Response = require("../models/response");

responseRouter.post("/submit", async (req, res) => {
  var response = new Response(req.body);
  try {
    await response.save();
    res.json({ message: "Succesfully Submitted" });
  } catch (error) {
    res.status(400).send(error);
  }
});
responseRouter.get("/getByUser/:id", async (req, res) => {
  Response.find({ user: req.params.id })
    .populate("user")
    .populate("quiz")
    .exec((err, allResponses) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(allResponses);
      }
    });
});
responseRouter.get("/getByQuiz/:id", async (req, res) => {
  Response.find({ quiz: req.params.id })
    .populate("user")
    .populate("quiz")
    .exec((err, allResponses) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(allResponses);
      }
    });
});
module.exports = responseRouter;
