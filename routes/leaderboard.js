const express = require("express");
const leadRouter = express.Router({ mergeParams: true });
const verify = require("./verifyToken");
const Quiz = require("../models/quiz");
const Response = require("../models/response");
const User = require("../models/user");
//Quiz Leaderboard
leadRouter.get("/", async (req, res) => {
  await Response.find({ quiz: req.params.id })
    .populate("user")
    .populate("quiz")
    .sort({ userRole: -1, score: -1, createdAt: 1 })
    .collation({ locale: "en_US", numericOrdering: true })
    .exec((err, allResponses) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.render("adminUI/leaderboard", { allResponses: allResponses });
      }
    });
});
// leadRouter.get("/:responseId/rank", async (req, res) => {
//   await Response.findById(req.params.responseId)
//     .populate("user")
//     .populate("quiz")
//     .exec((err, response) => {
//       if (err) {
//         console.log(err);
//         res.status(400).send(err);
//       } else {
//         var rank = req.params.rank;
//         res.render("adminUI/showResponse", { response: response, rank: rank });
//       }
//     });
// });
leadRouter.put("/:id", async (req, res) => {
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
module.exports = leadRouter;
