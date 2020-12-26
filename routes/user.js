const express = require("express");
const userRouter = express.Router();
const verify = require("./verifyToken");
const User = require("../models/user");
const Subscription = require("../models/subscription");
const Response = require("../models/response");
const Quiz = require("../models/quiz");
const { SubscriptionPage } = require("twilio/lib/rest/events/v1/subscription");

userRouter.get("/allUser", async (req, res) => {
  await User.find({ role: { $ne: "0" } }, (err, allUser) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(allUser);
    }
  });
});
userRouter.get("/get/:id", async (req, res) => {
  await User.findById(req.params.id)
    .populate("subscription")
    .exec(function (err, user) {
      if (err) {
        console.log(err);
      } else {
        res.json(user);
      }
    });
});
userRouter.put("/update/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { $set: req.body }).exec(
    (err, user) => {
      if (err) {
        console.log(err);
      } else {
        res.json({ message: "Succesfully Updated" });
      }
    }
  );
});

userRouter.get("/", async (req, res) => {
  await User.find({ role: { $ne: "0" } }, (err, allUser) => {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/allUser", {
        allUser: allUser,
      });
    }
  });
});
//Get all users with paginatiion
userRouter.get("/page/:index", async (req, res) => {
  var i, j;
  await User.find({ role: { $ne: "0" } }, (err, allUsers) => {
    if (err) {
      console.log(err);
    } else {
      var userCount = 0;
      var users = [];
      allUsers.forEach(function (user) {
        users.push(user);
        userCount++;
      });

      var userArray = [];
      index = parseInt(req.params.index);
      for (i = index * 5 - 5; i < index * 5; i++) {
        userArray.push(users[i]);
      }

      res.render("adminUI/allUser", {
        allUser: userArray,
        next: index + 1,
        prev: index - 1,
        userCount: userCount,
      });
    }
  });
});
userRouter.post("/", verify, async (req, res) => {
  var bodyName = req.body.email.split("@");
  var username = bodyName[0];
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    reward: req.body.reward,
    image: req.body.image,
    username: username,
    role: "3",
  };

  await User.create(newUser, async (err, user) => {
    if (err) {
      console.log(err);
    } else {
      await Quiz.findById(req.body.quiz).exec(async (err, quiz) => {
        if (err) {
          console.log(err);
        } else {
          console.log(quiz.name);
          const newResponse = {
            correct: "10",
            wrong: "0",
            userRole: "3",
            user: user._id,
            quiz: quiz._id,
            score: req.body.score,
            paid: true,
          };
          await Response.create(newResponse, (err, response) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/user");
            }
          });
        }
      });
    }
  });
});

userRouter.get("/add", async (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;
  await Quiz.find({ date: today }).exec((err, allQuiz) => {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/createUser", { allQuiz: allQuiz });
    }
  });
});

userRouter.get("/:id", async (req, res) => {
  await User.findById(req.params.id)
    .populate("subscription")
    .exec(function (err, user) {
      if (err) {
        console.log(err);
      } else {
        res.render("adminUI/showUser", { user: user });
      }
    });
});
userRouter.get("/:id/edit", verify, async (req, res) => {
  await User.findById(req.params.id, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      res.render("adminUI/editUser", { user: foundUser });
    }
  });
});
userRouter.put("/:id", async (req, res) => {
  var newData = {
    name: req.body.name,
    email: req.body.email,
    reward: req.body.reward,
    image: req.body.image,
  };
  await User.findByIdAndUpdate(
    req.params.id,
    { $set: newData },
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/user/" + user._id);
      }
    }
  );
});
// userRouter.patch("/:id", async (req, res) => {
//   await User.findById(req.params.id).exec(async (err, user) => {
//     if (err) {
//       res.status(400).send(err);
//     } else {
//       var buyer = {
//         id: user._id,
//         username: user.name,
//       };
//       var newSub = { buyer: buyer };

//       await Subscription.create(newSub, async (err, subscription) => {
//         if (err) {
//           console.log(err);
//         } else {
//           await subscription.save();
//           var newData = {
//             subscription: subscription,
//             role: "2",
//           };
//           await User.findByIdAndUpdate(
//             req.params.id,
//             { $set: newData },
//             function (err, user) {
//               if (err) {
//                 console.log(err);
//               } else {
//                 res.redirect("/user/" + user._id);
//               }
//             }
//           );
//         }
//       });
//     }
//   });
// });

module.exports = userRouter;
