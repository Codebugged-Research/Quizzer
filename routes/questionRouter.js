const express = require("express");
const questionRouter = express.Router();
let Quiz = require("../models/quiz");
let Question = require("../models/question");

questionRouter.get("/", async (req, res) => {
  // console.log('get all questions')
  Quiz.find({}, (err, allquestions) => {
    if (err) {
      console.log(err);
    } else {
      res.render("allquestions", {
        questions: allQuestions,
      });
    }
  });
  res.status(200).json(questions);
});
questionRouter.get("/add", async (req, res) => {
  res.render("adminUI/questionsCreate");
});
questionRouter.post("/add", async (req, res) => {
  // console.log('add product')
  let desc = req.body.description;
  let options = [
    req.body.option1,
    req.body.option2,
    req.body.option3,
    req.body.option4,
  ];

  let correct = req.body.answer;
  let newQuestion = {
    description: desc,
    options: options,
    answer: correct,
  };

  await Question.create(newQuestion, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/admin");
    }
  });
});
questionRouter.get("/:quiz_id/questions", async (req, res) => {
  res.render("adminUI/allquestions");
});

questionRouter.get(
  "/:quiz_id/questions/:question_id/edit",
  async (req, res) => {
    Question.findById(req.params.id, (err, foundQuestion) => {
      res.render("adminUI/edit_question", { question: foundQuestion });
    });
  }
);

questionRouter.post("/:id", async (req, res) => {
  // console.log('get update product')
  // console.log(req.body)
  await Quiz.findByIdAndUpdate(
    req.params.id,
    req.body.question,
    (err, updatedquiz) => {
      if (err) {
        res.redirect("/dashboard");
      } else {
        res.redirect("/dashboard/" + req.params.id);
      }
    }
  );
  res.status(201).send("Success");
});

questionRouter.delete("/delete/:id", async (req, res) => {
  Quiz.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/dashboard");
    }
  });
});

questionRouter.get("/details/:id", async (req, res) => {
  // console.log('get question by id')
  const id = req.params.id;
  const question = await getquestionByID(id);
  res.json(question);
});
//EJS Template for this route to be added
questionRouter.get("/:id", async (req, res) => {
  await Quiz.findById(req.params.id, (err, foundQuiz) => {
    res.render("", { quiz: foundQuiz });
  });
});

module.exports = questionRouter;
