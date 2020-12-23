const router = require("express").Router();
const verify = require("./verifyToken");
const Quiz = require("../models/quiz");
const Question = require("../models/question");
const User = require("../models/user");
const Subscription = require("../models/subscription");
const Response = require("../models/response");

router.get("/", verify, async (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;
  await Quiz.find({}, async (err, quizzes) => {
    if (err) {
      console.log(err);
    } else {
      var quizCount = 0;
      quizzes.forEach(function (quiz) {
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
                await Response.find().exec(async (err, allResponses) => {
                  if (err) {
                    console.log(err);
                  } else {
                    var responseCount = 0;
                    allResponses.forEach(function (res) {
                      responseCount++;
                    });
                    await Quiz.find({ date: today }).exec((err, allQuiz) => {
                      if (err) {
                        console.log(err);
                      } else {
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
    }
  });
});
module.exports = router;
