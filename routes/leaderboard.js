const express = require("express");
const leadRouter = express.Router({ mergeParams: true });
const verify = require("./verifyToken");
const Quiz = require("../models/quiz");
const Response = require("../models/response");
//Quiz Leaderboard
leadRouter.get("/", async (req, res) => {
  await Response.find({ quiz: req.params.id })
    .populate("user")
    .populate("quiz")
    .sort({ score: -1 })
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
module.exports = leadRouter;
