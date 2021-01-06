const express = require("express");
const questionRouter = express.Router({ mergeParams: true });
const verify = require("./verifyToken");
var Quiz = require("../models/quiz");
var Question = require("../models/question");

questionRouter.get("/add", verify, async (req, res) => {
  await Quiz.findById(req.params.id)
    .populate("questions")
    .exec((err, quiz) => {
      if (err) {
        console.log(err);
      } else {
        var qCount = 0;
        quiz.questions.forEach(function (question) {
          qCount++;
        });

        res.render("adminUI/questionsCreate", { quiz: quiz, qCount: qCount });
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
          res.redirect("/quiz/" + quiz._id + "/questions/add");
        }
      });
    }
  });
});
questionRouter.get("/qz/:questionId/edit", verify, async (req, res) => {
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
questionRouter.get("/qn/:questionId/edit", verify, async (req, res) => {
  await Question.findById(req.params.questionId, (err, question) => {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/questionEdit", {
        quiz_id: req.params.id,
        question: question,
      });
    }
  });
});

questionRouter.put("/qz/:questionId", verify, async (req, res) => {
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
questionRouter.put("/qn/:questionId", verify, async (req, res) => {
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
        res.redirect("/quiz/" + req.params.id + "/questions/add");
      }
    }
  );
});

questionRouter.delete("/:from/:questionId", verify, async (req, res) => {
  await Question.findByIdAndRemove(req.params.questionId, function (err) {
    if (err) {
      console.log("PROBLEM!");
    } else {
      if (req.params.from === "qn") {
        res.redirect("/quiz/" + req.params.id + "/questions/add");
      } else {
        res.redirect("/quiz/" + req.params.id);
      }
    }
  });
});

module.exports = questionRouter;
