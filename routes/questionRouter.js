const express = require("express");
const questionRouter = express.Router({ mergeParams: true });
const verify = require("./verifyToken");
var Quiz = require("../models/quiz");
var Question = require("../models/question");

questionRouter.get("/add", verify, async (req, res) => {
  console.log(req.params.id);
  await Quiz.findById(req.params.id, function (err, quiz) {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/questionsCreate", { quiz: quiz });
    }
  });
});
questionRouter.post("/", verify, async (req, res) => {
  let desc = req.body.description;
  let options = [
    req.body.option1,
    req.body.option2,
    req.body.option3,
    req.body.option4,
  ];

  let answer = req.body.answer;
  let newQuestion = {
    description: desc,
    options: options,
    answer: answer,
  };
  await Quiz.findById(req.params.id, async (err, quiz) => {
    if (err) {
      console.log(err);
      res.redirect("/quiz");
    } else {
      await Question.create(newQuestion, async (err, question) => {
        if (err) {
          console.log(err);
        } else {
          await question.save();
          quiz.questions.push(question);
          await quiz.save();
          res.redirect("/quiz/" + quiz._id);
        }
      });
    }
  });
});
questionRouter.get("/:questionId/edit", verify, async (req, res) => {
  // find campground by id
  await Question.findById(req.params.questionId, (err, question) => {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/editQuestion", {
        quiz_id: req.params.id,
        question: question,
      });
    }
  });
});

questionRouter.put("/:questionId", async (req, res) => {
  var newData = {
    description: req.body.description,
    options: [
      req.body.option1,
      req.body.option2,
      req.body.option3,
      req.body.option4,
    ],
    answer: req.body.answer,
  };
  await Question.findByIdAndUpdate(
    req.params.questionId,
    //To be modified
    { $set: newData },
    (err, question) => {
      if (err) {
        res.render("edit");
      } else {
        res.redirect("/quiz/" + req.params.id);
      }
    }
  );
});

questionRouter.delete("/:questionId", verify, async (req, res) => {
  await Question.findByIdAndRemove(req.params.questionId, function (err) {
    if (err) {
      console.log("PROBLEM!");
    } else {
      res.redirect("/quiz/" + req.params.id);
    }
  });
});

module.exports = questionRouter;
