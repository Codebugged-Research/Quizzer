//send response from app
const express = require("express");
const responseRouter = express.Router();
const Response = require("../models/response");

responseRouter.post("/submit", async (req, res) => {
  var response = new Response(req.body);
  try {
    await response.save();
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
responseRouter.get("/getByUser/:id", async (req, res) => {
  Response.find({ user: req.params.id })
    .populate("user")
    .populate({
      path: "user",
      populate: {
        path: "subscription",
      },
    })
    .populate("quiz")
    .populate({
      path: "quiz",
      populate: {
        path: "questions",
      },
    })
    .sort({ createdAt: -1 })
    .exec((err, allResponses) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(allResponses);
      }
    });
});
//Get responses by user id and date
responseRouter.get("/UserDate/:id/:date", async (req, res) => {
  Response.find({
    user: req.params.id,
    date: req.params.date,
  })
    .populate("user")
    .populate({
      path: "user",
      populate: {
        path: "subscription",
      },
    })
    .populate("quiz")
    .populate({
      path: "quiz",
      populate: {
        path: "questions",
      },
    })
    .exec((err, responses) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(responses);
      }
    });
});

responseRouter.get("/getByQuiz/:id", async (req, res) => {
  Response.find({ quiz: req.params.id })
    .populate("user")
    .populate({
      path: "user",
      populate: {
        path: "subscription",
      },
    })
    .populate("quiz")
    .populate({
      path: "quiz",
      populate: {
        path: "questions",
      },
    })
    .sort({ userRole: -1, score: -1})
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
