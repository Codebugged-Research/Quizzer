const express = require("express");
const quizRouter = express.Router();
const verify = require("./verifyToken");
let Quiz = require("../models/quiz");
let Question = require("../models/question");
let Response = require("../models/response");

//All Quiz list
// quizRouter.get("/", async (req, res) => {
//   await Quiz.find({}, (err, allQuiz) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("adminUI/allQuiz", {
//         allQuiz: allQuiz,
//       });
//     }
//   });
// });
//Pagination Quiz List
quizRouter.get("/page/:index", async (req, res) => {
  var i, j;
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
        });
      }
    });
});
//Add Quiz
quizRouter.get("/add", (req, res) => {
  res.render("adminUI/create-quiz");
});

quizRouter.get("/:id", async (req, res) => {
  await Quiz.findById(req.params.id)
    .populate("questions")
    .exec(function (err, quiz) {
      if (err) {
        console.log(err);
      } else {
        res.render("adminUI/showQuiz", { quiz: quiz });
      }
    });
});
quizRouter.post("/", verify, async (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;
  // var startTime = new Date(req.body.start);
  // var endTime = new Date(req.body.end);

  const newQuiz = new Quiz({
    name: req.body.name,
    slot: req.body.slot,
    reward: req.body.reward,
    correct_score: req.body.correct_score,
    incorrect_score: req.body.incorrect_score,
    date: today,
    startTime: req.body.start,
    endTime: req.body.end,
    minutes: req.body.minutes,
    seconds: req.body.seconds,
  });

  try {
    const savedQuiz = await newQuiz.save();
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

quizRouter.put("/:id", async (req, res) => {
  var newData = {
    name: req.body.name,
    slot: req.body.slot,
    reward: req.body.reward,
    correct_score: req.body.correct_score,
    incorrect_score: req.body.incorrect_score,
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
  await Quiz.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log("PROBLEM!");
    } else {
      res.redirect("/quiz/page/1");
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
