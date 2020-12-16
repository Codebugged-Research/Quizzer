//send response from app

const express = require("express");
const responseRouter = express.Router({ mergeParams: true });
const Response = require("../models/response");
const verify = require("./verifyToken");

responseRouter.post("/submit", async (req, res) => {
  var response = new Response(req.body);
  try {
    await response.save();
    res.json({ message: "Succesfully Submitted" });
  } catch (error) {
    res.status(400).send(error);
  }
});
responseRouter.get("/", async (req, res) => {
  await Quiz.findById(req.params.id)
    .populate("responses")
    .exec(function (err, quiz) {
      if (err) {
        console.log(err);
      } else {
        res.render("adminUI/showResponse", { quiz: quiz });
      }
    });
});

// responseRouter.post("/", verify, async (req, res) => {
//   await Quiz.findById(req.params.id, async (err, quiz) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/quiz");
//     } else {
//       var correct = req.body.correct;
//       var reward = "";
//       var wrong = req.body.wrong;
//       if (wrong === "0") {
//         reward = quiz.reward;
//       }
//       let newResponse = {
//         correct: correct,
//         wrong: wrong,
//         reward: reward,
//       };
//       await Response.create(newResponse, async (err, response) => {
//         if (err) {
//           console.log(err);
//         } else {
//           await response.save();
//           quiz.responses.push(response);
//           await quiz.save();
//           res.redirect("/quiz/" + quiz._id);
//         }
//       });
//     }
//   });
// });

// responseRouter.post("/", async(req,res) => {
//   await Quiz.findById(req.params.id, async(err,quiz) => {
//     if(err) {
//       console.log(err)
//       res.redirect("/quiz");
//     } else {
//       await User.findById(req.body.id, async(err,user) => {
//         if(err) {
//           console.log(err)
//         } else {
//           var correct = req.body.correct;
//           var reward = "";
//           var wrong = req.body.wrong;
//           if (wrong === "0") {
//             reward = quiz.reward;
//           }
//           var quizRes = {
//             id: quiz._id,
//             name: quiz.name
//           },
//           var userRes = {
//             id: user._id,
//             username: user.name
//           }
//           let newResponse = {
//             correct: correct,
//             wrong: wrong,
//             reward: reward,
//             quiz: quizRes,
//             author: userRes
//           };
//           await Response.create(newResponse, async (err,response) => {
//             if(err) {
//               console.log(err)
//             } else {
//               try {
//                 const savedResponse = await response.save();
//                 res.redirect("/quiz");
//               } catch (err) {
//                 res.status(400).send(err)
//               }
//             }
//           })
//         }
//       })
//     }
//   })
// })
module.exports = responseRouter;
