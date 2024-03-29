const express = require("express");
const userRouter = express.Router();
const verify = require("./verifyToken");
const User = require("../models/user");
const Subscription = require("../models/subscription");
const Response = require("../models/response");
const Quiz = require("../models/quiz");
const { SubscriptionPage } = require("twilio/lib/rest/events/v1/subscription");
const multer = require("multer");
const multerS3 = require("multer-s3");
var upload = multer({ dest: "uploads/" });
var fs = require("fs");
const aws = require("aws-sdk");
const { urlToHttpOptions } = require("http");
const feedEndpoint = new aws.Endpoint("ams3.digitaloceanspaces.com/feed");
aws.config.update({
  accessKeyId: "AKHJVLMXHVD6T5YWQ4PF",
  secretAccessKey: "dc5BXjf/zC1ryGMC4TzxUnQLYsJWPIjQS73kHJx+yf0",
  region: "ams3",
});
const uploadFeedS3 = new aws.S3({
  endpoint: feedEndpoint,
});

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
  console.log("user udpated");
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

// userRouter.get("/", async (req, res) => {
//   await User.find({ role: { $ne: "0" } }, (err, allUser) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("adminUI/allUser", {
//         allUser: allUser,
//       });
//     }
//   });
// });
//Get all users with paginatiion
userRouter.get("/page/:index", verify, async (req, res) => {
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
      var pages = parseInt(userCount / 10);
      var add = userCount % 10;
      if (add > 0) {
        pages++;
      }

      var userArray = [];
      index = parseInt(req.params.index);
      for (i = index * 10 - 10; i < index * 10; i++) {
        if (users[i]) {
          userArray.push(users[i]);
        } else {
          break;
        }
      }

      res.render("adminUI/newUserTable", {
        allUser: userArray,
        next: index + 1,
        prev: index - 1,
        userCount: userCount,
        pages: pages,
      });
    }
  });
});
userRouter.post("/", [verify, upload.single("upload")], async (req, res) => {
  var email = req.body.username + "@gmail.com";
  let url = "";

  if (req.file) {
    var name = req.file.originalname.split(".");
    var fileName = name[name.length - 1];
    var src = fs.createReadStream(req.file.path);
    var date = Date.now();
    var dest = fs.createWriteStream("./uploads/" + date + "." + fileName);
    src.pipe(dest);
    console.log("file uploaded");
    src.on("end", function () {
      fs.unlinkSync(req.file.path);
      url = "https://quizaddaplus.tk/upload/" + date + "." + fileName;
      var newUser = {
        name: req.body.name,
        email: email,
        reward: req.body.reward,
        photoUrl: url,
        username: req.body.username,
        role: "3",
      };
      var user = new User(newUser);
      user.save((err, user) => {
        if (err) {
          console.log(err);
        } else {
          const newResponse = {
            correct: "10",
            wrong: "0",
            userRole: "3",
            user: user._id,
            quiz: req.body.quiz,
            reward: req.body.reward,
            score: parseInt(req.body.score),
            paid: true,
          };
          var response = new Response(newResponse);
          response.save((err, response) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/user/page/1");
            }
          });
        }
      });
    });
    src.on("error", function (err) {
      if (err) res.json("Something went wrong!");
    });
  }
  else {
    var newUser = {
      name: req.body.name,
      email: email,
      reward: req.body.reward,
      username: req.body.username,
      role: "3",
    };
    User.create(newUser, async (err, user) => {
      if (err) {
        console.log(err);
      } else {
        const newResponse = {
          correct: "10",
          wrong: "0",
          userRole: "3",
          user: user._id,
          quiz: req.body.quiz._id,
          reward: req.body.reward,
          score: parseInt(req.body.score),
          paid: true,
        };
        var response = new Response(newResponse);
        response.save((err, response) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/user/page/1");
          }
        });
      }
    });
  }

});

userRouter.get("/add", verify, async (req, res) => {
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

userRouter.delete("/:id", async (req, res) => {
  console.log("delete");
  console.log(req.params.id);
  await User.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      Response.find({ user: req.params.id }).exec((err, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(response);
          Response.findByIdAndDelete(response[0]._id, (err, response) => {
            if (err) {
              console.log(err);
            } else {
              res.redirect("/user/page/1");
            }
          });
        }
      });
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

module.exports = userRouter;
