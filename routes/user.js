const express = require("express");
const userRouter = express.Router();
const verify = require("./verifyToken");
const User = require("../models/user");
const Subscription = require("../models/subscription");
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
userRouter.patch("/:id", async (req, res) => {
  await User.findById(req.params.id).exec(async (err, user) => {
    if (err) {
      res.status(400).send(err);
    } else {
      var buyer = {
        id: user._id,
        username: user.name,
      };
      var newSub = { buyer: buyer };

      await Subscription.create(newSub, async (err, subscription) => {
        if (err) {
          console.log(err);
        } else {
          await subscription.save();
          var newData = {
            subscription: subscription,
            role: "2",
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
        }
      });
    }
  });
});

module.exports = userRouter;
