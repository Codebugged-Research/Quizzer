const router = require("express").Router();
const verify = require("./verifyToken");
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const User = require("../models/user");
const Subscription = require("../models/subscription");
const Response = require("../models/response");

router.get("/", verify, async (req, res) => {
  await Quiz.find({}, async (err, allQuiz) => {
    if (err) {
      console.log(err);
    } else {
      var quizCount = 0;
      allQuiz.forEach(function (quiz) {
        quizCount++;
      });
      await User.find({})
        .sort({ reward: -1 })
        .collation({ locale: "en_US", numericOrdering: true })
        .exec(async (err, allUsers) => {
          if (err) {
            console.log(err);
          } else {
            var userCount = 0;
            allUsers.forEach(function (user) {
              userCount++;
            });
            await Subscription.find().exec(async (err, allSubs) => {
              if (err) {
                console.log(err);
              } else {
                var subCount = 0;
                allSubs.forEach(function (sub) {
                  subCount++;
                });
                await Response.find().exec((err, allResponses) => {
                  if (err) {
                    console.log(err);
                  } else {
                    var responseCount = 0;
                    allResponses.forEach(function (res) {
                      responseCount++;
                    });
                    res.render("adminUI/index", {
                      allQuiz: allQuiz,
                      allUsers: allUsers,
                      quizCount: quizCount,
                      userCount: userCount,
                      subCount: subCount,
                      responseCount: responseCount,
                    });
                  }
                });
              }
            });
          }
        });
    }
  });
});
module.exports = router;
