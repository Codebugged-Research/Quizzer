const express = require("express");
const quizRouter = express.Router();
const verify = require("./verifyToken");
let Quiz = require("../models/quiz");
let Question = require("../models/question");
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
quizRouter.get("/add", async (req, res) => {
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
  const name = req.body.name;
  const slot = req.body.slot;
  const reward = req.body.reward;
  const newQuiz = {
    name: name,
    slot: slot,
    reward: reward,
  };

  await Quiz.create(newQuiz, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("quiz");
    }
  });
});
//Edit Quiz
quizRouter.get("/:id/edit", verify, async (req, res) => {
  console.log("IN EDIT!");
  //find the campground with provided ID
  await Quiz.findById(req.params.id, (err, foundQuiz) => {
    if (err) {
      console.log(err);
    } else {
      //render show template with that campground
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

module.exports = quizRouter;
