const express = require("express");
const userRouter = express.Router();
const verify = require("./verifyToken");
const User = require("../models/user");
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
userRouter.get("/:id", async (req, res) => {
  await User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.render("adminUI/showUser", { user: user });
    }
  });
});
// Create Dummy User
userRouter.get("/add", async (req, res) => {
  res.render("adminUI/createUser");
});
userRouter.post("/", verify, async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const reward = req.body.reward;
  const image = req.body.image;
  const role = "3";
  const newUser = {
    name: name,
    email: email,
    reward: reward,
    image: image,
    role: role,
  };

  await User.create(newUser, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("user");
    }
  });
});
// Edit Dummy User
userRouter.get("/:id/edit", verify, async (req, res) => {
  console.log("IN EDIT!");
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
module.exports = userRouter;
