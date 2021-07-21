const express = require("express");
const leadRouter = express.Router({ mergeParams: true });
const verify = require("./verifyToken");
const Quiz = require("../models/quiz");
const Response = require("../models/response");
const User = require("../models/user");
//Quiz Leaderboard
leadRouter.get("/page/:index", verify, async (req, res) => {
  await Response.find({ quiz: req.params.id })

    .populate("user")
    .populate("quiz")
    .sort({ userRole: -1, score: -1 })
    .collation({ locale: "en_US", numericOrdering: true })
    .exec((err, allResponses) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        var responseCount = 0;
        var responses = [];
        allResponses.forEach(function (response) {
          responses.push(response);
          responseCount++;
        });
        var pages = parseInt(responseCount / 10);
        var add = responseCount % 10;
        if (add > 0) {
          pages++;
        }

        var responseArray = [];
        index = parseInt(req.params.index);
        for (i = index * 10 - 10; i < index * 10; i++) {
          if (responses[i]) {
            responseArray.push(responses[i]);
          } else {
            break;
          }
        }

        res.render("adminUI/leaderboard", {
          allResponses: responseArray,
          next: index + 1,
          prev: index - 1,
          responseCount: responseCount,
          pages: pages,
          quizId: req.params.id,
        });
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
leadRouter.put("/:id", verify, async (req, res) => {
  var newData = {
    reward: req.body.reward,
    paid: true,
  };
  await Response.findByIdAndUpdate(req.params.id, { $set: newData })
    .populate("user")
    .exec(async (err, response) => {
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
              res.redirect("/quiz/" + response.quiz + "/leaderboard/page/1");
            }
          }
        );
      }
    });
});
module.exports = leadRouter;
