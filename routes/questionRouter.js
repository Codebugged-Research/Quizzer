const express = require("express");
const questionRouter = express.Router();
let Quiz = require("../models/quiz");

questionRouter.get("/", async (req, res) => {
  // console.log('get all questions')
  Quiz.find({}, (err, allCampgrounds) => {
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

questionRouter.post("/add", async (req, res) => {
  // console.log('add product')
  const name = req.body.name;
  const desc = req.body.description;
  const duration = req.body.duration;
  const newQuiz = {
    name: name,
    description: desc,
    duration: duration,
  };

  await Quiz.create(newQuiz, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/dashboard");
    }
  });
  res.status(201).json(question);
});

questionRouter.post("/:id/edit", async (req, res) => {
  Quiz.findById(req.params.id, (err, foundQuiz) => {
    res.render("quiz/edit", { quiz: foundQuiz });
  });
});

questionRouter.post("/update/:id", async (req, res) => {
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
