const express = require("express");
const quizRouter = express.Router();
const verify = require("./verifyToken");
let Quiz = require("../models/quiz");
let Question = require("../models/question");
let Response = require("../models/response");

//All Quiz list
quizRouter.get("/", async (req, res) => {
  await Quiz.find({}, (err, allQuiz) => {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/allQuiz", {
        allQuiz: allQuiz,
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
  const newQuiz = new Quiz({
    name: req.body.name,
    slot: req.body.slot,
    reward: req.body.reward,
    correct_score: req.body.correct_score,
    incorrect_score: req.body.incorrect_score,
    date: today,
  });
  try {
    const savedQuiz = await newQuiz.save();
    res.redirect("quiz");
  } catch (err) {
    res.status(400).send(err);
  }
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
      res.redirect("/quiz/");
    }
  });
});
//Quiz Leaderboard
quizRouter.get("/:id/leaderboard", async (req, res) => {
  await Response.find({ quiz: req.params.id })
    .populate("user")
    .populate("quiz")
    .sort({ reward: -1 })
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

//App Quiz Route
quizRouter.get("/app/quiz", async (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "/" + mm + "/" + yyyy;
  console.log(today);
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
