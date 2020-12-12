const express = require("express");
const userRouter = express.Router();
const verify = require("./verifyToken");
const User = require("../models/user");

//getalluser
//getuserbyid
//updateuserbyid
userRouter.get("/getAllUser", async (req, res) => {
  await User.find({ role: { $ne: "0" } }, (err, allUser) => {
    if(err){
      console.log(err);
      res.status(400).send(err);
    }else{
      res.send(allUser);
    }
  });
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
userRouter.post("/", verify, async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    reward: req.body.reward,
    image: req.body.image,
    role: "3",
  });
  try {
    const savedUser = newUser.save();
    res.redirect("/user");
  } catch (err) {
    res.status(400).send(err);
  }
});
userRouter.get("/add", (req, res) => {
  res.render("adminUI/createUser");
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
module.exports = userRouter;
