const express = require("express");
const quizRouter = express.Router();
const verify = require("./verifyToken");
let Quiz = require("../models/quiz");
let Question = require("../models/question");
let Response = require("../models/response");
var admin = require("firebase-admin");

quizRouter.get("/page/:index", verify, async (req, res) => {
  var i;
  await Quiz.find()
    .sort({ createdAt: -1 })
    .exec((err, allQuizzes) => {
      if (err) {
        console.log(err);
      } else {
        var quizCount = 0;
        var quizzes = [];
        allQuizzes.forEach(function (quiz) {
          quizzes.push(quiz);
          quizCount++;
        });
        var pages = parseInt(quizCount / 10);
        var add = quizCount % 10;
        if (add > 0) {
          pages++;
        }

        var quizArray = [];
        index = parseInt(req.params.index);
        for (i = index * 10 - 10; i < index * 10; i++) {
          if (quizzes[i]) {
            quizArray.push(quizzes[i]);
          } else {
            break;
          }
        }

        res.render("adminUI/allQuiz", {
          allQuiz: quizArray,
          next: index + 1,
          prev: index - 1,
          quizCount: quizCount,
          pages: pages,
        });
      }
    });
});
//Add Quiz
quizRouter.get("/add", verify, (req, res) => {
  res.render("adminUI/create-quiz");
});

quizRouter.get("/:id", verify, async (req, res) => {
  await Quiz.findById(req.params.id)
    .populate("questions")
    .exec(function (err, quiz) {
      if (err) {
        console.log(err);
      } else {
        res.render("adminUI/quizInfo", { quiz: quiz });
      }
    });
});
quizRouter.post("/", verify, async (req, res) => {
  var bodyDate = req.body.date.split("-");
  var today = bodyDate[2] + "/" + bodyDate[1] + "/" + bodyDate[0];
  var start = new Date(parseInt(bodyDate[0]), parseInt(bodyDate[1]) - 1, parseInt(bodyDate[2]), parseInt(req.body.start.split(":")[0]), parseInt(req.body.start.split(":")[1]));
  const newQuiz = new Quiz({
    name: req.body.name,
    description: req.body.description,
    slot: req.body.slot,
    reward: req.body.reward,
    correct_score: req.body.correct_score,
    incorrect_score: req.body.incorrect_score,
    checkTime: start,
    date: today,
    startTime: req.body.start,
    endTime: req.body.end,
    minutes: req.body.minutes,
    seconds: req.body.seconds,
  });
  // var payload = {
  //   notification: {
  //     title: "New Quiz Update !",
  //     body: `New quiz "${req.body.name}" has been added.`,
  //   },
  // };
  // var topic = "quiz";
  // admin
  //   .messaging()
  //   .sendToTopic(topic, payload)
  //   .then(function (response) {
  //     console.log("true");
  //   })
  //   .catch(function (error) {
  //     console.log("false");
  //   });

  try {
    await newQuiz.save();
    res.redirect("/quiz/page/1");
  } catch (err) {
    res.status(400).send(err);
  }
});
//Get all quiz by date
quizRouter.post("/date", async (req, res) => {
  var bodyDate = req.body.date.split("-");
  var date = bodyDate[2] + "/" + bodyDate[1] + "/" + bodyDate[0];
  await Quiz.find({ date: date }).exec(function (err, allQuiz) {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/quizbyDate", { allQuiz: allQuiz });
    }
  });
});
//Edit Quiz
quizRouter.get("/:id/edit", verify, async (req, res) => {
  await Quiz.findById(req.params.id, (err, foundQuiz) => {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/editQuiz", { quiz: foundQuiz });
    }
  });
});

quizRouter.put("/:id", verify, async (req, res) => {
  var bodyDate = req.body.date.split("-");
  var today = bodyDate[2] + "/" + bodyDate[1] + "/" + bodyDate[0];
  var newData = {
    name: req.body.name,
    description: req.body.description,
    slot: req.body.slot,
    reward: req.body.reward,
    correct_score: req.body.correct_score,
    incorrect_score: req.body.incorrect_score,
    date: today,
    startTime: req.body.start,
    endTime: req.body.end,
    minutes: req.body.minutes,
    seconds: req.body.seconds,
  };
  await Quiz.findByIdAndUpdate(
    req.params.id,
    { $set: newData },
    function (err, quiz) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/quiz/" + quiz._id);
      }
    }
  );
});

//Delete Quiz
quizRouter.delete("/:id", verify, async (req, res) => {

  await Quiz.findByIdAndRemove(req.params.id, async function (err) {
    if (err) {
      console.log(err);
    } else {
      try {
        await Response.deleteMany({ "quiz": req.params.id }, function (err) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/quiz/page/1");
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
});

//App Quiz Route
quizRouter.get("/app/quiz", async (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;
  await Quiz.find({ date: today })
    .populate("questions")
    .exec(function (err, allQuiz) {
      if (err) {
        console.log(err);
      } else {
        res.json(allQuiz);
      }
    });
});

module.exports = quizRouter;
