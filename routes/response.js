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
responseRouter.get("/UserDate/:id", async (req, res) => {
  var today = new Date();
  Response.find({
    user: req.params.id,
    createdAt: {
      $gte: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        5,
        30,
        0
      ),
      $lte: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        today.getMinutes(),
        today.getSeconds()
      ),
    },
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
    .sort({ userRole: -1, score: -1, createdAt: 1 })
    .exec((err, allResponses) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(allResponses);
      }
    });
});
//After payment update response
// responseRouter.put("/:id", async (req, res) => {
//   var newData = {
//     reward: req.body.reward,
//     paid: true,
//   };
//   await Response.findByIdAndUpdate(
//     req.params.id,
//     { $set: newData },
//     function (err, response) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.redirect("/quiz/" + response.quiz + "/leaderboard");
//       }
//     }
//   );
// });

module.exports = responseRouter;
