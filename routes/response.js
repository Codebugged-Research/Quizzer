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
  var today = new Date().now();
  Response.find({
    user: req.params.id,
    createdAt: {
      $gte: new Date(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate()
        ).setHours(00, 00, 00)
      ),
      $lt: new Date(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate()
        ).setHours(23, 59, 59)
      ),
    },
  })
    .populate("user")
    .populate("quiz")
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
responseRouter.put("/:id", async (req, res) => {
  var newData = {
    reward: req.body.reward,
    paid: true,
  };
  await Response.findByIdAndUpdate(
    req.params.id,
    { $set: newData },
    async (err, response) => {
      if (err) {
        console.log(err);
      } else {
        var rewards = parseInt(req.body.reward, 10);
        var userReward = parseInt(response.user.reward, 10);
        var total = rewards + userReward;
        total = "" + total;
        var newuserData = {
          reward: total,
        };
        await User.findByIdAndUpdate(
          response.user._id,
          { $set: newuserData },
          (err, user) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/quiz/" + response.quiz + "/leaderboard");
            }
          }
        );
      }
    }
  );
});

module.exports = responseRouter;
