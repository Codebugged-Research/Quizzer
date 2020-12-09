const express = require("express");
const questionRouter = express.Router();
const verify = require("./verifyToken");
let Quiz = require("../models/quiz");
let Question = require("../models/question");

questionRouter.get("/", async (req, res) => {
  // console.log('get all questions')
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
questionRouter.get("/add", async (req, res) => {
  res.render("adminUI/create-quiz");
});
questionRouter.get("/:id", async (req, res) => {
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

questionRouter.post("/", verify, async (req, res) => {
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
questionRouter.get("/:id/questions/add", async (req, res) => {
  await Quiz.findById(req.params.id, async (err, quiz) => {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/questionsCreate", { quiz: quiz });
    }
  });
});
questionRouter.post("/:id/questions/", verify, async (req, res) => {
  await Quiz.findById(req.params.id, async (err, quiz) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      await Question.create(req.body.question, function (err, question) {
        if (err) {
          console.log(err);
        } else {
          question.options = [
            req.body.option1,
            req.body.option2,
            req.body.option3,
            req.body.option4,
          ];
          question.save();
          quiz.questions.push(question);
          quiz.save();
          res.redirect(quiz._id);
        }
      });
    }
  });
});
// questionRouter.post("/add", async (req, res) => {
//   // console.log('add product')
//   let desc = req.body.description;
//   let options = [
//   req.body.option1,
//   req.body.option2,
//   req.body.option3,
//   req.body.option4,
// ];

//   let correct = req.body.answer;
//   let newQuestion = {
//     description: desc,
//     options: options,
//     answer: correct,
//   };

//   await Question.create(newQuestion, (err, newlyCreated) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect("/admin");
//     }
//   });
// });
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
